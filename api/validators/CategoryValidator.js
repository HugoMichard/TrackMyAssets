const { checkMinLength, checkColor, checkUserCategory } = require("../helpers/ValidationHelper");

exports.validateCategory = async function(req, res, next) {
    if(checkMinLength(res, "Name of the category", req.body.name, 3)) {return}
    if(checkColor(res, req.body.color)) {return}
    next();
}
