const { checkMinLength, checkEmail} = require("../helpers/ValidationHelper")

exports.validateLogin = async function(req, res, next) {
    if(checkEmail(res, req.body.email)) {return};
    if(checkMinLength(res, "Password", req.body.password, 3)) {return}
    next();
}
