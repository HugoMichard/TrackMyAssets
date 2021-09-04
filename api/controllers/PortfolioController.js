var Portfolio = require('../models/Portfolio')
var History = require('../models/History')
var history = require('./HistoryController')
var dateHelper = require('../helpers/DateHelper')


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
  const assets = await new Promise(function(resolve, reject) {
    History.getLastHistoryOfUserAssets({usr_id: req.usr_id}, function (err, assets) {
      if (err) { reject(err) }
      resolve(assets)
    })
  });
  assets.forEach(a => {
    history.updateAssetHistory(a);
  });
  res.status(200).send({state: "Success"});
}

exports.getPlusValueHistory = async function(req, res) {
  const start_date = await dateHelper.translateStartDateQueryToStringDate(req.usr_id, req.query.portfolio_chart_start_date);

  Portfolio.getPorfolioValueHistory({ usr_id: req.usr_id, start_date: start_date }, function (err, values) {
      if (err) {
          res.status(500).send({message: err.message});
      }
      res.status(200).send({state: "Success", values: values});
  });
}

const getPlusValueKDaysAgo = function(usr_id, days_ago) {
  return new Promise(function(resolve, reject) {
    const params = {
      usr_id: usr_id, 
      days_ago: days_ago
    }
    Portfolio.getPlusValueKDaysAgo(params, function (err, value) {
      if (err) {
        reject(err)
      }
      resolve(value[0].plus_value)
    })
  });
}

exports.getPlusValueSummary = async function (req, res) {
  const start_date = await getPortfolioStartDate(req.usr_id);
  const daysSinceStart = Math.floor((new Date().getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24)); 

  Promise.all([
      getPlusValueKDaysAgo(req.usr_id, 1), 
      getPlusValueKDaysAgo(req.usr_id, 2), 
      getPlusValueKDaysAgo(req.usr_id, 7), 
      getPlusValueKDaysAgo(req.usr_id, 30), 
      getPlusValueKDaysAgo(req.usr_id, 90), 
      getPlusValueKDaysAgo(req.usr_id, 365),
      getPlusValueKDaysAgo(req.usr_id, daysSinceStart)
    ])
    .catch(err => {
      res.status(500).send({message: err.message});
    })
    .then(values => {
      res.status(200).send({state: "Success", dayPlusValues: values});
    });
}

exports.getInvestments = async function(req, res) {
  const group_date = 
    req.query.group_date === "yearly" ? "%Y" 
    : req.query.group_date === "monthly" ? "%m-%Y"
    : "%d-%m-%Y";
  
  Portfolio.getInvestments({ usr_id: req.usr_id, group_date: group_date }, function (err, values) {
      if (err) {
          res.status(500).send({message: err.message});
      }
      res.status(200).send({state: "Success", values: values});
  });
}