var sql = require('./db.js')

var Platform = function (cat) {
  this.name = cat.name
  this.color = cat.color
  this.usr_id = cat.usr_id
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
    `SELECT * FROM platforms WHERE name LIKE ? AND usr_id = ?`, [
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
        SET name = ?, color = ? 
        WHERE plt_id = ? AND usr_id = ?`, [
          params.name,
          params.color,
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
