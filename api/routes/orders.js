var express = require('express');
var router = express.Router();
var order = require('../controllers/OrderController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.get('/', order.search);

router.post("/", order.create);

router.get("/:ord_id", order.getDetail);
router.post("/:ord_id", order.update);
router.delete("/:ord_id", order.delete);


module.exports = router;
