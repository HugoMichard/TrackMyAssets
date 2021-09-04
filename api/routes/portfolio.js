var express = require('express');
var router = express.Router();
var portfolio = require('../controllers/PortfolioController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/refresh', portfolio.refresh);
router.get('/getPlusValueHistory', portfolio.getPlusValueHistory);
router.get('/getPlusValueSummary', portfolio.getPlusValueSummary);

module.exports = router;
