var express = require('express');
var router = express.Router();
var user = require('../controllers/UserController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  resultat = user.search(req, res);
  console.log(resultat);
  res.send('respond with a resource');
});

router.get('/register', function(req, res) {
  resultat = user.register(req, res);
  console.log(resultat);
  res.send('created user');
});

module.exports = router;
