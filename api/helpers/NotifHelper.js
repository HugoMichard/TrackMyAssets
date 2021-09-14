exports.getNotif = function (label, values) {
    values = values ? values : []
    return notifMessage(values)[label]
}

const notifMessage = function (values) {
    return {
        createOrderSuccess: {text :`Order created successfully`, color: "success"},
        updateOrderSuccess: {text :`Order updated successfully`, color: "success"},
        createAssetSuccess: {text :`Asset ${values[0]} created successfully`, color: "success"},
        updateAssetSuccess: {text :`Asset ${values[0]} updated successfully`, color: "success"},
        createCategorySuccess: {text :`Category ${values[0]} created successfully`, color: "success"},
        updateCategorySuccess: {text :`Category ${values[0]} updated successfully`, color: "success"},
        createPlatformSuccess: {text :`Platform ${values[0]} created successfully`, color: "success"},
        updatePlatformSuccess: {text :`Platform ${values[0]} updated successfully`,  color: "success"}
    }
}
