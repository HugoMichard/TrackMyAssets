const userPropertyValidator = require("./UserPropertyValidator");
const registrationValidator = require("./RegistrationValidator");
const loginValidator = require("./LoginValidator");
const assetValidator = require("./AssetValidator");
const categoryValidator = require("./CategoryValidator");
const platformValidator = require("./PlatformValidator");
const wireValidator = require("./WireValidator");
const orderValidator = require("./OrderValidator");

module.exports = {
    assetValidator,
    categoryValidator,
    loginValidator,
    orderValidator,
    platformValidator,
    registrationValidator,
    userPropertyValidator,
    wireValidator
};