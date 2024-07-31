sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"com/ibs/ibsappidealregistrationapproval/model/down",
	"sap/m/Token",
	"com/ibs/ibsappidealregistrationapproval/model/formatter",
	"sap/ui/core/BusyIndicator",
	'sap/ui/core/Fragment',
	"sap/ui/Device"

], function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, MessageBox, History, down, Token, formatter,
	BusyIndicator,Fragment,Device) {
	"use strict";
	var data, that, sDevice;
	var context = null;
	var oModel, appModulePath;
	var oView = null;
	var requestNo;
	var oViewModel;
	var myJSONModel;
	var myJSONModel1;
	var myJSONModel2;
	var myJSONModel3;
	var myJSONModel4;
	var myJSONModel5;
	var myJSONModel6;
	var vendorDetailsData;
	var myJSONModel7;
	var sUserRole;
	var entityCode;
	var level;
	var myJSONModel11, myJSONModel12, businessHisModel, tradelicModel, suppNameModel, vatNoModel, localModel, myJSONModelToken, custDetailsModel;
	var LogDetailModel, promoDetailsModel, IbanOTHModel;
	//	var isNewSwiftCodeExist = null;

	return BaseController.extend("com.ibs.ibsappidealregistrationapproval.controller.DetailPage", {
		formatter: formatter,

		onInit: function () {
			// debugger;
			that = this;
			context = this;
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);
			oView = this.getView();
			context.getClientInfo();
			oModel = context.getOwnerComponent().getModel();
			context.oDataModel = context.getOwnerComponent().getModel("onPremiseModel");

			const oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.getOwnerComponent().setModel(oDeviceModel, "device");

			sDevice = this.getOwnerComponent().getModel("device").getData();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteDetailPage").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			// debugger;
			BusyIndicator.hide();
			var sEntityCode,sCreationType,sBpType;

			requestNo = oEvent.getParameter("arguments").RequestNO;
			oViewModel = context.getOwnerComponent().getModel("vendorDetail");
			this.getView().byId("emailTextId").setValue("");

			this.onMainContent(true);

			var oModel = new JSONModel({
				thirdSectionHBoxLabel: "",
				thirdSectionHBoxVisible: false
			});
			context.getView().setModel(oModel, "thirdSectionHBoxModel");

			var oModel = new JSONModel({
				fourthSectionHBoxLabel: "",
				fourthSectionHBoxVisible: false
			});
			context.getView().setModel(oModel, "fourthSectionHBoxModel");


			// window.onpopstate   = function(event){
			// 	var sPath = window.location.href.split("UI5");
			// 	var slocation = window.location.href.split("&/")[1];
			// 	var baz = {baz: true};
			// 	if(slocation === 'RouteMasterPage'){
			// 		history.pushState(baz, document.title, sPath + "/" + requestNo);
			// 	}
			// 	else if(slocation === "editDetails" || slocation === "NotFound"){
			// 	history.pushState(baz, document.title, "#ideal_registration_approval-display&/"+slocation);
			// 	}
			// }
			//added on 23-05-2023 by Sumit
			if (oViewModel !== undefined) {
				var NavModel = new JSONModel();
				NavModel.setData(oViewModel.getData());
				context.getView().setModel(NavModel, "navData");
			}
			
			this._readTimelineData();

			if (that.getUserData === undefined) {
				that._sUserID = "priya.g@intellectbizware.com";
				that._sUserName = "Priya Gawde";
				var oModel = new JSONModel({
					userId: that._sUserID,
					userName: that._sUserName
				});
				this.getOwnerComponent().setModel(oModel, "userModel");
				
				this.readUserMasterData(that._sUserID);
				
				// debugger;

			that.getUserData = this.getOwnerComponent().getModel("userModel");

			//local for userid and user role
			
			}

			// if (that.getUserData === undefined) {

			// var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			// var appPath = appId.replaceAll(".", "/");
			// appModulePath = jQuery.sap.getModulePath(appPath);
			// var attr = appModulePath + "/user-api/attributes";

			// 	return new Promise(function (resolve, reject) {
			// 		$.ajax({
			// 			url: attr,
			// 			type: 'GET',
			// 			contentType: 'application/json',
			// 			success: function (data, response) {
			// 				var obj = {
			// 					userId: data.email.toLowerCase(),
			// 					userName: data.firstname + " " + data.lastname
			// 				}
			// 				var oModel = new JSONModel(obj);
			// 				that.getOwnerComponent().setModel(oModel, "userModel");

			// 				that._sUserID = data.email.toLowerCase();
			// 				that.readUserMasterData(that._sUserID);
			// 				// that.readAccess(that._sUserID);
			// 			},
			// 			error: function (oError) {
			// 				MessageBox.error("Error while reading User Attributes");
			// 			}
			// 		});
			// 	});
			// }
			else {
				vendorDetailsData = this.getOwnerComponent().getModel("vendorDetail");
				var editDetailsNavData = this.getOwnerComponent().getModel("editDetail");

				// that.oEntityCode = 'T-TC';
				that.oEntityCode = that.getOwnerComponent().getModel("userDetailsModel").getProperty("/TO_USER_ENTITIES");

				if(that.oEntityCode === undefined){
					// that.oEntityCode = 'T-TC';
					that.oEntityCode = that.getOwnerComponent().getModel("userDetailsModel").getData();
				}
				if(vendorDetailsData === undefined && editDetailsNavData !== undefined){
					sEntityCode = this.getOwnerComponent().getModel("editDetail").getProperty("/ENTITY_CODE");
					sCreationType = this.getOwnerComponent().getModel("editDetail").getProperty("/CREATION_TYPE");
					sBpType = this.getOwnerComponent().getModel("editDetail").getProperty("/BP_TYPE_CODE");
				}
				else{
					sEntityCode = this.getOwnerComponent().getModel("vendorDetail").getProperty("/ENTITY_CODE");
					sCreationType = this.getOwnerComponent().getModel("vendorDetail").getProperty("/CREATION_TYPE");
					sBpType = this.getOwnerComponent().getModel("vendorDetail").getProperty("/BP_TYPE_CODE");
				}

				that.readDraft(requestNo,sEntityCode,sCreationType,sBpType);
				this._getUserId();
				// this.readAccess(that._sUserID);
			}
		},
		readUserMasterData: function(userEmail){
			// debugger;
			var userDetailModel = new JSONModel();
			
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
			var data = { $expand: 'TO_USER_ENTITIES' };

				$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
						if(data.value.length === 0){
							MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
						}
						else{
							if(data.value[0].TO_USER_ENTITIES.length > 0){
								userDetailModel.setData(data.value[0].TO_USER_ENTITIES);
								that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");
								that.oEntityCode = that.getOwnerComponent().getModel("userDetailsModel").getData();
								that.checkUserId(requestNo,userEmail);
							}
							else{
								MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
							}
						}

						for(var i = 0;i<data.value.length; i++){
							if(that._sUserID === data.value[i].USER_ID){
								if(i === 0)
								{
									sUserRole = data.value[i].USER_ROLE;
								}
								else{
									sUserRole = sUserRole +","+data.value[i].USER_ROLE;
								}
								
							}
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
                    }
                });
		},
		checkUserId : function(reqNo,userId){
			// debugger;
			// var aFilter = "REQUEST_NO eq '"+ reqNo +"' "
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$filter=REQUEST_NO eq " + reqNo + "";
			$.ajax({
				url: url,
				type: "GET",
				contentType: 'application/json',
				// data: data,
				success: function (data, response) {
					// debugger;
					entityCode = data.value[0].ENTITY_CODE;
					level = data.value[0].APPROVER_LEVEL;
					that.calView(entityCode,level,userId);
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
		},
		calView : function(entityCode,level,userId){
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=(TYPE eq 'REG') and (ENTITY_CODE eq '" + entityCode + "') and (LEVEL eq " + level + ") and (USER_IDS eq '" + userId +"')";
			// var data = { $expand: 'TO_USER_ENTITIES' };
                var hLevelArr = [];
                // return new Promise(function(resolve,reject){
				$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
						// debugger;
						if(data.value.length === 0){
							MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
						}else{
							that.readDraft(requestNo,null,null,null);
							that.readAccess(that._sUserID);
						}
					},
                    error: function (error) {
						// ;
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
            // })
        },
		readAccess: function(userEmail){
			// debugger;
			// var userDetailModel = new JSONModel();
			// var vendorDetailsData2 = this.getOwnerComponent().getModel("vendorDetail").getData();
			// var eCode = vendorDetailsData2.ENTITY_CODE;
			// var appLevel = vendorDetailsData2.APPROVER_LEVEL;
			var hType = "REG";
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=(ENTITY_CODE eq '" + entityCode + "') and (LEVEL eq " + level + ") and (TYPE eq '" + hType + "')";
			// var data = { $expand: 'TO_USER_ENTITIES' };
			// (USER_IDS eq '" + userEmail + "')

				$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
						// debugger;

						var mHierarchyId = data.value.map((x)=>{if(x.USER_IDS.includes(that._sUserID)){return x}});
						
						if(mHierarchyId[0].ACCESS_SENDBACK === true){
							that.getView().byId("sendbackBt").setVisible(true);
						}else{
							that.getView().byId("sendbackBt").setVisible(false);
						}

						if(mHierarchyId[0].ACCESS_APPROVE === true){
							that.getView().byId("approveBt").setVisible(true);
						}else{
							that.getView().byId("approveBt").setVisible(false);
						}

						if(mHierarchyId[0].ACCESS_REJECT === true){
							that.getView().byId("rejectBt").setVisible(true);
						}else{
							that.getView().byId("rejectBt").setVisible(false);
						}

						if(mHierarchyId[0].ACCESS_EDIT === true){
							that.getView().byId("editBtn").setVisible(true);
						}else{
							that.getView().byId("editBtn").setVisible(false);
						}
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
		},
		//Getting login user attributes
		_getUserId: function () {
			// debugger;
			var getUserDetails = context.getOwnerComponent().getModel("userModel").getData();
			// $.get("/services/userapi/attributes").done(function (results) {

			that._sUserID = (getUserDetails.userId).toLowerCase();
			that._sUserName = getUserDetails.userName;

			this._readData(requestNo);
			this._readLogDetails();
			this._attachTable();
			// this._qualityCert();
			// this._readTokenCredentials();
			localModel = new JSONModel();
			var tradeObj = {
				MsgStrip1: false,
				MsgStrip2: false,
				MsgStrip3: false,
				// BankKeyMessageStrip: false,
				Notificationlist: false
			};
			localModel.setData(tradeObj);
			context.getView().setModel(localModel, "localModel");

		
			//load a section 1 by default
			context.getView().byId("ObjectPageLayout").setSelectedSection(context.getView().byId("firstSection"));

		},
		readDraft: function (ReqNo, ReqEntity, CreateType,bpTypeCode) {
			oView.setBusy(true);

			var obj = JSON.stringify({
				"requestNo": ReqNo,
				"entityCode": ReqEntity,
				"creationType": CreateType,
				"userId": context._sUserID,
				"userRole": sUserRole,
				// this.getView().getModel("userDetailsModel").getProperty("/USER_ROLE"),
				"draftData": true,
				"visibility": true,
				"mandatory": true,
				"updated": true,
				"openText": true,
				"clientInfo": true,
				"totalCount": true,
				"settings": true,
				"labels": true
			});
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/GetDraftData(requestNo=" + ReqNo + ",entityCode='" + ReqEntity + "',creationType=" + CreateType + ",userId='" + context._sUserID + "',userRole='CM')";
			// "/ideal-registration-form-srv/GetDraftData('" + obj + "')";
			

			//var path = appModulePath + "/odata/v4/registration-process/GetDraftData(requestNo=" + ReqNo + ",entityCode='" + ReqEntity + "',creationType=" + CreateType + ",userId='" + context.UserId + "',userRole='VENDOR')";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (oData, response) {

					oView.setBusy(false);
					var data = oData;
					// added on 06-04-2023 by INDER CHOUHAN
					if (data.value[0].DRAFT.ADDRESS.length !== 0) {


						if ((data !== undefined || data !== null || data !== '') && data.value[0].CLIENT_INFO.CLIENT_COUNTRY === data.value[0].DRAFT.ADDRESS[0].COUNTRY) {
							data.value[0].DRAFT.MAIN[0].BP_TYPE_CODE = "B";
						}
					}

					//hard coded it just to assign B value
					// if (Object.keys(data.value[0].DRAFT).length !== 0) {
					// 	if ((data !== undefined || data !== null || data !== '') && data.value[0].CLIENT_INFO.CLIENT_COUNTRY === data.value[0].CLIENT_INFO.CLIENT_COUNTRY) {
					// 		loginData.BP_TYPE_CODE = "B";
					// 	}
					// }

					// added on 06-04-2023 by INDER CHOUHAN
					var loginJsonData = new JSONModel();
					loginJsonData.setData(data.value[0].CLIENT_INFO);
					context.getView().setModel(loginJsonData, "loginJsonData");

					context.clientCountry = data.value[0].CLIENT_INFO.CLIENT_COUNTRY;

					var olabelJson = new JSONModel();
					olabelJson.setData(data.value[0].LABELS[0]);
					oView.setModel(olabelJson, "labelJson");

					// context.validateLocalCountry();

					var openTextJson = new JSONModel();
					openTextJson.setData(data.value[0].OPENTEXT);
					oView.setModel(openTextJson, "openTextJson");

					// context.draftDataBinding(data.value[0], "");
					BusyIndicator.hide();

					// if(ReqEntity === null && CreateType === null && bpTypeCode === null){
					that._getUserId();
					// }
					// else{
					// 	that._getUserId();
					// }
				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"];
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},
		getClientInfo: function () {
			// debugger;
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterClientInfo";

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					// debugger;
					oView.setBusy(false);
					that.clientInfo = oData.value[0];
				},
				error: function (error) {
					// debugger;.
					oView.setBusy(false);
					// var oXML = JSON.parse(error.responseText);
					// var oXMLMsg = oXML.error["message"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID);
					var oXMLMsg, oXML;
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
		//Navigate to service not found page 
		_navtoNotFoundPage: function (value, status) {
			var navObj = {
				"STATUS": status
			};

			var oViewModel1 = new sap.ui.model.json.JSONModel(navObj);
			context.getOwnerComponent().setModel(oViewModel1, "viewStatus");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(context);
			oRouter.navTo("NotFound", {
				REQUEST_NO: requestNo
			});
		},

		postAjaxs: function (url, type, data, model) {
			// debugger;
			$.ajax({
				url: url,
				type: type,
				contentType: 'application/json',
				data: data,
				success: function (data, response) {
					BusyIndicator.hide();
					if (model === null) {
						that.filterfrag.close();
						that.filterfrag.destroy();
						that.filterfrag = null;
						MessageBox.success(data.value[0].Message, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
									var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
									oRouter.navTo("RouteMasterPage");
								}
							}
						});
					}
					else if (model === "messagePost") {
						MessageBox.success(data.value[0].Message, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
									context._readTimelineData();
								}
							}
						});

					}
					else {
						var oModel = new JSONModel(data);
						context.getView().setModel(oModel, model);
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
		//Read supplier Data
		_readData: function (oFilters) {
			// debugger;
			if (oFilters === undefined) {
				var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo(" + requestNo + ")";
			}
			else {
				var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo(" + oFilters + ")";
			}

			var data = {
				$expand: "TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY,TO_REGION),TO_CONTACTS($expand=TO_COUNTRY,TO_REGION),TO_STATUS,TO_BANKS($expand=TO_COUNTRY),TO_MANDATORY_FIELDS,TO_UPDATED_FIELDS,TO_ATTACHMENTS,TO_VISIBLE_FIELDS,TO_ATTACH_FIELDS,TO_BANKING_DETAILS,TO_PROMOTERS,TO_BUSINESS_HISTORY,TO_CUSTOMERS"
			};

			this._getodata(url, 'GET', data, "vendorDetails")
		},

		_getodata: function (url, type, data, model) {
			// debugger;
			myJSONModel = new JSONModel();
			var oEntityCodeCheck = [];
			

		//  Object.create(null));

			$.ajax({
				url: url,
				type: type,
				contentType: 'application/json',
				data: data,
				success: function (Data) {
					BusyIndicator.hide();
					// debugger;
					if(Data !== null && that.oEntityCode !== undefined){
					oEntityCodeCheck = that.oEntityCode.filter(function (a) {
						if(Data.ENTITY_CODE === a.ENTITY_CODE){
							return a;
						}
					});
					}
					
					if (Data === null) {
						context._navtoNotFoundPage(requestNo, "NotFound");
					}
					else if(oEntityCodeCheck.length === 0){
						context._navtoNotFoundPage(requestNo, "NotAuth");
					}
					// else if (context._sUserID !== that._sUserID){
					// 	// Data.NEXT_APPROVER) {
					// 	context._navtoNotFoundPage(requestNo, "NotAuth");
					// }
					else if (Data.STATUS === 8) {
						context._navtoNotFoundPage(requestNo, Data.STATUS);
					}
					
		
					// else if(Data.ENTITY_CODE)
					else{
						// that.readDraft(Data.REQUEST_NO,Data.ENTITY_CODE,Data.CREATION_TYPE,Data.BP_TYPE_CODE)
					// To hide Approve button when form is not filled by Buyer
					if (Data.TO_ADDRESS.length === 0) {
						context.getView().byId("id_MessageStripQR").setVisible(true);
						// context.getView().byId("approveBt").setVisible(false);
					} else {
						context.getView().byId("id_MessageStripQR").setVisible(false);
						// context.getView().byId("approveBt").setVisible(true);
					}
					//added on 23-05-2023 by Sumit
					if (oViewModel === undefined) {
						var NavModel = new JSONModel();
						NavModel.setData(Data);
						context.getView().setModel(NavModel, "navData");
					}

					// added on 14-04-2023 by Inder Chouhan for Quick Registration handling send back btn
					if (Data.REQUEST_TYPE === 7) {
						context.getView().byId("sendbackBt").setVisible(false);
					} else if (Data.STATUS === 5 || Data.STATUS === 6 || Data.STATUS === 9 || Data.STATUS ===
						13 || Data.STATUS === 10) { //Approval, Reject, Sendback button hide and show on Status
						// context.getView().byId("approveBt").setVisible(true);
						// context.getView().byId("rejectBt").setVisible(true);
						// context.getView().byId("sendbackBt").setVisible(true);
					} else {
						context.getView().byId("approveBt").setVisible(false);
						context.getView().byId("rejectBt").setVisible(false);
						context.getView().byId("sendbackBt").setVisible(false);
					}
					// context.validateBankKey(Data);

					if (Data.REQUEST_TYPE !== 5) {
						Data.TO_UPDATED_FIELDS = null;
					}

					myJSONModel.setData(Object.assign({}, Data));
					context.getView().setModel(myJSONModel, "vendorDetails");
					
					var sEntityDesc = Data.TO_ENTITY_CODE.BUTXT || 'NA';
					context._sEntity = Data.ENTITY_CODE || '';
					var entitydesc = {
						"ENTITY_DESC": sEntityDesc
					};

					var i18Model = new JSONModel();
					i18Model.setData(entitydesc);
					context.getOwnerComponent().setModel(i18Model, "i18entitydesc");
					//If the request is internally updated the sendback button will not be visible.
					if (myJSONModel.getData().DIST_CODE === 'IR' && myJSONModel.getData().APPROVER_LEVEL === 2) {
						context.getView().byId("sendbackBt").setVisible(false);
					}

					if (myJSONModel.getData().VCODE === "" || myJSONModel.VCODE === null) {
						context.getView().byId("vcodeId").setVisible(false);
					} else {
						context.getView().byId("vcodeId").setVisible(true);
					}

					//Sap vendor code hide and show
					if (Data.SAP_DIST_CODE !== null && Data.SAP_DIST_CODE !== undefined) {
						context.getView().byId("vendCodeId").setVisible(true);
					} else {
						context.getView().byId("vendCodeId").setVisible(false);
					}

					//Address data
					var RegAddLen = Data.TO_ADDRESS.length;
					var arr = [];
					var sRegion = null;
					var sCountryDesc = null;
					if (RegAddLen > 0) { // added on 13-04-2023 by Inder Chouhan For Quick Registration handling
						// setting bptypecode as b if client country and selected country are same

						if (Data.TO_ADDRESS[0].COUNTRY === context.clientInfo.CLIENT_COUNTRY) {
							context.OG_BP_TYPE_CODE = Data.BP_TYPE_CODE;
							Data.BP_TYPE_CODE = "B";
						}
						else if (Data.TO_ADDRESS[0].COUNTRY != context.clientInfo.CLIENT_COUNTRY) {
							// if (Data.TO_ADDRESS[0].COUNTRY === 'AE') {
							// 	context.OG_BP_TYPE_CODE = Data.BP_TYPE_CODE;
							// 	Data.BP_TYPE_CODE = "B";
							// }
							// else {
								context.OG_BP_TYPE_CODE = Data.BP_TYPE_CODE;
								Data.BP_TYPE_CODE = "";
							// }
						}
						for (var i = 0; i < RegAddLen; i++) {
							if (Data.TO_ADDRESS[i].ADDRESS_TYPE === 'HQ') {
								if (Data.TO_ADDRESS[i].TO_REGION != null) {
									sRegion = Data.TO_ADDRESS[i].TO_REGION.BEZEI || "";
								}

								if (Data.TO_ADDRESS[i].TO_COUNTRY != null) {
									sCountryDesc = Data.TO_ADDRESS[i].TO_COUNTRY.LANDX || "";
								}

								var objHQ = {
									"results": [{
										"STREET_NO": Data.TO_ADDRESS[i].HOUSE_NUM1,
										"CITY": Data.TO_ADDRESS[i].CITY,
										"EMAIL": Data.TO_ADDRESS[i].EMAIL,
										"FAX_NO": Data.TO_ADDRESS[i].FAX_NO,
										"STREET1": Data.TO_ADDRESS[i].STREET1,
										"STATE": sRegion,
										"CONTACT_NO": Data.TO_ADDRESS[i].CONTACT_NO,
										"CONTACT_TELECODE": Data.TO_ADDRESS[i].CONTACT_TELECODE,
										"STREET2": Data.TO_ADDRESS[i].STREET2,
										"STREET3": Data.TO_ADDRESS[i].STREET3,
										"STREET4": Data.TO_ADDRESS[i].STREET4,

										"COUNTRY": sCountryDesc,
										"POSTAL_CODE": Data.TO_ADDRESS[i].POSTAL_CODE
									}]
								};
								myJSONModel2 = new JSONModel();
								myJSONModel2.setData(objHQ);
								context.getView().setModel(myJSONModel2, "HQAdd");
							}
							if (Data.TO_ADDRESS[i].ADDRESS_TYPE !== 'HQ') {
								if (Data.TO_ADDRESS[i].TO_REGION != null) {
									sRegion = Data.TO_ADDRESS[i].TO_REGION.BEZEI || "";
								}

								if (Data.TO_ADDRESS[i].TO_COUNTRY != null) {
									sCountryDesc = Data.TO_ADDRESS[i].TO_COUNTRY.LANDX || "";
								}
								var obj = {
									"ADDRESS_TYPE": Data.TO_ADDRESS[i].ADDRESS_TYPE,
									"ADDRESS_DESC": Data.TO_ADDRESS[i].ADDRESS_DESC,
									"STREET_NO": Data.TO_ADDRESS[i].HOUSE_NUM1,
									"STREET1": Data.TO_ADDRESS[i].STREET1,
									"STREET2": Data.TO_ADDRESS[i].STREET2,
									"STREET3": Data.TO_ADDRESS[i].STREET3,
									"STREET4": Data.TO_ADDRESS[i].STREET4,
									"CITY": Data.TO_ADDRESS[i].CITY,

									"STATE": sRegion,

									"COUNTRY": sCountryDesc,
									"POSTAL_CODE": Data.TO_ADDRESS[i].POSTAL_CODE,
									"CONTACT_NO": Data.TO_ADDRESS[i].CONTACT_NO,
									"CONTACT_TELECODE": Data.TO_ADDRESS[i].CONTACT_TELECODE,
									"FAX_NO": Data.TO_ADDRESS[i].FAX_NO,
									"EMAIL": Data.TO_ADDRESS[i].EMAIL
								};
								arr.push(obj);
							}
						}
					} else {
						var objHQ = {
							"results": [{
								"STREET_NO": null,
								"CITY": null,
								"EMAIL": null,
								"FAX_NO": null,
								"STREET1": null,

								"STATE": null,
								"CONTACT_NO": null,
								"CONTACT_TELECODE": null,
								"STREET2": null,
								"STREET3": null,
								"STREET4": null,

								"COUNTRY": null,
								"POSTAL_CODE": null
							}]
						};
						myJSONModel2 = new JSONModel();
						myJSONModel2.setData(objHQ);
						context.getView().setModel(myJSONModel2, "HQAdd");
					}

					var AddressObj = {
						"results": arr
					};
					myJSONModel1 = new JSONModel();
					myJSONModel1.setData(AddressObj);
					context.getView().setModel(myJSONModel1, "AddressData");

					//Visible Email2 in HQ address table.
					// var email2 = Data.SECONDARY_EMAILS_ID;
					// if (email2 !== "" && email2 !== null && email2 !== undefined) {

					// 	var secondaryEmails = email2.split(";");
					// 	var oMultiInput1 = context.getView().byId("multiInput1");
					// 	var tokensArr = [];
					// 	for (var a = 0; a < secondaryEmails.length; a++) {
					// 		var token = new Token({
					// 			text: secondaryEmails[a],
					// 			key: secondaryEmails[a]
					// 		});
					// 		tokensArr.push(token);
					// 	}
					// 	oMultiInput1.setTokens(tokensArr);
					// } else {
					// 	context.getView().byId("multiInput1").setTokens([new Token({
					// 		text: "NA",
					// 		key: "NA"
					// 	})]);
					// }

					//Multiple Supplier category tokens.
					// var suppCatDesc = Data.SUPPL_CATEGORY_DESC;
					// if (suppCatDesc !== "" && suppCatDesc !== null && suppCatDesc !== undefined) {

					// 	var supplierCat = suppCatDesc.split(",");
					// 	var suppCatMultiInput = context.getView().byId("suppMultiInputId");
					// 	var suppCattokensArr = [];
					// 	for (var b = 0; b < supplierCat.length; b++) {
					// 		var supptoken = new Token({
					// 			text: supplierCat[b],
					// 			key: supplierCat[b]
					// 		});
					// 		suppCattokensArr.push(supptoken);
					// 	}
					// 	suppCatMultiInput.setTokens(suppCattokensArr);
					// } else {

					// 	context.getView().byId("suppMultiInputId").setTokens([new Token({
					// 		text: "NA",
					// 		key: "NA"
					// 	})]);
					// }

					//Visible row count for Registered addresss table.
					var addLen = AddressObj.results.length;
					that.getView().byId("trAddId").setVisibleRowCount(addLen);

					//contact details data
					// debugger;
					var contactLen = Data.TO_CONTACTS.length;
					var contArr = [];
					if (contactLen > 0) {
					for (i = 0; i < contactLen; i++) {

						if (Data.TO_CONTACTS[i].CONTACT_TYPE === 'HOD') {
							var region = null;
							if (Data.TO_CONTACTS[i].TO_COUNTRY === null) {
								var nationality = null;
							} else {
								nationality = Data.TO_CONTACTS[i].TO_COUNTRY.LANDX;
							}

							if (Data.TO_CONTACTS[i].TO_REGION != null) {
								region = Data.TO_CONTACTS[i].TO_REGION.BEZEI || "";
							}
							var objHOD = {
								results: [{
									"NAME1": Data.TO_CONTACTS[i].NAME1,
									"NAME2": Data.TO_CONTACTS[i].NAME2,
									"DESIGNATION": Data.TO_CONTACTS[i].DESIGNATION,
									"EMAIL": Data.TO_CONTACTS[i].EMAIL,
									"CONTACT_NO": Data.TO_CONTACTS[i].CONTACT_NO,
									"CONTACT_TELECODE": Data.TO_CONTACTS[i].CONTACT_TELECODE,
									"MOBILE_NO": Data.TO_CONTACTS[i].MOBILE_NO,
									"MOBILE_TELECODE": Data.TO_CONTACTS[i].MOBILE_TELECODE,
									"CITY": Data.TO_CONTACTS[i].CITY,
									"NATIONALITY": nationality,
									"STATE": region,
									"POSTAL_CODE": Data.TO_CONTACTS[i].POSTAL_CODE
								}]
							};

							myJSONModel3 = new JSONModel();
							myJSONModel3.setData(objHOD);
							context.getView().setModel(myJSONModel3, "hodDetails");
						}
						if (Data.TO_CONTACTS[i].CONTACT_TYPE === 'AUTH') {
							var state = null;
							if (Data.TO_CONTACTS[i].TO_COUNTRY === null) {
								var nationality = null;
							} else {
								nationality = Data.TO_CONTACTS[i].TO_COUNTRY.LANDX;
							}

							if (Data.TO_CONTACTS[i].TO_REGION != null) {
								state = Data.TO_CONTACTS[i].TO_REGION.BEZEI || "";
							}
							var objAUTH = {

								"NAME1": Data.TO_CONTACTS[i].NAME1,
								"NAME2": Data.TO_CONTACTS[i].NAME2,
								"DESIGNATION": Data.TO_CONTACTS[i].DESIGNATION,
								"EMAIL": Data.TO_CONTACTS[i].EMAIL,
								"CONTACT_NO": Data.TO_CONTACTS[i].CONTACT_NO,
								"CONTACT_TELECODE": Data.TO_CONTACTS[i].CONTACT_TELECODE,
								"MOBILE_NO": Data.TO_CONTACTS[i].MOBILE_NO,
								"MOBILE_TELECODE": Data.TO_CONTACTS[i].MOBILE_TELECODE,
								"NATIONALITY": nationality,
								"CITY": Data.TO_CONTACTS[i].CITY,
								"PASSPORT_NO": Data.TO_CONTACTS[i].PASSPORT_NO,
								"STATE": state,
								"POSTAL_CODE": Data.TO_CONTACTS[i].POSTAL_CODE

							};
							contArr.push(objAUTH);

						}
					}
				}else{
					var objHOD = {
						results: [{
							"NAME1": null,
							"NAME2": null,
							"DESIGNATION": null,
							"EMAIL": null,
							"CONTACT_NO": null,
							"CONTACT_TELECODE": null,
							"MOBILE_NO":null,
							"MOBILE_TELECODE": null,
							"CITY": null,
							"NATIONALITY": null,
							"STATE": null,
							"POSTAL_CODE": null
						}]
					};
						myJSONModel3 = new JSONModel();
						myJSONModel3.setData(objHOD);
						context.getView().setModel(myJSONModel3, "hodDetails");
				}
					var contArryObj = {
						"results": contArr
					};

					myJSONModel4 = new JSONModel();
					myJSONModel4.setData(contArryObj);
					context.getView().setModel(myJSONModel4, "authDetails");

					var contLen = contArryObj.results.length;
					context.getView().byId("table_contactId").setVisibleRowCount(contLen);

					if (Data.TO_VISIBLE_FIELDS.S1G2T1F1 === 'X') {
						context.getView().byId("contactSubSectionTitle_Id").setTitle("Primary Contact");
						context.getView().byId("contactTable_Id").setText("Other Contacts");
					} else {
						context.getView().byId("contactSubSectionTitle_Id").setTitle("Contacts");
						context.getView().byId("contactTable_Id").setText("");
					}

					//Bank Details
					var bankDetailsLen = Data.TO_BANKS.length;
					//check wehther new swift code exise or not

					//new swift code 20-10-2022
					// isNewSwiftCodeExist = Data.TO_BANKS.find(function (val) {
					// 	return val.SWIFT_CODE === "OTHER";
					// });

					// if (isNewSwiftCodeExist) {
					// 	context.getView().byId("msgSCID").setVisible(true);
					// } else {
					// 	context.getView().byId("msgSCID").setVisible(false);
					// }
					var bankArr = [];
					var bankDetailsArr = [];
					if (bankDetailsLen > 0) {
						for (i = 0; i < bankDetailsLen; i++) {
							if (Data.TO_BANKS[i].PAYMENT_TYPE === 'PRI') {
								if (Data.TO_BANKS[i].TO_COUNTRY !== null) {
									var priBankCountry = Data.TO_BANKS[i].TO_COUNTRY.LANDX;
								} else {
									priBankCountry = null;
								}
								if (Data.TO_BANKS[i].BANK_CURRENCY !== null && Data.TO_BANKS[i].BANK_CURRENCY !==
									undefined) {
									var priBankCurrency = Data.TO_BANKS[i].BANK_CURRENCY;
								} else {
									priBankCurrency = null;
								}
								var objBankPri = {
									results: [{
										"ACCOUNT_HOLDER": Data.TO_BANKS[i].ACCOUNT_HOLDER,
										"ACCOUNT_NAME": Data.TO_BANKS[i].ACCOUNT_NAME,
										"ACCOUNT_NO": Data.TO_BANKS[i].ACCOUNT_NO,

										"BANK_COUNTRY": priBankCountry,
										"BANK_CURRENCY": priBankCurrency,
										"BANK_ID": Data.TO_BANKS[i].BANK_ID,
										"BANK_KEY": Data.TO_BANKS[i].BANK_KEY,
										"BANK_NO": Data.TO_BANKS[i].BANK_NO,
										"BENEFICIARY": Data.TO_BANKS[i].BENEFICIARY,
										"BIC_CODE": Data.TO_BANKS[i].BIC_CODE,
										"BRANCH_NAME": Data.TO_BANKS[i].BRANCH_NAME,
										"DUNS_NUMBER": Data.TO_BANKS[i].DUNS_NUMBER,
										"IBAN_NUMBER": Data.TO_BANKS[i].IBAN_NUMBER,
										"NAME": Data.TO_BANKS[i].NAME,
										"OTHER_CODE_NAME": Data.TO_BANKS[i].OTHER_CODE_NAME,
										"OTHER_CODE_VAL": Data.TO_BANKS[i].OTHER_CODE_VAL,
										"ROUTING_CODE": Data.TO_BANKS[i].ROUTING_CODE,
										"SWIFT_CODE": Data.TO_BANKS[i].SWIFT_CODE,
										"VAT_REG_DATE": Data.TO_BANKS[i].VAT_REG_DATE,
										"VAT_REG_NUMBER": Data.TO_BANKS[i].VAT_REG_NUMBER
									}]
								};
								myJSONModel5 = new JSONModel();
								myJSONModel5.setData(objBankPri);
								context.getView().setModel(myJSONModel5, "priBankDetails");

							}
							if (Data.TO_BANKS[i].PAYMENT_TYPE === 'OTH') {

								var objBankOth = {

									"ACCOUNT_HOLDER": Data.TO_BANKS[i].ACCOUNT_HOLDER,
									"ACCOUNT_NAME": Data.TO_BANKS[i].ACCOUNT_NAME,
									"ACCOUNT_NO": Data.TO_BANKS[i].ACCOUNT_NO,
									"BANK_COUNTRY": Data.TO_BANKS[i].TO_COUNTRY.LANDX,
									"BANK_CURRENCY": Data.TO_BANKS[i].BANK_CURRENCY,

									"BANK_ID": Data.TO_BANKS[i].BANK_ID,
									"BANK_KEY": Data.TO_BANKS[i].BANK_KEY,
									"BANK_NO": Data.TO_BANKS[i].BANK_NO,
									"BENEFICIARY": Data.TO_BANKS[i].BENEFICIARY,
									"BIC_CODE": Data.TO_BANKS[i].BIC_CODE,
									"BRANCH_NAME": Data.TO_BANKS[i].BRANCH_NAME,
									"DUNS_NUMBER": Data.TO_BANKS[i].DUNS_NUMBER,
									"IBAN_NUMBER": Data.TO_BANKS[i].IBAN_NUMBER,
									"NAME": Data.TO_BANKS[i].NAME,
									"OTHER_CODE_NAME": Data.TO_BANKS[i].OTHER_CODE_NAME,
									"OTHER_CODE_VAL": Data.TO_BANKS[i].OTHER_CODE_VAL,
									"ROUTING_CODE": Data.TO_BANKS[i].ROUTING_CODE,
									"SWIFT_CODE": Data.TO_BANKS[i].SWIFT_CODE,
									"VAT_REG_DATE": Data.TO_BANKS[i].VAT_REG_DATE,
									"VAT_REG_NUMBER": Data.TO_BANKS[i].VAT_REG_NUMBER
								};
								bankArr.push(objBankOth);

							}
						}
					} else {
						var objBankPri = {
							results: [{
								"ACCOUNT_HOLDER": null,
								"ACCOUNT_NAME": null,
								"ACCOUNT_NO": null,

								"BANK_COUNTRY": null,
								"BANK_CURRENCY": null,
								"BANK_ID": null,
								"BANK_KEY": null,
								"BANK_NO": null,
								"BENEFICIARY": null,
								"BIC_CODE": null,
								"BRANCH_NAME": null,
								"DUNS_NUMBER": null,
								"IBAN_NUMBER": null,
								"NAME": null,
								"OTHER_CODE_NAME": null,
								"OTHER_CODE_VAL": null,
								"ROUTING_CODE": null,
								"SWIFT_CODE": null,
								"VAT_REG_DATE": null,
								"VAT_REG_NUMBER": null
							}]
						};
						myJSONModel5 = new JSONModel();
						myJSONModel5.setData(objBankPri);
						context.getView().setModel(myJSONModel5, "priBankDetails");
					}
					var payArryObj = {
						"results": bankArr
					};
					myJSONModel6 = new JSONModel();
					myJSONModel6.setData(payArryObj);
					context.getView().setModel(myJSONModel6, "othBankDetails");

					var otherBankLen = payArryObj.results.length;

					if (otherBankLen === 0) {
						context.getView().byId("bankTableId").setVisible(true);
						context.getView().byId("bankTableId").setVisibleRowCount(otherBankLen);
					} else {
						context.getView().byId("bankTableId").setVisible(true);
						context.getView().byId("bankTableId").setVisibleRowCount(otherBankLen);
					}

					var bankDetails = Data.TO_BANKING_DETAILS;
					for(var i = 0; i < bankDetails.length; i++){
						var objBankingDetails = {
								"AMOUNT_LIMIT" : bankDetails[i].AMOUNT_LIMIT,
								"ASSO_SINCE" : bankDetails[i].ASSO_SINCE,
								"BRANCH_NAME" : bankDetails[i].BRANCH_NAME,
								"FACILTY" : bankDetails[i].FACILTY,
								"NAME" : bankDetails[i].NAME 
						};
						bankDetailsArr.push(objBankingDetails);
					}
					var detArryObj = {
						"results" : bankDetailsArr
					};
					myJSONModel7 = new JSONModel();
					myJSONModel7.setData(detArryObj);
					context.getView().setModel(myJSONModel7, "otherBankingDetails");

					var othBankDetailsLen = bankDetailsArr.length;
					if (othBankDetailsLen === 0) {
						// context.getView().byId("otherBankingDetailId").setVisible(true);
						context.getView().byId("otherBankingDetailId").setVisibleRowCount(othBankDetailsLen);
					} else {
						// context.getView().byId("otherBankingDetailId").setVisible(true);
						context.getView().byId("otherBankingDetailId").setVisibleRowCount(othBankDetailsLen);
					}

					// vat 
					// if (Data.BP_TYPE_CODE === "B") {
					// 	context.getView().byId("S2G1T3F14_lbl").setRequired(true);
					// 	context.getView().byId("S2G1T3F13_lbl").setRequired(true);
					// }

					// Trade License and exp date
					// if (Data.BP_TYPE_CODE === "B" && Data.SUPPL_TYPE !== "ZGOV" && Data.SUPPL_TYPE !== "ZUNI") {
					// 	context.getView().byId("S1G4T9F1_lbl").setRequired(true);
					// 	context.getView().byId("S1G4T9F1_lblExp").setRequired(true);
					// } else {
					// 	context.getView().byId("S1G4T9F1_lbl").setRequired(false);
					// 	context.getView().byId("S1G4T9F1_lblExp").setRequired(false);
					// }
					// if (Data.BP_TYPE_CODE !== "B"){
					// // && (Data.SUPPL_TYPE !== "ZGOV" || Data.SUPPL_TYPE !== "ZUNI")) {
					// 	// oView.byId("S1G4T9F1_lbl").setRequired(true);
					// 	// oView.byId("S1G4T9F1_lblExp").setRequired(true);
					// 	// oView.byId("S1G4T9F1_lbl").setText("Trade License No.");
					// 	// oView.byId("S1G4T9F1_lblExp").setText("Trade License Expiry Date");
					// 	// oView.byId("idVAT_lbl").setText("VAT Registration Details are available?: ");
					// 	oView.byId("idICV_lbl").setText("Are you accredited into the ICV program ?: ");
					// 	// oView.byId("S2G1T3F13_lbl").setText("VAT Registration Number");
					// 	// oView.byId("S2G1T3F14_lbl").setText("VAT Registration Date");
					// 	oView.byId("icvDetails_Id").setVisible(true);

					// } else if (Data.BP_TYPE_CODE === "B"){ 
					// // && (Data.SUPPL_TYPE !== "ZGOV" || Data.SUPPL_TYPE !== "ZUNI")) {
					// 	// oView.byId("S1G4T9F1_lbl").setRequired(true);
					// 	// oView.byId("S1G4T9F1_lblExp").setRequired(false);
					// 	// oView.byId("vatDetails_Id").setTitle("Tax Details");
					// 	// oView.byId("VAT_RId").setText("Reason for Tax exemption");
					// 	// oView.byId("VAT_EVI").setText("Tax Evidence");
					// 	// oView.byId("S1G4T9F1_lbl").setText("Certificate of Incorporation No.");
					// 	// oView.byId("S1G4T9F1_lblExp").setText("Certificate of Incorporation Expiry Date");
					// 	// oView.byId("idVAT_lbl").setText("Tax Registration Details are available?: ");
					// 	oView.byId("idICV_lbl").setText("Are you accredited into the ICV program ?: ");
					// 	// oView.byId("S2G1T3F13_lbl").setText("Tax Registration Number");
					// 	// oView.byId("S2G1T3F14_lbl").setText("Tax Registration Date");
					// 	oView.byId("icvDetails_Id").setVisible(false);
					// } 


					// Commented by Vishal till Line no 982
					// else if (Data.BP_TYPE_CODE !== "B" && (Data.SUPPL_TYPE === "ZGOV" || Data.SUPPL_TYPE ===
					// 	"ZUNI")) {
					// 	oView.byId("idVAT_lbl").setText("VAT Registration Details are availablec?: ");
						// oView.byId("idICV_lbl").setText("Are you accredited into the ICV program ?: ");
					// 	oView.byId("S2G1T3F13_lbl").setText("VAT Registration Number");
					// 	oView.byId("S2G1T3F14_lbl").setText("VAT Registration Date");
					// 	oView.byId("icvDetails_Id").setVisible(true);
					// } 
					// else if (Data.BP_TYPE_CODE === "B" && (Data.SUPPL_TYPE === "ZGOV" || Data.SUPPL_TYPE ===
					// 	"ZUNI")) {
					// 	oView.byId("idVAT_lbl").setText("VAT Registration Details are availabled?: ");
						// oView.byId("idICV_lbl").setText("Are you accredited into the ICV program ?: ");
					// 	oView.byId("S2G1T3F13_lbl").setText("VAT Registration Number");
					// 	oView.byId("S2G1T3F14_lbl").setText("VAT Registration Date");
					// 	oView.byId("icvDetails_Id").setVisible(false);
					// }


					// //Trade lic no and Exp date is mandatory only for local supplier.
					// if (Data.BP_TYPE_CODE !== "B") {
					// 	context.getView().byId("S1G4T9F1_lbl").setRequired(false);
					// 	context.getView().byId("S1G4T9F1_lblExp").setRequired(false);
					// }

					//VAT Evidence
					//	if (Data.BP_TYPE_CODE === "B") {
					context.getView().byId("vatquestion").setVisible(true);
					if (Data.VAT_CHECK === "N" || Data.VAT_CHECK === null) {
						context.getView().byId("simpleForm24").setVisible(false);
						// context.getView().byId("id_vatevidence").setVisible(false);

					} else {
						context.getView().byId("simpleForm24").setVisible(true);
						// context.getView().byId("id_vatevidence").setVisible(false);
					}

					// } else {
					// 	context.getView().byId("vatquestion").setVisible(false);
					// 	context.getView().byId("id_vatevidence").setVisible(false);
					// 	context.getView().byId("simpleForm24").setVisible(true);
					// }
					// vat Table and ICV
					if (Data.BP_TYPE_CODE === "B") {
						// context.getView().byId("VAT_RId").setRequired(true);
						// context.getView().byId("VAT_FId").setRequired(true);
						// context.getView().byId("icv_lpId").setRequired(true);
						// context.getView().byId("icv_lvId").setRequired(true);
						// context.getView().byId("icvId").setRequired(true);
						// context.getView().byId("icv_certiId").setRequired(true);
					} else {
						// context.getView().byId("VAT_RId").setRequired(true);
						// context.getView().byId("VAT_FId").setRequired(false);

						// context.getView().byId("icv_lpId").setRequired(false);
						// context.getView().byId("icv_lvId").setRequired(false);
						// context.getView().byId("icvId").setRequired(false);
						// context.getView().byId("icv_certiId").setRequired(false);
					}

					// if (Data.ICV_CHECK === "Y") {
					// 	context.getView().byId("simpleForm25").setVisible(true);
					// 	// context.getView().byId("id_icvevidence").setVisible(true);
					// } else {
					// 	context.getView().byId("simpleForm25").setVisible(false);
					// 	// context.getView().byId("id_icvevidence").setVisible(false);
					// }

					//Visible row count for financial
					// var financialLen = Data.TO_FINANCE.length;
					// context.getView().byId("table_finId").setVisibleRowCount(financialLen);

					//Visible row count for major/Client table
					// var majClientlen = Data.TO_CUSTOMERS.length;
					// context.getView().byId("table_majClientId").setVisibleRowCount(majClientlen);

					//Visible row count & binding for business history in operational section
					var businessHisData = Data.TO_BUSINESS_HISTORY
					var businessHisLen = Data.TO_BUSINESS_HISTORY.length;
					var businessArr = [];
					for (i = 0; i < businessHisData.length; i++) {
						var businessHisObj = {
							"DEALERSHIP": businessHisData[i].DEALERSHIP,
							"PROD_GROUP": businessHisData[i].PROD_GROUP,
							"PURCHASES": businessHisData[i].PURCHASES,
							"REQUEST_NO": businessHisData[i].REQUEST_NO,
							"SINCE": businessHisData[i].SINCE,
							"SUPPLIER_NAME": businessHisData[i].SUPPLIER_NAME
						};
						businessArr.push(businessHisObj);
					}
					var businessHisArryObj = {
						"results": businessArr
					};

					businessHisModel = new JSONModel();
					businessHisModel.setData(businessHisArryObj);
					context.getView().setModel(businessHisModel, "businessHistory");

					context.getView().byId("table_businessHistory").setVisibleRowCount(businessHisLen);

					//Visible row count for Products/services table
					// var prodSer = Data.TO_PRODUCT_SERVICES.length;
					// context.getView().byId("table_productId").setVisibleRowCount(prodSer);

					// Visible row count & data binding for customer details
					var cusDetailslen = Data.TO_CUSTOMERS.length;
					var cusDetails = Data.TO_CUSTOMERS;
					var custDetailsArr = [];
					for (i = 0; i < cusDetails.length; i++) {
						// if (Data.TO_CAPACITY[i].TO_COUNTRY === null) {
						// 	var operCapCountry = null;
						// } else {
						// 	operCapCountry = Data.TO_CAPACITY[i].TO_COUNTRY.LANDX;
						// }
						var custDetailsObj = {
							"CUSTOMER_NAME": cusDetails[i].CUSTOMER_NAME,
							"CUST_NO": cusDetails[i].CUST_NO,
							"YEAR2": cusDetails[i].YEAR2,
							"YEAR1": cusDetails[i].YEAR1
						};
						custDetailsArr.push(custDetailsObj);
					}
					var custDetailsArrObj = {
						"results": custDetailsArr
					};

					custDetailsModel = new JSONModel();
					custDetailsModel.setData(custDetailsArrObj);
					context.getView().setModel(custDetailsModel, "customerDetails");

					context.getView().byId("table_custDetailsId").setVisibleRowCount(cusDetailslen);

					//Fields and tables are hide and show based on company.
					// context._simpleFormHideShow();

					//OEM Fields

					// var OemModel = new JSONModel();
					// var OemExModel = new JSONModel();
					// var OemArr = [];

					// Visible row count & data binding for promoter & management details
					var promoArr = [];
					var promoLen = Data.TO_PROMOTERS.length;
					var promoDetails = Data.TO_PROMOTERS;
					for (i = 0; i < promoDetails.length; i++) {
						// if (Data.TO_OEM[i].OEM_TYPE === "OEM_EX") {
							var promoObj = {
								"DESIGNATION": promoDetails[i].DESIGNATION,
								"NAME": promoDetails[i].NAME,
								"QUALIFICATION": promoDetails[i].QUALIFICATION,
								"ROLE": promoDetails[i].ROLE,
								"WORK_EXP": promoDetails[i].WORK_EXP,
								"YRS_IN_COMP": promoDetails[i].YRS_IN_COMP
							};
							promoArr.push(promoObj);
						// }
					}

					var promoDetailsArrObj = {
						"results": promoArr
					};

					promoDetailsModel = new JSONModel();
					promoDetailsModel.setData(promoDetailsArrObj);
					context.getView().setModel(promoDetailsModel, "promoDetails");

					context.getView().byId("table_opPromoId").setVisibleRowCount(promoLen);

					// 	if (Data.TO_OEM[i].OEM_TYPE === "OEM_NE") {
					// 		var OemExobj = {

					// 			"COMPANY_NAME": Data.TO_OEM[i].COMPANY_NAME,
					// 			"COUNTRY": Data.TO_OEM[i].COUNTRY,
					// 			"REQUEST_NO": Data.TO_OEM[i].REQUEST_NO,
					// 			"OEM_CATEGORY": Data.TO_OEM[i].OEM_CATEGORY,
					// 			"OEM_TYPE": Data.TO_OEM[i].OEM_TYPE

					// 		};
					// 		OemExArr.push(OemExobj);

					// 	}
					// }

					// var OemArrObj = {
					// 	"results": OemArr
					// };
					// OemModel.setData(OemArrObj);
					// context.getView().setModel(OemModel, "OEMDetails");

					// var oemLen = OemArrObj.results.length;
					// context.getView().byId("table_ExOEMId").setVisibleRowCount(oemLen);

					// var OemExArrObj = {
					// 	"results": OemExArr
					// };
					// OemExModel.setData(OemExArrObj);
					// context.getView().setModel(OemExModel, "OEMEXDetails");

					// var oemExLen = OemExArrObj.results.length;
					// context.getView().byId("table_NonExOEMId").setVisibleRowCount(oemExLen);

					//section 6
					if (Data.ACK_VALIDATION === 'Yes') {
						context.getView().byId("checkboxId").setSelected(true);
					} else {
						context.getView().byId("checkboxId").setSelected(false);
					}

					//section 4

					// if (Data.TO_DISCLOSURE_FIELDS.length !== 0) { // added on 14-04-2023 byInder Chouhan For Quick Registration Handling

					// 	if (Data.TO_DISCLOSURE_FIELDS[0].INTEREST_CONFLICT === 'Yes') {
					// 		context.getView().byId("intConflictId").setVisible(true);
					// 		context.getView().byId("intTextConflictId").setVisible(true);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].INTEREST_CONFLICT === 'No') {
					// 		context.getView().byId("intConflictId").setVisible(false);
					// 		context.getView().byId("intTextConflictId").setVisible(false);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].ANY_LEGAL_CASES === 'Yes') {
					// 		context.getView().byId("anylegCase_LId").setVisible(true);
					// 		context.getView().byId("anylegCase_TId").setVisible(true);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].ANY_LEGAL_CASES === 'No') {
					// 		context.getView().byId("anylegCase_LId").setVisible(false);
					// 		context.getView().byId("anylegCase_TId").setVisible(false);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].RELATIVE_WORKING === 'Yes') {
					// 		var len = Data.TO_RELATIVES.length;
					// 		context.getView().byId("table_relativeId").setVisibleRowCount(len);
					// 		context.getView().byId("table_relativeId").setVisible(true);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].RELATIVE_WORKING === 'No') {
					// 		var lenNo = Data.TO_RELATIVES.length;
					// 		context.getView().byId("table_relativeId").setVisibleRowCount(lenNo);
					// 		context.getView().byId("table_relativeId").setVisible(false);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].ERP_MGMT_SYSTEM === 'Yes') {
					// 		context.getView().byId("mgmtSystem_LId").setVisible(true);
					// 		context.getView().byId("mgmtSystem_TId").setVisible(true);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].ERP_MGMT_SYSTEM === 'No') {
					// 		context.getView().byId("mgmtSystem_LId").setVisible(false);
					// 		context.getView().byId("mgmtSystem_TId").setVisible(false);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].INDUSRIAL_DESIGN_SW === 'Yes') {
					// 		context.getView().byId("indstDesign_LId").setVisible(true);
					// 		context.getView().byId("indstDesign_TId").setVisible(true);
					// 	}
					// 	if (Data.TO_DISCLOSURE_FIELDS[0].INDUSRIAL_DESIGN_SW === 'No') {
					// 		context.getView().byId("indstDesign_LId").setVisible(false);
					// 		context.getView().byId("indstDesign_TId").setVisible(false);
					// 	}
					// }

					//Section 5
					context._readAttachment();
					if (Data.REQUEST_TYPE === 1 || Data.REQUEST_TYPE === 2 || Data.REQUEST_TYPE === 3) {
						context.readDupValue(Data.LIC_NO, Data.DIST_NAME1, Data.VAT_REG_NUMBER, Data.REQUEST_NO,Data.TO_ADDRESS,Data.TO_CONTACTS,Data.TO_BANKS);
					}

					//check IBAN is required or not for the selected bank country
					// context._readIBAN();

					var secThirdCount = 0;
					var sTitle = "";
					for (var i = 0; i < context.getView().byId("thirdSection").mForwardedAggregations.subSections.length; i++) {
						if (context.getView().byId("thirdSection").mForwardedAggregations.subSections[i].mBindingInfos.visible !== undefined) {
							if (context.getView().byId("thirdSection").mForwardedAggregations.subSections[i].mBindingInfos.visible.binding.aBindings[0].oValue === 'X') {
								var sTitle = context.getView().byId("thirdSection").mForwardedAggregations.subSections[i];
								secThirdCount++;
							}
						}
					}
					if (secThirdCount === 1) {
						var sLabel = sTitle.mProperties.title;
						context.getView().getModel("thirdSectionHBoxModel").setProperty("/thirdSectionHBoxLabel", sLabel);
						context.getView().getModel("thirdSectionHBoxModel").setProperty("/thirdSectionHBoxVisible", true);
						sTitle.mProperties.title = context.getView().byId("thirdSection").mProperties.title;
					}

					var secFourCount = 0;
					var sTitle2 = "";
					for (var i = 0; i < context.getView().byId("fourthSection").mForwardedAggregations.subSections.length; i++) {
						if (context.getView().byId("fourthSection").mForwardedAggregations.subSections[i].mBindingInfos.visible !== undefined) {
							if (context.getView().byId("fourthSection").mForwardedAggregations.subSections[i].mBindingInfos.visible.binding.aBindings[0].oValue === 'X') {
								var sTitle2 = context.getView().byId("fourthSection").mForwardedAggregations.subSections[i];
								secFourCount++;
							}
						}
					}
					if (secFourCount === 1) {
						var sLabel2 = sTitle2.mProperties.title;
						context.getView().getModel("fourthSectionHBoxModel").setProperty("/fourthSectionHBoxLabel", sLabel2);
						context.getView().getModel("fourthSectionHBoxModel").setProperty("/fourthSectionHBoxVisible", true);
						sTitle2.mProperties.title = context.getView().byId("fourthSection").mProperties.title;
						
					}
				}
				},
				error: function (error) {
					// debugger;
					BusyIndicator.hide();
					// MessageToast.show("cannot read data");
					// context.errorLogCreation(error.responseText, error.statusCode, requestNo,
					// 	context._sUserID);
					var oXMLMsg, oXML;
					var jsonError = JSON.parse(error.responseText) || null;
					// if(jsonError !== null){
					// 	if(jsonError.error.code === "404"){
					// 		context._navtoNotFoundPage(requestNo, "NotFound");
					// 	}
					// }
					// else{
					if (context.isValidJsonString(error.responseText)) {
						if (jsonError.error.code === "404") {
							context._navtoNotFoundPage(requestNo, "NotFound");
						}
						else {
							oXML = JSON.parse(error.responseText);
							oXMLMsg = oXML.error["message"];
							MessageBox.error(oXMLMsg);
						}
					} else {
						oXMLMsg = error.responseText;
						MessageBox.error(oXMLMsg);
					}


				}
				// }
			});
		},

		// onBankKeyCheck: function () {

		// 	if (!this.BankKeyfrag) {
		// 		this.BankKeyfrag = sap.ui.xmlfragment("com.ibspl.ideal.idealregistrationapproval.view.fragments.MissingBankKey", this);
		// 	}
		// 	this.BankKeyfrag.open();
		// },

		// validateBankKey: function (oVendorDetais) {

		// 	var aBankDetails = oVendorDetais.TO_BANKS;
		// 	var aMissingBankKeyDetails = [];
		// 	var oFinalObject = {};

		// 	for (var i = 0; i < aBankDetails.length; i++) {

		// 		if ((aBankDetails[i].BANK_KEY === null || aBankDetails[i].BANK_KEY === undefined || aBankDetails[i].BANK_KEY === "") &&
		// 			oVendorDetais.REQUEST_TYPE !== 7) {
		// 			context.getView().getModel("localModel").setProperty("/BankKeyMessageStrip", true);
		// 			// context.getView().getModel("localModel").setProperty("/ApproveButton", false);
		// 			context.getView().byId("approveBt").setVisible(false);
		// 			// context.getView().getModel("localModel").refresh(true);
		// 			aMissingBankKeyDetails.push(aBankDetails[i]);
		// 			oFinalObject.BankDetails = aMissingBankKeyDetails;
		// 			var oModel = new JSONModel(oFinalObject);
		// 			sap.ui.getCore().setModel(oModel, "MissingBankKeyDetails");
		// 		}
		// 	}
		// },
		// onSyncBankKey: function () {
		// 	var aMissingBankKeyDetails = sap.ui.getCore().getModel("MissingBankKeyDetails").getData().BankDetails;
		// 	var bShowMessage = false;
		// 	sap.ui.core.BusyIndicator.show(0);
		// 	for (var i = 0; i < aMissingBankKeyDetails.length; i++) {
		// 		if (aMissingBankKeyDetails.length - 1 === i) {
		// 			bShowMessage = true;
		// 		}
		// 		context.getBankDetails(aMissingBankKeyDetails[i], bShowMessage, aMissingBankKeyDetails);

		// 	}

		// },
		// UpdateBankKey: function (oBankDetails, bShowMessage) {

		// 	var oPayload = {
		// 		"VALUE": {
		// 			"BANK_DETAILS": oBankDetails
		// 		}
		// 	};

		// 	$.ajax({
		// 		url: "/iVen_EDGE/VENDOR_PORTAL/XSJS/VENDOR_EDITFORM_REQUEST.xsjs?ACTION=UPDATE_BANKKEY",
		// 		type: 'POST',
		// 		data: JSON.stringify(oPayload),
		// 		contentType: 'application/json',
		// 		success: function (data, response) {
		// 			// MessageToast.show("Success");

		// 			context.getView().getModel("localModel").setProperty("/BankKeyMessageStrip", false);
		// 			context.getView().byId("approveBt").setVisible(true);

		// 			// context.getView().getModel("localModel").setProperty("/ApproveButton", true);
		// 			// context.getView().getModel("localModel").refresh(true);

		// 			// if (BankKeySynced === true) {
		// 			// 	MessageBox.success("No. of Bank records synced  (S/4HANA) : 2 \n No. of Bank records missing Bank Key : 1")
		// 			// }
		// 			context._getodata();

		// 		},
		// 		error: function (e) {
		// 			// context.getView().setBusy(false);
		// 			MessageBox.error(e.responseText);
		// 		}
		// 	});

		// },

		//Added by Sumit Singh
		readDupValue: function (iTradeLic, iSupplName, iVatNo, iRequsetNo,addressData,contactData,bankData) {

			var getEventsData;
			var getVatRegNo;
			
			tradelicModel = new JSONModel();
			suppNameModel = new JSONModel();
			vatNoModel = new JSONModel();
			getEventsData = context.getView().getModel("comm").getData();

			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormDataApproval";

			var oPayoload =
			{
				"action": "DUPLICATECHECK",
				"inputData": [{
					"LIC_NO": iTradeLic,
					"VAT_REG_NUMBER": iVatNo,
					"DIST_NAME1": iSupplName,
					"REQUEST_NO": iRequsetNo
				}],
				"eventsData": getEventsData,
				"addressData": addressData,
				"contactsData":contactData,
				"bankData":bankData,
				"userDetails" : {
					"USER_ROLE": sUserRole,
					// that.getOwnerComponent().getModel( "userDetailsModel").getProperty("/USER_ROLE"),
					"USER_ID": that._sUserID
					// that.getOwnerComponent().getModel( "userDetailsModel").getProperty("/EMAIL")
			}
			}

			var Postdata = JSON.stringify(oPayoload);
			BusyIndicator.show();

			$.ajax({
				url: url,
				type: "POST",
				contentType: 'application/json',
				data: Postdata,
				success: function (data, response) {
					BusyIndicator.hide();
					getVatRegNo = context.getView().getModel("vendorDetails").getProperty("/VAT_REG_NUMBER");
					var oModel = new JSONModel(data.value[0]);
					context.getView().setModel(oModel, "checkDuplicates");

					var Data = data.value[0];
					if (Data.LIC_NO.length === 0) {
						that.getView().getModel("localModel").setProperty("/MsgStrip1", false);
						that.getView().getModel("localModel").refresh(true);
					}
					else {
						that.getView().getModel("localModel").setProperty("/Notificationlist", true);
						that.getView().getModel("localModel").setProperty("/MsgStrip1", true);
						that.getView().getModel("localModel").refresh(true);
						tradelicModel.setData(Data.TRADE_LIC_NO);
						sap.ui.getCore().setModel(tradelicModel, "tradelicDetails");
					}

					if (Data.DIST_NAME1.length === 0) {
						that.getView().getModel("localModel").setProperty("/MsgStrip2", false);
						that.getView().getModel("localModel").refresh(true);
					}
					else {
						that.getView().getModel("localModel").setProperty("/Notificationlist", true);
						that.getView().getModel("localModel").setProperty("/MsgStrip2", true);
						that.getView().getModel("localModel").refresh(true);
						suppNameModel.setData(Data.DIST_NAME1);
						sap.ui.getCore().setModel(suppNameModel, "suppNameDetails");
					}

					if (Data.VAT_REG_NUMBER.length === 0) {
						that.getView().getModel("localModel").setProperty("/MsgStrip3", false);
						that.getView().getModel("localModel").refresh(true);
					} else if(Data.VAT_REG_NUMBER.length > 0 && getVatRegNo !== null) {
						that.getView().getModel("localModel").setProperty("/Notificationlist", true);
						that.getView().getModel("localModel").setProperty("/MsgStrip3", true);
						that.getView().getModel("localModel").refresh(true);

						vatNoModel.setData(Data.VAT_REG_NUMBER);
						sap.ui.getCore().setModel(vatNoModel, "vatDetails");
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
					// MessageBox.error(e.responseText);
				}

			});
		},
		// 	tradelicModel = new JSONModel();
		// 	suppNameModel = new JSONModel();
		// 	vatNoModel = new JSONModel();
		// 	var oPayload = {
		// 			VALUE: {
		// 				"TRADE_LIC_NO": iTradeLic,
		// 				"VAT_REG_NUMBER": iVatNo,
		// 				"VENDOR_NAME1": iSupplName,
		// 				"REQUEST_NO": iObrNo
		// 			}
		// 		}
		// 		// context.getView().setBusy(true);
		// 	$.ajax({
		// 		url: "/iVen_EDGE/VENDOR_PORTAL/XSJS/VENDOR_ONBOARDING.xsjs?ACTION=DUPLICATECHECK",
		// 		type: 'POST',
		// 		data: JSON.stringify(oPayload),
		// 		contentType: 'application/json',
		// 		success: function (data, response) {
		// 			context.getView().setBusy(false);
		// 			var Data = JSON.parse(data);
		// 			if (Data.TRADE_LIC_NO.length === 0) {
		// 				that.getView().getModel("localModel").setProperty("/MsgStrip1", false);
		// 				that.getView().getModel("localModel").refresh(true);
		// 			} else {

		// 				that.getView().getModel("localModel").setProperty("/Notificationlist", true);
		// 				that.getView().getModel("localModel").setProperty("/MsgStrip1", true);
		// 				that.getView().getModel("localModel").refresh(true);
		// 				tradelicModel.setData(Data.TRADE_LIC_NO);
		// 				sap.ui.getCore().setModel(tradelicModel, "tradelicDetails");
		// 			}

		// 			if (Data.VENDOR_NAME1.length === 0) {
		// 				that.getView().getModel("localModel").setProperty("/MsgStrip2", false);
		// 				that.getView().getModel("localModel").refresh(true);
		// 			} else {

		// 				that.getView().getModel("localModel").setProperty("/Notificationlist", true);
		// 				that.getView().getModel("localModel").setProperty("/MsgStrip2", true);
		// 				that.getView().getModel("localModel").refresh(true);

		// 				suppNameModel.setData(Data.VENDOR_NAME1);
		// 				sap.ui.getCore().setModel(suppNameModel, "suppNameDetails");
		// 			}

		// 			if (Data.VAT_REG_NUMBER.length === 0) {
		// 				that.getView().getModel("localModel").setProperty("/MsgStrip3", false);
		// 				that.getView().getModel("localModel").refresh(true);
		// 			} else {

		// 				that.getView().getModel("localModel").setProperty("/Notificationlist", true);
		// 				that.getView().getModel("localModel").setProperty("/MsgStrip3", true);
		// 				that.getView().getModel("localModel").refresh(true);

		// 				vatNoModel.setData(Data.VAT_REG_NUMBER);
		// 				sap.ui.getCore().setModel(vatNoModel, "vatDetails");
		// 			}

		// 		},
		// 		error: function (e) {
		// 			// context.getView().setBusy(false);
		// 			MessageBox.error(e.responseText);
		// 		}
		// 	});

		// },

		_readIBAN: function () {

			
			var paymentlength = myJSONModel.getData().TO_BANKS.length;

			for (var i = 0; i < paymentlength; i++) {
				if (myJSONModel.getData().TO_BANKS[i].PAYMENT_TYPE === 'PRI') {
					if (myJSONModel.getData().TO_BANKS[i].TO_COUNTRY !== null) {
						var priBankCountry = myJSONModel.getData().TO_BANKS[i].TO_COUNTRY.LAND1;
						that._readIBAN_PRICondition(priBankCountry, "primaryBankCountry");
					} else {
						priBankCountry = null;
						context.getView().byId("S2G1T1F5_lbl").setRequired(false);
					}
				}
				if (myJSONModel.getData().TO_BANKS[i].PAYMENT_TYPE === 'OTH') {
					if (myJSONModel.getData().TO_BANKS[i].TO_COUNTRY !== null) {
						var othBankCountry = myJSONModel.getData().TO_BANKS[i].TO_COUNTRY.LAND1;
						that._readIBAN_OTHCondition(othBankCountry, "otherBankCountry");
					} else {
						othBankCountry = null;
						context.getView().byId("tableIbanId").setRequired(false);
					}
				}
			}

		},

		_readIBAN_PRICondition: function (countryKey) {
			sap.ui.core.BusyIndicator.show();
			
			IbanPRIModel = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIbanCountry?$filter=LAND1 eq '" + countryKey + "'";

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (data, response) {
					sap.ui.core.BusyIndicator.hide();
					if (data.value.length > 0) {
						context.getView().byId("S2G1T1F5_lbl").setRequired(true);
					} else {
						context.getView().byId("S2G1T1F5_lbl").setRequired(false);
					}
				},
				error: function (error) {
					sap.ui.core.BusyIndicator.hide();
					// context.errorLogCreation(error.responseText, error.statusCode, requestNo,
					// context._sUserID);
					var oXMLMsg, oXML;
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

		_readIBAN_OTHCondition: function (countryKey) {
			IbanOTHModel = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIbanCountry?$filter=LAND1 eq '" + countryKey + "'";

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (data, response) {
					if (data.value.length > 0) {
						context.getView().byId("tableIbanId").setRequired(true);
					} else {
						context.getView().byId("tableIbanId").setRequired(false);
					}

				},
				error: function (error) {
					// context.errorLogCreation(error.responseText, error.statusCode, requestNo,
					// context._sUserID);
					var oXMLMsg, oXML;
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

		loglinkpress: function (oEvent) {

			var name = oEvent.getSource().mBindingInfos.text.binding.oValue;
			var filename = name.split(',')[0];
			var OT_docid = name.split(',')[1];

			var logModel = oEvent.getSource().mBindingInfos.text.parts[0].model;
			var LogDataObject = oEvent.getSource().getBindingContext(logModel).getObject();

			if (LogDataObject.EVENT_TYPE === "NDA") {

				var linkObj = {
					"FILE_NAME": filename,
					"OT_DOC_ID": OT_docid,
					"DRAFT_IND": null
				};
				context.getToken(linkObj, "", "", "DOWN");
			}

		},

		//read change log details 
		_readLogDetails: function () {
			sap.ui.core.BusyIndicator.show();
			LogDetailModel = new JSONModel();

			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegSupplierLog?$filter=REQUEST_NO eq " + requestNo + "";

			$.ajax({
				url: path,
				type: 'GET',
				data: data,
				contentType: 'application/json',
				async: false,
				success: function (Data, response) {

					sap.ui.core.BusyIndicator.hide();

					for (var i = 0; i < Data.value.length; i++) {
						Data.value[i].UPDATED_ON = new Date(Data.value[i].UPDATED_ON);
						Data.value[i].REQUEST_NO = String(Data.value[i].REQUEST_NO);
					}
					LogDetailModel.setData(Data.value);
					context.getView().setModel(LogDetailModel, "displayLog");
				},
				error: function (error) {
					sap.ui.core.BusyIndicator.hide();
					// MessageToast.show("cannot read data");
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID);
					var oXMLMsg, oXML;
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

		//Open log details dialog
		handleLogDetails: function () {
			
			if (!that.filterfrag1) {
				that.filterfrag1 = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.logTable", that);
				that.getView().addDependent(that.filterfrag1);
			}
			that.filterfrag1.open();
		},

		closelogDialog: function () {
			
			that.filterfrag1.close();
			that.filterfrag1.destroy();
			that.filterfrag1 = null;
		},

		//Trade License number duplicate check
		_tradeDupCheck: function (value, requestNo) {
			
			// sap.ui.core.BusyIndicator.show();
			// context.getView().setBusy(true);
			tradelicModel = new JSONModel();
			var sEntity = "/VenOnboardForm";
			var oFilters = [];
			if (value !== null) {
				var F1 = new sap.ui.model.Filter("LIC_NO", sap.ui.model.FilterOperator.EQ, value);
				oFilters.push(F1);
				var F2 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '1');
				oFilters.push(F2);
				var F3 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '2');
				oFilters.push(F3);
				var F4 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '3');
				oFilters.push(F4);
				var F5 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, '8');
				oFilters.push(F5);
				var F6 = new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.NE, requestNo);
				oFilters.push(F6);

				oModel.read(sEntity, {
					urlParameters: {
						"$expand": ["statusDesc"]
					},

					filters: oFilters,
					success: function (Data) {
						// sap.ui.core.BusyIndicator.hide();
						// context.getView().setBusy(false);
						if (Data.results.length === 0) {
							that.getView().getModel("localModel").setProperty("/MsgStrip1", false);
							that.getView().getModel("localModel").refresh(true);
						} else {

							that.getView().getModel("localModel").setProperty("/Notificationlist", true);
							that.getView().getModel("localModel").setProperty("/MsgStrip1", true);
							that.getView().getModel("localModel").refresh(true);

							tradelicModel.setData(Data);
							sap.ui.getCore().setModel(tradelicModel, "tradelicDetails");
						}
					},
					error: function (error) {
						// sap.ui.core.BusyIndicator.hide();
						// context.getView().setBusy(false);
						// MessageToast.show("cannot read data");
						// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
						// 	context._sUserID);
						var oXMLMsg, oXML;
						if (context.isValidJsonString(error.responseText)) {
							oXML = JSON.parse(error.responseText);
							oXMLMsg = oXML.error["message"];
						} else {
							oXMLMsg = error.responseText
						}

						MessageBox.error(oXMLMsg);

					}
				});
			}

		},

		//Duplicate Supplier check
		_suppDupCheck: function (value, requestNo) {

			
			// sap.ui.core.BusyIndicator.show();
			// context.getView().setBusy(true);
			suppNameModel = new JSONModel();
			var sEntity = "/VenOnboardForm";
			var oFilters = [];
			var F1 = new sap.ui.model.Filter("DIST_NAME1", sap.ui.model.FilterOperator.EQ, value);
			oFilters.push(F1);
			var F2 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '1');
			oFilters.push(F2);
			var F3 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '2');
			oFilters.push(F3);
			var F4 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '3');
			oFilters.push(F4);
			var F5 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, '8');
			oFilters.push(F5);
			var F6 = new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.NE, requestNo);
			oFilters.push(F6);

			oModel.read(sEntity, {
				urlParameters: {
					"$expand": ["statusDesc"]
				},
				filters: oFilters,
				success: function (Data) {

					// sap.ui.core.BusyIndicator.hide();
					// context.getView().setBusy(false);
					if (Data.results.length === 0) {
						that.getView().getModel("localModel").setProperty("/MsgStrip2", false);
						that.getView().getModel("localModel").refresh(true);
					} else {

						that.getView().getModel("localModel").setProperty("/Notificationlist", true);
						that.getView().getModel("localModel").setProperty("/MsgStrip2", true);
						that.getView().getModel("localModel").refresh(true);

						suppNameModel.setData(Data);
						sap.ui.getCore().setModel(suppNameModel, "suppNameDetails");
					}
				},
				error: function (error) {
					// sap.ui.core.BusyIndicator.hide();
					// context.getView().setBusy(false);
					// MessageToast.show("cannot read data");
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID);
					var oXMLMsg, oXML;
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

		//VAT number duplicate check
		_vatDupCheck: function (value, requestNo) {
			
			// sap.ui.core.BusyIndicator.show();
			// context.getView().setBusy(true);
			vatNoModel = new JSONModel();
			var sEntity = "/VenOnboardForm";
			var oFilters = [];
			var F1 = new sap.ui.model.Filter("VAT_REG_NUMBER", sap.ui.model.FilterOperator.EQ, value);
			oFilters.push(F1);
			var F2 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '1');
			oFilters.push(F2);
			var F3 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '2');
			oFilters.push(F3);
			var F4 = new sap.ui.model.Filter("REQUEST_TYPE", sap.ui.model.FilterOperator.EQ, '3');
			oFilters.push(F4);
			var F5 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, '8');
			oFilters.push(F5);
			var F6 = new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.NE, requestNo);
			oFilters.push(F6);

			oModel.read(sEntity, {
				urlParameters: {
					"$expand": ["statusDesc"]
				},
				filters: oFilters,
				success: function (Data) {
					// sap.ui.core.BusyIndicator.hide();
					// context.getView().setBusy(false);
					if (Data.results.length === 0) {
						that.getView().getModel("localModel").setProperty("/MsgStrip3", false);
						that.getView().getModel("localModel").refresh(true);
					} else {

						that.getView().getModel("localModel").setProperty("/Notificationlist", true);
						that.getView().getModel("localModel").setProperty("/MsgStrip3", true);
						that.getView().getModel("localModel").refresh(true);

						vatNoModel.setData(Data);
						sap.ui.getCore().setModel(vatNoModel, "vatDetails");
					}
				},
				error: function (error) {
					// sap.ui.core.BusyIndicator.hide();
					// context.getView().setBusy(false);
					// MessageToast.show("cannot read data");
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID);
					var oXMLMsg, oXML;
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

		//General Section EDIT functionality for Procurement Team
		handleEditForm: function (oEvent) {
			// debugger;
			var getUserData = context.getOwnerComponent().getModel("userModel").getData();
			var approvalData = context.getView().getModel("vendorDetails").getData();
			// added on 13-04-2023 by Inder Chouhan
			var IS_UAE_COMPANY = null;
			var ISSUE_ELEC_TAX_INV = null;
			var SOLE_DIST_MFG_SER = null;
			// added on 13-04-2023 by Inder Chouhan
			if (approvalData.TO_ATTACH_FIELDS.length === 0) {
				IS_UAE_COMPANY = "";
				ISSUE_ELEC_TAX_INV = "";
				SOLE_DIST_MFG_SER = "";
			} else {
				IS_UAE_COMPANY = approvalData.TO_ATTACH_FIELDS[0].IS_UAE_COMPANY;
				ISSUE_ELEC_TAX_INV = approvalData.TO_ATTACH_FIELDS[0].ISSUE_ELEC_TAX_INV;
				SOLE_DIST_MFG_SER = approvalData.TO_ATTACH_FIELDS[0].SOLE_DIST_MFG_SER;
			}
			var navObj = {
				"USER_ID": getUserData.userId,
				"UNAME": getUserData.userName,
				"ENTITY_CODE": approvalData.ENTITY_CODE,
				"REG_NO": approvalData.REQUEST_NO,
				"CREATION_TYPE": approvalData.CREATION_TYPE,
				"VNAME": approvalData.DIST_NAME1,
				"SAP_DIST_CODE": approvalData.SAP_DIST_CODE,
				"VEMAIL": approvalData.REGISTERED_ID,
				"REQUEST_TYPE": approvalData.REQUEST_TYPE,
				"STATUS": approvalData.STATUS,
				"STATUS_DESC": approvalData.TO_STATUS.DESCRIPTION || "",
				"BP_TYPE_CODE": context.OG_BP_TYPE_CODE || myJSONModel.getData().BP_TYPE_CODE,
				"BP_TYPE_DESC": approvalData.BP_TYPE_DESC,
				// "SUPPLIERTYPE_CODE": approvalData.SUPPL_TYPE,
				// "SUPPLIER_TYPE_DESC": approvalData.SUPPL_TYPE_DESC,
				"IDEAL_DIST_CODE": approvalData.IDEAL_DIST_CODE,
				"CREATED_BY": approvalData.REQUESTER_ID,
				"IS_UAE_COMPANY": IS_UAE_COMPANY, // added on 13-04-2023 by Inder Chouhan
				"ISSUE_ELEC_TAX_INV": ISSUE_ELEC_TAX_INV, // added on 13-04-2023 by Inder Chouhan
				"SOLE_DIST_MFG_SER": SOLE_DIST_MFG_SER, // added on 13-04-2023 by Inder Chouhan
				"APPROVER_LEVEL": approvalData.APPROVER_LEVEL,
				// "APPROVER_ROLE": approvalData.APPROVER_ROLE,
				// "NEXT_APPROVER": approvalData.NEXT_APPROVER,
				"LAST_SAVED_STEP": approvalData.LAST_SAVED_STEP,
				"SUBMISSION_DATE": approvalData.SUBMISSION_DATE,
				"VAT_CHECK": approvalData.VAT_CHECK,
				"REGISTERED_ID" : approvalData.REGISTERED_ID
			};

			var oEditViewModel = new sap.ui.model.json.JSONModel(navObj);
			that.getOwnerComponent().setModel(oEditViewModel, "editDetail");

			//Navigate to edit page.
			BusyIndicator.show();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("editDetails", {
				RequestNO: approvalData.REQUEST_NO
			});

		},

		handleTradeSearch: function (oEvent) {

			var sQuery = oEvent.getParameter('value');
			var oTable = sap.ui.getCore().byId("myTradeDialog");
			this.binding = oTable.getBinding("items");

			if (sQuery && sQuery.length > 0) {

				var oFilter = new Filter("DIST_NAME1", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter1 = new Filter("REQUEST_NO", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFil = new sap.ui.model.Filter([oFilter, oFilter1]);
				this.binding.filter(oFil, sap.ui.model.FilterType.Application);
			} else {
				this.binding.filter([]);
			}
		},

		onTradeLicCheck: function () {

			if (!this.tradefrag) {
				this.tradefrag = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.tradeCheck", this);
			}
			this.tradefrag.open();
		},

		handleTradeClose: function (oEvent) {

			this.tradefrag.destroy();
			this.tradefrag = null;
		},

		handleSuppSearch: function (oEvent) {

			var sQuery = oEvent.getParameter('value');
			var oTable = sap.ui.getCore().byId("mySupplierDialog");
			this.binding = oTable.getBinding("items");

			if (sQuery && sQuery.length > 0) {

				var oFilter = new Filter("TRADE_LIC_NO", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter1 = new Filter("REQUEST_NO", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFil = new sap.ui.model.Filter([oFilter, oFilter1]);
				this.binding.filter(oFil, sap.ui.model.FilterType.Application);
			} else {
				this.binding.filter([]);
			}
		},

		onSupplierCheck: function () {

			if (!this.suppcheckfrag) {
				this.suppcheckfrag = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.supplierCheck", this);
			}
			this.suppcheckfrag.open();
		},

		handleSuppClose: function () {

			this.suppcheckfrag.destroy();
			this.suppcheckfrag = null;
		},

		onVatCheck: function () {

			if (!this.vatfrag) {
				this.vatfrag = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.vatCheck", this);
			}
			this.vatfrag.open();
		},

		handleVatClose: function (oEvent) {

			this.vatfrag.destroy();
			this.vatfrag = null;
		},

		//Simple form visibility check
		_checkSimpleFormVisibility: function (simpleFormId, objectPagesectionId) {

			var flag = false;
			var sId = null;
			var elements = context.getView().byId(simpleFormId)._aElements;
			for (var i = 0; i < elements.length; i++) {
				sId = elements[i].sId;
				if (sId.indexOf("title") === -1) {
					if (context.getView().byId(sId).getVisible()) {
						flag = true;
					}
				}
			}
			context.getView().byId(simpleFormId).setVisible(flag);
			context.getView().byId(objectPagesectionId).setVisible(flag);

		},

		_validateSectionOneSimpleForm: function () { },

		_validateSectionTwoSimpleForm: function () {
			this._checkSimpleFormVisibility("simpleForm6", "paymentInfo_Id");
		},

		_validateSectionThreeSimpleForm: function () {
			this._checkSimpleFormVisibility("simpleForm20", "supplier_Id");
			this._checkSimpleFormVisibility("simpleForm7", "orderDetails_Id");
		},

		_validateSectionFourSimpleForm: function () {
			this._checkSimpleFormVisibility("simpleForm8", "itar_fcpa_Id");
			this._checkSimpleFormVisibility("simpleForm9", "itEquTools_Id");
			this._checkSimpleFormVisibility("simpleForm11", "overview_Id");
			this._checkSimpleFormVisibility("simpleForm12", "supplierInputMat_Id");
			this._checkSimpleFormVisibility("simpleForm13", "production_Id");
			this._checkSimpleFormVisibility("simpleForm14", "storage_Id");
			this._checkSimpleFormVisibility("simpleForm16", "technology_Id");
			this._checkSimpleFormVisibility("simpleForm21", "healthEnvi_Id");
		},

		_simpleFormHideShow: function () {
			context._validateSectionOneSimpleForm();
			context._validateSectionTwoSimpleForm();
			context._validateSectionThreeSimpleForm();
			context._validateSectionFourSimpleForm();
		},

		// _validateBussinessInfoTable: function () {

		// 	if (data.VISIBLE[0].S1G4T2F1 === null && data.VISIBLE[0].S1G4T3F1 === null && data.VISIBLE[0].S1G4T4F1 === null &&
		// 		data.VISIBLE[0].S1G4T5F1 === null && data.VISIBLE[0].S1G4T6F1 === null && data.VISIBLE[0].S1G4T7F1 === null) {
		// 		this.getView().byId("bussinessInfoTable_Id").setVisible(false);
		// 	}
		// },

		//Reading supplier attachments
		_readAttachment: function () {
			// debugger;
			var G25 = [];
			var G27 = [];
			var G28 = [];
			var G26 = [];
			var G24 = [];
			var G6 = [];
			var G7 = [];
			var G8 = [];
			var G9 = [];
			var G10 = [];
			var G24 = [];

			var attachLen = myJSONModel.getData().TO_ATTACHMENTS.length;
			for (var i = 0; i < attachLen; i++) {
				if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G25') {
					// PAN CERTIFICATE
					G25.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G27') {
					// GST CERTIFICATE
					G27.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G28') {
					// LICENSE CERTIFICATE
					G28.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G26') {
					// UPLOAD DISCLOSURE FORM
					G26.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G24') {
					// OTHER CERTIFICATES
					G24.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				}else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === '6') {
					// COMPANY PROFILE
					G6.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === '7') {
					// DISTRIBUTOR DOCUMENT
					G7.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === '8') {
					// BANK LETTERHEAD
					G8.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === '9') {
					// TRN CERTIFICATE
					G9.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === '10') {
					// ISO CERTIFICATE
					G10.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} 
			}

			var G25Model = new JSONModel();
			G25Model.setData(G25);
			context.getView().setModel(G25Model, "G25Json");

			var G27Model = new JSONModel();
			G27Model.setData(G27);
			context.getView().setModel(G27Model, "G27Json");

			var G28Model = new JSONModel();
			G28Model.setData(G28);
			context.getView().setModel(G28Model, "G28Json");

			var G26Model = new JSONModel();
			G26Model.setData(G26);
			context.getView().setModel(G26Model, "G26Json");

			var G24Model = new JSONModel();
			G24Model.setData(G24);
			context.getView().setModel(G24Model, "G24Json");

			var G6Model = new JSONModel();
			G6Model.setData(G6);
			// if (G6Model.getData().length === 1) {
			// 	//Changes done
			// 	if (G6Model.getData()[0].ATTACH_DESC === "Certificate issued from the Manufacturer / service provider") {
			// 		G6Model.getData()[1] = G6Model.getData()[0];
			// 		this.getView().byId("id_UAETax1").setVisible(false);
			// 		this.getView().byId("id_UAETax2").setVisible(true);
			// 	} else {
			// 		this.getView().byId("id_UAETax1").setVisible(true);
			// 		this.getView().byId("id_UAETax2").setVisible(false);
			// 	}

			// }
			// if (G6Model.getData().length === 2) {
			// 	//Changes done
			// 	if (G6Model.getData()[1].ATTACH_DESC !== G6Model.getData()[0].ATTACH_DESC) {
			// 		this.getView().byId("id_UAETax1").setVisible(true);
			// 		this.getView().byId("id_UAETax2").setVisible(true);
			// 	}

			// }
			context.getView().setModel(G6Model, "G6Json");

			var G7Model = new JSONModel();
			G7Model.setData(G7);
			context.getView().setModel(G7Model, "G7Json");

			var G8Model = new JSONModel();
			G8Model.setData(G8);
			context.getView().setModel(G8Model, "G8Json");

			var G9Model = new JSONModel();
			G9Model.setData(G9);
			context.getView().setModel(G9Model, "G9Json");

			var G10Model = new JSONModel();
			G10Model.setData(G10);
			context.getView().setModel(G10Model, "G10Json");

		},

		//Downlod attachments
		onDownload: function (oEvent) {
			// debugger;
			var sbIndex = "",
				content = "",
				fileName = "",
				mimeType = "";
			var model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;

			// if (model === "G6Json" || model === "G7Json" || model === "G10Json" || model === "G22Json" || model === "G23Json") {
			// 	sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
			// } else {
				sbIndex = parseInt(oEvent.getSource().getBindingContext(model).getPath().split("/")[1]);
			// }

			var oModel = oView.getModel(model).oData[sbIndex];

			//var obj = oEvent.getSource().getBindingContext(model).getObject();

			var iDocId = oModel.OT_DOC_ID;

			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormCMS("+ iDocId +")/$value";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (data, responce) {

					// if (data.value.length > 0) {
						// context.downloadFileContent(data.value[0].FILE_TYPE, data.value[0].SR_NO, data.value[0].FILE_NAME, data.value[0].FILE_MIMETYPE, data.value[0].FILE_CONTENT);
					// } else {
					// 	MessageBox.error("Attachments are empty.");
					// }
					context.fileType(iDocId, data)
				},
				error: function (error) {

					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"];
					} else {
						oXMLMsg = error.responseText
					}
					MessageBox.error(oXMLMsg);
				}
			});

			// if (model === "G1Json" || model === "G11Json" || model === "G12Json" || model === "G13Json" || model === "G14Json" ||
			// 	model === "G15Json" || model === "G24Json" || model === "G4Json" || model === "G3Json" || model === "G2Json") {
			// 	sbIndex = parseInt(oEvent.getSource().getBindingContext(model).getPath().split("/")[1]);
			// }
			// else {
			// 	sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
			// }
			// var oModel = oView.getModel(model).oData[sbIndex];

			// if (oModel.DRAFT_IND === null) {
			// 	content = oModel.FILE_CONTENT;
			// 	fileName = oModel.FILE_NAME;
			// 	mimeType = oModel.FILE_MIMETYPE;

			// 	context.downloadAttachment(content, fileName, mimeType);
			// } else {
			// 	context.downloadAttachmentContent(oModel.REQUEST_NO, oModel.SR_NO, oModel.FILE_NAME, oModel.FILE_MIMETYPE, oModel.FILE_CONTENT);
			// }
		},
		fileType : function(iDocId, data){
			// debugger;
			var iDocId = "(DOC_ID eq " + iDocId + ")";
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormCMS?$filter=" + iDocId;
			var FILE_CONTENT = data;
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (data, responce) {
					if (data.value.length > 0) {
						context.downloadFileContent(data.value[0].FILE_TYPE || null, data.value[0].SR_NO || null, data.value[0].FILE_NAME, data.value[0].FILE_MIMETYPE, FILE_CONTENT);
					} else {
						MessageBox.error("Attachments are empty.");
					}
				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"];
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},
		downloadFileContent: function (iREQUEST_NO, iSR_NO, sFILE_NAME, sFILE_MIMETYPE, sFILE_CONTENT) {

			var aFilter = [],
				fileContent = null;
			// sFILE_CONTENT = atob(sFILE_CONTENT);
			sFILE_CONTENT = sFILE_CONTENT;
			context.downloadAttachment(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);

		},
		downloadAttachment: function (content, fileName, mimeType) {
			download("data:application/octet-stream;base64," + content, fileName, mimeType);
			var HttpRequest = new XMLHttpRequest();
			// x.open("GET", "http://danml.com/wave2.gif", true);
			HttpRequest.responseType = 'blob';
			HttpRequest.onload = function (e) {
				download(HttpRequest.response, fileName, mimeType);
			}
			HttpRequest.send();
		},
		//generate token to access open test server
		getToken: function (attachObj, blobData, model, value) {

			var form = new FormData();
			form.append("username", context.tokenusername);
			form.append("password", context.tokenpass);

			var settings = {
				"url": "/OpenText/otcs/cs.exe/api/v1/auth",
				"method": "POST",
				"timeout": 0,
				"processData": false,
				"mimeType": "multipart/form-data",
				"contentType": false,
				"data": form
			};
			$.ajax(settings).done(function (response) {

				if (value === "DOWN") {
					context._downOSTFile(attachObj, response);
				}
			});
		},

		//download attachment from open text server
		_downOSTFile: function (oModel, token) {
			var file_Id = "",
				fileName = "";

			if (oModel.DRAFT_IND === null) {

				file_Id = oModel.OT_DOC_ID;
				fileName = oModel.FILE_NAME;

				context.downloadAttachment(file_Id, fileName, token);
			} else {
				context.downloadAttachmentContent(oModel.REQUEST_NO, oModel.SR_NO, oModel.FILE_NAME, oModel.OT_DOC_ID,
					token);
			}
		},

		//read open text server credentials
		_readTokenCredentials: function () {
			// debugger;
			sap.ui.core.BusyIndicator.show();
			myJSONModelToken = new JSONModel();
			var sEntity = "/CredentialMaster";

			oModel.read(sEntity, {
				success: function (Data) {
					// debugger;
					sap.ui.core.BusyIndicator.hide();
					if (Data.results.length !== 0) {
						that.tokenusername = Data.USERNAME;
						that.tokenpass = Data.PASSWORD;
					} else {
						MessageBox.error("Open text credentials missing.");
					}

				},
				error: function (error) {
					// debugger;
					sap.ui.core.BusyIndicator.hide();
					// MessageToast.show("cannot read token credentials");
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
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
		onPostMessage: function () {
			
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MessengerService";
			var vendorDetails = context.getView().getModel("vendorDetails").getData();
			var userDetails = context.getView().getModel("userModel").getData()
			var oPayload =
			{
				"action": "APPROVER",
				"messengerData": {
					"loginId": userDetails.userId,
					"mailTo": vendorDetails.REGISTERED_ID
				},
				"inputData": [{
					"REQUEST_NO": vendorDetails.REQUEST_NO,
					"ENTITY_CODE": vendorDetails.ENTITY_CODE,
					"REGISTERED_ID": vendorDetails.REGISTERED_ID,
					"DIST_NAME1": vendorDetails.DIST_NAME1,
					"REQUESTER_ID": vendorDetails.REQUESTER_ID
				}],
				"eventsData": [{
					"REQUEST_NO": vendorDetails.REQUEST_NO,
					"EVENT_NO": 0,
					"EVENT_CODE": 0,
					"EVENT_TYPE": "MSG",
					"USER_ID": userDetails.userId,
					"USER_NAME": userDetails.userName,
					"COMMENT": that.getView().byId("emailTextId").getValue(),
					"CREATED_ON": vendorDetails.CREATED_ON
				}],
				"userDetails" : {
					"USER_ROLE": sUserRole,
					// that.getOwnerComponent().getModel( "userDetailsModel").getProperty("/USER_ROLE"),
					"USER_ID": that._sUserID
					// that.getOwnerComponent().getModel( "userDetailsModel").getProperty("/EMAIL")
			}
			}
			BusyIndicator.show();
			var Postdata = JSON.stringify(oPayload);
			this.postAjaxs(url, "POST", Postdata, "messagePost");
		},
		//Read Events
		_readTimelineData: function () {
			// debugger;
			myJSONModel12 = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RegEventsLog?$filter=REQUEST_NO eq " + requestNo;

			$.ajax({
				url: url,
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (data, response) {
					// debugger;
					BusyIndicator.hide();
					// that.getView().byId("DynamicSideContent").setShowSideContent(true);
					// context.handleEvents();

					for (var i = 0; i < data.value.length; i++) {
						data.value[i].CREATED_ON = new Date(data.value[i].CREATED_ON);
					}
					var oModel = new JSONModel(data.value);
					myJSONModel12.setData(data.value);
					context.getView().setModel(oModel, "comm");
					that.onSideContent("REGAPPR_EVENT");

				},
				error: function (error) {
					// debugger;
					BusyIndicator.hide();
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
		onSideContent:function(sCode){
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealSettings?$filter=CODE eq '" + sCode+"'";

			$.ajax({
				url: url,
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (data, response) {
					BusyIndicator.hide();
					var isEnable = data.value[0].SETTING;
					if(isEnable === "X"){
						that.getView().byId("DynamicSideContent").setShowSideContent(true);
					}
					else{
						that.getView().byId("DynamicSideContent").setShowSideContent(false);
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
		//Handle Back navigation
		onBack: function () {
			// debugger;
			if(myJSONModel1 !== undefined){
				myJSONModel1.setData(null);
			}

			if(myJSONModel2 !== undefined){
				myJSONModel2.setData(null);
			}
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteMasterPage");

			if(myJSONModel3 !== undefined) {
				myJSONModel3.setData(null);
			}

			if(myJSONModel4 !== undefined){
				myJSONModel4.setData(null);
			}
			if(myJSONModel5 !== undefined){
				myJSONModel5.setData(null);
			}
			if(myJSONModel6 !== undefined){
				myJSONModel6.setData(null);
			}
			if(myJSONModel7 !== undefined){
				myJSONModel7.setData(null);
			}
			if(myJSONModel11 !== undefined){
				myJSONModel11.setData(null);
			}

			if(myJSONModel12 !== undefined){
				myJSONModel12.setData(null);
			}
			if(businessHisModel !== undefined){
				businessHisModel.setData(null);
			}
			if(custDetailsModel !== undefined){
				custDetailsModel.setData(null);
			}
			// if (myJSONModel.getData().REQUEST_TYPE === 1 || myJSONModel.getData().REQUEST_TYPE === 2 || myJSONModel.getData().REQUEST_TYPE === 3) {
			// 	tradelicModel.setData(null);
			// 	suppNameModel.setData(null);
			// 	vatNoModel.setData(null);
			// }\

			if(myJSONModel !== undefined){
				myJSONModel.setData(null);
			}
			context.getView().getModel("localModel").setProperty("/Notificationlist", false);
			context.getView().getModel("localModel").setProperty("/MsgStrip1", false);
			context.getView().getModel("localModel").setProperty("/MsgStrip2", false);
			context.getView().getModel("localModel").setProperty("/MsgStrip3", false);
			context.getView().getModel("localModel").refresh(true);
			// context.getView().byId("multiInput1").removeAllTokens();
			// context.getView().byId("multiInput1").setValue(null);
			// context.getView().byId("suppMultiInputId").removeAllTokens();
			// context.getView().byId("suppMultiInputId").setValue(null);
		},

		//reading quality certificates
		// _qualityCert: function () {
		// 	var oFilters = [];
		// 	myJSONModel11 = new JSONModel();
		// 	var url = appModulePath + "/ideal-registration-form-srv/RegFormDiscQaCertif?$filter=REQUEST_NO eq " + requestNo;

		// 	$.ajax({
		// 		url: url,
		// 		type: "GET",
		// 		contentType: 'application/json',
		// 		data: null,
		// 		success: function (Data, response) {
		// 			myJSONModel11.setData(Data.value);
		// 			context.getView().setModel(myJSONModel11, "qualCert");
		// 			var len = Data.value.length;
		// 			context.getView().byId("table_qualityId").setVisibleRowCount(len);
		// 		},
		// 		error: function (error) {
		// 			var oXMLMsg, oXML;
		// 			if (context.isValidJsonString(error.responseText)) {
		// 				oXML = JSON.parse(error.responseText);
		// 				oXMLMsg = oXML.error["message"];
		// 			} else {
		// 				oXMLMsg = error.responseText
		// 			}

		// 			MessageBox.error(oXMLMsg);
		// 		}
		// 	});
		// },

		_updatedRecords: function () {

			var oModel1 = new sap.ui.model.json.JSONModel();
			oModel1.setData(data);

			this.getView().setModel(oModel1, "updateRecord");
		},
		//read attachment type descriptions
		_attachTable: function () {
			var attachData = {
				"results": [

					{
						"type": "Company Profile"

					}, {
						"type": "Catalogue of Products / services"

					}, {
						"type": "Production/Quality Resources"

					}, {
						"type": "Power of Attorney"

					}, {
						"type": "Passport Copy of Authorized Signatory"

					}, {
						"type": "Bank Account letter issued by the Bank (In Bank's letterhead)"

					}
				]
			};

			var oModel7 = new sap.ui.model.json.JSONModel();
			oModel7.setData(attachData);
			this.getView().setModel(oModel7, "attachdown");

		},
		onlogSearch: function (oEvent) {
			var pFilter = [];
			var sValue = oEvent.getSource().getValue();

			var oFilter = new Filter([
				new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("UPDATED_FIELD_NAME", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("ORG_VALUE", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("CHANGE_VALUE", sap.ui.model.FilterOperator.Contains, sValue)
			]);
			sap.ui.getCore().byId("idLogTable").getBinding("items").filter(oFilter);

		},
		handleRefreshEvents: function () {
			
			that._readTimelineData();
		},
		//Close events tab
		handleSideContentHide: function () {
			this.getView().byId("DynamicSideContent").setShowSideContent(false);
			this.onMainContent(true);
		},

		//Open events tab
		handleEvents: function () {
			var dynamicSideContentState = this.getView().byId("DynamicSideContent").getShowSideContent();
			var iWindowWidth = window.innerWidth;
			if (dynamicSideContentState === true) {
				this.getView().byId("DynamicSideContent").setShowSideContent(false);
			}
			else {
				this.getView().byId("DynamicSideContent").setShowSideContent(true);
				if(iWindowWidth < 600){
					this.onMainContent(false);
				}
				// if(sDevice.system.phone === true && sDevice.orientation.portrait === true){
				// 	this.onMainContent(false);
				// }
			}
			// this.getView().byId("DynamicSideContent").setShowSideContent(true);
		},
		onMainContent:function(sValue){
			this.getView().byId("DynamicSideContent").setShowMainContent(sValue);
		},
		//commonRead functionality for APPROVE || REJECT || SENDBACK
		commonRequestAction: function (oAction) {
			// debugger;
			var updateRequestPaylod;

			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormDataApproval";
			var approvalData = context.getView().getModel("vendorDetails").getData();

			var oRequestNoCheck = approvalData.REQUEST_TYPE;

			if(oRequestNoCheck === 5){
				updateRequestPaylod =[{
				"REQUEST_NO": approvalData.REQUEST_NO,
					"ENTITY_CODE": approvalData.ENTITY_CODE,
					"REQUEST_TYPE": approvalData.REQUEST_TYPE,
					"REGISTERED_ID": approvalData.REGISTERED_ID,
					"APPROVER_LEVEL": approvalData.APPROVER_LEVEL,
					"DIST_NAME1": approvalData.DIST_NAME1,
					"REQUESTER_ID": approvalData.REQUESTER_ID,
					"SAP_DIST_CODE": approvalData.SAP_DIST_CODE,
					"IDEAL_DIST_CODE" : approvalData.IDEAL_DIST_CODE
				}]
			}
			else{
				updateRequestPaylod=[{
				"REQUEST_NO": approvalData.REQUEST_NO,
					"ENTITY_CODE": approvalData.ENTITY_CODE,
					"REQUEST_TYPE": approvalData.REQUEST_TYPE,
					"REGISTERED_ID": approvalData.REGISTERED_ID,
					"APPROVER_LEVEL": approvalData.APPROVER_LEVEL,
					"DIST_NAME1": approvalData.DIST_NAME1,
					"REQUESTER_ID": approvalData.REQUESTER_ID,
					"IDEAL_DIST_CODE" : approvalData.IDEAL_DIST_CODE
				}]
			}

			var payload = {
				"action": oAction, //APPROVE|REJECT|SENDBACK
				"inputData": updateRequestPaylod,
				"addressData": approvalData.TO_ADDRESS,
				"contactsData":approvalData.TO_CONTACTS,
				"bankData":approvalData.TO_BANKS,
				"eventsData": [{
					"REQUEST_NO": approvalData.REQUEST_NO,
					"EVENT_NO": 1,
					"EVENT_CODE": 0,
					"EVENT_TYPE": "ONB",
					"USER_ID": context.getOwnerComponent().getModel("userModel").getData().userId,
					"USER_NAME": context.getOwnerComponent().getModel("userModel").getData().userName,
					"REMARK": sap.ui.getCore().byId("id_comment").getValue(),
					"COMMENT": sap.ui.getCore().byId("id_comment").getValue(),//Commentboxcontent
					"CREATED_ON": approvalData.CREATED_ON
				}],
				"userDetails" : {
					"USER_ROLE": sUserRole,
					// that.getOwnerComponent().getModel( "userDetailsModel").getProperty("/USER_ROLE"),
					"USER_ID": that._sUserID
					// that.getOwnerComponent().getModel( "userDetailsModel").getProperty("/EMAIL")
				}
			};

			var Postdata = JSON.stringify(payload);
			// context.onBack();
			BusyIndicator.show();
			this.postAjaxs(url, "POST", Postdata, null);
		},

		onApprove: function (oEvent) {
			if (!this.filterfrag) {
				this.filterfrag = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.approveFrag", this);
			}
			this.filterfrag.open();
			
			context.filterfrag.setModel(context.getView().getModel("localModel"), "localModel");
			context.filterfrag.setModel(context.getView().getModel("detailsForm"), "detailsForm");
			sap.ui.getCore().byId("id_approve").setVisible(true);
			sap.ui.getCore().byId("id_reject").setVisible(false);
			sap.ui.getCore().byId("id_back").setVisible(false);
			sap.ui.getCore().byId("id_lable").setRequired(false);
			sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to approve ?");
			// isNewSwiftCodeExist = null;
		},
		closeDialog: function () {
			this.filterfrag.close();
			this.filterfrag.destroy();
			this.filterfrag = null;
		},

		_updateFolder: function (data) {
			

			var form = new FormData();
			form.append("username", context.tokenusername);
			form.append("password", context.tokenpass);

			var settings = {
				"url": "/OpenText/otcs/cs.exe/api/v1/auth",
				"method": "POST",
				"timeout": 0,
				"processData": false,
				"mimeType": "multipart/form-data",
				"contentType": false,
				"data": form
			};
			$.ajax(settings).done(function (response) {
				var form = new FormData();

				form.append("type", 0);

				form.append("name", data.split(':')[2].trim());

				that.folderId = myJSONModel.getData().results[0].OT_PARENT_ID;
				var settings = {
					"url": "/OpenText/otcs/cs.exe/api/v1/nodes/" + parseInt(that.folderId),
					"method": "PUT",
					"timeout": 0,
					"processData": false,
					"mimeType": "multipart/form-data",
					"contentType": false,
					"headers": {
						'otcsticket': response, //token generated to send request
					},
					"data": form
				};

				$.ajax(settings).done(function (response) {
					that.folderId = JSON.parse(response).id;

				});
			});

		},

		onSubmitApproval: function () {
			// debugger;
			this.commonRequestAction("APPROVE");
		},
		handleLiveChange: function (oEvent) {
			var comment = sap.ui.getCore().byId("id_comment");
			if (comment.getValue() === ".") {
				comment.setValue("");
			} else if (comment.getValue().length > comment.getMaxLength()) {
				comment.setValueState(sap.ui.core.ValueState.Error).setValueStateText("The text should be less than 1000 characters");
				comment.focus();
			} else {
				comment.setValueState(sap.ui.core.ValueState.None);
			}
		},

		onReject: function (oEvent) {

			if (!this.filterfrag) {
				this.filterfrag = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.approveFrag", this);
			}
			this.filterfrag.open();
			context.filterfrag.setModel(context.getView().getModel("localModel"), "localModel");
			context.filterfrag.setModel(context.getView().getModel("detailsForm"), "detailsForm");
			sap.ui.getCore().byId("id_approve").setVisible(false);
			sap.ui.getCore().byId("id_reject").setVisible(true);
			sap.ui.getCore().byId("id_back").setVisible(false);
			sap.ui.getCore().byId("id_lable").setRequired(false);
			sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to Reject ?");
		},
		//Reject Functionality
		onSubmitRejection: function () {
			var commentVal = sap.ui.getCore().byId("id_comment");
			var validComment = commentVal.getValue().match(/^[a-zA-Z0-9 \n!@#$&()`.+,/"-]*$/);
			if (commentVal.getValue() === "") {
				MessageToast.show("Please Enter Comment");
			}
			else{
				this.commonRequestAction("REJECT");
			}
		},

		onSendBack: function (oEvent) {

			if (!this.filterfrag) {
				this.filterfrag = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.approveFrag", this);
			}
			this.filterfrag.open();
			context.filterfrag.setModel(context.getView().getModel("localModel"), "localModel");
			context.filterfrag.setModel(context.getView().getModel("detailsForm"), "detailsForm");
			sap.ui.getCore().byId("id_approve").setVisible(false);
			sap.ui.getCore().byId("id_reject").setVisible(false);
			sap.ui.getCore().byId("id_back").setVisible(true);
			sap.ui.getCore().byId("id_lable").setRequired(false);
			sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to Send Back ?");
		},
		onOtherBankSwiftCode :function(oEvent){
			this.onSwiftCode(oEvent,"otherBank");
		},
		onSwiftCode:function(oEvent,sSection){
			var oSwitftCodeData;

			var oButton = oEvent.getSource(),
				oView = this.getView();
			var oSwiftCodeJson = new JSONModel();

			if(sSection === "otherBank"){
				oSwitftCodeData = oEvent.getSource().getBindingContext("othBankDetails").getObject();
			}
			else{
			 	oSwitftCodeData = this.getView().getModel("priBankDetails").getProperty("/results/0");
			}
            oSwiftCodeJson.setData(oSwitftCodeData);
            oView.setModel(oSwiftCodeJson, "oSwiftCodeData")

			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "com.ibs.ibsappidealregistrationapproval.view.fragments.swiftCodeFrag",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					oPopover.bindElement("/oSwiftCodeData");
					return oPopover;
				});
			}
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});
		},
		//Buyer Send back functionality
		onSubmitBack: function () {
			var commentVal = sap.ui.getCore().byId("id_comment");
			if (commentVal.getValue() === "") {
				MessageToast.show("Please Enter Comment");
			}
			else{
				this.commonRequestAction("SENDBACK");
			}
		},
		handleMyBuddyDetails : function(){
			// debugger;
			var getUserData = context.getOwnerComponent().getModel("userModel").getData();
			var approvalData = context.getView().getModel("vendorDetails").getData();
			// added on 13-04-2023 by Inder Chouhan
			var IS_UAE_COMPANY = null;
			var ISSUE_ELEC_TAX_INV = null;
			var SOLE_DIST_MFG_SER = null;
			// added on 13-04-2023 by Inder Chouhan
			if (approvalData.TO_ATTACH_FIELDS.length === 0) {
				IS_UAE_COMPANY = "";
				ISSUE_ELEC_TAX_INV = "";
				SOLE_DIST_MFG_SER = "";
			} else {
				IS_UAE_COMPANY = approvalData.TO_ATTACH_FIELDS[0].IS_UAE_COMPANY;
				ISSUE_ELEC_TAX_INV = approvalData.TO_ATTACH_FIELDS[0].ISSUE_ELEC_TAX_INV;
				SOLE_DIST_MFG_SER = approvalData.TO_ATTACH_FIELDS[0].SOLE_DIST_MFG_SER;
			}

			var navObj = {
				"USER_ID": getUserData.userId,
				"UNAME": getUserData.userName,
				"ENTITY_CODE": approvalData.ENTITY_CODE,
				"REG_NO": approvalData.REQUEST_NO,
				"CREATION_TYPE": approvalData.CREATION_TYPE,
				"VNAME": approvalData.DIST_NAME1,
				"SAP_DIST_CODE": approvalData.SAP_DIST_CODE,
				"VEMAIL": approvalData.REGISTERED_ID,
				"REQUEST_TYPE": approvalData.REQUEST_TYPE,
				"STATUS": approvalData.STATUS,
				"STATUS_DESC": approvalData.TO_STATUS.DESCRIPTION || "",
				"BP_TYPE_CODE": context.OG_BP_TYPE_CODE || myJSONModel.getData().BP_TYPE_CODE,
				"BP_TYPE_DESC": approvalData.BP_TYPE_DESC,
				// "SUPPLIERTYPE_CODE": approvalData.SUPPL_TYPE,
				// "SUPPLIER_TYPE_DESC": approvalData.SUPPL_TYPE_DESC,
				"IDEAL_DIST_CODE": approvalData.IDEAL_DIST_CODE,
				"CREATED_BY": approvalData.REQUESTER_ID,
				"IS_UAE_COMPANY": IS_UAE_COMPANY, // added on 13-04-2023 by Inder Chouhan
				"ISSUE_ELEC_TAX_INV": ISSUE_ELEC_TAX_INV, // added on 13-04-2023 by Inder Chouhan
				"SOLE_DIST_MFG_SER": SOLE_DIST_MFG_SER, // added on 13-04-2023 by Inder Chouhan
				"APPROVER_LEVEL": approvalData.APPROVER_LEVEL,
				// "APPROVER_ROLE": approvalData.APPROVER_ROLE,
				// "NEXT_APPROVER": approvalData.NEXT_APPROVER,
				"LAST_SAVED_STEP": approvalData.LAST_SAVED_STEP,
				"SUBMISSION_DATE": approvalData.SUBMISSION_DATE,
				"VAT_CHECK": approvalData.VAT_CHECK,
				"REGISTERED_ID" : approvalData.REGISTERED_ID
				
			};

			var myBuddyModel = new sap.ui.model.json.JSONModel(navObj);
			that.getOwnerComponent().setModel(myBuddyModel, "myBuddyDetail");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("MyBuddy", {
				ENTITY_CODE: approvalData.ENTITY_CODE
			});
		}
	});

});