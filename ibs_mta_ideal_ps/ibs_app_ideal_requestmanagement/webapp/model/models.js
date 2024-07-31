sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime info for the device the UI5 app is running on as JSONModel
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        createPropertyModel: function () {
            var oPropertyModel = {
                "iconTabFilterSelected": "Pending"
            };
            var oModel = new JSONModel(oPropertyModel);
            return oModel;
        }
    };

});