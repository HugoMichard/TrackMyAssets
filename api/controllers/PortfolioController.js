var Portfolio = require('../models/Portfolio')
var History = require('../models/History')
var Dex = require('../models/Dex')
var history = require('./HistoryController')
var dateHelper = require('../helpers/DateHelper');
var scraperHelper = require('../helpers/ScraperHelper');
const User = require('../models/User');
const order = require('./OrderController');


function getPortfolioStartDate(usr_id) {
    return new Promise(function(resolve, reject) {
      Portfolio.getPortfolioStartDate({usr_id: usr_id}, function (err, start_date) {
        if (err) {
          reject(err)
        }
        if(start_date.length > 0) {
          resolve(start_date[0].start_date)
        } else {
          resolve("2020-01-01")
        }
      })
    });
  }
exports.getPortfolioStartDate = getPortfolioStartDate;

exports.refresh = async function(req, res) {
  console.log("Refreshing tokens");
  const updateCoinList = await scraperHelper.updateCoinList();
  console.log("Updated coin list");

  const assets = await new Promise(function(resolve, reject) {
    History.getLastHistoryOfUserCexAssets({usr_id: req.usr_id}, function (err, assets) {
      if (err) { reject(err) }
      resolve(assets)
    })
  });
  assets.forEach(a => {
    history.updateAssetHistory(a);
  });
  console.log("Updated assets");
  
  const dexAssets = await new Promise(function(resolve, reject) {
    Dex.getUserDexAssetsToUpdate({usr_id: req.usr_id}, function (err, dexAssets) {
      if (err) { reject(err) }
      resolve(dexAssets)
    })
  });
  history.updateDexAssetsHistory(dexAssets, req.usr_id);
  console.log("Update dex assets")
  res.status(200).send({state: "Success"});
  User.updateRefresh(req.usr_id);
}

async function rerunPortfolioHistory(usr_id, start_date, date_aggregation_fn) {
  const orderWithHistoryData = await order.getUserOrderDataWithHistory(usr_id)

  var portfolio = {};
  var aggregatedResultsByDate = [];
  var checkingDate = orderWithHistoryData[0].date;
  orderWithHistoryData.forEach(r => {
    // when changing date, run the aggregation by date function and update the date history is at
    if(checkingDate != r.date) {
      if(checkingDate >= start_date) {
        aggregatedResultsByDate.push(date_aggregation_fn(checkingDate, portfolio));
      }
      checkingDate = r.date;
    }
    // add the asset if it's new to the portfolio
    if(!portfolio[r.code]) {
      portfolio[r.code] = {"last_ord_id": 0, "quantity": 0, "vl": 0, "total_paid": 0, "execution_date": '1500-01-01', "rewards": 0}
    }
    var ast = portfolio[r.code];
    // if a new order was made on the asset
    if(ast.execution_date < r.execution_date) {
      const order_price = r.is_generated ? 0 : (r.quantity * r.paid) + r.fees
      ast.total_paid = ast.total_paid + order_price
      ast.quantity = ast.quantity + r.quantity
      ast.last_ord_id = r.ord_id
      ast.execution_date = r.execution_date
      ast.rewards = r.rewards
    }
    ast.vl = r.vl ? r.vl : r.paid;
    portfolio[r.code] = ast;
  })
  return aggregatedResultsByDate
}
exports.rerunPortfolioHistory=rerunPortfolioHistory

exports.getPlusValueHistory = async function(req, res) {
  const start_date = await dateHelper.translateStartDateQueryToStringDate(req.usr_id, req.query.portfolio_chart_start_date);
  var sum_portfolio_plus_value = function(date, portfolio) {
    return {
      "date": date,
      "price": Object.values(portfolio).map(e => ((e.quantity * e.vl) + e.rewards - e.total_paid)).reduce((a, b) => a + b)
    }
  }
  rerunPortfolioHistory(req.usr_id, start_date, sum_portfolio_plus_value).then(plusValues => {
    res.status(200).send({state: "Success", values: plusValues});
  })
}

exports.getInvestments = async function(req, res) {
  const group_date = 
    req.query.group_date === "yearly" ? "%Y" 
    : req.query.group_date === "monthly" ? "%Y-%m"
    : "%Y-%m-%d";
  const start_date = await getPortfolioStartDate(req.usr_id)
  
  Portfolio.getInvestments({ usr_id: req.usr_id, group_date: group_date, start_date: start_date }, function (err, values) {
      if (err) {
          res.status(500).send({message: err.message});
      }
      res.status(200).send({state: "Success", values: values});
  });
}

