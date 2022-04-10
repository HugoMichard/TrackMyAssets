var express = require('express');
var router = express.Router();
var platform = require('../controllers/PlatformController')
const { authJwt } = require("../middlewares");
const { userPropertyValidator, platformValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get("/getPortfolioValueForeachPlt", platform.getPortfolioValueForeachPlt);
router.get("/:plt_id", userPropertyValidator.validateUserPlatform, platform.getDetail);
router.get('/', platform.search);

router.post("/:plt_id", [userPropertyValidator.validateUserPlatform, platformValidator.validatePlatform], platform.update);
router.post("/", platformValidator.validatePlatform, platform.create);


module.exports = router;
