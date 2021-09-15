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

Platform.getPortfolioValueForeachPlt = function (usr_id, result) {
  sql.query(
    `SELECT p.plt_id, p.color, p.name, SUM(current_ast_values.ast_vl * owned_assets.quantity) as value
      FROM (
        SELECT * FROM (
          SELECT random_date, ast_id, first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
            FROM (
              SELECT vl, 
                      date_code_combis.code, 
                      ast_id,
                      random_date,
                      sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
              FROM histories h
                RIGHT JOIN (
                  SELECT DISTINCT a.code as code, d.random_date, a.ast_id FROM dates d, assets a WHERE usr_id = ?
                ) date_code_combis 
                ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
                WHERE random_date BETWEEN CURDATE() - INTERVAL 5 DAY AND CURDATE() - INTERVAL 1 DAY
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
      current_ast_values.ast_vl * owned_assets.quantity as ast_value, 
      owned_assets.ast_id, 
      a.name, 
      a.code, 
      owned_assets.quantity, 
      owned_assets.price,
      (current_ast_values.ast_vl * owned_assets.quantity - owned_assets.price) as perf,
      (current_ast_values.ast_vl * owned_assets.quantity - owned_assets.price) * 100 / owned_assets.price as perf100,
      c.name as cat_name,
      c.color as cat_color
      FROM (
        SELECT * FROM (
          SELECT random_date, ast_id, first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
          FROM (
            SELECT vl, 
              date_code_combis.code, 
              ast_id,
              random_date,
              sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
            FROM histories h
            RIGHT JOIN (
              SELECT DISTINCT a.code as code, d.random_date, a.ast_id FROM dates d, assets a WHERE usr_id = ?
            ) date_code_combis 
            ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
            WHERE random_date BETWEEN CURDATE() - INTERVAL 5 DAY AND CURDATE() - INTERVAL 1 DAY
          ) as vl_with_no_nulls
        ) ast_values 
      WHERE random_date = CURDATE() - INTERVAL 1 DAY
      )	current_ast_values
      INNER JOIN (
        SELECT ast_id, plt_id, SUM(quantity) as quantity, AVG(quantity * price + fees) as price FROM orders WHERE usr_id = ? GROUP BY ast_id, plt_id
      ) owned_assets
      ON current_ast_values.ast_id = owned_assets.ast_id
      INNER JOIN platforms p ON owned_assets.plt_id = p.plt_id 
      INNER JOIN assets a ON a.ast_id = owned_assets.ast_id
      INNER JOIN categories c ON a.cat_id = c.cat_id 
      WHERE owned_assets.quantity > 0`, [
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
