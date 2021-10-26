var Order = require('../models/Order')
var notifHelper = require('../helpers/NotifHelper');


exports.create = function (req, res) {
  req.body.quantity = req.body.isBuy ? req.body.quantity : -req.body.quantity;
  var newOrder = new Order(req.body)
  newOrder.usr_id = req.usr_id
  Order.create(newOrder, function (err, order) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({ord_id: order.insertId, notif: notifHelper.getNotif("createOrderSuccess")});
  })
}

exports.search = function (req, res) {
  req.query.usr_id = req.usr_id
  Order.search(req.query, function (err, orders) {
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
        res.status(200).send({orders: orders});
    }
  })
}

exports.getDetail = function (req, res) {
  params = {
      ord_id: parseInt(req.params.ord_id),
      usr_id: req.usr_id
  }
  Order.getDetail(params, function (err, orders) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({order: orders[0]});
      }
  })
}

exports.update = function (req, res) {
  req.body.quantity = req.body.isBuy ? req.body.quantity : -req.body.quantity;
  var updatedOrder = new Order(req.body)
  updatedOrder.ord_id = parseInt(req.params.ord_id);
  updatedOrder.usr_id = req.usr_id
  Order.update(updatedOrder, function (err, order) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({order: order, notif: notifHelper.getNotif("updateOrderSuccess")});
      }
  })
}

exports.delete = function (req, res) {
  params = {
    ord_id: parseInt(req.params.ord_id),
    usr_id: req.usr_id
  }  
  Order.delete(params, function (err, order) {
      if (err) {
          res.status(500).send({ message: err.message, notif: notifHelper.getNotif("deleteOrderFail")});
      } else {
          res.status(200).send({order: order, notif: notifHelper.getNotif("deleteOrderSuccess")});
      }
  })
}

exports.getOrdersOfAsset = function (req, res) {
  const params = {
    ast_id: parseInt(req.params.ast_id),
    usr_id: req.usr_id
  }

  Order.getOrdersOfAsset(params, function (err, orders) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({orders: orders});
      }
  })
}

exports.getBuyingQuantityOfAssetByDay = function (req, res) {
  const params = {
    ast_id: parseInt(req.params.ast_id),
    usr_id: req.usr_id
  }

  Order.getBuyingQuantityOfAssetByDay(params, function (err, orders) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({orders: orders});
      }
  })
}