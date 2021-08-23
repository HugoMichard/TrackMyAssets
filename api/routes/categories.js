var express = require('express');
var router = express.Router();
var category = require('../controllers/CategoryController')
const { authJwt } = require("../middlewares");

router.get('/', authJwt.verifyToken, category.search);

router.post("/", authJwt.verifyToken, category.create);

router.get("/:cat_id", authJwt.verifyToken, category.getDetail);
router.post("/:cat_id", authJwt.verifyToken, category.update);


module.exports = router;
