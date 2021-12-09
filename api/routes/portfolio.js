var express = require('express');
var router = express.Router();
var portfolio = require('../controllers/PortfolioController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/refresh', portfolio.refresh);

// overview page
router.get('/getPlusValueHistory', portfolio.getPlusValueHistory);

// investments page
router.get('/getInvestments', portfolio.getInvestments);
router.get('/getInvestmentsSummary', portfolio.getInvestmentsSummary);
router.get('/getCumulativeInvestmentsWithValue', portfolio.getCumulativeInvestmentsWithValue);

// realised page
router.get('/getProfitsRealised', portfolio.getProfitsRealised);


module.exports = router;
