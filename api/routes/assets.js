var express = require('express');
var router = express.Router();
var asset = require('../controllers/AssetController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/', asset.search);

router.post("/", asset.create);

router.get("/:ast_id", asset.getDetail);
router.post("/:ast_id", asset.update);


module.exports = router;
