var User = require('../models/User')
var nodemailer = require('nodemailer');
var notifHelper = require('../helpers/NotifHelper');
const config = require("../config/mail.config");

exports.getLastRefresh = function (req, res) {
  User.getLastRefresh(req.usr_id, function (err, refresh_date) {
    if (err) {
      res.send("Error");
    } else { 
        res.send({refresh_date: refresh_date[0].refresh_date})
    }
  })
}

exports.sendContactMail = function (req, res) {
  console.log("Sending Mail : ")
  console.log(req.body)
  const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: config.mail_config,
    secure: true,
  });

  const mailData = {
    from: config.mail_config.user,  // sender address
    to: req.body.email,   // receiver address
    subject: `TrackMyAssets - Mail From ${req.body.name} at ${req.body.email}`,
    text: req.body.message,
    html: req.body.message
  };

  transporter.sendMail(mailData, function (err, info) {
    if(err) {
      console.log("Error when sending mail")
      console.log(err)
    }
    else {
      console.log("Mail sent")
      console.log(info)
      res.status(200).send({notif: notifHelper.getNotif("sendContactMailSuccess", [])});
    }
  });
}