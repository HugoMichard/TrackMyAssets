const { checkMinLength, checkEmail, checkEmailDoesNotExists, checkPasswordsMatch} = require("../helpers/ValidationHelper")

exports.validateRegistration = async function(req, res, next) {
    if(checkMinLength(res, "First Name", req.body.firstname, 3)) {return}
    if(checkMinLength(res, "Last Name", req.body.lastname, 3)) {return}
    if(checkEmail(res, req.body.email)) {return};
    if(await checkEmailDoesNotExists(res, req.body.email)) {return}
    if(checkMinLength(res, "Password", req.body.password, 3)) {return}
    if(checkMinLength(res, "Password Confirmation", req.body.password_confirmation, 3)) {return}
    if(checkPasswordsMatch(res, req.body.password, req.body.password_confirmation)) {return}
    next();
}
