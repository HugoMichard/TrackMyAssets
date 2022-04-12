var sql = require('./db.js')

var Platform = function (plt) {
  this.name = plt.name
  this.color = plt.color
  this.usr_id = plt.usr_id
  this.dex_id = plt.dex_id
  this.wallet_address = plt.wallet_address
}

Platform.create = function (newPlt, result) {
  sql.query(
    'INSERT INTO platforms set ?', newPlt, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Platform.search = function (params, result) {
  sql.query(
    `SELECT p.plt_id, p.usr_id, p.name, p.color, d.name as dex_name, p.wallet_address
      FROM platforms p 
      LEFT JOIN dexs d ON d.dex_id = p.dex_id 
      WHERE p.name LIKE ? AND usr_id = ?
      ORDER BY p.name`, [
      params.name,
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

Platform.getDetail = function (params, result) {
  sql.query(
    `SELECT * FROM platforms WHERE plt_id = ? AND usr_id = ?`, [
        params.plt_id,
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

Platform.update = function (params, result) {
    sql.query(
      `UPDATE platforms 
        SET name = ?, color = ?, dex_id = ?, wallet_address = ?
        WHERE plt_id = ? AND usr_id = ?`, [
          params.name,
          params.color,
          params.dex_id,
          params.wallet_address,
          params.plt_id,
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

module.exports = Platform
