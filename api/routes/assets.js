var express = require('express');
var router = express.Router();
var asset = require('../controllers/AssetController')
const { authJwt } = require("../middlewares");

router.get('/', asset.search);

router.post("/", authJwt.verifyToken, asset.create);

router.get("/:astId", asset.getDetail);


module.exports = router;
