var User = require('../models/User')

exports.getLastRefresh = function (req, res) {
  User.getLastRefresh(req.usr_id, function (err, refresh_date) {
    if (err) {
      res.send("Error");
    } else { 
        res.send({refresh_date: refresh_date[0].refresh_date})
    }
  })
}