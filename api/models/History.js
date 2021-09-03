var sql = require('./db.js')

var History = function (history) {
  this.ast_id = history.ast_id
  this.hst_date = history.hst_date
  this.vl = history.vl
}

History.addHistories = function (newHistories, result) {
  sql.query(
    `INSERT INTO histories (code, hst_date, vl) values ${newHistories}`, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

History.getHistoryByCode = function (code, result) {
  sql.query(
    `SELECT * FROM histories WHERE code = ?`, [
        code,
        code
      ], function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

History.getAssetHistory = function (params, result) {
  sql.query(
    `SELECT * FROM histories h INNER JOIN assets a ON a.code = h.code WHERE a.ast_id = ? AND a.usr_id = ?`, [
        params.ast_id,
        params.usr_id
      ], function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

History.getLastHistoryOfUserAssets = function (params, result) {
  sql.query(
    `SELECT a.ast_type, a.code, DATE_FORMAT(MAX(h.hst_date), '%Y-%m-%d') as last_date
      FROM histories h
      RIGHT JOIN assets a ON a.code = h.code
      WHERE a.usr_id = ?
      GROUP BY a.ast_type, a.code`, [
        params.usr_id
      ], function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

module.exports = History
