var History = require('../models/History')
var stockScraper = require('../webscrapers/StockScraper');

exports.getAssetHistory = function (req, res) {
    req.query.ast_id = parseInt(req.params.ast_id);
    req.query.usr_id = req.usr_id
    History.getAssetHistory(req.query, function (err, histories) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({histories: histories});
      }
    })
}

exports.initializeAssetHistory = function (asset) {
    checkHistoryWithCodeExists(asset.code).then(historyExists => {
        if(!historyExists) {
            var ytd = new Date();
            ytd.setFullYear(ytd.getFullYear() - 1);

            getDataOfAsset = asset.ast_type === "stock" ? stockScraper.getDataOfTicker : stockScraper.getDataOfCoin 
        
            getDataOfAsset(asset.code, ytd).then(ytd_data => {
                ytd_data.map(item => {
                    item.date = new Date(item.date * 1000).toISOString().slice(0, 10).replace('T', ' ');
                    return item;
                });
                sql_histories = ytd_data.map(item => (`('${asset.code}', '${item.date}', ${item.close})`))
                History.addHistories(sql_histories, function (err, histories) {
                    console.log("added "+ histories.affectedRows + " histories");
                });
            });
        }
    });
}

exports.updateAssetHistory = function (asset) {
    console.log("updating asset history");
    getDataOfAsset = asset.ast_type === "stock" ? stockScraper.getDataOfTicker : stockScraper.getDataOfCoin;
    getDataOfAsset(asset.code, asset.last_date).then(data => {
        data.map(item => {
            item.date = new Date(item.date * 1000).toISOString().slice(0, 10).replace('T', ' ');
            return item;
        });
        sql_histories = data.map(item => (`('${asset.code}', '${item.date}', ${item.close})`))
        History.addHistories(sql_histories, function (err, histories) {
            console.log("added "+ histories.affectedRows + " histories");
        });
    });
}

function checkHistoryWithCodeExists(code) {
    return new Promise((resolve, reject) => {
        History.getHistoryByCode(code, function(err, res) {
            resolve(res.length > 0);
        });
    });
}
