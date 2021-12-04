var sql = require('./db.js')

var Order = function (order) {
  this.execution_date = order.execution_date
  this.ast_id = parseInt(order.ast_id)
  this.plt_id = parseInt(order.plt_id)
  this.usr_id = order.usr_id
  this.fees = parseFloat(order.fees)
  this.quantity = parseFloat(order.quantity)
  this.price = parseFloat(order.price)
}

Order.create = function (newOrder, result) {
  sql.query(
    'INSERT INTO orders set ?', newOrder, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Order.search = function (params, result) {
  sql.query(
    `SELECT o.ord_id, o.usr_id, o.ast_id, o.price, o.quantity as quantity, o.fees, 
      DATE_FORMAT(o.execution_date, '%m/%d/%Y') as execution_date, 
      a.name as ast_name, a.code as ast_code, a.ast_type as ast_type, a.duplicate_nbr as ast_duplicate_nbr,
      c.color as cat_color, c.name as cat_name,
      p.color as plt_color, p.name as plt_name
      FROM orders o
      INNER JOIN assets a ON a.ast_id = o.ast_id
      INNER JOIN categories c ON c.cat_id = a.cat_id
      INNER JOIN platforms p ON p.plt_id = o.plt_id
      WHERE o.usr_id = ? AND (a.name LIKE ? OR (a.code LIKE ? AND a.plt_id IS NULL))
      ORDER BY o.execution_date DESC, a.name ASC`, [
      params.usr_id,
      params.name,
      params.name
    ], (err, res) => {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Order.getDetail = function (params, result) {
  sql.query(
    `SELECT o.ord_id, o.usr_id, o.ast_id, o.price, o.quantity as quantity, o.fees, 
      DATE_FORMAT(o.execution_date, '%Y-%m-%d') as execution_date,
      a.name as ast_name, a.code as ast_coin, a.ast_type as ast_type,
      c.color as cat_color, c.name as cat_name, c.cat_id as cat_id,
      p.color as plt_color, p.name as plt_name, p.plt_id as plt_id
      FROM orders o
      INNER JOIN assets a ON a.ast_id = o.ast_id
      INNER JOIN categories c ON c.cat_id = a.cat_id
      INNER JOIN platforms p ON p.plt_id = o.plt_id
      WHERE o.ord_id = ? AND o.usr_id = ?`, [
        params.ord_id,
        params.usr_id
    ], (err, res) => {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

Order.update = function (params, result) {
  sql.query(
    `UPDATE orders 
      SET execution_date = ?, ast_id = ?, quantity = ?, price = ?, fees = ?, plt_id = ?
      WHERE ord_id = ? AND usr_id = ?`, [
        params.execution_date,
        params.ast_id,
        params.quantity,
        params.price,
        params.fees,
        params.plt_id,
        params.ord_id,
        params.usr_id
    ], (err, res) => {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

Order.delete = function (params, result) {
  sql.query(
    `DELETE FROM orders WHERE ord_id = ? AND usr_id = ?`, [
        params.ord_id,
        params.usr_id
    ], (err, res) => {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

Order.deleteOrdersOfAsset = function (params, result) {
  sql.query(
    `DELETE FROM orders WHERE ast_id = ? AND usr_id = ?`, [
        params.ast_id,
        params.usr_id
    ], (err, res) => {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

Order.getOrdersOfAsset = function (params, result) {
  sql.query(
    `SELECT 
      o.ord_id, 
      DATE_FORMAT(o.execution_date, '%Y-%m-%d') as execution_date,
      o.price, 
      o.quantity as quantity, 
      o.fees, 
      p.name as plt_name, p.color as plt_color
      FROM orders o
      INNER JOIN assets a ON a.ast_id = o.ast_id 
      INNER JOIN platforms p ON p.plt_id = o.plt_id
      WHERE a.usr_id = ? AND a.ast_id = ?
      ORDER BY o.execution_date DESC`, [
        params.usr_id,
        params.ast_id
    ], (err, res) => {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

Order.getBuyingQuantityOfAssetByDay = function (params, result) {
  sql.query(
    `SELECT 
      DATE_FORMAT(execution_date, '%Y-%m-%d') as execution_date,
      SUM(quantity) as quantity
      FROM orders
      WHERE usr_id = ? AND ast_id = ?
      GROUP BY execution_date
      ORDER BY execution_date ASC`, [
        params.usr_id,
        params.ast_id
    ], (err, res) => {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

module.exports = Order
