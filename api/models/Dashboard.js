var sql = require('./db.js')

var Dashboard = function (dashboard) {
  this.created_at = new Date()
}

Dashboard.valuesKDaysAgo = function (params, result) {
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
    `SELECT a.code, o.execution_date, SUM(o.quantity) OVER(PARTITION BY code ORDER BY execution_date ASC) as quantity_sum
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
    `SELECT code, 
      random_date, 
      COALESCE(quantity_sum, 0) as total_quantity,
      COALESCE(price_sum, 0) as total_price
    FROM
      (SELECT DISTINCT date_code_combis.code, date_code_combis.random_date, 
        SUM(o.quantity) OVER(PARTITION BY date_code_combis.code ORDER BY date_code_combis.random_date ASC) as quantity_sum,
        SUM(o.quantity * o.price + o.fees) OVER(PARTITION BY date_code_combis.code ORDER BY date_code_combis.random_date ASC) as price_sum
    FROM (
      SELECT DISTINCT a.ast_id, a.code, d.random_date, a.usr_id from assets a, dates d
        WHERE a.ast_id IN (SELECT ast_id FROM orders WHERE usr_id = ?)) date_code_combis
    LEFT JOIN orders o ON date_code_combis.random_date = o.execution_date AND date_code_combis.ast_id = o.ast_id AND o.usr_id = date_code_combis.usr_id) quantity_evolution
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
    `SELECT random_date, code,  first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
    FROM (
      SELECT vl, 
        date_code_combis.code, 
        random_date,
        sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
      FROM histories h
      RIGHT JOIN 
        (SELECT DISTINCT a.code as code, d.random_date FROM dates d, assets a WHERE usr_id = ?) date_code_combis 
        ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
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
    `SELECT ord_values.random_date, ord_values.code,
      ord_values.total_quantity * ast_values.ast_vl - ord_values.total_price as plus_value,
      ord_values.total_quantity * ast_values.ast_vl as value
    FROM ( 
      SELECT random_date, code,  first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
      FROM (
        SELECT vl, 
          date_code_combis.code, 
          random_date,
          sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
        FROM histories h
        RIGHT JOIN 
          (SELECT DISTINCT a.code as code, d.random_date FROM dates d, assets a WHERE usr_id = ?) date_code_combis 
        ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
        WHERE random_date BETWEEN ? and ?) as vl_with_nulls
      ) ast_values
    INNER JOIN (
      SELECT code, 
        random_date, 
        COALESCE(quantity_sum, 0) as total_quantity,
        COALESCE(price_sum, 0) as total_price
      FROM
        (SELECT DISTINCT date_code_combis.code, date_code_combis.random_date, 
          SUM(o.quantity) OVER(PARTITION BY date_code_combis.code ORDER BY date_code_combis.random_date ASC) as quantity_sum,
          SUM(o.quantity * o.price + o.fees) OVER(PARTITION BY date_code_combis.code ORDER BY date_code_combis.random_date ASC) as price_sum
        FROM (
          SELECT DISTINCT a.ast_id, a.code, d.random_date, a.usr_id from assets a, dates d
          WHERE a.ast_id IN (SELECT ast_id FROM orders WHERE usr_id = ?)) date_code_combis
        LEFT JOIN orders o ON date_code_combis.random_date = o.execution_date AND date_code_combis.ast_id = o.ast_id AND o.usr_id = date_code_combis.usr_id) quantity_evolution
      WHERE random_date BETWEEN ? and ?
      ) ord_values
    ON ord_values.code = ast_values.code AND ord_values.random_date = ast_values.random_date`,
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
