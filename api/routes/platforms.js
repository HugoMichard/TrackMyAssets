var express = require('express');
var router = express.Router();
var platform = require('../controllers/PlatformController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get("/getPortfolioValueForeachPlt", platform.getPortfolioValueForeachPlt);
router.get("/getUserAssetsInEachPlt", platform.getUserAssetsInEachPlt);
router.get("/:plt_id", platform.getDetail);
router.get('/', platform.search);

router.post("/", platform.create);
router.post("/:plt_id", platform.update);


module.exports = router;
