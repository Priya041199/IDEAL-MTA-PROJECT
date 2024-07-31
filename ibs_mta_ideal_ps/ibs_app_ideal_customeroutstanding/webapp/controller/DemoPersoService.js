sap.ui.define([
	"jquery.sap.global"
], function (jQuery) {

	// Very simple page-context personalization
	// persistence service, not for productive use!

	var DemoPersoService = {

		oData: {
			_persoSchemaVersion: "1.0",
			aColumns: [

				{
					id: "demoApp-productsTable-p10",
					order: 9,
					text: "Billing Doc.",
					visible: false
				}, {
					id: "demoApp-productsTable-p11",
					order: 10,
					text: "Posting Date",
					visible: false
				}, {
					id: "demoApp-productsTable-p12",
					order: 11,
					text: "Account Type",
					visible: false
				}
			]

		},
		getPersData: function () {
			var oDeferred = new jQuery.Deferred();
			if (!this._oBundle) {
				this._oBundle = this.oData;
			}
			var oBundle = this._oBundle;
			oDeferred.resolve(oBundle);
			return oDeferred.promise();
		},
		setPersData: function (oBundle) {
			var oDeferred = new jQuery.Deferred();
			this._oBundle = oBundle;
			oDeferred.resolve();
			return oDeferred.promise();
		}

	};
	return DemoPersoService;

});

// /*
//  * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
//  */
// sap.ui.define(["sap/fin/arp/lib/lineitems/controller/AbstractController", "sap/m/MessageBox"], function (A, M) {
// 		"use strict";
// 		var S = sap.fin.arp.lib.lineitems.controller.AbstractController.extend("fin.ar.lineitems.display.view.S1", {
// 			constructor: function () {
// 				A.apply(this, arguments);
// 				this.sLocalContainerKey = "fin.ar.lineitems";
// 				this.sPrefix = "fin.ar.lineitems.display";
// 				this.sIconPath = "sap-icon://Fiori5/F0711";
// 				this.sOwnSemanticObject = "Customer";
// 				this.sCustomerVendorItemTypeKey = "V";
// 				this.initDeferred = jQuery.Deferred();
// 			},
// 			onInit: function () {
// 				A.prototype.onInit.apply(this, arguments);
// 				this.setExtendedFooterOptions();
// 			},
// 			onExit: function () {
// 				this.cleanUpNavController();
// 			},
// 			onInitSmartFilterBar: function () {
// 				var t = this;
// 				this.initDeferred.done(function () {
// 					A.prototype.onInitSmartFilterBar.apply(t, arguments);
// 					t.checkForNavigation();
// 				});
// 			},
// 			onNavTargetsObtained: function (e) {
// 				this.openPopover(e, this.oi18n.getText("POPOVER_CLI_LINK"));
// 			},
// 			onBeforePopoverOpens: function (e) {
// 				var c = e.getParameters().semanticAttributes.Customer;
// 				var a = "/Customers(CustomerId='" + en +
// 					codeURIComponent(c) + "')";
// 				this.createPopoverContent(e, a);
// 			},
// 			onButtonPressedSendCorrespondence: function () {
// 				if (this.aSelectedKeys.length <= this.MAX_NUMBER_OF_ITEMS) {
// 					this.sendCorrespondence("D", "Customer");
// 				} else {
// 					M.information(this.oi18nLib.getText("NO_ITEM_CHANGE_LIMIT ", this.MAX_NUMBER_OF_ITEMS));
// 				}
// 			},
// 			onBeforeRendering: function () {
// 				this.onBeforeViewRendering();

// 			},

// 			setExtendedFooterOptions: function () {
// 				if (this.extHookModifyFooterOptions) {
// 					var o = this.extHookModifyFooterOptions({
// 						buttonList: []
// 					});
// 					if (o.buttonList && o.buttonLi +
// 						st.length > 0) {
// 						this.addExtensionButtons(o);
// 					}
// 				}
// 			}
// 		});
// 		return S;
// 	},
// 	true);

// sap.ui.define(["sap/fin/arp/lib/lineitems/controller/AbstractController"], function (A) {
// 	"use strict";
// 	return A.extend("fin.ar.lineitems.display.App", {
// 		onInit: function () {
// 			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
// 		}
// 	});
// });