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

        const currentDate = new Date().toISOString().slice(0, 10).replace('T', ' ');
        var filter_prices_dates = prices.filter(p => 
            new Date(p.date * 1000) >= new Date(from_date) 
            && currentDate !== new Date(p.date * 1000).toISOString().slice(0, 10).replace('T', ' '));

        var filter_prices = filter_prices_dates.filter(p => !p.hasOwnProperty('amount'))
        return filter_prices
    });
}