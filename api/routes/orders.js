var express = require('express');
var router = express.Router();
var order = require('../controllers/OrderController')
const { authJwt } = require("../middlewares");

router.get('/', authJwt.verifyToken, order.search);

router.post("/", authJwt.verifyToken, order.create);

router.get("/:ord_id", authJwt.verifyToken, order.getDetail);
router.post("/:ord_id", authJwt.verifyToken, order.update);
router.delete("/:ord_id", authJwt.verifyToken, order.delete);


module.exports = router;
