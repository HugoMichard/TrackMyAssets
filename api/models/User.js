var sql = require('./db.js')

var User = function (user) {
  this.firstname = user.firstname
  this.lastname = user.lastname
  this.email = user.email
  this.password = user.password
  this.created_at = new Date()
}

User.register = function (newUser, result) {
  sql.query(
    'INSERT INTO users set ?', newUser, function (err, res) {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

User.login = function (params, result) {
  sql.query(
    "SELECT * FROM users WHERE email = ? AND password = ?", [
      params.email,
      params.password
    ], (err, res) => {
      if (err) {
        result(null, err)
      } else {
        result(null, res)
      }
    }
  )
}

User.search = function (query, result) {
  sql.query(
    'SELECT * FROM users', function (err, res) {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

User.getDetail = function (params, result) {
  sql.query(
    `SELECT * FROM users WHERE usr_id = ${params.usrId}`, function (err, res) {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

User.updateRefresh = function (usrId) {
  sql.query(
    `UPDATE users 
      SET refresh_date = CURDATE()
      WHERE usr_id = ${usrId}`,
      function (err, res) {}
  )
}

User.getLastRefresh = function (usrId, result) {
  sql.query(
    `SELECT DATE_FORMAT(refresh_date, '%Y-%m-%d') as refresh_date FROM users WHERE usr_id = ${usrId}`, function (err, res) {
      if (err) {
        result(null, res)
      } else {
        result(null, res)
      }
    }
  )
}

User.checkEmailExists = function (email, result) {
  sql.query(
    `SELECT * FROM users WHERE email = '${email}'`, function(err, res) {
      result(null, res);
    }
  )
}

User.checkUserHasPlatform = function (params, result) {
  sql.query(
    `SELECT * FROM platforms WHERE usr_id = ${params.usr_id} AND plt_id = ${params.plt_id}`, function(err, res) {
      result(null, res);
    }
  )
}

User.checkUserHasCategory = function (params, result) {
  sql.query(
    `SELECT * FROM categories WHERE usr_id = ${params.usr_id} AND cat_id = ${params.cat_id}`, function(err, res) {
      result(null, res);
    }
  )
}

User.checkUserHasAsset = function (params, result) {
  sql.query(
    `SELECT * FROM assets WHERE usr_id = ${params.usr_id} AND ast_id = ${params.ast_id}`, function(err, res) {
      result(null, res);
    }
  )
}

User.checkUserHasOrder = function (params, result) {
  sql.query(
    `SELECT * FROM orders WHERE usr_id = ${params.usr_id} AND ord_id = ${params.ord_id}`, function(err, res) {
      result(null, res);
    }
  )
}

User.checkUserHasWire = function (params, result) {
  sql.query(
    `SELECT * FROM wires WHERE usr_id = ${params.usr_id} AND wir_id = ${params.wir_id}`, function(err, res) {
      result(null, res);
    }
  )
}

module.exports = User
