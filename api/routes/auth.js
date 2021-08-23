var express = require('express');
const { authJwt } = require("../middlewares");
var router = express.Router();
var auth = require('../controllers/AuthController')


router.post('/register', auth.register);

router.post('/login', auth.login);

router.get('/checkAuth', function (req, res) {
    authJwt.verifyToken(req, res)
}, function (req, res) {
  auth.checkAuth(req, res)
});

module.exports = router;
