var express = require('express');
var router = express.Router();
var category = require('../controllers/CategoryController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/', category.search);

router.post("/", category.create);

router.get("/:cat_id", category.getDetail);
router.post("/:cat_id", category.update);


module.exports = router;
