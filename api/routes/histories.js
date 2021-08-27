var express = require('express');
var router = express.Router();
var history = require('../controllers/HistoryController')
const { authJwt } = require("../middlewares");

router.get("/asset/:ast_id", authJwt.verifyToken, history.getAssetHistory);


module.exports = router;
