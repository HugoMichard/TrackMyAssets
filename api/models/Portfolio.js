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
      `SELECT 
        DATE_FORMAT(random_date, '%Y-%m-%d') as random_date, 
        COALESCE(SUM(plus_value), 0) as plus_value, 
        COALESCE(SUM(value), 0) as value
        FROM (
          SELECT ord_values.random_date, ord_values.ticker,
            ord_values.total_quantity * ast_values.ast_vl - ord_values.total_price as plus_value,
            ord_values.total_quantity * ast_values.ast_vl as value
          FROM ( 
            SELECT random_date, ticker,  first_value(vl) over (partition by ticker, value_partition order by random_date) as ast_vl
            FROM (
              SELECT vl, 
                date_ticker_combis.ticker, 
                random_date,
                sum(case when vl is null then 0 else 1 end) over (partition by date_ticker_combis.ticker order by random_date) as value_partition
              FROM histories h
            RIGHT JOIN 
              (SELECT DISTINCT a.ticker as ticker, d.random_date FROM dates d, assets a WHERE usr_id = ?) date_ticker_combis 
            ON h.hst_date = date_ticker_combis.random_date AND h.ticker = date_ticker_combis.ticker
            WHERE random_date BETWEEN ? AND CURDATE()) as vl_with_nulls
          ) ast_values
        INNER JOIN (
          SELECT ticker, 
            random_date, 
            COALESCE(quantity_sum, 0) as total_quantity,
            COALESCE(price_sum, 0) as total_price
          FROM
            (SELECT DISTINCT date_ticker_combis.ticker, date_ticker_combis.random_date, 
              SUM(o.quantity) OVER(PARTITION BY date_ticker_combis.ticker ORDER BY date_ticker_combis.random_date ASC) as quantity_sum,
              SUM(o.quantity * o.price + o.fees) OVER(PARTITION BY date_ticker_combis.ticker ORDER BY date_ticker_combis.random_date ASC) as price_sum
            FROM (
              SELECT DISTINCT a.ast_id, a.ticker, d.random_date, a.usr_id from assets a, dates d
              WHERE a.ast_id IN (SELECT ast_id FROM orders WHERE usr_id = ?)) date_ticker_combis
            LEFT JOIN orders o ON date_ticker_combis.random_date = o.execution_date AND date_ticker_combis.ast_id = o.ast_id AND o.usr_id = date_ticker_combis.usr_id) quantity_evolution
          WHERE random_date BETWEEN ? AND CURDATE()
        ) ord_values
        ON ord_values.ticker = ast_values.ticker AND ord_values.random_date = ast_values.random_date
      ) detailed_portfolio
      GROUP BY random_date`,
      [
        params.usr_id,
        params.start_date,
        params.usr_id,
        params.start_date,
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
