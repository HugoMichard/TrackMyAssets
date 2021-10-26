const { checkDate, checkBoolean, checkUserAsset, checkUserPlatform, checkFloat } = require("../helpers/ValidationHelper");

exports.validateOrder = async function(req, res, next) {
    if(checkBoolean(res, req.body.isBuy)) {return}
    if(checkDate(res, req.body.execution_date)) {return}
    if(checkFloat(res, "Quantity", req.body.quantity)) {return}
    if(checkFloat(res, "Fees", req.body.fees)) {return}
    if(checkFloat(res, "Price", req.body.price)) {return}

    if(await checkUserPlatform(res, req.usr_id, req.body.plt_id)) {return}
    if(await checkUserAsset(res, req.usr_id, req.body.ast_id)) {return}
    next();
}
