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
    `SELECT * FROM categories WHERE name LIKE ? AND usr_id = ? ORDER BY name`, [
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

module.exports = Category
