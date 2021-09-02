var sql = require('./db.js')

var Asset = function (asset) {
  this.name = asset.name
  this.ast_type = asset.ast_type
  this.usr_id = asset.usr_id
  this.code = asset.code
  this.cat_id = asset.cat_id
  this.created_at = new Date()
}

Asset.create = function (newAsset, result) {
  sql.query(
    'INSERT INTO assets set ?', newAsset, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Asset.search = function (params, result) {
  sql.query(
    `SELECT a.*, c.color as cat_color, c.name as cat_name FROM assets a
      INNER JOIN categories c ON c.cat_id = a.cat_id
      WHERE a.name LIKE ? AND a.usr_id = ?`, [
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

Asset.getDetail = function (params, result) {
  sql.query(
    `SELECT a.*, c.color as cat_color, c.name as cat_name FROM assets a
      INNER JOIN categories c on a.cat_id = c.cat_id
      WHERE a.ast_id = ? AND a.usr_id = ?`, [
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

Asset.update = function (params, result) {
  sql.query(
    `UPDATE assets 
      SET name = ?, code = ?, cat_id = ?, ast_type = ?
      WHERE ast_id = ? AND usr_id = ?`, [
        params.name,
        params.code,
        params.cat_id,
        params.ast_type,
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

module.exports = Asset
