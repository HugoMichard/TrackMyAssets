var Platform = require('../models/Platform')

exports.create = function (req, res) {
  var newPlt = new Platform(req.body)
  newPlt.usr_id = req.usr_id

  Platform.create(newPlt, function (err, platform) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({state: "Success", platform: platform});
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
    req.body.cat_id = parseInt(req.params.plt_id);
    req.body.usr_id = req.usr_id
    Platform.update(req.body, function (err, plt) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({platform: plt});
        }
    })
}

exports.getPortfolioValueForeachPlt = function (req, res) {
    Platform.getPortfolioValueForeachPlt(req.usr_id, function (err, values) {
        if (err) {
            res.status(500).send({ message: err.message});
        } else {
            res.status(200).send({state: "Success", values: values})
        }
    })
}