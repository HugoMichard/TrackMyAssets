var User = require('../models/User')
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
var notifHelper = require('../helpers/NotifHelper');

exports.register = function (req, res) {
  var newUser = new User(req.body)

  User.register(newUser, function (err, user) {
    if (err) {
      res.status(500).send({message: err.message, notif: notifHelper.getNotif("failRegistration")});
    }
    res.status(200).send({notif: notifHelper.getNotif("successRegistration")});
  })
}

exports.login = function (req, res) {
  User.login(req.body, function (err, users) {
    console.log(req.session);
    if (err) {
        res.status(500).send({ message: err.message, notif: notifHelper.getNotif("failedLogin")});
    } else {
      if(users.length === 1) {
        user = users[0];
        var token = jwt.sign({ id: user.usr_id }, config.secret, { expiresIn: 86400 });
        res.status(200).send({accessToken: token, notif: notifHelper.getNotif("createOrderSuccess")});
      } else {
        res.status(500).send({ message: "No user found with this email/password", notif: notifHelper.getNotif("failLogin")});
      }
    }
  })
}
