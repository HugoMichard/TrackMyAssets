var Asset = require('../models/Asset')

exports.create = function (req, res) {
  var newAsset = new Asset(req.body)
  newAsset.usr_id = req.usr_id

  Asset.create(newAsset, function (err, asset) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({state: "Success", asset: asset});
  })
}

exports.search = function (req, res) {
  req.query.name = req.query.name === undefined ? "" : req.query.name
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
  console.log("let's get the asset !")
  console.log(req.body);
}