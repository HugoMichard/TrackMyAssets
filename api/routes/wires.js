var express = require('express');
var router = express.Router();
var wire = require('../controllers/WireController')
const { authJwt } = require("../middlewares");
const { wireValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get("/getSummary", wire.getSummary);
router.get("/:wir_id", wire.getDetail);
router.post("/:wir_id", wireValidator.validateWire, wire.update);
router.post("/", wireValidator.validateWire, wire.create);
router.delete("/:wir_id", wire.delete);
router.get('/', wire.search);


module.exports = router;
