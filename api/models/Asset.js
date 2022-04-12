var sql = require('./db.js')

var Asset = function (asset) {
  this.name = asset.name
  this.ast_type = asset.ast_type
  this.usr_id = asset.usr_id
  this.code = asset.code
  this.fix_vl = asset.fix_vl
  this.cat_id = asset.cat_id
  this.plt_id = asset.plt_id
  this.cmc_id = asset.cmc_id
  this.duplicate_nbr = asset.duplicate_nbr
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
    `SELECT a.*, c.color as cat_color, c.name as cat_name 
      FROM assets a
      INNER JOIN categories c ON c.cat_id = a.cat_id
      WHERE (a.name LIKE ? OR (a.code LIKE ? AND a.plt_id IS NULL)) AND a.usr_id = ?
      ORDER BY a.name`, [
      params.name,
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
    `SELECT a.*, cmc.cmc_official_id, c.color as cat_color, c.name as cat_name FROM assets a
      INNER JOIN categories c on a.cat_id = c.cat_id
      LEFT JOIN cmc_coins cmc on a.cmc_id = cmc.cmc_id
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
      SET name = ?, code = ?, cat_id = ?, ast_type = ?, fix_vl = ?, plt_id = ?, duplicate_nbr = ?, cmc_id = ?
      WHERE ast_id = ? AND usr_id = ?`, [
        params.name,
        params.code,
        params.cat_id,
        params.ast_type,
        params.fix_vl,
        params.plt_id,
        params.duplicate_nbr,
        params.cmc_id,
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

Asset.delete = function (params, result) {
  sql.query(
    `DELETE FROM assets WHERE ast_id = ? AND usr_id = ?`, [
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

Asset.getCMCCoinList = function(result) {
  sql.query(
    'SELECT * FROM cmc_coins', [], (err, res) => {
      result(null, res)
    }
  )
}

Asset.addCMCCoins = function(newCoins, result) {
  sql.query(
    `INSERT INTO cmc_coins (cmc_official_id, name, symbol, slug, duplicate_nbr) values ${newCoins}`, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Asset.getCMCCoins = function(params, result) {
  sql.query(
    `SELECT * FROM cmc_coins WHERE name LIKE '${params.name}' OR symbol LIKE '${params.name}' ORDER BY cmc_id LIMIT 100`, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Asset.checkCoin = function (params, result) {
  sql.query(
    `SELECT * FROM cmc_coins 
      WHERE cmc_id = ?
      AND cmc_official_id = ?
      AND symbol = ?
      AND duplicate_nbr = ?`, [
        params.cmc_id,
        params.cmc_official_id,
        params.coin,
        params.duplicate_nbr
      ], function(err, res) {
      result(null, res);
    }
  )
}

Asset.getCurrentPriceOfUserAssets = function (usr_id, result) {
  sql.query(
    `SELECT h.vl, h.code
      FROM (SELECT DISTINCT hst_date, vl, code FROM histories) as h
      INNER JOIN 
      (SELECT MAX(hst_date) as hst_date, code FROM histories GROUP BY code) as max_h 
      ON h.code = max_h.code AND h.hst_date = max_h.hst_date
      INNER JOIN assets a ON a.code = h.code 
      WHERE usr_id = ?`, [
        usr_id
      ], function(err, res) {
      result(null, res);
    }
  )
}

module.exports = Asset
