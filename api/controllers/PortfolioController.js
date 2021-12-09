var Portfolio = require('../models/Portfolio')
var History = require('../models/History')
var Dex = require('../models/Dex')
var history = require('./HistoryController')
var dateHelper = require('../helpers/DateHelper');
var scraperHelper = require('../helpers/ScraperHelper');
const User = require('../models/User');


function getPortfolioStartDate(usr_id) {
    return new Promise(function(resolve, reject) {
      Portfolio.getPortfolioStartDate({usr_id: usr_id}, function (err, start_date) {
        if (err) {
          reject(err)
        }
        resolve(start_date[0].start_date)
      })
    });
  }
exports.getPortfolioStartDate = getPortfolioStartDate;

exports.refresh = async function(req, res) {
  const updateCoinList = await scraperHelper.updateCoinList();
  
  const assets = await new Promise(function(resolve, reject) {
    History.getLastHistoryOfUserCexAssets({usr_id: req.usr_id}, function (err, assets) {
      if (err) { reject(err) }
      resolve(assets)
    })
  });
  assets.forEach(a => {
    history.updateAssetHistory(a);
  });
  
  const dexAssets = await new Promise(function(resolve, reject) {
    Dex.getUserDexAssetsToUpdate({usr_id: req.usr_id}, function (err, dexAssets) {
      if (err) { reject(err) }
      resolve(dexAssets)
    })
  });
  history.updateDexAssetsHistory(dexAssets, req.usr_id);
  res.status(200).send({state: "Success"});
  User.updateRefresh(req.usr_id);
}

function getPlusValueHistoryPromise(usr_id, start_date) {
  return new Promise(function(resolve, reject) {
    Portfolio.getPorfolioValueHistory({ usr_id: usr_id, start_date: start_date }, function (err, values) {
      if (err) {
        reject(err)
      }
      resolve(values)
    });
  });
}

exports.getPlusValueHistory = async function(req, res) {
  const start_date = await dateHelper.translateStartDateQueryToStringDate(req.usr_id, req.query.portfolio_chart_start_date);

  getPlusValueHistoryPromise(req.usr_id, start_date).then(values => {
    res.status(200).send({state: "Success", values: values});
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

function getCumulativeInvestments(usr_id, start_date) {
  return new Promise(function(resolve, reject) {
    Portfolio.getCumulativeInvestments({ usr_id: usr_id, start_date: start_date }, function (err, values) {
      if (err) {
        reject(err)
      }
      resolve(values)
    })
  });
}


exports.getCumulativeInvestmentsWithValue = async function(req, res) {
  const start_date = await dateHelper.translateStartDateQueryToStringDate(req.usr_id, req.query.portfolio_start_date);

  Promise.all([
    getCumulativeInvestments(req.usr_id, start_date), 
    getPlusValueHistoryPromise(req.usr_id, start_date)
  ])
  .catch(err => {
    res.status(500).send({message: err.message});
  })
  .then(values => {
    res.status(200).send({state: "Success", investments: values[0], value_history: values[1]});
  });
}


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

exports.getProfitsRealised = function(req, res) {
  Portfolio.getProfitsRealised(req.usr_id, function (err, profits) {
    if (err) {
        res.status(500).send({message: err.message});
    }
    res.status(200).send({state: "Success", profits: profits});
});
}