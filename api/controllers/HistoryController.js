var History = require('../models/History')
var Dex = require('../models/Dex')
var scraperHelper = require('../helpers/ScraperHelper');
var dateHelper = require('../helpers/DateHelper')
var dexScraper = require('../webscrapers/DexScraper');

exports.getAssetHistory = function (req, res) {
    const start_date_string =
        req.query.start_date === "all" ? new Date('1970-01-01') 
        : req.query.start_date === "week" ? new Date().setDate(new Date().getDate() - 7)
        : req.query.start_date === "month" ? new Date().setMonth(new Date().getMonth() - 1)
        : new Date().setYear(new Date().getFullYear() - 1);

    const params = {
        ast_id: parseInt(req.query.ast_id),
        start_date: dateHelper.dateToStringDate(start_date_string),
        usr_id: req.usr_id
    } 

    History.getAssetHistory(params, function (err, histories) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({histories: histories});
      }
    })
}

var initializeAssetHistory = exports.initializeAssetHistory = function (asset) {
    console.log("initializing asset history");
    if(asset.ast_type === "fix" || asset.ast_type === "dex") {
        initializeFixAssetHistory(asset)
    } else {
        checkHistoryWithCodeExists(asset.code).then(lastHistory => {
            if(lastHistory.length === 0) {
                var ytd = new Date();
                ytd.setFullYear(ytd.getFullYear() - 1);
                ytd = new Date(ytd).toISOString().slice(0, 10).replace('T', ' ');
    
                getDataOfAsset = asset.ast_type === "stock" ? scraperHelper.getDataOfTicker : scraperHelper.getDataOfCoin 
                const identifier = asset.ast_type === "stock" ? asset.code : asset.cmc_official_id;
                getDataOfAsset(identifier, ytd).then(ytd_data => {
                    if(ytd_data.length > 0) {
                        ytd_data.map(item => {
                            item.date = new Date(item.date).toISOString().slice(0, 10).replace('T', ' ');
                            return item;
                        });
                        sql_histories = ytd_data.map(item => (`('${asset.code}', '${item.date}', ${item.close})`))
                        History.addHistories(sql_histories, function (err, histories) {
                            console.log("added "+ histories.affectedRows + " histories");
                        });
                    }
                });
            }
        });
    }   
}

exports.updateAssetHistory = function (asset) {
    console.log("updating asset history");
    checkHistoryWithCodeExists(asset.code).then(lastHistory => {
        if(lastHistory.length === 0) {
            initializeAssetHistory(asset);
        } else {
            var from_date = new Date(lastHistory[0].hst_date);
            from_date.setDate(from_date.getDate() + 1);
            from_date = from_date.toISOString().slice(0, 10).replace('T', ' ');
            asset.last_date = from_date
            if(asset.ast_type === "fix" || asset.ast_type === "dex") {
                updateFixAssetHistory(asset)
            } else {
                getDataOfAsset = asset.ast_type === "stock" ? scraperHelper.getDataOfTicker : scraperHelper.getDataOfCoin;
                const identifier = asset.ast_type === "stock" ? asset.code : asset.cmc_official_id;
                getDataOfAsset(identifier, asset.last_date).then(data => {
                    if(data.length > 0) {
                        data.map(item => {
                            item.date = new Date(item.date).toISOString().slice(0, 10).replace('T', ' ');
                            return item;
                        });
                        sql_histories = data.map(item => (`('${asset.code}', '${item.date}', ${item.close})`))
                        History.addHistories(sql_histories, function (err, histories) {
                            console.log("added "+ histories.affectedRows + " histories");
                        });
                    }
                });
            }
        }
    });
}

function checkHistoryWithCodeExists(code) {
    return new Promise((resolve, reject) => {
        History.getHistoryByCode(code, function(err, res) {
            resolve(res);
        });
    });
}


