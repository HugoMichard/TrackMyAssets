const registrationValidator = require("./RegistrationValidator");
const loginValidator = require("./LoginValidator");
const assetValidator = require("./AssetValidator");
const categoryValidator = require("./CategoryValidator");
const platformValidator = require("./PlatformValidator");
const wireValidator = require("./WireValidator");

module.exports = {
    assetValidator,
    categoryValidator,
    loginValidator,
    platformValidator,
    registrationValidator,
    wireValidator
};