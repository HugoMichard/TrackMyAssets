const axios = require('axios');
const cheerio = require('cheerio');

exports.getDataOfTicker = function (ticker, from_date) {
    console.log("scrapping for : ");
    console.log(ticker);
    return axios.get(`https://finance.yahoo.com/quote/${ticker}/history?p=${ticker}`).then((data) => {
        const str_prices = data.data.match(new RegExp("\"HistoricalPriceStore\":{\"prices\":" + "(.*)" + ",\"isPending\":false"))[1];
        var prices = JSON.parse(str_prices);
        var new_prices = prices.filter(p => p.date < from_date);
        return new_prices
    });
}