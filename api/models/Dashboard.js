var sql = require('./db.js')

var Dashboard = function (dashboard) {
  this.created_at = new Date()
}

Dashboard.valuesKDaysAgo = function (params, result) {
  sql.query(
    `SELECT SUM(o.quantity * h.vl) as value
    FROM orders o
    INNER JOIN assets a ON a.ast_id = o.ast_id 
    INNER JOIN 
        (SELECT last_h_vl.ticker, last_h_vl.hst_date, last_h_vl.vl
            FROM histories last_h_vl 
            INNER JOIN (
                SELECT ticker, max(hst_date) as last_hst_date FROM histories WHERE hst_date <= CURDATE() - INTERVAL ? DAY GROUP BY ticker) last_hst
            ON last_hst.ticker = last_h_vl.ticker AND last_hst.last_hst_date = last_h_vl.hst_date) h
    ON h.ticker = a.ticker
    WHERE o.usr_id = ?`,
    [
      params.days_ago,
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

Dashboard.getInvestments = function (params, result) {
  sql.query(
    `SELECT o.ord_id, o.execution_date, o.quantity, o.fees, o.price, a.name, o.price * o.quantity + o.fees as investment
    FROM orders o
    INNER JOIN assets a ON a.ast_id = o.ast_id
    WHERE o.usr_id = ?`,
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

Dashboard.getCumulativeInvestments = function (params, result) {
  sql.query(
    `SELECT o.execution_date, SUM(o.price * o.quantity + o.fees) 
    OVER(ORDER BY execution_date ASC) as cum_sum
      FROM orders o
      INNER JOIN assets a ON a.ast_id = o.ast_id
      ORDER BY execution_date ASC
    WHERE o.usr_id = ?`,
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

Dashboard.getPortfolioAssetEvolution = function (params, result) {
  sql.query(
    `SELECT a.ticker, o.execution_date, SUM(o.quantity) OVER(PARTITION BY ticker ORDER BY execution_date ASC) as quantity_sum
    FROM assets a 
    INNER JOIN orders o ON a.ast_id = o.ast_id ORDER BY o.execution_date
    WHERE o.usr_id = ?`,
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

Dashboard.getPortfolioEvolutionBetweenDates = function (params, result) {
  sql.query(
    `SELECT ticker, 
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
    WHERE random_date BETWEEN ? and ?`,
    [
      params.usr_id,
      params.start_date,
      params.end_date
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

Dashboard.getAllAssetValuesOfUserBetweenDates = function (params, result) {
  sql.query(
    `SELECT random_date, ticker,  first_value(vl) over (partition by ticker, value_partition order by random_date) as ast_vl
    FROM (
      SELECT vl, 
        date_ticker_combis.ticker, 
        random_date,
        sum(case when vl is null then 0 else 1 end) over (partition by date_ticker_combis.ticker order by random_date) as value_partition
      FROM histories h
      RIGHT JOIN 
        (SELECT DISTINCT a.ticker as ticker, d.random_date FROM dates d, assets a WHERE usr_id = ?) date_ticker_combis 
        ON h.hst_date = date_ticker_combis.random_date AND h.ticker = date_ticker_combis.ticker
      WHERE random_date BETWEEN ? and ?) as vl_with_nulls`,
    [
      params.usr_id,
      params.start_date,
      params.end_date
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

Dashboard.getDetailedPorfolioValueBetweenDates = function (params, result) {
  sql.query(
    `SELECT ord_values.random_date, ord_values.ticker,
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
        WHERE random_date BETWEEN ? and ?) as vl_with_nulls
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
      WHERE random_date BETWEEN ? and ?
      ) ord_values
    ON ord_values.ticker = ast_values.ticker AND ord_values.random_date = ast_values.random_date`,
    [
      params.usr_id,
      params.start_date,
      params.end_date,
      params.usr_id,
      params.start_date,
      params.end_date
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

module.exports = Dashboard
