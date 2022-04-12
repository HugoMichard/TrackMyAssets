var Category = require('../models/Category')
var notifHelper = require('../helpers/NotifHelper');
var portfolio = require('./PortfolioController')
var asset = require('./AssetController')

exports.create = function (req, res) {
  var newCat = new Category(req.body)
  newCat.usr_id = req.usr_id

  Category.create(newCat, function (err, category) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({category: category, notif: notifHelper.getNotif("createCategorySuccess", [newCat.name])});
  })
}

exports.search = function (req, res) {
  req.query.name = req.query.name === undefined ? "%" : "%" + req.query.name + "%"
  req.query.usr_id = req.usr_id
  Category.search(req.query, function (err, categories) {
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
        res.status(200).send({categories: categories});
    }
  })
}

exports.getDetail = function (req, res) {
    params = {
        cat_id: parseInt(req.params.cat_id),
        usr_id: req.usr_id
    }
    Category.getDetail(params, function (err, categories) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({category: categories[0]});
        }
    })
}

exports.update = function (req, res) {
    req.body.cat_id = parseInt(req.params.cat_id);
    req.body.usr_id = req.usr_id
    Category.update(req.body, function (err, cat) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({category: cat, notif: notifHelper.getNotif("updateCategorySuccess", [req.body.name])});
        }
    })
}

exports.getPortfolioValueForeachCat = function (req, res) {
    Promise.all([
      asset.getCurrentPriceOfAssets(req.usr_id),
      portfolio.getPortfolioComposition(req.usr_id, "cat")
    ])
    .catch(err => {
      res.status(500).send({message: err.message});
    })
    .then(values => {
      var assets = asset.crossAssetPricesWithVlTable(values[1], values[0])
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
          assets[g]["cat_id"] = g;
          assets[g]["assets"] = assetsInGroup;
        } else {
            emptyGroup.push(g)
        }
      })
      
      emptyGroup.forEach(g => delete assets[g]);

      res.status(200).send({state: "Success", values: Object.values(assets)});
    });
}

exports.getPortfolioValueForeachType = function (req, res) {
    asset.getAssetOwnedDetails(req.usr_id)
    .catch(err => {
        res.status(500).send({message: err.message});
    })
    .then(assetsOwned => {
        var assetsByType = {}
        assetsOwned.map(a => {
            assetsByType[a.ast_type] = assetsByType[a.ast_type] || [];
            assetsByType[a.ast_type].push(a);
        });
        var assetTypeDetails = []
        Object.keys(assetsByType).forEach(t => {
            assetTypeDetails.push({
                "ast_type": t,
                "value": assetsByType[t].map(a => a.quantity * a.vl).reduce((a, b) => a + b)
            })
        })
        res.status(200).send({state: "Success", values: assetTypeDetails});
    });
}