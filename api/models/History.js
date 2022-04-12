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

History.getAssetHistoryAtDate = function (params, date, result) {
  sql.query(
    `SELECT 
      hst.hst_id, 
      hst.vl, 
      hst.code, 
      DATE_FORMAT(hst.hst_date, '%Y-%m-%d') as hst_date 
      FROM histories hst
      INNER JOIN assets ast ON ast.code = hst.code 
      WHERE ast.ast_id = ? AND hst.hst_date <= ? 
      ORDER BY hst_date DESC LIMIT 1`, [
        params.ast_id,
        date
      ], function (err, res) {
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

History.getLastHistoryOfUserCexAssets = function (params, result) {
  sql.query(
    `SELECT a.ast_type, a.code, cmc.cmc_official_id, DATE_FORMAT(MAX(h.hst_date), '%Y-%m-%d') as last_date, a.fix_vl
      FROM histories h
      RIGHT JOIN assets a ON a.code = h.code
      LEFT JOIN orders o ON o.ast_id = a.ast_id
      LEFT JOIN platforms p ON p.plt_id = o.plt_id
      LEFT JOIN cmc_coins cmc ON cmc.cmc_id = a.cmc_id
      WHERE a.usr_id = ? AND a.ast_type != 'dex'
      GROUP BY a.ast_type, a.code, cmc.cmc_official_id, a.fix_vl`, [
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

History.updateDexAssetsHistoryOfUser = function (usr_id, result) {
  sql.query(
    `INSERT INTO histories (code, vl, hst_date)
      SELECT a.code, a.fix_vl as vl, CURDATE() as hst_date
      FROM assets a
      INNER JOIN (SELECT DISTINCT plt_id, ast_id FROM orders) as o ON o.ast_id = a.ast_id
      INNER JOIN platforms p ON p.plt_id = o.plt_id
      INNER JOIN dexs d ON p.dex_id = d.dex_id
      INNER JOIN (SELECT code, max(h.hst_date) as last_date FROM histories h GROUP BY h.code) as last_history on a.code = last_history.code
      WHERE a.usr_id = ? AND last_history.last_date < CURDATE()
    ) last_hst`, 
    [usr_id], 
    function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

History.deleteHistoriesWithNoAsset = function (result) {
  sql.query(
    `DELETE FROM histories
      WHERE hst_id IN 
        (SELECT hst_id FROM
          (SELECT hst_id FROM histories h LEFT JOIN assets a ON h.code = a.code WHERE ast_id IS NULL) AS c)`, 
    [], 
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
