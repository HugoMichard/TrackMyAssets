var Portfolio = require('../models/Portfolio')
var portfolio = require('./PortfolioController')
var dateHelper = require('../helpers/DateHelper')

const getValueKDaysAgo = function(usr_id, days_ago) {
  return new Promise(function(resolve, reject) {
    const params = {
      usr_id: usr_id, 
      days_ago: days_ago
    }
    Portfolio.valuesKDaysAgo(params, function (err, value) {
      if (err) {
        reject(err)
      }
      resolve(value[0].value)
    })
  });
}

exports.summary = async function (req, res) {
  Promise.all([
    getValueKDaysAgo(req.usr_id, 1), 
    getValueKDaysAgo(req.usr_id, 2), 
    getValueKDaysAgo(req.usr_id, 8), 
    getValueKDaysAgo(req.usr_id, 30), 
    getValueKDaysAgo(req.usr_id, 365)
    ])
    .catch(err => {
      res.status(500).send({message: err.message});
    })
    .then(values => {
      res.status(200).send({state: "Success", dayValues: values});
    });
}

exports.getPortfolioValueHistory = async function(req, res) {
  const start_date = await dateHelper.translateStartDateQueryToStringDate(req.usr_id, req.query.portfolio_chart_start_date);
  var sum_portfolio_value = function(date, portfolio) {
    return {
      "date": date,
      "price": Object.values(portfolio).map(e => ((e.quantity * e.vl) + e.rewards)).reduce((a, b) => a + b)
    }
  }
  portfolio.rerunPortfolioHistory(req.usr_id, start_date, sum_portfolio_value).then(values => {
    res.status(200).send({state: "Success", values: values});
  })
}