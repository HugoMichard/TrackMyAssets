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
    `SELECT hst_id, vl, code, DATE_FORMAT(hst_date, '%Y-%m-%d') as hst_date FROM histories WHERE code = ? ORDER BY hst_date DESC LIMIT 1`, [
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
    `SELECT 
        hst_id,
        DATE_FORMAT(hst_date, '%Y-%m-%d') as hst_date,
        vl,
        h.code,
        ast_id,
        usr_id,
        cat_id,
        name,
        ast_type
      FROM histories h 
      INNER JOIN assets a ON a.code = h.code 
      WHERE a.ast_id = ? AND a.usr_id = ? AND hst_date >= ?
      ORDER BY hst_date`, [
        params.ast_id,
        params.usr_id,
        params.start_date
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

History.getRandomDatesUntilToday = function (result) {
  sql.query(
    `SELECT DATE_FORMAT(random_date, '%Y-%m-%d') as random_date FROM dates WHERE random_date <= CURDATE()`, [], function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

History.getRandomDatesFromDateUntilToday = function (from_date, result) {
  sql.query(
    `SELECT DATE_FORMAT(random_date, '%Y-%m-%d') as random_date FROM dates WHERE random_date BETWEEN ? AND CURDATE()`, 
    [from_date], 
    function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

History.modifyFixAssetVlHistory = function (asset, result) {
  sql.query(
    `UPDATE histories SET vl = ? WHERE code = ?`, 
    [asset.fix_vl, asset.code], 
    function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

module.exports = History
