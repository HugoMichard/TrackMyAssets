var express = require('express');
var router = express.Router();
var wire = require('../controllers/WireController')
const { authJwt } = require("../middlewares");

router.use(authJwt.verifyToken)

router.post("/", wire.create);
router.get("/getSummary", wire.getSummary);
router.get("/:wir_id", wire.getDetail);
router.post("/:wir_id", wire.update);
router.delete("/:wir_id", wire.delete);
router.get('/', wire.search);


module.exports = router;
