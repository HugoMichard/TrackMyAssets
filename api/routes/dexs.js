var express = require('express');
var router = express.Router();
var dex = require('../controllers/DexController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/wallets', dex.searchWallets);

router.get('/platforms', dex.searchPlatformDexs);

router.get('/', dex.search);


module.exports = router;
