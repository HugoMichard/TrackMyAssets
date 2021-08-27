var User = require('../models/User')
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

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
    console.log(req.session);
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
      if(users.length === 1) {
        user = users[0];
        var token = jwt.sign({ id: user.usr_id }, config.secret, { expiresIn: 86400 });
        res.status(200).send({authentification: "Success", accessToken: token});
      } else {
        res.status(500).send({ message: "No user found with this email/password"});
      }
    }
  })
}
