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
      ORDER BY p.dex_id, p.name`, [
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

Platform.getPortfolioValueForeachPlt = function (usr_id, result) {
  sql.query(
    `SELECT p.plt_id, p.color, p.name, SUM(current_ast_values.ast_vl * owned_assets.quantity) as value
      FROM (
        SELECT * FROM (
          SELECT random_date, ast_id, first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
            FROM (
              SELECT COALESCE(date_code_combis.fix_vl, h.vl) as vl, 
                date_code_combis.code, 
                ast_id,
                random_date,
                sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
              FROM histories h
                RIGHT JOIN (
                  SELECT DISTINCT a.code as code, d.random_date, a.ast_id, a.fix_vl FROM dates d, assets a WHERE usr_id = ?
                ) date_code_combis 
                ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
                WHERE random_date BETWEEN CURDATE() - INTERVAL 8 DAY AND CURDATE() - INTERVAL 1 DAY
            ) as vl_with_no_nulls
        ) ast_values 
        WHERE random_date = CURDATE() - INTERVAL 1 DAY
      )	current_ast_values
      INNER JOIN (
        SELECT ast_id, plt_id, SUM(quantity) as quantity FROM orders WHERE usr_id = ? GROUP BY ast_id, plt_id
      ) owned_assets
      ON current_ast_values.ast_id = owned_assets.ast_id
      INNER JOIN platforms p ON owned_assets.plt_id = p.plt_id 
      WHERE owned_assets.quantity > 0
      GROUP BY p.plt_id`, [
        usr_id,
        usr_id
    ], (err, res) => {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

Platform.getUserAssetsWithPlatformDetails = function (usr_id, result) {
  sql.query(
    `SELECT p.plt_id as plt_id, 
      current_ast_values.ast_vl as ast_value, 
      owned_assets.ast_id, 
      a.name, 
      a.code,
      a.ast_type,
      a.duplicate_nbr,
      owned_assets.quantity, 
      owned_assets.price,
      (current_ast_values.ast_vl - owned_assets.price) * owned_assets.quantity as perf,
      (current_ast_values.ast_vl - owned_assets.price) * 100 / owned_assets.price as perf100,
      c.name as cat_name,
      c.color as cat_color
      FROM (
        SELECT * FROM (
          SELECT random_date, ast_id, first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
          FROM (
            SELECT COALESCE(date_code_combis.fix_vl, h.vl) as vl, 
              date_code_combis.code, 
              ast_id,
              random_date,
              sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
            FROM histories h
            RIGHT JOIN (
              SELECT DISTINCT a.code as code, d.random_date, a.ast_id, a.fix_vl FROM dates d, assets a WHERE usr_id = ?
            ) date_code_combis 
            ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
            WHERE random_date BETWEEN CURDATE() - INTERVAL 8 DAY AND CURDATE() - INTERVAL 1 DAY
          ) as vl_with_no_nulls
        ) ast_values 
      WHERE random_date = CURDATE() - INTERVAL 1 DAY
      )	current_ast_values
      INNER JOIN (
        SELECT o.ast_id, o.plt_id, SUM(o.quantity * o.price + o.fees) / SUM(o.quantity) as price, owned_quantity.quantity
        FROM orders o
        INNER JOIN (
        	SELECT ast_id, plt_id, SUM(quantity) as quantity FROM orders WHERE usr_id = ? GROUP BY ast_id, plt_id
        ) as owned_quantity 
        ON o.ast_id = owned_quantity.ast_id  AND o.plt_id = owned_quantity.plt_id
        WHERE usr_id = ? AND o.quantity > 0 GROUP BY ast_id, plt_id
      ) owned_assets
      ON current_ast_values.ast_id = owned_assets.ast_id
      INNER JOIN platforms p ON owned_assets.plt_id = p.plt_id 
      INNER JOIN assets a ON a.ast_id = owned_assets.ast_id
      INNER JOIN categories c ON a.cat_id = c.cat_id 
      WHERE owned_assets.quantity > 0
      ORDER BY p.name, a.name`, [
      usr_id,
      usr_id,
      usr_id
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
