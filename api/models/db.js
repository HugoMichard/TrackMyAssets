var mysql = require('mysql')

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}

// local mysql db connection
var connection = mysql.createConnection(db_config)

connection.connect(function (err) {
  if (err) throw err
})

module.exports = connection
