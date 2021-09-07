var portfolio = require('../controllers/PortfolioController')

function dateToStringDate(_date) {
    return new Date(_date).toISOString().slice(0, 10).replace('T', ' ');
}
exports.dateToStringDate = dateToStringDate

async function getStartDateFromQuery(usr_id, date_query) {
    return new Promise(function(resolve, reject) {
        if(date_query === "month") {
            resolve(new Date().setMonth(new Date().getMonth() - 1));
        } else {
            if(date_query === "week") {
                resolve(new Date().setDate(new Date().getDate() - 7));
            } else {
                if(date_query === "all") {
                    portfolio.getPortfolioStartDate(usr_id).then(res => resolve(res));
                } else {
                    resolve(new Date().setYear(new Date().getFullYear() - 1));
                }
            }
        }
    });
}

async function translateStartDateQueryToStringDate(usr_id, start_date_query) {
    return new Promise(function(resolve, reject) {
        getStartDateFromQuery(usr_id, start_date_query).then(start_date => {
            resolve(dateToStringDate(start_date));
        })
    });
  }
exports.translateStartDateQueryToStringDate = translateStartDateQueryToStringDate;