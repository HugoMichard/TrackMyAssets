const userPropertyValidator = require("./UserPropertyValidator");
const registrationValidator = require("./RegistrationValidator");
const loginValidator = require("./LoginValidator");
const assetValidator = require("./AssetValidator");
const categoryValidator = require("./CategoryValidator");
const platformValidator = require("./PlatformValidator");
const wireValidator = require("./WireValidator");
const orderValidator = require("./OrderValidator");
const contactMailValidator = require("./ContactMailValidator");

module.exports = {
    assetValidator,
    categoryValidator,
    contactMailValidator,
    loginValidator,
    orderValidator,
    platformValidator,
    registrationValidator,
    userPropertyValidator,
    wireValidator
};