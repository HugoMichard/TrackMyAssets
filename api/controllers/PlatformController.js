var Platform = require('../models/Platform');
var asset = require('./AssetController');
var portfolio = require('./PortfolioController')
var notifHelper = require('../helpers/NotifHelper');

exports.create = function (req, res) {
  var newPlt = new Platform(req.body)
  newPlt.usr_id = req.usr_id

  Platform.create(newPlt, function (err, platform) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({platform: platform, notif: notifHelper.getNotif("createPlatformSuccess", [newPlt.name])});
  })
}

exports.search = function (req, res) {
  req.query.name = req.query.name === undefined ? "%" : "%" + req.query.name + "%"
  req.query.usr_id = req.usr_id
  Platform.search(req.query, function (err, platforms) {
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
        res.status(200).send({platforms: platforms});
    }
  })
}

exports.getDetail = function (req, res) {
    params = {
        plt_id: parseInt(req.params.plt_id),
        usr_id: req.usr_id
    }
    Platform.getDetail(params, function (err, platforms) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({platform: platforms[0]});
        }
    })
}

exports.update = function (req, res) {
    req.body.plt_id = parseInt(req.params.plt_id);
    req.body.usr_id = req.usr_id
    Platform.update(req.body, function (err, plt) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({platform: plt, notif: notifHelper.getNotif("updatePlatformSuccess", [req.body.name])});
        }
    })
}

exports.getPortfolioValueForeachPlt = function (req, res) {
    Promise.all([
      asset.getCurrentPriceOfAssets(req.usr_id),
      portfolio.getPortfolioComposition(req.usr_id, "plt")
    ])
    .catch(err => {
      res.status(500).send({message: err.message});
    })
    .then(values => {
      var assets = asset.crossAssetPricesWithVlTable(values[1], values[0]);
      var emptyGroup = [];
      Object.keys(assets).forEach(g => {
        var assetsInGroup = Object.values(assets[g]["assets"]).filter(a => a.quantity > 0);
        if(assetsInGroup.length > 0) {
          assetsInGroup.map(a => a["average_paid"] = a.total_paid / a.quantity);
          assetsInGroup.map(a => a["perf"] = (a.vl * a.quantity) - a.total_paid);
          assetsInGroup.map(a => a["perf100"] = (a.perf / a.total_paid) * 100);
          assets[g]["value"] = assetsInGroup.map(a => a.quantity * a.vl).reduce((a, b) => a + b);
          assets[g]["perf"] = assetsInGroup.map(a => a.perf).reduce((a, b) => a + b);
          assets[g]["perf100"] = assetsInGroup.map(a => (a.perf / a.total_paid) * 100).reduce((a, b) => a + b);
          assets[g]["plt_id"] = g;
          assets[g]["assets"] = assetsInGroup;
        } else {
          emptyGroup.push(g)
        }
      })

      emptyGroup.forEach(g => delete assets[g]);
      
      res.status(200).send({state: "Success", values: Object.values(assets)});
    });
}