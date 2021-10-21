var sql = require('./db.js')

var Wire = function (wire) {
  this.execution_date = new Date(wire.execution_date)
  this.usr_id = wire.usr_id
  this.amount = parseFloat(wire.amount)
  this.target = wire.target
}

Wire.create = function (newWire, result) {
  sql.query(
    'INSERT INTO wires set ?', newWire, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Wire.search = function (params, result) {
  sql.query(
    `SELECT w.wir_id, w.usr_id, w.amount, DATE_FORMAT(w.execution_date, '%m/%d/%Y') as execution_date, w.target
      FROM wires w
      WHERE w.usr_id = ?
      ORDER BY w.execution_date DESC`, [
      params.usr_id
    ], (err, res) => {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Wire.getDetail = function (params, result) {
  sql.query(
    `SELECT w.wir_id, w.usr_id, w.amount, DATE_FORMAT(w.execution_date, '%Y-%m-%d') as execution_date, w.target
      From wires w
      WHERE w.wir_id = ? AND w.usr_id = ?`, [
        params.wir_id,
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

Wire.update = function (params, result) {
  sql.query(
    `UPDATE wires 
      SET execution_date = ?, amount = ?, target = ?
      WHERE wir_id = ? AND usr_id = ?`, [
        params.execution_date,
        params.amount,
        params.target,
        params.wir_id,
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

Wire.delete = function (params, result) {
  sql.query(
    `DELETE FROM wires WHERE wir_id = ? AND usr_id = ?`, [
        params.wir_id,
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

module.exports = Wire
