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
    if(asset.ast_type === "fix") {
        initializeFixAssetHistory(asset)
    } else {
        checkHistoryWithCodeExists(asset.code).then(lastHistory => {
            if(lastHistory.length === 0) {
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
}

exports.updateAssetHistory = function (asset) {
    console.log("updating asset history");
    checkHistoryWithCodeExists(asset.code).then(lastHistory => {
        if(lastHistory.length === 0) {
            initializeAssetHistory(asset);
        } else {
            var from_date = new Date(lastHistory[0].hst_date);
            from_date.setDate(from_date.getDate() + 1);
            from_date = from_date.toISOString().slice(0, 10).replace('T', ' ');
            asset.last_date = from_date
            if(asset.ast_type === "fix") {
                updateFixAssetHistory(asset)
            } else {
                getDataOfAsset = asset.ast_type === "stock" ? scraperHelper.getDataOfTicker : scraperHelper.getDataOfCoin;
                getDataOfAsset(asset.code, asset.last_date).then(data => {
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
        }
    });
}

function checkHistoryWithCodeExists(code) {
    return new Promise((resolve, reject) => {
        History.getHistoryByCode(code, function(err, res) {
            resolve(res);
        });
    });
}


function initializeFixAssetHistory(asset) {
    History.getRandomDatesUntilToday(function(err, random_dates) {
        sql_histories = random_dates.map(item => (`('${asset.code}', '${item.random_date}', ${asset.fix_vl})`))
        History.addHistories(sql_histories, function (err, histories) {
            console.log("added "+ histories.affectedRows + " histories");
        });
    })
}


function updateFixAssetHistory(asset) {
    History.modifyFixAssetVlHistory(asset, function(err, res) {});
    History.getRandomDatesFromDateUntilToday(asset.from_date, function(err, random_dates) {
        sql_histories = random_dates.map(item => (`('${asset.code}', '${item.random_date}', ${asset.fix_vl})`))
        History.addHistories(sql_histories, function (err, histories) {
            console.log("added "+ histories.affectedRows + " histories");
        });
    })
}