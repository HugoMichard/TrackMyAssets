var History = require('../models/History')
var scraperHelper = require('../helpers/ScraperHelper');
var dateHelper = require('../helpers/DateHelper')

exports.getAssetHistory = function (req, res) {
    const start_date_string =
        req.query.start_date === "all" ? new Date('1970-01-01') 
        : req.query.start_date === "week" ? new Date().setDate(new Date().getDate() - 7)
        : req.query.start_date === "month" ? new Date().setMonth(new Date().getMonth() - 1)
        : new Date().setYear(new Date().getFullYear() - 1);

    const params = {
        ast_id: parseInt(req.query.ast_id),
        start_date: dateHelper.dateToStringDate(start_date_string),
        usr_id: req.usr_id
    } 

    History.getAssetHistory(params, function (err, histories) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({histories: histories});
      }
    })
}

var initializeAssetHistory = exports.initializeAssetHistory = function (asset) {
    console.log("initializing asset history");
    checkHistoryWithCodeExists(asset.code).then(historyExists => {
        if(!historyExists) {
            var ytd = new Date();
            ytd.setFullYear(ytd.getFullYear() - 1);
            ytd = new Date(ytd).toISOString().slice(0, 10).replace('T', ' ');

            getDataOfAsset = asset.ast_type === "stock" ? scraperHelper.getDataOfTicker : scraperHelper.getDataOfCoin 
        
            getDataOfAsset(asset.code, ytd).then(ytd_data => {
                if(ytd_data.length > 0) {
                    ytd_data.map(item => {
                        item.date = new Date(item.date * 1000).toISOString().slice(0, 10).replace('T', ' ');
                        return item;
                    });
                    sql_histories = ytd_data.map(item => (`('${asset.code}', '${item.date}', ${item.close})`))
                    History.addHistories(sql_histories, function (err, histories) {
                        console.log("added "+ histories.affectedRows + " histories");
                    });
                }
            });
        }
    });
}

exports.updateAssetHistory = function (asset) {
    console.log("updating asset history");
    checkHistoryWithCodeExists(asset.code).then(historyExists => {
        if(!historyExists) {
            initializeAssetHistory(asset);
        } else {
            getDataOfAsset = asset.ast_type === "stock" ? stockScraper.getDataOfTicker : stockScraper.getDataOfCoin;
            var from_date = new Date(asset.last_date);
            from_date.setDate(from_date.getDate() + 1);
            from_date =  new Date(from_date).toISOString().slice(0, 10).replace('T', ' ');
            getDataOfAsset(asset.code, from_date).then(data => {
                if(data.length > 0) {
                    data.map(item => {
                        item.date = new Date(item.date * 1000).toISOString().slice(0, 10).replace('T', ' ');
                        return item;
                    });
                    sql_histories = data.map(item => (`('${asset.code}', '${item.date}', ${item.close})`))
                    History.addHistories(sql_histories, function (err, histories) {
                        console.log("added "+ histories.affectedRows + " histories");
                    });
                }
            });
        }
    });
}

function checkHistoryWithCodeExists(code) {
    return new Promise((resolve, reject) => {
        History.getHistoryByCode(code, function(err, res) {
            resolve(res.length > 0);
        });
    });
}
