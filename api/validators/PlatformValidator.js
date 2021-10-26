const { checkMinLength, checkColor, checkDexAvailable } = require("../helpers/ValidationHelper");

exports.validatePlatform = async function(req, res, next) {
    if(checkMinLength(res, "Name of the platform", req.body.name, 3)) {return}
    if(req.body.dex_id) {
        if(await checkDexAvailable(res, req.body.dex_id)) {return}
    }
    if(checkColor(res, req.body.color)) {return}
    next();
}
