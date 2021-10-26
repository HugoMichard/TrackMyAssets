var express = require('express');
var router = express.Router();
var asset = require('../controllers/AssetController')
const { authJwt } = require("../middlewares");
const { userPropertyValidator, assetValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get("/getAssetsOwned", asset.getAssetsOwned);

router.post("/", assetValidator.validateAsset, asset.create);
router.get('/', asset.search);

router.get("/:ast_id", userPropertyValidator.validateUserAsset, asset.getDetail);
router.post("/:ast_id", [userPropertyValidator.validateUserAsset, assetValidator.validateAsset], asset.update);
router.delete("/:ast_id", userPropertyValidator.validateUserAsset, asset.delete);


module.exports = router;
