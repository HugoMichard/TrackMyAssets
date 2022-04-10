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

Portfolio.valuesKDaysAgo = function (params, result) {
  sql.query(
    `SELECT SUM(o.cum_quantity * h.vl) as value
      FROM (
      SELECT SUM(o.quantity) as cum_quantity, a.code
            FROM orders o
            INNER JOIN assets a ON a.ast_id = o.ast_id
            WHERE o.usr_id = ? AND o.execution_date <= CURDATE() - INTERVAL ? DAY
            GROUP BY a.code) o
      INNER JOIN (
        SELECT last_h_vl.code, last_h_vl.hst_date, last_h_vl.vl
          FROM histories last_h_vl 
          INNER JOIN (
            SELECT code, max(hst_date) as last_hst_date FROM histories WHERE hst_date <= CURDATE() - INTERVAL ? DAY GROUP BY code) last_hst
          ON last_hst.code = last_h_vl.code AND last_hst.last_hst_date = last_h_vl.hst_date) h
      ON h.code = o.code`,
    [
      params.usr_id,
      params.days_ago,
      params.days_ago
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
        SUM(o.price * o.quantity + o.fees) as investment, 
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
      WHERE o.gtg_ast_id IS NULL
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
            SELECT SUM(price * quantity + fees) as day_sum, execution_date
            FROM orders WHERE usr_id = ? AND execution_date <= CURDATE() - INTERVAL 1 DAY AND gtg_ast_id IS NULL
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
    `SELECT SUM(quantity * price + fees) as investment FROM orders WHERE usr_id = ? AND gtg_ast_id is NULL GROUP BY quantity > 0 ORDER BY investment DESC`,
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
      SUM(quantity * ast_prices.vl) as value
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

Portfolio.getProfitsRealised = function (usr_id, result) {
  sql.query(
    `SELECT 
      a.ast_id,
      a.cat_id,
      a.duplicate_nbr,
      a.name,
      a.code,
      a.ast_type,
      c.name as cat_name,
      c.color as cat_color,
      transactions.quantity,
      transactions.buy_price,
      transactions.sell_price,
      ((transactions.sell_price - transactions.buy_price) * transactions.quantity) + COALESCE(generated_assets.generated_money, 0) as perf,
      ((transactions.sell_price - transactions.buy_price) + (COALESCE(generated_assets.generated_money, 0) / transactions.quantity)) * 100 / transactions.buy_price as perf100
    FROM (
      SELECT
        o.ast_id,
        SUM(ABS(CASE WHEN o.quantity < 0 THEN o.quantity END)) as quantity,
        SUM(CASE WHEN o.quantity < 0 THEN 0 ELSE o.quantity * o.price + o.fees END) / SUM(ABS(CASE WHEN o.quantity < 0 THEN 0 ELSE o.quantity END)) as buy_price,
        SUM(ABS(CASE WHEN o.quantity > 0 THEN 0 ELSE o.quantity * o.price + o.fees END)) / SUM(ABS(CASE WHEN o.quantity > 0 THEN 0 ELSE o.quantity END)) as sell_price
      FROM (
        SELECT ast_id, MAX(execution_date) as last_selling FROM orders WHERE usr_id = ? AND orders.quantity < 0 GROUP BY ast_id
      ) last_sold
      INNER JOIN orders o ON o.ast_id = last_sold.ast_id
      WHERE o.execution_date <= last_sold.last_selling
      GROUP BY o.ast_id
    ) as transactions
    INNER JOIN assets a ON a.ast_id = transactions.ast_id
    LEFT JOIN (
      SELECT o.gtg_ast_id, SUM(o.quantity * o.price + o.fees) as generated_money
      FROM orders o
      WHERE gtg_ast_id IS NOT NULL
      GROUP BY gtg_ast_id
    ) generated_assets
    ON a.ast_id = generated_assets.gtg_ast_id
    INNER JOIN categories c ON c.cat_id = a.cat_id`,
    [
      usr_id
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

Portfolio.getPortfolioOrderDetails = function (usr_id, result) {
  sql.query(
    `SELECT 
      a.ast_id,
      a.name as ast_name,
      a.ast_type,
      a.code,
      a.duplicate_nbr,
      o.quantity,
      a.rewards,
      o.price as paid,
      o.fees,
      o.ord_id,
      o.gtg_ast_id IS NOT NULL as is_generated,
      p.color as plt_color,
      p.name as plt_name,
      p.plt_id,
      c.cat_id,
      c.color as cat_color,
      c.name as cat_name
      FROM orders o
      INNER JOIN assets a ON o.ast_id = a.ast_id
      INNER JOIN categories c ON c.cat_id = a.cat_id
      INNER JOIN platforms p ON p.plt_id = o.plt_id
      WHERE o.usr_id = ?
    `, [
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


module.exports = Portfolio