var express = require('express');
var router = express.Router();
var asset = require('../controllers/AssetController')
const { authJwt } = require("../middlewares");

router.get('/', authJwt.verifyToken, asset.search);

router.post("/", authJwt.verifyToken, asset.create);

router.get("/:ast_id", authJwt.verifyToken, asset.getDetail);
router.post("/:ast_id", authJwt.verifyToken, asset.update);


module.exports = router;
