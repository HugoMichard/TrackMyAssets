var Dashboard = require('../models/Dashboard')
var portfolio = require('./PortfolioController')
var Portfolio = require('../models/Portfolio')
var dateHelper = require('../helpers/DateHelper')

const getValueKDaysAgo = function(usr_id, days_ago) {
  return new Promise(function(resolve, reject) {
    const params = {
      usr_id: usr_id, 
      days_ago: days_ago
    }
    Dashboard.valuesKDaysAgo(params, function (err, value) {
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

  Portfolio.getPorfolioValueHistory({ usr_id: req.usr_id, start_date: start_date }, function (err, values) {
      if (err) {
          res.status(500).send({message: err.message});
      }
      res.status(200).send({state: "Success", values: values});
  });
}