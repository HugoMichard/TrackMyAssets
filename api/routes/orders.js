var express = require('express');
var router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: '/tmp' });
var order = require('../controllers/OrderController')
const { authJwt } = require("../middlewares");
const { userPropertyValidator, orderValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get('/getOrdersOfAsset/:ast_id', order.getOrdersOfAsset);
router.get('/getBuyingQuantityOfAssetByDay/:ast_id', order.getBuyingQuantityOfAssetByDay);

router.post("/upload/validate", order.validateUploadCsv);
router.post("/upload", upload.single('csvfile'), order.uploadCsv);
router.post("/:ord_id", [userPropertyValidator.validateUserOrder, orderValidator.validateOrder], order.update);
router.post("/", orderValidator.validateOrder, order.create);

router.get("/:ord_id", userPropertyValidator.validateUserOrder, order.getDetail);
router.delete("/:ord_id", userPropertyValidator.validateUserOrder, order.delete);
router.get('/', order.search);


module.exports = router;
