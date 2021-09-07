var Asset = require('../models/Asset')
var Order = require('../models/Order')
var history = require('../controllers/HistoryController')


exports.create = function (req, res) {
  var newAsset = new Asset(req.body)
  newAsset.usr_id = req.usr_id;
  newAsset.code = req.body.coin || req.body.ticker;

  Asset.create(newAsset, function (err, asset) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({state: "Success", ast_id: asset.insertId});
    newAsset.ast_id = asset.insertId
    history.initializeAssetHistory(newAsset);
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
  req.body.ast_id = parseInt(req.params.ast_id);
  req.body.usr_id = req.usr_id
  Asset.update(req.body, function (err, asset) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({asset: asset});
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
          res.status(500).send({ message: err.message});
      } else {
        Asset.delete(params, function (err, asset) {
          if (err) {
              res.status(500).send({ message: err.message});
          } else {
              res.status(200).send({asset: asset});
          }
      })
      }
  })
}