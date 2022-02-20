const { checkDate, checkBoolean, checkUserAsset, checkUserPlatform, checkFloat } = require("../helpers/ValidationHelper");

exports.validateOrder = async function(req, res, next) {
    // In case of buy / sell order
    if(isNaN(req.body.gtg_ast_id)) {
        if(checkBoolean(res, req.body.isBuy)) {return}
        if(checkFloat(res, "Fees", req.body.fees)) {return}
        if(checkFloat(res, "Price", req.body.price)) {return}
    } else {
        // In case of generation order
        if(await checkUserAsset(res, req.usr_id, req.body.gtg_ast_id)) {return}
    }

    if(checkFloat(res, "Quantity", req.body.quantity)) {return}
    if(checkDate(res, req.body.execution_date)) {return}

    if(await checkUserPlatform(res, req.usr_id, req.body.plt_id)) {return}
    if(await checkUserAsset(res, req.usr_id, req.body.ast_id)) {return}
    next();
}
