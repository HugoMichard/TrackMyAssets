const csv = require('csv-parser');
const fs = require('fs');
const Order = require('../models/Order')
const History = require('../models/History')
const notifHelper = require('../helpers/NotifHelper');
const dateHelper = require('../helpers/DateHelper');
const Asset = require('../models/Asset');


exports.create = async function (req, res) {
  req.body.quantity = isNaN(req.body.gtg_ast_id) && !req.body.isBuy ? -req.body.quantity : req.body.quantity;
  var newOrder = new Order(req.body)
  newOrder.usr_id = req.usr_id
  if (!isNaN(newOrder.gtg_ast_id)) {
    newOrder.fees = 0;
    if (isNaN(newOrder.price)) {
      const h = await new Promise((resolve, reject) => {
        History.getAssetHistoryAtDate(newOrder, dateHelper.dateToStringDate(newOrder.execution_date), function(err, result) {
          resolve(result);
        })
      });
      newOrder.price = h[0].vl
    }
  }
  Order.create(newOrder, function (err, order) {
    if (err) {
      res.status(500).send(err)
    }
    res.status(200).send({ord_id: order.insertId, notif: notifHelper.getNotif("createOrderSuccess")});
  })
}

exports.search = function (req, res) {
  req.query.name = req.query.name === undefined ? "%" : "%" + req.query.name + "%"
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

exports.update = async function (req, res) {
  req.body.quantity = isNaN(req.body.gtg_ast_id) && !req.body.isBuy ? -req.body.quantity : req.body.quantity;
  var updatedOrder = new Order(req.body)
  updatedOrder.ord_id = parseInt(req.params.ord_id);
  updatedOrder.usr_id = req.usr_id
  if (!isNaN(updatedOrder.gtg_ast_id)) {
    updatedOrder.fees = 0;
    if (isNaN(updatedOrder.price)) {
      const h = await new Promise((resolve, reject) => {
        History.getAssetHistoryAtDate(updatedOrder, dateHelper.dateToStringDate(updatedOrder.execution_date), function(err, result) {
          resolve(result);
        })
      });
      updatedOrder.price = h[0].vl
    }
  }
  console.log(updatedOrder)
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

exports.getUserOrderDataWithHistory = function(usr_id) {
  return new Promise(function(resolve, reject) {
    Order.getUserOrderDataWithHistory(usr_id, function (err, values) {
      if (err) {
        reject(err)
      }
      resolve(values)
    });
  });
}

exports.uploadCsv = function (req, res) {
  function columnLetterToIndex(letter) {
    return parseInt(letter, 36) - 10
  }
  function isFloat(val) {
    val = parseFloat(val);
    return !isNaN(val);
  }
  var columnNames;
  var rows = [];
  var orders = [];

  fs.createReadStream(req.file.path)
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row)
    if(!columnNames) {
      columnNames = Object.keys(row)
    }
  })
  .on('end', () => {
    Asset.search({usr_id: req.usr_id, name: '%'}, function (err, assets) {
      // Get the orders uploaded with the matching asset into a dict
      rows.forEach(r => {
        const price = r[columnNames[columnLetterToIndex(req.body.price)]].replaceAll(" ", "");
        const fees = req.body.fees ? r[columnNames[columnLetterToIndex(req.body.fees)]] : 0;
        const quantity = r[columnNames[columnLetterToIndex(req.body.quantity)]];
        var matchingAssets = assets.filter(a => a.name.toLowerCase() === r[columnNames[columnLetterToIndex(req.body.name)]].toLowerCase());
        const unit_price = req.body.is_unit === true ? parseFloat(price) : parseFloat(price) / parseFloat(quantity);
        const is_valid = isFloat(price) && isFloat(unit_price) && isFloat(fees) && isFloat(quantity) && matchingAssets.length > 0;
        if(matchingAssets.length == 0) {
          matchingAssets.push({"ast_id": "", "cat_color": "white", "cat_name": "", "name": "", "code": ""})
        }
        matchingAssets.forEach(m => {
          orders.push({
            usr_id: req.usr_id,
            plt_id: parseInt(req.body.plt_id),
            execution_date: dateHelper.changeDateStringFormat(
              r[columnNames[columnLetterToIndex(req.body.execution_date)]],
              req.body.date_format,
              "mm/dd/yyyy"
            ),
            price: Math.round(Math.abs(unit_price) * 1000) / 1000,
            fees: Math.abs(parseFloat(fees)),
            quantity: parseFloat(quantity),
            ast_id: m.ast_id,
            asset: m,
            is_valid: is_valid,
          });
        });
      });
      // Check if order already exists in the DB
      Order.search({usr_id: req.usr_id, name: '%'}, function (err, existingOrders) {
        orders.forEach(o => {
          const matchingOrders = existingOrders.filter(eo => o.ast_id == eo.ast_id && o.plt_id == eo.plt_id && o.price == eo.price && o.quantity == eo.quantity && o.execution_date == eo.execution_date);
          o["is_present"] = matchingOrders.length > 0;
          o["is_valid"] = o.is_valid && !o.is_present;
        })
        res.status(200).send({ orders: orders });
      })
    })
  });
}

exports.validateUploadCsv = function (req, res) {
  const orders = req.body;
  const validOrders = orders.filter(o => o.is_valid);
  if(validOrders.length == 0) {
    res.status(500).send({notif: notifHelper.getNotif("createOrderBatchNoOrders")});
  } else {
    sql_orders = validOrders.map(o => {
      console.log(o.execution_date)
      const execution_date =  dateHelper.changeDateStringFormat(o.execution_date, "mm/dd/yyyy", "yyyy-mm-dd");
      console.log(execution_date);
      return (`(${req.usr_id}, ${o.ast_id}, ${o.plt_id}, '${execution_date}', ${o.price}, ${o.quantity}, ${o.fees})`)
    });
    Order.createBatch(sql_orders, function (err, ordersAdded) {
      console.log(err)
      console.log(ordersAdded)
      if(err) {
        res.status(500).send({notif: notifHelper.getNotif("createOrderBatchFail")});
      } else {
        res.status(200).send({notif: notifHelper.getNotif("createOrderBatchSuccess", [ordersAdded.affectedRows])});
      }
    });
  }
}