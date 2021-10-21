var Wire = require('../models/Wire')
var notifHelper = require('../helpers/NotifHelper');


exports.create = function (req, res) {
  req.body.amount = req.body.isIn ? req.body.amount : -req.body.amount;
  var newWire = new Wire(req.body)
  newWire.usr_id = req.usr_id
  Wire.create(newWire, function (err, wire) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({wir_id: wire.insertId, notif: notifHelper.getNotif("createWireSuccess")});
  })
}

exports.search = function (req, res) {
  req.query.usr_id = req.usr_id
  Wire.search(req.query, function (err, wires) {
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
        res.status(200).send({wires: wires});
    }
  })
}

exports.getDetail = function (req, res) {
  params = {
      wir_id: parseInt(req.params.wir_id),
      usr_id: req.usr_id
  }
  Wire.getDetail(params, function (err, wires) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({wire: wires[0]});
      }
  })
}

exports.update = function (req, res) {
  req.body.amount = req.body.isIn ? req.body.amount : -req.body.amount;
  var updatedWire = new Wire(req.body)
  updatedWire.wir_id = parseInt(req.params.wir_id);
  updatedWire.usr_id = req.usr_id

  Wire.update(updatedWire, function (err, wire) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({wire: wire, notif: notifHelper.getNotif("updateWireSuccess")});
      }
  })
}

exports.delete = function (req, res) {
  params = {
    wir_id: parseInt(req.params.wir_id),
    usr_id: req.usr_id
  }  
  Wire.delete(params, function (err, wire) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({wire: wire});
      }
  })
}

exports.getSummary = function (req, res) {
    Wire.getSummary(req.usr_id, function (err, resultat) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({totalWired: resultat[0].totalWired});
      }
    })
  }