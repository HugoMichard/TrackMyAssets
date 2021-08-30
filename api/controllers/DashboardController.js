var Dashboard = require('../models/Dashboard')


exports.summary = function (req, res) {
  const params = {usr_id: req.usr_id}
  console.log("Getting summary")

  Dashboard.summary(params, function (err, asset) {
    if (err) {
      res.status(500).send(err)
    }
    console.log(res);
    //res.status(200).send({state: "Success", ast_id: asset.insertId});
  })
}
