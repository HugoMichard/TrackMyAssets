const { checkUserOrder, checkUserAsset, checkUserPlatform, checkUserCategory, checkUserWire } = require("../helpers/ValidationHelper");

exports.validateUserPlatform = async function(req, res, next) {
    if(await checkUserPlatform(res, req.usr_id, req.params.plt_id)) {return}
    next();
}

exports.validateUserAsset = async function(req, res, next) {
    if(await checkUserAsset(res, req.usr_id, req.params.ast_id)) {return}
    next();
}

exports.validateUserOrder = async function(req, res, next) {
    if(await checkUserOrder(res, req.usr_id, req.params.ord_id)) {return}
    next();
}

exports.validateUserCategory = async function(req, res, next) {
    if(await checkUserCategory(res, req.usr_id, req.params.cat_id)) {return}
    next();
}

exports.validateUserWire = async function(req, res, next) {
    if(await checkUserWire(res, req.usr_id, req.params.wir_id)) {return}
    next();
}
