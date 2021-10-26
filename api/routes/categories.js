var express = require('express');
var router = express.Router();
var category = require('../controllers/CategoryController')
const { authJwt } = require("../middlewares");
const { userPropertyValidator, categoryValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get("/getUserAssetsInEachCat", category.getUserAssetsInEachCat);
router.get("/getPortfolioValueForeachCat", category.getPortfolioValueForeachCat);
router.get("/getPortfolioValueForeachType", category.getPortfolioValueForeachType);
router.get("/:cat_id", userPropertyValidator.validateUserCategory, category.getDetail);
router.get('/', category.search);

router.post("/:cat_id", [userPropertyValidator.validateUserCategory, categoryValidator.validateCategory], category.update);
router.post("/", categoryValidator.validateCategory, category.create);


module.exports = router;
