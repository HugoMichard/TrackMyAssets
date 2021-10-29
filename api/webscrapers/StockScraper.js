const axios = require('axios');

exports.getPricesFromYahooFinance = function(code, from_date) {
    return axios.get(`https://finance.yahoo.com/quote/${code}/history?p=${code}`).then((data) => {
        const str_prices = data.data.match(new RegExp("\"HistoricalPriceStore\":{\"prices\":" + "(.*)" + ",\"isPending\":false"))[1];
        const prices = JSON.parse(str_prices);
        const currentDate = new Date().toISOString().slice(0, 10).replace('T', ' ');
        const price_with_dates = prices.map(p => {
            return {
                date: p.date * 1000,
                price: p.close
            }
        })
        const filter_prices_dates = price_with_dates.filter(p => 
            new Date(p.date) >= new Date(from_date) 
            && currentDate !== new Date(p.date).toISOString().slice(0, 10).replace('T', ' '));
        const filter_prices = filter_prices_dates.filter(p => !p.hasOwnProperty('amount'))
        const filter_nulls = filter_prices.filter(p => p.close)

        return filter_nulls
    });
}