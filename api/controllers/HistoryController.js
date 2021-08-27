var History = require('../models/History')
var Asset = require('../models/Asset')
var stockScraper = require('../webscrapers/StockScraper');


exports.initializeAssetHistory = function (asset) {
    if(asset.type === "stock") {
        initializeStockHistory(asset);
    } else {
        initializeCoinHistory(asset);
    }
}

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


function initializeStockHistory(asset) {
    checkTickerHistoryExists(asset.ticker).then(tickerHistoryExists => {
        if(!tickerHistoryExists) {
            var ytd = new Date();
            ytd.setFullYear(ytd.getFullYear() - 1);
        
            stockScraper.getDataOfTicker(asset.ticker, ytd).then(ytd_data => {
                formatted_data = ytd_data.map(item => {
                    item.date = new Date(item.date * 1000).toISOString().slice(0, 10).replace('T', ' ');
                    return item;
                });
        
                sql_histories = ytd_data.map(item => (`('${asset.ticker}', '${item.date}', ${item.close})`))
                History.addHistories(sql_histories, function (err, histories) {
                    console.log("added "+ histories.affectedRows + " histories");
                });
            });
        }
    });
}

function checkTickerHistoryExists(ticker) {
    return new Promise((resolve, reject) => {
        History.getTickerHistory(ticker, function(err, res) {
            resolve(res.length > 0);
        });
    });
}

function initializeCoinHistory(asset) {
    console.log("TODO: initialize coin history");
}
