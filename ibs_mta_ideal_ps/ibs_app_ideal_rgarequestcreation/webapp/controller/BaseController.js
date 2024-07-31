sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";``
	var context;
	return Controller.extend("com.ibs.ibsappidealrgarequestcreation.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		// errorLogCreation: function (errorMsg, errorCode, REG_NO, USER_ID,TYPE) {
			
		// 	context = this;
		// 	var aErrorLog = [];
		// 	// var Path = '/iVen_EDGE/VENDOR_PORTAL/XSJS/ERROR_HANDLING.xsjs?ACTION=CREATE'
		// 	var sType = TYPE
		// 	if (sType == undefined || sType == null || sType == "") {
        //          	sType = "APP"
		// 	}
		// 	var oErrorLog = {
		// 		"ERROR_CODE": errorCode || null,
		// 		"ERROR_DESC": errorMsg || null,
		// 		"REG_NO": REG_NO || null,
		// 		"USER_ID": USER_ID || null,
		// 		"APP_NAME": "Claim Approval",
		// 		"TYPE": sType
		// 	}
		// 	aErrorLog.push(oErrorLog);
		// 	var Payload = {
		// 		"VALUE": {
		// 			"ERRORLOG": aErrorLog
		// 		}
		// 	}

		// 	context.ajaxCall(Path, Payload);
		// },

		isValidJsonString: function (sDataString) {
			var value = null;
			var oArrObj = null;
			var sErrorMessage = "";
			try {
				if (sDataString === null || sDataString === "" || sDataString === undefined) {
					throw "No data found.";
				}

				value = JSON.parse(sDataString);
				if (toString.call(value) === '[object Object]' && Object.keys(value).length > 0) {
					return true;
				} else {
					throw "Error";
				}
			} catch (errorMsg) {
				if (errorMsg === "No data found.") {
					sErrorMessage = errorMsg;
				} else {
					sErrorMessage = "Invalid JSON data."
				}
				return false;
			}
			return true;
		},
		ajaxCall: function (path, payload) {
			// BusyIndicator.show();
			var that = this;
			var data = JSON.stringify(payload);

			$.ajax({
				url: path,
				type: 'POST',
				data: data,
				contentType: 'application/json',
				async: false,
				success: function (oData, response) {
					// BusyIndicator.hide();
					var resposeObj = JSON.parse(oData);
					if (payload.VALUE.STEP_NO === 6) {
						MessageBox.success(resposeObj.Message, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
									//	context.closeDialog();
									context.onBack();
								}

							}
						});

					} else {
						MessageToast.show(resposeObj.Message);
					}
				},
				error: function (error) {
					// BusyIndicator.hide();
					var oXML = JSON.parse(error.responseText);
					var oXMLMsg = oXML.error["message"].value;
					MessageBox.error(oXMLMsg);
				}
			});
		},
		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		}

	});

});