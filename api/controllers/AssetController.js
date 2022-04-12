var Asset = require('../models/Asset')
var Order = require('../models/Order')
var History = require('../models/History')
var history = require('./HistoryController')
var portfolio = require('./PortfolioController')
var notifHelper = require('../helpers/NotifHelper');
var miscHelper = require('../helpers/MiscHelper');


exports.create = function (req, res) {
  if(req.body.ast_type === "fix" || req.body.ast_type === "dex") {
    const random_code = miscHelper.generateRandomVarchar(30);
    req.body.coin = random_code
    req.body.ticker = random_code
  }
  if(req.body.ast_type === "crypto") {
    req.body.coin = req.body.coin + req.body.duplicate_nbr
  }
  var newAsset = new Asset(req.body)
  newAsset.usr_id = req.usr_id;
  newAsset.code = req.body.coin || req.body.ticker;
  
  Asset.create(newAsset, function (err, asset) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({ast_id: asset.insertId, notif: notifHelper.getNotif("createAssetSuccess", [newAsset.name])});
    newAsset.ast_id = asset.insertId
    newAsset.cmc_official_id = req.body.cmc_official_id
    if(newAsset.ast_type !== "dex") {
      history.initializeAssetHistory(newAsset);
    }
  })
}

exports.search = function (req, res) {
  req.query.name = req.query.name === undefined ? "%" : "%" + req.query.name + "%"
  req.query.usr_id = req.usr_id
  Asset.search(req.query, function (err, assets) {
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
        res.status(200).send({assets: assets});
    }
  })
}

exports.getDetail = function (req, res) {
  params = {
      ast_id: parseInt(req.params.ast_id),
      usr_id: req.usr_id
  }
  Asset.getDetail(params, function (err, assets) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({asset: assets[0]});
      }
  })
}

exports.update = function (req, res) {
  var updateAsset = new Asset(req.body);
  updateAsset.code = req.body.coin || req.body.ticker;
  updateAsset.usr_id = req.usr_id;
  updateAsset.ast_id = parseInt(req.params.ast_id);
  Asset.update(updateAsset, function (err, asset) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({asset: updateAsset, notif: notifHelper.getNotif("updateAssetSuccess", [updateAsset.name])});
          if(updateAsset.ast_type !== "dex") {
            updateAsset.cmc_official_id = req.body.cmc_official_id;
            history.updateAssetHistory(updateAsset);
          }
      }
  })
}

function crossAssetPricesWithVlTable(assets, vl_table) {
  Object.keys(assets).forEach(g => {
    Object.keys(assets[g]["assets"]).forEach(a => {
      assets[g]["assets"][a]["vl"] = vl_table.find(e => e.code === a).vl;
    })
  })
  return assets
}
exports.crossAssetPricesWithVlTable = crossAssetPricesWithVlTable

function getAssetOwnedDetails(usr_id) {
  return new Promise(function(resolve, reject) {
    Promise.all([
      getCurrentPriceOfAssets(usr_id),
      portfolio.getPortfolioComposition(usr_id, "ast")
    ])
    .catch(err => {
      reject(err)
    })
    .then(values => {
      const assets = crossAssetPricesWithVlTable(values[1], values[0])
  
      // there is an extra layer of asset id we remove
      const assetsInPortfolioArray = Object.values(assets).map(v => v.assets)
      const assetsInPortfolioDict = Object.assign({}, ...assetsInPortfolioArray.map((x) => {
        const k = Object.keys(x)[0]
        return ({[k]: x[k]})
      }));
  
      const assetsOwned = Object.values(assetsInPortfolioDict).filter(a => a.quantity > 0)
      resolve(assetsOwned)
    })
  });
}
exports.getAssetOwnedDetails = getAssetOwnedDetails

exports.getAssetsOwned = function (req, res) {
  getAssetOwnedDetails(req.usr_id)
  .catch(err => {
    res.status(500).send({message: err.message});
  })
  .then(assetsOwned => {
    assetsOwned.map(a => a["average_paid"] = a.total_paid / a.quantity)
    assetsOwned.map(a => a["perf"] = (a.vl * a.quantity) - a.total_paid)
    assetsOwned.map(a => a["perf100"] = (a.perf / a.total_paid) * 100)
    res.status(200).send({assets: assetsOwned});
  });
}

exports.delete = function (req, res) {
  params = {
    ast_id: parseInt(req.params.ast_id),
    usr_id: req.usr_id
  }  
  Order.deleteOrdersOfAsset(params, function (err, orders) {
      if (err) {
          res.status(500).send({ message: err.message, notif: notifHelper.getNotif("deleteOrdersLinkToAssetFail")});
      } else {
        Asset.delete(params, function (err, asset) {
          if (err) {
              res.status(500).send({ message: err.message, notif: notifHelper.getNotif("deleteAssetFail")});
          } else {
              res.status(200).send({asset: asset, notif: notifHelper.getNotif("deleteAssetSuccess")});
              History.deleteHistoriesWithNoAsset(function(err, res) {});
          }
        })
      }
  })
}

exports.getCoins = function(req, res) {
  const params = {
    name: req.query.name === undefined ? "%" : "%" + req.query.name + "%"
  } 
  Asset.getCMCCoins(params, function(err, coins) {
    res.status(200).send({coins: coins});
  });
}

function getCurrentPriceOfAssets(usr_id) {
  return new Promise(function(resolve, reject) {
    Asset.getCurrentPriceOfUserAssets(usr_id, function (err, prices) {
      if (err) {
        reject(err)
      }
      resolve(prices)
    })
  });
}
exports.getCurrentPriceOfAssets = getCurrentPriceOfAssets