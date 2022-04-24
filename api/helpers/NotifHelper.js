exports.getNotif = function (label, values) {
    values = values ? values : []
    return notifMessage(values)[label]
}

const notifMessage = function (values) {
    return {
        failLogin: {text :`No user found with this email/password`, color: "danger"},
        successLogin: {text :`Login successful`, color: "success"},
        failRegistration: {text :`Error during user registration`, color: "danger"},
        successRegistration: {text :`Registration successful. You can now login`, color: "success"},
        createOrderSuccess: {text :`Order created successfully`, color: "success"},
        updateOrderSuccess: {text :`Order updated successfully`, color: "success"},
        deleteOrderSuccess: {text :`Order deleted successfully`, color: "success"},
        deleteOrderFail: {text :`Error during order deletion`, color: "danger"},
        createOrderBatchSuccess: {text: `${values[0]} orders have been created successfully`, color: "success"},
        createOrderBatchNoOrders: {text :`No new orders to create`, color: "danger"},
        createOrderBatchFail: {text :`Creating orders failed`, color: "danger"},
        deleteOrdersLinkToAssetFail: {text :`Error during deletion of orders linked to the asset`, color: "danger"},
        createWireSuccess: {text :`Wire created successfully`, color: "success"},
        updateWireSuccess: {text :`Wire updated successfully`, color: "success"},
        createAssetSuccess: {text :`Asset ${values[0]} created successfully`, color: "success"},
        updateAssetSuccess: {text :`Asset ${values[0]} updated successfully`, color: "success"},
        deleteAssetSuccess: {text :`Asset deleted successfully`, color: "success"},
        deleteAssetFail: {text :`Error during asset deletion`, color: "danger"},
        createCategorySuccess: {text :`Category ${values[0]} created successfully`, color: "success"},
        updateCategorySuccess: {text :`Category ${values[0]} updated successfully`, color: "success"},
        createPlatformSuccess: {text :`Platform ${values[0]} created successfully`, color: "success"},
        updatePlatformSuccess: {text :`Platform ${values[0]} updated successfully`,  color: "success"},
        sendContactMailSuccess: {text :`Email sent successfully. We'll reach back to you soon !`,  color: "success"}
    }
}
