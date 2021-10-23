var sql = require('./db.js')

var Dex = function (dex) {
  this.name = dex.name
  this.reference_name = dex.reference_name
}


Dex.search = function (result) {
  sql.query(
    `SELECT * FROM dexs`, [], (err, res) => {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Dex.searchPlatformDexs = function (params, result) {
    sql.query(
      `SELECT p.plt_id, p.name, p.color 
        FROM platforms p 
        INNER JOIN dexs d ON p.dex_id = d.dex_id 
        WHERE p.usr_id = ?`, [params.usr_id], (err, res) => {
        if (err) {
          result(null, err)
        } else {
          result(null, res)
        }
      }
    )
}

Dex.searchWallets = function (params, result) {
    sql.query(
      `SELECT a.name, a.fix_vl, o.quantity, p.plt_id 
        FROM platforms p
        INNER JOIN orders o ON o.plt_id = p.plt_id
        INNER JOIN assets a ON a.ast_id = o.ast_id 
        WHERE p.dex_id IS NOT NULL AND p.usr_id = ?`, [params.usr_id], (err, res) => {
        if (err) {
          result(null, err)
        } else {
          result(null, res)
        }
      }
    )
}

Dex.getUserDexAssets = function (params, result) {
    sql.query(
      `SELECT DISTINCT a.code, a.name, d.reference_name, p.wallet_address
        FROM platforms p
        INNER JOIN dexs d ON p.dex_id = d.dex_id
        INNER JOIN orders o ON o.plt_id = p.plt_id
        INNER JOIN assets a ON o.ast_id = a.ast_id
        WHERE p.usr_id = ?`, [params.usr_id], (err, res) => {
        if (err) {
          result(null, err)
        } else {
          result(null, res)
        }
      }
    )
}

Dex.updateDexAssetVl = function(asset, result) {
    sql.query(
      `UPDATE assets SET fix_vl = ? WHERE code = ?`, 
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

module.exports = Dex
