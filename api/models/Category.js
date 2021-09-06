var sql = require('./db.js')

var Category = function (cat) {
  this.name = cat.name
  this.color = cat.color
  this.usr_id = cat.usr_id
}

Category.create = function (newCat, result) {
  sql.query(
    'INSERT INTO categories set ?', newCat, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Category.search = function (params, result) {
  sql.query(
    `SELECT * FROM categories WHERE name LIKE ? AND usr_id = ?`, [
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

Category.getDetail = function (params, result) {
  sql.query(
    `SELECT * FROM categories WHERE cat_id = ? AND usr_id = ?`, [
        params.cat_id,
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

Category.update = function (params, result) {
    sql.query(
      `UPDATE categories 
        SET name = ?, color = ? 
        WHERE cat_id = ? AND usr_id = ?`, [
          params.name,
          params.color,
          params.cat_id,
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

Category.getPortfolioValueForeachCat = function (usr_id, result) {
    sql.query(
      `SELECT c.cat_id, c.color, c.name, SUM(current_ast_values.ast_vl * owned_assets.quantity) as value
        FROM (
          SELECT * FROM (
            SELECT random_date, ast_id, cat_id, first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
              FROM (
                SELECT vl, 
                        date_code_combis.code, 
                        ast_id,
                        cat_id,
                        random_date,
                        sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
                FROM histories h
                  RIGHT JOIN (
                    SELECT DISTINCT a.code as code, d.random_date, a.ast_id, a.cat_id FROM dates d, assets a WHERE usr_id = ?
                  ) date_code_combis 
                  ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
                  WHERE random_date BETWEEN CURDATE() - INTERVAL 5 DAY AND CURDATE() - INTERVAL 1 DAY
              ) as vl_with_no_nulls
          ) ast_values 
          WHERE random_date = CURDATE() - INTERVAL 1 DAY
        )	current_ast_values
        INNER JOIN (
          SELECT ast_id, SUM(quantity) as quantity FROM orders WHERE usr_id = ? GROUP BY ast_id 
        ) owned_assets
        ON current_ast_values.ast_id = owned_assets.ast_id
        INNER JOIN categories c ON c.cat_id = current_ast_values.cat_id
        WHERE owned_assets.quantity > 0
        GROUP BY c.cat_id`, [
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

Category.getPortfolioValueForeachType = function (usr_id, result) {
  sql.query(
    `SELECT current_ast_values.ast_type, SUM(current_ast_values.ast_vl * owned_assets.quantity) as value
      FROM (
        SELECT * FROM (
          SELECT random_date, ast_id, ast_type, first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
            FROM (
              SELECT vl, 
                      date_code_combis.code, 
                      ast_id,
                      ast_type,
                      random_date,
                      sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
              FROM histories h
                RIGHT JOIN (
                  SELECT DISTINCT a.code as code, d.random_date, a.ast_id, a.ast_type FROM dates d, assets a WHERE usr_id = ?
                ) date_code_combis 
                ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
                WHERE random_date BETWEEN CURDATE() - INTERVAL 5 DAY AND CURDATE() - INTERVAL 1 DAY
            ) as vl_with_no_nulls
        ) ast_values 
        WHERE random_date = CURDATE() - INTERVAL 1 DAY
      )	current_ast_values
      INNER JOIN (
        SELECT ast_id, SUM(quantity) as quantity FROM orders WHERE usr_id = ? GROUP BY ast_id 
      ) owned_assets
      ON current_ast_values.ast_id = owned_assets.ast_id
      WHERE owned_assets.quantity > 0
      GROUP BY ast_type`, [
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

module.exports = Category
