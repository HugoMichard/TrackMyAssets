var Dashboard = require('../models/Dashboard')


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
  console.log("Getting summary")

  Promise.all([getValueKDaysAgo(req.usr_id, 0), getValueKDaysAgo(req.usr_id, 1), getValueKDaysAgo(req.usr_id, 7), getValueKDaysAgo(req.usr_id, 30), getValueKDaysAgo(req.usr_id, 365)])
    .catch(err => {
      res.status(500).send({message: err.message});
    })
    .then(values => {
      res.status(200).send({state: "Success", dayValues: values});
    });
}
