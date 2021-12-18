var express = require('express');
const { authJwt } = require("../middlewares");
const { contactMailValidator } = require("../validators")
var router = express.Router();
var user = require('../controllers/UserController')

router.get('/getLastRefresh', authJwt.verifyToken, user.getLastRefresh);

router.post('/sendContactMail', contactMailValidator.validateContactMail, user.sendContactMail);

module.exports = router;
