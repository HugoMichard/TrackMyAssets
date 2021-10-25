var express = require('express');
var router = express.Router();
var asset = require('../controllers/AssetController')
const { authJwt } = require("../middlewares");
const { assetValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get("/getAssetsOwned", asset.getAssetsOwned);

router.post("/", assetValidator.validateAsset, asset.create);
router.get('/', asset.search);

router.get("/:ast_id", asset.getDetail);
router.post("/:ast_id", assetValidator.validateAsset, asset.update);
router.delete("/:ast_id", asset.delete);


module.exports = router;
