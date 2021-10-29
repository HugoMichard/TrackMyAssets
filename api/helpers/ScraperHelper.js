var coinScraper = require('../webscrapers/CoinScraper')
var stockScraper = require('../webscrapers/StockScraper');
var Asset = require('../models/Asset');

exports.getDataOfTicker = function (ticker, from_date) {
    return stockScraper.getPricesFromYahooFinance(ticker, from_date);
}

exports.getDataOfCoin = function(coin, from_date) {
    return coinScraper.getPricesFromCoinMarketCap(coin, from_date);
}

exports.updateCoinList = function() {
    return new Promise(function(resolve, reject) {
        Asset.getCMCCoinList(function(err, current_coins) {
            const current_ids = current_coins.map(c => c.cmc_official_id);
            coinScraper.getCoinListFromCoinMarketCap().then(cmc_coins => {
                // Remove coins already in database
                const new_coins = cmc_coins.filter(c => !current_ids.includes(c.id));
                if(new_coins.length > 0) {
                    const uniqueTokens = current_coins.map(c => c.symbol).filter((value, index, self) => self.indexOf(value) === index);
                    const duplicates = {}
                    uniqueTokens.forEach(t => {
                        duplicates[t] = current_coins.filter(c => c.symbol === t).length
                    })
                    var coinsToAdd = [];
                    // Identidy how many tokens with this symbol already exists to add a duplicate number to the new tokens
                    new_coins.forEach(c => {
                        const coin_symbol = c.symbol.replace(/'/g, '');
                        var duplicate_nbr = 0
                        if(coin_symbol in duplicates) {
                            duplicate_nbr = duplicates[coin_symbol];
                            duplicates[coin_symbol] = duplicates[coin_symbol] + 1;
                        } else {
                            duplicates[coin_symbol] = 1
                        }
                        // remove apostrophes with regex /'/g
                        coinsToAdd.push({
                            symbol: coin_symbol,
                            name: c.name.replace(/'/g, ''),
                            id: c.id,
                            slug: c.slug.replace(/'/g, ''),
                            duplicate_nbr: duplicate_nbr
                        })
                    })
                    const sql_to_add = coinsToAdd.map(c => (`(${c.id}, '${c.name}', '${c.symbol}', '${c.slug}', '${c.duplicate_nbr}')`));
                    const sliceSize = 500
                    for (var i = 0; i < sql_to_add.length; i += sliceSize) {
                        var sliced_query = sql_to_add.slice(i, i + sliceSize);
                        Asset.addCMCCoins(sliced_query, function (err, coins) {
                            console.log("added "+ coins.affectedRows + " coins");
                        });
                    }
                    resolve();
                } else {
                    resolve();
                }
            });
        })
    })
}