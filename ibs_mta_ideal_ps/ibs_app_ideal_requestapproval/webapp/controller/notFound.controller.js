sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";
    var that = null;
    var oView = null;
    return Controller.extend("com.ibs.ibsappidealrequestapproval.controller.notFound", {
        onInit: function () {
            that = this;
            oView = that.getView();
            that.oDataModel = this.getOwnerComponent().getModel("oData");
            var oRouter = this.getOwnerComponent().getRouter().getRoute("notFound");
            oRouter.attachPatternMatched(this.handleRouteMatched, this);
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        onNav: function () {
            that.getRouter().navTo("RouteMaster");
        },

        handleRouteMatched: function (oEvent) {
            that.reqNo = oEvent.getParameter("arguments").REQNO;
            var aFilter = [];
            aFilter = "(REQUEST_NO eq " + that.reqNo + ")";
            that.checkValidReqNo(aFilter);
        },

        checkValidReqNo: function (aFilter) {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			var appModulePath = jQuery.sap.getModulePath(appPath);
            var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo?$filter=" + aFilter;

			BusyIndicator.show();
            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                data: { $expand: 'TO_STATUS' },
                success: function (data) {
                    BusyIndicator.hide();
                    if (data.value.length === 0) {
                        that.getView().byId("msgPage").setIcon("sap-icon://search");
                        that.getView().byId("msgPage").setTitle("Not Found");
                        that.getView().byId("msgPage").setDescription("Please check the request number you are using to call the app");
                        that.getView().byId("msgPage").setText("Request not found");
                    } else {
                        that.getView().byId("msgPage").setIcon("sap-icon://search");
                        that.getView().byId("msgPage").setTitle("");
                        that.getView().byId("msgPage").setDescription("");
                        if (data.results[0].STATUS === 4 || data.results[0].STATUS === 6) {
                            that.getView().byId("msgPage").setText("Request no. " + that.reqNo + " is " + data.results[0].statusDesc.results[0].DESCRIPTION +
                                " status.");
                        } else if (data.results[0].STATUS === 11) {
                            that.getView().byId("msgPage").setText("Process for this reqeuest is completed.");
                        } else {
                            that.getView().byId("msgPage").setText("Request no. " + that.reqNo + " is in " + data.results[0].statusDesc.results[0].DESCRIPTION +
                                " status.");
                        }
                    }
                },
                error: function (error) {
                    BusyIndicator.hide();
                    MessageBox.warning("Error while reading RequestInfo data");
                }
            });
        }
    });
});