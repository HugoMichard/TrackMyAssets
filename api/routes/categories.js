var express = require('express');
var router = express.Router();
var category = require('../controllers/CategoryController')
const { authJwt } = require("../middlewares");
const { categoryValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get("/getUserAssetsInEachCat", category.getUserAssetsInEachCat);
router.get("/getPortfolioValueForeachCat", category.getPortfolioValueForeachCat);
router.get("/getPortfolioValueForeachType", category.getPortfolioValueForeachType);
router.get("/:cat_id", category.getDetail);
router.get('/', category.search);

router.post("/", categoryValidator.validateCategory, category.create);
router.post("/:cat_id", categoryValidator.validateCategory, category.update);


module.exports = router;
