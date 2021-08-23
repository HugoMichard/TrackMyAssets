var sql = require('./db.js')

var Asset = function (asset) {
  this.name = asset.name
  this.type = asset.type
  this.usr_id = asset.usr_id
  this.isin = asset.isin
  this.coin = asset.coin
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
    "SELECT * FROM assets WHERE name LIKE ? AND usr_id = ?", [
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
    `SELECT * FROM assets WHERE ast_id = ${params.astId}`, function (err, res) {
      if (err) {
        console.log('error in getting details of ast model: ', err)
        result(null, res)
      } else {
        console.log(res)
        result(null, res)
      }
    }
  )
}

module.exports = Asset
