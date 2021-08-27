var express = require('express');
const { authJwt } = require("../middlewares");
var router = express.Router();
var user = require('../controllers/UserController')
var auth = require('../controllers/AuthController')


router.post('/register', auth.register);

router.post('/login', auth.login);

module.exports = router;
