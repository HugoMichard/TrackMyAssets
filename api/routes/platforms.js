var express = require('express');
var router = express.Router();
var platform = require('../controllers/PlatformController')
const { authJwt } = require("../middlewares");
const { platformValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get("/getPortfolioValueForeachPlt", platform.getPortfolioValueForeachPlt);
router.get("/getUserAssetsInEachPlt", platform.getUserAssetsInEachPlt);
router.get("/:plt_id", platform.getDetail);
router.get('/', platform.search);

router.post("/", platformValidator.validatePlatform, platform.create);
router.post("/:plt_id", platformValidator.validatePlatform, platform.update);


module.exports = router;
