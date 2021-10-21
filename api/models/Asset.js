var sql = require('./db.js')

var Asset = function (asset) {
  this.name = asset.name
  this.ast_type = asset.ast_type
  this.usr_id = asset.usr_id
  this.code = asset.code
  this.fix_vl = asset.fix_vl
  this.cat_id = asset.cat_id
  this.created_at = new Date()
}

Asset.create = function (newAsset, result) {
  sql.query(
    'INSERT INTO assets set ?', newAsset, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

Asset.search = function (params, result) {
  sql.query(
    `SELECT a.*, c.color as cat_color, c.name as cat_name FROM assets a
      INNER JOIN categories c ON c.cat_id = a.cat_id
      WHERE a.name LIKE ? AND a.usr_id = ?`, [
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

Asset.getDetail = function (params, result) {
  sql.query(
    `SELECT a.*, c.color as cat_color, c.name as cat_name FROM assets a
      INNER JOIN categories c on a.cat_id = c.cat_id
      WHERE a.ast_id = ? AND a.usr_id = ?`, [
        params.ast_id,
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

Asset.update = function (params, result) {
  sql.query(
    `UPDATE assets 
      SET name = ?, code = ?, cat_id = ?, ast_type = ?, fix_vl = ?
      WHERE ast_id = ? AND usr_id = ?`, [
        params.name,
        params.code,
        params.cat_id,
        params.ast_type,
        params.fix_vl,
        params.ast_id,
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

Asset.delete = function (params, result) {
  sql.query(
    `DELETE FROM assets WHERE ast_id = ? AND usr_id = ?`, [
        params.ast_id,
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

Asset.getAssetsOwned = function (usr_id, result) {
  sql.query(
    `SELECT 
        current_ast_values.ast_vl as ast_value, 
        owned_assets.ast_id, 
        a.name, 
        a.code,
        a.ast_type,
        owned_assets.quantity, 
        owned_assets.price,
        (current_ast_values.ast_vl - owned_assets.price)  * owned_assets.quantity as perf,
        (current_ast_values.ast_vl - owned_assets.price) * 100 / owned_assets.price as perf100,
        c.name as cat_name,
        c.color as cat_color
      FROM (
        SELECT * FROM (
          SELECT random_date, ast_id, first_value(vl) over (partition by code, value_partition order by random_date) as ast_vl
          FROM (
            SELECT 
              COALESCE(date_code_combis.fix_vl, h.vl) as vl, 
              date_code_combis.code, 
              ast_id,
              random_date,
              sum(case when vl is null then 0 else 1 end) over (partition by date_code_combis.code order by random_date) as value_partition
            FROM histories h
            RIGHT JOIN (
              SELECT DISTINCT a.code as code, d.random_date, a.ast_id, a.fix_vl FROM dates d, assets a WHERE usr_id = ?
            ) date_code_combis 
            ON h.hst_date = date_code_combis.random_date AND h.code = date_code_combis.code
            WHERE random_date BETWEEN CURDATE() - INTERVAL 5 DAY AND CURDATE() - INTERVAL 1 DAY
          ) as vl_with_no_nulls
        ) ast_values 
        WHERE random_date = CURDATE() - INTERVAL 1 DAY
      )	current_ast_values
      INNER JOIN (
        SELECT ast_id, SUM(cast(quantity as decimal)) as quantity, SUM(cast(quantity as decimal) * price + fees) / SUM(cast(quantity as decimal)) as price FROM orders WHERE usr_id = ? GROUP BY ast_id
      ) owned_assets
      ON current_ast_values.ast_id = owned_assets.ast_id
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

module.exports = Asset
