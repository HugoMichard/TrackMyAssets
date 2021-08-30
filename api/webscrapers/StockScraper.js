const axios = require('axios');

exports.getDataOfTicker = function (ticker, from_date) {
    return getPricesFromYahooFinance(ticker, from_date);
}

exports.getDataOfCoin = function(coin, from_date) {
    const coinToEur = coin + '-EUR';
    return getPricesFromYahooFinance(coinToEur, from_date);
}


function getPricesFromYahooFinance(code, from_date) {
    return axios.get(`https://finance.yahoo.com/quote/${code}/history?p=${code}`).then((data) => {
        const str_prices = data.data.match(new RegExp("\"HistoricalPriceStore\":{\"prices\":" + "(.*)" + ",\"isPending\":false"))[1];
        var prices = JSON.parse(str_prices);
        var new_prices = prices.filter(p => p.date < from_date);
        return new_prices
    });
}