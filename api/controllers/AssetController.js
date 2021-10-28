var Asset = require('../models/Asset')
var Order = require('../models/Order')
var History = require('../models/History')
var history = require('../controllers/HistoryController')
var notifHelper = require('../helpers/NotifHelper');
var miscHelper = require('../helpers/MiscHelper');


exports.create = function (req, res) {
  if(req.body.ast_type === "fix" || req.body.ast_type === "dex") {
    const random_code = miscHelper.generateRandomVarchar(30);
    req.body.coin = random_code
    req.body.ticker = random_code
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
    if(!newAsset.plt_id) {
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
          if(!updateAsset.plt_id) {
            history.updateAssetHistory(updateAsset);
          }
      }
  })
}

exports.getAssetsOwned = function (req, res) {
  Asset.getAssetsOwned(req.usr_id, function (err, assets) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({assets: assets});
      }
  })
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