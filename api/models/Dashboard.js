var sql = require('./db.js')

var Dashboard = function (dashboard) {
  this.created_at = new Date()
}

Dashboard.summary = function (params, result) {
  sql.query(
    `SELECT o.ord_id, o.quantity, o.fees, o.price, h_1.vl as today_vl, h_2.vl as yesterday_vl 
    FROM orders o
    INNER JOIN assets a ON a.ast_id = o.ast_id 
    INNER JOIN 
        (SELECT last_h_vl.ticker, last_h_vl.hst_date, last_h_vl.vl
            FROM histories last_h_vl 
            INNER JOIN (SELECT ticker, max(hst_date) as last_hst_date FROM histories GROUP BY ticker) last_hst
            ON last_hst.ticker = last_h_vl.ticker AND last_hst.last_hst_date = last_h_vl.hst_date) h_1
    ON h_1.ticker = a.ticker
    INNER JOIN 
        (SELECT last_h_vl.ticker, last_h_vl.hst_date, last_h_vl.vl
            FROM histories last_h_vl 
            INNER JOIN (
                SELECT ticker, max(hst_date) as last_hst_date FROM histories 
                WHERE (ticker, hst_date) NOT IN 
                    (SELECT ticker, MAX(hst_date) FROM histories GROUP BY ticker) 
                GROUP BY ticker) last_hst
            ON last_hst.ticker = last_h_vl.ticker AND last_hst.last_hst_date = last_h_vl.hst_date) h_2
    ON h_2.ticker = a.ticker
    WHERE usr_id = ?`, 
    [params.usr_id], 
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
