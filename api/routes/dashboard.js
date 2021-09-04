var express = require('express');
var router = express.Router();
var dashboard = require('../controllers/DashboardController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/summary', dashboard.summary);
router.get('/getPortfolioValueHistory', dashboard.getPortfolioValueHistory);

module.exports = router;
