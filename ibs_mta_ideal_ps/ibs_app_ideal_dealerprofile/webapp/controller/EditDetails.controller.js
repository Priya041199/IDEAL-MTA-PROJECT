sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	// "com.ibspl.iven.ivenvendorprofile/model/down",
	"sap/m/Token",
	"com/ibs/ibsappidealdealerprofile/model/formatter",
	"com/ibs/ibsappidealdealerprofile/model/validations",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageItem",
	"sap/m/MessagePopover",
	"sap/ui/dom/isBehindOtherElement",
	'sap/ui/core/Core'
], function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, MessageBox, History, Token,
	formatter,validations,BusyIndicator, MessageItem, MessagePopover,isBehindOtherElement,Core) {
	"use strict";
	var data;
	var context = null;
	var oModel;
	var oView = null;
	var RequestNO;
	var currentDate = null;
	var postalCodeLength = null;
	var registerPincode = null;
	var maxCount = null;
	var updateId = [];
	var supplierCategoryKeys = "";
	var supplierCategoryText = "";
	var oEditViewModel;
	var loginData;
	var section = null;
	var logData = [];
	var vModel = "";
	var ndaUploadArray = [];
	var ndaDeleteArray = [];
	var mandatoryModel = "";
	var ndaAttachModel;
	var draftInd = "";
	var appModulePath;
	var detailsJson;
	var myJSONModel;
	var myJSONModel1;
	var myJSONModel2;
	var myJSONModel3;
	var myJSONModel4;
	var myJSONModel5;
	var myJSONModel6;
	var myJSONModel11, myJSONModel12, myJSONModel13, tradelicModel, suppNameModel, localModel, myJSONModelToken;
	return BaseController.extend("com.ibs.ibsappidealdealerprofile.controller.EditDetails", {
		formatter: formatter,

		onInit: function () {
			context = this;
			this._MessageManager = Core.getMessageManager();
			this.oView.setModel(this._MessageManager.getMessageModel(),"message");
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);
			oView = context.getView();
			oModel = context.getOwnerComponent().getModel();
			context.oDataModel = context.getOwnerComponent().getModel("onPremiseModel");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("EditDetails").attachMatched(this._onRouteMatched, this);

			currentDate = new Date();
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});

			//	oView.byId("cID").setText(dateFormat.format(currentDate));

			var minDateModel = new JSONModel({
				minDate: new Date()
			});
			oView.setModel(minDateModel, "minDateModel");
		},

		_onRouteMatched: function (oEvent) {
			var oEditModel =  context.getView().getModel("editDetail");

			if(oEditModel === undefined){
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("RouteMasterPage");
			}
			else{
				oEditViewModel = context.getView().getModel("editDetail").getData();
				this.readCountrySet();

				this.readTelecodeSet();
				this.setLocalConfigModel();
				this._setBlankJsonModel(this._getBlankObject());
				RequestNO = oEvent.getParameter("arguments").RequestNO;
				oEditViewModel = context.getView().getModel("editDetail");
				loginData = oEditViewModel.getData();

				if (loginData.BP_TYPE_CODE !== "B") {
					loginData.LOGINDATA_BP_TYPE_CODE = loginData.BP_TYPE_CODE;
				}
				jQuery.sap.delayedCall(300, this, function () {
					this.readDraft(RequestNO, loginData.ENTITY_CODE,loginData.CREATION_TYPE);
				});
				
				this.readEntitySets("GetAccountGrpSet", "supplierTypeJson");
				this.readEntitySets("GetMaterialGrpSet", "supplierCategoryJson");

				oView.getModel("blankJson").setProperty("/headerData/DIST_NAME1", loginData.VNAME);

				//	var userId = oEditViewModel.getData().USER_ID;     

				//set Trade Licence number  Required
				// if (loginData.BP_TYPE_CODE === "B" && loginData.SUPPLIERTYPE_CODE !== "ZGOV" && loginData.SUPPLIERTYPE_CODE !== "ZUNI") {
				// 	oView.byId("S1G4T9F1").setRequired(true);
				// 	oView.byId("S1G4T9F1_id2").setRequired(true);
				// } else {
				// 	oView.byId("S1G4T9F1").setRequired(false);
				// 	oView.byId("S1G4T9F1_id2").setRequired(false);
				// }
				oView.getModel("localConfigModel").setProperty("/REQUEST_NO", RequestNO);
				this._getUserId();

				//added by pranay 17/10/2022
				var localObject = {
					//address
					"regex_HQ": null,
					"pcode_HQformat": null,
					"regex_OTH:": null,
					"pcode_OTHformat": null,
					//contact
					"regex_MDCont": null,
					"pcode_MDformat": null,
					"regexOTHCont": null,
					"pcode_OTHCont": null
				};

				var localJson = new JSONModel();
				localJson.setData(localObject);
				oView.setModel(localJson, "localModel");
			}
		},

		_getUserId: function () {
			var that = this;
				var getUserData = context.getOwnerComponent().getModel("userModel").getData();
	
				that._sUserID = (getUserData.userId).toLowerCase();
				that._sUserName = getUserData.userName;

				// if (that._sEntity !== "" && that._sEntity !== null && that._sEntity !== undefined) {
				// 	that._sEntity = that._sEntity.split('(')[1].split(')')[0];
				//	var sEntityDesc = (results.company).split('(')[0];
				// this._getodata();

				// this.readCountrySet();
				// this.readCountryCode();

				// this._readTimelineData();
				// this._readTokenCredentials();

				//load a section 1 by default
				context.getView().byId("ObjectPageLayout").setSelectedSection(context.getView().byId("firstSection"));
				// } else {
				// 	MessageBox.error("Company code missing in login details");
				// }

			// }.bind(this));
		},
		setLocalConfigModel: function () {
			var Obj = {
				"REQUEST_NO": null,
				"OT_PARENT_ID": null,
				"OT_FOLDER1_ID": null,
				"OT_FOLDER2_ID": null
			};
			var localModel = new JSONModel(Obj);
			oView.setModel(localModel, "localConfigModel");
		},
		_getBlankObject: function () {
			var jsonObject = {
				"headerData": {},
				"address": [],
				"otherAddress": [],
				"MDContact": [],
				"contact": [],
				"businessInfo": [],
				"bankDetails": [],
				"otherBankDetails": [],
				"finInfo": [],
				"ownerInfo": [{
					"NAME": null,
					"NATIONALITY": null,
					"CONTACT_TELECODE": null,
					"CONTACT_NO": null,
					"PASSPORT_NO": null,
					"ACTIVITY_TYPE": null,
					"OWNERSHIP_PERCENT": null
				}]

			};
			return JSON.parse(JSON.stringify(jsonObject));
		},

		_setBlankJsonModel: function (jsonObject) {

			var blanckJsonModel = new JSONModel(jsonObject);
			oView.setModel(blanckJsonModel, "blankJson");

			//set head office address model
			var headOffAddress = {
				"ADDRESS_TYPE": "HQ",
				"ADDRESS_DESC": "Head Office",
				"HOUSE_NUM1": null,
				"STREET1": null,
				"STREET2": null,
				"STREET3": null,
				"STREET4": null,
				"CITY": null,
				"COUNTRY": null,
				"COUNTRY_DESC": null,
				"STATE": null,
				"REGION_DESC": null,
				"POSTAL_CODE": null,
				"CONTACT_TELECODE": null,
				"CONTACT_NO": null,
				"FAX_NO": null,
				"EMAIL": null,
				"DISTRICT": null

			};

			oView.getModel("blankJson").setProperty("/address", headOffAddress);

			//other office address model
			// var otherOfficeAddress = [{
			// 	"ADDRESS_TYPE": "REG",
			// 	"ADDRESS_DESC": "Register Office",
			// 	"HOUSE_NUM1": null,
			// 	"STREET1": null,
			// 	"STREET2": null,
			// 	"STREET3": null,
			// 	"STREET4": null,
			// 	"CITY": null,
			// 	"COUNTRY": null,
			// 	"COUNTRY_DESC": null,
			// 	"STATE": null,
			// 	"REGION_DESC": null,
			// 	"POSTAL_CODE": null,
			// 	"CONTACT_TELECODE": null,
			// 	"CONTACT_NO": null,
			// 	"FAX_NO": null,
			// 	"EMAIL": null,
			// 	"DISTRICT": null
			// }];
			// oView.getModel("blankJson").setProperty("/otherAddress", otherOfficeAddress);

			var mdContect = {
				"CONTACT_TYPE": "HOD",
				"NAME1": null,
				"NAME2": null,
				"DESIGNATION": null,
				"NATIONALITY": null,
				"COUNTRY_DESC": null, //17-10-2022
				"STATE": null, //17-10-2022
				"REGION_DESC": null, //17-10-2022
				"CITY": null,
				"PASSPORT_NO": null,
				"EMAIL": null,
				"CONTACT_TELECODE": null,
				"CONTACT_NO": null,
				"MOBILE_TELECODE": null,
				"MOBILE_NO": null,
				"HOUSE_NUM1": null,
				"STREET1": null,
				"STREET2": null,
				"POSTAL_CODE": null, //17-10-2022
				"BP_ID": null
			};
			oView.getModel("blankJson").setProperty("/MDContact", mdContect);

		},

		setFinancialModel: function (sYear) {
			var financialInfo;
			var cYear = new Date().getFullYear();
			var yearDifference = cYear - parseInt(sYear, 10);

			var cYear1 = cYear - 1;
			var cYear2 = cYear - 2;
			var cYear3 = cYear - 3;

			if (yearDifference === 1) {
				financialInfo = [{
					"FIN_YEAR": cYear1,
					"TOTAL_REVENUE": null,
					"NET_PROFIT_LOSS": null,
					"TOTAL_ASSETS": null,
					"TOTAL_EQUITY": null,
					"CURRENCY": null
				}];
			} else if (yearDifference === 2) {
				financialInfo = [{
					"FIN_YEAR": cYear1,
					"TOTAL_REVENUE": null,
					"NET_PROFIT_LOSS": null,
					"TOTAL_ASSETS": null,
					"TOTAL_EQUITY": null,
					"CURRENCY": null
				}, {
					"FIN_YEAR": cYear2,
					"TOTAL_REVENUE": null,
					"NET_PROFIT_LOSS": null,
					"TOTAL_ASSETS": null,
					"TOTAL_EQUITY": null,
					"CURRENCY": null
				}];
			} else {
				financialInfo = [{
					"FIN_YEAR": cYear1,
					"TOTAL_REVENUE": null,
					"NET_PROFIT_LOSS": null,
					"TOTAL_ASSETS": null,
					"TOTAL_EQUITY": null,
					"CURRENCY": null
				}, {
					"FIN_YEAR": cYear2,
					"TOTAL_REVENUE": null,
					"NET_PROFIT_LOSS": null,
					"TOTAL_ASSETS": null,
					"TOTAL_EQUITY": null,
					"CURRENCY": null
				}, {
					"FIN_YEAR": cYear3,
					"TOTAL_REVENUE": null,
					"NET_PROFIT_LOSS": null,
					"TOTAL_ASSETS": null,
					"TOTAL_EQUITY": null,
					"CURRENCY": null
				}];
			}
			oView.getModel("blankJson").setProperty("/finInfo", financialInfo);
			//	oView.byId("table_finId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/finInfo").length);

			//4//22
			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").setProperty("/finInfo", financialInfo);
			}

		},
		
		readDraft: function (ReqNo, ReqEntity, creationType) {
			var that = this;
			var userId = that.getOwnerComponent().getModel( "userDetailsModel").getProperty("/EMAIL");
			var userRole = that.getOwnerComponent().getModel( "userDetailsModel").getProperty("/USER_ROLE");

			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/GetDraftData(requestNo=" + ReqNo + ",entityCode='" + ReqEntity + "',creationType=" + creationType + ",userId='" + that._sUserID + "',userRole='CEO')";
			// (userRole='" + userRole + "',userId='" + userId + "',requestNo=" + ReqNo + ",entityCode='" + ReqEntity + "',creationType=" + creationType + ")";


			// var oDraftData = {
			// 	userRole: userRole,
			// 	userId:userId,
			// 	requestNo:ReqNo,
			// 	entityCode:ReqEntity,
			// 	creationType:creationType ,
			// 	draftData:true,
			// 	visibility:true,
			// 	mandatory:true,
			// 	updated:true,
			// 	openText:true,
			// 	clientInfo:true,
			// 	totalCount:true,
			// 	settings:true,
			// 	labels:true
			// }

			// var oStringifyDraftData = JSON.stringify(oDraftData);
			// var path = url + oStringifyDraftData +"')";


			// if (loginData.REQUEST_TYPE === 5) {
			// 	path += "&TYPE=" + loginData.CREATION_TYPE;
			// } else if (loginData.REQUEST_TYPE === 7) { // added on 13-04-2023 by Inder Chouhan
			// 	path += "&TYPE=" + 1;
			// }

			$.ajax({
				url: url,
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (Data, response) {
					BusyIndicator.hide();
					
					var loginJsonData = new JSONModel();
					loginJsonData.setData(Data.value[0].CLIENT_INFO);
					context.getView().setModel(loginJsonData, "loginJsonData");

					context.clientCountry = Data.value[0].CLIENT_INFO.CLIENT_COUNTRY;

					var olabelJson = new JSONModel();
					olabelJson.setData(Data.value[0].LABELS[0]);
					oView.setModel(olabelJson, "labelJson");

					var openTextJson = new JSONModel();
					openTextJson.setData(Data.value[0].OPENTEXT);
					oView.setModel(openTextJson, "openTextJson");

					
					oView.getModel("blankJson").setProperty("/headerData/DIST_NAME1", loginData.VNAME); 		//Changed by Vishal on 01-03-2024
					context.draftDataBinding(Data.value[0], "");

					BusyIndicator.hide();
				},
				error: function (error) {
					BusyIndicator.hide();
					oView.setBusy(false);
					// var oXMLMsg = error.responseText;
					// var oXMLMsg = oXML.error["message"];
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

		draftDataBinding: function (data, sample) {
			
			var data2 = JSON.parse(JSON.stringify(data));
			this.Originaldata = JSON.parse(JSON.stringify(data));
			var regAddress = [],
				contacts = [];
			var OEM = [];
			var NonOEM = [];
			var otherBankDetails = [];
			if (this.Originaldata.DRAFT.MAIN[0].REQUEST_TYPE === 7) {
				this.Originaldata.DRAFT.ADDRESS.push(Object.assign([], this.getView().getModel("blankJson").getData().address));
				this.Originaldata.DRAFT.ADDRESS.push(Object.assign([], this.getView().getModel("blankJson").getData().otherAddress[0]));
				this.Originaldata.DRAFT.CONTACTS.push(Object.assign([], this.getView().getModel("blankJson").getData().MDContact));
			}

			context.clientCountry = data.CLIENT_INFO.CLIENT_COUNTRY;
			if (data.DRAFT.length !== 0) {

				oView.byId("checkBoxREGID").setVisible(false);
				if (data.DRAFT.ADDRESS.length !== 0) {
					// Changed Position  by Inder Chouhan 30-04-2023
					// oView.byId("checkBoxREGID").setVisible(false);
					//data.DRAFT.MAIN[0].SAP_VENDOR_NO = loginData.SAP_VENDOR_CODE;
					// data.DRAFT.MAIN[0].REGISTERED_ID = loginData.VEMAIL;

					// if (data.DRAFT.MAIN[0].SECONDARY_EMAILS_ID !== null) {

					// 	var secondaryEmails = data.DRAFT.MAIN[0].SECONDARY_EMAILS_ID.split(";");
					// 	var oMultiInput1 = oView.byId("multiInput1");
					// 	var tokensArr = [];
					// 	for (var a = 0; a < secondaryEmails.length; a++) {
					// 		if (secondaryEmails[a] !== "") {
					// 			var token = new Token({
					// 				text: secondaryEmails[a],
					// 				key: secondaryEmails[a]
					// 			});
					// 			tokensArr.push(token);
					// 		}
					// 	}
					// 	oMultiInput1.setTokens(tokensArr);
					// }
					// if (data.DRAFT.MAIN[0].TRADE_LIC_NO_DATE !== null) {
					// 	data.DRAFT.MAIN[0].TRADE_LIC_NO_DATE = new Date(data.DRAFT.MAIN[0].TRADE_LIC_NO_DATE);
					// }
					// 
					oView.getModel("blankJson").setProperty("/headerData", data.DRAFT.MAIN[0]);

					// if (data.DRAFT.MAIN[0].SUPPL_CATEGORY !== null) {
					// 	var supplierCatKeys = data.DRAFT.MAIN[0].SUPPL_CATEGORY.split(",");
					// 	oView.byId("S1G5T1F1").setSelectedKeys(supplierCatKeys);
					// 	oView.getModel("blankJson").setProperty("/headerData/SUPPL_CATEGORY", supplierCatKeys);
					// }
					if (data.DRAFT.ADDRESS[0].COUNTRY === context.clientCountry) {
						loginData.BP_TYPE_CODE = ""
						// context.validateLocalCountry();

					} else {
						if (data.DRAFT.ADDRESS[0].COUNTRY != 'AE'){
							loginData.BP_TYPE_CODE = ""
							// context.validateLocalCountry()
						}
						else{
						loginData.BP_TYPE_CODE = "B";
						// context.validateLocalCountry();
						}
					}
					for (var i = 0; i < data.DRAFT.ADDRESS.length; i++) {

						if (data.DRAFT.ADDRESS[i].ADDRESS_TYPE === "HQ") {

							oView.getModel("blankJson").setProperty("/address", data.DRAFT.ADDRESS[0]);

							context.readRegionSet(data.DRAFT.ADDRESS[0].COUNTRY, "H");
							context.readPostalCodeLength(data.DRAFT.ADDRESS[0].COUNTRY, "H");
							context.readPostalCodeFormats(data.DRAFT.ADDRESS[0].COUNTRY, "H");
						} else {
							regAddress.push(data.DRAFT.ADDRESS[i]);
							context.readRegionSet(data.DRAFT.ADDRESS[i].COUNTRY, "R");
							context.readPostalCodeLength(data.DRAFT.ADDRESS[i].COUNTRY, "R");
						}

					}

					oView.getModel("blankJson").setProperty("/otherAddress", regAddress);
				}
				oView.byId("trAddId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherAddress").length);
				// added on 14-04-2023 removed from above if condition related to data.DRAFT.ADDRESS.length
				if (data.DRAFT.MAIN.length !== 0) {
					data.DRAFT.MAIN[0].SAP_DIST_CODE = loginData.SAP_DIST_CODE;
					data.DRAFT.MAIN[0].REGISTERED_ID = loginData.VEMAIL;
					// if (data.DRAFT.MAIN[0].TRADE_LIC_NO_DATE !== null) {
					// 	data.DRAFT.MAIN[0].TRADE_LIC_NO_DATE = new Date(data.DRAFT.MAIN[0].TRADE_LIC_NO_DATE);
					// }
					oView.getModel("blankJson").setProperty("/headerData", data.DRAFT.MAIN[0]);

					// if (data.DRAFT.MAIN[0].SUPPL_CATEGORY !== null) {
					// 	var supplierCatKeys = data.DRAFT.MAIN[0].SUPPL_CATEGORY.split(",");
					// 	oView.byId("S1G5T1F1").setSelectedKeys(supplierCatKeys);
					// 	oView.getModel("blankJson").setProperty("/headerData/SUPPL_CATEGORY", supplierCatKeys);
					// }
				}
				if (data.DRAFT.CONTACTS.length != 0) {
					if (data.DRAFT.CONTACTS[0].CONTACT_TYPE === "HOD") {
						oView.getModel("blankJson").setProperty("/MDContact", data.DRAFT.CONTACTS[0]);

						context.readRegionSet(data.DRAFT.CONTACTS[0].NATIONALITY, "CH");
						context.readPostalCodeFormats(data.DRAFT.CONTACTS[0].NATIONALITY, "CH");
					}

					for (var k = 0; k < data.DRAFT.CONTACTS.length; k++) {
						if (data.DRAFT.CONTACTS[k].CONTACT_TYPE !== "HOD") {
							contacts.push(data.DRAFT.CONTACTS[k]);
						}
					}
					oView.getModel("blankJson").setProperty("/contact", contacts);
					oView.byId("table_contactId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/contact").length);
				}

				//new swift code change added by pranay 20-10-2022
				// if (data.DRAFT.PAYMENT.length !== 0) {

				// 	for (var j = 0; j < data.DRAFT.PAYMENT.length; j++) {
				// 		if (data.DRAFT.PAYMENT[j].PAYMENT_TYPE === "PRI") {
				// 			//new swift code 20-10-2022
				// 			if (data.DRAFT.PAYMENT[j].SWIFT_CODE === "OTHER") {
				// 				oView.byId("NSCId").setVisible(true);
				// 			}
				// 			oView.getModel("blankJson").setProperty("/bankDetails", data.DRAFT.PAYMENT[j]);
				// 			context.readSwiftCode(data.DRAFT.PAYMENT[j].BANK_COUNTRY, "P");
				// 			context.getBankDetails(data.DRAFT.PAYMENT[j].BANK_COUNTRY, data.DRAFT.PAYMENT[j].SWIFT_CODE, "PRI", 0, data.DRAFT.PAYMENT[j].BRANCH_NAME, data.DRAFT.PAYMENT[j].NAME);
				// 		} else {
				// 			otherBankDetails.push(data.DRAFT.PAYMENT[j]);
				// 			context.readSwiftCode(data.DRAFT.PAYMENT[j].BANK_COUNTRY, "S");
				// 			context.getBankDetails(data.DRAFT.PAYMENT[j].BANK_COUNTRY, data.DRAFT.PAYMENT[j].SWIFT_CODE, "OTH", j - 1, data.DRAFT.PAYMENT[j]
				// 				.BRANCH_NAME, data.DRAFT.PAYMENT[j].NAME);

				// 		}
				// 	}

				// 	oView.getModel("blankJson").setProperty("/otherBankDetails", otherBankDetails);
				// 	oView.byId("bankTableId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherBankDetails").length);
				// 	context.readEntitySets("GetCurrencyKeySet", "currencyJson");
				// }

				// if (oView.getModel("blankJson").getProperty("/otherBankDetails").length === 0) {
				// 	oView.byId("sfBankId").setVisible(false);
				// 	oView.byId("bankTableId").setVisible(false);
				// }

				// if (data.DRAFT.FINANCE.length !== 0) {
				// 	oView.getModel("blankJson").setProperty("/finInfo", data.DRAFT.FINANCE);
				// }

				// if (data.DRAFT.OWNERS.length !== 0) {
				// 	oView.getModel("blankJson").setProperty("/ownerInfo", data.DRAFT.OWNERS);
				// }

				context._readAttachmentDraftData();

			}
			if (loginData.REQUEST_TYPE === 5) {
				context._originalJson(data2); //komal
			}

			if (sample !== "sampleData") {
				if(data.VISIBLE.length > 0){
				if (data.VISIBLE[0].S1G4T2F1 !== "X" && data.VISIBLE[0].S1G4T3F1 !== "X" && data.VISIBLE[0].S1G4T4F1 !== "X" &&
					data.VISIBLE[0].S1G4T5F1 !== "X" && data.VISIBLE[0].S1G4T6F1 !== "X" && data.VISIBLE[0].S1G4T7F1 !== "X") {
					//	oView.byId("simpleForm4").setVisible(false);
					// oView.byId("table_employeeId").setVisible(false);
				}

				// if (data.VISIBLE[0].S1G2T1F1 === "X") {
				// 	oView.byId("simpleForm3").setTitle("Other Contacts");
				// } else {
				// 	oView.byId("simpleForm3").setTitle("Contacts");
				// }
				var visibleJson = new JSONModel();
				visibleJson.setData(data.VISIBLE[0]);
				oView.setModel(visibleJson, "visibleJson");
			}
			if(data.MANDATORY.length > 0){
				var mandatoryJson = new JSONModel();
				mandatoryJson.setData(data.MANDATORY[0]);
				oView.setModel(mandatoryJson, "mandatoryJson");
			}
			}
			//set VAT registration date and number mandatory

			context.validateSectionOneSimpleForm();

		},

		_originalJson: function (data) {
			var regAddress = [],
				contacts = [];
			var OEM = [];
			var NonOEM = [];
			var otherBankDetails = [];

			if (data.UPDATED.length) {
				var updatedValues = Object.values(data.UPDATED[0]);
				for (var i = 0; i < updatedValues.length; i++) {
					if (updatedValues[i] === "X") {
						updateId.push(Object.keys(data.UPDATED[0])[i]);
					}
				}
			}
			var object = this._getBlankObject();
			var originalJson = new JSONModel();
			originalJson.setData(object);
			oView.setModel(originalJson, "originalJson");

			if (data.DRAFT.CONTACTS.length !== 0) {
				data.DRAFT.MAIN[0].SAP_DIST_CODE = loginData.SAP_DIST_CODE;
				data.DRAFT.MAIN[0].DIST_NAME1 = loginData.VNAME;
				data.DRAFT.MAIN[0].REGISTERED_ID = loginData.VEMAIL;

				// if (data.DRAFT.MAIN[0].VAT_REG_DATE !== null) {
				// 	data.DRAFT.MAIN[0].VAT_REG_DATE = new Date(data.DRAFT.MAIN[0].VAT_REG_DATE);
				// }

				oView.getModel("originalJson").setProperty("/headerData", data.DRAFT.MAIN[0]);

				// if (data.DRAFT.MAIN[0].SUPPL_CATEGORY !== null) {
				// 	var supplierCatKeys = data.DRAFT.MAIN[0].SUPPL_CATEGORY.split(",");
				// 	oView.byId("S1G5T1F1").setSelectedKeys(supplierCatKeys);
				// 	oView.getModel("originalJson").setProperty("/headerData/SUPPL_CATEGORY", supplierCatKeys);
				// }

				for (var i = 0; i < data.DRAFT.ADDRESS.length; i++) {

					if (data.DRAFT.ADDRESS[i].ADDRESS_TYPE === "HQ") {

						oView.getModel("originalJson").setProperty("/address", data.DRAFT.ADDRESS[0]);

						context.readRegionSet(data.DRAFT.ADDRESS[0].COUNTRY, "H");
						context.readPostalCodeLength(data.DRAFT.ADDRESS[0].COUNTRY, "H");
					} else {
						regAddress.push(data.DRAFT.ADDRESS[i]);
						context.readRegionSet(data.DRAFT.ADDRESS[i].COUNTRY, "R");
						context.readPostalCodeLength(data.DRAFT.ADDRESS[i].COUNTRY, "R");

					}

				}

				// if (regAddress.length === 0) {
				// 	regAddress.push({
				// 		"ADDRESS_TYPE": "REG",
				// 		"ADDRESS_DESC": "Register Office",
				// 		"HOUSE_NUM1": null,
				// 		"STREET1": null,
				// 		"STREET2": null,
				// 		"STREET3": null,
				// 		"STREET4": null,
				// 		"CITY": null,
				// 		"COUNTRY": null,
				// 		"COUNTRY_DESC": null,
				// 		"STATE": null,
				// 		"REGION_DESC": null,
				// 		"POSTAL_CODE": null,
				// 		"CONTACT_TELECODE": null,
				// 		"CONTACT_NO": null,
				// 		"FAX_NO": null,
				// 		"EMAIL": null,
				// 		"DISTRICT": null
				// 	})
				// }

				oView.getModel("originalJson").setProperty("/otherAddress", regAddress);
				oView.byId("trAddId").setVisibleRowCount(oView.getModel("originalJson").getProperty("/otherAddress").length);

			}

			if (data.DRAFT.CONTACTS.length != 0) {
				if (data.DRAFT.CONTACTS[0].CONTACT_TYPE === "HOD") {
					oView.getModel("originalJson").setProperty("/MDContact", data.DRAFT.CONTACTS[0]);
				}

				for (var k = 0; k < data.DRAFT.CONTACTS.length; k++) {
					if (data.DRAFT.CONTACTS[k].CONTACT_TYPE !== "HOD") {
						contacts.push(data.DRAFT.CONTACTS[k]);
					}
				}
				oView.getModel("originalJson").setProperty("/contact", contacts);

			}

			//3/22 done

			oView.getModel("originalJson").refresh(true);
		},
		checkSimpleFormVisibility: function (simpleFormId) {
			var flag = false;
			var sId = null;
			var elements = oView.byId(simpleFormId)._aElements;
			for (var i = 0; i < elements.length; i++) {
				sId = elements[i].sId;
				if (sId.indexOf("title") === -1) {
					if (oView.byId(sId).getVisible()) {
						flag = true;
					}
				}
			}
			oView.byId(simpleFormId).setVisible(flag);
			//	return flag;
		},

		validateSectionOneSimpleForm: function () {
			// this.checkSimpleFormVisibility();
			this.checkSimpleFormVisibility("simpleForm40");

		},

		readEntitySets: function (sEntityName, sAlisName) {
			// debugger;
			context.oDataModel.read("/" + sEntityName, {
				success: function (oData, responce) {
					var s4HanaJson = new JSONModel();

					s4HanaJson.setSizeLimit(oData.results.length);
					s4HanaJson.setData(oData.results);
					oView.setModel(s4HanaJson, sAlisName);
				},
				error: function (error) {
					BusyIndicator.hide();
					oView.setBusy(false);
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

		readPostalCodeFormats: function (sCountryCode, sIndex) {
			
			$.ajax({
				url: appModulePath+"/odata/v4/ideal-registration-form-srv/MasterPostalcode?$filter=LAND1 eq '" + sCountryCode +"'",
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					if (oData.value.length > 0) {
						var regex = new RegExp(oData.value[0].REGEX);
						if (sIndex === "H") {
							oView.getModel("localModel").setProperty("/regex_HQ", regex);
							oView.getModel("localModel").setProperty("/pcode_HQformat", oData.value[0].REGEX_EXP);
						} else if (sIndex === "R") {
							oView.getModel("localModel").setProperty("/regex_OTH", regex);
							oView.getModel("localModel").setProperty("/pcode_OTHformat", oData.value[0].REGEX_EXP);
						} else if (sIndex === "CH") {
							oView.getModel("localModel").setProperty("/regex_MDCont", regex);
							oView.getModel("localModel").setProperty("/pcode_MDformat", oData.value[0].REGEX_EXP);
						} else if (sIndex === "CR") {
							oView.getModel("localModel").setProperty("/regexOTHCont", regex);
							oView.getModel("localModel").setProperty("/pcode_OTHCont", oData.value[0].REGEX_EXP);
						}
					}
				},
				error: function (error) {
					// context.errorLogCreation(error.responseText, error.statusCode, RequestNO,
					// 	context._sUserID);
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg)

				}
			});
		},

		readPostalCodeLength: function (sCountyCode, sIndicator) {
			//	context.registerPincode = null;
			
			// var cFilter = new sap.ui.model.Filter("LAND1", sap.ui.model.FilterOperator.EQ, sCountyCode);
			// context.oDataModel.read("/GetCountryDetailSet", {
			// 	filters: [cFilter],
			// 	success: function (oData, responce) {
			// 		if (sIndicator === "H") {
			// 			if (sCountyCode === "AE") {
			// 				postalCodeLength = 6;
			// 				oView.byId("S1G1T1F7").setMaxLength(postalCodeLength);
			// 			} else {
			// 				postalCodeLength = parseInt(oData.results[0].Lnplz);
			// 				oView.byId("S1G1T1F7").setMaxLength(postalCodeLength);
			// 			}
			// 		} else {
			// 			//regPinId
			// 			if (sCountyCode === "AE") {
			// 				registerPincode = 6;
			// 			} else {
			// 				registerPincode = parseInt(oData.results[0].Lnplz);
			// 			}

			// 		}
			// 	},
			// 	error: function (error) {
			// 		var oXML = JSON.parse(error.responseText);
			// 		var oXMLMsg = oXML.error["message"];
			// 		MessageBox.error(oXMLMsg);

			// 	}
			// });
		},

		contactMDPostalValidation: function (oEvent) {
			var reg1 = null;
			var MDContactDetails = oView.getModel("blankJson").getProperty("/MDContact");
			//check whether country is select or not 03/03/2022
			if (MDContactDetails.NATIONALITY === null || MDContactDetails.NATIONALITY === "") {
				MessageBox.information("Please Select Country");
				oEvent.getSource().setValue("");
				return;
			}

			var oSource = oEvent.getSource();
			var reg = oView.getModel("localModel").getProperty("/regex_MDCont").test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code eg: " + oView.getModel("localModel")
					.getProperty("/pcode_MDformat"));
				return;
			}

			var org_value = this.Originaldata.DRAFT.CONTACTS[0].POSTAL_CODE;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var MDPostlCode_Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(MDPostlCode_Id, label, oSource.getValue(), "", org_value, "");

		},

		readTelecodeSet: function () {
			//	context.cloudService

			$.ajax({
				url: appModulePath+"/odata/v4/ideal-registration-form-srv/MasterTelecode?$expand=TO_COUNTRY",
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					var countryCode = new JSONModel();
					countryCode.setSizeLimit(oData.value.length);
					countryCode.setData(oData.value);
					oView.setModel(countryCode, "countryCode");
				},
				error: function (error) {
					// var oXML = JSON.parse(error.responseText);
					// var oXMLMsg = oXML.error["message"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, RequestNO,
					// 	context._sUserID);
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},

		readCountrySet: function () {
			var that = this;

			$.ajax({
				url: appModulePath+"/odata/v4/ideal-registration-form-srv/MasterCountry",
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					var countryJson = new JSONModel();
					countryJson.setData(oData.value);
					countryJson.setSizeLimit(oData.value.length);
					that.getView().setModel(countryJson, "countryJson");

					var parseData = JSON.parse(JSON.stringify(oData.value));
					var bankCountryJson = new JSONModel();
					bankCountryJson.setData(oData.value);
					bankCountryJson.setSizeLimit(oData.value.length);
					that.getView().setModel(bankCountryJson, "bankCountryJson");
				},
				error: function (error) {
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

		readCountryCode: function () {
			$.ajax({
				url: appModulePath+"/odata/v4/ideal-registration-form-srv/MasterTelecode",
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					var countryCode = new JSONModel();
					countryCode.setSizeLimit(oData.value.length);
					countryCode.setData(oData.value);
					oView.setModel(countryCode, "countryCode");
				},
				error: function (error) {
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

		readRegionSet: function (countryKey, indicator) {
			var that = this;
			var url = appModulePath+"/odata/v4/ideal-registration-form-srv/MasterRegion?$filter=LAND1 eq '"+countryKey+"'";

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					if (indicator === "H") {
						var RegionJson = new JSONModel();
						RegionJson.setData(oData.value);
						RegionJson.setSizeLimit(oData.value.length);
						that.getView().setModel(RegionJson, "RegionJson");
					} else if (indicator === "CH") {
						var contactRegion = new JSONModel();
						contactRegion.setData(oData.value);
						contactRegion.setSizeLimit(oData.value.length);
						that.getView().setModel(contactRegion, "contactRegion");
					} else {
						var RegionJson1 = new JSONModel();
						RegionJson1.setData(oData.value);
						RegionJson1.setSizeLimit(oData.value.length);
						that.getView().setModel(RegionJson1, "RegionJson1");
					}
				},
				error: function (error) {
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

		handleOtherAddress: function () {
			var sReqNo;
			var aOtherAddress =  oView.getModel("blankJson").getProperty("/otherAddress");

			if(aOtherAddress.length === 0){
				sReqNo = RequestNO
			}
			else{
				sReqNo = aOtherAddress[0].REQUEST_NO;
			}
			
			var aHeaderData = this.getView().getModel("blankJson").getProperty("/headerData");

			oView.getModel("blankJson").getProperty("/otherAddress").push({
				"ADDRESS_TYPE": "OTH",
				"ADDRESS_DESC": "Other Office",
				"HOUSE_NUM1": "",
				"STREET1": null,
				"STREET2": null,
				"STREET3": null,
				"STREET4": null,
				"CITY": null,
				"STATE": null,
				"REGION_DESC": null,
				"COUNTRY": null,
				"COUNTRY_DESC": null,
				"POSTAL_CODE": null,
				"CONTACT_TELECODE": null,
				"CONTACT_NO": null,
				"FAX_NO": null,
				"EMAIL": null,
				"DISTRICT": null,
				"REQUEST_NO": sReqNo,
				"SR_NO": 0
			});

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/otherAddress").push({
					"ADDRESS_TYPE": "OTH",
					"ADDRESS_DESC": "Other Office",
					"HOUSE_NUM1": "",
					"STREET1": null,
					"STREET2": null,
					"STREET3": null,
					"STREET4": null,
					"CITY": null,
					"STATE": null,
					"REGION_DESC": null,
					"COUNTRY": null,
					"COUNTRY_DESC": null,
					"POSTAL_CODE": null,
					"CONTACT_TELECODE": null,
					"CONTACT_NO": null,
					"FAX_NO": null,
					"EMAIL": null,
					"DISTRICT": null
				});
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("trAddId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherAddress").length);

		},

		handleDeleteOtherAddress: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			// if (index === "0") {
			// 	var iAddressObj = oView.getModel("blankJson").getProperty("/otherAddress")[0];
			// 	iAddressObj.STREET1 = null,
			// 		iAddressObj.STREET2 = null,
			// 		iAddressObj.STREET3 = null,
			// 		iAddressObj.STREET4 = null,
			// 		iAddressObj.EMAIL = null,
			// 		iAddressObj.COUNTRY_DESC = null,
			// 		iAddressObj.REGION_DESC = null,
			// 		iAddressObj.COUNTRY = null,
			// 		iAddressObj.STATE = null,
			// 		iAddressObj.CITY = null,
			// 		iAddressObj.CONTACT_TELECODE = null,
			// 		iAddressObj.CONTACT_NO = null,
			// 		iAddressObj.POSTAL_CODE = null,
			// 		iAddressObj.FAX_NO = null
			// } else {
			oView.getModel("blankJson").getProperty("/otherAddress").splice(index, 1);
			// }

			oView.getModel("blankJson").refresh(true);
			oView.byId("trAddId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherAddress").length);

			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/otherAddress").splice(index, 1);
			}

			//	added by pranay 28-09-2022
			this._logDataCondition(index, "Other Office Address", "Row " + (parseInt(index, 10) + 1) + " deleted", "", "", "");
		},

		handleOtherContactDetails: function () {
			var sReqNo;

			if (oView.byId("S1G2T1F1").getVisible() === true) {
				maxCount = 11;
			} else {
				maxCount = 12;
			}
			var aOtherContacts = oView.getModel("blankJson").getProperty("/otherAddress");
			var aHeaderData = this.getView().getModel("blankJson").getProperty("/headerData");


			if(aOtherContacts.length === 0){
				sReqNo = RequestNO;
			}
			else{
				sReqNo = aOtherContacts.REQUEST_NO;
			}

			if (oView.byId("table_contactId").getVisibleRowCount() < maxCount) {
				oView.getModel("blankJson").getProperty("/contact").push({
					"CONTACT_TYPE": "AUTH",
					"NAME1": null,
					"NAME2": null,
					"DESIGNATION": null,
					"NATIONALITY": null,
					"CITY": null,
					"PASSPORT_NO": null,
					"EMAIL": null,
					"CONTACT_TELECODE": null,
					"CONTACT_NO": null,
					"MOBILE_TELECODE": null,
					"MOBILE_NO": null,
					"HOUSE_NUM1": null,
					"STREET1": null,
					"STREET2": null,
					"POSTAL_CODE": null,
					"REQUEST_NO": null,
					"SR_NO": null,
					"STATE": null,
					"BP_ID": null,
					"REQUEST_NO": sReqNo,
					"SR_NO": 0
				});

				oView.getModel("blankJson").refresh(true);
				oView.byId("table_contactId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/contact").length);

				if (loginData.REQUEST_TYPE === 5) {
					oView.getModel("originalJson").getProperty("/contact").push({
						"CONTACT_TYPE": "AUTH",
						"NAME1": null,
						"NAME2": null,
						"DESIGNATION": null,
						"NATIONALITY": null,
						"CITY": null,
						"PASSPORT_NO": null,
						"EMAIL": null,
						"CONTACT_TELECODE": null,
						"CONTACT_NO": null,
						"MOBILE_TELECODE": null,
						"MOBILE_NO": null,
						"HOUSE_NUM1": null,
						"STREET1": null,
						"STREET2": null,
						"BP_ID": null
					});
				}

			} else {
				MessageBox.warning("Maximum contact details you can add :" + maxCount);
				return;
			}
		},

		deleteContactDetails: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			// if (index === "0") {
			// 	var iContactObj = oView.getModel("blankJson").getProperty("/contact")[0];
			// 	iContactObj.NAME1 = null,
			// 		iContactObj.NAME2 = null,
			// 		iContactObj.DESIGNATION = null,
			// 		iContactObj.NATIONALITY = null,
			// 		iContactObj.CITY = null,
			// 		iContactObj.PASSPORT_NO = null,
			// 		iContactObj.EMAIL = null,
			// 		iContactObj.CONTACT_TELECODE = null,
			// 		iContactObj.CONTACT_NO = null,
			// 		iContactObj.MOBILE_TELECODE = null,
			// 		iContactObj.MOBILE_NO = null,
			// 		iContactObj.HOUSE_NUM1 = null,
			// 		iContactObj.STREET1 = null,
			// 		iContactObj.STREET2 = null,
			// 		iContactObj.BP_ID = null
			// } else {
			oView.getModel("blankJson").getProperty("/contact").splice(index, 1);
			// }

			oView.getModel("blankJson").refresh(true);
			oView.byId("table_contactId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/contact").length);

			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/contact").splice(index, 1);
			}

			//	added by pranay 28-09-2022
			this._logDataCondition(index, "Other Contact", "Row " + (parseInt(index, 10) + 1) + " deleted", "", "", "");
		},

		handleCountryDialog: function (oEvent) {
			this.selectedRow = oEvent.getSource();
			if (!this.countryDialog) {
				this.countryDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealdealerprofile.view.fragments.countryDialog", this);
				this.getView().addDependent(this.countryDialog);
			}

			this.countryDialog.open();
			// sap.ui.getCore().byId("countrySrchId").setValue("");

			context._onTableValueChangeCountry(oEvent);

			context._onTableValueHelpChange(oEvent);
		},

		closeCountryDialog: function () {
			this.countryDialog.close();
			// this.countryDialog.destory();
		},

		handleCountrySelection: function (oEvent) {
			var RAddress = "R";
			var index = parseInt(this.selectedRow.getBindingContext("blankJson").getPath().split("/")[2]);
			var sPath = this.selectedRow.getBindingContext("blankJson").getPath();
			var selectedObj = this.getView().getModel("blankJson").getProperty("/otherAddress");
			if (selectedObj[index].STATE !== null) {
				selectedObj[index].STATE = null;
				selectedObj[index].REGION_DESC = null;
			}
			if (selectedObj[index].CITY !== null) selectedObj[index].CITY = null;
			if (selectedObj[index].POSTAL_CODE !== null) selectedObj[index].POSTAL_CODE = null;
			var countryCode = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().LAND1;
			var countyDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().LANDX;
			selectedObj[index].COUNTRY = countryCode;
			selectedObj[index].COUNTRY_DESC = countyDesc;

			oView.getModel("blankJson").refresh(true);

			sap.ui.getCore().byId("cntry_listId").removeSelections(true);
			sap.ui.getCore().byId("countrySrchId").setValue("");
			this.refreshCountryList();
			this.countryDialog.close();

			//new
			this.readPostalCodeLength(countryCode, RAddress);

			var sTelecodePath = sPath;
			this.readAutoCountryCodeSet(countryCode, sTelecodePath);
			// Added By Inder chouhan 30-04-2023 for regex postal in Reg Table
			//         jQuery.sap.delayedCall(100, this, function () {
			//         if(registerPincode !== null && registerPincode !== undefined && registerPincode !== "" && registerPincode !== 0){
			// this.getView().byId("trAddId").getRows()[index].getCells()[10].setMaxLength(registerPincode)
			//         	}
			// });
			var ch_value = countyDesc;
			this._logDataCondition(this.country_Id, this.Country_label, ch_value, "", this.countryOrg_value, "");

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue !== countyDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					delete updateId[index1];
				}
			}

		},

		handleCountrySearch: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("LANDX", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("cntry_listId");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},
		//added by pranay 17-10-2022
		handleOTHNationality: function (oEvent) {
			this.selectedContactCntry = oEvent.getSource();
			if (!this.OTH_CCountryDialog) {
				this.OTH_CCountryDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealdealerprofile.view.fragments.contactCountryDialog",
					this);
				this.getView().addDependent(this.OTH_CCountryDialog);
			}
			//capture logs
			context._onTableValueContactCountry(oEvent);
			this.OTH_CCountryDialog.open();
		},
		//added by pranay 17-10-2022
		contactOTHCountrySelection: function (oEvent) {
			var index = parseInt(this.selectedContactCntry.getBindingContext("blankJson").getPath().split("/")[2]);
			var sPath = this.selectedContactCntry.getBindingContext("blankJson").getPath();
			var selectedContactObj = this.getView().getModel("blankJson").getProperty("/contact");
			if (selectedContactObj[index].STATE !== null) {
				selectedContactObj[index].STATE = null;
				selectedContactObj[index].REGION_DESC = null;
			}
			if (selectedContactObj[index].CITY !== null) selectedContactObj[index].CITY = null;
			if (selectedContactObj[index].POSTAL_CODE !== null) selectedContactObj[index].POSTAL_CODE = null;

			var ccountryCode = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().LAND1;
			var ccountyDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().LANDX;

			selectedContactObj[index].NATIONALITY = ccountryCode;
			selectedContactObj[index].COUNTRY_DESC = ccountyDesc;

			oView.getModel("blankJson").refresh(true);
			var sTelecodePath = sPath;
			this.readAutoCountryCodeSet(ccountryCode, sTelecodePath);

			sap.ui.getCore().byId("contactcntry_listId").removeSelections(true);
			sap.ui.getCore().byId("contctCountry_Id").setValue("");
			// id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc
			// this._logDataCondition(this.contactcountry_Id, this.ContactCountry_label, ccountyDesc, "", this.concountryOrg_value, "");
			this._logDataCondition(this.contactcountry_Id, this.ContactCountry_label, ccountyDesc, ccountyDesc, this.concountryOrg_value, "");

			this.refreshcontactCountryList();
			this.OTH_CCountryDialog.close();
		},
		//added by pranay 17-10-2022
		closeContactCountryDialog: function (oEvent) {
			this.OTH_CCountryDialog.close();
		},

		handleOTHContactCountrySearch: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("LANDX", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("contactcntry_listId");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},

		refreshcontactCountryList: function () {
			var list = sap.ui.getCore().byId("contactcntry_listId");
			var binding = list.getBinding("items");
			binding.filter(null);
		},
		telecodeAndNumberCheck: function (data) {
			if (data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					if ((data[i].CONTACT_TELECODE !== null || data[i].CONTACT_TELECODE !== "") && (data[i].CONTACT_NO === null || data[i].CONTACT_NO ===
							"")) {
						data[i].CONTACT_TELECODE = null;
						data[i].CONTACT_NO = null;
					}
					if ((data[i].MOBILE_TELECODE !== null || data[i].MOBILE_TELECODE !== "") && (data[i].MOBILE_NO === null || data[i].MOBILE_NO ===
							"")) {
						data[i].MOBILE_TELECODE = null;
						data[i].MOBILE_NO = null;
					}
				}
			}

			return data;
		},
		handleOTHContactRegion: function (oEvent) {
			context.selectOTHConObject = oEvent.getSource();
			var index = parseInt(context.selectOTHConObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var country = this.getView().getModel("blankJson").getProperty("/contact")[index].NATIONALITY;

			if (country === null || country === "") {
				MessageBox.information("Please Select Nationality");
				return;
			}
			//get state code for contact region
			this.readRegionSet(country, "R");
			//Open other contact region dialog
			if (!this.OTHConregionDialog) {
				this.OTHConregionDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealdealerprofile.view.fragments.contactRegionDialog",
					this);
				this.getView().addDependent(this.OTHConregionDialog);
			}
			jQuery.sap.delayedCall(100, this, function () {
				this.OTHConregionDialog.open();
				sap.ui.getCore().byId("con_regionSrchId").setValue("");
			});
			context._onTableValueContactRegionChange(oEvent);
			context._onTableValueHelpChange(oEvent);
		},

		closeOTHContactRegionDialog: function (oEvent) {
			this.OTHConregionDialog.close();
		},

		handleOTHContactRARegionChange: function (oEvent) {
			var index = parseInt(context.selectOTHConObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var cregionCode = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson1").getObject().BLAND;
			var cregionDesc = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson1").getObject().BEZEI;
			this.getView().getModel("blankJson").getProperty("/contact")[index].STATE = cregionCode;
			this.getView().getModel("blankJson").getProperty("/contact")[index].REGION_DESC = cregionDesc;

			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("con_regionSrchId").setValue("");

			this._logDataCondition(this.contactregion_Id, this.ContactRegion_label, cregionDesc, "", this.conregionOrg_value, "");

			this.OTHConregionDialog.close();
		},

		handleOTHContactRegionSearch: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("BEZEI", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("contactreg_listId");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},

		_onTableValueChangeCountry: function (oEvent) {
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				this.countryOrg_value = null;
			} else {
				this.countryOrg_value = this.Originaldata.DRAFT.ADDRESS[org_index].COUNTRY_DESC;
			}

			var index1 = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			this.Country_label = oEvent.getSource().oParent.oParent.mAggregations.columns[6].mAggregations.label.mProperties.text;
			this.country_Id = oEvent.getSource().oParent.oParent.mAggregations.columns[6].mAggregations.label.mBindingInfos.required.binding.aBindings[
				0].sPath.split("/")[1] + "_" + index1;

		},

		_onTableValueContactCountry: function (oEvent) {
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			// if (loginData.REQUEST_TYPE !== 3 && loginData.CREATION_TYPE !== 3) {
				org_index = org_index + 1;
			// }
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				this.concountryOrg_value = null;
			} else {
				this.concountryOrg_value = this.Originaldata.DRAFT.CONTACTS[org_index].COUNTRY_DESC;
			}

			var index1 = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			this.ContactCountry_label = oEvent.getSource().oParent.oParent.mAggregations.columns[3].mAggregations.label.mProperties.text;
			
			this.contactcountry_Id = oEvent.getSource().oParent.oParent.mAggregations.columns[3].mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1] + "_" + index1;
		},

		_onTableValueContactRegionChange: function (oEvent) {
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			if (loginData.REQUEST_TYPE !== 3 && loginData.CREATION_TYPE !== 3) {
				org_index = org_index + 1;
			}
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				this.conregionOrg_value = null;
			} else {
				this.conregionOrg_value = this.Originaldata.DRAFT.CONTACTS[org_index].REGION_DESC;
			}

			var index1 = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			this.ContactRegion_label = oEvent.getSource().oParent.oParent.mAggregations.columns[4].mAggregations.label.mProperties.text;
			this.contactregion_Id = oEvent.getSource().oParent.oParent.mAggregations.columns[4].mAggregations.label.mBindingInfos.required.binding
				.aBindings[
					0].sPath.split("/")[1] + "_" + index1;

		},

		onTableValueSwiftCodeChange: function (oEvent) {
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.PAYMENT[org_index] === undefined) {
				this.OTHSwiftOrg_value = null;
			} else {
				this.OTHSwiftOrg_value = this.Originaldata.DRAFT.PAYMENT[org_index].SWIFT_CODE;
			}

			var index1 = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			this.othSwift_label = oEvent.getSource().oParent.oParent.mAggregations.columns[1].mAggregations.label.mProperties.text;
			this.othSwift_Id = oEvent.getSource().oParent.oParent.mAggregations.columns[1].mAggregations.label.mBindingInfos.required.binding.aBindings[
				0].sPath.split("/")[1] + "_" + index1;

		},

		refreshCountryList: function () {
			var list = sap.ui.getCore().byId("cntry_listId");
			var binding = list.getBinding("items");
			binding.filter(null);
		},

		handleRegionDialog: function (oEvent) {
			context.selectedObject = oEvent.getSource();
			var index = parseInt(context.selectedObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var country = this.getView().getModel("blankJson").getProperty("/otherAddress")[index].COUNTRY;
			//03/03/2022
			if (country === null || country === "") {
				MessageBox.information("Please Select Country");
				return;
			}
			this.readRegionSet(country, "R");
			if (!this.regionDialog) {
				this.regionDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealdealerprofile.view.fragments.regionDialog", this);
				this.getView().addDependent(this.regionDialog);
			}
			jQuery.sap.delayedCall(100, this, function () {
				this.regionDialog.open();
				sap.ui.getCore().byId("regionSrchId").setValue("");
			});

			context._onTableValueChangeRegion(oEvent);
			context._onTableValueHelpChange(oEvent);

		},

		closeRegionDialog: function () {
			this.regionDialog.close();
		},

		handleRARegion: function (oEvent) {
			var index = parseInt(context.selectedObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var regionCode = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson1").getObject().BLAND;
			var regionDesc = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson1").getObject().BEZEI;
			this.getView().getModel("blankJson").getProperty("/otherAddress")[index].STATE = regionCode;
			this.getView().getModel("blankJson").getProperty("/otherAddress")[index].REGION_DESC = regionDesc;
			//	context.selectedObject.setValue(regionDesc);
			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("regionSrchId").setValue("");
			this.regionDialog.close();

			//Maintain log Data
			var ch_value = regionDesc;
			this._logDataCondition(this.region_Id, this.region_label, ch_value, "", this.regionOrg_value, "");

			//get updated id
			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue !== regionDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					delete updateId[index1];
				}
			}

		},

		_onTableValueChangeRegion: function (oEvent) {
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				this.regionOrg_value = null;
			} else {
				this.regionOrg_value = this.Originaldata.DRAFT.ADDRESS[org_index].REGION_DESC;
			}
			//	var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].COUNTRY;
			// this.regionOrg_value = this.Originaldata.DRAFT.ADDRESS[org_index].REGION_DESC;
			var index1 = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			this.region_label = oEvent.getSource().oParent.oParent.mAggregations.columns[7].mAggregations.label.mProperties.text;
			this.region_Id = oEvent.getSource().oParent.oParent.mAggregations.columns[7].mAggregations.label.mBindingInfos.required.binding.aBindings[
				0].sPath.split("/")[1] + "_" + index1;

		},

		handleRegionSearch: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("BEZEI", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("region_listId");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},
		readAutoCountryCodeSet: function (countryKey, sPath) {
			var url = appModulePath+"/odata/v4/ideal-registration-form-srv/MasterTelecode?$filter=LAND1 eq '"+countryKey+"'";
			$.ajax({
				url: url,
				type: 'GET',
				data: null,
				contentType: 'application/json',
				async: false,
				success: function (oData, response) {
					BusyIndicator.hide();
					if (oView.getModel("blankJson").getProperty(sPath + "/CONTACT_TELECODE") !== undefined) {
						oView.getModel("blankJson").setProperty(sPath + "/CONTACT_TELECODE", oData.value[0].TELEFTO);
					}
					if (oView.getModel("blankJson").getProperty(sPath + "/MOBILE_TELECODE") !== undefined) {
						oView.getModel("blankJson").setProperty(sPath + "/MOBILE_TELECODE", oData.value[0].TELEFTO);
					}
					oView.getModel("blankJson").refresh(true);
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
					MessageBox.error(oXMLMsg, {
						icon: MessageBox.Icon.ERROR,
						title: "ERROR",
						actions: sap.m.MessageBox.Action.CLOSE,
						emphasizedAction: sap.m.MessageBox.Action.CLOSE
					});
				}
			});
		},

		handleHQCountry: function (oEvent) {
			this.getView().byId("S1G2T1F6").setValueState(sap.ui.core.ValueState.None).setValueStateText("");

			var HQAddress = "H";

			if (oView.byId("S1G2T1F7").getSelectedKey()) {
				oView.byId("S1G2T1F7").setSelectedKey("");
			}
			if (oView.byId("S1G2T1F8").getValue()) {
				oView.byId("S1G2T1F8").setValue("");
			}
			if (oView.byId("S1G2T1F10").getValue()) {
				oView.byId("S1G2T1F10").setValue("");
			}
			if (oView.byId("S1G2T1F6").getSelectedKey() === context.clientCountry) {
				loginData.BP_TYPE_CODE = ""
				context.validateLocalCountry()

			} else {
				if (oView.byId("S1G2T1F6").getSelectedKey() != 'AE'){
					loginData.BP_TYPE_CODE = ""
					context.validateLocalCountry()
				}
				else{
				loginData.BP_TYPE_CODE = "B";
				context.validateLocalCountry();
				}
			}
			var country = oEvent.getSource().getSelectedKey();
			var countryDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().LANDX;
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			var org_country = this.Originaldata.DRAFT.ADDRESS[0].COUNTRY;
			var org_countryDesc = this.Originaldata.DRAFT.ADDRESS[0].COUNTRY_DESC;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			//	var flag;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			oView.getModel("blankJson").setProperty("/" + sPath, country);
			oView.getModel("blankJson").setProperty("/address/COUNTRY_DESC", countryDesc);
			oView.getModel("blankJson").refresh(true);

			this._logDataCondition(Id, label, countryDesc, "", org_countryDesc, "");

			this.readRegionSet(country, HQAddress);

			this.readPostalCodeLength(country, HQAddress);
			//added by pranay
			this.readPostalCodeFormats(country, HQAddress);

			// var sTelecodePath = sPath.replace(sPath.split("/")[sPath.split("/").length - 1], "");
			var sTelecodePath = "/" + sPath.split("/")[1];

			this.readAutoCountryCodeSet(country, sTelecodePath);

			context.onChange(oEvent); //komal
		},
		validateLocalCountry: function () {
			if (loginData.BP_TYPE_CODE === "B" && (loginData.SUPPLIERTYPE_CODE !== "ZGOV" || loginData.SUPPLIERTYPE_CODE !== "ZUNI")) {
				oView.byId("S1G4T9F1_lbl").setRequired(true);
				oView.byId("S1G4T9F1_lbl2").setRequired(true);
				oView.byId("S1G4T9F1_lbl").setText("Trade License No.");
				oView.byId("S1G4T9F1").setPlaceholder("Enter Trade License No.");
				oView.byId("S1G4T9F1_lbl2").setText("Trade License Expiry Date");

			} else if (loginData.BP_TYPE_CODE !== "B" && (loginData.SUPPLIERTYPE_CODE !== "ZGOV" || loginData.SUPPLIERTYPE_CODE !== "ZUNI") &&
				(loginData.REQUEST_TYPE !== 7 || loginData.REQUEST_TYPE !== 3)) {
				oView.byId("S1G4T9F1_lbl").setRequired(true);
				oView.byId("S1G4T9F1_lbl2").setRequired(false);
				oView.byId("S1G4T9F1_lbl").setText("Certificate of Incorporation No.");
				oView.byId("S1G4T9F1_lbl2").setText("Certificate of Incorporation Expiry Date");
				oView.byId("S1G4T9F1").setPlaceholder("Enter Certificate of Incorporation No.");

			}
		},

		handleCountryCode: function (oEvent) {
			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			var ch_value = "+" + countryCode;
			var org_value = null;
			if (this.Originaldata.DRAFT.ADDRESS[0].CONTACT_TELECODE !== null) {
				org_value = "+" + this.Originaldata.DRAFT.ADDRESS[0].CONTACT_TELECODE;
			}

			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1] + "_telecode";
			var fieldId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			oView.getModel("blankJson").setProperty("/" + sPath, countryCode);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent);
		},

		onChange: function (oEvent) {
				
			if (loginData.REQUEST_TYPE === 5) {
				var model, property, val;
				if (oEvent.getId() === "change") {
					model = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[1];
					property = oEvent.getSource().mBindingInfos.value.parts[0].path.split("/")[2];
					val = oEvent.getSource().getValue();
				} else if (oEvent.getId() === "selectionChange") {
					model = oEvent.getSource().mBindingInfos.selectedKey.parts[0].path.split("/")[1];
					property = oEvent.getSource().mBindingInfos.selectedKey.parts[0].path.split("/")[2];
					val = oEvent.getSource().getSelectedKey();
				} else if (oEvent.getId() === "selectionFinish") {
					model = oEvent.getSource().mBindingInfos.selectedKeys.parts[0].path.split("/")[1];
					property = oEvent.getSource().mBindingInfos.selectedKeys.parts[0].path.split("/")[2];
					val = oEvent.getSource().getSelectedKeys();
				}
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				if (headData[property] !== val) {
					if (!updateId.includes(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1])) {
						updateId.push(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					delete updateId[index];
				}
			}
		},

		_onTableValueHelpChange: function (oEvent) {
			if (loginData.REQUEST_TYPE === 5) {
				var model, property, index = null,
					dataIndex = null,
					val;
				var totalcell = oEvent.getSource().oParent.mAggregations.cells;

				var sId = oEvent.getSource().getId();
				for (var i = 0; i < totalcell.length; i++) {
					if (sId === totalcell[i].sId) {
						index = i;
						break;
					}
				}

				model = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[1];
				dataIndex = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[2]);
				property = oEvent.getSource().mBindingInfos.value.binding.sPath;
				//	val = oEvent.getSource().getValue();

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				context.id = oEvent.getSource().oParent.oParent.mAggregations.columns[index].mAggregations.label.mBindingInfos.required.binding.aBindings[
						0]
					.sPath.split("/")[1];
				context.valueHelpOldValue = headData[dataIndex][property];

			}
		},

		handleCompanyName1Change: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].DIST_NAME1;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var companyName1_Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(companyName1_Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent);
		},

		handleCompanyName2Change: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].DIST_NAME2;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var companyName2_Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(companyName2_Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleWebsiteChange: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].WEBSITE;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var website_Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(website_Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleRegisteredChange: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].REGISTERED_ID;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var website_Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(website_Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleHQStreetNo: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].HOUSE_NUM1;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1] + "_streetNo";
			var fieldId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleHQStreet3: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].STREET3;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleHQStreet1: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].STREET1;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleHQStreet4: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].STREET4;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleHQStreet2: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].STREET2;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		_validateMobileNum: function (oEvent) {
			validations._validateMobileNum(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].CONTACT_NO;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var HQcontact_Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(HQcontact_Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		_tableValidateMobileNum: function (oEvent) {
			validations._validateMobileNum(oEvent);

			context._onTableValueChange(oEvent);
		},

		_onTableValueChange: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, index = null,
					dataIndex = null,
					val;
				var totalcell = oEvent.getSource().oParent.mAggregations.cells;

				var sId = oEvent.getSource().getId();
				for (var i = 0; i < totalcell.length; i++) {
					if (sId === totalcell[i].sId) {
						index = i;
						break;
					}
				}
				if (oEvent.getId() === "change") {
					model = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[1];
					dataIndex = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[2]);
					property = oEvent.getSource().mBindingInfos.value.binding.sPath;
					val = oEvent.getSource().getValue();
				} else if (oEvent.getId() === "selectionChange") {
					model = oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split("/")[1];
					dataIndex = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split("/")[2]);
					property = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
					val = oEvent.getSource().getSelectedKey();
				}

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var id =  oEvent.getSource().oParent.oParent.mAggregations.columns[index].mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1];
				if (headData[dataIndex][property] !== val) {
					if (!updateId.includes(id)) {
						updateId.push(id);
					}
				} else {
					var index = updateId.indexOf(id);
					delete updateId[index];
				}
			}
		},

		_tableCharactersValidationAddCity: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].CITY;
			}
			// var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].CITY;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[8].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[8].mAggregations.label.mBindingInfos.required.binding.aBindings[0]
				.sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[8].mAggregations.label.mBindingInfos.required.binding.aBindings[
					0]
				.sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},
		onSelectRegionArrow : function(){
			var HQCountry = oView.byId("S1G1T1F6").getSelectedKey();
			if(HQCountry === ""){
				this.getView().byId("S1G1T1F6").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please Select Country.");
			}

		},
		handleHQRegion: function (oEvent) {
			var region = oEvent.getSource().getSelectedKey();
			var regionDesc = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson").getObject().BEZEI;
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;

			var org_regionDesc = this.Originaldata.DRAFT.ADDRESS[0].REGION_DESC;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			//	var flag;
			var HQRegion_logId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];
			//	var count = 1;
			this._logDataCondition(HQRegion_logId, label, regionDesc, "", org_regionDesc, "");
			oView.getModel("blankJson").setProperty("/" + sPath, region);
			oView.getModel("blankJson").setProperty("/address/REGION_DESC", regionDesc);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent);
		},

		_logDataCondition: function (id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc) {
			
			var count = 1;
			var flag;
			for (var i = 0; i < logData.length; i++) {
				if (logData[i].ID === id) {
					if (org_value !== ch_value) {
						flag = 1;
						
						var logDetails = this._logDataCreate(id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc, flag);
						logData[i] = logDetails;
						break;
					} else {
						logData = logData.filter(function (item) {
							return item !== logData[i];
						});
						break;
					}

				} else if (count === logData.length) {
					flag = 0;
					this._logDataCreate(id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc, flag);
					break;
				}
				count = count + 1;
			}

			if (logData.length === 0) {
				flag = 0;
				this._logDataCreate(id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc, flag);
			}
		},

		_logDataCreate: function (id, lable, value, valuedesc, orgvalue, orgvalue_desc, flag) {
			var that = this;
			// if (loginData.REQUEST_TYPE === 5 || loginData.REQUEST_TYPE === 6) {
			// 	var VendorCode = loginData.SAP_VENDOR_CODE;
			// } else {
			// 	if (loginData.STATUS === 13) {
			// 		var VendorCode = loginData.SAP_VENDOR_CODE;
			// 	} else {
			// 		var VendorCode = loginData.IVEN_VENDOR_CODE;
			// 	}

			// }

			// orgvalue = orgvalue === undefined ? null : orgvalue;
			// value = value === undefined ? null : value;
			// var isString = typeof(VendorCode);
			// var vendorCode;
			// if(isString !== "string"){
			// 	 vendorCode = JSON.stringify(VendorCode);
			// }
			// else{
			// 	vendorCode = VendorCode;
			// }

			if (flag === 1) {
				//	if (orgvalue !== value) {
				var logObj = {
					"ID": id,
					"REQUEST_NO": loginData.REG_NO,
					"UPDATED_FIELD_NAME": lable || null,
					"CHANGE_VALUE": value || null,
					"ORG_VALUE": orgvalue || null,
					"COMMENT": lable + " change from " + orgvalue + " to " + value,
					"USER_ID": that._sUserID || null,
					"USER_NAME": that._sUserName || null,
					"SAP_DIST_CODE":loginData.SAP_DIST_CODE || null,
					"EVENT_NO": 0,
					"EVENT_CODE": 0,
					"EVENT_TYPE": null,
					"REMARK": null,
					"UPDATED_ON": null
				};
				return logObj;
				//	}
			} else {
				//	if (orgvalue !== value) {
				var logObj = {
					"ID": id,
					"REQUEST_NO": loginData.REG_NO,
					"UPDATED_FIELD_NAME": lable || null,
					"CHANGE_VALUE": value || null,
					"ORG_VALUE": orgvalue || null,
					"COMMENT": lable + " change from " + orgvalue + " to " + value,
					"USER_ID": that._sUserID,
					"USER_NAME": that._sUserName,
					// "SAP_VENDOR_CODE": VendorCode || null,
					"SAP_DIST_CODE": loginData.SAP_DIST_CODE || null,
					"EVENT_NO": 0,
					"EVENT_CODE": 0,
					"EVENT_TYPE": null,
					"REMARK": null,
					"UPDATED_ON": null
				};
				logData.push(logObj);
				//	}
			}
		},

		postalCodeValidation: function (oEvent) {
			var reg1 = null;
			var headOfficeCountry = oView.getModel("blankJson").getProperty("/address");

			//check weather country is select or not 03/03/2022
			if (headOfficeCountry.COUNTRY === null || headOfficeCountry.COUNTRY === "") {
				this.getView().byId("S1G2T1F6").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please Select Country");
				// MessageBox.information("Please Select Country");
				oEvent.getSource().setValue("");
				return;
			}
			//added by pranay 17/10/2022
			var oSource = oEvent.getSource();
			var reg = oView.getModel("localModel").getProperty("/regex_HQ").test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code eg: " + oView.getModel("localModel")
					.getProperty("/pcode_HQformat"));
				return;
			}

			// var oSource = oEvent.getSource();
			// var reg = /^[a-zA-Z0-9 -]*$/.test(oSource.getValue());
			// if (reg === true || oSource.getValue() === "") {
			// 	oSource.setValueState(sap.ui.core.ValueState.None);
			// } else {
			// 	oEvent.getSource().setValue("");
			// 	oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only numbers");
			// 	return;
			// }
			// if (headOfficeCountry.COUNTRY === "AE") {
			// 	if (oSource.getValue().length > 6 || oSource.getValue().length < 3) {
			// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code");
			// 		oEvent.getSource().setValue("");
			// 	} else {
			// 		oSource.setValueState(sap.ui.core.ValueState.None);
			// 	}
			// } else if (headOfficeCountry.COUNTRY === "US") {
			// 	reg1 = /^[0-9]{5}(?:-[0-9]{4})?$/.test(oSource.getValue());
			// 	if (reg1 === true || oSource.getValue() === "") {
			// 		oSource.setValueState(sap.ui.core.ValueState.None);
			// 	} else {
			// 		oEvent.getSource().setValue("");
			// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code");
			// 		return;
			// 	}
			// 	if (oSource.getValue().length > 10 || oSource.getValue().length < 5) {
			// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code");
			// 		oEvent.getSource().setValue("");
			// 	} else {
			// 		oSource.setValueState(sap.ui.core.ValueState.None);
			// 	}
			// } else if (headOfficeCountry.COUNTRY === "BR") {
			// 	reg1 = /^[0-9]{5}-[0-9]{3}?$/.test(oSource.getValue());
			// 	if (reg1 === true || oSource.getValue() === "") {
			// 		oSource.setValueState(sap.ui.core.ValueState.None);
			// 	} else {
			// 		oEvent.getSource().setValue("");
			// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code e.g XXXXX-XXX");
			// 		return;
			// 	}

			// } else {
			// 	if (!isNaN(postalCodeLength)) {
			// 		if (oSource.getValue().length !== postalCodeLength && oSource.getValue().length !== 0) {
			// 			oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code with " + postalCodeLength +
			// 				" digits");
			// 			oEvent.getSource().setValue("");
			// 		}
			// 	} else {
			// 		oSource.setValueState(sap.ui.core.ValueState.None);
			// 	}
			// }

			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].POSTAL_CODE;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var HQPostlCode_Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(HQPostlCode_Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent);
		},

		_validateHOAEmail: function (oEvent) {
			validations._validateEmail(oEvent);
			oView.getModel("blankJson").setProperty("/address/EMAIL", oEvent.getSource().getValue().toLowerCase().trim());
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].EMAIL;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent);
		},

		_charactersValidationHQCity: function (oEvent) {
			validations._charactersValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].CITY;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];
			if (!updateId.includes(Id)) {
				updateId.push(Id);
			}

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent);
		},

		_charactersValidation: function (oEvent) {
			validations._charactersValidation(oEvent);

			context.onChange(oEvent);
		},
		_numberValidation: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.ADDRESS[0].FAX_NO;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent); //komal
		},

		_tableValidateEmail: function (oEvent) { //komal
			validations._validateEmail(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].EMAIL;
			}
			//	var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].EMAIL;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[5].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[5].mAggregations.label.mBindingInfos.required.binding.aBindings[0]
				.sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[5].mAggregations.label.mBindingInfos.required.binding.aBindings[
					0]
				.sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			oView.getModel("blankJson").setProperty("/otherAddress/" + index + "/EMAIL", oEvent.getSource().getValue().toLowerCase().trim());

			context._onTableValueChange(oEvent); //komal
		},

		_tableCharactersValidation: function (oEvent) {
			context._onTableValueChange(oEvent);
			validations._charactersValidation(oEvent);
		},
		_onTableValueChangeHouseNum1: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].HOUSE_NUM1;
			}
			//	var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET1;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[0].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[0].mAggregations.label.mBindingInfos.required.parts[0].path.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[0].mAggregations.label.mBindingInfos.required.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		_onTableValueChangeStreet1: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET1;
			}
			//	var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET1;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[1].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[1].mAggregations.label.mBindingInfos.required.parts[0].path.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[1].mAggregations.label.mBindingInfos.required.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		_onTableValueChangeStreet2: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET2;
			}
			//	var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET2;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[2].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[2].mAggregations.label.mBindingInfos.required.parts[0].path.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[2].mAggregations.label.mBindingInfos.required.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		_onTableValueChangeStreet3: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET3;
			}
			//	var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET3;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[3].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[3].mAggregations.label.mBindingInfos.required.parts[0]
				.path.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[3].mAggregations.label.mBindingInfos.required.parts[
					0]
				.path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		_onTableValueChangeStreet4: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET4;
			}
			//	var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].STREET4;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[4].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[4].mAggregations.label.mBindingInfos.required.parts[0]
				.path.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[4].mAggregations.label.mBindingInfos.required.parts[
					0]
				.path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		lastNameContactValidation: function (oEvent) {
			var eventIndicator = "N";
			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;
			var isContactNameExist = context.checkDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, index);

			if (isContactNameExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().NAME1 = null;
				oEvent.getSource().getBindingContext("blankJson").getObject().NAME2 = null;
				MessageBox.warning("First Name and Last Name Combination already exist");
			}
			context._onTableValueChange(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].NAME2;
			}
			// var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].NAME2;
			var index1 = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 20;
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[1].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[1].mAggregations.label.mBindingInfos.required.parts[0]
				.path.split('/')[1] + "_" + index1;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[1].mAggregations.label.mBindingInfos.required.parts[0]
				.path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			validations._charactersValidation(oEvent);
		},

		_tableCharactersValidationDesignation: function (oEvent) {
			context._onTableValueChange(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].DESIGNATION;
			}
			//	var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].DESIGNATION;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[2].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[2].mAggregations.label.mBindingInfos.required.parts[0]
				.path.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[2].mAggregations.label.mBindingInfos.required.parts[0].path.split('/')[1];
			if (!updateId.includes(fieldId)) {
				updateId.push(fieldId);
			}

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			validations.designationValidation(oEvent);
		},

		tableAlphaNumaricVaidation: function (oEvent) {
			validations.alphaNumaricVaidation(oEvent);

			context._onTableValueChange(oEvent);
		},

		handleLegalStructure: function (oEvent) {
			var ch_value = oEvent.getSource().getSelectedKey();
			var org_value = this.Originaldata.DRAFT.MAIN[0].LEGAL_STRUCTURE;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent);
		},

		handleTableCountryCode: function (oEvent) {
			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();

			oView.getModel("blankJson").setProperty(sPath + "/CONTACT_TELECODE", countryCode);
			oView.getModel("blankJson").refresh(true);

			var ch_value = "+" + oEvent.getSource().getSelectedKey();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined || this.Originaldata.DRAFT.ADDRESS[org_index].length === 0) {
				var org_value = null;
			} else {
				var org_value = "+" + this.Originaldata.DRAFT.ADDRESS[org_index].CONTACT_TELECODE;
			}
			// var org_value = "+" + this.Originaldata.DRAFT.ADDRESS[org_index].CONTACT_TELECODE;
			var index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.cells[8].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.cells[8].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1] + "_" + index + "telecode";
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.cells[8].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.getCountryCodeId(oEvent);
		},

		_hboxContactNumberValidation: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].CONTACT_NO;
			}
			// var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].CONTACT_NO;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.cells[5].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.cells[5].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1] + "_" + index + "contactNo";
			// mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
		},

		getCountryCodeId: function (oEvent) {
			if (loginData.REQUEST_TYPE === 5) {
				var model, property, index = null,
					dataIndex = null,
					val;

				var totalcell = oEvent.getSource().oParent.oParent.mAggregations.cells;

				var sId = oEvent.getSource().getId();
				for (var i = 0; i < totalcell.length; i++) {
					if (totalcell[i].mAggregations.items !== undefined) {
						if (sId === totalcell[i].mAggregations.items[0].sId) {
							index = i;
							break;
						}
					}
				}
				if (oEvent.getId() === "selectionChange") {
					model = oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split("/")[1];
					dataIndex = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split("/")[2]);
					property = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
					val = oEvent.getSource().getSelectedKey();
				}
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var id = oEvent.getSource().oParent.oParent.mAggregations.cells[index].oParent.oParent.mAggregations.columns[index].
				mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1];
				if (headData[dataIndex][property] !== val) {
					if (!updateId.includes(id)) {
						updateId.push(id);
					}
				} else {
					var index = updateId.indexOf(id);
					delete updateId[index];
				}
			}
		},

		validateRegPincode: function (oEvent) {
			var oSource = oEvent.getSource();
			var sObject = oEvent.getSource().getBindingContext("blankJson").getObject();
			//03/03/2022
			if (sObject.COUNTRY === null || sObject.COUNTRY === "") {
				oSource.setValue("");
				MessageBox.information("Please Select Country");
				return;
			}

			this.readPostalCodeFormats(sObject.COUNTRY, "R");
			//added by pranay 17/10/2022
			jQuery.sap.delayedCall(700, this, function () {
				var reg = this.getView().getModel("localModel").getProperty("/regex_OTH").test(oSource.getValue());
				if (reg === true || oSource.getValue() === "") {
					oSource.setValueState(sap.ui.core.ValueState.None);
				} else {
					oSource.setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).
					setValueStateText("Enter valid postal code eg: " + this.getView().getModel("localModel").getProperty("/pcode_OTHformat"));
					return;
				}

			});

			//	context.readPostalCodeLength(sObject.COUNTRY, "R");
			// jQuery.sap.delayedCall(700, this, function () {
			// 	//var reg = /^[0-9]+$/.test(oSource.getValue());
			// 	var reg2 = null;
			// 	var reg = /^[a-zA-Z0-9 -]*$/.test(oSource.getValue());
			// 	if (reg === true || oSource.getValue() === "") {
			// 		oSource.setValueState(sap.ui.core.ValueState.None);
			// 	} else {
			// 		oSource.setValue("");
			// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only numbers");
			// 		return;
			// 	}

			// 	if (sObject.COUNTRY === "AE") {
			// 		if (oSource.getValue().length > 6 || oSource.getValue().length < 3) {
			// 			oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code");
			// 			oSource.setValue("");
			// 		} else {
			// 			oSource.setValueState(sap.ui.core.ValueState.None);
			// 		}
			// 	} else if (sObject.COUNTRY === "US") {
			// 		reg2 = /^[0-9]{5}(?:-[0-9]{4})?$/.test(oSource.getValue());

			// 		if (reg2 === true || oSource.getValue() === "") {
			// 			oSource.setValueState(sap.ui.core.ValueState.None);
			// 		} else {
			// 			oSource.setValue("");
			// 			oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code");
			// 			return;
			// 		}
			// 		if (oSource.getValue().length > 10 || oSource.getValue().length < 5) {
			// 			oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code");
			// 			oEvent.getSource().setValue("");
			// 		} else {
			// 			oSource.setValueState(sap.ui.core.ValueState.None);
			// 		}
			// 	} else if (sObject.COUNTRY === "BR") {
			// 		reg2 = /^[0-9]{5}-[0-9]{3}?$/.test(oSource.getValue());
			// 		if (reg2 === true || oSource.getValue() === "") {
			// 			oSource.setValueState(sap.ui.core.ValueState.None);
			// 		} else {
			// 			oSource.setValue("");
			// 			oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code e.g XXXXX-XXX");
			// 			return;
			// 		}

			// 	} else {
			// 		if (!isNaN(registerPincode)) {
			// 			if (oSource.getValue().length !== registerPincode && oSource.getValue().length !== 0) {
			// 				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code with " + registerPincode +
			// 					" digits");
			// 				oSource.setValue("");
			// 			}
			// 		} else {
			// 			oSource.setValueState(sap.ui.core.ValueState.None);
			// 		}
			// 	}
			// });

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].POSTAL_CODE;
			}
			// var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].POSTAL_CODE;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[10].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[10].mAggregations.label.mBindingInfos.required.binding.aBindings[
				0].sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[10].mAggregations.label.mBindingInfos.required.binding.aBindings[
				0].sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		contactOTHPostalValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var sObject = oEvent.getSource().getBindingContext("blankJson").getObject();
			//12/10/2022
			if (sObject.NATIONALITY === null || sObject.NATIONALITY === "") {
				oSource.setValue("");
				MessageBox.information("Please Select Nationality");
				return;
			}

			this.readPostalCodeFormats(sObject.NATIONALITY, "CR");

			jQuery.sap.delayedCall(700, this, function () {
				var reg = oView.getModel("localModel").getProperty("/regexOTHCont").test(oSource.getValue());
				if (reg === true || oSource.getValue() === "") {
					oSource.setValueState(sap.ui.core.ValueState.None);
				} else {
					oSource.setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).
					setValueStateText("Enter valid postal code eg: " + oView.getModel("localModel").getProperty("/pcode_OTHCont"));
					return;
				}

			});

			var ch_value = oSource.getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (loginData.REQUEST_TYPE !== 3) {
				org_index = org_index + 1;
			}
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].POSTAL_CODE;
			}
			// var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].POSTAL_CODE;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[10].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[10].mAggregations.label.mBindingInfos.required.binding.aBindings[
				0].sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[10].mAggregations.label.mBindingInfos.required.binding.aBindings[
				0].sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		_tableNumberValidationFax: function (oEvent) {
			validations._numberValidation(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.ADDRESS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].FAX_NO;
			}
			// var org_value = this.Originaldata.DRAFT.ADDRESS[org_index].FAX_NO;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[11].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[11].mAggregations.label.mBindingInfos.required.parts[0].path.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[11].mAggregations.label.mBindingInfos.required.binding.aBindings[
				0].sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		_charactersValidationHOCCity: function (oEvent) {
			validations._charactersValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].CITY;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent);
		},

		_charactersValidationHOCDesignation: function (oEvent) {
			//	validations._charactersValidation(oEvent);
			validations.designationValidation(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].DESIGNATION;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent);
		},

		_charactersValidationHOC: function (oEvent) {
			validations._charactersValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].NAME1;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1] + "_firstname";
			var fieldId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleCountryCodeHOC: function (oEvent) {
			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			var ch_value = "+" + countryCode;
			var org_value = null;
			if (this.Originaldata.DRAFT.CONTACTS[0].CONTACT_TELECODE !== null) {
				org_value = "+" + this.Originaldata.DRAFT.CONTACTS[0].CONTACT_TELECODE;
			}

			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1] + "_telecode";
			var fieldId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			oView.getModel("blankJson").setProperty("/" + sPath, countryCode);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent);
		},

		_tableNumberValidation: function (oEvent) { //komal
			validations._numberValidation(oEvent);

			context._onTableValueChange(oEvent); //komal
		},

		handleNationality: function (oEvent) {
			var sCountry = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/NATIONALITY", sCountry);
			oView.getModel("blankJson").refresh(true);

			context._onTableValueChange(oEvent);
			var ch_value = oEvent.getSource().getSelectedKey();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]);
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].NATIONALITY;
			}
			// var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].NATIONALITY;
			var index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[3].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[3].mAggregations.label.mBindingInfos.required.binding.aBindings[0]
				.sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[3].mAggregations.label.mBindingInfos.required.binding.aBindings[
					0]
				.sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
		},

		_tableCharactersValidationCity: function (oEvent) {
			context._onTableValueChange(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].CITY;
			}
			//	var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].CITY;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[5].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[5].mAggregations.label.mBindingInfos.required.binding.aBindings[0]
				.sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[5].mAggregations.label.mBindingInfos.required.binding.aBindings[
					0]
				.sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			validations._charactersValidation(oEvent);
		},

		contactPassportValidation: function (oEvent) {
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].PASSPORT_NO;
			}
			//var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].PASSPORT_NO;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[6].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[6].mAggregations.label.mBindingInfos.required.binding.aBindings[0]
				.sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[6].mAggregations.label.mBindingInfos.required.binding.aBindings[
					0]
				.sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
		},

		validateContactEmail: function (oEvent) {
			var eventIndicator = "E";
			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;

			oView.getModel("blankJson").setProperty("/contact/" + parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split(
				"/")[2]) + "/EMAIL", oEvent.getSource().getValue().toLowerCase().trim());

			var isEmailExist = context.checkDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, index);

			if (isEmailExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().EMAIL = null;
				MessageBox.warning("Email Id already exist");
			}

			validations._validateEmail(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].EMAIL;
			}
			// var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].EMAIL;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[7].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[7].mAggregations.label.mBindingInfos.required.binding.aBindings[0]
				.sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[7].mAggregations.label.mBindingInfos.required.binding.aBindings[
					0]
				.sPath.split('/')[1];
			if (!updateId.includes(fieldId)) {
				updateId.push(fieldId);
			}

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._onTableValueChange(oEvent);
		},

		checkDuplicateContacts: function (sValue, seventIndicator, iIndex) {
			var isContactExist = null;
            var b1Data = [].concat(oView.getModel("blankJson").getProperty("/MDContact"), oView.getModel("blankJson").getProperty(
                "/contact"));
            var changeObject = oView.getModel("blankJson").getProperty("/contact")[iIndex - 1];
            if (seventIndicator === "E") {
                isContactExist = b1Data.some(function (obj, currentIndex) {
                    sValue.replaceAll(' ', "");
                    if (currentIndex !== iIndex && obj.EMAIL !== null) {
                        return obj.EMAIL.toLowerCase() === sValue.toLowerCase();
                    }
                });
            } else if (seventIndicator === "C") {
                sValue = changeObject.CONTACT_TELECODE.concat(" ", sValue).replaceAll(' ', "");
                isContactExist = b1Data.some(function (obj, currentIndex) {

                    if (currentIndex !== iIndex && obj.CONTACT_TELECODE !== null && obj.CONTACT_NO !== null) {
                        var contactNum = obj.CONTACT_TELECODE.concat(" ", obj.CONTACT_NO).replaceAll(' ', "");
                        return contactNum === sValue;
                    }
                });
            } else if (seventIndicator === "M") {
                sValue = changeObject.MOBILE_TELECODE.concat(" ", sValue).replaceAll(' ', "");
                isContactExist = b1Data.some(function (obj, currentIndex) {

                    if (currentIndex !== iIndex && obj.MOBILE_TELECODE !== null && obj.MOBILE_NO !== null) {
                        var mobileNum = obj.MOBILE_TELECODE.concat(" ", obj.MOBILE_NO).replaceAll(' ', "");
                        return mobileNum === sValue;
                    }
                });
            } else if (seventIndicator === "N") {
                sValue = changeObject.NAME1.concat(" ", sValue).replaceAll(' ', "");
                isContactExist = b1Data.some(function (obj, currentIndex) {

                    if (currentIndex !== iIndex && obj.NAME1 !== null && obj.NAME2 !== null) {
                        var name = obj.NAME1.concat(" ", obj.NAME2).replaceAll(' ', "");
                        // name = name.replaceAll(' ',"")
                        return name.toLowerCase() === sValue.toLowerCase();
                    }
                });
            }
            return isContactExist;
			
		},

		hocLastNameValidation: function (oEvent) {
			var eventIndicator = "HOCN";

			var isContactNameExist = context.checkHOCDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, 0);

			if (isContactNameExist === true) {
				oView.getModel("blankJson").setProperty("/MDContact/NAME1", null);
				oView.getModel("blankJson").setProperty("/MDContact/NAME2", null);
				MessageBox.warning("First Name and Last Name Combination already exist");
			}
			validations._charactersValidation(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].NAME2;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1] + "_lastname";
			var fieldId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleCountryCodeHOCMobile: function (oEvent) {
			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			var ch_value = "+" + countryCode;
			var org_value = null;
			if (this.Originaldata.DRAFT.CONTACTS[0].MOBILE_TELECODE !== null) {
				org_value = "+" + this.Originaldata.DRAFT.CONTACTS[0].MOBILE_TELECODE;
			}

			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1] + "_telecode";
			var fieldId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			oView.getModel("blankJson").setProperty("/" + sPath, countryCode);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent);
		},

		_validateHOCEmail: function (oEvent) {
			var eventIndicator = "HOCE";
			oView.getModel("blankJson").setProperty("/MDContact/EMAIL", oEvent.getSource().getValue().toLowerCase().trim());
			var isContactEmailExist = context.checkHOCDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, 0);

			if (isContactEmailExist === true) {
				oView.getModel("blankJson").setProperty("/MDContact/EMAIL", null);
				MessageBox.warning("Email already exist");
			}

			validations._validateEmail(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].EMAIL;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent); //komal
		},

		_tableCharactersValidationFirstName: function (oEvent) {
			
			context._onTableValueChange(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].NAME1;
			}
			//	var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].NAME1;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.columns[0].mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.columns[0].mAggregations.label.mBindingInfos.required.binding.aBindings[0]
				.sPath.split('/')[1] + "_" + index;
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.columns[0].mAggregations.label.mBindingInfos.required.binding.aBindings[
					0]
				.sPath.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			validations._charactersValidation(oEvent);
		},

		_validateHOCContactNum: function (oEvent) {
			var eventIndicator = "HOCC";
			var isContactContactExist = context.checkHOCDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, 0);

			if (isContactContactExist === true) {
				oView.getModel("blankJson").setProperty("/MDContact/CONTACT_TELECODE", null);
				oView.getModel("blankJson").setProperty("/MDContact/CONTACT_NO", null);
				MessageBox.warning("Contact Number already exist");
			}

			validations._validateMobileNum(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].CONTACT_NO;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent);
		},

		handleContactNationality: function (oEvent) {
			var ch_value = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].NATIONALITY;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];
			// var sTelecodePath = sPath.replace(sPath.split("/")[sPath.split("/").length - 1], "");
			var sTelecodePath = "/" + sPath.split("/")[1];
			this.readAutoCountryCodeSet(ch_value, sTelecodePath);

			oView.getModel("blankJson").setProperty("/" + sPath, ch_value);
			//	oView.getModel("blankJson").setProperty("/address/COUNTRY_DESC", countryDesc);
			oView.getModel("blankJson").refresh(true);

			//read ragion, postal code length and postal code format 17/10/2022
			this.readRegionSet(ch_value, "CH");
			this.readPostalCodeLength(ch_value, "CH");

			this.readPostalCodeFormats(ch_value, "CH");

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		handleMDContactRegion: function (oEvent) {
			var ch_value = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].STATE;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			oView.getModel("blankJson").setProperty("/" + sPath, ch_value);
			oView.getModel("blankJson").refresh(true);

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		_validateHOCMobileNum: function (oEvent) {
			var eventIndicator = "HOCM";
			var isContactMobileExist = context.checkHOCDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, 0);

			if (isContactMobileExist === true) {
				oView.getModel("blankJson").setProperty("/MDContact/MOBILE_TELECODE", null);
				oView.getModel("blankJson").setProperty("/MDContact/MOBILE_NO", null);
				MessageBox.warning("Mobile Number already exist");
			}

			validations._validateMobileNum(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.CONTACTS[0].MOBILE_NO;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);
		},

		checkHOCDuplicateContacts: function (sValue, sEventInd, iIndex) {
			var isHOCContactExist = null;
			var b1Data = oView.getModel("blankJson").getProperty("/contact");
			var changeObject = oView.getModel("blankJson").getProperty("/MDContact");
			if (changeObject > 0) {
				if (sEventInd === "HOCN") {
					sValue = changeObject.NAME1.concat(" ", sValue);
					isHOCContactExist = b1Data.some(function (obj) {
						if (obj.NAME1 !== null && obj.NAME2 !== null) {
							var name = obj.NAME1.concat(" ", obj.NAME2);
							return name.toLowerCase() === sValue.toLowerCase();
						}
					});
				} else if (sEventInd === "HOCE") {
					isHOCContactExist = b1Data.some(function (obj) {
						if (obj.EMAIL !== null) {
							return obj.EMAIL.toLowerCase() === sValue.toLowerCase();
						}
					});
				} else if (sEventInd === "HOCC") {
					sValue = changeObject.CONTACT_TELECODE.concat(" ", sValue);
					isHOCContactExist = b1Data.some(function (obj) {
						if (obj.CONTACT_TELECODE !== null && obj.CONTACT_NO !== null) {
							var contactNum = obj.CONTACT_TELECODE.concat(" ", obj.CONTACT_NO);
							return contactNum === sValue;
						}
					});
				} else if (sEventInd === "HOCM") {
					sValue = changeObject.MOBILE_TELECODE.concat(" ", sValue);
					isHOCContactExist = b1Data.some(function (obj) {
						if (obj.MOBILE_TELECODE !== null && obj.MOBILE_NO !== null) {
							var mobileNum = obj.MOBILE_TELECODE.concat(" ", obj.MOBILE_NO);
							return mobileNum === sValue;
						}
					});
				}
			}
			return isHOCContactExist;
		},

		handleTableContactCode: function (oEvent) {
			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/CONTACT_TELECODE", countryCode);
			oView.getModel("blankJson").refresh(true);

			var ch_value = "+" + oEvent.getSource().getSelectedKey();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined || this.Originaldata.DRAFT.CONTACTS[org_index].length === 0) {
				var org_value = null;
			} else {
				var org_value = "+" + this.Originaldata.DRAFT.CONTACTS[org_index].CONTACT_TELECODE;
			}
			// var org_value = "+" + this.Originaldata.DRAFT.CONTACTS[org_index].CONTACT_TELECODE;
			var index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.cells[8].oParent.oParent.mAggregations.columns[8].
			mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.cells[8].oParent.oParent.mAggregations.columns[8].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1] + "_" + index + "telecode";

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.getCountryCodeId(oEvent);
		},

		hboxcontactNumberValidation: function (oEvent) {
			var eventInd = "C";
			var sObject = oEvent.getSource().getBindingContext("blankJson").getObject();
			if (sObject.CONTACT_TELECODE === null || sObject.CONTACT_TELECODE === "") {
				oEvent.getSource().setValue(null);
				MessageBox.warning("Select Country Code");
				return;
			}
			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;
			var isContactNumExist = context.checkDuplicateContacts(oEvent.getSource().getValue(), eventInd, index);
			if (isContactNumExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().CONTACT_TELECODE = null;
				oEvent.getSource().getBindingContext("blankJson").getObject().CONTACT_NO = null;
				MessageBox.warning("Contact Number already exist");
			}
			validations._validateMobileNum(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].CONTACT_NO;
			}
			//	var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].CONTACT_NO;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]);
			var label = oEvent.getSource().oParent.oParent.mAggregations.cells[5].oParent.oParent.mAggregations.columns[8].
			mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.cells[5].oParent.oParent.mAggregations.columns[8].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1] + "_" + index + "contactNo";
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.cells[5].oParent.oParent.mAggregations.columns[8].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onTableHboxValueChange(oEvent);
		},

		onTableHboxValueChange: function (oEvent) {
			if (loginData.REQUEST_TYPE === 5) {
				var model, property, index = null,
					dataIndex = null,
					val;

				var totalcell = oEvent.getSource().oParent.oParent.mAggregations.cells;

				var sId = oEvent.getSource().getId();
				for (var i = 0; i < totalcell.length; i++) {
					if (totalcell[i].mAggregations.items !== undefined) {
						if (sId === totalcell[i].mAggregations.items[1].sId) {
							index = i;
							break;
						}
					}
				}
				if (oEvent.getId() === "change") {
					model = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[1];
					dataIndex = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[2]);
					property = oEvent.getSource().mBindingInfos.value.binding.sPath;
					val = oEvent.getSource().getValue();
				} else if (oEvent.getId() === "selectionChange") {
					model = oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split("/")[1];
					dataIndex = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split("/")[2]);
					property = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
					val = oEvent.getSource().getSelectedKey();
				}
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var id = oEvent.getSource().oParent.oParent.mAggregations.cells[index].oParent.oParent.mAggregations.columns[index].
				mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1];
				if (headData[dataIndex][property] !== val) {
					if (!updateId.includes(id)) {
						updateId.push(id);
					}
				} else {
					var index = updateId.indexOf(id);
					delete updateId[index];
				}
			}
		},

		tableContactCountryCode: function (oEvent) {
			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/MOBILE_TELECODE", countryCode);
			oView.getModel("blankJson").refresh(true);

			var ch_value = "+" + oEvent.getSource().getSelectedKey();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined || this.Originaldata.DRAFT.CONTACTS[org_index].length === 0) {
				var org_value = null;
			} else {
				var org_value = "+" + this.Originaldata.DRAFT.CONTACTS[org_index].MOBILE_TELECODE;
			}
			//	var org_value = "+" + this.Originaldata.DRAFT.CONTACTS[org_index].MOBILE_TELECODE;
			var index = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.cells[9].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.cells[9].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1] + "_" + index + "telecode";

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.getCountryCodeId(oEvent);
		},

		hboxMobileNumberValidation: function (oEvent) {
			var eventInd = "M";
			var sObject = oEvent.getSource().getBindingContext("blankJson").getObject();
			if (sObject.MOBILE_TELECODE === null || sObject.MOBILE_TELECODE === "") {
				oEvent.getSource().setValue(null);
				MessageBox.warning("Select Country Code");
				return;
			}

			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;
			var isContactNumExist = context.checkDuplicateContacts(oEvent.getSource().getValue(), eventInd, index);
			if (isContactNumExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().MOBILE_TELECODE = null;
				oEvent.getSource().getBindingContext("blankJson").getObject().MOBILE_NO = null;
				MessageBox.warning("Mobile Number already exist");
			}
			validations._validateMobileNum(oEvent);

			var ch_value = oEvent.getSource().getValue();
			var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			//	var org_index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			if (this.Originaldata.DRAFT.CONTACTS[org_index] === undefined) {
				var org_value = null;
			} else {
				var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].CONTACT_NO;
			}
			// var org_value = this.Originaldata.DRAFT.CONTACTS[org_index].CONTACT_NO;
			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split('/')[2]) + 1;
			var label = oEvent.getSource().oParent.oParent.mAggregations.cells[6].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().oParent.oParent.mAggregations.cells[6].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1] + "_" + index + "mobileNo";
			var fieldId = oEvent.getSource().oParent.oParent.mAggregations.cells[6].oParent.oParent.mAggregations.columns[9].
			mAggregations.label.mBindingInfos.required.parts[0].path.split("/")[1];
			if (!updateId.includes(fieldId)) {
				updateId.push(fieldId);
			}

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onTableHboxValueChange(oEvent);
		},

		_mTableNumberValidationNO_OF_EMP: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].TOT_PERM_EMP;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},
		_mTableNumberValidationNO_OF_AC: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NOE_ACC;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidationNO_OF_ENGG: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NO_OF_ENGG;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidationNO_OF_QUALITY: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NOE_QA;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidationNO_OF_PROD: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NOE_MAN;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidationNO_OF_ADMIN: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NOE_ADM;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidationNO_OF_OTHERS: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NOE_ANY;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidationNO_OF_HR: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NOE_HR;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidationNO_OF_SALES: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NOE_SAL;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidationNO_OF_SECURITY: function (oEvent) {
			validations._numberValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].NOE_SEC;
			if(typeof(org_value) === 'number'){
				org_value = org_value.toString();
			}
			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var Id = oEvent.getSource().oParent.mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context._oNmTableValueChange(oEvent); //komal
		},

		_mTableNumberValidation: function (oEvent) { //komal
			validations._numberValidation(oEvent);

			context._oNmTableValueChange(oEvent); //komal
		},

		tradeLicenseValidation: function (oEvent) {
			validations.tradeLicenseValidation(oEvent);
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].TRADE_LIC_NO;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1] + "_TLNo.";
			var fieldId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onChange(oEvent); //komal
		},

		_oNmTableValueChange: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property;
				model = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1];
				property = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[2];
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				if (headData[property] !== oEvent.getSource().getValue()) {
					if (!updateId.includes(oEvent.getSource().getParent().mBindingInfos.visible.parts[0].path.split("/")[1])) {
						updateId.push(oEvent.getSource().getParent().mBindingInfos.visible.parts[0].path.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().getParent().mBindingInfos.visible.parts[0].path.split("/")[1]);
					delete updateId[index];
				}
			}
		},

		handleTradeLiceneceDate: function (oEvent) {
			var tradeDate = oEvent.getSource().getDateValue().getTime() + 86400000;
			oView.getModel("blankJson").setProperty("/headerData/TRADE_LIC_NO_DATE", new Date(tradeDate));

			// oView.getModel("G7Json").getData()[0].EXPIRY_DATE = new Date(tradeDate);
			// oView.getModel("G7Json").refresh(true);
			oView.getModel("blankJson").refresh(true);

			var date = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});

			//	var ch_value = new Date(tradeDate).getDate() - 1 + "." + (new Date(tradeDate).getMonth() + 1) + "." + new Date(tradeDate).getFullYear();
			var ch_value = date.format(oEvent.getSource().getDateValue());
			if (this.Originaldata.DRAFT.MAIN[0].TRADE_LIC_NO_DATE === null || this.Originaldata.DRAFT.MAIN[0].TRADE_LIC_NO_DATE === "" ||
				this.Originaldata.DRAFT.MAIN[0].TRADE_LIC_NO_DATE === undefined) {
				var org_value = null;
			} else {
				var org_value = date.format(new Date(this.Originaldata.DRAFT.MAIN[0].TRADE_LIC_NO_DATE));
			}
			// var org_value = date.format(new Date(this.Originaldata.DRAFT.MAIN[0].TRADE_LIC_NO_DATE));
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1] + "_expirydate";
			var fieldId = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			//	context.onChange(oEvent);
			// var vatDate = oView.byId("vatDate").getDateValue().getTime() + 86400000;
			// headerArray[0].VAT_REG_DATE = new Date(vatDate);
		},

		handleEstablishmentDate: function (oEvent) {
			this.setFinancialModel(oEvent.getSource().getValue());
			var ch_value = oEvent.getSource().getValue();
			var org_value = this.Originaldata.DRAFT.MAIN[0].ESTAB_YEAR;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			context.onChange(oEvent);

		},

		supplierCategorySelectionFinish: function (oEvent) {
			supplierCategoryKeys = "";
			var selectedItems = oEvent.getParameter("selectedItems");
			for (var i = 0; i < selectedItems.length; i++) {
				if (i === selectedItems.length - 1) {
					supplierCategoryKeys = supplierCategoryKeys.concat(selectedItems[i].getKey());
					supplierCategoryText = supplierCategoryText.concat(selectedItems[i].getText());
				} else {
					supplierCategoryKeys = supplierCategoryKeys.concat(selectedItems[i].getKey() + ",");
					supplierCategoryText = supplierCategoryText.concat(selectedItems[i].getText() + ",");
				}
			}

			var ch_value = supplierCategoryText;
			var org_value = this.Originaldata.DRAFT.MAIN[0].SUPPL_CATEGORY_DESC;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");
			this.onChange(oEvent);
		},

		handleBusinessType: function (oEvent) {
			var selected = oEvent.getSource().getSelectedButton().getText();
			oView.getModel("blankJson").setProperty("/headerData/BUSINESS_TYPE", selected);
			oView.getModel("blankJson").refresh(true);

			var ch_value = selected;
			var org_value = this.Originaldata.DRAFT.MAIN[0].BUSINESS_TYPE;
			var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
			var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

			this._logDataCondition(Id, label, ch_value, "", org_value, "");

			context.onRadioChange(oEvent); //komal
		},

		onRadioChange: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property;
				model = oEvent.getSource().mBindingInfos.selectedIndex.binding.sPath.split("/")[1];
				property = oEvent.getSource().mBindingInfos.selectedIndex.binding.sPath.split("/")[2];
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				if (headData[property] !== oEvent.getSource().getSelectedButton().getText()) {
					if (!updateId.includes(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1])) {
						updateId.push(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					delete updateId[index];
				}
			}
		},

		secondaryEmailsValidation: function (headerArray) {
			var sEmails = [];
			var sec_emails = "";
			var sObject = {}
			var tokens = oView.byId("multiInput1").getTokens();
			if (tokens.length > 0) {
				for (var a = 0; a < tokens.length; a++) {
					var isEmail =
						/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						.test(tokens[a].mProperties.key.trim());

					if (isEmail === false) {
						sEmails.push(tokens[a].mProperties.key);
					} else if (a === tokens.length - 1) {
						sec_emails = sec_emails.concat(tokens[a].mProperties.key);
					} else {
						sec_emails = sec_emails.concat(tokens[a].mProperties.key + ";");
					}

				}
			}

			sObject.sEmails = sEmails;
			sObject.sec_emails = sec_emails;

			return sObject;
		},

		getHeaderData: function (data) {
			// var oTradeLicCheck,dateFormat;

			// oTradeLicCheck = data.headerData.TRADE_LIC_NO_DATE;

			// if(oTradeLicCheck !== null){
			// dateFormat = new Date(data.headerData.TRADE_LIC_NO_DATE).toISOString().split('T')[0];
			// }
			// else if(oTradeLicCheck === null){
			// 	dateFormat = null;
			// }
			// var LAST_UPDATED_ON = dateFormat.toISOString().split('T')[0];
			var headerData = [{
				 "REQUEST_NO":loginData.REG_NO,
				//  "SAP_VENDOR_NO": loginData.SAP_VENDOR_CODE,
				 "IDEAL_DIST_CODE": JSON.stringify(loginData.IDEAL_DIST_CODE),
				"STATUS": loginData.STATUS,
				"APPROVER_LEVEL": loginData.APPROVER_LEVEL,
				// "APPROVER_ROLE": loginData.APPROVER_ROLE,
				// "NEXT_APPROVER": loginData.NEXT_APPROVER,
				"SAP_DIST_CODE": loginData.SAP_DIST_CODE || null,
				"REGISTERED_ID": loginData.VEMAIL,
				"SECONDARY_EMAILS_ID": data.headerData.SECONDARY_EMAILS_ID || null,
				"ENTITY_CODE": loginData.ENTITY_CODE || null,
				"REQUEST_TYPE": parseInt(loginData.REQUEST_TYPE, 10),
				"OT_PARENT_ID": data.headerData.OT_PARENT_ID || null,
				"REQUEST_RESENT": data.headerData.REQUEST_RESENT || null,
				"DIST_NAME1": data.headerData.DIST_NAME1 || null,
				"DIST_NAME2": data.headerData.DIST_NAME2 || null,
				"WEBSITE": data.headerData.WEBSITE || null,
				"NDA_TYPE":data.headerData.NDA_TYPE,
				"REMINDER_COUNT":data.headerData.REMINDER_COUNT,
				"BUYER_ASSIGN_CHECK":data.headerData.BUYER_ASSIGN_CHECK,
				"CREATED_ON":data.headerData.CREATED_ON,
				"COMMENT":data.headerData.COMMENT,
				"LEGACY_ID":data.headerData.LEGACY_ID,
				// "LEGAL_STRUCTURE": oView.byId("S1G3T1F1").getSelectedKey() || null,
				// "LEGAL_STRUCTURE_OTHER": "",

				"ORG_ESTAB_YEAR": data.headerData.ORG_ESTAB_YEAR || null,
				"TOT_PERM_EMP": parseInt(data.headerData.TOT_PERM_EMP, 10) || null,
				"TOT_TEMP_EMP": parseInt(data.headerData.TOT_TEMP_EMP, 10) || null,
				"NOE_ACC": parseInt(data.headerData.NOE_ACC, 10) || null,
				"NOE_QA": parseInt(data.headerData.NOE_QA, 10) || null,
				"NOE_MAN": parseInt(data.headerData.NOE_MAN, 10) || null,
				"NOE_ADM": parseInt(data.headerData.NOE_ADM, 10) || null,
				"NOE_ANY": parseInt(data.headerData.NOE_ANY, 10) || null,
				"NOE_HR": parseInt(data.headerData.NOE_HR, 10) || null,
				"NOE_SAL": parseInt(data.headerData.NOE_SAL, 10) || null,
				"NOE_SEC": parseInt(data.headerData.NOE_SEC, 10) || null,

				// "BUSINESS_TYPE": data.headerData.BUSINESS_TYPE || null,
				"LIC_NO": data.headerData.TRADE_LIC_NO || null,

				"BP_TYPE_CODE": loginData.LOGINDATA_BP_TYPE_CODE || null,
				"BP_TYPE_DESC": loginData.BP_TYPE_DESC || null,

				"PROPOSAL_DATE": data.headerData.PROPOSAL_DATE || null,
				// "SUPPL_CATEGORY_DESC": data.headerData.SUPPL_CATEGORY_DESC || null,
				// "SUPPL_TYPE": loginData.SUPPLIERTYPE_CODE || null,
				// "SUPPL_TYPE_DESC": loginData.SUPPLIER_TYPE_DESC || null,
				// "ACTIVITY_TYPE": null,

				"COMPLETED_BY": data.headerData.COMPLETED_BY || null,
				"COMPLETED_BY_POSITION": data.headerData.COMPLETED_BY_POSITION || null,
				// "TOTAL_PROD_CAPACITY": null,
				"ACK_VALIDATION": data.headerData.ACK_VALIDATION || null,
				"CREATION_TYPE": loginData.CREATION_TYPE,
				"IDEAL_DIST_CODE": loginData.IDEAL_DIST_CODE,
				"REQUESTER_ID": loginData.CREATED_BY || null,
				//"SUBMISSION_DATE": loginData.SUBMISSION_DATE, //commented by pranay 17-10-2022
				"SUBMISSION_DATE": data.headerData.SUBMISSION_DATE || null,
				"LAST_UPDATED_ON": data.headerData.LAST_UPDATED_ON,
				"LAST_SAVED_STEP": loginData.LAST_SAVED_STEP,

				// "ORDER_SIZE_MIN": data.headerData.ORDER_SIZE_MIN || null,
				// "ORDER_SIZE_MAX": data.headerData.ORDER_SIZE_MAX || null,
				"MDG_CR_NO": null,
				"LIC_NO_DATE": data.headerData.LIC_NO_DATE || null,
				"VAT_REG_NUMBER": data.headerData.VAT_REG_NUMBER || null,
				"VAT_REG_DATE": data.headerData.VAT_REG_DATE || null,
				"OT_FOLDER1_ID": data.headerData.OT_FOLDER1_ID || null,
				"OT_FOLDER2_ID": data.headerData.OT_FOLDER2_ID || null,
				"OT_FOLDER3_ID": data.headerData.OT_FOLDER3_ID || null,
				"OT_FOLDER4_ID": data.headerData.OT_FOLDER4_ID || null,
				"LAST_ACTIVE_REQ_NO": data.headerData.LAST_ACTIVE_REQ_NO || null,
				"MOBILE_NO" : data.headerData.MOBILE_NO || null,
				"DIST_CODE" : data.headerData.DIST_CODE || null
				// "ICV_SCORE": data.headerData.ICV_SCORE || null,
				// "ICV_DATE": data.headerData.ICV_DATE || null,
				// "ICV_CHECK": data.headerData.ICV_CHECK || null

			}];
			return headerData;
		},

		createMessagePopover: function () {
			var that = this;
			this.oMP = new MessagePopover({
				activeTitlePress: function (oEvent) {
					var oItem = oEvent.getParameter("item").getProperty("key");
					context.getView().byId("ObjectPageLayout").setSelectedSection(context.getView().byId(oItem));
				
				},
				items: {
					path: "checkFieldsJson>/",
					template: new MessageItem({
						title: "{checkFieldsJson>description}",
						activeTitle: true,
						subtitle: "{checkFieldsJson>subtitle}",
						type: "{checkFieldsJson>type}",
						key: "{checkFieldsJson>subsection}"

					})
				},
				groupItems: true
			});
			this.getView().byId("messagePopoverBtn").addDependent(this.oMP);
		},

		handleMessagePopoverPress: function (oEvent) {
			if (!this.oMP) {
				this.createMessagePopover();
			}
			this.oMP.toggle(oEvent.getSource());
		},

		validateForm: function (checkFields) {
			if (checkFields.length > 0) {
				var checkFieldsJson = new JSONModel();
				checkFieldsJson.setData(checkFields);
				oView.setModel(checkFieldsJson, "checkFieldsJson");
				
				oView.setModel(this._MessageManager,"message");
				//	this.getView().byId("wizardContentPage").setShowFooter(true);

				var oButton = this.getView().byId("messagePopoverBtn");
				oButton.setVisible(true);
				setTimeout(function () {
					this.oMP.openBy(oButton);
				}.bind(this), 50);
				this.createMessagePopover();

			} else {
				this.getView().byId("messagePopoverBtn").setVisible(false);
				//	this.getView().byId("wizardContentPage").setShowFooter(true);

			}
		},

		ajaxCall: function (path, payload) {
			
			var that = this;
			var data = JSON.stringify(payload);

			// jQuery.sap.delayedCall(300, this, function () {
			// 	BusyIndicator.show();
			$.ajax({
				url: path,
				type: 'POST',
				data: data,
				contentType: 'application/json',
				async: false,
				success: function (oData, response) {
					BusyIndicator.hide();
					context.closeDialog();
					// var resposeObj = JSON.parse(oData.value);
					// if (payload.VALUE.STEP_NO === 6) {
						MessageBox.success(oData.value[0].Message +" for "+ oData.value[0].REQUEST_NO, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
									logData = [];
									context.onBack();
								}

							}
						});

					// } else {
					// 	
					// 	//	MessageToast.show(resposeObj.Message);
					// 	MessageBox.success(resposeObj.Message, {
					// 		actions: [MessageBox.Action.OK],
					// 		onClose: function (oAction) {
					// 			if (oAction === "OK") {
					// 				//	context.closeDialog();
					// 				context.onBack();
					// 			}

					// 		}
					// 	});
					// }
				},
				error: function (error) {
					context.closeDialog();
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
		// });
		},

		removeMetadata: function (data) {
			for (var i = 0; i < data.otherAddress.length; i++) {
				// if (data.otherAddress[i].deleteInd === "" || data.otherAddress[i].deleteInd === "X") {
				// 	delete data.otherAddress[i].deleteInd;
				// }
				if (data.otherAddress[i].REQUEST_NO) {
					delete data.otherAddress[i].REQUEST_NO;
					delete data.otherAddress[i].SR_NO;
				}
			}

			for (var j = 0; j < data.contact.length; j++) {
				// if (data.contact[j].deleteInd === "" || data.contact[j].deleteInd === "X") {
				// 	delete data.contact[j].deleteInd;
				// }
				if (data.contact[j].REQUEST_NO) {
					//	delete data.contact[j].__metadata;
					delete data.contact[j].REQUEST_NO;
					delete data.contact[j].SR_NO;
				}
			}

		},

		setTableDataEmpty: function (sectionNo, visibleModel, data) {
			if (sectionNo === 1) {
				if (visibleModel.S1G2T2F1 !== "X") data.contact = [];
			}
		},

		concatAddressContactData: function (data) {
			var addressAndContact = {};
			var address = [],
				contact = [];
			if (data.address.COUNTRY_DESC) {
				delete data.address.COUNTRY_DESC;
			}
			if (data.address.REGION_DESC) {
				delete data.address.REGION_DESC;
			}

			if (data.address.EMAIL !== null) {
				data.address.EMAIL = data.address.EMAIL.toLowerCase();
			}

			address.push.apply(address, [data.address]);
			if (vModel.S1G3T1F1 === "X") {
				address.push.apply(address, data.otherAddress);
			}
			if (vModel.S1G4T1F10 === "X") {
				contact.push.apply(contact, [data.MDContact]);
			}

			// for (var i = 0; i < data.contact.length; i++) { 
			// 	if (data.contact[i].NAME1 !== null && data.contact[i].NAME2 !== null && data.contact[i].NATIONALITY !== null &&
			// 		data.contact[i].CITY !== null && data.contact[i].DESIGNATION !== null && data.contact[i].EMAIL !== null) {
			// 		contact.push(data.contact[i]);
			// 	}
			// }
			for (var i = 0; i < data.contact.length; i++) {
				if (loginData.CREATION_TYPE === 3) {
					if (data.contact[i].NAME1 !== null && data.contact[i].NAME2 !== null) {
						contact.push(data.contact[i]);
					}
				} else {
					contact.push(data.contact[i]);
				}
			}
			//contact.push.apply(contact, data.contact);

			addressAndContact.address = address;
			addressAndContact.contact = contact;

			return addressAndContact;

		},

		removeCountryRegionDesc: function (addressArr) {
			var contactAddressObj = {};
			var returnArr = [];
			var address = [];
			var contact = [];
			if (addressArr.address.length > 0) {
				var obj = null;
				address = Object.keys(addressArr.address).map(function (key) {
					obj = Object.assign({}, addressArr.address[key]);
					if (obj.COUNTRY_DESC || obj.COUNTRY_DESC === null || obj.COUNTRY_DESC === "") {
						delete obj.COUNTRY_DESC;
					}
					if (obj.REGION_DESC || obj.REGION_DESC === null || obj.REGION_DESC === "") {
						delete obj.REGION_DESC;
					}

					return obj;
				});
			}

			//removing Country description and region description from contact details
			if (addressArr.contact.length > 0) {
				var obj1 = null;
				contact = Object.keys(addressArr.contact).map(function (key) {
					obj1 = Object.assign({}, addressArr.contact[key]);
					if (obj1.COUNTRY_DESC || obj1.COUNTRY_DESC === null || obj1.COUNTRY_DESC === "") {
						delete obj1.COUNTRY_DESC;
					}
					if (obj1.REGION_DESC || obj1.REGION_DESC === null || obj1.REGION_DESC === "") {
						delete obj1.REGION_DESC;
					}

					return obj1;
				});
			}

			contactAddressObj.address = address;
			contactAddressObj.contact = contact;

			return contactAddressObj;
		},

		draftinPayload: function (headerData, address, contactDetails, bankDetails,finInfo,OwnerInfo,productInfo, capacityData, customerInfo
			, discFields,discRelative, discQa, attachmentField,attachmentData,
			section, updatedFields, logData, comment, ndastatus, ndaAttachArray, SRNO, delattachcode,promoterData,businessData,bankingDetails) {
				var that = this;
				var obj = {};
				var Lic_Date = new Date(headerData[0].LIC_NO_DATE);
				// var formattedDate = Lic_Date.toISOString().split('T')[0];
				var evtData = {
					"USER_ID":"darshan.l@intellectbizware.com",
					"USER_NAME":"Darshan lad"
				}; 
				var eventsData = [];
				eventsData.push(evtData);
			var payload = {
				    "action": "INTERNAL_REQUEST",
					"stepNo": 5,
					// section,
					"comment": comment,
					"srNo":SRNO,
					"attachCode": delattachcode,
					"ndaStatus": ndastatus,
					"reqHeader": headerData,
					"addressData":address,

					"contactsData":contactDetails,

					"bankData":bankDetails,
					"bankingDetails":bankingDetails,
					"promotersData":promoterData,
					"businessHistoryData":businessData,
					// "financeData":finInfo,
					// "ownersData":OwnerInfo,
					// "prodServData": productInfo,
					// "capacityData":capacityData,
					"customerData": customerInfo,
					// "oemData": [{
					// 	"REQUEST_NO": loginData.REG_NO,
					// 	"SR_NO": 1,
					// 	"OEM_TYPE": "AB"
					// }],
					// "discFieldsData":discFields,
					// "discRelativesData": discRelative,
					// "discQaCertiData":discQa,
					"attachmentFieldsData":attachmentField || null,
					"attachmentData": attachmentData,
									
					"updatedFields":updatedFields,
					"eventsData":eventsData,
					"supplierLogData":logData,
					"userDetails" : {
						"USER_ROLE": that.getOwnerComponent().getModel("userDetailsModel").getData().USER_ROLE,
						"USER_ID": that.getOwnerComponent().getModel("userDetailsModel").getData().EMAIL
					}
			};
			if (loginData.REQUEST_TYPE === 5) {
				payload.updatedFields = updatedFields;
			}
			if (loginData.STATUS === 7) {
				payload.MAIN[0].REQUEST_RESENT = "X";
			}

			return payload;
		},

		//Financial Information logics added by pranay 20-10-2022
		// readSwiftCode: function (sCountry, sIndicator) {
		// 	var cFilter = new sap.ui.model.Filter("Banks", sap.ui.model.FilterOperator.EQ, sCountry);
		// 	context.oDataModel.read("/GetSwiftCodeSet", {
		// 		filters: [cFilter],
		// 		success: function (oData, responce) {
		// 			var otherSwiftCode = {
		// 				"Banks": "OTHER",
		// 				"SWIFT": "OTHER"
		// 			};
		// 			oData.results.unshift(otherSwiftCode);

		// 			if (sIndicator === "P") {
		// 				var primarySwiftJson = new JSONModel();
		// 				primarySwiftJson.setData(oData);
		// 				primarySwiftJson.setSizeLimit(oData.results.length); //06-10-2022
		// 				oView.setModel(primarySwiftJson, "primarySwiftJson");
		// 			} else {
		// 				var swiftJson = new JSONModel();
		// 				swiftJson.setData(oData);
		// 				swiftJson.setSizeLimit(oData.results.length);
		// 				oView.setModel(swiftJson, "swiftJson");
		// 			}
		// 		},
		// 		error: function (error) {
		// 			var oXML = JSON.parse(error.responseText);
		// 			var oXMLMsg = oXML.error["message"];
		// 			MessageBox.error(oXMLMsg);

		// 		}
		// 	});
		// },

		// handleSwiftCode: function (oEvent) {
		// 	var swiftCode = oEvent.getSource().getSelectedKey();

		// 	if (swiftCode === "OTHER") {
		// 		MessageBox.warning("Please selecte valid swift code", {
		// 			actions: [MessageBox.Action.OK],
		// 			onClose: function (oAction) {
		// 				if (oAction === "OK") {
		// 					context.getView().byId("S2G1T1F6").setSelectedKey(null);
		// 				}
		// 			}
		// 		});
		// 		return;
		// 	}

		// 	var bCountry = oView.getModel("blankJson").getProperty("/bankDetails").BANK_COUNTRY;
		// 	var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
		// 	oView.getModel("blankJson").setProperty("/" + sPath, swiftCode);
		// 	oView.getModel("blankJson").refresh(true);

		// 	if (swiftCode === "OTHER") oView.byId("NSCId").setVisible(true);
		// 	else oView.byId("NSCId").setVisible(false);

		// 	oView.getModel("blankJson").setProperty("/bankDetails/BIC_CODE", null);
		// 	//20/21
		// 	this.getBankDetails(bCountry, swiftCode, "PRI", 0, "", "");

		// 	var org_swiftCode = this.Originaldata.DRAFT.PAYMENT[0].SWIFT_CODE;
		// 	var label = oEvent.getSource().oParent.mAggregations.label.mProperties.text;
		// 	//	var flag;
		// 	var Id = oEvent.getSource().mBindingInfos.visible.parts[0].path.split('/')[1];

		// 	this._logDataCondition(Id, label, swiftCode, "", org_swiftCode, "");

		// 	context.onChange(oEvent);
		// },

		// openSwiftCodeDialog: function (oEvent) {
		// 	this.otherSwift = oEvent.getSource();

		// 	var index = parseInt(this.otherSwift.getBindingContext("blankJson").getPath().split("/")[2]);
		// 	var country = this.getView().getModel("blankJson").getProperty("/otherBankDetails")[index].BANK_COUNTRY;

		// 	if (country === null || country === "") {
		// 		MessageBox.information("Please Select Bank Country");
		// 		return;
		// 	}
		// 	this.readSwiftCode(country, "S");

		// 	if (!this.otherSwiftCode) {
		// 		this.otherSwiftCode = new sap.ui.xmlfragment("com.ibspl.iven.ivenvendorprofile.view.fragments.otherSwiftCode",
		// 			this);
		// 		this.getView().addDependent(this.otherSwiftCode);
		// 	}
		// 	this.onTableValueSwiftCodeChange(oEvent);
		// 	this.otherSwiftCode.open();
		// },

		// handleOtherSwiftCode: function (oEvent) {
		// 	var rows = oView.byId("bankTableId").getRows();
		// 	var index = parseInt(this.otherSwift.getBindingContext("blankJson").getPath().split("/")[2]);
		// 	var selectedObj = this.getView().getModel("blankJson").getProperty("/otherBankDetails");

		// 	var swiftCode = oEvent.getSource().getSelectedItem().getBindingContext("swiftJson").getObject().SWIFT;
		// 	//swift code
		// 	if (swiftCode === "OTHER") {
		// 		rows[index].getCells()[2].setEditable(true);
		// 	} else {
		// 		rows[index].getCells()[2].setEditable(false);
		// 	}

		// 	if (swiftCode === "OTHER") {
		// 		MessageBox.warning("Please selecte valid swift code", {
		// 			actions: [MessageBox.Action.OK],
		// 			onClose: function (oAction) {
		// 				if (oAction === "OK") {
		// 					oEvent.getSource().getSelectedItem().getBindingContext("swiftJson").getObject().SWIFT_CODE = null;	
		// 				}
		// 			}
		// 		});
		// 		return;
		// 	}

		// 	selectedObj[index].SWIFT_CODE = swiftCode;
		// 	selectedObj[index].BIC_CODE = null;
		// 	oView.getModel("blankJson").refresh(true);
		// 	sap.ui.getCore().byId("swiftSrchId").setValue("");
		// 	this.otherSwiftCode.close();
		// 	this.getBankDetails(selectedObj[index].BANK_COUNTRY, swiftCode, "OTH", index, "", "");

		// 	this._logDataCondition(this.othSwift_Id, this.othSwift_label, swiftCode, "", this.OTHSwiftOrg_value, "");
		// },

		// closeOtherSwiftCodeDialog: function (oEvent) {
		// 	this.otherSwiftCode.close();
		// },

		// otherSwiftCodeSearch: function (oEvent) {
		// 	var sQuery = oEvent.getSource().getValue();
		// 	var pFilter = [];
		// 	if (sQuery) {
		// 		pFilter.push(new Filter("SWIFT", sap.ui.model.FilterOperator.Contains, sQuery));
		// 	}
		// 	var listItem = sap.ui.getCore().byId("oSwift_Id");
		// 	var item = listItem.getBinding("items");
		// 	item.filter(pFilter);
		// },

		// getBankDetails: function (sCountry, sSwiftCode, sType, iIndex, branchName, sBankName) {
		// 	var bFilter = new sap.ui.model.Filter("Banks", sap.ui.model.FilterOperator.EQ, sCountry);
		// 	var cFilter = new sap.ui.model.Filter("Swift", sap.ui.model.FilterOperator.EQ, sSwiftCode);
		// 	context.oDataModel.read("/GetBankDetailSet", {
		// 		filters: [bFilter, cFilter],
		// 		success: function (oData, responce) {

		// 			if (sType === "PRI") {
		// 				if (sSwiftCode === "OTHER") {
		// 					oView.getModel("blankJson").setProperty("/bankDetails/NAME", sBankName);
		// 					oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", branchName);
		// 					oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", null);
		// 					oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", null);
		// 				} else {
		// 					oView.getModel("blankJson").setProperty("/bankDetails/NAME", oData.results[0].Banka);
		// 					oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", oData.results[0].Brnch);
		// 					oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", oData.results[0].Bankl);
		// 					oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", oData.results[0].Bnklz);
		// 					if (oData.results[0].Brnch === "") {
		// 						oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", branchName);
		// 					}
		// 				}

		// 			} else if (sType === "OTH") {
		// 				if (sSwiftCode === "OTHER") {
		// 					oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/NAME", sBankName);
		// 					oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", branchName);
		// 					oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_KEY", null);
		// 					oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_NO", null);
		// 				} else {
		// 					oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/NAME", oData.results[0].Banka);
		// 					oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", oData.results[0].Brnch);
		// 					oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_KEY", oData.results[0].Bankl);
		// 					oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_NO", oData.results[0].Bnklz);

		// 					if (oData.results[0].Brnch === "") {
		// 						oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", branchName);
		// 					}
		// 				}
		// 			}
		// 		},
		// 		error: function (error) {
		// 			var oXML = JSON.parse(error.responseText);
		// 			var oXMLMsg = oXML.error["message"];
		// 			MessageBox.error(oXMLMsg);

		// 		}
		// 	});
		// },

		// removeBankCountryDesc: function (bankData) {
		// 	var returnBankArr = [];
		// 	if (bankData.length > 0) {
		// 		var object = null;
		// 		returnBankArr = Object.keys(bankData).map(function (key) {
		// 			object = Object.assign({}, bankData[key]);

		// 			if (object.COUNTRY_DESC || object.COUNTRY_DESC === null || object.COUNTRY_DESC === "") {
		// 				delete object.COUNTRY_DESC;
		// 			}

		// 			return object;
		// 		});
		// 	}

		// 	return returnBankArr;
		// },

		// getBankData: function (data) {
		// 	var bankData = [{
		// 		"BANK_ID": data.bankDetails.BANK_ID || null,
		// 		"BANK_NO": data.bankDetails.BANK_NO || null,
		// 		"BANK_CURRENCY": data.bankDetails.BANK_CURRENCY || null,
		// 		"BANK_COUNTRY": data.bankDetails.BANK_COUNTRY || null,
		// 		"ACCOUNT_NAME": null,
		// 		"ACCOUNT_HOLDER": null,
		// 		"BANK_KEY": data.bankDetails.BANK_KEY || null,
		// 		"ACCOUNT_NO": data.bankDetails.ACCOUNT_NO || null,
		// 		"BENEFICIARY": data.bankDetails.BENEFICIARY || null,
		// 		"BIC_CODE": data.bankDetails.BIC_CODE || null,
		// 		"DUNS_NUMBER": data.bankDetails.DUNS_NUMBER || null,
		// 		"IBAN_NUMBER": data.bankDetails.IBAN_NUMBER || null,
		// 		"INVOICE_CURRENCY": null,
		// 		"NAME": data.bankDetails.NAME || null,
		// 		"BRANCH_NAME": data.bankDetails.BRANCH_NAME || null,
		// 		"OTHER_CODE_NAME": data.bankDetails.OTHER_CODE_NAME || null,
		// 		"OTHER_CODE_VAL": data.bankDetails.OTHER_CODE_VAL || null,
		// 		"PAYMENT_METHOD": null,
		// 		"PAYMENT_METHOD_DESC": null,
		// 		"PAYMENT_TERMS": null,
		// 		"PAYMENT_TERMS_DESC": null,
		// 		"ROUTING_CODE": data.bankDetails.ROUTING_CODE || null,
		// 		"SWIFT_CODE": data.bankDetails.SWIFT_CODE || null,
		// 		"VAT_REG_DATE": null,
		// 		"VAT_REG_NUMBER": null,
		// 		"PAYMENT_TYPE": "PRI"
		// 	}];
		// 	return bankData;
		// },

		onSave: function () {
			var that = this;
			if (logData.length > 0) {
				if (!that.filterfrag) {
					that.filterfrag = sap.ui.xmlfragment("com.ibs.ibsappidealdealerprofile.view.fragments.commentDialog", that);
					that.getView().addDependent(that.filterfrag);
				}
				that.filterfrag.open();
				sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to save ?");
				sap.ui.getCore().byId("id_yes").setVisible(false);
				sap.ui.getCore().byId("id_no").setVisible(false);
				sap.ui.getCore().byId("id_approve").setVisible(true);
				sap.ui.getCore().byId("id_cancel").setVisible(true);
				
			} else {
				MessageBox.information("Please edit the form and save.");
			}
		},
		closeDialog: function () {
			var that = this;
			that.filterfrag.close();
			that.filterfrag.destroy();
			that.filterfrag = null;
		},

		backCloseDialog: function () {
			var that = this;
			ndaUploadArray = [];
			ndaDeleteArray = [];
			logData = [];
			that.filterfrag.close();
			that.filterfrag.destroy();
			that.filterfrag = null;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
			oRouter.navTo("RouteDetailPage", {
				SAPVENDORNO: loginData.SAP_VENDOR_CODE
			});
		},
		onSaveEdit: function () {
			var that = this;
			var deleteArray = ndaDeleteArray;
			var uploadArray = ndaUploadArray;
			section = 1;
			var i18nModel = this.getView().getModel("i18n");
			vModel = oView.getModel("visibleJson").getData();
			mandatoryModel = oView.getModel("mandatoryJson").getData();
			var data = oView.getModel("blankJson").getData();
			var headerArray = this.getHeaderData(data);
			// var ndaModel = oView.getModel("G10Json").oData.results[0];
			var checkFields = validations.validateSections(headerArray, [], data, [], {}, i18nModel, vModel, mandatoryModel, section);

			if (headerArray[0].TRADE_LIC_NO === null && loginData.SUPPLIERTYPE_CODE !== "ZGOV" &&
				loginData.SUPPLIERTYPE_CODE !== "ZUNI") {
				checkFields.push({
					"section": 1,
					"description": "Enter " + oView.byId("S1G4T9F1_lbl").getText(),
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"otherDetailsS1_Id"
				});
			}

			if (loginData.BP_TYPE_CODE === "B" && headerArray[0].TRADE_LIC_NO_DATE === null && loginData.SUPPLIERTYPE_CODE !== "ZGOV" &&
				loginData.SUPPLIERTYPE_CODE !== "ZUNI") {
				checkFields.push({
					"section": 1,
					"description": "Select Trade Licence Expiry Date",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"otherDetailsS1_Id"
				});
			}

			//NDA attachment checkfield
			// if (loginData.CREATION_TYPE === 1 && ndaModel.FILE_NAME === "") {

			// 	checkFields.push({
			// 		"section": 1,
			// 		"description": "Upload NDA Attachment",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning"
			// 	});

			// }

			this.validateForm(checkFields);

			if (checkFields.length === 0) {
				if (that.deleteFlag === 1) {
					if (deleteArray.length > 0) {
						that.ndastatus = "U";
						var model = that.ondelete_model;
						var sbIndex = that.ondelete_sbIndex;
						var oModel = deleteArray[0];
						context.getToken(oModel, sbIndex, model, "DEL");
						var ndaAttach = oModel;
					} else if (uploadArray.length > 0) {
						that.ndastatus = "C";
						var blobData = that.uploadBlobData;
						var sbIndex = that.onupload_sbIndex;
						var model = that.onupload_model;
						var oModel = oView.getModel(model).oData.results[sbIndex];
						context.getToken(oModel, blobData, model, "U");
						var ndaAttach = oModel;
					} else {
						that.ndastatus = "N";
						var ndaAttach = null;
						context.onEdit(that.ndastatus, ndaAttach);
					}

				} else if (uploadArray.length > 0) {
					that.ndastatus = "C";
					var blobData = that.uploadBlobData;
					var sbIndex = that.onupload_sbIndex;
					var model = that.onupload_model;
					var oModel = oView.getModel(model).oData.results[sbIndex];
					context.getToken(oModel, blobData, model, "U");
					var ndaAttach = oModel;
				} else {
					that.ndastatus = "N";
					var ndaAttach = null;
					context.onEdit(that.ndastatus, ndaAttach);
				}
			} else {
				context.closeDialog();
				BusyIndicator.hide();
			}
		},

		onEdit: function (ndastatus, ndaAttach) {
			// BusyIndicator.show();
			section = 1;
			var path;
			var that = this;
			var ndaAttachArray = [];
			if (ndaAttach !== null) {
				delete ndaAttach.__metadata;
				ndaAttachArray.push(ndaAttach);
			}

			path = appModulePath + "/odata/v4/ideal-additional-process-srv/DistInternalRequest";
			
			var i18nModel = this.getView().getModel("i18n");
			vModel = oView.getModel("visibleJson").getData();
			mandatoryModel = oView.getModel("mandatoryJson").getData();
			var data = oView.getModel("blankJson").getData();
			//Open Text

			// if (data.headerData.OT_PARENT_ID === null || data.headerData.OT_PARENT_ID === undefined) {
			// 	context.getToken("", "", "", "F");
			// }
			BusyIndicator.show(0);
			jQuery.sap.delayedCall(700, this, function () {
				var headerArray = this.getHeaderData(data);

				//01/02/22
				// if (supplierCategoryKeys !== "") {
				// 	headerArray[0].SUPPL_CATEGORY = supplierCategoryKeys;
				// 	headerArray[0].SUPPL_CATEGORY_DESC = supplierCategoryText;

				// }
				// if (headerArray[0].SUPPL_CATEGORY !== null) {
				// 	headerArray[0].SUPPL_CATEGORY = headerArray[0].SUPPL_CATEGORY.toString();
				// }

				var addressContact = this.concatAddressContactData(data);
				addressContact = this.removeCountryRegionDesc(addressContact);
				
				var bankDetails = this.Originaldata.DRAFT.PAYMENT;

				for(var i =0;i<bankDetails.length;i++){
					delete bankDetails[i].COUNTRY_DESC;
				}

				var bankingDetails = this.Originaldata.DRAFT.BANKING_DETAILS;
				var attachArray =[];
				var attachmentFieldsData = {
						"REQUEST_NO":100000048,
						"IS_UAE_COMPANY": "No",
						"ISSUE_ELEC_TAX_INV": "Yes",
						"SOLE_DIST_MFG_SER": "Yes",
						"PASSPORT_OF_AUTH_SIGNATORY": null,
						"PASSPORT_REPR_AUTH_PERSON": null
					}
				attachArray.push(attachmentFieldsData);

				var finInfo = this.Originaldata.DRAFT.FINANCE;
				var OwnerInfo = this.Originaldata.DRAFT.OWNERS;
				var productInfo = this.Originaldata.DRAFT.PRODUCTS;
				var capacityData = this.Originaldata.DRAFT.CAPACITY;
				var customerInfo = this.Originaldata.DRAFT.CUSTOMER;
				var discFields = this.Originaldata.DRAFT.DISC_FIELDS;
				var discRelative = this.Originaldata.DRAFT.DISC_RELATIVES;
				var discQa = this.Originaldata.DRAFT.DISC_QA_CERTI;

				var attachmentField = attachArray;
				var attachmentData = this.Originaldata.DRAFT.ATTACHMENTS;

				var promoterData = this.Originaldata.DRAFT.PROMOTERS;
				var businessData = this.Originaldata.DRAFT.BUSINESS_HISTORY;

				//comment
				var comment = sap.ui.getCore().byId("id_comment").getValue();
				//var comment = "";

				//Removing metadata and other fields
				this.removeMetadata(data);
				this.setTableDataEmpty(section, vModel, data);

				//Request type change to update.
				if (headerArray[0].REQUEST_TYPE !== 5) {
					headerArray[0].REQUEST_TYPE = 5;
				}
				headerArray[0].REQUESTER_ID = that._sUserID;
				headerArray[0].VAT_CHECK = loginData.VAT_CHECK;

				for (var i = 0; i < logData.length; i++) {
					delete logData[i].ID;
				}

				if (that.deleteFlag === 1) {
					if (ndaDeleteArray.length > 0) {
						var SRNO = ndaDeleteArray[0].SR_NO;
						var delattachcode = ndaDeleteArray[0].ATTACH_CODE;
					} else {
						var SRNO = 0;
						var delattachcode = 0;
					}
				} else {
					var SRNO = 0;
					var delattachcode = 0;
				}

				//	if (checkFields.length === 0) {
				
				var payload = this.draftinPayload(headerArray, addressContact.address, addressContact.contact, bankDetails,finInfo,OwnerInfo,productInfo, capacityData, customerInfo,
					discFields,discRelative, discQa, attachmentField,attachmentData,
					section, updateId, logData, comment, ndastatus, ndaAttachArray, SRNO, delattachcode,promoterData,businessData,bankingDetails);
					
					// BusyIndicator.hide();
					this.ajaxCall(path, payload);
					
				//	}

				// BusyIndicator.hide();
			});
			
			// section = 1;
			// var path;
			// path = appModulePath+"/odata/v4/addtional-process/EditRegFormData";

			// var i18nModel = this.getView().getModel("i18n");
			// vModel = oView.getModel("visibleJson").getData();
			// mandatoryModel = oView.getModel("mandatoryJson").getData();
			// var data = oView.getModel("blankJson").getData();

			// // BusyIndicator.show(0);
			// jQuery.sap.delayedCall(700, this, function () {
			// 	var headerArray = this.getHeaderData(data);

			// 	if (supplierCategoryKeys !== "") {
			// 		headerArray[0].SUPPL_CATEGORY = supplierCategoryKeys;
			// 		headerArray[0].SUPPL_CATEGORY_DESC = supplierCategoryText;

			// 	}
			// 	if (headerArray[0].SUPPL_CATEGORY !== null) {
			// 		headerArray[0].SUPPL_CATEGORY = headerArray[0].SUPPL_CATEGORY.toString();
			// 	}

			// 	//	var bankDetails = this.getBankData(data);

			// 	//	bankDetails.push.apply(bankDetails, data.otherBankDetails);
			// 	//	var bankFields = this.removeBankCountryDesc(bankDetails);

			// 	var checkFields = validations.validateSections(headerArray, [], data, [], {}, i18nModel, vModel, mandatoryModel, section);

			// 	if (headerArray[0].TRADE_LIC_NO === null && loginData.SUPPLIERTYPE_CODE !== "ZGOV" &&
			// 		loginData.SUPPLIERTYPE_CODE !== "ZUNI") {
			// 		checkFields.push({
			// 			"section": 1,
			// 			"description": "Enter " + oView.byId("S1G4T9F1_lbl").getText(),
			// 			"subtitle": "Mandatory Field",
			// 			"type": "Warning"
			// 		});
			// 	}

			// 	if (loginData.BP_TYPE_CODE === "B" && headerArray[0].TRADE_LIC_NO_DATE === null && loginData.SUPPLIERTYPE_CODE !== "ZGOV" &&
			// 		loginData.SUPPLIERTYPE_CODE !== "ZUNI") {
			// 		checkFields.push({
			// 			"section": 1,
			// 			"description": "Select Trade Licence Expiry Date",
			// 			"subtitle": "Mandatory Field",
			// 			"type": "Warning"
			// 		});
			// 	}

			// 	//NDA attachment checkfield
			// 	if (loginData.CREATION_TYPE === 1 && ndaAttachModel.getData().OT_DOC_ID === null && ndaAttachModel.getData().results[
			// 			0].FILE_NAME === "" && mandatoryModel.S5A13F1 === 'X') {
			// 		//	if(ndaAttachModel.getData().results[0].OT_DOC_ID === null && ndaAttachModel.getData().results[0].FILE_NAME === ""){
			// 		checkFields.push({
			// 			"section": 1,
			// 			"description": "Upload NDA Attachment",
			// 			"subtitle": "Mandatory Field",
			// 			"type": "Warning"
			// 		});
			// 		//	}
			// 	}

			// 	this.validateForm(checkFields);

			// 	var addressContact = this.concatAddressContactData(data);
			// 	addressContact = this.removeCountryRegionDesc(addressContact);

			// 	//Removing metadata and other fields
			// 	this.removeMetadata(data);
			// 	this.setTableDataEmpty(section, vModel, data);

			// 	headerArray[0].VAT_CHECK = loginData.VAT_CHECK;

			// 	// added on 13-04-2023 by Inder Chouhan
			// 	// if (headerArray[0].REQUEST_TYPE === 7 && headerArray[0].STATUS === 5 && (headerArray[0].COMPLETED_BY === null || headerArray[0].COMPLETED_BY === undefined || headerArray[0].COMPLETED_BY === "")) {
			// 	if (headerArray[0].REQUEST_TYPE === 7 && headerArray[0].STATUS === 5) {
			// 		headerArray[0].COMPLETED_BY = context._sUserName;
			// 		headerArray[0].COMPLETED_BY_POSITION = "Buyer";
			// 		headerArray[0].SUBMISSION_DATE = new Date();
			// 	}
			// 	for (var i = 0; i < logData.length; i++) {
			// 		delete logData[i].ID;
			// 		if(typeof(logData[i].ORG_VALUE) === 'number'){
			// 		logData[i].ORG_VALUE = JSON.stringify(logData[i].ORG_VALUE);
			// 		}
			// 		if(typeof(logData[i].SAP_VENDOR_CODE) === 'number'){
			// 			logData[i].SAP_VENDOR_CODE = JSON.stringify(logData[i].SAP_VENDOR_CODE);
			// 		}
			// 	}

			// 	debugger;
			// 	if (checkFields.length === 0) {
			// 		var payload = this.draftinPayload(headerArray, addressContact.address, addressContact.contact, [], [], [], [], [], [], [], [], [], [], [], [], [], [],
			// 			section, updateId, logData);
			// 		// this.ajaxCall(path, payload);
			// 	}

			// 	BusyIndicator.hide();
			// });

		},
		createFolder: function (token) {
			var credentials = oView.getModel("openTextJson").getData();
			var form = new FormData();
			form.append("type", 0);
			form.append("parent_id", parseInt(credentials.ADD_INFO1, 10));
			form.append("name", loginData.IVEN_VENDOR_CODE);

			$.ajax({
				url: "/OpenText/otcs/cs.exe/api/v1/nodes",
				type: 'POST',
				processData: false,
				mimeType: "multipart/form-data",
				contentType: false,
				headers: {
					'otcsticket': token, //token generated to send request
				},
				data: form,
				async: false,
				success: function (response) {
					oView.getModel("blankJson").setProperty("/headerData/OT_PARENT_ID", JSON.parse(response).id);
					oView.getModel("localConfigModel").setProperty("/OT_PARENT_ID", JSON.parse(response).id);
					context.createSubFolder(JSON.parse(response).id, "Active Attachments", token);
					context.createSubFolder(JSON.parse(response).id, "Deactive Attachments", token);
					jQuery.sap.delayedCall(300, this, function () {
						BusyIndicator.show(0);
						context.UpdateOtId();
					});

				},
				error: function (error) {
					BusyIndicator.hide();
					// var oXMLMsg = JSON.parse(error.responseText)["error"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}
			});
		},
		UpdateOtId: function () {
			var Data = oView.getModel("localConfigModel").getData()
			var oObj = {
				"VALUE": {
					"REQUEST_NO": Data.REQUEST_NO,
					"OT_PARENT_ID": Data.OT_PARENT_ID,
					"OT_FOLDER1_ID": Data.OT_FOLDER1_ID,
					"OT_FOLDER2_ID": Data.OT_FOLDER2_ID,
				}
			}
			$.ajax({
				url: appModulePath+"/iVen_EDGE/VENDOR_PORTAL/XSJS/VENDOR_QUICK_REGISTRATION.xsjs?ACTION=QR_OT_ID",
				type: 'POST',
				data: JSON.stringify(oObj),
				contentType: 'application/json',
				success: function (oData, responce) {},
				error: function (error) {
					BusyIndicator.hide();
					// var oXMLMsg = JSON.parse(error.responseText)["error"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}
			});
		},
		createSubFolder: function (Id, folderName, token) {
			var form = new FormData();
			form.append("type", 0);
			form.append("parent_id", Id);
			form.append("name", folderName);
			$.ajax({
				url: "/OpenText/otcs/cs.exe/api/v1/nodes",
				type: 'POST',
				processData: false,
				mimeType: "multipart/form-data",
				contentType: false,
				headers: {
					'otcsticket': token, //token generated to send request
				},
				data: form,
				async: false,
				success: function (response) {

					if (folderName === "Active Attachments") {
						oView.getModel("blankJson").setProperty("/headerData/OT_FOLDER1_ID", JSON.parse(response).id);
						oView.getModel("localConfigModel").setProperty("/OT_FOLDER1_ID", JSON.parse(response).id);
					} else if (folderName === "Deactive Attachments") {
						oView.getModel("blankJson").setProperty("/headerData/OT_FOLDER2_ID", JSON.parse(response).id);
						oView.getModel("localConfigModel").setProperty("/OT_FOLDER2_ID", JSON.parse(response).id);

					} else {
						oView.getModel("blankJson").setProperty("/headerData/OT_FOLDER3_ID", JSON.parse(response).id);
						oView.getModel("localConfigModel").setProperty("/OT_FOLDER3_ID", JSON.parse(response).id);
					}

				},
				error: function (error) {
					BusyIndicator.hide();
					// var oXMLMsg = JSON.parse(error.responseText)["error"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}
			});
		},

		//Attachement section

		_readAttachmentDraftData: function (headerArray) {
			oView.setBusy(true);
			var aFilter = [];
			
			var url = appModulePath+"/odata/v4/ideal-registration-form-srv/RegformAttachments?$filter=ATTACH_CODE eq 15 and REQUEST_NO eq " + loginData.REG_NO;

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					oView.setBusy(false);
					if (oData.value.length !== 0) {
						ndaAttachModel = new JSONModel();
						ndaAttachModel.setData(oData.value);
						oView.setModel(ndaAttachModel, "G10Json");
					} else {
						var ndaObj = {
							"results": [{
								"ATTACH_SHORT_DEC": "_NDA_1",
								"ATTACH_CODE": 15,
								"ATTACH_DESC": "Non-disclosure Agreement (NDA)",
								"DRAFT_IND": null,
								"EXPIRY_DATE": null,
								"FILE_CONTENT": null,
								"FILE_MIMETYPE": null,
								"FILE_NAME": "",
								"FLAG": "Yes",
								"GROUP1": "",
								"ATTACH_GROUP": "G10",
								"OT_DOC_ID": null,
								"SHORT_DESCRIPTION": "_NDA",
								"SR_NO": null,
								"FILE_TYPE": "ONB",
								"UPDATE_FLAG": null
							}]
						};
						ndaAttachModel = new JSONModel();
						ndaAttachModel.setData(ndaObj);
						oView.setModel(ndaAttachModel, "G10Json");
					}

				},
				error: function (error) {
					BusyIndicator.hide();
					oView.setBusy(false);
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

			// aFilter.push(new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, loginData.REG_NO));
			// aFilter.push(new sap.ui.model.Filter("ATTACH_CODE", sap.ui.model.FilterOperator.EQ, 15));
			
		},

		onDownload: function (oEvent) {
			var sbIndex = "";
			var model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;

			if (model === "G10Json") {
				sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[2]);
			} else {
				sbIndex = parseInt(oEvent.getSource().getBindingContext(model).getPath().split("/")[2]);
			}

			var oModel = oView.getModel(model).oData.results[sbIndex];

			// }
			//open text
			context.getToken(oModel, "", "", "DOWN");

		},

		getToken: function (oModel, blobData, model, value) {
			BusyIndicator.show(0);
			var credentials = oView.getModel("openTextJson").getData();
			var form = new FormData();
			form.append("username", credentials.USERNAME);
			form.append("password", credentials.PASSWORD);
			$.ajax({
				url: "/OpenText/otcs/cs.exe/api/v1/auth",
				type: 'POST',
				processData: false,
				mimeType: "multipart/form-data",
				contentType: false,
				data: form,
				async: false,
				success: function (response) {

					if (value === "U") {
						context._postOSTFile(oModel, blobData, model, response);
					} else if (value === "F") {
						context.createFolder(response);
					} else if (value === "DEL") {
						//context._deleteOSTFile(oModel, blobData, model, response);
						// if (loginData.REQUEST_TYPE === 1 || loginData.REQUEST_TYPE === 2 || loginData.REQUEST_TYPE === 3 || (loginData.REQUEST_TYPE ===
						// 		5 && oModel.UPDATE_FLAG === "X")) {
						// 	context._deleteOSTFile(oModel, blobData, model, response);
						// } else {
						context._moveFileToOldFolder(oModel, blobData, model, response);
						//}
					} else if (value === "DOWN") {
						context._downOSTFile(oModel, response);
					}

				},
				error: function (error) {
					//	oView.setBusy(false);
					BusyIndicator.hide();
					// var oXMLMsg = JSON.parse(error.responseText)["error"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}
			});

		},

		_deleteOSTFile: function (oModel, sbIndex, model, token) {

			$.ajax({
				url: "/OpenText/otcs/cs.exe/api/v1/nodes/" + parseInt(oModel.OT_DOC_ID),
				method: "DELETE",
				timeout: 0,
				processData: false,
				mimeType: "multipart/form-data",
				contentType: false,
				headers: {
					'otcsticket': token, //token generated to send request
				},
				success: function (data, response) {

					//Get updated Id
					if (loginData.REQUEST_TYPE === 5) {
						if (model === "G10Json") {
							if (!updateId.includes(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.parts[0].path
									.split(
										"/")[1])) {
								updateId.push(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.parts[0].path.split(
									"/")[1]);
							}
						} else {
							if (!updateId.includes(context.sourceData.getParent().getTable().mBindingInfos.visible.binding.aBindings[0].sPath
									.split(
										"/")[1])) {
								updateId.push(context.sourceData.getParent().getTable().mBindingInfos.visible.binding.aBindings[0].sPath.split(
									"/")[1]);
							}
						}
					}
					context._deleteHanaFile(oModel, model, sbIndex, "D");

				},
				error: function (error) {
					BusyIndicator.hide();
					// var oXMLMsg = JSON.parse(error.responseText)["error"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}

			});
		},

		_moveFileToOldFolder: function (oModel, sbIndex, model, token) {
			var form = new FormData();
			form.append("type", 0);
			form.append("parent_id", parseInt(oView.getModel("blankJson").getProperty("/headerData/OT_FOLDER2_ID")));

			$.ajax({
				url: "/OpenText/otcs/cs.exe/api/v1/nodes/" + parseInt(oModel.OT_DOC_ID),
				method: "PUT",
				timeout: 0,
				processData: false,
				mimeType: "multipart/form-data",
				contentType: false,
				headers: {
					'otcsticket': token, //token generated to send request
				},
				"data": form,
				success: function (data, response) {

					//Get updated Id
					if (loginData.REQUEST_TYPE === 5) {
						if (model === "G6Json" || model === "G7Json" || model === "G10Json") {
							if (!updateId.includes(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.parts[0].path
									.split(
										"/")[1])) {
								updateId.push(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.parts[0].path.split(
									"/")[1]);
							}
						} else {
							if (!updateId.includes(context.sourceData.getParent().getTable().mBindingInfos.visible.binding.aBindings[0].sPath
									.split(
										"/")[1])) {
								updateId.push(context.sourceData.getParent().getTable().mBindingInfos.visible.binding.aBindings[0].sPath.split(
									"/")[1]);
							}
						}
					}
					context._deleteHanaFile(oModel, model, sbIndex)

				},
				error: function (error) {
					//context.getView().setBusy(false);
					BusyIndicator.hide();
					// var oXMLMsg = JSON.parse(error.responseText)["error"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);

				}

			});
		},

		_downOSTFile: function (oModel, token) {
			var file_Id = "",
				fileName = "";
			BusyIndicator.hide();

			if (oModel.DRAFT_IND === null) {
				file_Id = oModel.OT_DOC_ID;
				fileName = oModel.FILE_NAME;

				context.downloadAttachment(file_Id, fileName, token);
			} else {
				context.downloadAttachmentContent(oModel.REQUEST_NO, oModel.FILE_NAME, oModel.OT_DOC_ID,
					token);
			}
		},

		_deleteHanaFile: function (oModel, model, sbIndex, sInd) {

			var oEntry = {},
				updatedFields;
			oEntry.REQUEST_NO = loginData.REG_NO;
			oEntry.OT_DOC_ID = oModel.OT_DOC_ID;
			if (loginData.REQUEST_TYPE === 5) {
				updatedFields = updateId;
			} else {
				updatedFields = [];
			}
			var payload = {
				"VALUE": {
					"ATTACHMENTS": [oEntry],
					"UPDATED_FIELDS": updatedFields,
				}
			};

			var data = JSON.stringify(payload);
			$.ajax({
				url: "/iVen_EDGE/VENDOR_PORTAL/XSJS/VENDOR_ONBOARDING_ATTACHMENTS.xsjs?ACTION=DELETE",
				type: 'POST',
				data: data,
				contentType: 'application/json',
				success: function (oData, responce) {
					//oView.setBusy(false);
					BusyIndicator.hide();
					if (model === "G10Json") {
						oModel.FILE_CONTENT = null;
						oModel.FILE_NAME = "";
						oModel.FILE_MIMETYPE = "";
						oModel.OT_DOC_ID = null;
						oModel.SR_NO = null;
						oModel.EXPIRY_DATE = null;
						oModel.ATTACH_VALUE = null;

					} else {

						oView.getModel(model).oData.splice(sbIndex, 1);
					}

					MessageBox.success("Attachment Deleted.", {
						actions: [MessageBox.Action.OK],
						onClose: function (oAction) {
							if (oAction === "OK") {
								oView.getModel(model).refresh(true);
							}
						}
					});

				},
				error: function (error) {
					oView.setBusy(false);
					// MessageBox.show("Error while Deletion.", {
					// 	icon: MessageBox.Icon.ERROR,
					// 	title: "ERROR"
					// });
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}
			});

		},

		downloadAttachment: function (file_Id, fileName, token) {
			var settings = {
				"url": "/OpenText/otcs/cs.exe/api/v2/nodes/" + parseInt(file_Id) + "/content",
				"method": "GET",
				"headers": {
					'otcsticket': token, //token generated to send request
				}
			};
			var oReq = new XMLHttpRequest();
			oReq.onload = function (e) {
				var buffer = oReq.response;
				var reader = new FileReader;
				reader.onload = function () {
					var mimeType = "application/octet-stream";
					//	var blobAsDataUrl = reader.result;
					var blobAsDataUrl = "data:application/octet-stream;" + reader.result.split(";")[1];
					download(blobAsDataUrl, fileName, mimeType);
				};
				reader.readAsDataURL(buffer);
			};
			oReq.open("GET", settings.url);
			oReq.setRequestHeader("Content-Type", "application/json");
			oReq.responseType = "blob";
			oReq.send(JSON.stringify(settings.headers));

		},

		downloadAttachmentContent: function (iREQUEST_NO, sFILE_NAME, file_Id, token) {
			var aFilter = [],
				fileContent = null;

			context.downloadAttachment(file_Id, sFILE_NAME, token);

		},

		onDelete: function (oEvent) {
				var that = this;
				var oSource = oEvent.getSource();
				this.sourceData = oSource;
				//	ndaDeleteArray = [];
				var sbIndex = "";
				that.deleteFlag = 1;
				var model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;
				var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
				if (ndaDeleteArray.length > 0) {
					var OrgNdaValue = ndaDeleteArray[0].FILE_NAME + "," + ndaDeleteArray[0].OT_DOC_ID;
					that.deleteFilename = ndaDeleteArray[0].FILE_NAME;
				} else {
					var OrgNdaValue = "";
				}
				that._logNDACondition("AttachId", label, "", "", OrgNdaValue, "");
	
				that.ondelete_model = model;
				MessageBox.information("Are you sure you want to delete the file ?", {
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (Action) {
						if (Action === "YES") {
	
							if (model === "G10Json") {
	
								sbIndex = parseInt(oSource.mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[2]);
								that.ondelete_sbIndex = sbIndex;
							} else {
								sbIndex = parseInt(oSource.getBindingContext(model).getPath().split("/")[2]);
								that.ondelete_sbIndex = sbIndex;
							}
							var oModel = oView.getModel(model).oData.results[sbIndex];
							// var deleteModel = JSON.parse(JSON.stringify(oModel));
							// ndaDeleteArray.push(deleteModel);
							ndaUploadArray = [];
	
							if (model === "G10Json") {
								oView.getModel(model).getData().results[sbIndex].FILE_CONTENT = null;
								oView.getModel(model).getData().results[sbIndex].FILE_NAME = "";
								oView.getModel(model).getData().results[sbIndex].FILE_MIMETYPE = "";
								//	oView.getModel(model).getData().results[sbIndex].OT_DOC_ID = null;
								//	oView.getModel(model).getData().results[sbIndex].SR_NO = null;
								oView.getModel(model).getData().results[sbIndex].EXPIRY_DATE = null;
								oView.getModel(model).getData().results[sbIndex].ATTACH_VALUE = null;
								//	oView.getModel("G10Json").refresh(true);
							}
	
							MessageBox.success("Attachment Deleted.", {
								actions: [MessageBox.Action.OK],
								onClose: function (oAction) {
									if (oAction === "OK") {
										oView.getModel(model).refresh(true);
									}
								}
							});
	
							//open text
							//------------------------------------------------------------------
							// if (model === "G10Json" || oModel.OT_DOC_ID !== null) {
							// 	BusyIndicator.show();
							// 	context.getToken(oModel, sbIndex, model, "DEL");
							// } else {
							// 	oView.getModel(model).oData.splice(sbIndex, 1);
							// 	oView.getModel(model).refresh(true);
	
							// }
							//---------------------------------------------------------------------------
						}
	
					}
				});
	
				//	MessageBox.success("File Deleted.");
		

			//	MessageBox.success("File Deleted.");
		},

		_logNDACondition: function (id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc) {
			var count = 1;
			var flag;
			for (var i = 0; i < logData.length; i++) {
				if (logData[i].ID === id) {
					flag = 1;
					var logDetails = this._logNDACreate(id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc, flag);
					logData[i] = logDetails;
					break;
				} else if (count === logData.length) {
					flag = 0;
					this._logNDACreate(id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc, flag);
					break;
				}
				count = count + 1;
			}

			if (logData.length === 0) {
				flag = 0;
				this._logNDACreate(id, lable, ch_value, ch_valuedesc, org_value, org_valuedesc, flag);
			}
		},

		_logNDACreate: function (id, lable, value, valuedesc, orgvalue, orgvalue_desc, flag) {
			var that = this;
			if (loginData.REQUEST_TYPE === 5 || loginData.REQUEST_TYPE === 6) {
				var VendorCode = loginData.SAP_VENDOR_CODE;
			} else {
				if (loginData.STATUS === 13) {
					var VendorCode = loginData.SAP_VENDOR_CODE;
				} else {
					var VendorCode = loginData.IVEN_VENDOR_CODE;
				}

			}

			if (flag === 1) {
				//	if (orgvalue !== value) {
				var logObj = {
					"ID": id,
					"REQUEST_NO": loginData.REG_NO,
					"UPDATED_FIELD_NAME": lable,
					"CHANGE_VALUE": value,
					"ORG_VALUE": orgvalue,
					"COMMENT": "NDA file is updated with new attachment.",
					"USER_ID": that._sUserID,
					"USER_NAME": that._sUserName,
					// "SAP_VENDOR_CODE": VendorCode || null,
					"SAP_VENDOR_CODE": JSON.stringify(VendorCode) || null,
					"EVENT_NO": 0,
					"EVENT_CODE": 0,
					"EVENT_TYPE": "NDA",
					"REMARK": null,
					"UPDATED_ON": null
				};
				return logObj;
				//	}
			} else {
				//	if (orgvalue !== value) {
				var logObj = {
					"ID": id,
					"REQUEST_NO": loginData.REG_NO,
					"UPDATED_FIELD_NAME": lable,
					"CHANGE_VALUE": value,
					"ORG_VALUE": orgvalue,
					"COMMENT": "NDA file is updated with new attachment.",
					"USER_ID": that._sUserID,
					"USER_NAME": that._sUserName,
					// "SAP_VENDOR_CODE": VendorCode || null,
					"SAP_VENDOR_CODE": JSON.stringify(VendorCode) || null,
					"EVENT_NO": 0,
					"EVENT_CODE": 0,
					"EVENT_TYPE": "NDA",
					"REMARK": null,
					"UPDATED_ON": null
				};
				logData.push(logObj);
				//	}
			}
		},

		handleUpload: function (oEvent) {
			BusyIndicator.show(0);
			var that = this;
			var sbfileDetails = oEvent.getParameters("file").files;
			this.model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;
			this.sourceData = oEvent.getSource();
			var data = oView.getModel("blankJson").getData();
			//Open Text
			if (data.headerData.OT_PARENT_ID === null || data.headerData.OT_PARENT_ID === undefined) {
				context.getToken("", "", "", "F");
			}
			if (this.model === "G10Json") {
				this.sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[2]);
			} else {
				this.sbIndex = parseInt(oEvent.getSource().getBindingContext(this.model).getPath().split("/")[2]);
			}

			var label = oEvent.getSource().oParent.mAggregations.cells[0].mProperties.text;
			var fieldId = oEvent.getSource().oParent.mAggregations.cells[0].mBindingInfos.required.parts[0].path.split('/')[1];
			if (!updateId.includes(fieldId)) {
				updateId.push(fieldId);
			}

			if (loginData.REQUEST_TYPE === 5 || loginData.REQUEST_TYPE === 6) {
				var VendorCode = loginData.SAP_VENDOR_CODE;
			} else {
				var VendorCode = loginData.IVEN_VENDOR_CODE;
			}

			if (ndaDeleteArray.length > 0) {
				var OrgNdaValue = ndaDeleteArray[0].FILE_NAME + "," + ndaDeleteArray[0].OT_DOC_ID;
			} else {
				var OrgNdaValue = null;
			}

			this._logNDACondition("AttachId", label, "", "", OrgNdaValue, "");
			// var logObj = {
			// 		//	"ID": id,
			// 			"REQUEST_NO" : loginData.REG_NO,
			// 			"UPDATED_FIELD_NAME": label,
			// 			"CHANGE_VALUE": "",
			// 			"ORG_VALUE": OrgNdaValue,
			// 			"COMMENT": "NDA file is updated with new attachment.",
			// 			"USER_ID": that._sUserID,
			// 			"USER_NAME": that._sUserName,
			// 			"SAP_VENDOR_CODE": VendorCode,
			// 			"EVENT_NO": 0,
			// 			"EVENT_CODE": 0,
			// 			"EVENT_TYPE": "NDA",
			// 			"REMARK":null,
			// 			"UPDATED_ON":null
			// 		};
			// 		logData.push(logObj);

			this.sbfileUploadArr = [];
			if (sbfileDetails.length != 0) {
				for (var i in sbfileDetails) {
					var mimeDet = sbfileDetails[i].type,
						fileName = sbfileDetails[i].name;
					this.sbfileName = fileName;
					// Calling method....
					this.sbBase64conversionMethod(mimeDet, fileName, sbfileDetails[i]);
				}
			} else {
				this.sbfileUploadArr = [];
			}
		},

		sbBase64conversionMethod: function (fileMime, fileName, fileDetails) {
			BusyIndicator.show(0);
			if (!FileReader.prototype.readAsBinaryString) {
				FileReader.prototype.readAsBinaryString = function (fileData) {
					var binary = "";
					var reader = new FileReader();
					reader.onload = function (e) {
						var bytes = e.reader.result;
						var length = bytes.byteLength;
						for (var i = 0; i < length; i++) {
							binary += String.fromCharCode(bytes[i]);
						}
						context.sbbase64ConversionRes = btoa(binary);
						context.sbfileUploadArr.push({
							"MimeType": fileMime,
							"FileName": fileName,
							"Content": context.sbbase64ConversionRes,
						});
					};
					reader.readAsArrayBuffer(fileData);
				};
			}
			var reader = new FileReader();
			reader.onload = function (readerEvt) {
				var binaryString = readerEvt.target.result;
				context.sbbase64ConversionRes = btoa(binaryString);
				//Open Text
				//	var blobData = context.b64toBlob(context.sbbase64ConversionRes);
				var blobData = context.b64toBlob(context.sbbase64ConversionRes, fileName, "", fileMime);
				context.sbfileUploadArr = [];

				context.sbfileUploadArr.push({
					"MimeType": null,
					"FileName": fileName.split(".")[fileName.split(".").length - 1],
					"Content": null
				});
				//Open Text
				context._sbgetUploadedFiles(blobData);
			};
			reader.readAsBinaryString(fileDetails);
		},

		//Open Text
		b64toBlob: function (b64Data, contentType, sliceSize, filemime) {

			contentType = contentType || '';
			sliceSize = sliceSize || 512;
			var byteCharacters = atob(b64Data);
			var byteArrays = [];
			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);
				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}
				var byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}
			// var blob = new File(byteArrays, {
			// 	type: contentType
			// });
			var blob = new File(byteArrays, contentType, { //with mimetype
				type: filemime

			});
			return blob;
		},

		_sbgetUploadedFiles: function (blobData) {
			BusyIndicator.show(0);
			if (this.sbfileUploadArr.length != 0) {
				for (var fdata in this.sbfileUploadArr) {
					if (this.sbfileUploadArr[fdata].Content === "") {
						MessageBox.warning("Upload Failed - File is empty");
						context.sbfileUploadArr = [];
						return;
					}
					//Open Text
					this.sbAttachmentArr = {
						"FILE_NAME": this.sbfileUploadArr[fdata].FileName,
						"FILE_MIMETYPE": null,
						"FILE_CONTENT": null,
					};

				}
			}
			this.sbfileUploadArr = [];

			var oModel = oView.getModel(context.model).oData.results[context.sbIndex];
			//open text
			context.getToken(oModel, blobData, context.model, "U");

		},

		//open text
		_postOSTFile: function (oModel, blobData, model, token) {
			BusyIndicator.show(0);
			// var id = 55530;
			var Pdfdata = new FormData();
			// Pdfdata.append("file", blobData, {
			// 	"type": "application/pdf"
			// });
			Pdfdata.append("file", blobData); //with mimetype
			Pdfdata.append("type", 144);
			oModel.ATTACH_SHORT_DEC = "_NDA_" + Math.floor(100 + Math.random() * 900);
			Pdfdata.append("parent_id", parseInt(oView.getModel("blankJson").getProperty("/headerData/OT_FOLDER1_ID")));
			Pdfdata.append("name", loginData.IVEN_VENDOR_CODE + oModel.ATTACH_SHORT_DEC + "." + context.sbAttachmentArr.FILE_NAME);
			$.ajax({
				url: "/OpenText/otcs/cs.exe/api/v1/nodes",
				method: "POST",
				// enctype: "multipart/form-data",
				headers: {
					'otcsticket': JSON.parse(token).ticket, //token generated to send request
				},
				contentType: false,
				processData: false,
				cache: false,
				crossDomain: true,
				data: Pdfdata,
				success: function (data, response) {

					//	oModel.ATTACH_SHORT_DEC = "_NDA_"+Math.floor(100 + Math.random() * 900);
					oModel.FILE_CONTENT = context.sbAttachmentArr.FILE_CONTENT;
					oModel.FILE_NAME = loginData.IVEN_VENDOR_CODE + oModel.ATTACH_SHORT_DEC + "." + context.sbAttachmentArr.FILE_NAME;
					oModel.FILE_MIMETYPE = null;
					oModel.ATTACH_SHORT_DEC = oModel.ATTACH_SHORT_DEC;
					oModel.DRAFT_IND = null;
					oModel.OT_DOC_ID = data.id;
					if (loginData.REQUEST_TYPE === 5) {
						oModel.UPDATE_FLAG = "X";
						if (model === "G10Json") {

							if (!updateId.includes(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.parts[0].path
									.split(
										"/")[1])) {
								updateId.push(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.parts[0].path.split(
									"/")[1]);
							}

						} else {
							if (!updateId.includes(context.sourceData.getParent().getTable().mBindingInfos.visible.binding.aBindings[0].sPath
									.split(
										"/")[1])) {
								updateId.push(context.sourceData.getParent().getTable().mBindingInfos.visible.binding.aBindings[0].sPath.split(
									"/")[1]);
							}
						}
					}

					for (var i = 0; i < logData.length; i++) {
						if (logData[i].EVENT_TYPE === "NDA") {
							var changeNdaValue = oModel.FILE_NAME + "," + oModel.OT_DOC_ID;
							logData[i].CHANGE_VALUE = changeNdaValue;
						}
					}

					context._postHanaFile(oModel, model);

				},
				error: function (error) {
					//	context.getView().setBusy(false);
					BusyIndicator.hide();
					// var oXMLMsg = JSON.parse(error.responseText)["error"];
					// MessageBox.error(oXMLMsg);
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}
			});
		},

		_postHanaFile: function (oModel, model) {
			BusyIndicator.show(0);
			var oEntry = {},
				updatedFields;
			oEntry.REQUEST_NO = loginData.REG_NO;
			oEntry.SR_NO = null;
			oEntry.ATTACH_CODE = oModel.ATTACH_CODE;
			oEntry.ATTACH_GROUP = oModel.ATTACH_GROUP;
			oEntry.ATTACH_DESC = oModel.ATTACH_DESC;
			oEntry.ATTACH_VALUE = oModel.ATTACH_VALUE || null;
			oEntry.EXPIRY_DATE = oModel.EXPIRY_DATE;
			oEntry.FILE_NAME = oModel.FILE_NAME;
			oEntry.FILE_TYPE = oModel.FILE_TYPE;
			oEntry.FILE_MIMETYPE = oModel.FILE_MIMETYPE;
			oEntry.FILE_CONTENT = null;
			oEntry.OT_DOC_ID = oModel.OT_DOC_ID;
			oEntry.OT_LAST_DOC_ID = null;
			oEntry.UPDATE_FLAG = null;
			oEntry.DELETE_FLAG = null;
			oEntry.ATTACH_SHORT_DEC = null;
			oEntry.ATTACH_FOR = null;
			oEntry.UPLOADED_ON = null;
			oEntry.OT_LAST_DOC_ID = oModel.OT_LAST_DOC_ID || null;
			oEntry.UPDATE_FLAG = oModel.UPDATE_FLAG || null;
			oEntry.DELETE_FLAG = oModel.DELETE_FLAG || null;
			oEntry.ATTACH_SHORT_DEC = oModel.ATTACH_SHORT_DEC;
			oEntry.ATTACH_FOR = oModel.ATTACH_FOR || null;

			var attachFields = {
				"REQUEST_NO": loginData.REG_NO,
				"IS_UAE_COMPANY": loginData.IS_UAE_COMPANY,
				"ISSUE_ELEC_TAX_INV": loginData.ISSUE_ELEC_TAX_INV,
				"SOLE_DIST_MFG_SER": loginData.SOLE_DIST_MFG_SER,
				"PASSPORT_OF_AUTH_SIGNATORY": null,
				"PASSPORT_REPR_AUTH_PERSON": null

			};

			if (loginData.REQUEST_TYPE === 5) {
				updatedFields = updateId;
			} else {
				updatedFields = [];
			}

			var payload = {
				"VALUE": {
					"ATTACHMENTS": [oEntry],
					"ATTACHFIELD": [attachFields],
					"UPDATED_FIELDS": updatedFields,
				}
			};
			var data = JSON.stringify(payload);
			$.ajax({
				url: "/iVen_EDGE/VENDOR_PORTAL/XSJS/VENDOR_ONBOARDING_ATTACHMENTS.xsjs?ACTION=CREATE",
				type: 'POST',
				data: data,
				contentType: 'application/json',
				success: function (oData, responce) {

					BusyIndicator.hide();
					MessageBox.success("File Uploaded.", {
						actions: [MessageBox.Action.OK],
						onClose: function (oAction) {
							if (oAction === "OK") {
								oView.getModel(model).refresh(true);
							}
						}
					});
				},
				error: function (error) {
					//	oView.setBusy(false);
					BusyIndicator.hide();
					// MessageBox.show("Error while Creation.", {
					// 	icon: MessageBox.Icon.ERROR,
					// 	title: "ERROR"
					// });
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID, "API");
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}
			});

		},

		_validateBussinessInfoTable: function () {

			if (data.VISIBLE[0].S1G4T2F1 === null && data.VISIBLE[0].S1G4T3F1 === null && data.VISIBLE[0].S1G4T4F1 === null &&
				data.VISIBLE[0].S1G4T5F1 === null && data.VISIBLE[0].S1G4T6F1 === null && data.VISIBLE[0].S1G4T7F1 === null) {
				this.getView().byId("bussinessInfoTable_Id").setVisible(false);
			}
		},

		//Financial information logics

		onBack: function () {
			var that = this;
			var Loglength = logData.length;
				// oView.getModel("blankJson").setData(null);
				// blanckJsonModel.setData("");
			if (Loglength > 0) {
				if (!that.filterfrag) {
					that.filterfrag = sap.ui.xmlfragment("com.ibs.ibsappidealdealerprofile.view.fragments.commentDialog", that);
					that.getView().addDependent(that.filterfrag);
				}
				that.filterfrag.open();
				sap.ui.getCore().byId("idApproveDialog").setTitle("Changes will be lost. Do you want to save?");
				sap.ui.getCore().byId("id_yes").setVisible(true);
				sap.ui.getCore().byId("id_no").setVisible(true);
				sap.ui.getCore().byId("id_approve").setVisible(false);
				sap.ui.getCore().byId("id_cancel").setVisible(false);
			}
			else{
				ndaUploadArray = [];
				ndaDeleteArray = [];
				this.getView().byId("messagePopoverBtn").setVisible(false);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				BusyIndicator.show(0);
				jQuery.sap.delayedCall(300, this, function () {
					oRouter.navTo("RouteDetailPage", {
						SAPVENDORNO: loginData.SAP_DIST_CODE
					});
				});
			}
			
		},

		_qualityCert: function () {
			var oFilters = [];
			myJSONModel11 = new JSONModel();
			var sEntity = "/VenOnboardDiscQaCertif";
			var F1 = new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.EQ, obrNo);
			oFilters.push(F1);
			oModel.read(sEntity, {
				filters: oFilters,
				success: function (Data) {

					myJSONModel11.setData(Data);
					context.getView().setModel(myJSONModel11, "qualCert");
					var len = Data.results.length;
					context.getView().byId("table_qualityId").setVisibleRowCount(len);
				},
				error: function (error) {
					// MessageToast.show("cannot read data");
					// context.errorLogCreation(error.responseText, error.statusCode, obrNo,
					// 	context._sUserID);
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText
					}

					MessageBox.error(oXMLMsg);
				}
			});
		},

		_updatedRecords: function () {

			var oModel1 = new sap.ui.model.json.JSONModel();
			oModel1.setData(data);

			this.getView().setModel(oModel1, "updateRecord");
		},

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

		handleRefreshEvents: function () {
			var that = this;
			that._readTimelineData();
		},

		handleSideContentHide: function () {
			this.getView().byId("DynamicSideContent").setShowSideContent(false);
		},

		handleEvents: function () {
			this.getView().byId("DynamicSideContent").setShowSideContent(true);
		},

		// onBack: function(){
		// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 	oRouter.navTo("vendorDetails", {
		// 		OBRNO: obrNo
		// 	});
		// }

	});

});