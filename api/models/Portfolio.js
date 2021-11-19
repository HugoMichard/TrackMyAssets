var sql = require('./db.js')

var Portfolio = function (portfolio) {
  this.created_at = new Date()
}

Portfolio.getPortfolioStartDate = function (params, result) {
    sql.query(
      `SELECT DATE_FORMAT(execution_date, '%Y-%m-%d') as start_date FROM orders WHERE usr_id = ? ORDER BY execution_date ASC LIMIT 1`,
      [
        params.usr_id
      ], 
      function (err, res) {
        if (err) {
          result(null, err)
        } else {
          result(null, res)
        }
      }
    )
}

Portfolio.getPorfolioValueHistory = function (params, result) {
  sql.query(
    `WITH cumul_orders AS (
      SELECT SUM(cast(o.quantity as double precision)) OVER(PARTITION BY a.code ORDER BY o.execution_date ASC) as quantity_sum, 
      SUM(cast(o.quantity as double precision) * o.price + o.fees) OVER(PARTITION BY a.code ORDER BY o.execution_date ASC) as price_sum, 
      o.execution_date, 
      a.code,
      a.ast_id
      FROM orders o
      INNER JOIN assets a ON o.ast_id = a.ast_id
      WHERE o.usr_id = ?
    ),
    ast_values AS (
      SELECT random_date, code,  first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
      FROM (
        SELECT
          COALESCE(date_code_combis.fix_vl, h.vl) as vl, 
          date_code_combis.code, 
          random_date,
          sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
        FROM histories h
        RIGHT JOIN 
          (SELECT DISTINCT a.code as code, d.random_date, a.fix_vl FROM dates d, assets a WHERE usr_id = ?) date_code_combis 
        ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
        WHERE random_date BETWEEN ? - INTERVAL 5 DAY AND CURDATE() - INTERVAL 1 DAY
      ) as vl_with_nulls
    )
    SELECT 
      DATE_FORMAT(daily_orders.random_date, '%Y-%m-%d') as random_date, 
      SUM(quantity_sum * ast_vl - price_sum) as plus_value,
      SUM(quantity_sum * ast_vl) as value
    FROM (
      SELECT MAX(execution_date) as last_date, code, random_date
      FROM cumul_orders
      INNER JOIN dates d ON execution_date <= random_date
      GROUP BY random_date, code
    ) as daily_orders
    INNER JOIN cumul_orders ON last_date = execution_date AND daily_orders.code = cumul_orders.code
    INNER JOIN ast_values vals ON vals.random_date = daily_orders.random_date AND daily_orders.code = vals.code
    WHERE daily_orders.random_date BETWEEN ? - INTERVAL 1 DAY AND CURDATE() - INTERVAL 1 DAY
    GROUP BY daily_orders.random_date;`,
    [
      params.usr_id,
      params.usr_id,
      params.start_date,
      params.start_date
    ], 
    function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Portfolio.getInvestments = function (params, result) {
  sql.query(
    `SELECT 
        DATE_FORMAT(date_cat_combis.random_date, ?) as execution_date, 
        SUM(o.price * cast(o.quantity as double precision) + o.fees) as investment, 
        c.name as cat_name, 
        c.color as cat_color
      FROM orders o
      INNER JOIN assets a ON a.ast_id = o.ast_id
      INNER JOIN categories c ON a.cat_id = c.cat_id 
      RIGHT JOIN (
        SELECT DISTINCT c2.cat_id, d.random_date 
        FROM dates d, categories c2 
        WHERE usr_id = ? AND d.random_date BETWEEN ? AND CURDATE() - INTERVAL 1 DAY
        ) date_cat_combis 
      ON o.execution_date = date_cat_combis.random_date AND c.cat_id = date_cat_combis.cat_id     
      GROUP by c.cat_id, DATE_FORMAT(date_cat_combis.random_date, ?)
      ORDER BY DATE_FORMAT(date_cat_combis.random_date, ?)`,
    [
      params.group_date,
      params.usr_id,
      params.start_date,
      params.group_date,
      params.group_date
    ], 
    function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Portfolio.getCumulativeInvestments = function (params, result) {
  sql.query(
    `SELECT * FROM ( 
        SELECT
          DATE_FORMAT(random_date, '%Y-%m-%d') as random_date, 
          COALESCE(SUM(day_sum) OVER(ORDER BY random_date ASC), 0) as cum_sum
          FROM (
            SELECT SUM(price * cast(quantity as double precision) + fees) as day_sum, execution_date
            FROM orders WHERE usr_id = ? AND execution_date <= CURDATE() - INTERVAL 1 DAY
            GROUP BY execution_date
          ) o
        RIGHT JOIN dates d ON o.execution_date = d.random_date) cum_investments
      WHERE random_date BETWEEN ? - INTERVAL 1 DAY AND CURDATE() - INTERVAL 1 DAY
      ORDER BY random_date ASC`,
    [
      params.usr_id,
      params.start_date
    ], 
    function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Portfolio.getTotalInvestments = function (params, result) {
  sql.query(
    `SELECT SUM(cast(quantity as double precision) * price + fees) as investment FROM orders WHERE usr_id = ? GROUP BY quantity > 0 ORDER BY investment DESC`,
    [
      params.usr_id
    ], 
    function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Portfolio.getCurrentPortfolioValue = function (params, result) {
  sql.query(
    `SELECT 
      SUM(cast(quantity as double precision) * ast_prices.vl) as value
    FROM orders 
    INNER JOIN (
      SELECT ast.ast_id, hst.vl
      FROM 
      ( SELECT MAX(hst_date) as hst_date, code FROM histories GROUP BY code ) last_histories
      INNER JOIN histories hst ON hst.code = last_histories.code AND hst.hst_date = last_histories.hst_date
      INNER JOIN assets ast ON ast.code = hst.code
    ) ast_prices
    ON ast_prices.ast_id = orders.ast_id 
    WHERE usr_id = ?`,
    [
      params.usr_id
    ], 
    function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

module.exports = Portfolio