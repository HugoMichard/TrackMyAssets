const { checkDate, checkFloat, checkBoolean } = require("../helpers/ValidationHelper");

exports.validateWire = async function(req, res, next) {
    if(checkFloat(res, "Amount", req.body.amount)) {return}
    if(checkDate(res, req.body.execution_date)) {return}
    if(checkBoolean(res, req.body.isIn)) {return}
    next();
}
