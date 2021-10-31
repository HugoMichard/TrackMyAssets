var User = require('../models/User')
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/auth.config");
var notifHelper = require('../helpers/NotifHelper');

exports.register = async function (req, res) {
  var newUser = new User(req.body)
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  User.register(newUser, function (err, user) {
    if (err) {
      res.status(500).send({message: err.message, notif: notifHelper.getNotif("failRegistration")});
    }
    res.status(200).send({notif: notifHelper.getNotif("successRegistration")});
  })
}

exports.login = async function (req, res) {
  User.getUserWithEmail(req.body.email, async function (err, users) {    
    if (err) {
        res.status(500).send({ message: err.message, notif: notifHelper.getNotif("failLogin")});
    } else {
      console.log(users);
      if(users.length === 1) {
        const user = users[0];
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(validPassword) {
          var token = jwt.sign({ id: user.usr_id }, config.secret, { expiresIn: 86400 });
          res.status(200).send({accessToken: token, notif: notifHelper.getNotif("successLogin")});
        } else {
          res.status(500).send({ message: "No user found with this email / password", notif: notifHelper.getNotif("failLogin")});
        }
      } else {
        res.status(500).send({ message: "No user found with this email / password", notif: notifHelper.getNotif("failLogin")});
      }
    }
  })
}
