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
    'INSERT INTO user set ?', newUser, function (err, res) {
      if (err) {
        console.log('error in register user model: ', err)
        result(null, res.insertId)
      } else {
        console.log(res.insertId)
        result(null, res.insertId)
      }
    }
  )
}

User.search = function (query, result) {
  sql.query(
    'SELECT * FROM user', function (err, res) {
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
    `SELECT * FROM user WHERE usr_id = ${params.usrId}`, function (err, res) {
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
