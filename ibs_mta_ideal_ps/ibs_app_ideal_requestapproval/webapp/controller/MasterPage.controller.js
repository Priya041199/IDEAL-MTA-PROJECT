sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/ibs/ibsappidealrequestapproval/model/formatter",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter"
],
function (BaseController, JSONModel, MessageBox, formatter, BusyIndicator, Filter, FilterOperator, Fragment, Sorter) {
    "use strict";
    var that = null;
	var oView = null;
	var appModulePath;
	var sUserRole;
	var sUserRole1;
	var sFinalString;
    return BaseController.extend("com.ibs.ibsappidealrequestapproval.controller.MasterPage", {
        formatter: formatter,
        onInit: function () {
            // debugger;
			// apply content density mode to root view
			// this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			that = this;
			oView = that.getView();
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);

			that.oDataModel = this.getOwnerComponent().getModel();
			// that.oModel = this.getOwnerComponent().getModel("onPremiseSrv");
			var oRouter = this.getOwnerComponent().getRouter().getRoute("MasterPage");
			oRouter.attachPatternMatched(this.handleRouteMatched, this);
			// that.readEntityData();
        },
        handleRouteMatched: function (oEvent) {
			// debugger;
			var aFilter;
			var req;
			that.urlReqNo = oEvent.getParameter("arguments").REQNO;
			if (that.urlReqNo === undefined) {
				aFilter = "";
			}
			else{
				req = that.urlReqNo;
				aFilter = "(REQUEST_NO eq " + req + ")";
				that.checkValidReqNo(aFilter);
			}
			
			this._getUserAttributes();
		},

		checkValidReqNo: function (aFilter) {
			// debugger;
			var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo?$filter=" + aFilter;

			BusyIndicator.show();

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: { $expand: 'TO_STATUS,TO_ENTITY_CODE' },
				success: function (data) {
					// debugger;
					BusyIndicator.hide();
					if (data.value.length === 0 || (data.value[0].STATUS !== 1 && data.value[0].STATUS !== 15)) {
						that.getRouter().navTo("notFound", {
							REQNO: that.urlReqNo
						});
					}
					if(that._oViewSettingsDialog){
						that._oViewSettingsDialog.clearFilters();
					}
					
				},
				error: function (e) {
					// debugger;
					BusyIndicator.hide();
					// MessageBox.warning("Error while reading VendorInvite data");
					//that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
					var oXMLMsg, oXML;
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

		//*******************Get User attributes*********************
		_getUserAttributes: function () {
			// debugger;
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);
			var attr = appModulePath + "/user-api/attributes";

			// that._sUserID = "darshan.l@intellectbizware.com";
			// that._sUserName = "Darshan Lad";
			// // that.readUserMasterEntities();
			// that.readMasterIdealUser();
			
			return new Promise(function (resolve, reject) {
				$.ajax({
					url: attr,
					type: 'GET',
					contentType: 'application/json',
					success: function (data, response) {
						// debugger;
						that._sUserID = data.email.toLowerCase().trim();
						that._sUserName = data.firstname + " " + data.lastname;
						that.readMasterIdealUser();
					},
					error: function (oError) {
						// debugger;
						MessageBox.error("Error while reading User Attributes");
					}
				});
			});
		},

		readMasterIdealUser: function () {
			// debugger;
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			var appModulePath = jQuery.sap.getModulePath(appPath);
			 // var url = appModulePath + "/ideal-master-maintenance/MasterIdeaUsers?$filter=ACTIVE eq 'X'";
			 var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterIdealUsers";
			 // var data = { $expand: 'TO_USER_ROLE,TO_ENTITY_CODE,TO_USER_ENTITIES' };
			//  this.postAjax(url, "GET", null, "idealUser");
			// if(aFilter.length === 0){
			// 	var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo";
			// 	}else{
			// 		var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo?$filter=" + aFilter;
			// 	}
	
				// ?$filter=" + aFilter;
				BusyIndicator.show();
	
				$.ajax({
					url: url,
					type: 'GET',
					contentType: 'application/json',
					success: function (data, response) {
	
						BusyIndicator.hide();
						for(var i = 0;i<data.value.length; i++){
							if(that._sUserID === data.value[i].USER_ID){
								sUserRole = data.value[i].USER_ROLE;
							}

							if(that._sUserID === data.value[i].USER_ID){
								if(i === 0)
								{
									sUserRole1 = data.value[i].USER_ROLE;
								}
								else{
									sUserRole1 = sUserRole +","+data.value[i].USER_ROLE;
								}
								
							}

						}
						
						that.readUserMasterEntities();
					},
					error: function (e) {
						// debugger;
						BusyIndicator.hide();
						var oXMLMsg, oXML;
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
		readUserMasterEntities: async function (aFilter) {
			// debugger;
			var hierarchyLevel = await that.calView();
			var entityCode = await that.calViewEntity();
			var aEntityArray = [];
			var sREG;
			if (aFilter === undefined || aFilter === null || aFilter === "") {
				aFilter = [];
			}
			else {
				that.sFilter = aFilter;
			}
			if(entityCode.length === 0){
				MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
			}else{ 
				if (that.urlReqNo !== undefined) {
					sREG = "(REQUEST_NO eq " + that.urlReqNo + ")";
				}
				else {
					sREG = "";
				}
				sFinalString = "";
						for (var i = 0; i < entityCode.length; i++) {
							if (i < entityCode.length - 1) {
								var concat = "((ENTITY_CODE eq '" + entityCode[i] + "')" + " and " +  "(APPROVER_LEVEL eq " + hierarchyLevel[i] + "))";
								sFinalString = sFinalString + concat + " or ";
							}
							else {
								var concat = "((ENTITY_CODE eq '" + entityCode[i] + "')" + " and " +  "(APPROVER_LEVEL eq " + hierarchyLevel[i] + "))";
								sFinalString = sFinalString + concat;
							}
						}

						that.EntityFilters = aFilter
						sFinalString = "(" + sFinalString + ")";

						var sStatus = "((STATUS eq 1) or (STATUS eq 15))";
						if(sREG === ""){
							var aFilter = sFinalString + " and " + sStatus;
						}else{
							var aFilter = sREG + " and " + sFinalString + " and " + sStatus;
						}
						

						that.readEntityData(aFilter);
			}
						
		},

		calView : function(){
		var userEmail = that._sUserID;
		var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'REQ'"
		// ?$filter=(USER_IDS contains '" + userEmail + "')";
		// var data = { $expand: 'TO_USER_ENTITIES' };
			var hLevelArr = [];
			return new Promise(function(resolve,reject){
			$.ajax({
				url: url,
				type: "GET",
				contentType: 'application/json',
				// data: data,
				success: function (data, response) {
					// debugger;
					var mLevel = data.value.map((x)=>{if(x.USER_IDS.includes(that._sUserID)){return x.LEVEL}});
					for(var i = 0; i < mLevel.length; i++){
					if(mLevel[i] === undefined || mLevel[i] === null || mLevel[i] === "")
					{
						continue;
					}
					else
					{
						hLevelArr.push(mLevel[i]);
					}
				}
					resolve(hLevelArr);
					// const fruits = new Map([data]);
				},
				error: function (error) {
					// debugger;
					// BusyIndicator.hide();
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
		})
		},

		calViewEntity : function(){
			var userEmail = that._sUserID;
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'REQ'"
			// ?$filter=(USER_IDS contains '" + userEmail + "')";
			// var data = { $expand: 'TO_USER_ENTITIES' };
				var hLevelArr = [];
				return new Promise(function(resolve,reject){
				$.ajax({
					url: url,
					type: "GET",
					contentType: 'application/json',
					// data: data,
					success: function (data, response) {
						// debugger;
						var mLevel = data.value.map((x)=>{if(x.USER_IDS.includes(that._sUserID)){return x.ENTITY_CODE}});
						for(var i = 0; i < mLevel.length; i++){
						if(mLevel[i] === undefined || mLevel[i] === null || mLevel[i] === "")
						{
							continue;
						}
						else
						{
							hLevelArr.push(mLevel[i]);
						}
					}
						resolve(hLevelArr);
						// const fruits = new Map([data]);
					},
					error: function (error) {
						// debugger;
						// BusyIndicator.hide();
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
			})
		},
		//*******************Get Request Type Data*********************
		readTypeData: function (filter) {
			// debugger;
			var url = appModulePath + "/odata/v4/ideal-request-process-srv/MasterRequestType";

			BusyIndicator.show();

			$.ajax({
				url: url,
				type: 'GET',
				data: null,
				contentType: 'application/json',
				success: function (data, responce) {
					// debugger;
					BusyIndicator.hide();
					var vendorModel = new JSONModel();
					vendorModel.setData(data);
					oView.setModel(vendorModel, "typeJson");
				},
				error: function (e) {
					// debugger;
					BusyIndicator.hide();
					//that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
					var oXMLMsg, oXML;
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

		//*******************Bind Supplier Request Table Data*********************
		readEntityData: function (aFilter) {
			// debugger;
			if(aFilter.length === 0){
			var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo";
			}else{
				var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_STATUS&$filter=" + aFilter;
			}

			// ?$filter=" + aFilter;

			BusyIndicator.show();

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				// data: { $expand: 'TO_STATUS,TO_ENTITY_CODE,TO_HIERARCHY_ROLE'},
				success: function (data, response) {

					BusyIndicator.hide();
					for (var i = 0; i < data.value.length; i++) {
						data.value[i].REQUEST_NO = String(data.value[i].REQUEST_NO);
					}
					
					var vendorModel = new JSONModel();
					vendorModel.setData(data);
					oView.setModel(vendorModel, "vendorJson");

				},
				error: function (e) {
					// debugger;
					BusyIndicator.hide();
					var oXMLMsg, oXML;
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

		//*******************Search Table Data*********************
		onSearch: function (oEvent) {
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var oFilter1 = [new sap.ui.model.Filter("DIST_NAME1", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("REQUESTER_ID", sap.ui.model.FilterOperator.Contains, sQuery)
				];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilters.push(allFilters);
			}
			var oList = this.byId("idVendorTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters);
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(that);
		},

		//*******************Reset Filter*********************
		onResetFilter: function () {
			// debugger;
			that.getRouter().navTo("RouteMaster");
			that.readEntitiesOnReset();
			that.getView().byId("filter").setType("Default");
			that.getView().byId("sort").setType("Default");
			// that.readUserMasterEntities();
			that.getView().byId("id_search").setValue();
			if (that.filter === true) {
				that.filter = false;
				this._oViewSettingsDialog.clearFilters();
			}
		},

		readEntitiesOnReset: async function (aFilter) {


			var hierarchyLevel = await that.calView();
			var entityCode = await that.calViewEntity();


			var aEntityArray = [];
			if (aFilter === undefined || aFilter === null || aFilter === "") {
				aFilter = [];
			}
			else {
				that.sFilter = aFilter;
			}

						var sFinalString1 = "";
						for (var i = 0; i < entityCode.length; i++) {
							if (i < entityCode.length - 1) {
								var concat = "((ENTITY_CODE eq '" + entityCode[i] + "')" + " and " +  "(APPROVER_LEVEL eq " + hierarchyLevel[i] + "))";
								sFinalString1 = sFinalString1 + concat + " or ";
							}
							else {
								var concat = "((ENTITY_CODE eq '" + entityCode[i] + "')" + " and " +  "(APPROVER_LEVEL eq " + hierarchyLevel[i] + "))";
								sFinalString1 = sFinalString1 + concat;
							}
						}

						that.EntityFilters = aFilter
						sFinalString1 = "(" + sFinalString1 + ")";

						var sStatus = "((STATUS eq 1) or (STATUS eq 15))";
						
						var aFilter = sFinalString1 + " and " + sStatus;

						that.readEntityData(aFilter);

		},

		//*******************Sort Table Data*********************
		onSort: function (oEvent) {
			if (!this._aDialog1) {
				this._aDialog1 = sap.ui.xmlfragment("com.ibs.ibsappidealrequestapproval.view.fragment.sortDialog", this);
				that.getView().addDependent(this._aDialog1);
			}
			this._aDialog1.open();
			// this.getView().byId("sort").setType("Emphasized");
		},

		handleConfirm: function (oEvent,sFilterReset) {
			debugger;
			var oTable = this.byId("idVendorTable"),
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
			
			if(bDescending === false || sPath !== "REQUEST_NO"){
				this.getView().byId("sort").setType("Emphasized");
			} else {
				this.getView().byId("sort").setType("Transparent");
			}
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},

		handleCancel: function () {
			that.readUserMasterEntities();
			this._oViewSettingsDialog.clearFilters();
		},

		//*******************Filter Table Data*********************
		onFilter: function (oEvent) {

			if (!this._oViewSettingsDialog) {
				this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealrequestapproval.view.fragment.filterDialog", this);
				this.getView().addDependent(this._oViewSettingsDialog);
			}
			this._oViewSettingsDialog.open();
			// this.getView().byId("filter").setType("Emphasized");
			that.readTypeData([]);
			// that.handleValueEntityHelp();
			that.filter = true;
		},

		onConfirmViewSettingsDialog: function (oEvent) {
			// debugger;
			var aFilterItems = oEvent.getParameters().filterItems;
			var dateValue = sap.ui.getCore().byId("date_fId");
			var aFilters = [];
			var sFinalString2 = "";
			var finalString;
			
			aFilterItems.forEach(function (oItem) {
				if (oItem.getKey() === "request") {
					for (var i = 0; i < aFilterItems.length; i++) {
						// debugger;
						if (aFilterItems.length === 1) {
							var req = that.getReqformat(oItem.getText());
							sFinalString2 = "(REQUEST_TYPE eq " + req + ")";
							finalString = "" + sFinalString2 + "";
						}
						else if (aFilterItems.length > 1) {
							var req = that.getReqformat(oItem.getText());
							var concat = "(REQUEST_TYPE eq " + req + ")";
							if (sFinalString2.includes("or") == false) {
								sFinalString2 = sFinalString2 + concat + " or ";
								break;
							}
							else {
								var sFinalString3 = sFinalString2 + concat;
								req = "";
								finalString = "" + sFinalString3 + "";
							}
						}
					}

				}

			});

			var sStatus = "((STATUS eq 1) or (STATUS eq 15))";
			// var sNextApprover = "(NEXT_APPROVER eq '" + that._sUserID + "')";

			if (finalString !== undefined) {
				this.getView().byId("filter").setType("Emphasized");
				aFilters = "(" + finalString + ")" + " and " + sStatus + " and " + sFinalString;
			} else {
				this.getView().byId("filter").setType("Transparent");
				aFilters = sStatus + " and " + sFinalString;
			}

			if (dateValue.getValue() && finalString === undefined) {
				var fDate = dateValue.getDateValue().toISOString();
				var tDate = dateValue.getSecondDateValue().toISOString();
				var gtDate = "(CREATED_ON gt " + fDate + ")";
				var ltDate = "(CREATED_ON lt " + tDate + ")";
				this.getView().byId("filter").setType("Emphasized");
				aFilters = "(" + gtDate + " and " + ltDate + ")" + " and " + sStatus + " and " + sFinalString;
				sap.ui.getCore().byId("date_fId").setValue("");
			}else if (dateValue.getValue() && finalString !== undefined) {
				var fDate = dateValue.getDateValue().toISOString();
				var tDate = dateValue.getSecondDateValue().toISOString();
				var gtDate = "(CREATED_ON gt " + fDate + ")";
				var ltDate = "(CREATED_ON lt " + tDate + ")";
				this.getView().byId("filter").setType("Emphasized");
				aFilters = aFilters + " and (" + gtDate + " and " + ltDate + ")";
				sap.ui.getCore().byId("date_fId").setValue("");
			}

			if(aFilterItems.length === 0 && dateValue.getValue() === ""){
				this.getView().byId("filter").setType("Transparent");
			}

			that.readEntityData(aFilters);
		},

		//*******************Format Request Type Data*********************
		getReqformat: function (sValue) {

			if (sValue == "Create Normal") {
				return "1";
			} else if (sValue == "Create Low Value") {
				return "2";
			} else if (sValue == "Create Exceptional") {
				return "3";
			} else if (sValue == "Extend Supplier") {
				return "4";
			} else if (sValue == "Update Request") {
				return "5";
			}
			else if (sValue == "Quick Registration") {
				return "7";
			}
		},

		onApprove: function (evt) {

			that.data = evt.getSource().getBindingContext("vendorJson").getObject();
			// that.suppCode = that.data.SUPPLIERTYPE_CODE;
			if (!this.inviteDialog) {
				this.inviteDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealrequestapproval.view.fragment.comment", this);
				this.getView().addDependent(this.inviteDialog);
			}
			this.inviteDialog.open();
			sap.ui.getCore().byId("id_approve").setVisible(true);
			sap.ui.getCore().byId("id_reject").setVisible(false);
			sap.ui.getCore().byId("id_lable").setRequired(false);
			sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to approve?");
		},
		// oPayload2385

		onReject: function (evt) {
			that.data = evt.getSource().getBindingContext("vendorJson").getObject();
			if (!this.inviteDialog) {
				this.inviteDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealrequestapproval.view.fragment.comment", this);
				this.getView().addDependent(this.inviteDialog);
			}
			this.inviteDialog.open();
			// sap.ui.getCore().byId("SimpleFormDisplay354").setVisible(false);
			sap.ui.getCore().byId("id_approve").setVisible(false);
			sap.ui.getCore().byId("id_reject").setVisible(true);
			sap.ui.getCore().byId("id_lable").setRequired(true);
			sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to reject?");
		},

		onSubmitApproval: function () {
			// debugger;
			that._reqAppRej(that.data, "APP");
		},

		onSubmitRejection: function () {
			that._reqAppRej(that.data, "REJ");
		},

		_closeDialog: function () {
			this.inviteDialog.close();
			this.inviteDialog.destroy();
			this.inviteDialog = null;
		},

		handleLiveChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var comment = sap.ui.getCore().byId("id_comment");

			if (comment.getValue().length > comment.getMaxLength()) {
				comment.setValueState(sap.ui.core.ValueState.Error).setValueStateText("The text should be less than 1000 characters");
				comment.focus();
			}
			else if (comment.getValue() === "") {
				comment.setValueState(sap.ui.core.ValueState.None);
			}
		},

		_reqAppRej: function (distData, val) {
			// debugger;
			var path, status, eventCode, remark, sAction;
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);

			var comment = sap.ui.getCore().byId("id_comment");

			if (comment.getValue() === "" && val === "REJ") {
				comment.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Comment.");
				comment.focus();
			}
			else if (comment.getValue().length > comment.getMaxLength()) {
				comment.setValueState(sap.ui.core.ValueState.Error).setValueStateText("The text should be less than 1000 characters");
				comment.focus();
			} else {
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});
				var crt_date = new Date();
				var dateFormatted = dateFormat.format(crt_date);
				if (val === "APP") {
					status = 2;
					remark = "Request Sent";
					eventCode = 2;
					sAction = "APPROVE"
					path = appModulePath + "/odata/v4/ideal-request-process-srv/RequestProcess";
				} else {
					status = 3;
					remark = "Request Rejected";
					eventCode = 3;
					sAction = "REJECT";
					path = appModulePath + "/odata/v4/ideal-request-process-srv/RequestProcess";
				}
				var sDate = new Date(distData.CREATED_ON);
				var sDate2 = new Date(distData.LAST_UPDATED_ON);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
				var latestDate = dateFormat.format(sDate);
				var latestDate2 = dateFormat.format(sDate2);


				var registeredObject = {
					"action": sAction,
					"appType" : "REQ",
					"inputData": [{
						"REQUEST_NO": Number(distData.REQUEST_NO),
						"MOBILE_NO": distData.MOBILE_NO,
						"SAP_DIST_CODE": distData.SAP_DIST_CODE,
						"DIST_NAME1": distData.DIST_NAME1,
						"DIST_NAME2": distData.DIST_NAME2,
						"DIST_CODE": distData.DIST_CODE,
						"REGISTERED_ID": distData.REGISTERED_ID,
						"ENTITY_CODE": distData.ENTITY_CODE,
						//"ENTITY_DESC": distData.ENTITY_DESC,
						// "SUPPL_TYPE_DESC": distData.SUPPL_TYPE_DESC,
						// "SUPPL_TYPE": distData.SUPPL_TYPE,
						"BP_TYPE_CODE": distData.BP_TYPE_CODE,
						"NDA_TYPE": null,
						"STATUS": status,
						"CREATED_ON": sDate,
						// "CREATED_BY": distData.REGISTERED_ID,
						"LAST_UPDATED_ON": sDate2,
						"REQUEST_TYPE": Number(distData.REQUEST_TYPE),
						//"COMMENT": sap.ui.getCore().byId("id_comment").getValue(),
						"COMMENT": distData.COMMENT,
						"APPROVER_LEVEL": distData.APPROVER_LEVEL,
						"APPROVER_ROLE": distData.APPROVER_ROLE,
						"REQUESTER_ID": distData.REQUESTER_ID,
						"REMINDER_COUNT": distData.REMINDER_COUNT,
						"BUYER_ASSIGN_CHECK": distData.BUYER_ASSIGN_CHECK,
						"CREATION_TYPE": Number(distData.CREATION_TYPE)
					}],
					"eventsData": [{
						"REQUEST_NO": Number(distData.REQUEST_NO),
						"EVENT_NO": 0,
						"EVENT_CODE": eventCode,
						"EVENT_TYPE": "REQ",
						"USER_ID": that._sUserID,
						"USER_NAME": that._sUserName,
						"REMARK": remark,
						"COMMENT": sap.ui.getCore().byId("id_comment").getValue(),
						//"COMMENT": distData.COMMENT,
						"CREATED_ON": sDate
					}],
					"userDetails" : {
						"USER_ROLE": sUserRole,
						"USER_ID": that._sUserID
					}
				};
				// var payload = JSON.stringify({
				// 	"input": registeredObject
				// });

				if (distData.SAP_DIST_CODE !== "") {
					registeredObject.inputData[0].IDEAL_DIST_CODE = distData.IDEAL_DIST_CODE;
				}

				var data = registeredObject;

				BusyIndicator.show();

				that.inviteDialog.close();
				that.inviteDialog.destroy();
				that.inviteDialog = null;
				$.ajax({
					url: path,
					type: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: function (oData, responce) {
						// debugger;
						BusyIndicator.hide();
						var data = oData;
						MessageBox.success(data.value[0].OUT_SUCCESS, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
									that.getRouter().navTo("RouteMaster");
									var aFilter = [];
									//aFilter = that.EntityFilters;
									var sStatus = "(STATUS eq 1)";
									// var sNextApprover = "(NEXT_APPROVER eq '" + that._sUserID + "')";
									aFilter = sStatus;
									that.readUserMasterEntities(aFilter);
								}
							}
						});
					},
					// error: function (error) {
					// 	BusyIndicator.hide();
					// 	var errorMsg = "";
					// 	if (val === "APP") {
					// 		errorMsg = "Error occured while approving request.";
					// 	} else {
					// 		errorMsg = "Error occured while rejecting request.";
					// 	}
					// 	//errorMsg = JSON.parse(error.responseText).OUT_SUCCESS;
					// 	MessageBox.error(errorMsg);
					// }
					error: function (e) {
						// debugger;
						BusyIndicator.hide();
						var oXMLMsg, oXML;
						if (that.isValidJsonString(e.responseText)) {
							oXML = JSON.parse(e.responseText);
							oXMLMsg = oXML.error["message"];
						} else {
							oXMLMsg = e.responseText;
						}
						MessageBox.error(oXMLMsg);
					}
				});
			}
		},

		//added by pranay 09/03/2022
		displayBuyerComment: function (oEvent) {
			var oButton = oEvent.getSource();
			var oView = this.getView();
			var sObject = oEvent.getSource().getBindingContext("vendorJson").getObject();
			var sCommentJson = new JSONModel();
			sCommentJson.setData(sObject);
			oView.setModel(sCommentJson, "sCommentJson")

			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "com.ibs.ibsappidealrequestapproval.view.fragment.buyerComment",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					oPopover.bindElement("/sCommentJson");
					return oPopover;
				});
			}
			this._pPopover.then(function (oPopover) {
				oPopover.setPlacement("Left");
				oPopover.openBy(oButton);
			});

		},

		handleCloseButton: function (oEvent) {
			this.byId("myPopover").close();
		}
    });
});
