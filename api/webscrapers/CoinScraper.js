const axios = require('axios');

exports.getPricesFromCoinMarketCap = function(id, from_date) {
    const unix_from_date = new Date(from_date).getTime() / 1000;
    const unix_current_date = new Date().getTime();
    const api_endpoint = `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/historical?id=${id}&convertId=2790&timeStart=${unix_from_date}&timeEnd=${unix_current_date}`
    return axios.get(api_endpoint).then((data) => {
        const prices = data.data.data.quotes.map(q => q.quote);

        const currentDate = new Date().toISOString().slice(0, 10).replace('T', ' ');
        const filter_prices = prices.filter(p => 
            new Date(p.timestamp.slice(0, 10)) >= new Date(from_date) 
            && currentDate !== new Date(p.timestamp.slice(0, 10)).toISOString().slice(0, 10).replace('T', ' '));
        const price_with_dates = filter_prices.map(p => { return {close: p.close, date: p.timestamp.slice(0, 10)} });
        return price_with_dates
    });
}

exports.getCoinListFromCoinMarketCap = function() {
    const api_path = 'https://api.coinmarketcap.com/data-api/v3/map/all?listing_status=active,untracked&exchangeAux=is_active,status&cryptoAux=is_active,status&start=1&limit=10000';
    return axios.get(api_path).then((data) => {
        return data.data.data.cryptoCurrencyMap
    });
}