const { checkMinLength, checkAssetType, checkUserCategory, checkFloat, checkUserPlatform, checkCoin } = require("../helpers/ValidationHelper");

exports.validateAsset = async function(req, res, next) {
    if(checkMinLength(res, "Name of the asset", req.body.name, 3)) {return}
    if(checkAssetType(res, req.body.ast_type)) {return};
    if(await checkUserCategory(res, req.usr_id, req.body.cat_id)) {return}
    if(req.body.ast_type !== "dex") {req.body.plt_id = null}
    if(req.body.ast_type === "fix") {
        if(checkFloat(res, "Fixed Value", req.body.fix_vl)) {return}
    }
    if(req.body.ast_type === "dex") {
        if(await checkUserPlatform(res, req.usr_id, req.body.plt_id)) {return}  
    }
    if(req.body.ast_type === "crypto") {
        if(checkCoin(res, req.body.coin, req.body.cmc_id, req.body.duplicate_nbr, req.body.cmc_official_id)) {return}
    }
    if(req.body.ast_type === "stock") {
        if(checkMinLength(res, "Ticker", req.body.coin, 3)) {return}
    }
    next();
}
