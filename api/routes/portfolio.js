var express = require('express');
var router = express.Router();
var portfolio = require('../controllers/PortfolioController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/refresh', portfolio.refresh);

// overview page
router.get('/getPlusValueHistory', portfolio.getPlusValueHistory);
router.get('/getPlusValueSummary', portfolio.getPlusValueSummary);

// investments page
router.get('/getInvestments', portfolio.getInvestments);
router.get('/getCumulativeInvestmentsWithValue', portfolio.getCumulativeInvestmentsWithValue);

module.exports = router;
