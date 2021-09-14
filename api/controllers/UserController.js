var User = require('../models/User')


exports.register = function (req, res) {
  var newUser = new User(req.body)

  User.register(newUser, function (err, user) {
    if (err) {
      res.send(err)
    }
    res.json(user)
  })
}

exports.login = function (req, res) {

  User.login(req.body, function (err, users) {
    if (err) {
      res.send("Error");
    } else { 
      if(users.length === 1) {
        session = req.session;
        session.email = req.body.email;
        res.send({authentification: "Success"})
      } else {
        res.send("Error");
      }
    }
  })
}

exports.getLastRefresh = function (req, res) {
  User.getLastRefresh(req.usr_id, function (err, refresh_date) {
    if (err) {
      res.send("Error");
    } else { 
        res.send({refresh_date: refresh_date[0].refresh_date})
    }
  })
}