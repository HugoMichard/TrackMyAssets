var mysql = require('mysql')
const config = require("../config/database.config.js");

// local mysql db connection
var connection = mysql.createConnection(config.db_config)

connection.connect(function (err) {
  if (err) throw err
})

module.exports = connection
