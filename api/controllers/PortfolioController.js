var Portfolio = require('../models/Portfolio')


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


exports.getPortfolioValueHistory = async function(req, res) {

    const start_date_query = req.query.portfolio_chart_start_date
    const portfolio_chart_start = 
        start_date_query === "month" ? new Date().setMonth(new Date().getMonth() - 1)
        : start_date_query === "week" ? new Date().setDate(new Date().getDate() - 7)
        : start_date_query === "all" ? await getPortfolioStartDate(req.usr_id)
        : new Date().setYear(new Date().getFullYear() - 1);

    const portfolio_chart_start_date = new Date(portfolio_chart_start).toISOString().slice(0, 10).replace('T', ' ');
    console.log(portfolio_chart_start_date);

    Portfolio.getPorfolioValueHistory({ usr_id: req.usr_id, start_date: portfolio_chart_start_date }, function (err, values) {
        if (err) {
            res.status(500).send({message: err.message});
        }
        res.status(200).send({state: "Success", values: values});
    });
}