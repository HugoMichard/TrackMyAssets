var express = require('express');
const { authJwt } = require("../middlewares");
var router = express.Router();
var user = require('../controllers/UserController')

router.get('/getLastRefresh', authJwt.verifyToken, user.getLastRefresh);

module.exports = router;
