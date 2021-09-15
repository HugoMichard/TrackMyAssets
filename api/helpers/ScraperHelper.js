var coinScraper = require('../webscrapers/CoinScraper')
var stockScraper = require('../webscrapers/StockScraper');

exports.getDataOfTicker = function (ticker, from_date) {
    return stockScraper.getPricesFromYahooFinance(ticker, from_date);
}

exports.getDataOfCoin = function(coin, from_date) {
    return stockScraper.getPricesFromYahooFinance(coin+'-EUR', from_date);
}