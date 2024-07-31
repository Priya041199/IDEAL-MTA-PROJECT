sap.ui.define([
    "./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/Sorter",
	"sap/ui/core/BusyIndicator",
	"com/ibs/ibsappidealdealerprofile/model/formatter"
],
function (BaseController,JSONModel, MessageToast, Filter, MessageBox, History, Sorter,
	BusyIndicator,formatter) {
    "use strict";
    var oModel;
	var context, that ;
	var appModulePath;
    return BaseController.extend("com.ibs.ibsappidealdealerprofile.controller.MasterPage", {
        formatter: formatter,
        onInit: function () {
            that = this;
			context = this;
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);
			oModel = context.getOwnerComponent().getModel();

			that.oDataModel = this.getOwnerComponent().getModel("onPremiseModel");
			
			var oRouter = this.getOwnerComponent().getRouter().getRoute("RouteMasterPage");
			oRouter.attachPatternMatched(this.handleRouteMatched, this);
        },
        handleRouteMatched:function(oEvent){
			var aFilter;
			var req;
			var oSearchId = this.getView().byId("onSearchMasterData");
			
			BusyIndicator.hide();
			that.urlReqNo = oEvent.getParameter("arguments").REQNO;
			var onBackModel = context.getOwnerComponent().getModel("vendorProfile");

			if (onBackModel !== undefined && onBackModel !== null && onBackModel !== "") {
				var backIndicator = onBackModel.getData().BACK_INDICATOR;
			} 
			else {
				if(oSearchId !== undefined){
					this.getView().byId("onSearchMasterData").setValue("");
				}

				if (that.urlReqNo === undefined) {
					aFilter = "";
				}
				else {
					req = that.urlReqNo;
					aFilter = "(REQUEST_NO eq " + req + ")";
					that.checkValidReqNo(aFilter);
				}
				this._getUserAttributes();
			}
			
			that._handleCounrtySet();			
		},
		_getUserAttributes: function () {
			
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);
			var attr = appModulePath + "/user-api/attributes";

			// Local Use
			
			// // that._sUserID = "farzeen.s@intellectbizware.com";
			// // that._sUserName = "Farzeen Sayyed";
			// // that._sUserID = "siddhesh.d@intellectbizware.com";
			// // that._sUserName = "Siddhesh Dingankar";
			// that._sUserID = "darshan.l@intellectbizware.com";
			// that._sUserName = "Darshan Lad";
			// var oModel = new JSONModel({
			// 	userId: that._sUserID,
			// 	userName: that._sUserName
			// });
			// this.getOwnerComponent().setModel(oModel, "userModel");
			// this.readUserMasterData(that._sUserID);

			// after Deployement

			return new Promise(function (resolve, reject) {
                	$.ajax({
                		url: attr,
                		type: 'GET',
                		contentType: 'application/json',
                		success: function (data, response) {
							var obj={
							userId : data.email.toLowerCase(),
                			userName : data.firstname + " " + data.lastname
							}
							var oModel = new JSONModel(obj);
							that.getOwnerComponent().setModel(oModel, "userModel");
							that._sUserID = data.email.toLowerCase();
							that.readUserMasterData(that._sUserID);
                		},
                		error: function (oError) {
                			MessageBox.error("Error while reading User Attributes");
                		}
                	});
                });
			
		},
		readUserMasterData : function(userEmail){
			
			var userDetailModel = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
			
				$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    data: null,
                    success: function (data, response) {
						if(data.value.length === 0){
							MessageBox.error("You are not an authorized user to take action.");
						}
						else{
						userDetailModel.setData(data.value[0]);
						that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");
						that._readData();
						}
					},
                    error: function (error) {
                        // BusyIndicator.hide();
						var oXML,oXMLMsg;
						if (context.isValidJsonString(error.responseText)) {
							oXML = JSON.parse(error.responseText);
							oXMLMsg = oXML.error["message"];
						} else {
							oXMLMsg = error.responseText
						}
                        MessageBox.error(oXMLMsg);
                        // MessageBox.error(e.responseText);
                    }
                });
		},
		
		_readData: function (oFilter,oFilterOn,oFilter2) {
			BusyIndicator.show();

			if (oFilter === undefined || oFilterOn === "None") {
				var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY),TO_CONTACTS,TO_STATUS,TO_REQUEST_ACTIVE_STATUS&$filter=TO_REQUEST_ACTIVE_STATUS/ACTIVE eq 'A' and STATUS eq 11";
				
				// var url = appModulePath + "/odata/v4/addtional-process/RequestInfo?$filter=STATUS eq 11&$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY),TO_CONTACTS,TO_STATUS,TO_REQUEST_ACTIVE_STATUS";
			}
			else if(oFilterOn === "Country"){
				var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY;$filter="+oFilter+ " and ADDRESS_TYPE eq 'HQ'),TO_CONTACTS,TO_STATUS,TO_REQUEST_ACTIVE_STATUS&$filter=TO_REQUEST_ACTIVE_STATUS/ACTIVE eq 'A' and STATUS eq 11";

				// var url = appModulePath + "/odata/v4/addtional-process/RequestInfo?$filter=STATUS eq 11&$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY;$filter="+oFilter+ " and ADDRESS_TYPE eq 'HQ'),TO_CONTACTS,TO_STATUS";

				// var url = appModulePath + "/odata/v4/addtional-process/RequestInfo?$filter=STATUS eq 11&$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY;$filter=TO_COUNTRY/LANDX eq '"+oFilter+"' and ADDRESS_TYPE eq 'HQ'),TO_CONTACTS,TO_STATUS";
			}
			else if(oFilterOn === "MultipleFilter"){
				var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY;$filter="+oFilter+ " and ADDRESS_TYPE eq 'HQ'),TO_CONTACTS,TO_STATUS,TO_REQUEST_ACTIVE_STATUS&$filter=TO_REQUEST_ACTIVE_STATUS/ACTIVE eq 'A' and "+oFilter2;

				// var url = appModulePath + "/odata/v4/addtional-process/RequestInfo?$filter="+ oFilter2 + "&$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY;$filter="+oFilter+ " and ADDRESS_TYPE eq 'HQ'),TO_CONTACTS,TO_STATUS";
			}
			else{	
				var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY),TO_CONTACTS,TO_STATUS,TO_REQUEST_ACTIVE_STATUS&$filter=TO_REQUEST_ACTIVE_STATUS/ACTIVE eq 'A' and "+oFilter;
				// var url = appModulePath + "/odata/v4/addtional-process/RequestInfo?$filter="+ oFilter + "&$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY),TO_CONTACTS,TO_STATUS";
			}

			var data = null;
			this.postAjax(url, "GET", data, "onBoarding",oFilterOn);

			},

			postAjax : function(url, type, data, model,filterOn){
				var arr = [];
				$.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
						
                        BusyIndicator.hide();
                        if (type === "GET") {
							var oModel;
							if(filterOn === undefined){
								filterOn = null;
							}
							if(model != "countrySet" && filterOn === null){
							for (var i = 0; i < data.value.length; i++) {
								data.value[i].SAP_DIST_CODE = String(data.value[i].SAP_DIST_CODE);
							}
							oModel = new JSONModel(data.value);
							// context.getView().setModel(oModel, model);
						}
						else if(filterOn === "Country" || filterOn === "MultipleFilter"){
							
							for (var i = 0; i < data.value.length; i++) {
								if(data.value[i].TO_ADDRESS.length < 1){
									data.value.splice(i, 1);
									i=-1;
								}
								else if(data.value[i].TO_ADDRESS[0].ADDRESS_TYPE === 'OTH'){
									data.value.splice(i, 1);
									i=-1;
								}
							}
							oModel = new JSONModel(data.value);
							// context.getView().setModel(oModel, model);
						}
						else{
                            oModel = new JSONModel(data.value);
							oModel.setSizeLimit(data.value.length);
							// context.getView().setModel(oModel, model);
						}  
						context.getView().setModel(oModel, model);
                    }

						// Sort Presevered Code 
					if(that.getView().byId("idSortBtn").getType() === "Emphasized"){
						var oSortFiltersArr = sap.ui.getCore().byId("idSortFragment").getSortItems();
						var result1 = oSortFiltersArr.filter(function (a) {
							if(a.getProperty("selected") === true){
								return a.getProperty("key");
							}
						}, Object.create(null));
		
						var obj = {
							"sPath":result1[0].getKey(),
							"bDescending":sap.ui.getCore().byId("idSortFragment").getSortDescending()
						}
		
						that.handleSortDialogConfirm("null",obj);
					}
					},
                    error: function (error) {
                        BusyIndicator.hide();
						var oXML,oXMLMsg;
						if (context.isValidJsonString(error.responseText)) {
							oXML = JSON.parse(error.responseText);
							oXMLMsg = oXML.error["message"];
						} else {
							oXMLMsg = error.responseText
						}
                        MessageBox.error(oXMLMsg);
                    }
                });
		},
		onPress: function (oEvent) {
			
			var vendorNo = oEvent.getSource().getBindingContext("onBoarding").getObject().SAP_DIST_CODE
			var requestNo = oEvent.getSource().getBindingContext("onBoarding").getObject().REQUEST_NO;
			var Ventity = oEvent.getSource().getBindingContext("onBoarding").getObject().ENTITY_CODE;
			var status = oEvent.getSource().getBindingContext("onBoarding").getObject().STATUS;
			var createdBy = oEvent.getSource().getBindingContext("onBoarding").getObject().REQUESTER_ID
			var createdOn = oEvent.getSource().getBindingContext("onBoarding").getObject().CREATED_ON;
			var creationType = oEvent.getSource().getBindingContext("onBoarding").getObject().CREATION_TYPE;

			//Get data in obj and set in json model.
			var navObj = {
				"REQUEST_NO":requestNo,
				"USER_ID": context._sUserID,
				"UNAME": context._sUserName,
				"ENTITY_CODE": Ventity,
				"STATUS": status,
				"CREATED_BY":createdBy,
				"CREATED_ON":createdOn,
				"CREATION_TYPE":creationType
			};

			var oViewModel = new sap.ui.model.json.JSONModel(navObj);
			this.getOwnerComponent().setModel(oViewModel, "vendorDetail");

			//Navigate to detail page.
			BusyIndicator.show();

			// this.getView().byId("idFilterBtn").setType("Transparent");
			// this.getView().byId("idSortBtn").setType("Transparent");
			
			// if (this.filterfrag2) {
			// 	this.filterfrag2.destroy();
			// 	this.filterfrag2 = null;
			// }

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteDetailPage", {
				SAPVENDORNO: vendorNo
			});

		},

		onselectDropdown: function (oEvent) {
			var visible = this.getView().byId("user_id").getVisible();
			if (visible === false) {
				this.getView().byId("user_id").setVisible(true);
			} else {
				this.getView().byId("user_id").setVisible(false);
			}
		},

		handleRefresh: function () {

			
			this.getView().byId("idFilterBtn").setType("Transparent");
			this.getView().byId("idSortBtn").setType("Transparent");

			this.getView().byId("onSearchMasterData").setValue("");
			if(sap.ui.getCore().byId("date_fId") !== undefined){
				sap.ui.getCore().byId("date_fId").setValue("");
			}
			if (that.filterdialog === true) {
				that._oViewSettingsDialog.clearFilters();
			}
			if (this.filterfrag2) {
				this.filterfrag2.destroy();
				this.filterfrag2 = null;
			}
			context._readData();

		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			var oTable = this.getView().byId("idProductsTable");
			this.binding = oTable.getBinding("items");

			if (sQuery && sQuery.length > 0) {

				var oFilter = new Filter("DIST_NAME1", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter1 = new Filter("SAP_DIST_CODE", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFil = new sap.ui.model.Filter([oFilter, oFilter1]);
				this.binding.filter(oFil, sap.ui.model.FilterType.Application);
			} else {
				this.binding.filter([]);
			}
		},

		//************Filtering**********//
		_handleCounrtySet: function () {
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterCountry";
			this.postAjax(url, "GET", null, "countrySet");
		},

		onFilter: function (oEvent) {
			
			// if (that.filterdialog === true) {
			// 	that._oViewSettingsDialog.clearFilters();
			// }
			if (!this._oViewSettingsDialog) {
				this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealdealerprofile.view.fragments.filterDialog", this);
				this.getView().addDependent(this._oViewSettingsDialog);
			}
			this._oViewSettingsDialog.open();

			that.filterdialog = true;
		},
		onResetViewSetting:function(oEvent){
			sap.ui.getCore().byId("date_fId").setValue("");
		},
		onConfirmViewSettingsDialog: function (oEvent) {
			
			var ocountryFilter;
			var oFilterOn = "None"
			var aFilterItems = oEvent.getParameters().filterItems;
			var dateValue = sap.ui.getCore().byId("date_fId");
			var aFilters = [];
			var countryData = [];
			var mulitipleFilter = [];
			var multipleFields = [];
			var sFinalString = "";

			if(aFilterItems.length === 0 && dateValue.getValue() === ""){
				sap.ui.getCore().byId("date_fId").setValue("");
				this.getView().byId("idFilterBtn").setType("Transparent");
				that._readData(aFilters,oFilterOn);
			}
			else{
				aFilterItems.forEach(function (oItem) {
				oFilterOn = "Country"
				// var oSelectedKey = oItem.getKey();
				sFinalString = oItem.getKey();
				if(sFinalString !== ""){
					countryData.push(sFinalString);
				}
				// "TO_ADDRESS($filter=SR_NO eq 1 and COUNTRY eq '"+oSelectedKey +"')&$filter=STATUS eq 6";
			});
			
			// countryData.push(sFinalString);
			
			if(countryData.length > 1){
				for(var i=0;i<countryData.length;i++){
					mulitipleFilter.push("TO_COUNTRY/LAND1 eq '"+countryData[i]+"'");
				}
				aFilters = "("+mulitipleFilter.join(" or ")+")";
				multipleFields.push(aFilters);
			}
			else if(countryData.length === 1){
				if(sFinalString !== ""){
					aFilters = "TO_COUNTRY/LAND1 eq '"+sFinalString+"'";
					multipleFields.push(aFilters);
					}
			}
			ocountryFilter = aFilters;

			if (dateValue.getValue()) {
				
				var sStatus = "(STATUS eq 11)"
				var fDate = dateValue.getDateValue().toISOString();
				var tDate = dateValue.getSecondDateValue().toISOString();
				var gtDate = "(LAST_UPDATED_ON gt " + fDate + ")";
				var ltDate = "(LAST_UPDATED_ON lt " + tDate + ")";

				
				aFilters = gtDate + " and " + ltDate + " and " + sStatus;
				multipleFields.push(aFilters);
				oFilterOn = "Date";
				
				// sap.ui.getCore().byId("date_fId").setValue("");
			}
			if(multipleFields.length > 1){
				var dateRangeFilter = gtDate + " and " + ltDate + " and " + sStatus;
				oFilterOn = "MultipleFilter";
			}
			if(oFilterOn === "MultipleFilter"){
				this.getView().byId("idFilterBtn").setType("Emphasized");
				that._readData(ocountryFilter,oFilterOn,dateRangeFilter);
			}
			else{
				this.getView().byId("idFilterBtn").setType("Emphasized");
				that._readData(aFilters,oFilterOn);
			}
		}
		},

		onCancelFilter: function (oEvent) {
			// this._oViewSettingsDialog.close();
			// context._oViewSettingsDialog.clearFilters();

			// context._readData();
		},

		//**********Sorting***********//
		handleSort: function (oEvent) {
			if (!this.filterfrag2) {
				this.filterfrag2 = sap.ui.xmlfragment("com.ibs.ibsappidealdealerprofile.view.fragments.Sort", this);
				this.getView().addDependent(this.filterfrag2);
			}
			this.filterfrag2.open();
		},

		handleSortDialogConfirm: function (oEvent,sFilterReset) {
			var oTable = this.byId("idProductsTable"),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			if(sFilterReset === undefined){
				var mParams = oEvent.getParameters();
				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
			}
			else{
				sPath = sFilterReset.sPath;
				bDescending = sFilterReset.bDescending;
			}

			// sPath = mParams.sortItem.getKey();
			// bDescending = mParams.sortDescending;

			if(bDescending === false){
				//  || sPath !== "SAP_VENDOR_CODE"
				this.getView().byId("idSortBtn").setType("Emphasized");
			} else {
				this.getView().byId("idSortBtn").setType("Transparent");
			}

			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},

		handleConfirm: function (oEvent) {
			var sPath = "";
			var bDescending = "";
			var oView = this.getView();
			var oTable = oView.byId("idProductsTable");
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			//apply grouping
			var aSorters = [];
			if (mParams.groupItem) {

				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				var vGroup = function (oContext) {

					var obid = oContext.getProperty("REQUEST_NO");
					return {
						key: obid,
						text: obid
					};
				};

				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));

			}
			//apply Sorter
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;

			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
			// apply filters 
			aFilters = [];
			for (var i = 0, l = mParams.filterItems.length; i < l; i++) {
				var oItem = mParams.filterItems[i];

				sPath = oItem.getKey();
				var vOperator = "EQ";
				var vValue1 = oItem.getText();

				var oFilter = new sap.ui.model.Filter(sPath, vOperator, vValue1);
				aFilters.push(oFilter);
			}
			oBinding.filter(aFilters);
		}
    });
});