function initializeFixAssetHistory(asset) {
    History.getRandomDatesUntilToday(function(err, random_dates) {
        sql_histories = random_dates.map(item => (`('${asset.code}', '${item.random_date}', ${asset.fix_vl})`))
        History.addHistories(sql_histories, function (err, histories) {
            console.log("added "+ histories.affectedRows + " histories");
        });
    })
}


function updateFixAssetHistory(asset) {
    History.getRandomDatesFromDateUntilToday(asset.last_date, function(err, random_dates) {
        sql_histories = random_dates.map(item => (`('${asset.code}', '${item.random_date}', ${asset.fix_vl})`))
        History.addHistories(sql_histories, function (err, histories) {
            console.log("added "+ histories.affectedRows + " histories");
        });
    })
}


exports.updateDexAssetsHistory = function(assets, usr_id) {
    // Get all unique dex and wallet unique combinaisons
    const dex_references = assets.map(item => item.reference_name).filter((value, index, self) => self.indexOf(value) === index)
    var wallet_dex_combinaisons = []
    dex_references.forEach(ref => {
        const wallets = assets.filter(a => a.reference_name === ref).map(item => item.wallet_address).filter((value, index, self) => self.indexOf(value) === index);
        wallets.forEach(w => wallet_dex_combinaisons.push({wallet_address: w, dex_reference: ref, plt_id: assets.find(a => a.reference_name === ref).plt_id}));
    })
    console.log(wallet_dex_combinaisons)

    Promise.all(
        wallet_dex_combinaisons.map(combi => updateVlOfAssetsInDexWallet(combi, assets.filter(a => a.plt_id === combi.plt_id && a.reference_name === combi.dex_reference && a.wallet_address === combi.wallet_address)))
    ).then(() => History.updateDexAssetsHistoryOfUser(usr_id, function(err, res) {console.log("done");}));
}

function updateVlOfAssetsInDexWallet(dexWallet, assets) {
    // Get asset prices in dex wallet
    return new Promise((resolve, reject) => {
        dexScraper.getMoneyInDexWallet(dexWallet.dex_reference, dexWallet.wallet_address).then(res => {
            if(!res || res.length < 1) { resolve(); }
            const uniqueLps = [];
            res.forEach(lp => {
                const existingLpIdx = uniqueLps.findIndex(uLp => lp.symbol1 + lp.symbol2 === uLp.symbol1 + uLp.symbol2 || lp.symbol2 + lp.symbol1 === uLp.symbol1 + uLp.symbol2)
                if(existingLpIdx > -1) {
                    uniqueLps[existingLpIdx].value = uniqueLps[existingLpIdx].value + lp.value;
                    uniqueLps[existingLpIdx].rewards = uniqueLps[existingLpIdx].rewards + lp.rewards;
                } else {
                    uniqueLps.push(lp);
                }
            });
            Promise.all(
                uniqueLps.map(lp => {
                    const assetsWithName = 
                        lp.symbol2.length > 0 ? assets.filter(a => a.plt_id === dexWallet.plt_id && (a.name.toLowerCase() === lp.symbol1.toLowerCase() + '-' + lp.symbol2.toLowerCase() || a.name.toLowerCase() === lp.symbol2.toLowerCase() + '-' + lp.symbol1.toLowerCase()))
                        : assets.filter(a => a.plt_id === dexWallet.plt_id && a.name.toLowerCase() === lp.symbol1.toLowerCase());
                    console.log("assets with name");
                    console.log(assetsWithName)
                    if(assetsWithName.length > 0) {
                        const toUpdate = {code: assetsWithName[0].code, fix_vl: lp.value, rewards:lp.rewards, plt_id: dexWallet.plt_id}
                        console.log(toUpdate);
                        updateDexAsset(toUpdate);
                    }
                })
            ).then(() => resolve());
        });
    })
}

function updateDexAsset(assetToUpdate) {
    return new Promise((resolve, reject) => {
        Dex.updateDexAssetVl(assetToUpdate, function(err, asset) {
            resolve()
        })
    })
}