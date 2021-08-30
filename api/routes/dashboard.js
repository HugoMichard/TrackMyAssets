var express = require('express');
var router = express.Router();
var dashboard = require('../controllers/DashboardController')
const { authJwt } = require("../middlewares");

router.get('/summary', authJwt.verifyToken, dashboard.summary);

module.exports = router;
