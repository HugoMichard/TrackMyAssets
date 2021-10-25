const { checkMinLength, checkColor, checkUserCategory } = require("../helpers/ValidationHelper");

exports.validateCategory = async function(req, res, next) {
    if(checkMinLength(res, "Name of the category", req.body.name, 3)) {return}
    if(req.params.cat_id) {
        if(await checkUserCategory(res, req.usr_id, req.body.cat_id)) {return}
    }
    if(checkColor(res, req.body.color)) {return}
    next();
}
