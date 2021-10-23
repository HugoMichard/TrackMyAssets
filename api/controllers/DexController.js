var Dex = require('../models/Dex')
var notifHelper = require('../helpers/NotifHelper');


exports.search = function (req, res) {
  Dex.search(function (err, dexs) {
    if (err) {
        res.status(500).send({ message: err.message});
    } else {
        res.status(200).send({dexs: dexs});
    }
  })
}


exports.searchPlatformDexs = function (req, res) {
    req.query.usr_id = req.usr_id
    Dex.searchPlatformDexs(req.query, function (err, dexs) {
      if (err) {
          res.status(500).send({ message: err.message });
      } else {
          res.status(200).send({dexs: dexs});
      }
    })
  }


exports.searchWallets = function (req, res) {
    req.query.usr_id = req.usr_id
    Dex.searchWallets(req.query, function (err, wallets) {
      if (err) {
          res.status(500).send({ message: err.message});
      } else {
          res.status(200).send({wallets: wallets});
      }
    })
}
