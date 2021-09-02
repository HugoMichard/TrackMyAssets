var express = require('express');
var router = express.Router();
var history = require('../controllers/HistoryController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get("/asset/:ast_id", history.getAssetHistory);


module.exports = router;
