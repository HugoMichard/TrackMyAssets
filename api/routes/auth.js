var express = require('express');
var router = express.Router();
var auth = require('../controllers/AuthController')
const { registrationValidator, loginValidator } = require("../validators")

router.post('/register', registrationValidator.validateRegistration, auth.register);

router.post('/login', loginValidator.validateLogin, auth.login);

module.exports = router;