exports.getCumulativeInvestmentsWithValue = async function(req, res) {
  const start_date = await dateHelper.translateStartDateQueryToStringDate(req.usr_id, req.query.portfolio_start_date);

  var sum_investments_with_plus_value = function(date, portfolio) {
    return {
      "date": date,
      "cum_sum": Object.values(portfolio).map(e => e.total_paid).reduce((a, b) => a + b),
      "plus_value": Object.values(portfolio).map(e => ((e.quantity * e.vl) + e.rewards - e.total_paid)).reduce((a, b) => a + b)
    }
  }
  rerunPortfolioHistory(req.usr_id, start_date, sum_investments_with_plus_value).then(v => {
    res.status(200).send({state: "Success", values: v});
  })
}

function getPortfolioComposition(usr_id, group_by_key) {
  return new Promise(function(resolve, reject) {
    Portfolio.getPortfolioOrderDetails(usr_id, function (err, details) {
      if (err) {
        reject(err)
      }
      var portfolio = {};
      details.forEach(r => {
        const group_id = r[group_by_key + "_id"]
        // add the group if it's new to the portfolio
        if(!portfolio[group_id]) {
          portfolio[group_id] = {
            "name": r[group_by_key + "_name"],
            "color": r[group_by_key + "_color"],
            "assets": {}
          }
        }
        // add the asset if it's new to the portfolio
        if(!portfolio[group_id]["assets"][r.code]) {
          portfolio[group_id]["assets"][r.code] = {
            "quantity": 0, 
            "total_paid": 0, 
            "rewards": 0, 
            "ast_id": r.ast_id, 
            "code": r.code, 
            "ast_name": r.ast_name, 
            "ast_type": r.ast_type, 
            "duplicate_nbr": r.duplicate_nbr
          }
        }
        var ast = portfolio[group_id]["assets"][r.code];
        // if a new order was made on the asset
        const order_price = r.is_generated ? 0 : (r.quantity * r.paid) + r.fees
        ast.total_paid = ast.total_paid + order_price
        ast.quantity = ast.quantity + r.quantity
        ast.rewards = r.rewards
        portfolio[group_id]["assets"][r.code] = ast;
      })
      resolve(portfolio)
    })
  });
}
exports.getPortfolioComposition = getPortfolioComposition

exports.getInvestmentsSummary = async function(req, res) {
  const totalInvestmentsPromise = new Promise(function(resolve, reject) {
    Portfolio.getTotalInvestments({ usr_id: req.usr_id }, function (err, values) {
      if (err) {
        reject(err)
      }
      resolve(values)
    })
  });

  const totalPortfolioValuePromise = new Promise(function(resolve, reject) {
    Portfolio.getCurrentPortfolioValue({ usr_id: req.usr_id }, function (err, values) {
      if (err) {
        reject(err)
      }
      resolve(values)
    })
  });

  Promise.all([
    totalInvestmentsPromise,
    totalPortfolioValuePromise
  ])
  .catch(err => {
    res.status(500).send({message: err.message});
  })
  .then(values => {
    res.status(200).send({totalInvested: values[0][0].investment, totalWithdrawn: values[0][1].investment, totalPortfolioValue: values[1][0].value});
  });
}

exports.getProfitsRealised = async function(req, res) {
  const orderWithHistoryData = await order.getUserOrderDataWithHistory(req.usr_id)

  var portfolio = {};
  var profitsRealised = [];
  orderWithHistoryData.forEach(r => {
    // add the asset if it's new to the portfolio
    if(!portfolio[r.code]) {
      portfolio[r.code] = {"quantity": 0, "vl": 0, "total_paid": 0, "execution_date": '1500-01-01', "rewards": 0}
    }
    var ast = portfolio[r.code];
    // if a new order was made on the asset
    if(ast.execution_date < r.execution_date) {
      // if we are taking profits / losses
      if(r.quantity < 0) {
        const perf = (r.paid - (ast.total_paid / ast.quantity)) * -r.quantity;
        profitsRealised.push({
          "name": r.name,
          "code": r.code,
          "duplicate_nbr": r.duplicate_nbr,
          "ast_type": r.ast_type,
          "cat_id": r.cat_id,
          "cat_color": r.cat_color,
          "cat_name": r.cat_name,
          "quantity": -r.quantity,
          "average_paid": ast.total_paid / ast.quantity,
          "selling_price": r.paid,
          "perf": perf,
          "perf100": (perf / (ast.total_paid)) * 100
        })
      }
      const order_price = r.is_generated ? 0 : (r.quantity * r.paid) + r.fees
      ast.total_paid = ast.total_paid + order_price
      ast.quantity = ast.quantity + r.quantity
      ast.execution_date = r.execution_date
      ast.rewards = r.rewards
    }
    ast.vl = r.vl ? r.vl : r.paid;
    portfolio[r.code] = ast;
  })
  res.status(200).send({state: "Success", profits: profitsRealised});
}