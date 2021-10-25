const User = require("../models/User");
const Dex = require("../models/Dex");


function raiseValidationError(res, message) {
    res.status(422).send({notif: {color: "danger", text: message}})
    return true;
}

function makePromiseToCheckIfDataIsInDB(res, toCheck, dataToCheck, errorMessage) {
    return new Promise((resolve, reject) => {
        toCheck(dataToCheck, function(err, result) {
            if(result.length === 0) {
                resolve(raiseValidationError(res, errorMessage))
            } else {
                resolve(false)
            }
        })
    });
}


exports.checkMinLength = function (res, field, str, minLen) {
    if(typeof str !== "string") {
        return raiseValidationError(res, `${field} must be a string`)
    }
    if(str.length < minLen) {
        return raiseValidationError(res, `${field} must be at least ${minLen} characters`)
    }
}

exports.checkEmail = function(res, str) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValid = re.test(String(str).toLowerCase());
    if(!isValid) {
        return raiseValidationError(res, "Invalid email")
    }
}

exports.checkEmailDoesNotExists = function(res, str) {
    return new Promise((resolve, reject) => {
        User.checkEmailExists(str, function(err, result) {
            if(result.length > 0) {
                resolve(raiseValidationError(res, "Email already exists"))
            } else {
                resolve(false)
            }
        })
    });
}

exports.checkPasswordsMatch = function(res, password, password_confirmation) {
    if(password !== password_confirmation) {
        return raiseValidationError(res, "Passwords do not match");
    }
}

function checkPositiveInt(res, field, int) {
    const parsed = parseInt(int);
    if(isNaN(parsed)) {
        return raiseValidationError(res, `${field} is invalid`);
    }
    if(parsed !== parseFloat(int)) {
        return raiseValidationError(res, `${field} is invalid`);
    }
    if(parsed <= 0) {
        return raiseValidationError(res, `${field} is invalid`);
    }
}
exports.checkPositiveInt = checkPositiveInt;

exports.checkFloat = function(res, field, float) {
    if(isNaN(parseFloat(float))) {
        return raiseValidationError(res, `${field} must be a floating-point number`)
    }
}

exports.checkColor = function(res, color) {
    if(color[0] !== "#" || color.length !== 7) {
        return raiseValidationError(res, 'Color selected is invalid');
    }
}

exports.checkDate = function(res, date) {
    if(new Date(date) == "Invalid Date") {
        return raiseValidationError(res, 'Date selected is invalid');
    }
}

exports.checkBoolean = function(res, bool) {
    if(typeof bool !== "boolean") {
        return raiseValidationError(res, 'Invalid data');
    }
}

exports.checkAssetType = function(res, ast_type) {
    if(ast_type !== "crypto" && ast_type !== "stock" && ast_type !== "fix") {
        return raiseValidationError(res, "Invalid asset type")
    }
}

exports.checkUserPlatform = function(res, usr_id, str) {
    if(checkPositiveInt(res, "Platform", str)) {return true;}
    return makePromiseToCheckIfDataIsInDB(res, User.checkUserHasPlatform, {plt_id: str, usr_id: usr_id}, "You do not have this platform");
}

exports.checkUserCategory = function(res, usr_id, str) {
    if(checkPositiveInt(res, "Category", str)) {return true;}
    return makePromiseToCheckIfDataIsInDB(res, User.checkUserHasCategory, {cat_id: str, usr_id: usr_id}, "You do not have this category");
}

exports.checkUserAsset = function(res, usr_id, str) {
    if(checkPositiveInt(res, "Asset", str)) {return true;}
    return makePromiseToCheckIfDataIsInDB(res, User.checkUserHasAsset, {ast_id: str, usr_id: usr_id}, "You do not have this asset");
}

exports.checkDexAvailable = function(res, str) {
    if(checkPositiveInt(res, "Dex", str)) {return true;}
    return makePromiseToCheckIfDataIsInDB(res, Dex.checkDexAvailable, str, "This dex is not available");
}
