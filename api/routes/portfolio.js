var express = require('express');
var router = express.Router();
var portfolio = require('../controllers/PortfolioController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/getPortfolioValueHistory', portfolio.getPortfolioValueHistory);

module.exports = router;
