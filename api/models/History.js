var sql = require('./db.js')

var History = function (history) {
  this.ast_id = history.ast_id
  this.hst_date = history.hst_date
  this.vl = history.vl
}

History.addHistories = function (newHistories, result) {
  sql.query(
    `INSERT INTO histories (ticker, hst_date, vl) values ${newHistories}`, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

History.getTickerHistory = function (ticker, result) {
  sql.query(
    `SELECT * FROM histories WHERE ticker = ?`, [
        ticker
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
    `SELECT * FROM histories h INNER JOIN assets a ON a.ticker = h.ticker WHERE a.ast_id = ? AND a.usr_id = ?`, [
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

module.exports = History
