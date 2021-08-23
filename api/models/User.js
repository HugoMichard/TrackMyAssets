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
        console.log('error in search user model: ', err)
        result(null, res)
      } else {
        console.log(res)
        result(null, res)
      }
    }
  )
}

User.getDetail = function (params, result) {
  sql.query(
    `SELECT * FROM users WHERE usr_id = ${params.usrId}`, function (err, res) {
      if (err) {
        console.log('error in getting details of usr model: ', err)
        result(null, res)
      } else {
        console.log(res)
        result(null, res)
      }
    }
  )
}

module.exports = User
