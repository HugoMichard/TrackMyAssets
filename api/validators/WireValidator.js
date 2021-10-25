const { checkDate, checkUserWire, checkFloat, checkBoolean } = require("../helpers/ValidationHelper");

exports.validateWire = async function(req, res, next) {
    if(req.params.wir_id) {
        if(await checkUserWire(res, req.usr_id, req.body.wir_id)) {return}
    }
    if(checkFloat(res, "Amount", req.body.amount)) {return}
    if(checkDate(res, req.body.execution_date)) {return}
    if(checkBoolean(res, req.body.isIn)) {return}
    next();
}
