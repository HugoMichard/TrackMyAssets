const axios = require('axios');

exports.getPricesFromCoinMarketCap = function(code, from_date) {
    const unix_from_date = new Date(from_date).getTime() / 1000;
    console.log(`https://api.cryptowat.ch/markets/kraken/${code}eur/ohlc?after=${unix_from_date}&periods=86400`)
    return axios.get(`https://api.cryptowat.ch/markets/kraken/${code}eur/ohlc?after=${unix_from_date}&periods=86400`).then((data) => {
        console.log(data.data);
        /*
        const str_prices = data.data.match(new RegExp("\"HistoricalPriceStore\":{\"prices\":" + "(.*)" + ",\"isPending\":false"))[1];
        const prices = JSON.parse(str_prices);

        const currentDate = new Date().toISOString().slice(0, 10).replace('T', ' ');
        const filter_prices_dates = prices.filter(p => 
            new Date(p.date * 1000) >= new Date(from_date) 
            && currentDate !== new Date(p.date * 1000).toISOString().slice(0, 10).replace('T', ' '));
        const filter_prices = filter_prices_dates.filter(p => !p.hasOwnProperty('amount') && p.date !== 1616889600)
        const filter_nulls = filter_prices.filter(p => p.close)

        return filter_nulls
        */
    });
}