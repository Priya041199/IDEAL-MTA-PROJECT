sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/date/UI5Date"
],
function (Controller,MessageBox,JSONModel,BusyIndicator,UI5Date) {
    "use strict";
    var blanckJsonModel;
    var that;
    return Controller.extend("com.ibs.ibsappidealcreditdebitnote.controller.MasterPage", {
        onInit: function () {
            that = this;
            var blankObject = {
                "retailerName": null,
                "transType": null,
                "postDate": null,
                "amount": null,
                "refInvoice": null,
                "taxAmt": null,
                "refText" : null,
                "totAmt" : null
            };
            blanckJsonModel = new JSONModel(blankObject);
            that.getView().setModel(blanckJsonModel, "blankJson");

            this._data = {
                dtValue: UI5Date.getInstance(),
                dtPattern: undefined
            }
            var oModel = new JSONModel(this._data);
			this.getView().setModel(oModel,"currDate");
        },
        onChange: function (oEvent) {
			// debugger
			// /*var amt = parseInt(oEvent.getSource().getParent().getCells()[2].getValue());
			// var taxAmt = (amt * 18) / 100;
			// oEvent.getSource().getParent().getCells()[3].setText(taxAmt);
			// var total = amt + parseFloat(taxAmt);
			// oEvent.getSource().getParent().getCells()[4].setText(total);*/
			var amt = Number(this.getView().byId("amt").getValue());
            // if(amt !== NaN){
            var taxAmt = (amt * 18) / 100;
			this.getView().byId("taxAmt").setValue(taxAmt);
			var total = amt + parseFloat(taxAmt);
			this.getView().byId("tAmount").setValue(total);
			this.onEnabled(); 
                
            // }else{
            //     this.getView().byId("taxAmt").setValue("0");
            // }
			
		},
        onchangeTransType : function(){
        var transType = this.getView().byId("tType").getSelectedItem().getText();
        this.getView().getModel("blankJson").setProperty("/transType",transType)
        this.getView().byId("custform").setTitle(transType);
        },
        onEnabled: function(){
			// debugger;
			var ret = this.getView().byId("retlrId").getValue();
			var Inv = this.getView().byId("invoice").getValue(); 
			var Text = this.getView().byId("refText").getValue(); 
			var Amt = this.getView().byId("amt").getValue(); 

			if(ret == ""){
				this.getView().byId("sButton").setEnabled(false);
			}
			else if(Inv == ""){
				this.getView().byId("sButton").setEnabled(false);
			}
			else if(Text == ""){
				this.getView().byId("sButton").setEnabled(false);
			}
			else if(Amt == ""){
				this.getView().byId("sButton").setEnabled(false);
			}
			else{
				this.getView().byId("sButton").setEnabled(true);
			}
		},
        onDate: function(oEvent){
            var postDate1 = oEvent.getSource().mProperties.dateValue;
            this.getView().getModel("blankJson").setProperty("/postDate", postDate1);
        },
        handleValueHelp: function () {
			if (!this.retailerFragment) {
				this.retailerFragment = sap.ui.xmlfragment("com.ibs.ibsappidealcreditdebitnote.view.fragment.retailerFrag", this);
				this.getView().addDependent(this.retailerFragment);
				//this._delvrTemp = sap.ui.getCore().byId("delvrTempId").clone();
			}
            BusyIndicator.show();
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);

            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/retailerMaster";

            // var Postdata = JSON.stringify(payload);
			// context.onBack();
			// BusyIndicator.show();
			   $.ajax({
                    url: url,
                    type: 'GET',
                    // data: Postdata,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        BusyIndicator.hide();

                        for(var i=0;i<data.value.length;i++){
                            if(data.value[i].RETAILER_ID === null || data.value[i].RETAILER_ID === undefined || data.value[i].RETAILER_ID === ""){
                                data.value[i].RETAILER_ID = data.value[i].RETAILER_ID;
                            }else{
                                data.value[i].RETAILER_ID = data.value[i].RETAILER_ID.toString();
                            } 
                        }

                        var model = new JSONModel(data);
					    that.getView().setModel(model,"Retailerinvoice");

                        that.retailerFragment.open();
                    },
                    error: function (e) {
                        BusyIndicator.hide();
						var oXMLMsg, oXML;
                        // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
						if (that.isValidJsonString(e.responseText)) {
							oXML = JSON.parse(e.responseText);
							oXMLMsg = oXML.error["message"];
						} else {
							oXMLMsg = e.responseText;
						}
						MessageBox.error(oXMLMsg);
                    }
                });

			// var dlgId = sap.ui.getCore().byId("retalrF4Id");
			// that.oDataModel.read("/Retailers", {
			// 	urlParameters: {
			// 		"$select": "RETAILER_ID,RETAILER"
			// 	},
			// 	success: function (oData, oResponse) {
			// 		that.getView().setBusy(false);
			// 		var model = new JSONModel(oData);
			// 		// model.setSizeLimit(99999);
			// 		dlgId.setModel(model);
					
			// 	},
			// 	error: function (error) {
			// 		that.getView().setBusy(false);
			// 		MessageBox.warning("Data cannot be read");
			// 	}
			// });
		},
        onRef: function(){
			this.onEnabled()
		},
        handledelvrValueHelpClose : function(oEvent){
            // this.retailerFragment.close();

            // this.getView().byId("fdate").setValue("");
            this.getView().byId("invoice").setValue("");
            this.getView().byId("refText").setValue("");
            this.getView().byId("amt").setValue("");
            that.getView().byId("taxAmt").setValue("0");
            that.getView().byId("tAmount").setValue("0");

            if (this.getView().byId("invoice").getItems().length === 0 && this.getView().byId("retlrId").getValue() === "") {
				this.getView().byId("invoice").setValueState(sap.ui.core.ValueState.None);
			}

            this.retailerFragment.destroy();
            this.retailerFragment = null;
            this.retailerFragment = undefined;
            
            var iDesc = oEvent.getParameters().selectedItem.getDescription();
            var iNo = oEvent.getParameters().selectedItem.getTitle();
            this.getView().byId("retlrId").setValue(iDesc);
            that.retailerInvoiceRead(iNo);
        }, 
        retailerInvoiceRead : function(iNo){

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var aFilters =  "(RETAILER_ID eq '" + iNo + "')"
            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerInvoiceHeader?$filter="+ aFilters;

			   $.ajax({
                    url: url,
                    type: 'GET',
                    // data: Postdata,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        BusyIndicator.hide();
                        var model = new JSONModel(data);
					    that.getView().setModel(model,"invoice");
                        // that.retailerFragment.open();
                    },
                    error: function (e) {
                        BusyIndicator.hide();
						var oXMLMsg, oXML;
                        // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
						if (that.isValidJsonString(e.responseText)) {
							oXML = JSON.parse(e.responseText);
							oXMLMsg = oXML.error["message"];
						} else {
							oXMLMsg = e.responseText;
						}
						MessageBox.error(oXMLMsg);
                    }
                });
        },
        onChangeInvoice : function(){
            if (this.getView().byId("invoice").getItems().length === 0 && this.getView().byId("retlrId").getValue() === "") {
				this.getView().byId("invoice").setValueState(sap.ui.core.ValueState
					.Error).setValueStateText("Please select Retailer First");
			} else {
				this.getView().byId("invoice").setValueState(sap.ui.core.ValueState.None);
                var inv = this.getView().byId("invoice").getItems();
                this.getView().getModel("blankJson").setProperty("/refInvoice", inv);
			}
        },
        onInvoiceSelect: function (oEvent) {
			// var invoNo = oEvent.getSource().getParent().getCells()[1].getSelectedKey();
			var invoNo = this.getView().byId("invoice").getSelectedKey();
			if (this.getView().byId("invoice").getItems().length === 0 && this.getView().byId("retlrId").getValue() === "") {
				this.getView().byId("invoice").setValueState(sap.ui.core.ValueState
					.Error).setValueStateText("Please select Retailer First");
			} else {
				this.getView().byId("invoice").setValueState(sap.ui.core.ValueState.None);
                var inv = this.getView().byId("invoice").getSelectedKey();
                this.getView().getModel("blankJson").setProperty("/refInvoice", inv);
                this.invtotal(inv);
			}
			this.onEnabled()
		},
        invtotal : function(inv){
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);

            var aFilters =  "(INVOICE_NO eq '" + inv + "')"
            var url = appModulePath + "/odata/v4/ideal-retailer-dispatch/RetailerInvoiceHeader?$filter="+ aFilters;

			   $.ajax({
                    url: url,
                    type: 'GET',
                    // data: Postdata,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        BusyIndicator.hide();
                        var model = new JSONModel(data.value);
					    that.getView().setModel(model,"parinvoice");
                        // that.retailerFragment.open();
                    },
                    error: function (e) {
                        BusyIndicator.hide();
						var oXMLMsg, oXML;
                        // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
						if (that.isValidJsonString(e.responseText)) {
							oXML = JSON.parse(e.responseText);
							oXMLMsg = oXML.error["message"];
						} else {
							oXMLMsg = e.responseText;
						}
						MessageBox.error(oXMLMsg);
                    }
                });
        },
        onSubmit : function(){
            // debugger;
			var refInv = this.getView().byId("invoice").getValue(); 
			var refText = this.getView().byId("refText").getValue(); 
			var invAmt = this.getView().byId("amt").getValue();
            var transType = this.getView().byId("tType").getSelectedItem().getText();
            var postDate = this.getView().byId("fdate").getValue();
            var taxAmt = this.getView().byId("taxAmt").getValue();
            var tAmount = this.getView().byId("tAmount").getValue();

            var invData = this.getView().getModel("parinvoice").getData();

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);

            if(postDate){
                var oDate = new Date(postDate);
                var sDate = oDate.toISOString().split('T')[0];
            }

            var payload = {
                "appType": "RG",
                "creditDebitTx": [
                    {
                        "DISTRIBUTOR_ID": "1100013",
                        "RETAILER_ID": invData[0].RETAILER_ID,
                        "TX_ID": 2,
                        "TRANSACTION_TYPE": transType,
                        "POSTING_DATE": sDate,
                        "REFERENCE_INVOICE": refInv,
                        "INVOICE_AMOUNT": invData[0].GROSS_TOTAL,
                        "REFERENCE_TEXT": refText,
                        "AMOUNT": invAmt,
                        "TAX_AMOUNT": taxAmt,
                        "TOTAL_AMOUNT": tAmount,
                        "CREATED_ON": new Date()
                    }
                ]
            }

            var url = appModulePath + "/odata/v4/ideal-credit-debit-tx/creditDebitTransaction";

            var Postdata = JSON.stringify(payload);
			// context.onBack();
			BusyIndicator.show();
			   $.ajax({
                    url: url,
                    type: 'POST',
                    data: Postdata,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        BusyIndicator.hide();
                        MessageBox.success(data.value, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
                                    // BusyIndicator.hide();
                                    if(blanckJsonModel !== undefined){
                                        that.getView().getModel("blankJson").setData("");
                                        blanckJsonModel.setData(null);
                                    }
                                    that.getView().byId("retlrId").setValue("");
                                    // that.getView().byId("fdate").setValue("");
                                    that.getView().byId("amt").setValue("");
                                    that.getView().byId("invoice").setValue("");
                                    that.getView().byId("refText").setValue("");
                                    that.getView().byId("taxAmt").setValue("0");
                                    that.getView().byId("tAmount").setValue("0");
								}
							}
						});
                    },
                    error: function (e) {
                        BusyIndicator.hide();
						var oXMLMsg, oXML;
                        // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
						if (that.isValidJsonString(e.responseText)) {
							oXML = JSON.parse(e.responseText);
							oXMLMsg = oXML.error["message"];
						} else {
							oXMLMsg = e.responseText;
						}
						MessageBox.error(oXMLMsg);
                    }
                });
        },
        handledelvrValueHelpSearch : function(oEvent){
            var aFilter = [];
			var sQuery = oEvent.getSource()._sSearchFieldValue;
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("RETAILER_NAME", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("RETAILER_ID", sap.ui.model.FilterOperator.Contains, sQuery)];

				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}

			var oList = sap.ui.getCore().byId("retalrF4Id");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
        }
    });
});
