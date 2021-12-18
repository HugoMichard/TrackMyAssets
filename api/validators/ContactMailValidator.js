const { checkMinLength, checkEmail } = require("../helpers/ValidationHelper");

exports.validateContactMail = async function(req, res, next) {
    if(checkMinLength(res, "Name", req.body.name, 3)) {return}
    if(checkMinLength(res, "Message", req.body.message, 3)) {return}
    if(checkEmail(res, req.body.email)) {return}
    next();
}
