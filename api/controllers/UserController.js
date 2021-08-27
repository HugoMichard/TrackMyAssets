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

/*
exports.search = function (req, res) {
  User.search(req.query, function (err, userList) {
    if (err) {
      res.send(err)
    }
    res.json(userList)
  })
}

exports.getDetail = function (req, res) {
  User.getDetail(req.params, function (err, userDetail) {
    if (err) {
      res.send(err)
    }
    res.json(userDetail)
  })
}
*/