const { checkMinLength, checkColor, checkUserPlatform, checkDexAvailable } = require("../helpers/ValidationHelper");

exports.validatePlatform = async function(req, res, next) {
    if(checkMinLength(res, "Name of the platform", req.body.name, 3)) {return}
    if(req.params.plt_id) {
        if(await checkUserPlatform(res, req.usr_id, req.body.plt_id)) {return}
    }
    if(req.body.dex_id) {
        if(await checkDexAvailable(res, req.body.dex_id)) {return}
    }
    if(checkColor(res, req.body.color)) {return}
    next();
}
