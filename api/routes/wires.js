var express = require('express');
var router = express.Router();
var wire = require('../controllers/WireController')
const { authJwt } = require("../middlewares");
const { userPropertyValidator, wireValidator } = require("../validators")

router.use(authJwt.verifyToken)

router.get("/getSummary", wire.getSummary);
router.get("/:wir_id", userPropertyValidator.validateUserWire, wire.getDetail);
router.post("/:wir_id", [userPropertyValidator.validateUserWire, wireValidator.validateWire], wire.update);
router.post("/", wireValidator.validateWire, wire.create);
router.delete("/:wir_id", userPropertyValidator.validateUserWire, wire.delete);
router.get('/', wire.search);


module.exports = router;
