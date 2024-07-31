// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealregistrationform.controller.vendorForm", {
//         onInit: function () {

//         }
//     });
// });

sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/ui/core/BusyIndicator",
	"sap/m/Token",
	"com/ibs/ibsappidealregistrationform/model/validations",
	"com/ibs/ibsappidealregistrationform/model/formatter",
	"com/ibs/ibsappidealregistrationform/model/down",

], function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, MessageBox, History, MessagePopover,
	MessageItem, BusyIndicator, Token, validations, formatter, down) {
	"use strict";
	var context = null;
	var oView = null;
	var oRouter = null;
	var section = null;
	var updateId = []; //komal
	var blankObject = {}; //komal
	var loginData = "";
	var vModel = "";
	var mandatoryModel = "";
	var labelModel = "";
	var oId = "";
	var cId = "";
	var bId = "";
	var that;
	var currentDate = null;
	var postalCodeLength = null;
	var registerPincode = null;
	var maxCount = null;
	// var draftInd = "";
	var supplierCategoryKeys = "";
	var supplierCategoryText = "";
	var spliceInd = "NA";
	var vatIndicator = null;
	var appModulePath;
	var busniessTypeKeys = "";
	var busniessTypeText = "";

	return BaseController.extend("com.ibs.ibsappidealregistrationform.controller.vendorForm", {
		formatter: formatter,
		onInit: function () {

			context = this;
			that = this;
			var userAttributes = this.getOwnerComponent().getModel("userAttriJson").getData();
			context.UserId = userAttributes.userId;
			oView = context.getView();
			context.wizar = oView.byId("CreateProductWizard");
			context.cloudService = context.getOwnerComponent().getModel("cloudService");
			context.oDataModel = context.getOwnerComponent().getModel("onPremiseModel");

			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);

			oRouter = context.getOwnerComponent().getRouter();
			// oView.addStyleClass(context.getOwnerComponent().getContentDensityClass());

			var getRoute = oRouter.getRoute("vendorForm");
			getRoute.attachPatternMatched(context._onObjectMatched, this);
			this.getView().byId("wizardContentPage").setShowFooter(true);

			this.dynamicCountModel();
			this._setBlankJsonModel(this._getBlankObject());

			currentDate = new Date();
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});

			oView.byId("cID").setText(dateFormat.format(currentDate));

			var oMinDateModel = new JSONModel({
				minDate: new Date()
			});
			oView.setModel(oMinDateModel, "minDateModel");

			var localObject = {
				"ibanNum": false,
				"ibanLength": 34,
				"bankNameEdit": false,
				"icv_percentage": true,
				"icv_validity": true,
				"icv_fileUpload": true,
				"icv_select": 0,
				"icv_sForm": true,
				"icv_table": true,
				"G23ICVID": false,
				"regex_HQ": null,
				"pcode_HQformat": null,
				"regex_OTH:": null,
				"pcode_OTHformat": null,
				"regex_MDCont": null,
				"pcode_MDformat": null,
				"regexOTHCont": null,
				"pcode_OTHCont": null
			}
			var localJson = new JSONModel();
			localJson.setData(localObject);
			oView.setModel(localJson, "localModel");
		},

		_onObjectMatched: function (oEvent) {

			if (context.getOwnerComponent().getModel("loginData") === undefined) {
				BusyIndicator.hide();
				oRouter.navTo("Routehome", true);
				return;
			}

			this.readAttachData();
			this.readCountrySet();
			this.readAddressType();
			this.readTelecodeSet();
			loginData = context.getOwnerComponent().getModel("loginData").getData();

			if (loginData.BP_TYPE_CODE !== "B") {
				loginData.LOGINDATA_BP_TYPE_CODE = loginData.BP_TYPE_CODE;
			}
			var eJson = new JSONModel(loginData);
			oView.setModel(eJson, "eJson");

			this.readDraft(loginData.REQUEST_NO, loginData.ENTITY_CODE, loginData.CREATION_TYPE);
			// this.readEntitySets("GetAccountGrpSet", "supplierTypeJson");
			// this.readEntitySets("GetMaterialGrpSet", "supplierCategoryJson");

			oView.getModel("blankJson").setProperty("/headerData/DIST_NAME1", loginData.DIST_NAME1);

			if (loginData.STATUS === 7) {
				this.readComments(loginData.REQUEST_NO);
			}
			BusyIndicator.hide(0);
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
				"BankingDetails": [],
				"busHistory": [],
				"customerDetail": [],
				"finInfo": [],
				"ownerInfo": [{
					"NAME": null,
					"NATIONALITY": null,
					"CONTACT_TELECODE": null,
					"CONTACT_NO": null,
					"PASSPORT_NO": null,
					"ACTIVITY_TYPE": null,
					"OWNERSHIP_PERCENT": null
				}],
				"productInfo": [{
					"TYPE": "",
					"PROD_NAME": null,
					"PROD_DESCRIPTION": null,
					"PROD_CATEGORY": null,
					"PROD_CATEGORY_DEC": null
				}],
				"operationalCap": [{
					"CITY": null,
					"COUNTRY": null,
					"PLANT_MANF_CAPABILITY": null,
					"PROD_CAPACITY": null,
					"TIME_TO_SERVICE": null
				}],
				"clientInfo": [{
					"CUSTOMER_NAME": null,
					"CUSTOMER_SHARE": null
				}],
				"OEMInfo": [{
					"OEM_TYPE": "OEM_EX",
					"COMPANY_NAME": null,
					"COUNTRY": null,
					"OEM_CATEGORY": null
				}],
				"NONOEMInfo": [{
					"OEM_TYPE": "OEM_NE",
					"COMPANY_NAME": null,
					"COUNTRY": null,
					"OEM_CATEGORY": null
				}],
				"disclousers": {
					"INTEREST_CONFLICT": -1,
					"ANY_LEGAL_CASES": -1,
					"ACADEMIC_DISCOUNT": -1,
					"RELATIVE_WORKING": -1,
					"REACH_COMPLIANCE": -1,
					"CLP_COMPLIANCE": -1,
					"APPLY_ITAR_REG": -1,
					"SUPPLY_ITAR_EAR": -1,
					"APPLY_FCPA": -1,
					"US_ORIGIN_SUPPL": -1,
					"ERP_MGMT_SYSTEM": -1,
					"INDUSRIAL_DESIGN_SW": -1,
					"COUNTERFIET_PARTS_PCD": -1,
					"MANUFACTURING_PCD": -1,
					"PLAN_COLLECTION": -1,
					"CONFIG_CTRL_SYSTEM": -1,
					"CONT_IMPROVEMENT_PROG": -1,
					"QUALITY_AGREEMENT": -1,
					"TECH_SPEC_MFG_SRV": -1,
					"ANALYSIS_RISKMGMT_PROC": -1,
					"CTRL_PLANNING_PROC": -1,
					"EPI_QUALITY_SUPPL_REQ": -1,
					"SUPPL_EVAL_PROC": -1,
					"TECH_SPEC_MATERIAL": -1,
					"CTRL_ORDERS_DOC_PROC": -1,
					"NON_CONF_ANALYSIS": -1,
					"MATERIAL_INSPECTION_TESTS": -1,
					"TECHNICAL_DOC_PROC": -1,
					"QUALIFIED_STAFF": -1,
					"PROC_FOR_INCOMING": -1,
					"INTERAL_QUAL_AUDITS": -1,
					"NON_CONF_TREATMENT_PROC": -1,
					"IDENTIFICATION_METHOD": -1,
					"WORK_INSTRUCTION_METHODS": -1,
					"PLANNING_CONTROL_SYSTEM": -1,
					"QUALIFICATION_ARRAY": -1,
					"MFG_INSPECTION_TESTS": -1,
					"MEASURING_EQUIP_CALIB": -1,
					"REPTITIVE_CAUSES_PROC": -1,
					"MAINTENANCE_SCHEDULES": -1,
					"DOCUMENTED_PROC": -1,
					"CRITERIA_COLLECT_PROC": -1,
					"ESTAB_CRITERIA": -1,
					"COMP_BASED_WMS": -1,
					"DEFINED_POLICIES": -1,
					"CUSTOMER_SERVICE": -1,
					"MASS_SERIES_PROD": -1,
					"TECH_SUPPORT": -1,
					"SFTY_ENVI_POLICY": -1,
					"ENVI_FRIENDLY_PROD": -1,
					"SUSTAINABILITY_PROG": -1,
					"COMPLY_LABOR_REG": -1,
					"REQUIRE_EUC": -1,
					"EXPORT_CNTRL": -1

				},
				"relationName": [{
					"NAME": null,
					"RELATIONSHIP": null
				}],
				"qualityCertificate": [{
					"CERTI_TYPE": "",
					"CERTI_NAME": "ISO 9001:2015",
					"DONE_BY": "",
					"AVAILABLE": ""
					// "AVAILABLE": -1
				}, {
					"CERTI_TYPE": "",
					"CERTI_NAME": "EN 9100",
					"DONE_BY": "",
					"AVAILABLE": ""
					// "AVAILABLE": -1
				}, {
					"CERTI_TYPE": "",
					"CERTI_NAME": "ISO TS 16949",
					"DONE_BY": "",
					"AVAILABLE": ""
					// "AVAILABLE": -1
				}, {
					"CERTI_TYPE": "",
					"CERTI_NAME": "UNE EN ISO 3834",
					"DONE_BY": "",
					"AVAILABLE": ""
					// "AVAILABLE": -1
				}, {
					"CERTI_TYPE": "",
					"CERTI_NAME": "AQAP 2110; 2120; 2130",
					"DONE_BY": "",
					"AVAILABLE": ""
					// "AVAILABLE": -1
				}, {
					"CERTI_TYPE": "",
					"CERTI_NAME": "ISO 14001",
					"DONE_BY": "",
					"AVAILABLE": ""
					// "AVAILABLE": -1
				}, {
					"CERTI_TYPE": "",
					"CERTI_NAME": "OHSAS 18001",
					"DONE_BY": "",
					"AVAILABLE": ""
					// "AVAILABLE": -1
				}, {
					"CERTI_TYPE": "",
					"CERTI_NAME": "If not, are you planning certification?",
					"DONE_BY": "",
					"AVAILABLE": ""
					// "AVAILABLE": -1
				}],
				"attachFields": [],
				"attachments": [],
				"events": []
			};
			return JSON.parse(JSON.stringify(jsonObject));
		},

		dynamicCountModel: function () {

			var obj = {
				"LocalTradeCount": 0,
				"IBANMandatoryCount": 0,
				"routingCodeCount": 0,
				"otherCodeCount": 0,
				"ICVMandatoryCount": 0,
				"VATMandatoryCount": 0,
				"AttachmentsRadioCount": 0,
				"AttachmentsRadioFlag": null,
				"AcknowledgementCount": 0
			}
			var oModel = new JSONModel(obj);
			this.getView().setModel(oModel, "dynamicCountModel");
		},

		dynamicMandatoryFieldCount: function (headerArray, data) {

			var MandatoryField = 0;
			var localData = oView.getModel("localModel");
			var bankData = this.getBankData(data);
			var icvcount = oView.getModel("dynamicCountModel").getProperty("/ICVMandatoryCount");
			var ICVAttachementData = oView.getModel("G23Json").getData()[0];

			if (headerArray[0].TRADE_LIC_NO !== null && loginData.SUPPLIERTYPE_CODE !== "ZGOV" &&
				loginData.SUPPLIERTYPE_CODE !== "ZUNI") {
				MandatoryField = MandatoryField + 1;
			}

			if (loginData.BP_TYPE_CODE === "B" && headerArray[0].TRADE_LIC_NO_DATE !== null && loginData.SUPPLIERTYPE_CODE !== "ZGOV" &&
				loginData.SUPPLIERTYPE_CODE !== "ZUNI") {
				MandatoryField = MandatoryField + 1;
			}

			if (localData.getProperty("/ibanNum") === true && bankData[0].IBAN_NUMBER !== null) {
				MandatoryField = MandatoryField + 1;
			}

			if (headerArray[0].VAT_REG_NUMBER !== null && headerArray[0].VAT_CHECK === "Y") {
				MandatoryField = MandatoryField + 1;
			}

			if (headerArray[0].VAT_REG_DATE !== null && headerArray[0].VAT_CHECK === "Y") {
				MandatoryField = MandatoryField + 1;
			}
			if (headerArray[0].ICV_SCORE !== null && headerArray[0].ICV_CHECK === "Y") {
				MandatoryField = MandatoryField + 1;
			}

			if (headerArray[0].ICV_DATE !== null && headerArray[0].ICV_CHECK === "Y") {
				MandatoryField = MandatoryField + 1;
			}

			if (ICVAttachementData !== undefined && (ICVAttachementData.FILE_NAME !== "" && ICVAttachementData.FILE_NAME !== null) &&
				headerArray[0].ICV_CHECK === "Y") {
				MandatoryField = MandatoryField + 1;
			}
			return MandatoryField;
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
				"EMAIL": null,
				"DISTRICT": null
			};
			oView.getModel("blankJson").setProperty("/address", headOffAddress);

			//other office address model
			var otherOfficeAddress = [{
				"ADDRESS_TYPE": "OTH",
				"ADDRESS_DESC": "Other Office",
				"ADDR_CODE": null,
				"HOUSE_NUM1": "",
				"STREET1": null,
				"STREET2": null,
				"STREET3": null,
				"STREET4": null,
				"CITY": null,
				"CITY_DESC": null,
				"COUNTRY": null,
				"COUNTRY_DESC": null,
				"STATE": null,
				"REGION_DESC": null,
				"POSTAL_CODE": null,
				"CONTACT_TELECODE": null,
				"CONTACT_NO": null,
				"EMAIL": null,
				"DISTRICT": null
			}];
			oView.getModel("blankJson").setProperty("/otherAddress", otherOfficeAddress);

			var mdContect = {
				"CONTACT_TYPE": "HOD",
				"NAME1": null,
				"NAME2": null,
				"DESIGNATION": null,
				"NATIONALITY": null,
				"COUNTRY_DESC": null, //12-10-2022
				"STATE": null, //12-10-2022
				"REGION_DESC": null, //12-10-2022
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
				"BP_ID": null,
				"LOC_NO": 1,
				"LOC_TYPE": "LT"
			}
			oView.getModel("blankJson").setProperty("/MDContact", mdContect);

			var otherCnt = [{
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
				"POSTAL_CODE": null,
				"STATE": null,
				"BP_ID": null,
				"LOC_NO": 1,
				"LOC_TYPE": "LT"
			}];
			oView.getModel("blankJson").setProperty("/contact", otherCnt);

			var mainBank = {
				"BANK_ID": null,
				"BANK_NO": null,
				"BANK_CURRENCY": null,
				"BANK_COUNTRY": null,
				"COUNTRY_DESC": null,
				"ACCOUNT_NAME": null,
				"ACCOUNT_HOLDER": null,
				"BANK_KEY": null,
				"ACCOUNT_NO": null,
				"BENEFICIARY": null,
				"BIC_CODE": null,
				"DUNS_NUMBER": null,
				"IBAN_NUMBER": null,
				"INVOICE_CURRENCY": null,
				"NAME": null,
				"BRANCH_NAME": null,
				"OTHER_CODE_NAME": null,
				"OTHER_CODE_VAL": null,
				"PAYMENT_METHOD": null,
				"PAYMENT_METHOD_DESC": null,
				"PAYMENT_TERMS": null,
				"PAYMENT_TERMS_DESC": null,
				"ROUTING_CODE": null,
				"SWIFT_CODE": null,
				"VAT_REG_DATE": null,
				"VAT_REG_NUMBER": null,
				"PAYMENT_TYPE": "PRI"
			};
			oView.getModel("blankJson").setProperty("/bankDetails", mainBank);

			var busiHistoryArray = [{
				"DEALERSHIP": null,
				"SUPPLIER_NAME": null,
				"SINCE": null,
				"PROD_GROUP": null,
				"PURCHASES": null
			}];
			oView.getModel("blankJson").setProperty("/busHistory", busiHistoryArray);

			var customerArray = [{
				"CUST_NO": null,
				"CUSTOMER_NAME": null,
				"YEAR1": null,
				"YEAR2": null
			}];
			oView.getModel("blankJson").setProperty("/customerDetail", customerArray);

			var promArray = [{
				"NAME": null,
				"QUALIFICATION": null,
				"WORK_EXP": null,
				"YRS_IN_COMP": null,
				"DESIGNATION": null,
				"ROLE": null
			}];
			oView.getModel("blankJson").setProperty("/promotors", promArray);
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
			oView.byId("table_finId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/finInfo").length);

			//4//22

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").setProperty("/finInfo", financialInfo);
			}
		},

		readAttachData: function () {
			oView.setBusy(true);
			var G5 = [];
			for (var i = 0; i <= 1; i++) {
				var year = (parseInt(new Date().getFullYear())) - (i + 1);
				G5.push({
					"GROUP2": "G5",
					"SR_NO": null,
					"OT_DOC_ID": null,
					"FILE_CONTENT": null,
					"FILE_MIMETYPE": "",
					"EXPIRY_DATE": null,
					"FILE_NAME": "",
					"TYPE": "ONB",
					"DESCRIPTION": "Financial Statement " + year,
					"ATTACH_SHORT_DEC": "_FS_" + year + "_" + Math.floor(100 + Math.random() * 900),
					"UPDATE_FLAG": null,
					"ATTACH_VALUE": null,
					"CODE": 16
				});
			}
			var grp5Model = new JSONModel();
			grp5Model.setData(G5);
			oView.setModel(grp5Model, "G5Json");


			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterAttachmentTypes";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (data, response) {


					// added on 11-04-2023 by Inder Chouhan	Error Message if Response is Empty							
					if (data.value.length > 0) {
						var
							G1 = [],
							G2 = [],
							G3 = [],
							G4 = [],
							G6 = [],
							G7 = [],
							G8 = [],
							G9 = [],
							G10 = [],
							G11 = [],
							G12 = [],
							G13 = [],
							G14 = [],
							G15 = [],
							G16 = [],
							G17 = [],
							G18 = [],
							G19 = [],
							G20 = [],
							G21 = [],
							G22 = [],
							G23 = [],
							G24 = [],
							G25 = [],
							G26 = [],
							G27 = [],
							G28 = [];

						for (var i = 0; i < data.value.length; i++) {

							data.value[i].FILE_CONTENT = null;
							data.value[i].SR_NO = null;
							data.value[i].OT_DOC_ID = null;
							data.value[i].FILE_MIMETYPE = null;
							data.value[i].EXPIRY_DATE = null;
							data.value[i].FILE_NAME = "";
							data.value[i].DRAFT_IND = null;
							data.value[i].UPDATE_FLAG = null;
							data.value[i].ATTACH_VALUE = null; //23-09-2022
							//	data.value[i].ATTACH_SHORT_DEC = data.value[i].SHORT_DESCRIPTION + "_1";
							data.value[i].ATTACH_SHORT_DEC = data.value[i].SHORT_DESCRIPTION + "_" + Math.floor(100 + Math.random() * 900);

							if (data.value[i].GROUP2 === "G1") {
								G1.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G2") {
								G2.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G3") {
								G3.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G4") {
								G4.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G6") {
								data.value[i].FLAG = "Yes";
								G6.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G7") {
								data.value[i].FLAG = "Yes";
								G7.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G8") {

								G8.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G9") {
								data.value[i].FLAG = "Yes";
								G9.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G10") {
								data.value[i].FLAG = "Yes";
								G10.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G11") {
								G11.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G12") {
								G12.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G13") {
								G13.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G14") {
								G14.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G15") {
								G15.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G16") {
								G16.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G17") {
								G17.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G18") {
								G18.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G19") {
								G19.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G20") {
								G20.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G21") {
								G21.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G22") {
								G22.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G23") {
								G23.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G24") {
								G24.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G25") {
								G25.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G26") {
								G26.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G27") {
								G27.push(data.value[i]);
							} else if (data.value[i].GROUP2 === "G28") {
								G28.push(data.value[i]);
							}
						}

						var grp1Model = new JSONModel();
						grp1Model.setData(G1);
						oView.setModel(grp1Model, "G1Json");

						var grp2Model = new JSONModel();
						grp2Model.setData(G2);
						oView.setModel(grp2Model, "G2Json");

						var grp3Model = new JSONModel();
						grp3Model.setData(G3);
						oView.setModel(grp3Model, "G3Json");

						var grp6Model = new JSONModel();
						grp6Model.setData(G6);
						oView.setModel(grp6Model, "G6Json");

						var grp7Model = new JSONModel();
						grp7Model.setData(G7);
						oView.setModel(grp7Model, "G7Json");

						var grp8Model = new JSONModel();
						grp8Model.setData(G8);
						oView.setModel(grp8Model, "G8Json");

						var grp9Model = new JSONModel();
						grp9Model.setData(G9);
						oView.setModel(grp9Model, "G9Json");

						var grp10Model = new JSONModel();
						grp10Model.setData(G10);
						oView.setModel(grp10Model, "G10Json");

						var grp4Model = new JSONModel();
						grp4Model.setData(G4);
						oView.setModel(grp4Model, "G4Json");

						var grp11Model = new JSONModel();
						grp11Model.setData(G11);
						oView.setModel(grp11Model, "G11Json");

						var grp12Model = new JSONModel();
						grp12Model.setData(G12);
						oView.setModel(grp12Model, "G12Json");

						var grp13Model = new JSONModel();
						grp13Model.setData(G13);
						oView.setModel(grp13Model, "G13Json");

						var grp14Model = new JSONModel();
						grp14Model.setData(G14);
						oView.setModel(grp14Model, "G14Json");

						var grp15Model = new JSONModel();
						grp15Model.setData(G15);
						oView.setModel(grp15Model, "G15Json");

						var grp16Model = new JSONModel();
						grp16Model.setData(G16);
						oView.setModel(grp16Model, "G16Json");

						var grp17Model = new JSONModel();
						grp17Model.setData(G17);
						oView.setModel(grp17Model, "G17Json");

						var grp18Model = new JSONModel();
						grp18Model.setData(G18);
						oView.setModel(grp18Model, "G18Json");

						var grp19Model = new JSONModel();
						grp19Model.setData(G19);
						oView.setModel(grp19Model, "G19Json");

						var grp20Model = new JSONModel();
						grp20Model.setData(G20);
						oView.setModel(grp20Model, "G20Json");

						var grp21Model = new JSONModel();
						grp21Model.setData(G21);
						oView.setModel(grp21Model, "G21Json");

						var grp22Model = new JSONModel();
						grp22Model.setData(G22);
						oView.setModel(grp22Model, "G22Json");

						var grp23Model = new JSONModel();
						grp23Model.setData(G23);
						oView.setModel(grp23Model, "G23Json");

						var grp24Model = new JSONModel();
						grp24Model.setData(G24);
						oView.setModel(grp24Model, "G24Json");

						var grp25Model = new JSONModel();
						grp25Model.setData(G25);
						oView.setModel(grp25Model, "G25Json");

						var grp26Model = new JSONModel();
						grp26Model.setData(G26);
						oView.setModel(grp26Model, "G26Json");

						var grp27Model = new JSONModel();
						grp27Model.setData(G27);
						oView.setModel(grp27Model, "G27Json");

						var grp28Model = new JSONModel();
						grp28Model.setData(G28);
						oView.setModel(grp28Model, "G28Json");

						oView.setBusy(false);
						context.setNDADescription();
					} else {
						console.log("Error while reading VendorInvite data")
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

		setNDADescription: function () {

			var type = null;
			if (loginData.NDA_TYPE === "OU") {
				type = "Unilateral NDA";
			} else if (loginData.NDA_TYPE === "OM") {
				type = "Mutual NDA";
			} else if (loginData.NDA_TYPE === "LM") {
				type = "Mutual NDA"
			} else if (loginData.NDA_TYPE === "LU") {
				type = "Unilateral NDA";
			}
			oView.getModel("G10Json").getData()[0].DESCRIPTION = type;
			oView.getModel("G10Json").refresh(true);
		},

		handleOtherAddress: function () {

			oView.getModel("blankJson").getProperty("/otherAddress").push({
				"ADDRESS_TYPE": "OTH",
				"ADDRESS_DESC": "Other Office",
				"ADDR_CODE": null,
				"HOUSE_NUM1": "",
				"STREET1": null,
				"STREET2": null,
				"STREET3": null,
				"STREET4": null,
				"CITY": null,
				"CITY_DESC": null,
				"STATE": null,
				"REGION_DESC": null,
				"COUNTRY": null,
				"COUNTRY_DESC": null,
				"POSTAL_CODE": null,
				"CONTACT_TELECODE": null,
				"CONTACT_NO": null,
				"EMAIL": null,
				"DISTRICT": null
			});


			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/otherAddress").push({
					"ADDRESS_TYPE": "OTH",
					"ADDRESS_DESC": "Other Office",
					"ADDR_CODE": null,
					"HOUSE_NUM1": "",
					"STREET1": null,
					"STREET2": null,
					"STREET3": null,
					"STREET4": null,
					"CITY": null,
					"CITY_DESC": null,
					"STATE": null,
					"REGION_DESC": null,
					"COUNTRY": null,
					"COUNTRY_DESC": null,
					"POSTAL_CODE": null,
					"CONTACT_TELECODE": null,
					"CONTACT_NO": null,
					"EMAIL": null,
					"DISTRICT": null
				});
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("trAddId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherAddress").length);
		},

		requiredFieldCount: function (sId) {

			var aTableColumns = oView.byId(sId).getColumns();
			var iTableCount = 0
			for (var index = 0; index < aBankTable.length; index++) {
				// othercode and other val is using same id.
				if (aTableColumns[index].mAggregations.label.getRequired() === true && aTableColumns[index].mAggregations.label.getText() !== '') {
					iTableCount = iTableCount + 1;
				}
			}
			return iTableCount;
		},

		handleDeleteOtherAddress: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/otherAddress").splice(index, 1);
			oView.getModel("blankJson").refresh(true);
			oView.byId("trAddId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherAddress").length);


			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/otherAddress").splice(index, 1);
			}
		},

		handleOtherContactDetails: function () {
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
				"POSTAL_CODE": null,
				"STATE": null,
				"BP_ID": null,
				"LOC_NO": 1,
				"LOC_TYPE": "LT"
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
					"BP_ID": null,
					"LOC_NO": 1,
					"LOC_TYPE": "LT"
				});
			}
		},

		deleteContactDetails: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/contact").splice(index, 1);
			oView.getModel("blankJson").refresh(true);
			oView.byId("table_contactId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/contact").length);


			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/contact").splice(index, 1);
			}
		},

		handleOwnersInfo: function () {

			oView.getModel("blankJson").getProperty("/ownerInfo").push({
				"NAME": null,
				"NATIONALITY": null,
				"CONTACT_TELECODE": null,
				"CONTACT_NO": null,
				"PASSPORT_NO": null,
				"ACTIVITY_TYPE": null,
				"OWNERSHIP_PERCENT": null
			});


			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/ownerInfo").push({
					"NAME": null,
					"NATIONALITY": null,
					"CONTACT_TELECODE": null,
					"CONTACT_NO": null,
					"PASSPORT_NO": null,
					"ACTIVITY_TYPE": null,
					"OWNERSHIP_PERCENT": null
				});
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("table_ownerId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/ownerInfo").length);
		},

		deleteOwnersDetails: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			if (index === "0") {
				var iOwnerObj = oView.getModel("blankJson").getProperty("/ownerInfo")[0];
				iOwnerObj.NAME = null,
					iOwnerObj.NATIONALITY = null,
					iOwnerObj.CONTACT_TELECODE = null,
					iOwnerObj.CONTACT_NO = null,
					iOwnerObj.PASSPORT_NO = null,
					iOwnerObj.OWNERSHIP_PERCENT = null,
					iOwnerObj.ACTIVITY_TYPE = null
			} else {
				oView.getModel("blankJson").getProperty("/ownerInfo").splice(index, 1);
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("table_ownerId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/ownerInfo").length);


			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/ownerInfo").splice(index, 1);
			}
		},

		readDraft: function (ReqNo, ReqEntity, CreateType) {

			oView.setBusy(true);
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/GetDraftData(requestNo=" + ReqNo + ",entityCode='" + ReqEntity + "',creationType=" + CreateType + ",userId='" + context.UserId + "',userRole='DISTRIBUTOR')";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (oData, response) {

					oView.setBusy(false);
					var data = oData;

					if (data.value[0].DRAFT.ADDRESS.length !== 0) {

						if ((data !== undefined || data !== null || data !== '') && data.value[0].CLIENT_INFO.CLIENT_COUNTRY === data.value[0].DRAFT.ADDRESS[0].COUNTRY) {
							loginData.BP_TYPE_CODE = "B";
						}
					}

					var loginJsonData = new JSONModel();
					loginJsonData.setData(data.value[0].CLIENT_INFO);
					context.getView().setModel(loginJsonData, "loginJsonData");

					context.clientCountry = data.value[0].CLIENT_INFO.CLIENT_COUNTRY;

					var olabelJson = new JSONModel();
					olabelJson.setData(data.value[0].LABELS[0]);
					oView.setModel(olabelJson, "labelJson");

					context.validateLocalCountry();

					var openTextJson = new JSONModel();
					openTextJson.setData(data.value[0].OPENTEXT);
					oView.setModel(openTextJson, "openTextJson");

					context.draftDataBinding(data.value[0], "");
					BusyIndicator.hide();
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

		handleSampleData: function () {

			var draftData = this.getOwnerComponent().getModel("SampleModel2").getData();

			draftData.VISIBLE = [oView.getModel("visibleJson").getData()];

			draftData.MANDATORY = [oView.getModel("mandatoryJson").getData()];

			draftData.CLIENT_INFO = oView.getModel("loginJsonData").getData();

			if (context.clientCountry === draftData.DRAFT.ADDRESS[0].COUNTRY) {
				loginData.LOGINDATA_BP_TYPE_CODE = loginData.BP_TYPE_CODE;
				loginData.BP_TYPE_CODE = "B";

				context.validateLocalCountry();
			}

			draftData.DRAFT.MAIN[0].DIST_NAME1 = loginData.DIST_NAME1;
			draftData.DRAFT.MAIN[0].REGISTERED_ID = loginData.REGISTERED_ID;

			this.draftDataBinding(draftData, "sampleData");
		},

		draftDataBinding: function (data, sample) {

			var data2 = JSON.parse(JSON.stringify(data));
			var regAddress = [],
				contacts = []
			var OEM = [];
			var NonOEM = [];
			var otherBankDetails = [];
			this.totalCount = data.TOTALCOUNT;
			this.progressIndicatorFlag = data.SETTINGS.REGFORM_PROGRESSBAR || null;

			if (sample !== "sampleData") {

				var oSettingModel = new JSONModel();
				oSettingModel.setData(data.SETTINGS);
				oView.setModel(oSettingModel, "iVenSettingsModel");

				var ovisibleJson = new JSONModel();
				ovisibleJson.setData(data.VISIBLE[0]);
				oView.setModel(ovisibleJson, "visibleJson");

				var omandatoryJson = new JSONModel();
				omandatoryJson.setData(data.MANDATORY[0]);
				oView.setModel(omandatoryJson, "mandatoryJson");

				var olabelJson = new JSONModel();
				olabelJson.setData(data.LABELS[0]);
				oView.setModel(olabelJson, "labelJson");
			}

			if (data.DRAFT !== null) {

				if (data.DRAFT.MAIN.length !== 0) {
					data.DRAFT.MAIN[0].DIST_CODE = loginData.DIST_CODE;
					data.DRAFT.MAIN[0].DIST_NAME1 = loginData.DIST_NAME1;
					data.DRAFT.MAIN[0].REGISTERED_ID = loginData.REGISTERED_ID;
					if (data.DRAFT.MAIN[0].SECONDARY_EMAILS_ID !== null) {
						var secondaryEmails = data.DRAFT.MAIN[0].SECONDARY_EMAILS_ID.split(";");
						var oMultiInput1 = oView.byId("multiInput1");
						var tokensArr = [];
						for (var a = 0; a < secondaryEmails.length; a++) {
							if (secondaryEmails[a] !== "") {
								var token = new Token({
									text: secondaryEmails[a],
									key: secondaryEmails[a]
								});
								tokensArr.push(token);
							}
						}
						oMultiInput1.setTokens(tokensArr);
					}

					if (data.DRAFT.MAIN[0].VAT_REG_DATE !== null) {
						data.DRAFT.MAIN[0].VAT_REG_DATE = new Date(data.DRAFT.MAIN[0].VAT_REG_DATE);
					}

					if (data.DRAFT.MAIN[0].LIC_NO_DATE !== null) {
						data.DRAFT.MAIN[0].LIC_NO_DATE = new Date(data.DRAFT.MAIN[0].LIC_NO_DATE);
					}

					if (data.DRAFT.MAIN[0].PROPOSAL_DATE !== null) {
						data.DRAFT.MAIN[0].PROPOSAL_DATE = new Date(data.DRAFT.MAIN[0].PROPOSAL_DATE);
					}

					if (data.DRAFT.MAIN[0].VAT_CHECK === "Y") {
						oView.getModel("dynamicCountModel").setProperty("/VATMandatoryCount", 2);
						oView.byId("rbg4").setSelectedIndex(0);
						oView.byId("simpleForm9").setVisible(true);
						oView.getModel("localModel").setProperty("/VatNumber", true);
						oView.getModel("localModel").setProperty("/VatDate", true);
						//oView.byId("id_vatevidence").setVisible(false);
						//oView.byId("msgStripId4").setVisible(false);
					} else if (data.DRAFT.MAIN[0].VAT_CHECK === "N") {
						oView.getModel("dynamicCountModel").setProperty("/VATMandatoryCount", 0);
						oView.byId("rbg4").setSelectedIndex(1);
						oView.byId("simpleForm9").setVisible(false);
						oView.getModel("localModel").setProperty("/VatNumber", false);
						oView.getModel("localModel").setProperty("/VatDate", false);
						// oView.byId("id_vatevidence").setVisible(false);
						// oView.byId("msgStripId4").setVisible(false);
					}
					oView.getModel("blankJson").setProperty("/headerData", data.DRAFT.MAIN[0]);

					if (data.DRAFT.MAIN[0].LIC_NO !== null) {
						data.DRAFT.MAIN[0].LIC_NO = data.DRAFT.MAIN[0].LIC_NO;
					}

					if (loginData.REQUEST_TYPE === 5) {
						if (loginData.DIST_CODE === "LG") {
							if (data.DRAFT.MAIN[0].LIC_NO) {
								oView.byId("S1G6T1F4").setEditable(false);
								oView.byId("S1G6T1F5_id2").setEditable(true);
							}
							else {
								oView.byId("S1G6T1F4").setEditable(true);
								oView.byId("S1G6T1F5_id2").setEditable(true);
							}
						}
						else if (loginData.DIST_CODE === "NR") {
							oView.byId("S1G6T1F4").setEditable(false);
							oView.byId("S1G6T1F5_id2").setEditable(true);
						}
					}
				}

				// added on 10-04-2023 by Inder Chouhan	Created new If For Trade License Mandory Issue
				if (data.DRAFT.ADDRESS.length !== 0) {
					for (var i = 0; i < data.DRAFT.ADDRESS.length; i++) {
						if (data.DRAFT.ADDRESS[i].ADDRESS_TYPE === "HQ") {
							data.DRAFT.ADDRESS[i].REQUEST_NO = loginData.REQUEST_NO;
							oView.getModel("blankJson").setProperty("/address", data.DRAFT.ADDRESS[0]);
							context.readRegionSet(data.DRAFT.ADDRESS[0].COUNTRY, "H");
							context.readCitySet(data.DRAFT.ADDRESS[0].STATE, "H");
							//context.readPostalCodeLength(data.DRAFT.ADDRESS[0].COUNTRY, "H");
						} else {
							data.DRAFT.ADDRESS[i].REQUEST_NO = loginData.REQUEST_NO;
							regAddress.push(data.DRAFT.ADDRESS[i]);
							context.readRegionSet(data.DRAFT.ADDRESS[i].COUNTRY, "R");
							context.readCitySet(data.DRAFT.ADDRESS[i].STATE, "R");
							//context.readPostalCodeLength(data.DRAFT.ADDRESS[i].COUNTRY, "R");
						}
					}

					if (regAddress.length === 0) {
						regAddress.push({
							"ADDRESS_TYPE": "OTH",
							"ADDRESS_DESC": "Other Office",
							"ADDR_CODE": null,
							"HOUSE_NUM1": null,
							"STREET1": null,
							"STREET2": null,
							"STREET3": null,
							"STREET4": null,
							"CITY": null,
							"CITY_DESC": null,
							"COUNTRY": null,
							"COUNTRY_DESC": null,
							"STATE": null,
							"REGION_DESC": null,
							"POSTAL_CODE": null,
							"CONTACT_TELECODE": null,
							"CONTACT_NO": null,
							"EMAIL": null,
							"DISTRICT": null
						})
					}

					oView.getModel("blankJson").setProperty("/otherAddress", regAddress);
					oView.byId("trAddId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherAddress").length);
				}

				if (data.DRAFT.CONTACTS.length != 0) {
					if (data.DRAFT.CONTACTS[0].CONTACT_TYPE === "HOD") {
						data.DRAFT.CONTACTS[0].REQUEST_NO = loginData.REQUEST_NO;
						oView.getModel("blankJson").setProperty("/MDContact", data.DRAFT.CONTACTS[0]);
						context.readRegionSet(data.DRAFT.CONTACTS[0].NATIONALITY, "CH");
						context.readPostalCodeFormates(data.DRAFT.CONTACTS[0].NATIONALITY, "CH");
					}

					for (var k = 0; k < data.DRAFT.CONTACTS.length; k++) {
						if (data.DRAFT.CONTACTS[k].CONTACT_TYPE !== "HOD") {
							data.DRAFT.CONTACTS[k].REQUEST_NO = loginData.REQUEST_NO;
							contacts.push(data.DRAFT.CONTACTS[k]);
						}
					}
					oView.getModel("blankJson").setProperty("/contact", contacts);
					oView.byId("table_contactId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/contact").length);
				}
				else {
					if (contacts.length === 0) {
						contacts.push({
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
							"POSTAL_CODE": null,
							"STATE": null,
							"BP_ID": null,
							"LOC_NO": 1,
							"LOC_TYPE": "LT"
						})
					}
					oView.getModel("blankJson").setProperty("/contact", contacts);
					oView.byId("table_contactId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/contact").length);
				}

				if (data.DRAFT.PAYMENT.length !== 0) {

					for (var i = 0; i < data.DRAFT.PAYMENT.length; i++) {
						if (data.DRAFT.PAYMENT[i].PAYMENT_TYPE === "PRI") {

							if (data.DRAFT.PAYMENT[i].BANK_COUNTRY === "AE") {

							}
							else if (data.DRAFT.PAYMENT[i].BANK_COUNTRY === "IN") {
								oView.getModel("mandatoryJson").oData.S2G1T1F8 = null;
								oView.getModel("mandatoryJson").oData.S2G1T1F9 = "X";
								oView.getModel("mandatoryJson").oData.S2G1T1F12 = "X";
								oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 0);
								oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 2);
							}
							else if (data.DRAFT.PAYMENT[i].BANK_COUNTRY === "US" || data.DRAFT.PAYMENT[i].BANK_COUNTRY === "CA" || data.DRAFT.PAYMENT[i].BANK_COUNTRY === "AU") {
								oView.getModel("mandatoryJson").oData.S2G1T1F8 = "X";
								oView.getModel("mandatoryJson").oData.S2G1T1F9 = null;
								oView.getModel("mandatoryJson").oData.S2G1T1F12 = null;
								oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 1);
								oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 0);
							}
							else {
								oView.getModel("mandatoryJson").oData.S2G1T1F8 = null;
								oView.getModel("mandatoryJson").oData.S2G1T1F9 = null;
								oView.getModel("mandatoryJson").oData.S2G1T1F12 = null;
								oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 0);
								oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 0);
							}
							oView.getModel("blankJson").setProperty("/bankDetails", data.DRAFT.PAYMENT[i]);
							context.readSwiftCode(data.DRAFT.PAYMENT[i].BANK_COUNTRY, "P");
							context.getBankDetails(data.DRAFT.PAYMENT[i].BANK_COUNTRY, data.DRAFT.PAYMENT[i].SWIFT_CODE, "PRI", 0, data.DRAFT.PAYMENT[i].BRANCH_NAME, data.DRAFT.PAYMENT[i].NAME);
							context.readIBANInfo(data.DRAFT.PAYMENT[i].BANK_COUNTRY, "", "SD");
						} else {
							otherBankDetails.push(data.DRAFT.PAYMENT[i]);
							context.readSwiftCode(data.DRAFT.PAYMENT[i].BANK_COUNTRY, "S");
							// context.getBankDetails(data.DRAFT.PAYMENT[i].BANK_COUNTRY, data.DRAFT.PAYMENT[i].SWIFT_CODE, "OTH", i - 1, data.DRAFT.PAYMENT[i].BRANCH_NAME, data.DRAFT.PAYMENT[i].NAME);
							// context.readIBANInfo(data.DRAFT.PAYMENT[i].BANK_COUNTRY, i, "TD");
						}
					}
					context.readOtherBankIBANInfoInitially("TD", data.DRAFT.PAYMENT);

					oView.getModel("blankJson").setProperty("/otherBankDetails", otherBankDetails);
					oView.byId("bankTableId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherBankDetails").length);
				}

				if (data.DRAFT.BANKING_DETAILS.length !== 0) {
					oView.getModel("blankJson").setProperty("/BankingDetails", data.DRAFT.BANKING_DETAILS);
				}

				if (data.DRAFT.BUSINESS_HISTORY.length !== 0) {
					oView.getModel("blankJson").setProperty("/busHistory", data.DRAFT.BUSINESS_HISTORY);
				}

				if (data.DRAFT.CUSTOMER.length !== 0) {
					oView.getModel("blankJson").setProperty("/customerDetail", data.DRAFT.CUSTOMER);
				}

				if (data.DRAFT.PROMOTERS.length !== 0) {
					oView.getModel("blankJson").setProperty("/promotors", data.DRAFT.PROMOTERS);
				}
			}

			if (loginData.REQUEST_TYPE === 5) {
				context._originalJson(data2);
			}

			if (data.DRAFT && data.DRAFT.PAYMENT.length !== 0) {
				if (data.DRAFT.PAYMENT[0].BANK_COUNTRY === "AE") {

				} else if (data.DRAFT.PAYMENT[0].BANK_COUNTRY === "US" || data.DRAFT.PAYMENT[0].BANK_COUNTRY === "CA" || data.DRAFT.PAYMENT[0].BANK_COUNTRY === "AU") {
					oView.byId("S2G1T1F8_lbl").setRequired(true);
				} else if (data.DRAFT.PAYMENT[0].BANK_COUNTRY === "IN") {
					oView.byId("S2G1T1F11_OC_lbl").setRequired(true);
					oView.byId("S2G1T1F9_OCN_lbl").setRequired(true);
				}
			}

			//Section count set initial 0;
			this.Section1Count = 0;
			this.Section2Count = 0;
			this.Section3Count = 0;
			this.Section4Count = 0;
			this.Section5Count = 0;
			this.Section6Count = 0;
			//context.validateSectionOneSimpleForm();
			this._readAttachmentDraftData(data.DRAFT.MAIN, data.DRAFT.ATTACHMENTS);
		},

		readOtherBankIBANInfoInitially: async function (sIndicator, otherBankData) {
			var oPromiseIBANInfo, oPromiseBankDetails;
			var aOtherBankdetails = [];

			for (var i = 0; i < otherBankData.length; i++) {
				if (otherBankData[i].PAYMENT_TYPE === 'OTH') {
					oPromiseBankDetails = await context.readCallforBankDetails(otherBankData[i], "OTH", i);
					oPromiseIBANInfo = await context.readCallforIBANMaster(otherBankData[i].BANK_COUNTRY);

					if (oPromiseIBANInfo !== null) {
						oPromiseBankDetails.IBAN_LENGTH = oPromiseIBANInfo.IBAN_LENGTH;
						oPromiseBankDetails.REQUIRED = oPromiseIBANInfo.REQUIRED;
					}
					aOtherBankdetails.push(oPromiseBankDetails);
				}
			}
			oView.getModel("blankJson").setProperty("/otherBankDetails", aOtherBankdetails);
			oView.byId("bankTableId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherBankDetails").length);
		},

		readCallforBankDetails: async function (bankDetails, sType, iIndex) {

			if ((bankDetails.BANK_COUNTRY !== null || bankDetails.BANK_COUNTRY === undefined || bankDetails.BANK_COUNTRY === "")
				&& (bankDetails.SWIFT_CODE !== null || bankDetails.SWIFT_CODE !== undefined || bankDetails.SWIFT_CODE !== "")) {

				var bFilter = new sap.ui.model.Filter("Banks", sap.ui.model.FilterOperator.EQ, bankDetails.BANK_COUNTRY);
				var cFilter = new sap.ui.model.Filter("Swift", sap.ui.model.FilterOperator.EQ, bankDetails.SWIFT_CODE);
				var sIbanNumber, sRoutingCode, testString, rRegex, bBankKeyMatched, oEmptyObject;

				const oPromise = await new Promise((resolve, reject) => {
					context.oDataModel.read("/GetBankDetailSet", {
						filters: [bFilter, cFilter],
						success: function (oData, response) {

							sIbanNumber = bankDetails.IBAN_NUMBER;
							sRoutingCode = bankDetails.ROUTING_CODE;

							if (oData.results.length > 1 && ((sIbanNumber !== null && sIbanNumber !== undefined && sIbanNumber !== "") || (
								sRoutingCode !== null && sRoutingCode !== undefined && sRoutingCode !== ""))) {
								for (var i = 0; i < oData.results.length; i++) {

									sIbanNumber = sIbanNumber !== null && sIbanNumber !== undefined && sIbanNumber !== "" ? sIbanNumber : "";
									sRoutingCode = sRoutingCode !== null && sRoutingCode !== undefined && sRoutingCode !== "" ? sRoutingCode : "";
									testString = sIbanNumber + sRoutingCode;
									rRegex = new RegExp(oData.results[i].Bankl);
									if (rRegex.test(testString)) {
										bankDetails.NAME = oData.results[i].Banka;
										if (oData.results[i].Brnch !== "" && oData.results[i].Brnch !== undefined && oData.results[i].Brnch !== null) {
											bankDetails.BRANCH_NAME = oData.results[i].Brnch;
										}
										bankDetails.BANK_KEY = oData.results[i].Bankl;
										bankDetails.BANK_NO = oData.results[i].Bnklz;
										bankDetails.BANK_NAME_EDITABLE = false;
										bBankKeyMatched = true;
									}
								}
							} else if (oData.results.length === 0 || bBankKeyMatched === false) {
								// bankDetails.NAME = null;
								// bankDetails.BRANCH_NAME = null;
								// bankDetails.BANK_KEY = null;
								// bankDetails.BANK_NO = null;
								// bankDetails.BANK_NAME_EDITABLE = true;


							} else if (oData.results.length === 1) {
								bankDetails.NAME = oData.results[0].Banka;
								if (oData.results[0].Brnch !== "" && oData.results[0].Brnch !== undefined && oData.results[0].Brnch !== null) {
									bankDetails.BRANCH_NAME = oData.results[0].Brnch;
								}
								bankDetails.BANK_KEY = oData.results[0].Bankl;
								bankDetails.BANK_NO = oData.results[0].Bnklz;
								bankDetails.BANK_NAME_EDITABLE = false;
							}
							resolve(bankDetails);
						},
						error: function (error) {
							var oXMLMsg, oXML;
							if (context.isValidJsonString(error.responseText)) {
								oXML = JSON.parse(error.responseText);
								oXMLMsg = oXML.error["message"].value;
							} else {
								oXMLMsg = error.responseText
							}
							MessageBox.error(oXMLMsg);
							reject(bankDetails);
						}
					});
				});
				return oPromise;
			}
			else {
				bankDetails.NAME = null;
				bankDetails.BRANCH_NAME = null;
				bankDetails.BANK_KEY = null;
				bankDetails.BANK_NO = null;
				return bankDetails;
			}
		},

		// setBankDetails: function (oData, sType, iIndex, branchName) {
		// 	
		// 	if (sType === "PRI") {
		// 		oView.getModel("blankJson").setProperty("/bankDetails/NAME", oData.Banka);
		// 		if (oData.Brnch !== "" && oData.Brnch !== null && oData.Brnch !== undefined) {
		// 			oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", oData.Brnch);
		// 		} else {
		// 			oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", branchName);
		// 		}

		// 		oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", oData.Bankl);
		// 		oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", oData.Bnklz);
		// 		if (oData.Banka !== null || oData.Brnch !== null || oData.Bankl !== null || oData.Bnklz !== null) {
		// 			oView.getModel("localModel").setProperty("/bankNameEdit", false);
		// 		} else {
		// 			oView.getModel("localModel").setProperty("/bankNameEdit", true);
		// 		}

		// 	} else if (sType === "OTH") {
		// 		oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/NAME", oData.Banka);
		// 		oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", oData.Brnch);
		// 		if (oData.Brnch !== "" && oData.Brnch !== null && oData.Brnch !== undefined) {
		// 			oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", oData.Brnch);
		// 		} else {
		// 			oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", branchName);
		// 		}
		// 		oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_KEY", oData.Bankl);
		// 		oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_NO", oData.Bnklz);

		// 		if (oData.Banka !== null || oData.Brnch !== null || oData.Bankl !== null || oData.Bnklz !== null) {
		// 			context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_NAME_EDITABLE", false);
		// 		} else {
		// 			context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_NAME_EDITABLE", true);
		// 		}
		// 	}
		// },

		setBankDetails: function (oData, sType, iIndex, branchName, sBankName) {

			if (sType === "PRI") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", sBankName);
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", branchName);
				// if (oData.Brnch !== "" && oData.Brnch !== null && oData.Brnch !== undefined) {
				// 	oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", oData.Brnch);
				// } else {
				// 	oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", branchName);
				// }

				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", oData.Bankl);
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", oData.Bnklz);
				if (oData.Banka !== null || oData.Brnch !== null || oData.Bankl !== null || oData.Bnklz !== null) {
					oView.getModel("localModel").setProperty("/bankNameEdit", false);
				} else {
					oView.getModel("localModel").setProperty("/bankNameEdit", true);
				}

			} else if (sType === "OTH") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/NAME", sBankName);
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", branchName);
				// if (oData.Brnch !== "" && oData.Brnch !== null && oData.Brnch !== undefined) {
				// 	oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", oData.Brnch);
				// } else {
				// 	oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BRANCH_NAME", branchName);
				// }
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_KEY", oData.Bankl);
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_NO", oData.Bnklz);

				if (oData.Banka !== null || oData.Brnch !== null || oData.Bankl !== null || oData.Bnklz !== null) {
					context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_NAME_EDITABLE", false);
				} else {
					context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/BANK_NAME_EDITABLE", true);
				}
			}
		},

		readCallforIBANMaster: async function (sCountryCode) {

			var oObject = {};
			if (sCountryCode !== "" && sCountryCode !== undefined && sCountryCode !== null) {
				const oPromise = await new Promise((resolve, reject) => {
					var path = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIbanCountry?$filter=(LAND1 eq '" + sCountryCode + "')";
					$.ajax({
						url: path,
						type: 'GET',
						contentType: 'application/json',
						success: function (oData, response) {
							if (oData.value.length > 0) {
								oObject.REQUIRED = true;
								oObject.IBAN_LENGTH = oData.value[0].LENGTH;
								resolve(oObject);
							} else {
								oObject.REQUIRED = false;
								oObject.IBAN_LENGTH = null;
								resolve(oObject);
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
							reject(null);
						}
					});
				});
				return oPromise;
			} else {
				oObject.REQUIRED = true;
				oObject.IBAN_LENGTH = null;
				return oObject;
			}
		},

		//komal
		_originalJson: function (data) {

			var regAddress = [],
				contacts = []
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

			if (data.DRAFT)
				if (data.DRAFT.CONTACTS.length !== 0) {
					data.DRAFT.MAIN[0].SAP_DIST_CODE = loginData.SAP_DIST_CODE;
					data.DRAFT.MAIN[0].DIST_NAME1 = loginData.DIST_NAME1;
					data.DRAFT.MAIN[0].REGISTERED_ID = loginData.REGISTERED_ID;

					if (data.DRAFT.MAIN[0].VAT_REG_DATE !== null) {
						data.DRAFT.MAIN[0].VAT_REG_DATE = new Date(data.DRAFT.MAIN[0].VAT_REG_DATE);
					}

					oView.getModel("originalJson").setProperty("/headerData", data.DRAFT.MAIN[0]);

					for (var i = 0; i < data.DRAFT.ADDRESS.length; i++) {
						if (data.DRAFT.ADDRESS[i].ADDRESS_TYPE === "HQ") {
							oView.getModel("originalJson").setProperty("/address", data.DRAFT.ADDRESS[0]);
							context.readRegionSet(data.DRAFT.ADDRESS[0].COUNTRY, "H");
							context.readCitySet(data.DRAFT.ADDRESS[0].STATE, "H");
							context.readPostalCodeLength(data.DRAFT.ADDRESS[0].COUNTRY, "H");
						} else {
							regAddress.push(data.DRAFT.ADDRESS[i]);
							context.readRegionSet(data.DRAFT.ADDRESS[i].COUNTRY, "R");
							context.readCitySet(data.DRAFT.ADDRESS[i].STATE, "R");
							context.readPostalCodeLength(data.DRAFT.ADDRESS[i].COUNTRY, "R");

						}
					}

					for (var j = 0; j < data.DRAFT.CONTACTS.length; j++) {
						if (data.DRAFT.CONTACTS[j].CONTACT_TYPE === "HOD") {
							oView.getModel("originalJson").setProperty("/contact", data.DRAFT.CONTACTS[0]);
							context.readContactCitySet(data.DRAFT.CONTACTS[0].NATIONALITY, "H");
						} else {
							context.readContactCitySet(data.DRAFT.CONTACTS[j].NATIONALITY, "R");
						}
					}

					if (regAddress.length === 0) {
						regAddress.push({
							"ADDRESS_TYPE": "REG",
							"ADDRESS_DESC": "Registered Office",
							"HOUSE_NUM1": null,
							"STREET1": null,
							"STREET2": null,
							"STREET3": null,
							"STREET4": null,
							"CITY": null,
							"CITY_DESC": null,
							"COUNTRY": null,
							"COUNTRY_DESC": null,
							"STATE": null,
							"REGION_DESC": null,
							"POSTAL_CODE": null,
							"CONTACT_TELECODE": null,
							"CONTACT_NO": null,
							"EMAIL": null,
							"DISTRICT": null
						})
					}

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

			if (data.DRAFT.PAYMENT.length !== 0) {
				for (var i = 0; i < data.DRAFT.PAYMENT.length; i++) {
					if (data.DRAFT.PAYMENT[i].PAYMENT_TYPE === "PRI") {
						if (data.DRAFT.PAYMENT[i].BANK_COUNTRY === "AE") {

						}
						else if (data.DRAFT.PAYMENT[i].BANK_COUNTRY === "IN") {
							oView.getModel("mandatoryJson").oData.S2G1T1F8 = null;
							oView.getModel("mandatoryJson").oData.S2G1T1F9 = "X";
							oView.getModel("mandatoryJson").oData.S2G1T1F12 = "X";
							oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 0);
							oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 2);
						}
						else if (data.DRAFT.PAYMENT[i].BANK_COUNTRY === "US" || data.DRAFT.PAYMENT[i].BANK_COUNTRY === "CA" || data.DRAFT.PAYMENT[i].BANK_COUNTRY === "AU") {
							oView.getModel("mandatoryJson").oData.S2G1T1F8 = "X";
							oView.getModel("mandatoryJson").oData.S2G1T1F9 = null;
							oView.getModel("mandatoryJson").oData.S2G1T1F12 = null;
							oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 1);
							oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 0);
						}
						else {
							oView.getModel("mandatoryJson").oData.S2G1T1F8 = null;
							oView.getModel("mandatoryJson").oData.S2G1T1F9 = null;
							oView.getModel("mandatoryJson").oData.S2G1T1F12 = null;
							oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 0);
							oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 0);
						}
						oView.getModel("originalJson").setProperty("/bankDetails", data.DRAFT.PAYMENT[i]);
						context.readSwiftCode(data.DRAFT.PAYMENT[i].BANK_COUNTRY, "P");

						context.getBankDetails(data.DRAFT.PAYMENT[i].BANK_COUNTRY, data.DRAFT.PAYMENT[i].SWIFT_CODE, "PRI", 0, data.DRAFT.PAYMENT[i].BRANCH_NAME, data.DRAFT.PAYMENT[i].NAME);
						context.readIBANInfo(data.DRAFT.PAYMENT[i].BANK_COUNTRY, "", "SD");
					} else {
						otherBankDetails.push(data.DRAFT.PAYMENT[i]);
						context.readSwiftCode(data.DRAFT.PAYMENT[i].BANK_COUNTRY, "S");

						// context.getBankDetails(data.DRAFT.PAYMENT[i].BANK_COUNTRY, data.DRAFT.PAYMENT[i].SWIFT_CODE, "OTH", i - 1, data.DRAFT.PAYMENT[i].BRANCH_NAME, data.DRAFT.PAYMENT[i].NAME);
					}
				}
				context.readOtherBankIBANInfoInitially("TD", data.DRAFT.PAYMENT);

				oView.getModel("originalJson").setProperty("/otherBankDetails", otherBankDetails);
				oView.byId("bankTableId").setVisibleRowCount(oView.getModel("originalJson").getProperty("/otherBankDetails").length);
			}

			if (data.DRAFT.BANKING_DETAILS.length !== 0) {
				oView.getModel("originalJson").setProperty("/BankingDetails", data.DRAFT.BANKING_DETAILS);
			} else if (data.DRAFT.BANKING_DETAILS.length === 0) {
				var oBank = [{
					"NAME": null,
					"BRANCH_NAME": null,
					"FACILTY": null,
					"AMOUNT_LIMIT": null,
					"ASSO_SINCE": null
				}];
				oView.getModel("originalJson").setProperty("/BankingDetails", oBank);
			}

			if (data.DRAFT.BUSINESS_HISTORY.length !== 0) {
				oView.getModel("originalJson").setProperty("/busHistory", data.DRAFT.BUSINESS_HISTORY);
			} else if (data.DRAFT.BUSINESS_HISTORY.length === 0) {
				var busiHistoryArray = [{
					"DEALERSHIP": null,
					"SUPPLIER_NAME": null,
					"SINCE": null,
					"PROD_GROUP": null,
					"PURCHASES": null
				}];
				oView.getModel("originalJson").setProperty("/busHistory", busiHistoryArray);
			}

			if (data.DRAFT.CUSTOMER.length !== 0) {
				oView.getModel("originalJson").setProperty("/customerDetail", data.DRAFT.CUSTOMER);
			} else if (data.DRAFT.CUSTOMER.length === 0) {
				var customerArray = [{
					"CUST_NO": null,
					"CUSTOMER_NAME": null,
					"YEAR1": null,
					"YEAR2": null
				}];
				oView.getModel("originalJson").setProperty("/customerDetail", customerArray);
			}

			if (data.DRAFT.PROMOTERS.length !== 0) {
				oView.getModel("originalJson").setProperty("/promotors", data.DRAFT.PROMOTERS);
			} else if (data.DRAFT.PROMOTERS.length === 0) {
				var promArray = [{
					"NAME": null,
					"QUALIFICATION": null,
					"WORK_EXP": null,
					"YRS_IN_COMP": null,
					"DESIGNATION": null,
					"ROLE": null
				}];
				oView.getModel("originalJson").setProperty("/promotors", promArray);
			}

			oView.getModel("originalJson").refresh(true);
		},

		//Attachment Draft Data
		_readAttachmentFieldsDraftData: function (attachmentFields) {

			var index = "";
			var flagData = oView.getModel("G6Json").oData;
			for (var i = 0; i < flagData.length; i++) {
				if (flagData[i].CODE === 11) {
					flagData[i].FLAG = attachmentFields[0].ISSUE_ELEC_TAX_INV;
				} else if (flagData[i].CODE === 14) {
					flagData[i].FLAG = attachmentFields[0].SOLE_DIST_MFG_SER;
				}
			}
			oView.getModel("G7Json").oData[0].FLAG = attachmentFields[0].IS_UAE_COMPANY;

			oView.getModel("G6Json").refresh(true);
			oView.getModel("G7Json").refresh(true);
		},

		_readAttachmentDraftData: function (headerArray, attachmentArray) {

			if (attachmentArray) {

			}
			else {
				attachmentArray = [];
			}
			context.attachDraftData = attachmentArray;
			var draftArray = [],
				grp1 = [],
				grp2 = [],
				grp3 = [],
				grp4 = [],
				grp5 = [],
				grp6 = [],
				grp7 = [],
				grp8 = [],
				grp9 = [],
				grp10 = [],
				grp11 = [],
				grp12 = [],
				grp13 = [],
				grp14 = [],
				grp15 = [],
				grp16 = [],
				grp17 = [],
				grp18 = [],
				grp19 = [],
				grp20 = [],
				grp21 = [],
				grp22 = [],
				grp23 = [],
				grp24 = [],
				grp25 = [],
				grp26 = [],
				grp27 = [],
				grp28 = [];

			draftArray.push(...oView.getModel("G6Json").oData);
			draftArray.push(...oView.getModel("G7Json").oData);
			draftArray.push(...oView.getModel("G10Json").oData);

			draftArray.map(function (matObj) {
				for (var i = 0; i < attachmentArray.length; i++) {
					if (attachmentArray[i].ATTACH_CODE === matObj.CODE) {
						matObj.EXPIRY_DATE = new Date(attachmentArray[i].EXPIRY_DATE);
						matObj.REQUEST_NO = attachmentArray[i].REQUEST_NO;
						matObj.SR_NO = attachmentArray[i].SR_NO;
						matObj.OT_DOC_ID = attachmentArray[i].OT_DOC_ID;
						matObj.ATTACH_VALUE = attachmentArray[i].ATTACH_VALUE;
						matObj.FILE_NAME = attachmentArray[i].FILE_NAME;
						matObj.FILE_MIMETYPE = attachmentArray[i].FILE_MIMETYPE;
						matObj.DRAFT_IND = "X";
						matObj.OT_LAST_DOC_ID = attachmentArray[i].OT_LAST_DOC_ID;
						matObj.UPDATE_FLAG = attachmentArray[i].UPDATE_FLAG;
						matObj.DELETE_FLAG = attachmentArray[i].DELETE_FLAG;
						matObj.ATTACH_SHORT_DEC = attachmentArray[i].ATTACH_SHORT_DEC;
						matObj.ATTACH_FOR = attachmentArray[i].ATTACH_FOR;
					}
				}
			});
			grp5.push(...oView.getModel("G5Json").oData);

			for (var i = 0; i < attachmentArray.length; i++) {
				var object = {
					"REQUEST_NO": attachmentArray[i].REQUEST_NO,
					"SR_NO": attachmentArray[i].SR_NO,
					"OT_DOC_ID": attachmentArray[i].OT_DOC_ID,
					"GROUP2": attachmentArray[i].ATTACH_GROUP,
					"FILE_CONTENT": null,
					"FILE_MIMETYPE": attachmentArray[i].FILE_MIMETYPE,
					"EXPIRY_DATE": new Date(attachmentArray[i].EXPIRY_DATE),
					"FILE_NAME": attachmentArray[i].FILE_NAME,
					"TYPE": attachmentArray[i].FILE_TYPE,
					"DESCRIPTION": attachmentArray[i].ATTACH_DESC,
					"ATTACH_VALUE": attachmentArray[i].ATTACH_VALUE,
					"CODE": attachmentArray[i].ATTACH_CODE,
					"DRAFT_IND": "X",
					"OT_LAST_DOC_ID": attachmentArray[i].OT_LAST_DOC_ID,
					"UPDATE_FLAG": attachmentArray[i].UPDATE_FLAG,
					"DELETE_FLAG": attachmentArray[i].DELETE_FLAG,
					"ATTACH_SHORT_DEC": attachmentArray[i].ATTACH_SHORT_DEC,
					"ATTACH_FOR": attachmentArray[i].ATTACH_FOR
				};

				if (attachmentArray[i].ATTACH_GROUP === "G1") {
					grp1.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G2") {
					grp2.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G3") {
					grp3.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G4") {
					grp4.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G5") {
					for (var j = 0; j < grp5.length; j++) {
						if (object.DESCRIPTION === grp5[j].DESCRIPTION) {
							grp5[j].OBR_NO = attachmentArray[i].OBR_NO;
							grp5[j].SR_NO = attachmentArray[i].SR_NO;
							grp5[j].OT_DOC_ID = attachmentArray[i].OT_DOC_ID;
							grp5[j].FILE_NAME = attachmentArray[i].FILE_NAME;
						}
					}
				} else if (attachmentArray[i].ATTACH_GROUP === "G8") {
					grp8.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G9") {
					grp9.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G11") {
					grp11.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G12") {
					grp12.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G13") {
					grp13.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G14") {
					grp14.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G15") {
					grp15.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G16") {
					grp16.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G17") {
					grp17.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G18") {
					grp18.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G19") {
					grp19.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G20") {
					grp20.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G21") {
					grp21.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G22") {
					grp22.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G23") {
					grp23.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G24") {
					grp24.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G25") {
					grp25.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G26") {
					grp26.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G27") {
					grp27.push(object);
				} else if (attachmentArray[i].ATTACH_GROUP === "G28") {
					grp28.push(object);
				}
			}

			if (grp1.length) {
				var grp1Model = new JSONModel();
				grp1Model.setData(grp1);
				oView.setModel(grp1Model, "G1Json");
			}
			if (grp2.length) {
				var grp2Model = new JSONModel();
				grp2Model.setData(grp2);
				oView.setModel(grp2Model, "G2Json");
			}
			if (grp3.length) {
				var grp3Model = new JSONModel();
				grp3Model.setData(grp3);
				oView.setModel(grp3Model, "G3Json");
			}
			if (grp4.length) {
				var grp4Model = new JSONModel();
				grp4Model.setData(grp4);
				oView.setModel(grp4Model, "G4Json");
			}
			if (grp8.length) {
				var grp8Model = new JSONModel();
				grp8Model.setData(grp8);
				oView.setModel(grp8Model, "G8Json");
			}
			if (grp9.length) {
				var grp9Model = new JSONModel();
				grp9Model.setData(grp9);
				oView.setModel(grp9Model, "G9Json");
			}
			if (grp11.length) {
				var grp11Model = new JSONModel();
				grp11Model.setData(grp11);
				oView.setModel(grp11Model, "G11Json");
			}
			if (grp12.length) {
				var grp12Model = new JSONModel();
				grp12Model.setData(grp12);
				oView.setModel(grp12Model, "G12Json");
			}
			if (grp13.length) {
				var grp13Model = new JSONModel();
				grp13Model.setData(grp13);
				oView.setModel(grp13Model, "G13Json");
			}
			if (grp14.length) {
				var grp14Model = new JSONModel();
				grp14Model.setData(grp14);
				oView.setModel(grp14Model, "G14Json");
			}
			if (grp15.length) {
				var grp15Model = new JSONModel();
				grp15Model.setData(grp15);
				oView.setModel(grp15Model, "G15Json");
			}
			if (grp16.length) {
				var grp16Model = new JSONModel();
				grp16Model.setData(grp16);
				oView.setModel(grp16Model, "G16Json");
			}
			if (grp17.length) {
				var grp17Model = new JSONModel();
				grp17Model.setData(grp17);
				oView.setModel(grp17Model, "G17Json");
			}
			if (grp18.length) {
				var grp18Model = new JSONModel();
				grp18Model.setData(grp18);
				oView.setModel(grp18Model, "G18Json");
			}
			if (grp19.length) {
				var grp19Model = new JSONModel();
				grp19Model.setData(grp19);
				oView.setModel(grp19Model, "G19Json");
			}
			if (grp20.length) {
				var grp20Model = new JSONModel();
				grp20Model.setData(grp20);
				oView.setModel(grp20Model, "G20Json");
			}
			if (grp21.length) {
				var grp21Model = new JSONModel();
				grp21Model.setData(grp21);
				oView.setModel(grp21Model, "G21Json");
			}
			if (grp22.length) {
				var grp22Model = new JSONModel();
				grp22Model.setData(grp22);
				oView.setModel(grp22Model, "G22Json");
			}
			if (grp23.length) {
				var grp23Model = new JSONModel();
				grp23Model.setData(grp23);
				oView.setModel(grp23Model, "G23Json");
			}
			if (grp24.length) {
				var grp24Model = new JSONModel();
				grp24Model.setData(grp24);
				oView.setModel(grp24Model, "G24Json");
			}
			if (grp25.length) {
				var grp25Model = new JSONModel();
				grp25Model.setData(grp25);
				oView.setModel(grp25Model, "G25Json");
			}
			if (grp26.length) {
				var grp26Model = new JSONModel();
				grp26Model.setData(grp26);
				oView.setModel(grp26Model, "G26Json");
			}
			if (grp27.length) {
				var grp27Model = new JSONModel();
				grp27Model.setData(grp27);
				oView.setModel(grp27Model, "G27Json");
			}
			if (grp28.length) {
				var grp28Model = new JSONModel();
				grp28Model.setData(grp28);
				oView.setModel(grp28Model, "G28Json");
			}

			var grp5Model = new JSONModel();
			grp5Model.setData(grp5);
			oView.setModel(grp5Model, "G5Json");

			oView.getModel("G6Json").refresh(true);
			oView.getModel("G7Json").refresh(true);
			oView.getModel("G10Json").refresh(true);

			var G7JsonData = JSON.parse(JSON.stringify(oView.getModel("G7Json").oData));
			var grp17Model = new JSONModel();
			grp17Model.setData(G7JsonData);
			oView.setModel(grp17Model, "G7OldJson");

			if (headerArray !== undefined && headerArray.length !== 0 && headerArray[0].TRADE_LIC_NO_DATE !== undefined) {
				oView.getModel("G7Json").getData()[0].EXPIRY_DATE = headerArray[0].TRADE_LIC_NO_DATE;
				oView.getModel("G7Json").getData()[2].EXPIRY_DATE = headerArray[0].TRADE_LIC_NO_DATE;
				oView.getModel("G7Json").refresh(true);
			}

			context.setNDADescription();
		},

		setEmployeeData: function (data) {

			var empObject = [{
				"type": "No. of Employees",
				"value": data.NO_OF_EMP
			}, {
				"type": "No. of Employees in Engineering",
				"value": data.NO_OF_ENGG
			}, {
				"type": "No. of Employees in Quality",
				"value": data.NO_OF_QUALITY
			}, {
				"type": "No. of Employees in Production",
				"value": data.NO_OF_PROD
			}, {
				"type": "No. of Employees in Administration",
				"value": data.NO_OF_ADMIN
			}, {
				"type": "No. of Employees in Other functions",
				"value": data.NO_OF_OTHERS
			}];
			return empObject;
		},

		getHeaderData: function (data) {

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY-MM-dd"
			});
			var oDate, oDate2, oDate3;
			var sDate, sDate2, sDate3;
			if (data.headerData.LIC_NO_DATE) {
				oDate = new Date(data.headerData.LIC_NO_DATE);
				sDate = oDate.toISOString().split('T')[0];
			}
			if (data.headerData.PROPOSAL_DATE) {
				oDate2 = new Date(data.headerData.PROPOSAL_DATE)
				sDate2 = oDate2.toISOString().split('T')[0];
			}
			if (data.headerData.VAT_REG_DATE) {
				oDate3 = new Date(data.headerData.VAT_REG_DATE)
				sDate3 = oDate3.toISOString().split('T')[0];
			}

			var headerData = [{
				"REQUEST_NO": loginData.REQUEST_NO,
				"SAP_DIST_CODE": loginData.SAP_DIST_CODE || null,
				"IDEAL_DIST_CODE": loginData.IDEAL_DIST_CODE,
				"STATUS": null,
				"REGISTERED_ID": loginData.REGISTERED_ID,
				"ENTITY_CODE": loginData.ENTITY_CODE || null,
				"REQUEST_TYPE": parseInt(loginData.REQUEST_TYPE, 10),
				"CREATION_TYPE": loginData.CREATION_TYPE,
				"DIST_NAME1": data.headerData.DIST_NAME1 || null,
				"DIST_NAME2": data.headerData.VENDOR_NAME2 || null,
				"MOBILE_NO": loginData.MOBILE_NO,
				"DIST_CODE": loginData.DIST_CODE,
				"APPROVER_LEVEL": null,
				"REQUESTER_ID": loginData.REQUESTER_ID || null,
				"BP_TYPE_CODE": loginData.LOGINDATA_BP_TYPE_CODE,
				"BP_TYPE_DESC": loginData.BP_TYPE_DESC,
				"SECONDARY_EMAILS_ID": data.headerData.SECONDARY_EMAILS_ID || null,
				"OT_PARENT_ID": data.headerData.OT_PARENT_ID || null,
				"PROPOSAL_DATE": sDate2 || null,
				"REQUEST_RESENT": data.headerData.REQUEST_RESENT || null,
				"WEBSITE": data.headerData.WEBSITE || null,
				"ORG_ESTAB_YEAR": oView.byId("S1G6T1F1_date").getValue() || null,
				"TOT_PERM_EMP": parseInt(data.headerData.TOT_PERM_EMP, 10) || null,
				"TOT_TEMP_EMP": parseInt(data.headerData.TOT_TEMP_EMP, 10) || null,
				"NOE_QA": parseInt(data.headerData.NOE_QA, 10) || null,
				"NOE_MAN": parseInt(data.headerData.NOE_MAN, 10) || null,
				"NOE_ACC": parseInt(data.headerData.NOE_ACC, 10) || null,
				"NOE_ADM": parseInt(data.headerData.NOE_ADM, 10) || null,
				"NOE_HR": parseInt(data.headerData.NOE_HR, 10) || null,
				"NOE_SAL": parseInt(data.headerData.NOE_SAL, 10) || null,
				"NOE_SEC": parseInt(data.headerData.NOE_SEC, 10) || null,
				"NOE_ANY": parseInt(data.headerData.NOE_ANY, 10) || null,
				"LIC_NO": data.headerData.LIC_NO || null,
				"COMPLETED_BY": data.headerData.COMPLETED_BY || null,
				"COMPLETED_BY_POSITION": data.headerData.COMPLETED_BY_POSITION || null,
				"SUBMISSION_DATE": new Date(),
				"LAST_UPDATED_ON": new Date(),
				"LAST_SAVED_STEP": data.headerData.LAST_SAVED_STEP || null,
				"MDG_CR_NO": null,
				"LIC_NO_DATE": sDate || null,
				"VAT_REG_NUMBER": data.headerData.VAT_REG_NUMBER || null,
				"VAT_REG_DATE": sDate3 || null,
				"LAST_ACTIVE_REQ_NO": data.headerData.LAST_ACTIVE_REQ_NO || null,
				"VAT_CHECK": data.headerData.VAT_CHECK || null,
				"NDA_TYPE": loginData.NDA_TYPE,
				"BUYER_ASSIGN_CHECK": loginData.BUYER_ASSIGN_CHECK,
				"CREATED_ON": new Date(loginData.CREATED_ON),
				"COMMENT": loginData.COMMENT,
				"LEGACY_ID": loginData.LEGACY_ID,
				"REMINDER_COUNT": loginData.REMINDER_COUNT
			}];
			return headerData;
		},
		draftinPayload : function (headerData, address, contactDetails, bankDetails, bankingDetails, busHistory, customerDetail, promotors,
			customerInfo, OEM, services, disclousers, relation, QCCertificates, attachFields, attachments, events, section, updatedFields) {

			var sAction;
			if (section === 5) {
				sAction = "CREATE";
			} else {
				sAction = "DRAFT";
			}

			var oPayload = {
				"action": sAction,
				"appType": "REG",
				"stepNo": section,
				"reqHeader": headerData,
				"addressData": context.telecodeAndNumberCheck(address) || [],
				"promotersData": promotors,
				"businessHistoryData": busHistory,
				"contactsData": context.telecodeAndNumberCheck(contactDetails) || [],
				"bankData": bankDetails,
				"bankingDetails": bankingDetails,
				"customerData": customerDetail,
				"attachmentFieldsData": attachFields,
				"attachmentData": attachments,
				"updatedFields": [],
				"eventsData": events,
				"userDetails": {
					"USER_ROLE": "DISTRIBUTOR",
					"USER_ID": context.UserId
				}
			};

			if (loginData.REQUEST_TYPE === 5) {
				oPayload.updatedFields = updatedFields;
			}

			if (loginData.STATUS === 7) {
				oPayload.reqHeader[0].REQUEST_RESENT = "X";
			}
			return oPayload;
		},
		ajaxCall: function (path, payload, section) {

			BusyIndicator.show();
			var that = this;
			var data = JSON.stringify(payload);

			$.ajax({
				url: path,
				type: 'POST',
				data: data,
				contentType: 'application/json',
				async: false,
				success: function (oData, response) {

					BusyIndicator.hide();
					var resposeObj = oData.value[0];
					if (section === 5) {
						MessageBox.success(resposeObj.Message, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
									context.onBack();
								}
							}
						});
					} else {
						MessageToast.show(resposeObj.Message);
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

		removeMetadata: function (data) {

			for (var i = 0; i < data.otherAddress.length; i++) {
				if (data.otherAddress[i].REQUEST_NO) {
					delete data.otherAddress[i].REQUEST_NO;
					delete data.otherAddress[i].SR_NO;
				}
			}

			for (var j = 0; j < data.contact.length; j++) {
				if (data.contact[j].REQUEST_NO) {
					delete data.contact[j].REQUEST_NO;
					delete data.contact[j].SR_NO;
				}
			}

			for (var k = 0; k < data.finInfo.length; k++) {
				if (data.finInfo[k].REQUEST_NO) {
					delete data.finInfo[k].REQUEST_NO;
					delete data.finInfo[k].SR_NO;
				}
			}

			for (var l = 0; l < data.ownerInfo.length; l++) {
				if (data.ownerInfo[l].REQUEST_NO) {
					delete data.ownerInfo[l].REQUEST_NO;
					delete data.ownerInfo[l].SR_NO;
				}
			}

			for (var m = 0; m < data.productInfo.length; m++) {
				if (data.productInfo[m].REQUEST_NO) {
					delete data.productInfo[m].REQUEST_NO;
					delete data.productInfo[m].SR_NO;
				}
			}

			for (var n = 0; n < data.operationalCap.length; n++) {
				if (data.operationalCap[n].REQUEST_NO) {
					delete data.operationalCap[n].REQUEST_NO;
					delete data.operationalCap[n].SR_NO;
				}
			}

			for (var o = 0; o < data.clientInfo.length; o++) {
				if (data.clientInfo[o].REQUEST_NO) {
					delete data.clientInfo[o].REQUEST_NO;
					delete data.clientInfo[o].SR_NO;
				}
			}

			for (var a = 0; a < data.OEMInfo.length; a++) {
				if (data.OEMInfo[a].REQUEST_NO) {
					delete data.OEMInfo[a].REQUEST_NO;
					delete data.OEMInfo[a].SR_NO;
				}
			}

			for (var b = 0; b < data.NONOEMInfo.length; b++) {
				if (data.NONOEMInfo[b].REQUEST_NO) {
					delete data.NONOEMInfo[b].REQUEST_NO;
					delete data.NONOEMInfo[b].SR_NO;
				}
			}

			for (var c = 0; c < data.qualityCertificate.length; c++) {
				if (data.qualityCertificate[c].deleteInd === "" || data.qualityCertificate[c].deleteInd === "X") {
					delete data.qualityCertificate[c].deleteInd;
				}
				if (data.qualityCertificate[c].REQUEST_NO) {
					delete data.qualityCertificate[c].REQUEST_NO;
					delete data.qualityCertificate[c].SR_NO;
				}
			}
		},

		readAutoCountryCodeSet: function (countryKey, sPath) {
			var oFilters = [];
			var F1 = new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.EQ, countryKey);
			oFilters.push(F1);
			context.oDataModel.read("/GetTelCodeSet", {
				filters: oFilters,
				success: function (oData, responce) {
					if (oData.results.length > 0) {
						if (oView.getModel("blankJson").getProperty(sPath + "/CONTACT_TELECODE") !== undefined) {
							oView.getModel("blankJson").setProperty(sPath + "/CONTACT_TELECODE", oData.results[0].Telefto);
						}
						if (oView.getModel("blankJson").getProperty(sPath + "/MOBILE_TELECODE") !== undefined) {
							oView.getModel("blankJson").setProperty(sPath + "/MOBILE_TELECODE", oData.results[0].Telefto);
						}
						oView.getModel("blankJson").refresh(true);
					}
				},
				error: function (error) {
					BusyIndicator.hide();
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

		handleHQCountry: function (oEvent) {
			var HQAddress = "H";

			if (oView.byId("S1G3T1F6").getSelectedKey()) {

				oView.byId("S1G3T1F6").setSelectedKey("");
				oView.byId("S1G4T1F3").setSelectedKey("");
			}
			if (oView.byId("S1G2T1F8").getValue()) {
				oView.byId("S1G2T1F8").setValue("");
			}

			if (oView.byId("S1G3T1F6").getSelectedKey() === context.clientCountry) {
				loginData.BP_TYPE_CODE = "B";

				context.validateLocalCountry()
				context.handleAttachments()
			} else {

				loginData.BP_TYPE_CODE = ""
				context.validateLocalCountry()
				context.handleAttachments()
			}

			var country = oEvent.getSource().getSelectedKey();
			var countryDesc = "";
			if (country !== "" && country !== null && country !== undefined) {
				var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
				countryDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Landx;

				var sTelecodePath = "/" + sPath.split("/")[1];

				this.readCallsWithHQCountrySR(country, HQAddress, sTelecodePath);
			}
			oView.getModel("blankJson").setProperty("/" + sPath, country);
			oView.getModel("blankJson").setProperty("/address/COUNTRY_DESC", countryDesc);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent); //komal
		},

		readCallsWithHQCountrySR: function (country, HQAddress, sTelecodePath) {

			this.readRegionSet(country, HQAddress);
			this.readPostalCodeLength(country, HQAddress);
			this.readPostalCodeFormates(country, HQAddress);
			this.readAutoCountryCodeSet(country, sTelecodePath);
		},

		//added
		validateLocalCountry: function () {

			if (loginData.BP_TYPE_CODE === "B" && loginData.CREATION_TYPE !== 3) {
				oView.getModel("dynamicCountModel").setProperty("/LocalTradeCount", 2);
				oView.getModel("dynamicCountModel").setProperty("/ICVMandatoryCount", 3);

				oView.getModel("blankJson").setProperty("/headerData/VAT_CHECK", "N");
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_NUMBER", null);
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_DATE", null);
				oView.byId("rbg4").setSelectedIndex(1);
				oView.byId("simpleForm9").setVisible(false);
				oView.getModel("localModel").setProperty("/VatNumber", false);
				oView.getModel("localModel").setProperty("/VatDate", false);
				//----------------------ICV-------------------------------//

				oView.getModel("blankJson").setProperty("/headerData/ICV_CHECK", "N");
				oView.getModel("blankJson").setProperty("/headerData/ICV_SCORE", null);
				oView.getModel("blankJson").setProperty("/headerData/ICV_DATE", null);
				oView.getModel("localModel").setProperty("/icv_sForm", false);
				oView.getModel("localModel").setProperty("/icv_table", false);
				oView.getModel("localModel").setProperty("/icv_percentage", false);
				oView.getModel("localModel").setProperty("/icv_validity", false);
				oView.getModel("localModel").setProperty("/icv_fileUpload", false);
				//this.getView().byId("icv_rBtn").setSelectedIndex(1);
			}
			else if (loginData.BP_TYPE_CODE !== "B" && loginData.CREATION_TYPE !== 3) { 		//added by Farzeen
				oView.getModel("dynamicCountModel").setProperty("/LocalTradeCount", 1);
				oView.getModel("dynamicCountModel").setProperty("/ICVMandatoryCount", 0);

				oView.getModel("blankJson").setProperty("/headerData/VAT_CHECK", "N");
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_NUMBER", null);
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_DATE", null);
				oView.byId("rbg4").setSelectedIndex(1);
				oView.byId("simpleForm9").setVisible(false);
				oView.getModel("localModel").setProperty("/VatNumber", false);
				oView.getModel("localModel").setProperty("/VatDate", false);

				//----------------------ICV-------------------------------//

				oView.getModel("blankJson").setProperty("/headerData/ICV_CHECK", "N");
				oView.getModel("localModel").setProperty("/icv_sForm", false);
				oView.getModel("localModel").setProperty("/icv_table", false);
				oView.getModel("localModel").setProperty("/icv_percentage", true);
				oView.getModel("localModel").setProperty("/icv_validity", true);
				oView.getModel("localModel").setProperty("/icv_fileUpload", true);
				//this.getView().byId("icv_rBtn").setSelectedIndex(1);
				//----------------------ICV-------------------------------//
			}
			else if (loginData.BP_TYPE_CODE === "B" && loginData.CREATION_TYPE === 3) {
				oView.getModel("dynamicCountModel").setProperty("/ICVMandatoryCount", 0);

				oView.getModel("blankJson").setProperty("/headerData/VAT_CHECK", "N");
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_NUMBER", null);
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_DATE", null);
				oView.byId("rbg4").setSelectedIndex(1);
				oView.byId("simpleForm9").setVisible(false);
				oView.getModel("localModel").setProperty("/VatNumber", false);
				oView.getModel("localModel").setProperty("/VatDate", false);
				//----------------------ICV-------------------------------//

				oView.getModel("blankJson").setProperty("/headerData/ICV_CHECK", "N");
				oView.getModel("blankJson").setProperty("/headerData/ICV_SCORE", null);
				oView.getModel("blankJson").setProperty("/headerData/ICV_DATE", null);
				oView.getModel("localModel").setProperty("/icv_sForm", false);
				oView.getModel("localModel").setProperty("/icv_table", false);
				oView.getModel("localModel").setProperty("/icv_percentage", false);
				oView.getModel("localModel").setProperty("/icv_validity", false);
				oView.getModel("localModel").setProperty("/icv_fileUpload", false);
				//this.getView().byId("icv_rBtn").setSelectedIndex(1);
				//----------------------ICV-------------------------------//
			}
			else if (loginData.BP_TYPE_CODE !== "B" && loginData.CREATION_TYPE === 3) {
				oView.getModel("dynamicCountModel").setProperty("/ICVMandatoryCount", 0);

				oView.getModel("blankJson").setProperty("/headerData/VAT_CHECK", "N");
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_NUMBER", null);
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_DATE", null);
				oView.byId("rbg4").setSelectedIndex(1);
				oView.byId("simpleForm9").setVisible(false);
				oView.getModel("localModel").setProperty("/VatNumber", false);
				oView.getModel("localModel").setProperty("/VatDate", false);

				//----------------------ICV-------------------------------//

				oView.getModel("blankJson").setProperty("/headerData/ICV_CHECK", "N");
				oView.getModel("localModel").setProperty("/icv_sForm", false);
				oView.getModel("localModel").setProperty("/icv_table", false);
				oView.getModel("localModel").setProperty("/icv_percentage", true);
				oView.getModel("localModel").setProperty("/icv_validity", true);
				oView.getModel("localModel").setProperty("/icv_fileUpload", true);
			}
		},

		handleContactNationality: function (oEvent) {

			var hoAddress = oView.getModel("blankJson").getProperty("/address");
			var country = oEvent.getSource().getSelectedKey();

			if (country !== "" && country !== null && country !== undefined) {
				var countryDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Landx;
				var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
				var sTelecodePath = "/" + sPath.split("/")[1];
				this.readAutoCountryCodeSet(country, sTelecodePath);

				oView.getModel("blankJson").setProperty("/" + sPath, country);
				oView.getModel("blankJson").setProperty("/MDContact/COUNTRY_DESC", countryDesc);
				oView.getModel("blankJson").refresh(true);

				this.readRegionSet(country, "CH");

				this.readPostalCodeLength(country, "CH");

				this.readPostalCodeFormates(country, "CH");

				context.onChange(oEvent);
			}
		},

		handleAttachments: function (sCountry) {

			var oModel = oView.getModel("G7Json").oData[0];

			if (loginData.BP_TYPE_CODE === "B") {
				oModel.FLAG = "No";
			} else {
				oModel.FLAG = "Yes";
			}
			oView.getModel("G7Json").refresh(true);
		},

		handleCountryDialog: function (oEvent) {

			this.selectedRow = oEvent.getSource();
			if (!this.countryDialog) {
				this.countryDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.countryDialog", this);
				this.getView().addDependent(this.countryDialog);
			}
			this.countryDialog.open();
			context._onTableValueHelpChange(oEvent);
		},

		handleCityDialog: function (oEvent) {

			context.selectedCityObject = oEvent.getSource();

			var index = parseInt(context.selectedCityObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var region = this.getView().getModel("blankJson").getProperty("/otherAddress")[index].STATE;
			//03/03/2022
			if (region === null || region === "") {
				MessageBox.information("Please Select Region", {
					title: "INFORMATION",
					actions: [MessageBox.Action.OK],
					onClose: function (oAction) {
						if (oAction === "OK") {

						}
					}
				});

				return;
			}
			this.readCitySet(region, "R");
			if (!this.cityDialog) {
				this.cityDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.cityDialog", this);
				this.getView().addDependent(this.cityDialog);
			}
			jQuery.sap.delayedCall(100, this, function () {
				this.cityDialog.open();
			});
			context._onTableValueHelpChange(oEvent);
		},

		closeCountryDialog: function () {
			this.countryDialog.close();
			this.countryDialog.destroy();
			this.countryDialog=null;
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
			
			if (selectedObj.CONTACT_NO !== null) {
				selectedObj.CONTACT_NO = null;
			}

			if (selectedObj[index].CITY !== null) selectedObj[index].CITY = null;
			if (selectedObj[index].POSTAL_CODE !== null) selectedObj[index].POSTAL_CODE = null;
			var countryCode = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Land1;
			var countyDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Landx;
			selectedObj[index].COUNTRY = countryCode;
			selectedObj[index].COUNTRY_DESC = countyDesc;

			oView.getModel("blankJson").refresh(true);

			sap.ui.getCore().byId("cntry_listId").removeSelections(true);
			sap.ui.getCore().byId("countrySrchId").setValue("");
			this.refreshCountryList();
			this.countryDialog.close();

			this.readPostalCodeLength(countryCode, RAddress);
			var sTelecodePath = sPath;
			this.readAutoCountryCodeSet(countryCode, sTelecodePath);

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue !== countyDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}
			if(selectedObj.COUNTRY === "IN"){
				oView.byId("S1G3T1F9").setMaxLength(10);
			}else{
				oView.byId("S1G3T1F9").setMaxLength(30);
			}
		},

		handleCountrySearch: function (oEvent) {

			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("Landx", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("cntry_listId");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},

		refreshCountryList: function () {

			var list = sap.ui.getCore().byId("cntry_listId");
			var binding = list.getBinding("items");
			binding.filter(null);
		},

		handleOTHNationality: function (oEvent) {

			this.selectedContactCntry = oEvent.getSource();
			if (!this.OTH_CCountryDialog) {
				this.OTH_CCountryDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.contactCountryDialog",
					this);
				this.getView().addDependent(this.OTH_CCountryDialog);
			}
			this.OTH_CCountryDialog.open();

			context._onTableValueHelpChange2(oEvent);
		},

		contactOTHCountrySelection: function (oEvent) {

			var index = parseInt(this.selectedContactCntry.getBindingContext("blankJson").getPath().split("/")[2]);
			var sPath = this.selectedContactCntry.getBindingContext("blankJson").getPath();
			var selectedContactObj = this.getView().getModel("blankJson").getProperty("/contact");
			if (selectedContactObj[index].STATE !== null) {
				selectedContactObj[index].STATE = null;
				selectedContactObj[index].REGION_DESC = null;
			}
			if (selectedObj.CONTACT_NO !== null) {
				selectedObj.CONTACT_NO = null;
			}
			if (selectedObj.MOBILE_NO !== null) {
				selectedObj.MOBILE_NO = null;
			}
			if (selectedContactObj[index].CITY !== null) selectedContactObj[index].CITY = null;
			if (selectedContactObj[index].POSTAL_CODE !== null) selectedContactObj[index].POSTAL_CODE = null;

			var ccountryCode = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Land1;
			var ccountyDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Landx;

			selectedContactObj[index].NATIONALITY = ccountryCode;
			selectedContactObj[index].COUNTRY_DESC = ccountyDesc;

			oView.getModel("blankJson").refresh(true);
			var sTelecodePath = sPath;
			this.readAutoCountryCodeSet(ccountryCode, sTelecodePath);

			sap.ui.getCore().byId("contactcntry_listId").removeSelections(true);
			sap.ui.getCore().byId("contctCountry_Id").setValue("");

			this.refreshcontactCountryList();
			this.OTH_CCountryDialog.close();

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue2 !== ccountyDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}

			if(selectedContactObj.COUNTRY === "IN"){
				oView.byId("S1G5T2F5").setMaxLength(10);
				oView.byId("S1G5T2F6").setMaxLength(30);
			}else{
				oView.byId("S1G5T2F5").setMaxLength(10);
				oView.byId("S1G5T2F6").setMaxLength(30);
			}

		},
		closeContactCountryDialog: function (oEvent) {
			this.OTH_CCountryDialog.close();
			this.OTH_CCountryDialog.destroy();
			this.OTH_CCountryDialog = null;
		},
		handleOTHContactCountrySearch: function (oEvent) {

			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("Landx", sap.ui.model.FilterOperator.Contains, sQuery));
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
		handleBankCountrySearch: function (oEvent) {
			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("Landx", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("bankCountry_Id");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},
		handleHQRegion: function (oEvent) {

			var region = oEvent.getSource().getSelectedKey();
			var regionDesc = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson").getObject().BEZEI;
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			oView.getModel("blankJson").setProperty("/" + sPath, region);
			oView.getModel("blankJson").setProperty("/address/REGION_DESC", regionDesc);
			// oView.getModel("blankJson").setProperty("/MDContact/STATE", region); //18-10-2022 
			// oView.getModel("blankJson").setProperty("/MDContact/REGION_DESC", regionDesc);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent); //komal
		},

		handleMDContactRegion: function (oEvent) {

			var hoAddress = oView.getModel("blankJson").getProperty("/address");
			var region = oEvent.getSource().getSelectedKey();
			var regionDesc = oEvent.getSource().getSelectedItem().getBindingContext("contactRegion").getObject().Bezei;
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			oView.getModel("blankJson").setProperty("/" + sPath, region);
			oView.getModel("blankJson").setProperty("/MDContact/REGION_DESC", regionDesc);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent);
		},

		handleRegionDialog: function (oEvent) {

			context.selectedObject = oEvent.getSource();
			var index = parseInt(context.selectedObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var country = this.getView().getModel("blankJson").getProperty("/otherAddress")[index].COUNTRY;

			if (country === null || country === "") {
				MessageBox.information("Please Select Country");
				return;
			}
			this.readRegionSet(country, "R");
			if (!this.regionDialog) {
				this.regionDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.regionDialog", this);
				this.getView().addDependent(this.regionDialog);
			}
			jQuery.sap.delayedCall(100, this, function () {
				this.regionDialog.open();
			});
			context._onTableValueHelpChange(oEvent);
		},

		closeRegionDialog: function () {
			this.regionDialog.close();
			this.regionDialog.destroy();
			this.regionDialog = null;
		},

		handleRARegion: function (oEvent) {

			var index = parseInt(context.selectedObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var regionCode = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson1").getObject().Bland;
			var regionDesc = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson1").getObject().Bezei;
			this.getView().getModel("blankJson").getProperty("/otherAddress")[index].STATE = regionCode;
			this.getView().getModel("blankJson").getProperty("/otherAddress")[index].REGION_DESC = regionDesc;
			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("regionSrchId").setValue("");
			this.regionDialog.close();

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue !== regionDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}
		},

		handleRegionSearch: function (oEvent) {

			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("Bezei", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("region_listId");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},

		handleCountryMDCont: function (oEvent) {
			this.selectedItemMD = oEvent.getSource();
			BusyIndicator.show(0);
			if (!this.countryDialogMD) {
				this.countryDialogMD = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.MDContCountry", this);
				this.getView().addDependent(this.countryDialogMD);
			}
			BusyIndicator.hide();
			this.countryDialogMD.open();

			context._onFormValueHelpChange1(oEvent);
		},

		_onFormValueHelpChange1: function (oEvent) {
			if (loginData.REQUEST_TYPE === 5) {
				var model, property, index = null,
					dataIndex = null,
					val;
				model = oEvent.getSource().mBindingInfos.value.binding.sPath;
				var headData = oView.getModel("originalJson").getProperty(model);
				context.id = oEvent.getSource().mBindingInfos.visible.binding.aBindings[0].sPath.split("/")[1];
				context.valueHelpOldValue1 = headData;
			}
		},

		handleCountrySearchMD: function (oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("Landx", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.Contains, sQuery)];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}
			var oList = sap.ui.getCore().byId("cntry_listMDId");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		closeCountryDialogMD: function () {
			this.countryDialogMD.close();
			this.countryDialogMD.destroy();
			this.countryDialogMD = null;
		},

		handleRegionMDCont: function (oEvent) {

			var HQAddress = "PC";
			BusyIndicator.show(0);
			var country = this.getView().getModel("blankJson").getProperty("/MDContact").NATIONALITY;
			if (country === null || country === "") {
				MessageBox.information("Please Select Country", {
					title: "INFORMATION",
					actions: [MessageBox.Action.OK],
					onClose: function (oAction) {
						if (oAction === "OK") {

						}
					}
				});
				BusyIndicator.hide();
				return;
			}
			this.readRegionSet(country, HQAddress);
			if (!this.regionDialogMD) {
				this.regionDialogMD = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.MDContRegion", this);
				this.getView().addDependent(this.regionDialogMD);
			}
			BusyIndicator.hide();
			this.regionDialogMD.open();

			//context.onChange(oEvent);
			context._onFormValueHelpChange1(oEvent);
		},

		handlePrimaryContactRegionSearch: function (oEvent) {

			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("Bezei", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("primary_contactreg_listId");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},

		closePrimaryContactRegionDialog: function (oEvent) {
			this.regionDialogMD.close();
			this.regionDialogMD.destroy();
			this.regionDialogMD = null;
		},

		handlePrimaryContactRegionChange: function (oEvent) {

			var cregionCode = oEvent.getSource().getSelectedItem().getBindingContext("primaryContactRegion").getObject().Bland;
			var cregionDesc = oEvent.getSource().getSelectedItem().getBindingContext("primaryContactRegion").getObject().Bezei;
			this.getView().getModel("blankJson").getProperty("/MDContact").STATE = cregionCode;
			this.getView().getModel("blankJson").getProperty("/MDContact").REGION_DESC = cregionDesc;

			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("primary_con_regionSrchId").setValue("");
			this.regionDialogMD.close();

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue1 !== cregionDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}
		},

		handleCountrySelectionMD: function (oEvent) {

			var selectedObj = this.getView().getModel("blankJson").getProperty("/MDContact");
			if (selectedObj.CITY !== null) selectedObj.CITY = null;
			if (selectedObj.REGION_DESC !== null) selectedObj.REGION_DESC = null;
			if (selectedObj.POSTAL_CODE !== null) selectedObj.POSTAL_CODE = null;
			
			if (selectedObj.CONTACT_NO !== null) {
				selectedObj.CONTACT_NO = null;
			}

			if (selectedObj.MOBILE_NO !== null) {
				selectedObj.MOBILE_NO = null;
			}
			var countryCode = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Land1;
			var countyDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Landx;
			selectedObj.NATIONALITY = countryCode;
			selectedObj.COUNTRY_DESC = countyDesc;

			oView.getModel("blankJson").refresh(true);

			sap.ui.getCore().byId("cntry_listMDId").removeSelections(true);
			sap.ui.getCore().byId("countrySrchMDId").setValue("");
			this.refreshCountryListMD();
			this.countryDialogMD.close();

			this.readRegionSet(countryCode, "CH");
			this.readPostalCodeLength(countryCode, "CH");
			this.readPostalCodeFormates(countryCode, "CH");

			var sPath = "/" + this.selectedItemMD.mBindingInfos.value.binding.sPath.split("/")[1];
			this.readAutoCountryCodeSet(countryCode, sPath);

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue1 !== countyDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}

			if(selectedObj.COUNTRY === "IN"){
				oView.byId("S1G4T1F5").setMaxLength(10)
				oView.byId("S1G4T1F6").setMaxLength(10)
			}else{
				oView.byId("S1G4T1F5").setMaxLength(30)
				oView.byId("S1G4T1F6").setMaxLength(10)
			}
		},

		refreshCountryListMD: function () {
			var list = sap.ui.getCore().byId("cntry_listMDId");
			var binding = list.getBinding("items");
			binding.filter(null);
		},

		handleOTHContactRegion: function (oEvent) {

			context.selectOTHConObject = oEvent.getSource();
			var index = parseInt(context.selectOTHConObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var country = this.getView().getModel("blankJson").getProperty("/contact")[index].NATIONALITY;

			if (country === null || country === "") {
				MessageBox.information("Please Select Nationality");
				return;
			}

			this.readRegionSet(country, "R");

			if (!this.OTHConregionDialog) {
				this.OTHConregionDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.contactRegionDialog",
					this);
				this.getView().addDependent(this.OTHConregionDialog);
			}
			jQuery.sap.delayedCall(100, this, function () {
				this.OTHConregionDialog.open();
			});
			context._onTableValueHelpChange2(oEvent);
		},

		closeOTHContactRegionDialog: function (oEvent) {
			this.OTHConregionDialog.close();
			this.OTHConregionDialog.destroy();
			this.OTHConregionDialog = null;
		},

		handleOTHContactRARegionChange: function (oEvent) {

			var index = parseInt(context.selectOTHConObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var cregionCode = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson1").getObject().Bland;
			var cregionDesc = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson1").getObject().Bezei;
			this.getView().getModel("blankJson").getProperty("/contact")[index].STATE = cregionCode;
			this.getView().getModel("blankJson").getProperty("/contact")[index].REGION_DESC = cregionDesc;

			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("con_regionSrchId").setValue("");
			this.OTHConregionDialog.close();

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue2 !== cregionDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}
		},

		handleOTHContactRegionSearch: function (oEvent) {

			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("Bezei", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("contactreg_listId");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},

		handleCountryCode: function (oEvent) {

			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			oView.getModel("blankJson").setProperty("/" + sPath, countryCode);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent);
		},

		_hboxTableColumnValidation: function (oEvent) {

			// var Id = oEvent.getSource().sId.split("--")[1];
			// var countryTelecode = this.getView().getModel("blankJson").getProperty("/otherAddress").CONTACT_TELECODE;
			// context.validateCountryContantLength(countryTelecode, Id);

			var sObject = oEvent.getSource().getBindingContext("blankJson").getObject();
			if (sObject.CONTACT_TELECODE === null || sObject.CONTACT_TELECODE === "") {
				oEvent.getSource().setValue(null);
				MessageBox.warning("Select Tele Code");
				return;
			}
			if(sObject.COUNTRY === "IN"){
				var oSource = oEvent.getSource();
				var reg = /[0-9]{10}$/.test(oSource.getValue());
				if (reg === true || oSource.getValue() === "") {
					oSource.setValueState(sap.ui.core.ValueState.None);
					context.onTableHboxValueChange(oEvent);
				} else {
					oEvent.getSource().setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter 10 digit mobile number");
				}
			}else{
				validations._validateMobileNum(oEvent);

			context.onTableHboxValueChange(oEvent);
			}
		},

		handleTableCountryCode: function (oEvent) {

			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/CONTACT_TELECODE", countryCode);
			oView.getModel("blankJson").refresh(true);

			context.getCountryCodeId(oEvent);
		},

		tableContactCountryCode: function (oEvent) {

			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/MOBILE_TELECODE", countryCode);
			oView.getModel("blankJson").refresh(true);

			context.getCountryCodeId(oEvent);
		},

		handleTradeLiceneceDate: function (oEvent) {

			var tradeDate = oEvent.getSource().getDateValue().getTime() + 86400000;
			oView.getModel("blankJson").setProperty("/headerData/LIC_NO_DATE", new Date(tradeDate));

			oView.getModel("G7Json").getData()[0].EXPIRY_DATE = new Date(tradeDate);
			oView.getModel("G7Json").refresh(true);
			oView.getModel("blankJson").refresh(true);

			if (loginData.REQUEST_TYPE === 5) {
				var model, property;
				model = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1];
				property = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[2];
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				if (headData[property] !== dateFormat.format(oEvent.getSource().getDateValue())) {
					if (!updateId.includes(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1])) {
						updateId.push(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
		},

		handleDateOfProposal: function (oEvent) {

			var tradeDate = oEvent.getSource().getDateValue().getTime() + 86400000;
			oView.getModel("blankJson").setProperty("/headerData/PROPOSAL_DATE", new Date(tradeDate));

			oView.getModel("G24Json").getData()[0].PROPOSAL_DATE = new Date(tradeDate);
			oView.getModel("G24Json").refresh(true);
			oView.getModel("blankJson").refresh(true);

			if (loginData.REQUEST_TYPE === 5) {
				var model, property;
				model = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1];
				property = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[2];
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				if (headData[property] !== dateFormat.format(oEvent.getSource().getDateValue())) {
					if (!updateId.includes(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1])) {
						updateId.push(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					updateId.splice(index, 1);
				}
			}
		},

		handleOwnersContactCode: function (oEvent) {

			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/CONTACT_TELECODE", countryCode);
			oView.getModel("blankJson").refresh(true);

			context.getCountryCodeId(oEvent);
		},

		handleTableContactCode: function (oEvent) {

			var countryCode = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/CONTACT_TELECODE", countryCode);
			oView.getModel("blankJson").refresh(true);

			context.getCountryCodeId(oEvent);
		},

		handleBusinessType: function (oEvent) {
			var selected = oEvent.getSource().getSelectedButton().getText();
			oView.getModel("blankJson").setProperty("/headerData/BUSINESS_TYPE", selected);
			oView.getModel("blankJson").refresh(true);

			context.onRadioChange(oEvent);

			// busniessTypeKeys = "";
			// busniessTypeText = "";
			// var selectedItems = oEvent.getParameter("selectedItems");
			// for (var i = 0; i < selectedItems.length; i++) {
			// 	if (i === selectedItems.length - 1) {
			// 		busniessTypeKeys = busniessTypeKeys.concat(selectedItems[i].getKey());
			// 		busniessTypeText = busniessTypeText.concat(selectedItems[i].getText());
			// 	} else {
			// 		busniessTypeKeys = busniessTypeKeys.concat(selectedItems[i].getKey() + ",");
			// 		busniessTypeText = busniessTypeText.concat(selectedItems[i].getText() + ",");
			// 	}
			// }
			// this.onChange(oEvent);
			// var selected = oEvent.getSource().getSelectedButton().getText();
			// oView.getModel("blankJson").setProperty("/headerData/BUSINESS_TYPE", selected);
			// oView.getModel("blankJson").refresh(true);

			// context.onRadioChange(oEvent); //komal
		},

		handleEstablishmentDate: function (oEvent) {

			//this.setFinancialModel(oEvent.getSource().getValue());
			context.onChange(oEvent);
		},

		handleICVValidity: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property;
				model = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1];
				property = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[2];
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				if (headData[property] !== dateFormat.format(oEvent.getSource().getDateValue())) {
					if (!updateId.includes(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1])) {
						updateId.push(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
		},

		//Section Two business logics
		getBankData: function (data) {

			var bankData = [{
				"BANK_ID": data.bankDetails.BANK_ID || null,
				"BANK_NO": data.bankDetails.BANK_NO || null,
				"BANK_CURRENCY": data.bankDetails.BANK_CURRENCY || null,
				"BANK_COUNTRY": data.bankDetails.BANK_COUNTRY || null,
				"ACCOUNT_NAME": null,
				"ACCOUNT_HOLDER": null,
				"BANK_KEY": data.bankDetails.BANK_KEY || null,
				"ACCOUNT_NO": data.bankDetails.ACCOUNT_NO || null,
				"BENEFICIARY": data.bankDetails.BENEFICIARY || null,
				"BIC_CODE": data.bankDetails.BIC_CODE || null,
				"DUNS_NUMBER": data.bankDetails.DUNS_NUMBER || null,
				"IBAN_NUMBER": data.bankDetails.IBAN_NUMBER || null,
				"INVOICE_CURRENCY": null,
				"NAME": data.bankDetails.NAME || null,
				"BRANCH_NAME": data.bankDetails.BRANCH_NAME || null,
				"OTHER_CODE_NAME": data.bankDetails.OTHER_CODE_NAME || null,
				"OTHER_CODE_VAL": data.bankDetails.OTHER_CODE_VAL || null,
				"PAYMENT_METHOD": null,
				"PAYMENT_METHOD_DESC": null,
				"PAYMENT_TERMS": null,
				"PAYMENT_TERMS_DESC": null,
				"ROUTING_CODE": data.bankDetails.ROUTING_CODE || null,
				"SWIFT_CODE": data.bankDetails.SWIFT_CODE || null,
				"VAT_REG_DATE": null,
				"VAT_REG_NUMBER": null,
				"PAYMENT_TYPE": "PRI",
			}];
			return bankData;
		},

		handleAddBusHistory: function (oEvent) {
			oView.getModel("blankJson").getProperty("/busHistory").push({
				"DEALERSHIP": null,
				"SUPPLIER_NAME": null,
				"SINCE": null,
				"PROD_GROUP": null,
				"PURCHASES": null
			});
			oView.getModel("blankJson").refresh(true);
		},

		handleAddCustomerDetail: function (oEvent) {
			oView.getModel("blankJson").getProperty("/customerDetail").push({
				"CUST_NO": null,
				"CUSTOMER_NAME": null,
				"YEAR1": null,
				"YEAR2": null
			});
			oView.getModel("blankJson").refresh(true);
		},

		handleAddPromoterDetail: function (oEvent) {
			oView.getModel("blankJson").getProperty("/promotors").push({
				"NAME": null,
				"QUALIFICATION": null,
				"WORK_EXP": null,
				"YRS_IN_COMP": null,
				"DESIGNATION": null,
				"ROLE": null
			});
			oView.getModel("blankJson").refresh(true);
		},

		handleAddBankInfo: function (oEvent) {
			oView.getModel("blankJson").getProperty("/otherBankDetails").push({
				"BANK_ID": null,
				"BANK_NO": null,
				"BANK_CURRENCY": null,
				"BANK_COUNTRY": null,
				"COUNTRY_DESC": null,
				"ACCOUNT_NAME": null,
				"ACCOUNT_HOLDER": null,
				"BANK_KEY": null,
				"ACCOUNT_NO": null,
				"BENEFICIARY": null,
				"BIC_CODE": null,
				"DUNS_NUMBER": null,
				"IBAN_NUMBER": null,
				"INVOICE_CURRENCY": null,
				"NAME": null,
				"BRANCH_NAME": null,
				"OTHER_CODE_NAME": null,
				"OTHER_CODE_VAL": null,
				"PAYMENT_METHOD": null,
				"PAYMENT_METHOD_DESC": null,
				"PAYMENT_TERMS": null,
				"PAYMENT_TERMS_DESC": null,
				"ROUTING_CODE": null,
				"SWIFT_CODE": null,
				"VAT_REG_DATE": null,
				"VAT_REG_NUMBER": null,
				"PAYMENT_TYPE": "OTH"
			});

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/otherBankDetails").push({
					"BANK_ID": null,
					"BANK_NO": null,
					"BANK_CURRENCY": null,
					"BANK_COUNTRY": null,
					"COUNTRY_DESC": null,
					"ACCOUNT_NAME": null,
					"ACCOUNT_HOLDER": null,
					"BANK_KEY": null,
					"ACCOUNT_NO": null,
					"BENEFICIARY": null,
					"BIC_CODE": null,
					"DUNS_NUMBER": null,
					"IBAN_NUMBER": null,
					"INVOICE_CURRENCY": null,
					"NAME": null,
					"BRANCH_NAME": null,
					"OTHER_CODE_NAME": null,
					"OTHER_CODE_VAL": null,
					"PAYMENT_METHOD": null,
					"PAYMENT_METHOD_DESC": null,
					"PAYMENT_TERMS": null,
					"PAYMENT_TERMS_DESC": null,
					"ROUTING_CODE": null,
					"SWIFT_CODE": null,
					"VAT_REG_DATE": null,
					"VAT_REG_NUMBER": null,
					"PAYMENT_TYPE": "OTH"
				})
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("bankTableId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherBankDetails").length);
		},

		handleAddBankingDetails: function (oEvent) {
			oView.getModel("blankJson").getProperty("/BankingDetails").push({
				"NAME": null,
				"BRANCH_NAME": null,
				"FACILTY": null,
				"AMOUNT_LIMIT": null,
				"ASSO_SINCE": null
			});

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/BankingDetails").push({
					"NAME": null,
					"BRANCH_NAME": null,
					"FACILTY": null,
					"AMOUNT_LIMIT": null,
					"ASSO_SINCE": null
				})
			};
			oView.getModel("blankJson").refresh(true);
		},

		//21/21
		deleteBankDetails: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/otherBankDetails").splice(index, 1);
			oView.getModel("blankJson").refresh(true);
			oView.byId("bankTableId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/otherBankDetails").length);

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/otherBankDetails").splice(index, 1);
			}
		},

		handleDeleteBusHistory: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/busHistory").splice(index, 1);
			oView.getModel("blankJson").refresh(true);

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/busHistory").splice(index, 1);
			}
		},

		handleDeleteCustomerDetails: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/customerDetail").splice(index, 1);
			oView.getModel("blankJson").refresh(true);

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/customerDetail").splice(index, 1);
			}
		},

		handleDeletePromotorDetails: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/promotors").splice(index, 1);
			oView.getModel("blankJson").refresh(true);

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/promotors").splice(index, 1);
			}
		},

		deleteBankingDetails: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/BankingDetails").splice(index, 1);
			oView.getModel("blankJson").refresh(true);

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/BankingDetails").splice(index, 1);
			}
		},

		//20/21
		//Country dialog for other bank details
		openBankCountryDialog: function (oEvent) {

			this.otherBankRow = oEvent.getSource();
			if (!this.otherBankCountry) {
				this.otherBankCountry = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.otherBankCountry",
					this);
				this.getView().addDependent(this.otherBankCountry);
			}
			this.otherBankCountry.open();

			context._onTableValueHelpChange3(oEvent);
		},

		//20/21
		handleOtherBankCountrySelection: function (oEvent) {

			var index = parseInt(this.otherBankRow.getBindingContext("blankJson").getPath().split("/")[2]);
			var selectedObj = this.getView().getModel("blankJson").getProperty("/otherBankDetails");

			var countryCode = oEvent.getSource().getSelectedItem().getBindingContext("bankCountryJson").getObject().Land1;
			var countyDesc = oEvent.getSource().getSelectedItem().getBindingContext("bankCountryJson").getObject().Landx;
			selectedObj[index].BANK_COUNTRY = countryCode;
			selectedObj[index].COUNTRY_DESC = countyDesc;
			selectedObj[index].SWIFT_CODE = null;
			selectedObj[index].NAME = null;
			selectedObj[index].BRANCH_NAME = null;

			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("bankCountry_Id").removeSelections(true);
			sap.ui.getCore().byId("bcSrchId").setValue("");
			this.onRefresh();
			this.otherBankCountry.close();

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue3 !== countyDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}

			this.readIBANInfo(countryCode, index, "TD");
		},

		closeOtherBankCountryDialog: function () {
			this.otherBankCountry.close();
		},

		onRefresh: function () {
			var list = sap.ui.getCore().byId("bankCountry_Id");
			var binding = list.getBinding("items");
			binding.filter(null);
		},

		//20/21
		openSwiftCodeDialog: function (oEvent) {
			this.otherSwift = oEvent.getSource();

			var index = parseInt(this.otherSwift.getBindingContext("blankJson").getPath().split("/")[2]);
			var country = this.getView().getModel("blankJson").getProperty("/otherBankDetails")[index].BANK_COUNTRY;

			if (country === null || country === "") {
				MessageBox.information("Please Select Bank Country");
				return;
			}

			if (country === "IN") {
				var swiftCodeArr = [{
					swift: "FIRNINBB"
				}, {
					swift: "HDFCINBB"
				}, {
					swift: "HSBC0110"
				}, {
					swift: "ICICINBB"
				}]
				var swiftCodeJson = new JSONModel();
				swiftCodeJson.setData(swiftCodeArr);
				this.getView().setModel(swiftCodeJson, "swiftCodeJson");

			} else if (country === "AE") {

				var swiftCodeArr = [{
					swift: "ADCBAEAA"
				}, {
					swift: "BARBAEAD"
				}]
				var swiftCodeJson = new JSONModel();
				swiftCodeJson.setData(swiftCodeArr);
				this.getView().setModel(swiftCodeJson, "swiftCodeJson");

			} else if (country === "US" || country === "CA" || country === "AU") {
				var swiftCodeArr = [{
					swift: "PNCCUS33"
				}, {
					swift: "INSTUS5D"
				}];
				var oswiftCodeJson = new JSONModel();
				oswiftCodeJson.setData(swiftCodeArr);
				this.getView().setModel(oswiftCodeJson, "swiftCodeJson");

			} else if (country === "IT") {
				var swiftCodeArr = [{
					swift: "BCITITMM"
				}, {
					swift: "BCCFIT33"
				}, {
					swift: "BPCVIT2S"
				}, {
					swift: "ICRAITRR"
				}, {
					swift: "BNLIITRR"
				}, {
					swift: "BAPPIT21"
				}]
				var oswiftCodeJson = new JSONModel();
				oswiftCodeJson.setData(swiftCodeArr);
				this.getView().setModel(oswiftCodeJson, "swiftCodeJson");

			} else {
				this.readSwiftCode(country, "S");
			}

			if (!this.otherSwiftCode) {
				this.otherSwiftCode = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.otherSwiftCode",
					this);
				this.getView().addDependent(this.otherSwiftCode);
			}
			this.otherSwiftCode.open();

			context._onTableValueHelpChange3(oEvent);
		},

		//20/21
		handleOtherSwiftCode: function (oEvent) {

			var index = parseInt(this.otherSwift.getBindingContext("blankJson").getPath().split("/")[2]);
			var selectedObj = this.getView().getModel("blankJson").getProperty("/otherBankDetails");

			var swiftCode = oEvent.getSource().getSelectedItem().getBindingContext("swiftCodeJson").getObject().swift;
			selectedObj[index].SWIFT_CODE = swiftCode;
			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("swiftSrchId").setValue("");
			this.otherSwiftCode.close();

			if (swiftCode === "ICICINBB") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "ICICI Bank");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "Bund Garden Road, Pune- 411 001");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "00110502242");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "FIRNINBB") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "FIRSTRAND BANK LTD");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "MUMBAI");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "IN000000000");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "HDFCINBB") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "HDFC Bank Ltd");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "MUMBAI");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "00600330012");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "HSBC0110") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "HSBC BANK");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "Gachibowli, Hyderabad");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "IN000000002");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "ADCBAEAA") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "Abu Dhabi Commercial Bank PJSC");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "Abu Dhabi");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "AE000000003");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "BARBAEAD") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "Bank of Baroda");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "Hamdan Branch");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "AE000000005");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "QWERTYUI") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "Bank of Country");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "Doyam Branch");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "OTH00000009");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "PNCCUS33") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "PNC Bank");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "Pittsburgh");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "US0000018");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "INSTUS5D") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "Adams Bank & Trust");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "Ogallala");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "300000000");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "");
			} else if (swiftCode === "BCITITMM") {
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/NAME", "INTESA SAN PAOLO");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BRANCH_NAME", "INTESA SAN PAOLO, Italy");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_KEY", "2000000003");
				oView.getModel("blankJson").setProperty("/otherBankDetails/" + index + "/BANK_NO", "2000000003");
			}
			oView.getModel("blankJson").refresh(true);

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue3 !== swiftCode) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, val, val2;
				model = this.getView().byId("othSwiftId").oParent.oParent.mBindingInfos.rows.path.split("/")[1]
				val = oView.getModel("blankJson").getProperty("/otherBankDetails/" + index + "/NAME");

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				if (headData[index]["NAME"] !== val) {
					if (!updateId.includes(this.getView().byId("othBankNameId").mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1])) {
						updateId.push(this.getView().byId("othBankNameId").mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(this.getView().byId("othBankNameId").mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1]);
					//delete updateId[index];
					updateId.splice(index, 1);
				}

				val2 = oView.getModel("blankJson").getProperty("/otherBankDetails/" + index + "/BRANCH_NAME");
				if (headData[index]["BRANCH_NAME"] !== val2) {
					if (!updateId.includes(this.getView().byId("othBranchNameId").mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1])) {
						updateId.push(this.getView().byId("othBranchNameId").mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(this.getView().byId("othBranchNameId").mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1]);
					//delete updateId[index];
					if (index === -1) {

					}
					else {
						updateId.splice(index, 1);
					}
				}
			}

			//	this.getBankDetails(selectedObj[index].BANK_COUNTRY, swiftCode, "OTH", index, "");
		},

		handleBankSwiftSearchHQ: function (oEvent) {

			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("Banks", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("Swift", sap.ui.model.FilterOperator.Contains, sQuery)];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}
			var oList = sap.ui.getCore().byId("bankSwift_IdHQ");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		closeBankSwiftDialog: function () {
			this.HQBankRegion.close();
			this.HQBankRegion.destroy();
			this.HQBankRegion = null;
		},

		closeOtherSwiftCodeDialog: function (oEvent) {
			this.otherSwiftCode.close();
		},

		handleBankSwiftSelection: function (oEvent) {

			var selectedObj = this.getView().getModel("blankJson").getProperty("/bankDetails");
			var bCountry = oView.getModel("blankJson").getProperty("/bankDetails").BANK_COUNTRY;
			var swiftCode = oEvent.getSource().getSelectedItem().getBindingContext("swiftJson").getObject().Swift;
			selectedObj.SWIFT_CODE = swiftCode;
			oView.getModel("blankJson").refresh(true);

			if (swiftCode === "ICICINBB") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "ICICI Bank");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Bund Garden Road, Pune- 411 001");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "0011050224");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "FIRNINBB") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "FIRSTRAND BANK LTD");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "MUMBAI");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "IN000000000");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "HDFCINBB") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "HDFC Bank Ltd");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Mumbai");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "00600330012");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "HSBC0110") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "HSBC BANK");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Gachibowli, Hyderabad");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "IN000000002");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "SOININ55") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "South Indian Bank");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Trichy Road");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "IN000000004");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "ADCBAEAA") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "Abu Dhabi Commercial Bank PJSC");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Abu Dhabi");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "AE000000003");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "BARBAEAD") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "Bank of Baroda");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Hamdan Branch");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "AE000000005");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "QWERTYUI") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "Bank of Country");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Doyam Branch");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "OTH00000009");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			}

			//this.getBankDetails(bCountry, swiftCode, "PRI", 0, "", "");

			this.HQBankRegion.close();

			if (loginData.REQUEST_TYPE === 5) {
				if (context.formValueHelpOldValue2 !== swiftCode) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, val, val2;

				val = this.getView().byId("S2G1T1F3").getValue();
				model = "bankDetails";
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				if (headData["NAME"] !== val) {
					if (!updateId.includes("S2G1T1F3")) {
						updateId.push("S2G1T1F3");
					}
				} else {
					var index = updateId.indexOf("S2G1T1F3");
					updateId.splice(index, 1);
				}

				val2 = this.getView().byId("S2G1T1F4").getValue();
				if (headData["BRANCH_NAME"] !== val2) {
					if (!updateId.includes("S2G1T1F4")) {
						updateId.push("S2G1T1F4");
					}
				} else {
					var index = updateId.indexOf("S2G1T1F4");
					updateId.splice(index, 1);
				}
			}
		},

		otherSwiftCodeSearch: function (oEvent) {

			var sQuery = oEvent.getSource().getValue();
			var pFilter = [];
			if (sQuery) {
				pFilter.push(new Filter("swift", sap.ui.model.FilterOperator.Contains, sQuery));
			}
			var listItem = sap.ui.getCore().byId("oSwift_Id");
			var item = listItem.getBinding("items");
			item.filter(pFilter);
		},

		//Country dialog for primary bank details
		handleBankCountry: function (oEvent) {

			var country = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			oView.getModel("blankJson").setProperty("/" + sPath, country);

			if (oView.byId("S2G1T1F6").getSelectedKey()) {
				oView.byId("S2G1T1F6").setSelectedKey(null);
			}
			if (oView.byId("S2G1T1F1").getValue()) {
				oView.byId("S2G1T1F1").setValue(null)
			}
			if (oView.byId("S2G1T1F4").getValue()) {
				oView.byId("S2G1T1F4").setValue(null)
			}

			if (country === "US") {
				oView.byId("S2G1T1F8_lbl").setRequired(true);
			} else {
				oView.byId("S2G1T1F8_lbl").setRequired(false);
			}
			oView.getModel("blankJson").refresh(true);

			this.readSwiftCode(country, "P");
			this.readIBANInfo(country, "", "SD");

			context.onChange(oEvent);
		},

		onBranchNameChange: function (oEvent) {
			context.onChange(oEvent);
		},

		handleSwiftCode: function (oEvent) {

			var swiftCode = oEvent.getSource().getSelectedKey();
			var bCountry = oView.getModel("blankJson").getProperty("/bankDetails").BANK_COUNTRY;
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			oView.getModel("blankJson").setProperty("/" + sPath, swiftCode);
			oView.getModel("blankJson").refresh(true);

			if (swiftCode === "ICICINBB") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "ICICI Bank");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Bund Garden Road, Pune- 411 001");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "001105022428");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "FIRNINBB") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "FIRSTRAND BANK LTD");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "MUMBAI");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "IN000000000");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "HDFCINBB") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "HDFC Bank Ltd");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Mumbai");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "00600330012164");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "HSBC0110") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "HSBC BANK");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Gachibowli, Hyderabad");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "IN000000002");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "SOININ55") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "South Indian Bank");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Trichy Road");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "IN000000004");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "ADCBAEAA") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "Abu Dhabi Commercial Bank PJSC");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Abu Dhabi");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "AE000000003");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "BARBAEAD") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "Bank of Baroda");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Hamdan Branch");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "AE000000005");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			} else if (swiftCode === "QWERTYUI") {
				oView.getModel("blankJson").setProperty("/bankDetails/NAME", "Bank of Country");
				oView.getModel("blankJson").setProperty("/bankDetails/BRANCH_NAME", "Doyam Branch");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", "OTH00000009");
				oView.getModel("blankJson").setProperty("/bankDetails/BANK_NO", "");
			}

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, val, val2;
				if (oEvent.getId() === "selectionChange") {
					model = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath.split("/")[1];
					property = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath.split("/")[2];
					val = oEvent.getSource().getSelectedKey();
				}
				val = this.getView().byId("S2G1T1F1").getValue();

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				if (headData["NAME"] !== val) {
					if (!updateId.includes("S2G1T1F1")) {
						updateId.push("S2G1T1F1");
					}
				} else {
					var index = updateId.indexOf("S2G1T1F1");
					//delete updateId[index];
					updateId.splice(index, 1);
				}

				val2 = this.getView().byId("S2G1T1F4").getValue();
				if (headData["BRANCH_NAME"] !== val2) {
					if (!updateId.includes("S2G1T1F4")) {
						updateId.push("S2G1T1F4");
					}
				} else {
					var index = updateId.indexOf("S2G1T1F4");
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}

			this.getBankDetails(bCountry, swiftCode, "PRI", 0, "", "");
			context.onChange(oEvent);
		},

		handleBankName: function (oEvent) {

			var bankName = oEvent.getSource().getSelectedKey();
			var bankKey = oEvent.getSource().getSelectedItem().getBindingContext("swiftJson").getObject().Bankl;
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			oView.getModel("blankJson").setProperty("/" + sPath, bankName);
			oView.getModel("blankJson").setProperty("/bankDetails/BANK_KEY", bankKey);
			oView.getModel("blankJson").refresh(true);
		},

		handleBankBranch: function (oEvent) {

			var branchName = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			oView.getModel("blankJson").setProperty("/" + sPath, branchName);
			oView.getModel("blankJson").refresh(true);
		},

		handleInvoiceCurrency: function (oEvent) {

			var sInvoiceCurrency = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
			oView.getModel("blankJson").setProperty("/" + sPath, sInvoiceCurrency);
			oView.getModel("blankJson").refresh(true);

			context.onChange(oEvent); //komal
		},

		handleCurrencySelection: function (oEvent) {

			var currency = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/CURRENCY", currency);
			oView.getModel("blankJson").refresh(true);

			context._onTableValueChange(oEvent);

		},

		//28/21
		handleBankCurrencySelection: function (oEvent) {

			var currency = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/BANK_CURRENCY", currency);
			oView.getModel("blankJson").refresh(true);

			context._onTableValueChange(oEvent);
		},

		handleActivityType: function (oEvent) {

			var activityType = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/ACTIVITY_TYPE", activityType);
			oView.getModel("blankJson").refresh(true);
		},

		//12-09-2022
		radioButtonSelect: function (oevt) {

			if (oevt.getSource().getSelectedButton().getProperty("text") === "YES") {
				oView.getModel("dynamicCountModel").setProperty("/VATMandatoryCount", 2);
				oView.getModel("blankJson").setProperty("/headerData/VAT_CHECK", "Y");
				this.getView().byId("simpleForm9").setVisible(true);
				oView.getModel("localModel").setProperty("/VatNumber", true);
				oView.getModel("localModel").setProperty("/VatDate", true);
				// this.getView().byId("id_vatevidence").setVisible(false);
				// oView.byId("msgStripId4").setVisible(false);
			} else if (oevt.getSource().getSelectedButton().getProperty("text") === "NO") {
				oView.getModel("dynamicCountModel").setProperty("/VATMandatoryCount", 0);
				oView.getModel("blankJson").setProperty("/headerData/VAT_CHECK", "N");
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_NUMBER", null);
				oView.getModel("blankJson").setProperty("/headerData/VAT_REG_DATE", null);
				this.getView().byId("simpleForm9").setVisible(false);
				oView.getModel("localModel").setProperty("/VatNumber", false);
				oView.getModel("localModel").setProperty("/VatDate", false);
				// this.getView().byId("id_vatevidence").setVisible(false);
				// oView.byId("msgStripId4").setVisible(false);
			}
		},

		handleICVPercentage: function (oEvent) {

			//validations.floatValidation(oEvent);

			this.onChange(oEvent);
		},

		HQBankCountryDialog: function (oEvent) {
			this.HQBankRow = oEvent.getSource();
			BusyIndicator.show(0);
			if (!this.HQBankCountry) {
				this.HQBankCountry = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.BankCountry", this);
				this.getView().addDependent(this.HQBankCountry);
			}
			BusyIndicator.hide();
			this.HQBankCountry.open();
			context._onFormValueHelpChange2(oEvent);
		},

		HQBankSwiftDialog: function (oEvent) {
			this.HQRegionRow = oEvent.getSource();
			BusyIndicator.show(0);
			if (!this.HQBankRegion) {
				this.HQBankRegion = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.BankSwiftCode", this);
				this.getView().addDependent(this.HQBankRegion);
			}
			BusyIndicator.hide();
			this.HQBankRegion.open();
			context._onFormValueHelpChange2(oEvent);
		},

		handleBankCountrySearchHQ: function (oEvent) {

			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("Landx", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.Contains, sQuery)];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}
			var oList = sap.ui.getCore().byId("bankCountry_IdHQ");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		closeBankCountryDialog: function () {
			this.HQBankCountry.close();
			this.HQBankCountry.destroy();
			this.HQBankCountry = null;
		},

		handleBankCountrySelection: function (oEvent) {

			var selectedObj = this.getView().getModel("blankJson").getProperty("/bankDetails");

			var countryCode = oEvent.getSource().getSelectedItem().getBindingContext("bankCountryJson").getObject().Land1;
			var countyDesc = oEvent.getSource().getSelectedItem().getBindingContext("bankCountryJson").getObject().Landx;
			selectedObj.BANK_COUNTRY = countryCode;
			selectedObj.COUNTRY_DESC = countyDesc;
			selectedObj.SWIFT_CODE = null;
			selectedObj.NAME = null;
			selectedObj.BRANCH_NAME = null;

			if (countryCode === "US" || countryCode === "CA" || countryCode === "AU") {

				oView.getModel("mandatoryJson").oData.S2G1T1F8 = "X";
				oView.getModel("mandatoryJson").oData.S2G1T1F9 = null;
				oView.getModel("mandatoryJson").oData.S2G1T1F12 = null;
				oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 1);
				oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 0);
				oView.byId("S2G1T1F8_lbl").setRequired(true);
				oView.byId("S2G1T1F11_OC_lbl").setRequired(false);
				oView.byId("S2G1T1F9_OCN_lbl").setRequired(false);

			} else if (countryCode === "IN") {

				oView.getModel("mandatoryJson").oData.S2G1T1F8 = null;
				oView.getModel("mandatoryJson").oData.S2G1T1F9 = "X";
				oView.getModel("mandatoryJson").oData.S2G1T1F12 = "X";
				oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 0);
				oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 2);
				oView.byId("S2G1T1F8_lbl").setRequired(false);
				oView.byId("S2G1T1F11_OC_lbl").setRequired(true);
				oView.byId("S2G1T1F9_OCN_lbl").setRequired(true);;

			} else {

				oView.getModel("mandatoryJson").oData.S2G1T1F8 = null;
				oView.getModel("mandatoryJson").oData.S2G1T1F9 = null;
				oView.getModel("mandatoryJson").oData.S2G1T1F12 = null;
				oView.getModel("dynamicCountModel").setProperty("/routingCodeCount", 0);
				oView.getModel("dynamicCountModel").setProperty("/otherCodeCount", 0);
				oView.byId("S2G1T1F11_OC_lbl").setRequired(false);
				oView.byId("S2G1T1F9_OCN_lbl").setRequired(false);
				oView.byId("S2G1T1F8_lbl").setRequired(false);
			}

			oView.getModel("mandatoryJson").refresh(true);
			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("bankCountry_IdHQ").removeSelections(true);
			sap.ui.getCore().byId("bcSrchIdHQ").setValue("");
			this.onRefreshHQBank();

			this.readSwiftCode(countryCode, "P");
			this.readIBANInfo(countryCode, "", "SD");
			this.HQBankCountry.close();

			if (loginData.REQUEST_TYPE === 5) {
				if (context.formValueHelpOldValue2 !== countyDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}
		},

		onRefreshHQBank: function () {
			var list = sap.ui.getCore().byId("bankCountry_IdHQ");
			var binding = list.getBinding("items");
			binding.filter(null);
		},

		_onFormValueHelpChange2: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, index = null,
					dataIndex = null,
					val;
				model = oEvent.getSource().mBindingInfos.value.binding.sPath;
				var headData = oView.getModel("originalJson").getProperty(model);
				context.id = oEvent.getSource().mBindingInfos.visible.binding.aBindings[0].sPath.split("/")[1];
				context.formValueHelpOldValue2 = headData;
			}
		},

		handleICV: function (oEvent) {

			if (oEvent.getSource().getSelectedButton().getProperty("text") === "YES") {
				oView.getModel("dynamicCountModel").setProperty("/ICVMandatoryCount", 3);
				oView.getModel("blankJson").setProperty("/headerData/ICV_CHECK", "Y");
				oView.getModel("localModel").setProperty("/icv_sForm", true);
				oView.getModel("localModel").setProperty("/icv_table", true);

			} else if (oEvent.getSource().getSelectedButton().getProperty("text") === "NO") {
				oView.getModel("dynamicCountModel").setProperty("/ICVMandatoryCount", 0);
				oView.getModel("blankJson").setProperty("/headerData/ICV_CHECK", "N");
				oView.getModel("blankJson").setProperty("/headerData/ICV_SCORE", null);
				oView.getModel("blankJson").setProperty("/headerData/ICV_DATE", null);
				oView.getModel("localModel").setProperty("/icv_sForm", false);
				oView.getModel("localModel").setProperty("/icv_table", false);
			}
		},

		//Section three business logic

		handleProductCategory: function (oEvent) {

			var sProduct = oEvent.getSource().getSelectedKey();
			var productDesc = oEvent.getSource()._getSelectedItemText();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/PROD_CATEGORY", sProduct);
			oView.getModel("blankJson").setProperty(sPath + "/PROD_CATEGORY_DEC", productDesc);
			oView.getModel("blankJson").refresh(true);

			context._onTableValueChange(oEvent); //komal
		},

		handleProductType: function (oEvent) {

			var type = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/TYPE", type);
			oView.getModel("blankJson").refresh(true);

			context._onTableValueChange(oEvent); //komal
		},

		handleProdManRadioBtn: function (oEvent) {

			var bSelected = oEvent.getSource().getSelectedButton().getText();
			var sPath = oEvent.getSource().getSelectedButton().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/PLANT_MANF_CAPABILITY", bSelected);
			oView.getModel("blankJson").refresh(true);

			context._onTableRadioBtnChange(oEvent); //komal
		},

		//01/02/22
		supplierCategorySelectionFinish: function (oEvent) {

			supplierCategoryKeys = "";
			supplierCategoryText = "";
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
			this.onChange(oEvent);
		},

		handleProductInfo: function () {

			oView.getModel("blankJson").getProperty("/productInfo").push({
				"TYPE": "",
				"PROD_NAME": null,
				"PROD_DESCRIPTION": null,
				"PROD_CATEGORY": null,
				"PROD_CATEGORY_DEC": null
			});

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/productInfo").push({
					"TYPE": "",
					"PROD_NAME": null,
					"PROD_DESCRIPTION": null,
					"PROD_CATEGORY": null,
					"PROD_CATEGORY_DEC": null
				});
			}
			oView.getModel("blankJson").refresh(true);
			oView.byId("table_ProdSvrId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/productInfo").length);
		},

		deleteProductDetails: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			if (index === "0") {
				var iProductObj = oView.getModel("blankJson").getProperty("/productInfo")[0];
				iProductObj.TYPE = "",
					iProductObj.PROD_NAME = null,
					iProductObj.PROD_DESCRIPTION = null,
					iProductObj.PROD_CATEGORY = null,
					iProductObj.PROD_CATEGORY_DEC = null
			} else {
				oView.getModel("blankJson").getProperty("/productInfo").splice(index, 1);
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("table_ProdSvrId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/productInfo").length);

			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/productInfo").splice(index, 1);
			}
		},

		handleOperationalCapacity: function () {

			oView.getModel("blankJson").getProperty("/operationalCap").push({
				"CITY": null,
				"COUNTRY": null,
				"PLANT_MANF_CAPABILITY": null,
				"PROD_CAPACITY": null,
				"TIME_TO_SERVICE": null
			});

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/operationalCap").push({
					"CITY": null,
					"COUNTRY": null,
					"PLANT_MANF_CAPABILITY": null,
					"PROD_CAPACITY": null,
					"TIME_TO_SERVICE": null
				});
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("tableOIId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/operationalCap").length);
		},

		deleteOperationalDetails: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			if (index === "0") {
				var iOperationalObj = oView.getModel("blankJson").getProperty("/operationalCap")[0];
				iOperationalObj.CITY = null,
					iOperationalObj.COUNTRY = null,
					iOperationalObj.PLANT_MANF_CAPABILITY = null,
					iOperationalObj.PROD_CAPACITY = null,
					iOperationalObj.TIME_TO_SERVICE = null
			} else {
				oView.getModel("blankJson").getProperty("/operationalCap").splice(index, 1);
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("tableOIId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/operationalCap").length);

			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/operationalCap").splice(index, 1);
			}
		},

		handleClientsInfo: function () {

			oView.getModel("blankJson").getProperty("/clientInfo").push({
				"CUSTOMER_NAME": null,
				"CUSTOMER_SHARE": null
			});

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/clientInfo").push({
					"CUSTOMER_NAME": null,
					"CUSTOMER_SHARE": null
				});
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("tableClientId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/clientInfo").length);
		},

		deleteClientDetails: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			if (index === "0") {
				var iClientObj = oView.getModel("blankJson").getProperty("/clientInfo")[0];
				iClientObj.CUSTOMER_NAME = null,
					iClientObj.CUSTOMER_SHARE = null
			} else {
				oView.getModel("blankJson").getProperty("/clientInfo").splice(index, 1);
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("tableClientId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/clientInfo").length);

			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/clientInfo").splice(index, 1);
			}
		},

		handleOEM: function () {

			oView.getModel("blankJson").getProperty("/OEMInfo").push({
				"OEM_TYPE": "OEM_EX",
				"COMPANY_NAME": null,
				"COUNTRY": null,
				"OEM_CATEGORY": null
			});

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/OEMInfo").push({
					"OEM_TYPE": "OEM_EX",
					"COMPANY_NAME": null,
					"COUNTRY": null,
					"OEM_CATEGORY": null
				});
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("tableOEMId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/OEMInfo").length);
		},

		deleteOEMDetails: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			if (index === "0") {
				var iOEMObj = oView.getModel("blankJson").getProperty("/OEMInfo")[0];
				iOEMObj.COMPANY_NAME = null,
					iOEMObj.COUNTRY = null,
					iOEMObj.OEM_CATEGORY = null
			} else {
				oView.getModel("blankJson").getProperty("/OEMInfo").splice(index, 1);
			}
			oView.getModel("blankJson").refresh(true);
			oView.byId("tableOEMId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/OEMInfo").length);

			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/OEMInfo").splice(index, 1);
			}
		},

		handleNONOEM: function () {

			oView.getModel("blankJson").getProperty("/NONOEMInfo").push({
				"OEM_TYPE": "OEM_NE",
				"COMPANY_NAME": null,
				"COUNTRY": null,
				"OEM_CATEGORY": null
			});

			if (loginData.REQUEST_TYPE === 5) {
				oView.getModel("originalJson").getProperty("/NONOEMInfo").push({
					"OEM_TYPE": "OEM_NE",
					"COMPANY_NAME": null,
					"COUNTRY": null,
					"OEM_CATEGORY": null
				});
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("tableNONOEMId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/NONOEMInfo").length);
		},

		deleteNONOEMDetails: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			if (index === "0") {
				var iNONOEMObj = oView.getModel("blankJson").getProperty("/NONOEMInfo")[0];
				iNONOEMObj.COMPANY_NAME = null,
					iNONOEMObj.COUNTRY = null,
					iNONOEMObj.OEM_CATEGORY = null
			} else {
				oView.getModel("blankJson").getProperty("/NONOEMInfo").splice(index, 1);
			}

			oView.getModel("blankJson").refresh(true);
			oView.byId("tableNONOEMId").setVisibleRowCount(oView.getModel("blankJson").getProperty("/NONOEMInfo").length);

			if (loginData.REQUEST_TYPE === 5 && index !== "0") {
				oView.getModel("originalJson").getProperty("/NONOEMInfo").splice(index, 1);
			}
		},

		//Section Four Logis
		getDisclousers: function (data) {

			var dObject = [{
				// Conflict of Interest
				"INTEREST_CONFLICT": data.INTEREST_CONFLICT === -1 ? null : data.INTEREST_CONFLICT,
				"INTEREST_CONFLICT_TEXT": data.INTEREST_CONFLICT_TEXT || null,
				// Legal case disclosure
				"ANY_LEGAL_CASES": data.ANY_LEGAL_CASES === -1 ? null : data.ANY_LEGAL_CASES,
				"ANY_LEGAL_CASES_TEXT": data.ANY_LEGAL_CASES_TEXT || null,

				// Supplier declaration
				"AKN_SIGNATURE": data.AKN_SIGNATURE || null,
				"AKN_NAME": data.AKN_NAME || null,
				"AKN_DESIGNATION": data.AKN_DESIGNATION || null,
				"AKN_DATE": data.AKN_DATE || null,
				"AKN_COMPANY_STAMP": data.AKN_COMPANY_STAMP || null,

				//Academic Discount
				"ACADEMIC_DISCOUNT": data.ACADEMIC_DISCOUNT === -1 ? null : data.ACADEMIC_DISCOUNT,
				// Relatives Working for

				"RELATIVE_WORKING": data.RELATIVE_WORKING === -1 ? null : data.RELATIVE_WORKING,
				// Validation of information submitted
				"VALID_SIGNATORY_NAME": data.VALID_SIGNATORY_NAME || null,
				"VALID_DESIGNATION": data.VALID_DESIGNATION || null,
				// REACH compliance
				"REACH_COMPLIANCE": data.REACH_COMPLIANCE === -1 ? null : data.REACH_COMPLIANCE,
				// CLP compliance
				"CLP_COMPLIANCE": data.CLP_COMPLIANCE === -1 ? null : data.CLP_COMPLIANCE,
				// ITAR and FCPA compliance
				"APPLY_ITAR_REG": data.APPLY_ITAR_REG === -1 ? null : data.APPLY_ITAR_REG,
				"SUPPLY_ITAR_EAR": data.SUPPLY_ITAR_EAR === -1 ? null : data.SUPPLY_ITAR_EAR,
				"APPLY_FCPA": data.APPLY_FCPA === -1 ? null : data.APPLY_FCPA,
				"US_ORIGIN_SUPPL": data.US_ORIGIN_SUPPL === -1 ? null : data.US_ORIGIN_SUPPL,
				// IT Equipment and Tools
				"ERP_MGMT_SYSTEM": data.ERP_MGMT_SYSTEM === -1 ? null : data.ERP_MGMT_SYSTEM,
				"ERP_MGMT_SYSTEM_NAME": data.ERP_MGMT_SYSTEM_NAME || null,
				"INDUSRIAL_DESIGN_SW": data.INDUSRIAL_DESIGN_SW === -1 ? null : data.INDUSRIAL_DESIGN_SW,
				"INDUSRIAL_DESIGN_SW_NAME": data.INDUSRIAL_DESIGN_SW_NAME || null,
				// Overview
				"COUNTERFIET_PARTS_PCD": data.COUNTERFIET_PARTS_PCD === -1 ? null : data.COUNTERFIET_PARTS_PCD,
				"QUALITY_AGREEMENT": data.QUALITY_AGREEMENT === -1 ? null : data.QUALITY_AGREEMENT,
				"MANUFACTURING_PCD": data.MANUFACTURING_PCD === -1 ? null : data.MANUFACTURING_PCD,
				"TECH_SPEC_MFG_SRV": data.TECH_SPEC_MFG_SRV === -1 ? null : data.TECH_SPEC_MFG_SRV,
				"PLAN_COLLECTION": data.PLAN_COLLECTION === -1 ? null : data.PLAN_COLLECTION,
				"ANALYSIS_RISKMGMT_PROC": data.ANALYSIS_RISKMGMT_PROC === -1 ? null : data.ANALYSIS_RISKMGMT_PROC,
				"CONFIG_CTRL_SYSTEM": data.CONFIG_CTRL_SYSTEM === -1 ? null : data.CONFIG_CTRL_SYSTEM,
				"CTRL_PLANNING_PROC": data.CTRL_PLANNING_PROC === -1 ? null : data.CTRL_PLANNING_PROC,
				"CONT_IMPROVEMENT_PROG": data.CONT_IMPROVEMENT_PROG === -1 ? null : data.CONT_IMPROVEMENT_PROG,
				"EPI_QUALITY_SUPPL_REQ": data.EPI_QUALITY_SUPPL_REQ === -1 ? null : data.EPI_QUALITY_SUPPL_REQ,
				// Suppliers/ imput material
				"SUPPL_EVAL_PROC": data.SUPPL_EVAL_PROC === -1 ? null : data.SUPPL_EVAL_PROC,
				"NON_CONF_ANALYSIS": data.NON_CONF_ANALYSIS === -1 ? null : data.NON_CONF_ANALYSIS,
				"TECH_SPEC_MATERIAL": data.TECH_SPEC_MATERIAL === -1 ? null : data.TECH_SPEC_MATERIAL,
				"MATERIAL_INSPECTION_TESTS": data.MATERIAL_INSPECTION_TESTS === -1 ? null : data.MATERIAL_INSPECTION_TESTS,
				"CTRL_ORDERS_DOC_PROC": data.CTRL_ORDERS_DOC_PROC === -1 ? null : data.CTRL_ORDERS_DOC_PROC,
				"TECHNICAL_DOC_PROC": data.TECHNICAL_DOC_PROC === -1 ? null : data.TECHNICAL_DOC_PROC,
				// Production
				"QUALIFIED_STAFF": data.QUALIFIED_STAFF === -1 ? null : data.QUALIFIED_STAFF,
				"QUALIFICATION_ARRAY": data.QUALIFICATION_ARRAY === -1 ? null : data.QUALIFICATION_ARRAY,
				"PROC_FOR_INCOMING": data.PROC_FOR_INCOMING === -1 ? null : data.PROC_FOR_INCOMING,
				"MFG_INSPECTION_TESTS": data.MFG_INSPECTION_TESTS === -1 ? null : data.MFG_INSPECTION_TESTS,
				"INTERAL_QUAL_AUDITS": data.INTERAL_QUAL_AUDITS === -1 ? null : data.INTERAL_QUAL_AUDITS,
				"MEASURING_EQUIP_CALIB": data.MEASURING_EQUIP_CALIB === -1 ? null : data.MEASURING_EQUIP_CALIB,
				"NON_CONF_TREATMENT_PROC": data.NON_CONF_TREATMENT_PROC === -1 ? null : data.NON_CONF_TREATMENT_PROC,
				"REPTITIVE_CAUSES_PROC": data.REPTITIVE_CAUSES_PROC === -1 ? null : data.REPTITIVE_CAUSES_PROC,
				"IDENTIFICATION_METHOD": data.IDENTIFICATION_METHOD === -1 ? null : data.IDENTIFICATION_METHOD,
				"MAINTENANCE_SCHEDULES": data.MAINTENANCE_SCHEDULES === -1 ? null : data.MAINTENANCE_SCHEDULES,
				"WORK_INSTRUCTION_METHODS": data.WORK_INSTRUCTION_METHODS === -1 ? null : data.WORK_INSTRUCTION_METHODS,
				"DOCUMENTED_PROC": data.DOCUMENTED_PROC === -1 ? null : data.DOCUMENTED_PROC,
				"PLANNING_CONTROL_SYSTEM": data.PLANNING_CONTROL_SYSTEM === -1 ? null : data.PLANNING_CONTROL_SYSTEM,
				// Storage
				"CRITERIA_COLLECT_PROC": data.CRITERIA_COLLECT_PROC === -1 ? null : data.CRITERIA_COLLECT_PROC,
				"COMP_BASED_WMS": data.COMP_BASED_WMS === -1 ? null : data.COMP_BASED_WMS,
				"ESTAB_CRITERIA": data.ESTAB_CRITERIA === -1 ? null : data.ESTAB_CRITERIA,
				"DEFINED_POLICIES": data.DEFINED_POLICIES === -1 ? null : data.DEFINED_POLICIES,
				// Customer service
				"CUSTOMER_SERVICE": data.CUSTOMER_SERVICE === -1 ? null : data.CUSTOMER_SERVICE,
				// Technology
				"MASS_SERIES_PROD": data.MASS_SERIES_PROD === -1 ? null : data.MASS_SERIES_PROD,
				"TECH_SUPPORT": data.TECH_SUPPORT === -1 ? null : data.TECH_SUPPORT,

				"SFTY_ENVI_POLICY": data.SFTY_ENVI_POLICY === -1 ? null : data.SFTY_ENVI_POLICY,
				"ENVI_FRIENDLY_PROD": data.ENVI_FRIENDLY_PROD === -1 ? null : data.ENVI_FRIENDLY_PROD,
				"SUSTAINABILITY_PROG": data.SUSTAINABILITY_PROG === -1 ? null : data.SUSTAINABILITY_PROG,
				"COMPLY_LABOR_REG": data.COMPLY_LABOR_REG === -1 ? null : data.COMPLY_LABOR_REG,
				"REQUIRE_EUC": data.REQUIRE_EUC === -1 ? null : data.REQUIRE_EUC,
				"EXPORT_CNTRL": data.EXPORT_CNTRL === -1 ? null : data.EXPORT_CNTRL
			}];
			return dObject;
		},

		handleDisclosureOne: function (oEvent) {

			var selectedText = oEvent.getSource().getSelectedButton().getText();
			if (selectedText === "Yes") {
				this.getView().byId("dInId1").setVisible(true);
			} else {
				this.getView().byId("dInId1").setVisible(false);
				oView.getModel("blankJson").setProperty("/disclousers/INTEREST_CONFLICT_TEXT", null);
			}
			oView.getModel("blankJson").setProperty("/disclousers/INTEREST_CONFLICT", selectedText);

			context.onRadioChange(oEvent); //komal
		},

		legalcasedisclosure: function (oEvent) {

			var selectedText = oEvent.getSource().getSelectedButton().getText();
			if (selectedText === "Yes") {
				this.getView().byId("dInId2").setVisible(true);
			} else {
				this.getView().byId("dInId2").setVisible(false);
				oView.getModel("blankJson").setProperty("/disclousers/ANY_LEGAL_CASES_TEXT", null);
			}

			oView.getModel("blankJson").setProperty("/disclousers/ANY_LEGAL_CASES", selectedText);

			context.onRadioChange(oEvent); //komal
		},

		handleITR1: function (oEvent) {

			var selectedText = oEvent.getSource().getSelectedButton().getText();
			if (selectedText === "Yes") {
				this.getView().byId("itInId1").setVisible(true);
			} else {
				this.getView().byId("itInId1").setVisible(false);
				oView.getModel("blankJson").setProperty("/disclousers/ERP_MGMT_SYSTEM_NAME", null);
			}

			oView.getModel("blankJson").setProperty("/disclousers/ERP_MGMT_SYSTEM", selectedText);
			context.onRadioChange(oEvent); //komal
		},

		handleITR2: function (oEvent) {

			var selectedText = oEvent.getSource().getSelectedButton().getText();
			if (selectedText === "Yes") {
				this.getView().byId("itInId2").setVisible(true);
			} else {
				this.getView().byId("itInId2").setVisible(false);
				oView.getModel("blankJson").setProperty("/disclousers/INDUSRIAL_DESIGN_SW_NAME", null);
			}

			oView.getModel("blankJson").setProperty("/disclousers/INDUSRIAL_DESIGN_SW", selectedText);
			context.onRadioChange(oEvent); //komal
		},

		handleRadioButton: function (oEvent) {

			var selectedText = oEvent.getSource().getSelectedButton().getText();
			var sPath = oEvent.getSource().mBindingInfos.selectedIndex.binding.sPath;
			oView.getModel("blankJson").setProperty(sPath, selectedText);
			context.onRadioChange(oEvent); //komal
		},

		handleOtherQC: function (oEvent) {

			var tLength = oView.getModel("blankJson").getProperty("/qualityCertificate").length - 1;
			oView.getModel("blankJson").getProperty("/qualityCertificate").splice(tLength, 0, {
				"CERTI_NAME": "",
				"CERTI_TYPE": "",
				"DONE_BY": "",
				"AVAILABLE": "",
				//"AVAILABLE": -1,
				"deleteInd": "X"
			});

			oView.getModel("blankJson").refresh(true);
			oView.byId("ITARTableID").setVisibleRowCount(oView.getModel("blankJson").getProperty("/qualityCertificate").length);
		},

		deleteQualityCertificates: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/qualityCertificate").splice(index, 1);
			oView.getModel("blankJson").refresh(true);
			oView.byId("ITARTableID").setVisibleRowCount(oView.getModel("blankJson").getProperty("/qualityCertificate").length);
		},

		RelationandNameRB: function (oEvent) {

			var selectedText = oEvent.getSource().getSelectedButton().getText();

			if (selectedText === "Yes") {
				this.getView().byId("DisTableId1").setVisible(true);
			} else {
				this.getView().byId("DisTableId1").setVisible(false);
			}

			oView.getModel("blankJson").setProperty("/disclousers/RELATIVE_WORKING", selectedText);
			context.onRadioChange(oEvent); //komal
		},

		AddRelationshipName: function () {

			oView.getModel("blankJson").getProperty("/relationName").push({
				"NAME": null,
				"RELATIONSHIP": null
			});

			oView.getModel("blankJson").refresh(true);
			oView.byId("DisTableId1").setVisibleRowCount(oView.getModel("blankJson").getProperty("/relationName").length);

		},

		deleteDisRelation: function (oEvent) {

			var index = oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2];
			oView.getModel("blankJson").getProperty("/relationName").splice(index, 1);
			oView.getModel("blankJson").refresh(true);
			oView.byId("DisTableId1").setVisibleRowCount(oView.getModel("blankJson").getProperty("/relationName").length);

		},

		handleQCRBtn: function (oEvent) {

			var bSelected = oEvent.getSource().getSelectedButton().getText();
			var sPath = oEvent.getSource().getSelectedButton().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/AVAILABLE", bSelected);
			oView.getModel("blankJson").refresh(true);
		},

		createMessagePopover: function () {

			if (this.oMP) {
				this.oMP.close();
			}
			var that = this;
			that.oMP = new MessagePopover({
				activeTitlePress: function (oEvent) {
					var oItem = oEvent.getParameter("item"),
						oPage = that.getView().byId("wizardContentPage");
					var sectionId = oItem.getBindingContext("checkFieldsJson").getObject().section;
					var sPaths = context.wizar._aStepPath;
					for (var i = 0; i < sPaths.length; i++) {
						if (sPaths[i].sId.indexOf(sectionId.toString()) !== -1) {
							var oPath = sPaths[i].sId.split("--")[1];
							if (oPath.includes(sectionId.toString())) {
								context.wizar.goToStep(oView.byId(sPaths[i].sId.split("--")[1]));
							}
						}
					}

				},
				items: {
					path: "checkFieldsJson>/",
					template: new MessageItem({
						title: "{checkFieldsJson>description}",
						activeTitle: true,
						subtitle: "{checkFieldsJson>subtitle}",
						type: "{checkFieldsJson>type}"

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
				this.getView().byId("wizardContentPage").setShowFooter(true);

				var oButton = this.getView().byId("messagePopoverBtn");
				oButton.setVisible(true);
				setTimeout(function () {
					this.oMP.openBy(oButton);
				}.bind(this), checkFields.length);
				this.createMessagePopover();
			} else {
				this.getView().byId("messagePopoverBtn").setVisible(false);
				this.getView().byId("wizardContentPage").setShowFooter(true);
			}
		},

		//20/21
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

		handleAddTypeSelection: function (oEvent) {

			var oAddType = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/ADDR_CODE", oAddType);
			oView.getModel("blankJson").refresh(true);

			context._onTableValueChange(oEvent);
		},

		//19/21
		checkContactDetails: function (data) {

			var exepArray = [];
			for (var i = 0; i < data.contact.length; i++) {
				if (data.contact[i].NAME1 === null || data.contact[i].NAME1 === "") {
					exepArray.push({
						"section": 1,
						"description": "Enter First Name in contacts details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					})
				}

				if (data.contact[i].NAME2 === null || data.contact[i].NAME2 === "") {
					exepArray.push({
						"section": 1,
						"description": "Enter Last Name in contacts details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					})
				}
			}
			return exepArray;
		},

		removeCountryRegionDesc: function (addressArr) {

			var contactAddressObj = {};
			var address = [];
			var contact = [];
			//removing Country description and region description from address details
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
					if (obj.CITY_DESC || obj.CITY_DESC === null || obj.CITY_DESC === "") {
						delete obj.CITY_DESC;
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

		removeCountryCityDesc: function (contactField) {
			var returnContactArr = [];
			if (contactField.length > 0) {
				var obj = null;
				returnContactArr = Object.keys(contactField).map(function (key) {
					obj = Object.assign({}, contactField[key]);
					if (obj.NATIONALITY_DESC || obj.NATIONALITY_DESC === null || obj.NATIONALITY_DESC === "") {
						delete obj.NATIONALITY_DESC;
					}
					if (obj.CITY_DESC || obj.CITY_DESC === null || obj.CITY_DESC === "") {
						delete obj.CITY_DESC;
					}

					return obj;
				});
			}
			return returnContactArr;
		},

		removeBankCountryDesc: function (bankData) {

			var returnBankArr = [];
			if (bankData.length > 0) {
				var object = null;
				returnBankArr = Object.keys(bankData).map(function (key) {
					object = Object.assign({}, bankData[key]);

					if (object.COUNTRY_DESC || object.COUNTRY_DESC === null || object.COUNTRY_DESC === "") {
						delete object.COUNTRY_DESC;
					}

					return object;
				});
			}

			return returnBankArr;
		},

		VATNumberandDateValidation: function (headerArray) {

			var VATValidation = [];

			if (headerArray[0].VAT_CHECK === "Y") {
				if (headerArray[0].VAT_REG_NUMBER === null) {
					VATValidation.push({
						"section": 2,
						"description": "Enter " + oView.byId("S2G2T2F2_lbl").getText(),
						"subtitle": "Mandatory Field",
						"type": "Warning"
					})
				}

				if (headerArray[0].VAT_REG_DATE === null) {
					VATValidation.push({
						"section": 2,
						"description": "Select " + oView.byId("S2G2T2F3_lbl").getText(),
						"subtitle": "Mandatory Field",
						"type": "Warning"
					})
				}
			}

			if (loginData.BP_TYPE_CODE !== "B" && headerArray[0].ROUTING_CODE === null) {
				VATValidation.push({
					"section": 2,
					"description": "Enter Routing Code",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				})
			}

			// if (headerArray[0].LIC_NO === null && loginData.REQUEST_TYPE !== 3) {
			// 	VATValidation.push({
			// 		"section": 2,
			// 		"description": "Enter " + oView.byId("S1G6T1F4_lbl").getText(),
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning"
			// 	})
			// }

			// if (headerArray[0].LIC_NO_DATE === null && loginData.REQUEST_TYPE !== 3) {
			// 	VATValidation.push({
			// 		"section": 1,
			// 		"description": "Select " + oView.byId("S1G6T1F5_lbl2").getText(),
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning"
			// 	})
			// }

			return VATValidation;
		},

		bankDataValidation: function (bankData) {

			var bankArr = [];
			var localData = oView.getModel("localModel");
			if (localData.getProperty("/ibanNum") === true && bankData[0].IBAN_NUMBER === null) {
				bankArr.push({
					"section": 2,
					"description": "Enter IBAN Number",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				})
			}

			for (var i = 0; i < bankData.length; i++) {
				if (bankData[i].PAYMENT_TYPE === "OTH") {
					if (bankData[i].REQUIRED === true && bankData[i].IBAN_NUMBER === null) {
						bankArr.push({
							"section": 2,
							"description": "Enter IBAN Number in Other bank details row: " + i + 1,
							"subtitle": "Mandatory Field",
							"type": "Warning"
						})
					}
				}
			}
			return bankArr;
		},

		deleteIBANInfo: function (otherbankData) {

			for (var i = 0; i < otherbankData.length; i++) {
				if (otherbankData[i].REQUIRED) {
					delete otherbankData[i].REQUIRED;
					delete otherbankData[i].IBAN_LENGTH;
				}
			}
		},

		handleProgressIndicator: function (iSection, oFieldsValidation, headerArray, data) {

			var mandatoryObj = oView.getModel("dynamicCountModel").getData();
			var totalCount = context.totalCount + mandatoryObj.LocalTradeCount + mandatoryObj.IBANMandatoryCount
				+ mandatoryObj.ICVMandatoryCount + mandatoryObj.VATMandatoryCount
				+ mandatoryObj.routingCodeCount + mandatoryObj.otherCodeCount;;
			var mandatoryFieldcount = 0;
			if (iSection === 1) {
				mandatoryFieldcount = this.dynamicMandatoryFieldCount(headerArray, data);
				this.Section1Count = oFieldsValidation.ManCount + mandatoryFieldcount;
				oView.getModel("blankJson").setProperty("/headerData/SECTION1_COUNT", this.Section1Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION2_COUNT", this.Section2Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION3_COUNT", this.Section3Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION4_COUNT", this.Section4Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION5_COUNT", this.Section5Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION6_COUNT", this.Section6Count);

				var sectionsCounts = this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count + this.Section5Count +
					this.Section6Count;
				var percentageCount = Math.round((sectionsCounts / totalCount) * 100);
				oView.getModel("blankJson").setProperty("/headerData/TOTAL_PER", percentageCount);
			} else if (iSection === 2) {
				mandatoryFieldcount = this.dynamicMandatoryFieldCount(headerArray, data);
				this.Section2Count = oFieldsValidation.ManCount + mandatoryFieldcount;
				oView.getModel("blankJson").setProperty("/headerData/SECTION1_COUNT", this.Section1Count);
				this.Section2Count = this.Section2Count - this.Section1Count;
				oView.getModel("blankJson").setProperty("/headerData/SECTION2_COUNT", this.Section2Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION3_COUNT", this.Section3Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION4_COUNT", this.Section4Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION5_COUNT", this.Section5Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION6_COUNT", this.Section6Count);
				var sectionsCounts = this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count + this.Section5Count + this
					.Section6Count;
				var percentageCount = Math.round((sectionsCounts / totalCount) * 100);
				//	headerArray[0].TOTAL_PER = percentageCount;
				oView.getModel("blankJson").setProperty("/headerData/TOTAL_PER", percentageCount);
			} else if (iSection === 5) {
				mandatoryFieldcount = this.dynamicMandatoryFieldCount(headerArray, data);
				this.Section5Count = oFieldsValidation.ManCount + mandatoryFieldcount;
				oView.getModel("blankJson").setProperty("/headerData/SECTION1_COUNT", this.Section1Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION2_COUNT", this.Section2Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION3_COUNT", this.Section3Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION4_COUNT", this.Section4Count);
				this.Section5Count = this.Section5Count - (this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION5_COUNT", this.Section5Count);
				oView.getModel("blankJson").setProperty("/headerData/SECTION6_COUNT", this.Section6Count);
				var sectionsCounts = this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count + this.Section5Count + this
					.Section6Count;
				var percentageCount = Math.round((sectionsCounts / totalCount) * 100);
				oView.getModel("blankJson").setProperty("/headerData/TOTAL_PER", percentageCount);

			} else if (iSection === 0) {
				vModel = oView.getModel("visibleJson").getData();
				mandatoryModel = oView.getModel("mandatoryJson").getData();
				var i18nModel = this.getView().getModel("i18n");
				var data = oView.getModel("blankJson").getData();
				var headerArray = this.getHeaderData(data);
				var bankDetails = this.getBankData(data);
				var disclousersData = this.getDisclousers(data.disclousers);
				var attachmentData = this.getAttachmentsFromModels();
				mandatoryFieldcount = this.dynamicMandatoryFieldCount(headerArray, data);
				if (headerArray[0].LAST_SAVED_STEP > 0) {
					for (var i = 1; i <= 6; i++) {

						var fieldsValidation = validations.validateSections(headerArray, bankDetails, data, disclousersData,
							attachmentData, i18nModel, vModel, mandatoryModel, i);
						if (i === 1) {
							this.Section1Count = fieldsValidation.ManCount + mandatoryFieldcount;
							oView.getModel("blankJson").setProperty("/headerData/SECTION1_COUNT", this.Section1Count);

						}
						if (i === 2) {
							this.Section2Count = fieldsValidation.ManCount;
							this.Section2Count = (this.Section2Count - this.Section1Count) + mandatoryFieldcount;
							oView.getModel("blankJson").setProperty("/headerData/SECTION2_COUNT", this.Section2Count);

						}
						if (i === 3) {
							this.Section3Count = fieldsValidation.ManCount;
							var count3 = this.Section1Count + this.Section2Count;
							this.Section3Count = (this.Section3Count - count3) + mandatoryFieldcount;
							//	this.Section3Count = this.Section3Count - (this.Section1Count + this.Section2Count);
							oView.getModel("blankJson").setProperty("/headerData/SECTION3_COUNT", this.Section3Count);

						}
						if (i === 4) {
							this.Section4Count = fieldsValidation.ManCount;
							var count4 = this.Section1Count + this.Section2Count + this.Section3Count;
							this.Section4Count = (this.Section4Count - count4) + mandatoryFieldcount;
							//	this.Section4Count = this.Section4Count - (this.Section1Count + this.Section2Count + this.Section3Count);
							oView.getModel("blankJson").setProperty("/headerData/SECTION4_COUNT", this.Section4Count);

						}
						if (i === 5) {
							this.Section5Count = fieldsValidation.ManCount;
							var count5 = this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count;
							this.Section5Count = (this.Section5Count - count5) + mandatoryFieldcount;
							//	this.Section5Count = this.Section5Count - (this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count);
							oView.getModel("blankJson").setProperty("/headerData/SECTION5_COUNT", this.Section5Count);

						}
						if (i === 6) {
							this.Section6Count = fieldsValidation.ManCount;
							var count6 = this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count + this.Section5Count;
							this.Section6Count = (this.Section6Count - count6) + mandatoryFieldcount;
							//	this.Section6Count = this.Section6Count - (this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count + this.Section5Count);
							oView.getModel("blankJson").setProperty("/headerData/SECTION6_COUNT", this.Section6Count);
						}

					}
					var sectionsCounts = this.Section1Count + this.Section2Count + this.Section3Count + this.Section4Count + this.Section5Count +
						this
							.Section6Count;
					var percentageCount = Math.round((sectionsCounts / totalCount) * 100);
					oView.getModel("blankJson").setProperty("/headerData/TOTAL_PER", percentageCount);
					oView.getModel("blankJson").refresh(true);
				} else {
					oView.getModel("blankJson").setProperty("/headerData/TOTAL_PER", 0);
					oView.getModel("blankJson").refresh(true);
				}
			}
			oView.getModel("blankJson").refresh(true);
		},

		removeValueState: function (mandatoryModel) {

			oView.byId("S1G1T1F1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F2").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F11").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F3No").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F3").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F13").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F14").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F15").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F10").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F6").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F7").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F4").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F8Tele").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F8").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F10").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G1T1F9").setValueState(sap.ui.core.ValueState.None);
			//Contact details
			oView.byId("S1G2T1F1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F1Last").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F2").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F3").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F4com").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F4").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F5com").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T1F5").setValueState(sap.ui.core.ValueState.None);
			oView.byId("NID").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G2T2F9").setValueState(sap.ui.core.ValueState.None);
			//other Details
			oView.byId("S1G4T2F1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G3T1F1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G4T1F1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G5T1F1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S1G4T8F1").setValueState(sap.ui.core.ValueState.None);
			//Bank Details
			oView.byId("S2G1T1F10").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F6").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F4").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F2").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F3").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F5").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F9").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F9Code").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F8").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T1F11").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S2G1T4F15").setValueState(sap.ui.core.ValueState.None);
			//submission section
			oView.byId("S7G1D1").setValueState(sap.ui.core.ValueState.None);
			oView.byId("S7G1D2").setValueState(sap.ui.core.ValueState.None);
		},

		handleHQCountryDialog: function (oEvent) {

			this.selectedRowHQ = oEvent.getSource();
			BusyIndicator.show(0);
			if (!this.countryDialogHQ) {
				this.countryDialogHQ = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.HQCountryDialog", this);
				this.getView().addDependent(this.countryDialogHQ);
			}
			BusyIndicator.hide();
			this.countryDialogHQ.open();

			context._onTableValueHelpChange0(oEvent);
		},

		_onTableValueHelpChange0: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, index = null,
					dataIndex = null,
					val;
				model = oEvent.getSource().mBindingInfos.value.binding.sPath;
				var headData = oView.getModel("originalJson").getProperty(model);
				context.id = oEvent.getSource().mBindingInfos.visible.binding.aBindings[0].sPath.split("/")[1];
				context.valueHelpOldValue0 = headData;
			}
		},

		handleCountrySearchHQ: function (oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("Landx", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.Contains, sQuery)
				];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}
			var oList = sap.ui.getCore().byId("cntry_listHQId");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		handleCountrySelectionHQ: function (oEvent) {
			var HQAddress = "H"

			var selectedObj = this.getView().getModel("blankJson").getProperty("/address");
			if (selectedObj.STATE !== null) {
				selectedObj.STATE = null;
				selectedObj.REGION_DESC = null;
			}
			if (selectedObj.CONTACT_NO !== null) {
				selectedObj.CONTACT_NO = null;
				// selectedObj.CONTACT_NO = null;
			}
			if (selectedObj.CITY !== null) selectedObj.CITY = null;

			if (selectedObj.POSTAL_CODE !== null) selectedObj.POSTAL_CODE = null;
			var countryCode = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Land1;
			var countyDesc = oEvent.getSource().getSelectedItem().getBindingContext("countryJson").getObject().Landx;
			selectedObj.COUNTRY = countryCode;
			selectedObj.COUNTRY_DESC = countyDesc;

			oView.getModel("blankJson").refresh(true);

			sap.ui.getCore().byId("cntry_listHQId").removeSelections(true);
			sap.ui.getCore().byId("countrySrchHQId").setValue("");
			this.refreshCountryListHQ();
			this.countryDialogHQ.close();

			oView.byId("S1G2T1F7").setValue("");
			oView.byId("S1G2T1F8").setValue("");
			oView.byId("S1G2T1F10").setValue("");

			if (countryCode === context.clientCountry) {
				loginData.BP_TYPE_CODE = "B";
				context.validateLocalCountry()
				context.handleAttachments()
			} else {
				loginData.BP_TYPE_CODE = ""
				context.validateLocalCountry()
				context.handleAttachments()
			}

			this.readPostalCodeLength(countryCode, HQAddress);
			this.readPostalCodeFormates(countryCode, HQAddress);

			var sPath = "/" + this.selectedRowHQ.mBindingInfos.value.binding.sPath.split("/")[1];
			this.readAutoCountryCodeSet(countryCode, sPath);

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue0 !== countyDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}

			if(selectedObj.COUNTRY === "IN"){
				oView.byId("S1G2T1F9").setMaxLength(10);
			}else{
				oView.byId("S1G2T1F9").setMaxLength(30);
			}
		},

		closeCountryDialogHQ: function () {
			this.countryDialogHQ.close();
			this.countryDialogHQ.destroy();
			this.countryDialogHQ = null;
		},

		refreshCountryListHQ: function () {
			var list = sap.ui.getCore().byId("cntry_listHQId");
			var binding = list.getBinding("items");
			binding.filter(null);
		},

		handleWizardOne: function (draftInd) {

			section = 1;
			var path;
			var i18nModel = this.getView().getModel("i18n");
			vModel = oView.getModel("visibleJson").getData();
			mandatoryModel = oView.getModel("mandatoryJson").getData();
			labelModel = oView.getModel("labelJson").getData();
			var data = oView.getModel("blankJson").getData();

			jQuery.sap.delayedCall(700, this, function () {
				var headerArray = this.getHeaderData(data);

				headerArray[0].LAST_SAVED_STEP = 1;

				var secondaryEmails = this.secondaryEmailsValidation(headerArray);
				if (secondaryEmails.sec_emails !== "") {
					headerArray[0].SECONDARY_EMAILS_ID = secondaryEmails.sec_emails;
				}

				oId = this.getView().byId("trAddId");
				cId = this.getView().byId("table_contactId");

				var fieldsValidation = validations.validateSections(headerArray, [], data, [], {}, i18nModel, vModel, mandatoryModel, section, oId, cId, labelModel);
				var checkFields = fieldsValidation.fieldArray;

				if (secondaryEmails.sEmails.length > 0) {
					checkFields.push({
						"section": 1,
						"description": "These secondary emails are not valid : " + secondaryEmails.sEmails,
						"subtitle": "Mandatory Field",
						"type": "Warning"
					})
				}

				// if (headerArray[0].LIC_NO === null && loginData.REQUEST_TYPE !== 3) {
				// 	checkFields.push({
				// 		"section": 2,
				// 		"description": "Enter " + oView.byId("S1G6T1F4_lbl").getText(),
				// 		"subtitle": "Mandatory Field",
				// 		"type": "Warning"
				// 	})
				// }

				// if (headerArray[0].LIC_NO_DATE === null && loginData.REQUEST_TYPE !== 3) {
				// 	checkFields.push({
				// 		"section": 1,
				// 		"description": "Select " + oView.byId("S1G6T1F5_lbl2").getText(),
				// 		"subtitle": "Mandatory Field",
				// 		"type": "Warning"
				// 	})
				// }

				this.validateForm(checkFields);

				var addressContact = this.concatAddressContactData(data);

				addressContact = this.removeCountryRegionDesc(addressContact);

				this.removeMetadata(data);
				this.setTableDataEmpty(section, vModel, data);

				var payload = this.draftinPayload(headerArray, addressContact.address, addressContact.contact, [], [], [], [], [], [], [], [], [], [], [], [], [], [], section, updateId);

				path = appModulePath + "/odata/v4/ideal-registration-form-srv/PostRegFormData";

				this.ajaxCall(path, payload, section);

				if (draftInd !== "D") {
					oView.byId("CreateProductWizard").nextStep();
					oView.byId("nBtn1").setVisible(false);

					// this.readEntitySets("GetPaymentMethodSet", "paymentMethodJson");
					// this.readEntitySets("GetPaymentTermSet", "paymentTermJson");
					this.readEntitySets("GetCurrencyKeySet", "currencyJson");

					context._readAttachmentDraftData(headerArray);
				}
				BusyIndicator.hide();
			});

			//set VAT and ICV details required and visibility
			if (loginData.BP_TYPE_CODE === "B") {
				//ICV fields configuration
				oView.getModel("localModel").setProperty("/icv_percentage", true);
				oView.getModel("localModel").setProperty("/icv_validity", true);
				oView.getModel("localModel").setProperty("/icv_fileUpload", true);
				if (oView.getModel("blankJson").getProperty("/headerData/ICV_CHECK") === null ||
					oView.getModel("blankJson").getProperty("/headerData/ICV_CHECK") === "" ||
					oView.getModel("blankJson").getProperty("/headerData/ICV_CHECK") === undefined) {
					oView.getModel("blankJson").setProperty("/headerData/ICV_CHECK", "Y");
					oView.getModel("localModel").setProperty("/icv_select", 0);
				}
			} else {
				//ICV fields configuration
				oView.getModel("localModel").setProperty("/icv_percentage", false);
				oView.getModel("localModel").setProperty("/icv_validity", false);
				oView.getModel("localModel").setProperty("/icv_fileUpload", false);

				if (oView.getModel("blankJson").getProperty("/headerData/ICV_CHECK") === null ||
					oView.getModel("blankJson").getProperty("/headerData/ICV_CHECK") === "" ||
					oView.getModel("blankJson").getProperty("/headerData/ICV_CHECK") === undefined) {
					oView.getModel("blankJson").setProperty("/headerData/ICV_CHECK", "N");
					oView.getModel("localModel").setProperty("/icv_select", 1);
				}
			}

			if (oView.getModel("blankJson").getProperty("/headerData/VAT_CHECK") === null ||
				oView.getModel("blankJson").getProperty("/headerData/VAT_CHECK") === "" ||
				oView.getModel("blankJson").getProperty("/headerData/VAT_CHECK") === undefined) {
				oView.getModel("blankJson").setProperty("/headerData/VAT_CHECK", "Y");
				oView.getModel("dynamicCountModel").setProperty("/VATMandatoryCount", 2);
				oView.byId("S2G1T3F13_lbl").setRequired(true);
				oView.byId("S2G1T3F14_lbl").setRequired(true);
			}

			if (oView.getModel("blankJson").getProperty("/headerData/ICV_CHECK") === "Y") {
				oView.getModel("dynamicCountModel").setProperty("/ICVMandatoryCount", 3);
				oView.getModel("localModel").setProperty("/icv_sForm", true);
				oView.getModel("localModel").setProperty("/icv_table", true);
			} else {
				oView.getModel("localModel").setProperty("/icv_sForm", false);
				oView.getModel("localModel").setProperty("/icv_table", false);
			}

			context.handleAttachments()
		},

		handleWizardTwo: function (draftInd) {

			section = 2;
			var path;

			var i18nModel = this.getView().getModel("i18n");
			var data = oView.getModel("blankJson").getData();
			var headerArray = this.getHeaderData(data);

			if (supplierCategoryKeys !== "") {
				headerArray[0].SUPPL_CATEGORY = supplierCategoryKeys;
				headerArray[0].SUPPL_CATEGORY_DESC = supplierCategoryText;
			}

			headerArray[0].LAST_SAVED_STEP = 2;

			var bankDetails = this.getBankData(data);

			var financialDetails = this.handleBankDetails(data, bankDetails);
			var bankData = financialDetails.BankDetails;
			var bankFields = this.removeBankCountryDesc(bankData);

			bId = this.getView().byId("bankTableId");

			var fieldsValidation = validations.validateSections(headerArray, bankData, data, [], {}, i18nModel, vModel, mandatoryModel, section, oId, cId, labelModel, bId);
			var checkFields = fieldsValidation.fieldArray;

			this.deleteIBANInfo(data.otherBankDetails);

			var checkVATFields = this.VATNumberandDateValidation(headerArray);
			var checkBankFields = this.bankDataValidation(bankData);

			if (checkVATFields.length > 0) {
				checkFields.push(...checkVATFields);
			}

			if (checkBankFields.length > 0) {
				checkFields.push(...checkBankFields);
			}

			this.validateForm(checkFields);

			var addressContact = this.concatAddressContactData(data);

			addressContact = this.removeCountryRegionDesc(addressContact);

			this.setFieldsToNull(data);

			this.removeMetadata(data);
			this.setTableDataEmpty(section, vModel, data);

			for (var i = 0; i < data.BankingDetails.length; i++) {
				if (data.BankingDetails[i].AMOUNT_LIMIT || data.BankingDetails[i].ASSO_SINCE) {
					data.BankingDetails[i].AMOUNT_LIMIT = Number(data.BankingDetails[i].AMOUNT_LIMIT);
					data.BankingDetails[i].ASSO_SINCE = Number(data.BankingDetails[i].ASSO_SINCE);
				}
			}

			var payload = this.draftinPayload(headerArray, addressContact.address, addressContact.contact, bankFields,
				data.BankingDetails, [], [], [], [], [], [], [], [], [], [], [], [], section, updateId);

			path = appModulePath + "/odata/v4/ideal-registration-form-srv/PostRegFormData";

			this.ajaxCall(path, payload, section);

			if (draftInd !== "D") {
				oView.byId("CreateProductWizard").nextStep();
				oView.byId("nBtn2").setVisible(false);
			}
		},

		handleWizardThree: function (draftInd) {

			section = 3;
			var path;

			var i18nModel = this.getView().getModel("i18n");
			var data = oView.getModel("blankJson").getData();
			var headerArray = this.getHeaderData(data);

			var bankDetails = this.getBankData(data);
			var financialDetails = this.handleBankDetails(data, bankDetails);
			var bankData = financialDetails.BankDetails;
			var bankFields = this.removeBankCountryDesc(bankData);

			headerArray[0].LAST_SAVED_STEP = 3;

			var fieldsValidation = validations.validateSections(headerArray, bankData, data, [], {}, i18nModel, vModel, mandatoryModel, section, oId, cId, labelModel, bId);
			var checkFields = fieldsValidation.fieldArray;

			var checkVATFields = this.VATNumberandDateValidation(headerArray);
			var checkBankFields = this.bankDataValidation(bankData);

			if (checkVATFields.length > 0) {
				checkFields.push(...checkVATFields);
			}
			if (checkBankFields.length > 0) {
				checkFields.push(...checkBankFields);
			}

			// if (this.progressIndicatorFlag === 'X') {
			// 	this.handleProgressIndicator(3, fieldsValidation, headerArray, data);
			// }
			this.validateForm(checkFields);

			var addressContact = this.concatAddressContactData(data);

			addressContact = this.removeCountryRegionDesc(addressContact);

			this.setFieldsToNull(data);

			this.removeMetadata(data);

			//var OEMDistributors = this.concatOEMAndNONOEMDistributors(data);

			this.setTableDataEmpty(section, vModel, data);

			for (var i = 0; i < data.BankingDetails.length; i++) {
				if (data.BankingDetails[i].AMOUNT_LIMIT) {
					data.BankingDetails[i].AMOUNT_LIMIT = Number(data.BankingDetails[i].AMOUNT_LIMIT);
				}
				if (data.BankingDetails[i].ASSO_SINCE) {
					data.BankingDetails[i].ASSO_SINCE = Number(data.BankingDetails[i].ASSO_SINCE);
				}
			}

			for (var i = 0; i < data.busHistory.length; i++) {
				if (data.busHistory[i].SINCE) {
					data.busHistory[i].SINCE = Number(data.busHistory[i].SINCE);
				}
				if (data.busHistory[i].PURCHASES) {
					data.busHistory[i].PURCHASES = Number(data.busHistory[i].PURCHASES);
				}
			}

			for (var i = 0; i < data.customerDetail.length; i++) {
				if (data.customerDetail[i].CUST_NO) {
					data.customerDetail[i].CUST_NO = Number(data.customerDetail[i].CUST_NO);
				}
			}


			var payload = this.draftinPayload(headerArray, addressContact.address, addressContact.contact, bankFields,
				data.BankingDetails, data.busHistory, data.customerDetail, data.promotors, [], [], [], [], [], [], [], [], [], section, updateId);

			path = appModulePath + "/odata/v4/ideal-registration-form-srv/PostRegFormData";

			this.ajaxCall(path, payload, section);

			if (draftInd !== "D") {
				oView.byId("CreateProductWizard").nextStep();
				oView.byId("nBtn3").setVisible(false);
			}
		},

		handleWizardFour: function (draftInd) {

			section = 4;
			var path;

			var i18nModel = this.getView().getModel("i18n");
			var data = oView.getModel("blankJson").getData();

			var headerArray = this.getHeaderData(data);

			headerArray[0].LAST_SAVED_STEP = 4;

			var bankDetails = this.getBankData(data);
			var financialDetails = this.handleBankDetails(data, bankDetails);
			var bankData = financialDetails.BankDetails;
			var bankFields = this.removeBankCountryDesc(bankData);

			var disclousersData = this.getDisclousers(data.disclousers);
			var attachmentData = this.getAttachmentsFromModels();

			if (this.StepNo === undefined) {
				this.StepNo = 4;
			}

			var checkFields;
			if (this.StepNo === 4) {

				var fieldsValidation = validations.validateSections(headerArray, bankData, data, disclousersData, attachmentData, i18nModel, vModel,
					mandatoryModel, section, oId, cId, labelModel, bId);
				checkFields = fieldsValidation.fieldArray;

				headerArray[0].LAST_SAVED_STEP = 4;
			}
			else if (this.StepNo === 5) {

				var fieldsValidation = validations.validateSections(headerArray, bankData, data, disclousersData, attachmentData, i18nModel, vModel,
					mandatoryModel, 5, oId, cId, labelModel, bId);
				checkFields = fieldsValidation.fieldArray;

				headerArray[0].LAST_SAVED_STEP = 5;
			}

			var checkVATFields = this.VATNumberandDateValidation(headerArray);
			var checkBankFields = this.bankDataValidation(bankData);

			if (checkVATFields.length > 0) {
				checkFields.push(...checkVATFields);
			}

			if (checkBankFields.length > 0) {
				checkFields.push(...checkBankFields);
			}

			this.validateForm(checkFields);

			var addressContact = this.concatAddressContactData(data);

			addressContact = this.removeCountryRegionDesc(addressContact);

			//var OEMDistributors = this.concatOEMAndNONOEMDistributors(data);

			this.setFieldsToNull(data);

			this.removeMetadata(data);

			this.setTableDataEmpty(section, vModel, data);

			for (var i = 0; i < data.BankingDetails.length; i++) {
				if (data.BankingDetails[i].AMOUNT_LIMIT) {
					data.BankingDetails[i].AMOUNT_LIMIT = Number(data.BankingDetails[i].AMOUNT_LIMIT);
				}
				if (data.BankingDetails[i].ASSO_SINCE) {
					data.BankingDetails[i].ASSO_SINCE = Number(data.BankingDetails[i].ASSO_SINCE);
				}
			}

			for (var i = 0; i < data.busHistory.length; i++) {
				if (data.busHistory[i].SINCE) {
					data.busHistory[i].SINCE = Number(data.busHistory[i].SINCE);
				}
				if (data.busHistory[i].PURCHASES) {
					data.busHistory[i].PURCHASES = Number(data.busHistory[i].PURCHASES);
				}
			}

			for (var i = 0; i < data.customerDetail.length; i++) {
				if (data.customerDetail[i].CUST_NO) {
					data.customerDetail[i].CUST_NO = Number(data.customerDetail[i].CUST_NO);
				}
			}

			var attachmentData = this.getAttachmentsFromModels();

			var payload = this.draftinPayload(headerArray, addressContact.address, addressContact.contact, bankFields,
				data.BankingDetails, data.busHistory, data.customerDetail, data.promotors, [], [], [], [], [], [], [attachmentData.attachFields], attachmentData.attachments1, [], section, updateId);

			path = appModulePath + "/odata/v4/ideal-registration-form-srv/PostRegFormData";

			this.ajaxCall(path, payload, section);

			if (draftInd !== "D") {
				oView.byId("CreateProductWizard").nextStep();
				oView.byId("nBtn4").setVisible(false);
			}
		},

		handleWizardFive: function (draftInd) {

			section = 5;
			var path;

			var i18nModel = this.getView().getModel("i18n");
			var data = oView.getModel("blankJson").getData();

			var headerArray = this.getHeaderData(data);

			// if (oView.byId("vatDate").getDateValue() !== null) {
			// 	var vatDate = oView.byId("vatDate").getDateValue().getTime() + 86400000;
			// 	headerArray[0].VAT_REG_DATE = new Date(vatDate);
			// }

			//01/02/22
			if (supplierCategoryKeys !== "") {
				headerArray[0].SUPPL_CATEGORY = supplierCategoryKeys;
				headerArray[0].SUPPL_CATEGORY_DESC = supplierCategoryText;

			}
			if (headerArray[0].SUPPL_CATEGORY !== null) {
				headerArray[0].SUPPL_CATEGORY = headerArray[0].SUPPL_CATEGORY.toString();
			}

			if (busniessTypeKeys !== "" && busniessTypeKeys !== null && busniessTypeKeys !== undefined) {
				headerArray[0].BUSINESS_TYPE = busniessTypeKeys;
			}
			if (headerArray[0].BUSINESS_TYPE !== null) {
				headerArray[0].BUSINESS_TYPE = headerArray[0].BUSINESS_TYPE.toString();
			}

			var bankDetails = this.getBankData(data);

			var bankData = this.handleBankDetails(data, bankDetails);
			var bankFields = this.removeBankCountryDesc(bankData);

			var disclousersData = this.getDisclousers(data.disclousers);

			var attachmentData = this.getAttachmentsFromModels();

			if (this.StepNo === undefined) {
				this.StepNo = 5;
			}

			var checkFields;
			if (this.StepNo === 5) {
				var fieldsValidation = validations.validateSections(headerArray, bankDetails, data, disclousersData,
					attachmentData, i18nModel, vModel, mandatoryModel, section, oId, cId, labelModel, bId);
				checkFields = fieldsValidation.fieldArray;

				headerArray[0].LAST_SAVED_STEP = 5;
			}
			else if (this.StepNo === 6) {
				var fieldsValidation = validations.validateSections(headerArray, bankDetails, data, disclousersData,
					attachmentData, i18nModel, vModel, mandatoryModel, 6, oId, cId, labelModel, bId);
				checkFields = fieldsValidation.fieldArray;

				headerArray[0].LAST_SAVED_STEP = 6;
			}

			for (var i = 0; i < data.otherBankDetails.length; i++) {
				if (data.otherBankDetails[i].REQUIRED === true && (data.otherBankDetails[i].IBAN_NUMBER === null ||
					data.otherBankDetails[i].IBAN_NUMBER === "")) {
					checkFields.push({
						"section": 2,
						"description": "Enter IBAN Number in Other bank details row : " + (i + 1),
						"subtitle": "Mandatory Field",
						"type": "Warning"
					})
				}

				if (data.otherBankDetails[i].IBAN_NUMBER !== null) {
					if (data.otherBankDetails[i].IBAN_NUMBER.length > data.otherBankDetails[i].IBAN_LENGTH) {
						checkFields.push({
							"section": 2,
							"description": "Enter valid IBAN Number in Other bank details row : " + (i + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						})

					}

				}
			}

			var checkVATFields = this.VATNumberandDateValidation(headerArray);
			var checkBankFields = this.bankDataValidation(bankData);

			if (checkVATFields.length > 0) {
				checkFields.push(...checkVATFields);
			}

			if (checkBankFields.length > 0) {
				checkFields.push(...checkBankFields);
			}

			this.handleProgressIndicator(5, fieldsValidation, headerArray, data);
			if (this.progressIndicatorFlag === 'X') {
				this.handleProgressIndicator(5, fieldsValidation, headerArray, data);
			}
			this.validateForm(checkFields);

			var addressContact = this.concatAddressContactData(data);
			//addressContact.address = this.removeCountryRegionDesc(addressContact.address);
			addressContact = this.removeCountryRegionDesc(addressContact);

			//31/02/22
			var OEMDistributors = this.concatOEMAndNONOEMDistributors(data);

			this.setFieldsToNull(data);

			this.removeMetadata(data);

			var payload = this.draftinPayload(headerArray, addressContact.address, addressContact.contact, bankFields, data.finInfo, data.ownerInfo,
				data.productInfo, data.operationalCap, data.clientInfo, OEMDistributors, [], disclousersData, data.relationName, data.qualityCertificate, [
				attachmentData.attachFields
			], attachmentData.attachments1, [], section, updateId);

			if (loginData.REQUEST_TYPE === 5) {
				path = appModulePath + "/odata/v4/registration-process/PostRegFormData";
			} else {
				path = appModulePath + "/odata/v4/registration-process/PostRegFormData";
			}

			this.ajaxCall(path, payload, section);

			if (draftInd !== "D") {
				oView.byId("CreateProductWizard").nextStep();
				oView.byId("nBtn5").setVisible(false);

				// if (loginData.CREATION_TYPE === 3) {
				// 	oView.byId("msgStripId").setVisible(true);
				// } else {
				// 	oView.byId("msgStripId").setVisible(false);
				// }
			}
		},

		handleVendorFormSubmit: function () {

			section = 6;
			var i18nModel = this.getView().getModel("i18n");
			var data = oView.getModel("blankJson").getData();
			var headerArray = this.getHeaderData(data);

			var bankDetails = this.getBankData(data);
			var financialDetails = this.handleBankDetails(data, bankDetails);
			var bankData = financialDetails.BankDetails;
			var bankFields = this.removeBankCountryDesc(bankData);

			var disclousersData = this.getDisclousers(data.disclousers);
			var attachmentData = this.getAttachmentsFromModels();

			if (!this.submitDialog) {
				this.submitDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.submit", this);
				this.getView().addDependent(this.submitDialog);
			}
			var fieldsValidation = validations.validateSections(headerArray, bankData, data, disclousersData, attachmentData,
				i18nModel, vModel, mandatoryModel, section, oId, cId, labelModel, bId);
			var checkFields = fieldsValidation.fieldArray;

			var checkVATFields = this.VATNumberandDateValidation(headerArray);
			var checkBankFields = this.bankDataValidation(bankData);
			if (checkVATFields.length > 0) {
				checkFields.push(...checkVATFields);
			}

			if (checkBankFields.length > 0) {
				checkFields.push(...checkBankFields);
			}

			this.validateForm(checkFields);

			for (var i = 0; i < data.BankingDetails.length; i++) {
				if (data.BankingDetails[i].AMOUNT_LIMIT) {
					data.BankingDetails[i].AMOUNT_LIMIT = Number(data.BankingDetails[i].AMOUNT_LIMIT);
				}
				if (data.BankingDetails[i].ASSO_SINCE) {
					data.BankingDetails[i].ASSO_SINCE = Number(data.BankingDetails[i].ASSO_SINCE);
				}
			}

			for (var i = 0; i < data.busHistory.length; i++) {
				if (data.busHistory[i].SINCE) {
					data.busHistory[i].SINCE = Number(data.busHistory[i].SINCE);
				}
				if (data.busHistory[i].PURCHASES) {
					data.busHistory[i].PURCHASES = Number(data.busHistory[i].PURCHASES);
				}
			}

			for (var i = 0; i < data.customerDetail.length; i++) {
				if (data.customerDetail[i].CUST_NO) {
					data.customerDetail[i].CUST_NO = Number(data.customerDetail[i].CUST_NO);
				}
			}

			if (checkFields.length > 0) {
				return;
			} else {
				this.submitDialog.open();
			}
		},

		handleSubmitCheckbox: function (oEvent) {

			var selected = oEvent.getSource().getSelected();
			if (selected === true) {
				oView.byId("submit_Id").setEnabled(true);
			} else {
				oView.byId("submit_Id").setEnabled(false);
			}
		},

		onSubmit: function () {

			BusyIndicator.show(0);
			section = 5;
			var path;
			var comment = sap.ui.getCore().byId("id_comment");
			if (comment.getValue().length > comment.getMaxLength()) {
				comment.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Comment should be less than 1000 characters");
				comment.focus();
				return;
			}

			var i18nModel = this.getView().getModel("i18n");
			var data = oView.getModel("blankJson").getData();
			var headerArray = this.getHeaderData(data);

			headerArray[0].STATUS = 4;
			headerArray[0].ACK_VALIDATION = "Yes";

			var addressContact = this.concatAddressContactData(data);

			addressContact = this.removeCountryRegionDesc(addressContact);

			this.setFieldsToNull(data);

			var bankDetails = this.getBankData(data);
			var financialDetails = this.handleBankDetails(data, bankDetails);
			var bankData = financialDetails.BankDetails;
			var bankFields = this.removeBankCountryDesc(bankData);

			var disclousersData = this.getDisclousers(data.disclousers);

			var attachmentData = this.getAttachmentsFromModels();

			for (var i = 0; i < data.BankingDetails.length; i++) {
				if (data.BankingDetails[i].AMOUNT_LIMIT) {
					data.BankingDetails[i].AMOUNT_LIMIT = Number(data.BankingDetails[i].AMOUNT_LIMIT);
				}
				if (data.BankingDetails[i].ASSO_SINCE) {
					data.BankingDetails[i].ASSO_SINCE = Number(data.BankingDetails[i].ASSO_SINCE);
				}
			}

			for (var i = 0; i < data.busHistory.length; i++) {
				if (data.busHistory[i].SINCE) {
					data.busHistory[i].SINCE = Number(data.busHistory[i].SINCE);
				}
				if (data.busHistory[i].PURCHASES) {
					data.busHistory[i].PURCHASES = Number(data.busHistory[i].PURCHASES);
				}
			}

			for (var i = 0; i < data.customerDetail.length; i++) {
				if (data.customerDetail[i].CUST_NO) {
					data.customerDetail[i].CUST_NO = Number(data.customerDetail[i].CUST_NO);
				}
			}

			data.events.push({
				"REQUEST_NO": loginData.REQUEST_NO,
				"EVENT_NO": 0,
				"EVENT_CODE": 4,
				"EVENT_TYPE": "ONB",
				"USER_ID": loginData.REGISTERED_ID,
				"USER_NAME": loginData.DIST_NAME1,
				"COMMENT": comment.getValue(),
				"CREATED_ON": new Date()
			});

			var payload = this.draftinPayload(headerArray, addressContact.address, addressContact.contact, bankFields,
				data.BankingDetails, data.busHistory, data.customerDetail, data.promotors, [], [], [], [], [], [],
				[attachmentData.attachFields], attachmentData.attachments1, [], section, updateId);

			path = appModulePath + "/odata/v4/ideal-registration-form-srv/PostRegFormData";

			jQuery.sap.delayedCall(100, this, function () {
				this.ajaxCall(path, payload, section);
			});
			context.closeDialog();
		},

		handleDraft: function () {

			var cWizardStep = context.wizar.getCurrentStep().split("--")[1];
			if (cWizardStep === "wStep1_Id") {
				this.handleWizardOne("D");
			} else if (cWizardStep === "wStep2_Id") {
				this.handleWizardTwo("D");
			} else if (cWizardStep === "wStep3_Id") {
				this.handleWizardThree("D");
			} else if (cWizardStep === "wStep4_Id") {
				this.StepNo = 4;
				this.handleWizardFour("D");
			} else if (cWizardStep === "wStep5_Id") {
				this.StepNo = 5;
				this.handleWizardFour("D");
			}
		},

		concatAddressContactData: function (data) {

			var addressAndContact = {};
			var address = [],
				contact = [];

			if (data.address.EMAIL !== null) {
				data.address.EMAIL = data.address.EMAIL.toLowerCase();
			}

			address.push.apply(address, [data.address]);
			if (vModel.S1G3T1F11 === "X") {
				address.push.apply(address, data.otherAddress);
			}
			if (vModel.S1G5T2F11 === "X") {
				contact.push.apply(contact, [data.MDContact]);
			}

			for (var i = 0; i < data.contact.length; i++) {
				if (loginData.CREATION_TYPE === 3) {
					if (data.contact[i].NAME1 !== null && data.contact[i].NAME2 !== null) {
						contact.push(data.contact[i]);
					}
				} else {
					contact.push(data.contact[i]);
				}
			}

			addressAndContact.address = address,
				addressAndContact.contact = contact

			return addressAndContact;
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

		//31/01/22
		concatOEMAndNONOEMDistributors: function (data) {

			var OEM = [];

			if (vModel.S3G5T1F1 === "X") {
				OEM.push.apply(OEM, data.OEMInfo);
			}

			if (vModel.S3G5T2F1 === "X") {
				OEM.push.apply(OEM, data.NONOEMInfo);
			}

			return OEM;
		},

		handleBankDetails: function (data, bankDetails) {

			var bankArr = [];
			var financialData = [];
			var financialObj = {};
			var count = 1001;
			var maxCount = 0;

			if (data.otherBankDetails.length > 0) {
				var idcount = null;
				maxCount = Math.max.apply(Math, data.otherBankDetails.map(function (obj) {
					if (obj.BANK_ID !== null) {
						var reg = /^[0-9]+$/.test(obj.BANK_ID);
						if (reg === true) {
							idcount = obj.BANK_ID;
						}
					}
					return idcount;
				}));
			}

			if (maxCount > 0) {
				count = maxCount;
			} else {
				count = 1001;
			}

			if (bankDetails[0].BANK_COUNTRY !== null && bankDetails[0].SWIFT_CODE !== null) {
				if (bankDetails[0].BANK_ID === null) {
					bankDetails[0].BANK_ID = "1001";
				}
			}
			bankArr.push.apply(bankArr, bankDetails);

			if (data.otherBankDetails.length > 0) {
				for (var i = 0; i < data.otherBankDetails.length; i++) {
					if (data.otherBankDetails[i].BANK_ID === null) {
						//data.otherBankDetails[i].BANK_ID = ++count;
						++count;
						data.otherBankDetails[i].BANK_ID = String(count);
					}

				}
				bankArr.push.apply(bankArr, data.otherBankDetails);
			}
			financialObj.BankValidationDetails = bankArr;

			if (bankArr.length > 0) {
				var object = null;
				financialData = Object.keys(bankArr).map(function (key) {
					object = Object.assign({}, bankArr[key]);
					if (key !== 0) {
						if (object.REQUIRED === true || object.REQUIRED === false || object.REQUIRED === null || object.REQUIRED === "") {
							delete object.REQUIRED;
							delete object.IBAN_LENGTH;
							delete object.BANK_NAME_EDITABLE;
						}
					}
					return object;
				});
			}
			financialObj.BankDetails = financialData;
			return financialObj;
		},

		setFieldsToNull: function (data) {

			for (var i = 0; i < data.finInfo.length; i++) {
				if (data.finInfo[i].TOTAL_REVENUE === "") data.finInfo[i].TOTAL_REVENUE = null;
				if (data.finInfo[i].NET_PROFIT_LOSS === "") data.finInfo[i].NET_PROFIT_LOSS = null;
				if (data.finInfo[i].TOTAL_ASSETS === "") data.finInfo[i].TOTAL_ASSETS = null;
				if (data.finInfo[i].TOTAL_EQUITY === "") data.finInfo[i].TOTAL_EQUITY = null;
			}

			if (data.ownerInfo.length > 0) {
				for (var j = 0; j < data.ownerInfo.length; j++) {
					if (data.ownerInfo[j].OWNERSHIP_PERCENT === "") data.ownerInfo[j].OWNERSHIP_PERCENT = null;
				}
			}

			if (data.operationalCap.length > 0) {
				for (var k = 0; k < data.operationalCap.length; k++) {
					if (data.operationalCap[k].PROD_CAPACITY === "") {
						data.operationalCap[k].PROD_CAPACITY = null;
					} else {
						data.operationalCap[k].PROD_CAPACITY = Number(data.operationalCap[k].PROD_CAPACITY);
					}
				}
			}

			if (data.clientInfo.length > 0) {
				for (var l = 0; l < data.clientInfo.length; l++) {
					if (data.clientInfo[l].CUSTOMER_SHARE === "") {
						data.clientInfo[l].CUSTOMER_SHARE = null;
					} else {
						data.clientInfo[l].CUSTOMER_SHARE = Number(data.clientInfo[l].CUSTOMER_SHARE);
					}
				}
			}
		},

		closeDialog: function () {

			sap.ui.getCore().byId("id_comment").setValue("");
			this.submitDialog.close();
		},

		readAddressType: function () {
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterAddressType";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (oData, response) {

					if (oData.value.length > 0) {
						var oMasterTypeJson = new JSONModel();
						oMasterTypeJson.setData(oData);
						oMasterTypeJson.setSizeLimit(oData.value.length);
						that.getView().setModel(oMasterTypeJson, "addressTypeJson");
					} else {
						console.log("Error While Reading MasterAddressType Entity");
					}
				},
				error: function (error) {

					BusyIndicator.hide();
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

		readCountrySet: function () {
			var that = this;
			context.oDataModel.read("/GetCountrySet", {
				success: function (oData, responce) {

					if (oData.results.length > 0) {
						var ocountryJson = new JSONModel();
						ocountryJson.setData(oData);
						ocountryJson.setSizeLimit(oData.results.length);
						that.getView().setModel(ocountryJson, "countryJson");

						var obankCountryJson = new JSONModel();
						obankCountryJson.setData(oData);
						obankCountryJson.setSizeLimit(oData.results.length);
						that.getView().setModel(obankCountryJson, "bankCountryJson");
					} else {
						console.log("Error While Reading GetCountrySet Entity")
					}
				},
				error: function (error) {
					BusyIndicator.hide();
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

		readRegionSet: function (countryKey, indicator) {
			BusyIndicator.show(0);
			var that = this;
			var cFilter = new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.EQ, countryKey);
			context.oDataModel.read("/GetStateSet", {
				filters: [cFilter],
				success: function (oData, responce) {

					BusyIndicator.hide(0);
					if (oData.results.length === 0) {
						if (indicator === "H") {
							var oRegionJson = new JSONModel();
							oRegionJson.setData(oData);
							oRegionJson.setSizeLimit(oData.results.length);
							that.getView().setModel(oRegionJson, "RegionJson");
						} else if (indicator === "CH") {
							var ocontactRegion = new JSONModel();
							ocontactRegion.setData(oData);
							ocontactRegion.setSizeLimit(oData.results.length);
							that.getView().setModel(ocontactRegion, "contactRegion");
						} else if (indicator === "PC") {
							var oprimaryContactRegion = new JSONModel();
							oprimaryContactRegion.setData(oData);
							oprimaryContactRegion.setSizeLimit(oData.results.length);
							that.getView().setModel(oprimaryContactRegion, "primaryContactRegion");
						} else {
							var oRegionJson1 = new JSONModel();
							oRegionJson1.setData(oData);
							oRegionJson1.setSizeLimit(oData.results.length);
							that.getView().setModel(oRegionJson1, "RegionJson1");
						}
					}
					if (oData.results.length > 0) {
						if (indicator === "H") {
							var oRegionJson = new JSONModel();
							oRegionJson.setData(oData);
							oRegionJson.setSizeLimit(oData.results.length);
							that.getView().setModel(oRegionJson, "RegionJson");
						} else if (indicator === "CH") {
							var ocontactRegion = new JSONModel();
							ocontactRegion.setData(oData);
							ocontactRegion.setSizeLimit(oData.results.length);
							that.getView().setModel(ocontactRegion, "contactRegion");
						} else if (indicator === "PC") {
							var oprimaryContactRegion = new JSONModel();
							oprimaryContactRegion.setData(oData);
							oprimaryContactRegion.setSizeLimit(oData.results.length);
							that.getView().setModel(oprimaryContactRegion, "primaryContactRegion");
						} else {
							var oRegionJson1 = new JSONModel();
							oRegionJson1.setData(oData);
							oRegionJson1.setSizeLimit(oData.results.length);
							that.getView().setModel(oRegionJson1, "RegionJson1");
						}
					} else {
						console.log("Error While Reading GetStateSet Entity");
					}
				},
				error: function (error) {
					BusyIndicator.hide(0);
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

		handleRegionSearchHQ: function (oEvent) {

			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("Bezei", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("Bland", sap.ui.model.FilterOperator.Contains, sQuery)];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}
			var oList = sap.ui.getCore().byId("region_listHQId");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		closeRegionDialogHQ: function () {
			this.regionDialog1.close();
			this.regionDialog1.destroy();
			this.regionDialog1 = null;
		},

		handleRegionHQ: function (oEvent) {

			var selectedObj = this.getView().getModel("blankJson").getProperty("/address");
			if (selectedObj.CITY !== null) selectedObj.CITY = null;
			if (selectedObj.POSTAL_CODE !== null) selectedObj.POSTAL_CODE = null;
			var regionCode = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson").getObject().Bland;
			var regionDesc = oEvent.getSource().getSelectedItem().getBindingContext("RegionJson").getObject().Bezei;
			this.getView().getModel("blankJson").getProperty("/address").STATE = regionCode;
			this.getView().getModel("blankJson").getProperty("/address").REGION_DESC = regionDesc;

			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("region_listHQId").removeSelections(true);
			sap.ui.getCore().byId("regionSrchHQId").setValue("");
			this.regionDialog1.close();

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue0 !== regionDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					updateId.splice(index1, 1);
				}
			}
		},

		readEntitySets: function (sEntityName, sAlisName) {
			context.oDataModel.read("/" + sEntityName, {
				success: function (oData, responce) {

					if (oData.results.length > 0) {
						var oModel = new JSONModel();
						oModel.setSizeLimit(oData.results.length);
						oModel.setData(oData);
						oView.setModel(oModel, sAlisName);
					} else {
						console.log("Error While Reading " + sEntityName + " Entity")
					}
				},
				error: function (error) {

					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},

		readSwiftCode: function (sCountry, sIndicator) {

			if (sCountry === "IN") {
				var oData1 = {
					results: [{
						"Banks": "FIRNINBB",
						"Swift": "FIRNINBB"
					}, {
						"Banks": "HDFCINBB",
						"Swift": "HDFCINBB"
					}, {
						"Banks": "HSBC0110",
						"Swift": "HSBC0110"
					}, {
						"Banks": "ICICINBB",
						"Swift": "ICICINBB"
					}, {
						"Banks": "SOININ55",
						"Swift": "SOININ55"
					}]
				}
				var oswiftJson = new JSONModel();
				oswiftJson.setData(oData1);
				oView.setModel(oswiftJson, "swiftJson");

			} else if (sCountry === "AE") {
				var oData2 = {
					results: [{
						"Banks": "ADCBAEAA",
						"Swift": "ADCBAEAA"
					}, {
						"Banks": "BARBAEAD",
						"Swift": "BARBAEAD"
					}]
				}
				var oswiftJson = new JSONModel();
				oswiftJson.setData(oData2);
				oView.setModel(oswiftJson, "swiftJson");

			} else {
				var cFilter = new sap.ui.model.Filter("Banks", sap.ui.model.FilterOperator.EQ, sCountry);
				context.oDataModel.read("/GetSwiftCodeSet", {
					filters: [cFilter],
					success: function (oData, responce) {

						if (sIndicator === "P") {
							var oswiftJson = new JSONModel();
							oswiftJson.setData(oData);
							oView.setModel(oswiftJson, "swiftJson");
						}
						else if (sIndicator === "S") {
							var swiftCodeJson = new JSONModel();
							swiftCodeJson.setData(oData.results);
							oView.setModel(swiftCodeJson, "swiftCodeJson");
						}
					},
					error: function (error) {
						BusyIndicator.hide();
						var oXMLMsg, oXML;
						if (context.isValidJsonString(error.responseText)) {
							oXML = JSON.parse(error.responseText);
							oXMLMsg = oXML.error["message"].value;
						} else {
							oXMLMsg = error.responseText;
						}
						MessageBox.error(oXMLMsg);
					}
				});
			}
		},

		readPostalCodeLength: function (sCountyCode, sIndicator) {

			var cFilter = new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.EQ, sCountyCode);
			context.oDataModel.read("/GetCountryDetailSet", {
				filters: [cFilter],
				success: function (oData, responce) {
					if (oData.results.length > 0) {
						if (sIndicator === "H") {
							if (sCountyCode === "AE") {
								postalCodeLength = 6;
								oView.byId("S1G2T1F10").setMaxLength(postalCodeLength);
							} else {
								postalCodeLength = parseInt(oData.results[0].Lnplz);
								oView.byId("S1G2T1F10").setMaxLength(postalCodeLength);
							}
						} else {
							if (sCountyCode === "AE") {
								registerPincode = 6;
							} else {
								registerPincode = parseInt(oData.results[0].Lnplz);
							}
						}
					} else {
						console.log("Error While Reading GetCountryDetailSet Entity")
					}
				},
				error: function (error) {
					BusyIndicator.hide();
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

		handleHQRegionDialog: function (oEvent) {
			var HQAddress = "H";
			context.selectedCityObjectOP = oEvent.getSource();
			BusyIndicator.show(0);
			var country = this.getView().getModel("blankJson").getProperty("/address").COUNTRY;
			//03/03/2022
			if (country === null || country === "") {
				MessageBox.information("Please Select Country", {
					title: "INFORMATION",
					actions: [MessageBox.Action.OK],
					onClose: function (oAction) {
						if (oAction === "OK") {

						}
					}
				});
				BusyIndicator.hide();
				return;
			}
			this.readRegionSet(country, HQAddress);
			if (!this.regionDialog1) {
				this.regionDialog1 = new sap.ui.xmlfragment("com.ibs.ibsappidealregistrationform.view.fragments.HQRegionDialog", this);
				this.getView().addDependent(this.regionDialog1);
			}
			jQuery.sap.delayedCall(100, this, function () {
				BusyIndicator.hide();
				this.regionDialog1.open();
			});

			context._onTableValueHelpChange0(oEvent);
		},

		readPostalCodeFormates: function (sCountryCode, sIndex, oEvent) {
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterPostalcode?$filter=(LAND1 eq '" + sCountryCode + "')";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (oData, responce) {

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
						} else if (sIndex === "checkRegex") {
							oView.getModel("localModel").setProperty("/regex_HQ", regex);
							oView.getModel("localModel").setProperty("/pcode_HQformat", oData.value[0].REGEX_EXP);
							var oSource = oEvent.getSource();
							var reg = oView.getModel("localModel").getProperty("/regex_HQ").test(oSource.getValue());
							if (reg === true || oSource.getValue() === "") {
								oSource.setValueState(sap.ui.core.ValueState.None);
							} else {
								if (oData.value[0].REGEX_EXP) {
									oEvent.getSource().setValue("");
									oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code eg: " + oView.getModel(
										"localModel")
										.getProperty("/pcode_HQformat"));
									return;
								}
								else {
									oSource.setValueState(sap.ui.core.ValueState.None);
									return;
								}
							}
						}
					} else {
						console.log("Error While Reading PostalcodeMaster Entity")
					}
				},
				error: function (error) {
					BusyIndicator.hide();
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

		readCountryCode: function () {

			context.oDataModel.read("/GetTelCodeSet", {
				success: function (oData, responce) {

					// added on 11-04-2023 by Inder Chouhan	Error Message if Response is Empty
					if (oData.results.length > 0) {
						var countryCode = new JSONModel();
						countryCode.setSizeLimit(oData.results.length);
						countryCode.setData(oData);
						oView.setModel(countryCode, "countryCode");
					} else {
						console.log("Error While Reading GetTelCodeSet Entity")
					}
				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},

		readTelecodeSet: function () {

			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterTelecode";
			jQuery.sap.delayedCall(100, this, function () {
			});

			$.ajax({
				url: path,
				type: 'GET',
				data: { $expand: 'TO_COUNTRY' },
				contentType: 'application/json',
				success: function (oData, responce) {
					if (oData.value.length > 0) {
						var ocountryCode = new JSONModel();
						ocountryCode.setSizeLimit(oData.value.length); //06-10-2022 -300
						ocountryCode.setData(oData);
						oView.setModel(ocountryCode, "countryCode");
					} else {
						console.log("Error While Reading TelecodeMaster Entity")
					}
				},
				error: function (error) {
					BusyIndicator.hide();
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

		getBankDetails: function (sCountry, sSwiftCode, sType, iIndex, branchName, sBankName) {

			var sIbanNumber = null,
				sRoutingCode = null,
				rRegex = null,
				oEmptyObject = null,
				testString = null,
				bBankKeyMatched = false;
			var bFilter = new sap.ui.model.Filter("Banks", sap.ui.model.FilterOperator.EQ, sCountry);
			var cFilter = new sap.ui.model.Filter("Swift", sap.ui.model.FilterOperator.EQ, sSwiftCode);
			context.oDataModel.read("/GetBankDetailSet", {
				filters: [bFilter, cFilter],
				success: function (oData, responce) {
					if (sType === 'PRI') {
						sIbanNumber = oView.getModel("blankJson").getProperty("/bankDetails/IBAN_NUMBER");
						sRoutingCode = oView.getModel("blankJson").getProperty("/bankDetails/ROUTING_CODE")
					} else if (sType === 'OTH') {
						sIbanNumber = oView.getModel("blankJson").getProperty("/otherBankDetails/" + iIndex + "/IBAN_NUMBER");
						sRoutingCode = oView.getModel("blankJson").getProperty("/otherBankDetails/" + iIndex + "/ROUTING_CODE");
					}

					if (oData.results.length === 0) {
						oEmptyObject = {
							Banka: null,
							Brnch: null,
							Bankl: null,
							Bnklz: null
						}

						context.setBankDetails(oEmptyObject, sType, iIndex, branchName, sBankName);
					}
					else if (oData.results.length === 1) {
						context.setBankDetails(oData.results[0], sType, iIndex, branchName, sBankName);
					}
					else if (oData.results.length > 1 && ((sIbanNumber !== null && sIbanNumber !== undefined && sIbanNumber !== "") ||
						(sRoutingCode !== null && sRoutingCode !== undefined && sRoutingCode !== ""))) {
						for (var i = 0; i < oData.results.length; i++) {

							sIbanNumber = sIbanNumber !== null && sIbanNumber !== undefined && sIbanNumber !== "" ? sIbanNumber : "";
							sRoutingCode = sRoutingCode !== null && sRoutingCode !== undefined && sRoutingCode !== "" ? sRoutingCode : "";
							testString = sIbanNumber + sRoutingCode;
							rRegex = new RegExp(oData.results[i].Bankl);
							if (rRegex.test(testString)) {

								context.setBankDetails(oData.results[i], sType, iIndex, branchName, sBankName);
								bBankKeyMatched = true;
							}
						}
					}

					if (bBankKeyMatched === false && oData.results.length > 1) {
						oEmptyObject = {
							Banka: null,
							Brnch: null,
							Bankl: null,
							Bnklz: null
						}

						context.setBankDetails(oEmptyObject, sType, iIndex);
					}
				},
				error: function (error) {
					BusyIndicator.hide();
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

		readIBANInfo: function (sCountryCode, iIndex, sIndicator) {
			var otherBankData = this.getView().getModel("blankJson").getProperty("/otherBankDetails");
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIbanCountry?$filter=(LAND1 eq '" + sCountryCode + "')";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (oData, response) {

					if (sIndicator === "SD") {
						if (oData.value.length > 0) {
							oView.getModel("localModel").setProperty("/ibanNum", true);
							oView.getModel("localModel").setProperty("/ibanLength", oData.value[0].LENGTH);
							oView.getModel("dynamicCountModel").setProperty("/IBANMandatoryCount", 1);
						} else {
							oView.getModel("localModel").setProperty("/ibanNum", false);
							oView.getModel("localModel").setProperty("/ibanLength", 34);
							oView.getModel("blankJson").setProperty("/bankDetails/IBAN_NUMBER", null);
							oView.getModel("dynamicCountModel").setProperty("/IBANMandatoryCount", 0);
						}
					} else if (sIndicator === "TD") {
						if (oData.value.length > 0) {
							for (var i = 0; i < otherBankData.length; i++) {
								if (i === iIndex) {
									context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/IBAN_LENGTH", oData.value[0].LENGTH);
									context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/REQUIRED", true);
								}
							}
						} else {
							context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/IBAN_LENGTH", null);
							context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/REQUIRED", false);
							context.getView().getModel("blankJson").setProperty("/otherBankDetails/" + iIndex + "/IBAN_NUMBER", null);
						}
					}
				},
				error: function (error) {
					BusyIndicator.hide();
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

		readDraftIBANInfo: function (sCountryCode, bankData) {

			var otherBankData = this.getView().getModel("blankJson").getProperty("/otherBankDetails");
			var ibanFilter = new sap.ui.model.Filter("LAND1", sap.ui.model.FilterOperator.EQ, sCountryCode);
			context.cloudService.read("/IbanMaster", {
				filters: [ibanFilter],
				success: function (oData, responce) {

					// added on 11-04-2023 by Inder Chouhan	Error Message if Response is Empty
					if (oData.results.length > 0) {

						bankData.IBAN_LENGTH = oData.results[0].LENGTH;
						bankData.REQUIRED = true;
					} else {
						console.log("Error While Reading IbanMaster Entity")
					}

				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},

		IBANMandatory_LengthCheck: function (sCountryCode, iIndex, bankData) {

			var otherBankData = this.getView().getModel("blankJson").getProperty("/otherBankDetails");
			var ibanFilter = new sap.ui.model.Filter("LAND1", sap.ui.model.FilterOperator.EQ, sCountryCode);
			context.cloudService.read("/IbanMaster", {
				filters: [ibanFilter],
				success: function (oData, responce) {

					// added on 11-04-2023 by Inder Chouhan	Error Message if Response is Empty
					if (oData.results.length > 0) {
						bankData.IBAN_LENGTH = oData.results[0].LENGTH;
						bankData.REQUIRED = true;
					} else {
						console.log("Error While Reading IbanMaster Entity")
					}

				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},

		handleEvents: function () {

			context.readEvents(loginData.REQUEST_NO);

			// this.getView().byId("DynamicSideContent").setShowSideContent(true);

			var dynamicSideContentState = this.getView().byId("DynamicSideContent").getShowSideContent();

			if (dynamicSideContentState === true) {
				this.getView().byId("DynamicSideContent").setShowSideContent(false);
			}
			else {
				this.getView().byId("DynamicSideContent").setShowSideContent(true)
			}
		},

		handleRefreshCommunication: function () {

			this.readEvents(loginData.REQUEST_NO);
		},

		handleSideContentHide: function () {

			this.getView().byId("DynamicSideContent").setShowSideContent(false);
		},

		onPost: function (oEvent) {


			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/MessengerService";
			var data = oView.getModel("blankJson").getData();
			var cMessage = oEvent.getParameter("value");

			var oPayload = {

				"action": "DISTRIBUTOR",
				"appType": "REG",
				"messengerData": {
					"loginId": loginData.REGISTERED_ID,
					"mailTo": loginData.REQUESTER_ID
				},
				"inputData": [{
					"REQUEST_NO": loginData.REQUEST_NO,
					"ENTITY_CODE": loginData.ENTITY_CODE,
					"REGISTERED_ID": loginData.REGISTERED_ID,
					"DIST_NAME1": loginData.DIST_NAME1,
					"REQUESTER_ID": loginData.REQUESTER_ID
				}],
				"eventsData": [{
					"REQUEST_NO": loginData.REQUEST_NO,
					"EVENT_NO": 0,
					"EVENT_CODE": 10,
					"EVENT_TYPE": "MSG",
					"USER_ID": loginData.REGISTERED_ID,
					"USER_NAME": loginData.DIST_NAME1,
					"REMARK": "Distributor sent email to Sales Associate",
					"COMMENT": cMessage,
					"CREATED_ON": new Date()
				}],
				"userDetails": {
					"USER_ROLE": "DISTRIBUTOR",
					"USER_ID": context.UserId
				}
			}

			var data = JSON.stringify(oPayload);

			BusyIndicator.show();
			$.ajax({
				url: path,
				type: 'POST',
				data: data,
				contentType: 'application/json',
				success: function (oData, responce) {
					BusyIndicator.hide();
					// var data = JSON.parse(oData);
					MessageBox.success(oData.value[0].Message, {
						actions: [MessageBox.Action.OK],
						onClose: function (oAction) {
							if (oAction === "OK") {
								context.readEvents(loginData.REQUEST_NO);
							}
						}
					});
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

		//changes done by Amit (15-09-23)
		readEvents: function (registerNo) {

			var registeFilter = "(REQUEST_NO eq " + registerNo + ")";
			var eTypeFilter = "(EVENT_TYPE eq 'MSG')";
			var sFilter = registeFilter + " and " + eTypeFilter;
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegEventsLog?$filter=" + sFilter;

			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (oData, response) {

					// added on 11-04-2023 by Inder Chouhan	Error Message if Response is Empty
					if (oData.value.length > 0) {
						var eventJson = new JSONModel();
						eventJson.setData(oData);
						oView.setModel(eventJson, "eventJson");
					} else {
						console.log("Error While Reading VenRegisterEvents Entity")
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

		handleNationality: function (oEvent) {

			var sCountry = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/NATIONALITY", sCountry);
			oView.getModel("blankJson").refresh(true);

			context._onTableValueChange(oEvent);
		},

		handleCountry: function (oEvent) {

			var sCountry = oEvent.getSource().getSelectedKey();
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("blankJson").getPath();
			oView.getModel("blankJson").setProperty(sPath + "/COUNTRY", sCountry);
			oView.getModel("blankJson").refresh(true);

			context._onTableValueChange(oEvent);
		},

		handleUploadVATEvidence: function (oEvent) {

			var vatEvidence = oView.getModel("G22Json").getData()[0];

			if (vatEvidence.ATTACH_VALUE !== null) {
				this._deleteHanaFile(vatEvidence, "G22Json", 0, "D_VAT");
			}

			this.handleUpload(oEvent);

		},

		handleTypeMissmatch: function (oEvent) {

			MessageBox.warning("Please select correct File Type");
		},

		//KOMAL ATTACHMENTS 
		handleUpload: function (oEvent) {
			// debugger;
			var sbfileDetails = oEvent.getParameters("file").files;
			var filesize = sbfileDetails[0].size;
			var fileSizeInBytes = filesize;
			// Convert the bytes to Kilobytes (1 KB = 1024 Bytes)
			var fileSizeInKB = fileSizeInBytes / 1024;
			// Convert the KB to MegaBytes (1 MB = 1024 KBytes)
			var fileSizeInMB = fileSizeInKB / 1024;

			var fName = sbfileDetails[0].name;

			if (fileSizeInMB > 5) {
				MessageBox.warning("File size should be less than or equal to 5MB", {
					icon: MessageBox.Icon.WARNING,
					title: "WARNING",
					actions: sap.m.MessageBox.Action.OK,
					emphasizedAction: sap.m.MessageBox.Action.OK
				});
			}else if (fName.includes(".pdf") || fName.includes(".xlsx") || fName.includes(".docm") ||
				fName.includes(".docx") || fName.includes(".jpg") || fName.includes(".txt")) {
				this.model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;
				this.sourceData = oEvent.getSource();

				if (this.model === "G7Json" || this.model === "G6Json" || this.model === "G10Json" || this.model === "G22Json" ||
					this.model === "G23Json") {
					this.sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
				}
				else {
					this.sbIndex = parseInt(oEvent.getSource().getBindingContext(this.model).getPath().split("/")[1]);
				}


				if (loginData.REQUEST_TYPE === 5) {
					if (this.model === "G7Json" || this.model === "G6Json" || this.model === "G10Json" || this.model === "G22Json" ||
						this.model === "G23Json") {
						if (!updateId.includes(oEvent.getSource().getParent().getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1])) {
							updateId.push(oEvent.getSource().getParent().getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1]);
						}
					}
					else {
						if (!updateId.includes(oEvent.getSource().getParent().getParent().getTable().mBindingInfos.visible.binding.aBindings[0].sPath.split("/")[1])) {
							updateId.push(oEvent.getSource().getParent().getParent().getTable().mBindingInfos.visible.binding.aBindings[0].sPath.split("/")[1]);
						}
					}
				}

				this.sbfileUploadArr = [];
				if (sbfileDetails.lenghth != 0) {
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
			}
			else {
				MessageBox.warning("Please select correct File Type");
			}
		},

		sbBase64conversionMethod: function (fileMime, fileName, fileDetails) {

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
						// context.sbbase64ConversionRes = binaryString;
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
				// btoa(binaryString);
				context.sbfileUploadArr = [];
				context.sbfileUploadArr.push({
					"MimeType": fileMime,
					"FileName": fileName,
					"Content": context.sbbase64ConversionRes,
				});
				context._sbgetUploadedFiles();
			};
			reader.readAsBinaryString(fileDetails);
		},

		//Open Text
		b64toBlob: function (b64Data, contentType, sliceSize, filemime) {

			//	var val = "data:application/pdf;base64," + b64Data;
			contentType = contentType || '';
			sliceSize = sliceSize || 512;
			var byteCharacters = atob(b64Data);
			//	var byteCharacters = atob(val);
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

		_sbgetUploadedFiles: function () {
              debugger
			if (this.sbfileUploadArr.length != 0) {
				for (var fdata in this.sbfileUploadArr) {
					if (this.sbfileUploadArr[fdata].Content === "") {
						MessageBox.warning("Upload Failed - File is empty", {
							icon: MessageBox.Icon.WARNING,
							title: "WARNING",
							actions: sap.m.MessageBox.Action.OK,
							emphasizedAction: sap.m.MessageBox.Action.OK
						});
						context.sbfileUploadArr = [];
						return;
					}
					this.sbAttachmentArr = {
						"FILE_NAME": this.sbfileUploadArr[fdata].FileName,
						"FILE_MIMETYPE": this.sbfileUploadArr[fdata].MimeType,
						"FILE_CONTENT": this.sbfileUploadArr[fdata].Content,
					};
				}
			}
			var sFileName = this.sbAttachmentArr.FILE_NAME;
			sFileName = sFileName.split(".")[0];


			var payload = {
				"action": "UPLOAD",
				"attachmentId": {
					"REQUEST_NO": loginData.REQUEST_NO,
					"SR_NO": 1
				},
				"inputData": [{
					"DOC_ID": 0,
					"FILE_NAME": this.sbAttachmentArr.FILE_NAME,
					"FILE_MIMETYPE": this.sbAttachmentArr.FILE_MIMETYPE,
					"FILE_CONTENT": this.sbAttachmentArr.FILE_CONTENT,
					"UPLOADED_ON": new Date()
				}],
				"userDetails": {
					"USER_ROLE": "DISTRIBUTOR",
					"USER_ID": context.UserId
				}
			};

			payload = JSON.stringify(payload);

			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/ManageCMS";

			this.sbfileUploadArr = [];

			BusyIndicator.show();
			$.ajax({
				url: path,
				type: 'POST',
				data: payload,
				contentType: 'application/json',
				success: function (data, responce) {
					BusyIndicator.hide();
					var sMessage = JSON.parse(data.value[0]).Message;
					var iDocID = JSON.parse(data.value[0]).DocID;
					MessageBox.success(sMessage, {
						title: "SUCCESS",
						actions: [MessageBox.Action.OK],
						emphasizedAction: sap.m.MessageBox.Action.OK,
						onClose: function (oAction) {

							if (context.model === "G3Json" || context.model === "G7Json" || context.model === "G6Json" ||
								context.model === "G10Json" || context.model === "G13Json" || context.model === "G14Json" ||
								context.model === "G22Json" || context.model === "G23Json" || context.model === "G24Json" ||
								context.model === "G4Json" || context.model === "G2Json" || context.model === "G1Json" ||
								context.model === "G25Json" || context.model === "G26Json" || context.model === "G27Json" ||
								context.model === "G28Json") {

								var oModel = oView.getModel(context.model).oData[context.sbIndex];
								if(context.model === "G25Json"){
									var enableG25=oView.byId("S4A6F1").getItems()[context.sbIndex].getCells()[6];
									enableG25.setEnabled(true);
								}else if(context.model === "G27Json"){
									var enableG27=oView.byId("S4A8F1").getItems()[context.sbIndex].getCells()[6];
									enableG27.setEnabled(true);
								}else if(context.model === "G28Json"){
									var enableG28=oView.byId("S4A9F1").getItems()[context.sbIndex].getCells()[6];
									enableG28.setEnabled(true);
								}else if(context.model === "G26Json"){
									var enableG26=oView.byId("S4A7F1").getItems()[context.sbIndex].getCells()[6];
									enableG26.setEnabled(true);
								}else{
									var enableG24=oView.byId("S4A10F1").getItems()[context.sbIndex].getCells()[6];
									enableG24.setEnabled(true);
								}
								oModel.FILE_NAME = context.sbAttachmentArr.FILE_NAME;
								oModel.OT_DOC_ID = String(iDocID);
								oView.getModel(context.model).refresh(true);
							}
						}
					});
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

		//open text
		_postOSTFile: function (oModel, blobData, model, token) {

			var Pdfdata = new FormData();
			// Pdfdata.append("file", blobData, {

			// });
			Pdfdata.append("file", blobData); //with mimetype
			Pdfdata.append("type", 144);
			Pdfdata.append("parent_id", parseInt(oView.getModel("blankJson").getProperty("/headerData/OT_FOLDER1_ID")));
			Pdfdata.append("name", loginData.IDEAL_DIST_CODE + oModel.ATTACH_SHORT_DEC + "." + context.sbAttachmentArr.FILE_NAME);

			$.ajax({
				url: "/OpenText/otcs/cs.exe/api/v1/nodes",
				method: "POST",
				headers: {
					'otcsticket': JSON.parse(token).ticket //token generated to send request
				},
				contentType: false,
				processData: false,
				cache: false,
				crossDomain: true,
				data: Pdfdata,
				success: function (data, response) {

					oModel.FILE_CONTENT = context.sbAttachmentArr.FILE_CONTENT;
					oModel.FILE_NAME = loginData.IDEAL_DIST_CODE + oModel.ATTACH_SHORT_DEC + "." + context.sbAttachmentArr.FILE_NAME;
					oModel.FILE_MIMETYPE = null;
					oModel.ATTACH_SHORT_DEC = oModel.ATTACH_SHORT_DEC;
					oModel.DRAFT_IND = null;
					oModel.OT_DOC_ID = data.id;

					if (loginData.REQUEST_TYPE === 5) {
						oModel.UPDATE_FLAG = "X";
						if (model === "G6Json" || model === "G7Json" || model === "G10Json" || model === "G22Json" || model === "G23Json") {

							if (!updateId.includes(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0]
								.sPath
								.split(
									"/")[1]) && context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split(
										"/")[1] !== "G23ICVID") {
								updateId.push(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split(
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

					context._postHanaFile(oModel, model);

				},
				error: function (error) {
					BusyIndicator.hide();
					// context.getView().setBusy(false);
					//context.errorLogCreation(error.responseText, error.status, oView.getModel("blankJson").getProperty("/headerData/REQUEST_NO"), oView.getModel("blankJson").getProperty("/headerData/REGISTERED_ID"), "API");
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

			var oEntry = {},
				updatedFields;
			oEntry.REQUEST_NO = loginData.REQUEST_NO;
			oEntry.SR_NO = null;
			oEntry.ATTACH_CODE = oModel.CODE || null;
			oEntry.ATTACH_GROUP = oModel.GROUP2 || null;
			oEntry.ATTACH_DESC = oModel.DESCRIPTION || null;
			oEntry.ATTACH_VALUE = oModel.ATTACH_VALUE || null;
			oEntry.EXPIRY_DATE = oModel.EXPIRY_DATE || null;
			oEntry.FILE_NAME = oModel.FILE_NAME || "";
			oEntry.FILE_TYPE = oModel.TYPE || null;
			oEntry.FILE_MIMETYPE = oModel.FILE_MIMETYPE || null;
			oEntry.FILE_CONTENT = null;
			oEntry.OT_DOC_ID = oModel.OT_DOC_ID || null;
			// oEntry.OT_LAST_DOC_ID = null;
			// oEntry.UPDATE_FLAG = null;
			// oEntry.DELETE_FLAG = null;
			// oEntry.ATTACH_SHORT_DEC = null;
			// oEntry.ATTACH_FOR = null;
			oEntry.UPLOADED_ON = null;
			oEntry.OT_LAST_DOC_ID = oModel.OT_LAST_DOC_ID || null;
			oEntry.UPDATE_FLAG = oModel.UPDATE_FLAG || null;
			oEntry.DELETE_FLAG = oModel.DELETE_FLAG || null;
			oEntry.ATTACH_SHORT_DEC = oModel.ATTACH_SHORT_DEC || null;
			oEntry.ATTACH_FOR = oModel.ATTACH_FOR || null;

			var attachFields = {
				"REQUEST_NO": loginData.REQUEST_NO,
				"IS_UAE_COMPANY": oView.getModel("G7Json").oData[0].FLAG,
				"ISSUE_ELEC_TAX_INV": oView.getModel("G6Json").oData[0].FLAG,
				"SOLE_DIST_MFG_SER": oView.getModel("G6Json").oData[1].FLAG,
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

					MessageBox.show("Error while Creation.", {
						icon: MessageBox.Icon.ERROR,
						title: "ERROR"
					});
				}
			});

		},

		handleVATExemptReason: function (oEvent) {

			var vatObject = oView.getModel("G22Json").getData()[0];
			var rOTDOCID = Math.floor(1000 + Math.random() * 9000);
			if (vatObject.OT_DOC_ID === null) {
				vatObject.OT_DOC_ID = rOTDOCID.toString();
				oView.getModel("G22Json").refresh(true);
			}
			var path = "/iVen_EDGE/VENDOR_PORTAL/XSJS/VENDOR_ONBOARDING_ATTACHMENTS.xsjs?ACTION=ATTACH_DESC_EDIT";

			var payload = {
				"VALUE": {
					"REQUEST_NO": loginData.REQUEST_NO || null,
					"SR_NO": vatObject.SR_NO || null,
					"ATTACH_CODE": vatObject.CODE || null,
					"ATTACH_GROUP": vatObject.GROUP2 || null,
					"ATTACH_DESC": vatObject.DESCRIPTION || null,
					"ATTACH_VALUE": vatObject.ATTACH_VALUE || null,
					"EXPIRY_DATE": vatObject.EXPIRY_DATE || null,
					"FILE_NAME": vatObject.FILE_NAME || '',
					"FILE_TYPE": vatObject.FILE_TYPE || null,
					"FILE_MIMETYPE": vatObject.FILE_MIMETYPE || null,
					"FILE_CONTENT": vatObject.FILE_CONTENT || null,
					"UPLOADED_ON": vatObject.UPLOADED_ON || null,
					"OT_DOC_ID": vatObject.OT_DOC_ID || null,
					"OT_LAST_DOC_ID": vatObject.OT_LAST_DOC_ID || null,
					"UPDATE_FLAG": vatObject.UPDATE_FLAG || null,
					"DELETE_FLAG": vatObject.DELETE_FLAG || null,
					"ATTACH_SHORT_DEC": vatObject.ATTACH_SHORT_DEC || null,
					"ATTACH_FOR": vatObject.ATTACH_FOR || null
				}
			};

			var data = JSON.stringify(payload);
			$.ajax({
				url: path,
				type: 'POST',
				data: data,
				contentType: 'application/json',
				success: function (oData, responce) {

					var data = oData;
				},
				error: function (error) {

					var oXML = JSON.parse(error.responseText);
					var oXMLMsg = oXML.error["message"].value;
					MessageBox.error(oXMLMsg);
				}
			});

		},

		getAttachmentsFromModels: function () {

			var attachmentObject = {};

			var oModel7 = oView.getModel("G7Json").getData();
			//var items7 = this.getView().byId("id_attachUAETable").getVisibleItems();

			var res = [];
			res.push(...oView.getModel("G1Json").getData());
			res.push(...oView.getModel("G2Json").getData());
			res.push(...oView.getModel("G3Json").getData());
			res.push(...oView.getModel("G4Json").getData());
			res.push(...oView.getModel("G5Json").getData());
			res.push(...oView.getModel("G6Json").getData());
			//res.push(...oView.getModel("G7Json").getData());
			res.push(...oView.getModel("G8Json").getData());
			res.push(...oView.getModel("G9Json").getData());
			res.push(...oView.getModel("G10Json").getData());
			res.push(...oView.getModel("G11Json").getData());
			res.push(...oView.getModel("G12Json").getData());
			res.push(...oView.getModel("G13Json").getData());
			res.push(...oView.getModel("G14Json").getData());
			res.push(...oView.getModel("G15Json").getData());
			res.push(...oView.getModel("G16Json").getData());
			res.push(...oView.getModel("G17Json").getData());
			res.push(...oView.getModel("G18Json").getData());
			res.push(...oView.getModel("G19Json").getData());
			res.push(...oView.getModel("G20Json").getData());
			res.push(...oView.getModel("G21Json").getData());
			res.push(...oView.getModel("G22Json").getData());
			res.push(...oView.getModel("G23Json").getData());
			res.push(...oView.getModel("G24Json").getData());
			res.push(...oView.getModel("G25Json").getData());
			res.push(...oView.getModel("G26Json").getData());
			res.push(...oView.getModel("G27Json").getData());
			res.push(...oView.getModel("G28Json").getData());

			// for (var i = 0; i < items7.length; i++) {
			// 	res.push(oModel7[items7[i].mAggregations.cells[0].mBindingInfos.text.binding.sPath.split("/DESCRIPTION")[0].split("/")[1]]);
			// }

			var attach = context._getAttachmentData(res);

			var attachFields = {
				"IS_UAE_COMPANY": oModel7[0].FLAG,
				"ISSUE_ELEC_TAX_INV": oView.getModel("G6Json").oData[0].FLAG,
				"SOLE_DIST_MFG_SER": oView.getModel("G6Json").oData[1].FLAG,
				"PASSPORT_OF_AUTH_SIGNATORY": null,
				"PASSPORT_REPR_AUTH_PERSON": null
			};

			attachmentObject.attachments1 = attach.attachments1;
			attachmentObject.attachments2 = attach.attachments2;
			attachmentObject.attachFields = attachFields;

			return attachmentObject;

		},

		_getAttachmentData: function (data) {

			var attachObjects = {};
			var attachments1 = [],
				attachments2 = [];

			var oDate;
			var sDate;


			for (var i = 0; i < data.length; i++) {
				if (data[i].EXPIRY_DATE !== undefined && data[i].EXPIRY_DATE !== null && data[i].EXPIRY_DATE !== "") {
					oDate = new Date(data[i].EXPIRY_DATE);
					sDate = oDate.toISOString().split('T')[0];
				}
				var attachObject = {
					"ATTACH_CODE": data[i].CODE,
					"ATTACH_DESC": data[i].DESCRIPTION,
					"FILE_CONTENT": data[i].DRAFT_IND === "X" ? data[i].FILE_CONTENT : data[i].FILE_CONTENT,
					"OT_DOC_ID": data[i].OT_DOC_ID,
					"ATTACH_VALUE": data[i].ATTACH_VALUE || null,
					"ATTACH_GROUP": data[i].GROUP2,
					"FILE_MIMETYPE": data[i].FILE_MIMETYPE,
					"FILE_NAME": data[i].FILE_NAME,
					"FILE_TYPE": data[i].TYPE,
					"EXPIRY_DATE": sDate || null,
					"OT_LAST_DOC_ID": null,
					"UPDATE_FLAG": data[i].UPDATE_FLAG || null,
					"DELETE_FLAG": null,
					"ATTACH_SHORT_DEC": data[i].ATTACH_SHORT_DEC || null,
					"ATTACH_FOR": data[i].ATTACH_FOR || null,
					"UPLOADED_ON": null
				}

				if (data[i].FILE_NAME !== "") {
					attachments1.push(attachObject);
				}
				// if (data[i].OT_DOC_ID !== null) {
				// 	attachments1.push(attachObject);
				// }
				attachments2.push(attachObject);

			}

			attachObjects.attachments1 = attachments1;
			attachObjects.attachments2 = attachments2;

			return attachObjects;
		},

		//Delete Attachments************************************************

		onDelete: function (oEvent) {

			var oSource = oEvent.getSource();
			this.sourceData = oSource;
			var sbIndex = "";
			var model;

			if (oEvent.getSource().getParent().getId().includes('item_G23')) {
				model = "G23Json";
			}
			else if (Object.keys(oEvent.getSource().getParent().oBindingContexts)[0] === undefined) {
				model = oSource.getParent().mBindingInfos.visible.parts[0].model;
			}
			else {
				model = Object.keys(oEvent.getSource().getParent().oBindingContexts)[0];
			}

			if (model === "G7Json") {
				context.sbIndex = Number(oEvent.getSource().getParent().mBindingInfos.visible.parts[1].path.split("/")[1]);
			}


			if (model === "G23Json") {
				sbIndex = 0;
			} else if (model === "G7Json") {
				sbIndex = context.sbIndex;

			} else if (model === "G6Json" || model === "G10Json" || model === "G22Json") {
				sbIndex = parseInt(oSource.getParent().mBindingInfos.visible.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
			} else {
				sbIndex = parseInt(oSource.getBindingContext(model).getPath().split("/")[1]);
			}
			//var model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;
			var oModel = oView.getModel(model).oData[sbIndex];
			if (oModel.FILE_NAME === '') {
				var oArrray = oView.getModel(model).oData;
				if (oArrray.length !== 1) {
					oArrray.splice(sbIndex, 1);
				}
				oView.getModel(model).refresh(true);
			}else
			MessageBox.information("Are you sure you want to delete the file ?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (Action) {
					if (Action === "YES") {
						// else {
							var DeletePayload = {
								"action": "DELETE",
								"attachmentId": {
									"REQUEST_NO": loginData.REQUEST_NO,
									"SR_NO": 1,
									"DOC_ID": oModel.OT_DOC_ID
								},
								"inputData": [{
									"DOC_ID": 0,
									"FILE_NAME": oModel.FILE_NAME
								}],
								"userDetails": {
									"USER_ROLE": "DISTRIBUTOR",
									"USER_ID": context.UserId
								}
							};
							DeletePayload = JSON.stringify(DeletePayload);

							var path = appModulePath + "/odata/v4/ideal-registration-form-srv/ManageCMS";

							BusyIndicator.show();
							$.ajax({
								url: path,
								type: 'POST',
								data: DeletePayload,
								contentType: 'application/json',
								success: function (data, responce) {

									BusyIndicator.hide();
									var sMessage = JSON.parse(data.value[0]).Message;
									MessageBox.success(sMessage, {
										title: "SUCCESS",
										actions: [MessageBox.Action.OK],
										emphasizedAction: sap.m.MessageBox.Action.OK,
										onClose: function (oAction) {

											if (model === "G23Json") {
												sbIndex = 0;
											} else if (model === "G7Json") {
												sbIndex = context.sbIndex;

											}
											else if (model === "G1Json" || model === "G4Json" || model === "G3Json" ||
												model === "G11Json" || model === "G12Json" || model === "G14Json" ||
												model === "G13Json" || model === "G15Json" || model === "G24Json" || model === "G2Json" ||
												model === "G25Json" || model === "G26Json" || model === "G27Json" || model === "G28Json") {
												sbIndex = parseInt(oSource.getBindingContext(model).getPath().split("/")[1]);
											}
											else {
												sbIndex = parseInt(oSource.getParent().mBindingInfos.visible.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
											}

											if (model === "G23Json") {
												var oModel = oView.getModel(model).oData[sbIndex];
												oModel.FILE_CONTENT = null;
												oModel.FILE_NAME = "";
												oModel.FILE_MIMETYPE = null;
												oModel.ATTACH_VALUE = null;
												oModel.EXPIRY_DATE = null;
											}
											else if (model === "G7Json") {
												var oModel = oView.getModel(model).oData[sbIndex];
												oModel.FILE_CONTENT = null;
												oModel.FILE_NAME = "";
												oModel.FILE_MIMETYPE = null;
												oModel.ATTACH_VALUE = null;
												oModel.EXPIRY_DATE = null;
											}
											else if (model === "G6Json") {
												var oModel = oView.getModel(model).oData[sbIndex];
												oModel.FILE_CONTENT = null;
												oModel.FILE_NAME = "";
												oModel.FILE_MIMETYPE = null;
												oModel.ATTACH_VALUE = null;
											}
											else {
												var oModel = oView.getModel(model).oData;
												if (oModel.length === 1) {
													oModel[0].FILE_CONTENT = null;
													oModel[0].FILE_NAME = "";
													oModel[0].FILE_MIMETYPE = null;
													oModel[0].ATTACH_VALUE = null;
													oModel[0].EXPIRY_DATE = null;
													if (model === "G24Json") {
														oModel[0].DESCRIPTION = "Other Attachment";
														var enableG24=oView.byId("S4A10F1").getItems()[context.sbIndex].getCells()[6];
														enableG24.setEnabled(false);
													} else if (model === "G4Json") {
														oModel[0].DESCRIPTION = "Other Certificate";
													} else if (model === "G3Json") {
														oModel[0].DESCRIPTION = "ISO Certificate";
													} else if (model === "G14Json") {
														oModel[0].DESCRIPTION = "TRN Certificate";
													} else if (model === "G13Json") {
														oModel[0].DESCRIPTION = "Bank Account letter";
													} else if (model === "G25Json") {
														oModel[0].DESCRIPTION = "PAN Certificate";
														var enableG25=oView.byId("S4A6F1").getItems()[context.sbIndex].getCells()[6];
														enableG25.setEnabled(false);
													} else if (model === "G26Json") {
														oModel[0].DESCRIPTION = "Disclosure Form";
														var enableG26=oView.byId("S4A7F1").getItems()[context.sbIndex].getCells()[6];
														enableG26.setEnabled(false);
													} else if (model === "G27Json") {
														oModel[0].DESCRIPTION = "GST Certificate";
														var enableG27=oView.byId("S4A8F1").getItems()[context.sbIndex].getCells()[6];
														enableG27.setEnabled(false);
													} else if (model === "G28Json") {
														oModel[0].DESCRIPTION = "License Certificate";
														var enableG28=oView.byId("S4A9F1").getItems()[context.sbIndex].getCells()[6];
														enableG28.setEnabled(false);
													}
												}
												else if (oModel.length !== 1) {
													oModel.splice(sbIndex, 1);
												}
											}
											oView.getModel(model).refresh(true);
										}
									});
								},
								error: function (error) {
									BusyIndicator.hide();
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
						// }

					}
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
						if (model === "G6Json" || model === "G7Json" || model === "G10Json" || model === "G22Json" || model === "G23Json") {
							if (!updateId.includes(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0]
								.sPath
								.split(
									"/")[1])) {
								updateId.push(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split(
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
					BusyIndicator.hide();
					//context.getView().setBusy(false);
					// 
					//context.errorLogCreation(error.responseText, error.status, oView.getModel("blankJson").getProperty("/headerData/REQUEST_NO"), oView.getModel("blankJson").getProperty("/headerData/REGISTERED_ID"), "API");
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
						if (model === "G6Json" || model === "G7Json" || model === "G10Json" || model === "G22Json" || model === "G23Json") {
							if (!updateId.includes(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0]
								.sPath
								.split(
									"/")[1])) {
								updateId.push(context.sourceData.getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split(
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
					//context.errorLogCreation(error.responseText, error.status, oView.getModel("blankJson").getProperty("/headerData/REQUEST_NO"), oView.getModel("blankJson").getProperty("/headerData/REGISTERED_ID"), "API");
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

		_deleteHanaFile: function (oModel, model, sbIndex, sInd) {

			var oEntry = {},
				updatedFields;
			oEntry.REQUEST_NO = loginData.REQUEST_NO;
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
					//

					if (model === "G5Json" || model === "G6Json" || model === "G7Json" || model === "G10Json" || model === "G22Json" || model ===
						"G23Json") {
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

					if (sInd === "D_VAT") {
						oView.getModel(model).refresh(true);
						return
					} else {

						MessageBox.success("Attachment Deleted.", {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
									oView.getModel(model).refresh(true);
								}
							}
						});
					}

				},
				error: function (error) {

					MessageBox.show("Error while Deletion.", {
						icon: MessageBox.Icon.ERROR,
						title: "ERROR"
					});
				}
			});

		},

		//Download Attachments*********************************************
		onDownload: function (oEvent) {

			var sbIndex = "",
				content = "",
				fileName = "",
				mimeType = "";

			var model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;

			if (model === "G6Json" || model === "G7Json" || model === "G10Json" || model === "G22Json" || model === "G23Json") {
				sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
			} else {
				sbIndex = parseInt(oEvent.getSource().getBindingContext(model).getPath().split("/")[1]);
			}

			var oModel = oView.getModel(model).oData[sbIndex];

			//var obj = oEvent.getSource().getBindingContext(model).getObject();

			// 
			var iDocId = oModel.OT_DOC_ID;

			// var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormCMS?$filter=" + iDocId;

			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormCMS("+ iDocId +")/$value";

			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (data, responce) {
					context.fileType(iDocId, data);
					// context.downloadFileContent('text/plain', 1,'CLAIM REQUEST PAYLOAD.txt', 'text/plain', data);
					
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
		downloadFileContent: function (iFILE_TYPE, iSR_NO, sFILE_NAME, sFILE_MIMETYPE, sFILE_CONTENT) {

			var aFilter = [],
			fileContent = null;
			// if(sFILE_MIMETYPE === "text/plain")
			// {
			// 	sFILE_CONTENT = atob(sFILE_CONTENT);
			// }
			// sFILE_CONTENT = atob(sFILE_CONTENT);
			// sFILE_CONTENT = sFILE_CONTENT;
			context.downloadAttachment(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);
		},

		_downOSTFile: function (oModel, token) {

			var file_Id = "",
				fileName = "";


			if (oModel.DRAFT_IND === null) {
				file_Id = oModel.OT_DOC_ID;
				fileName = oModel.FILE_NAME;

				context.downloadAttachment(file_Id, fileName, token);
			} else {
				context.downloadAttachmentContent(oModel.REQUEST_NO, oModel.FILE_NAME, oModel.OT_DOC_ID,
					token);
			}
		},

		downloadAttachmentContent: function (iREQUEST_NO, iSR_NO, sFILE_NAME, sFILE_MIMETYPE, sFILE_CONTENT) {

			var aFilter = [],
				fileContent = null;

			context.downloadAttachment(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);

		},

		//New Change
		onDownloadNDA: function () {

			var entityCode = new sap.ui.model.Filter("ENTITY_CODE", sap.ui.model.FilterOperator.EQ, loginData.ENTITY_CODE);
			var attachCode = new sap.ui.model.Filter("ATTACH_CODE", sap.ui.model.FilterOperator.EQ, 15);
			var ndaType = new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, loginData.NDA_TYPE);
			// if (loginData.VCODE === "SR") {
			// 	var ndaType = new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, "LU");
			// } else {
			// 	var ndaType = new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, loginData.NDA_TYPE);
			// }

			context.cloudService.read("/NdaAttachments", {
				filters: [entityCode, attachCode, ndaType],
				success: function (oData, responce) {
					// added on 11-04-2023 by Inder Chouhan	Error Message if Response is Empty
					if (oData.results.length === 0) {
						MessageBox.error("No NDA template found for : " + loginData.ENTITY_DESC);
					} else {
						oData.results[0].FILE_CONTENT = atob(oData.results[0].FILE_CONTENT);
						context.downloadNDAAttachment(oData.results[0].FILE_CONTENT, oData.results[0].FILE_NAME, oData.results[0].FILE_MIMETYPE);

					}
				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},

		downloadNDAAttachment: function (content, fileName, mimeType) {

			download("data:application/octet-stream;base64," + content, fileName, mimeType);
			var HttpRequest = new XMLHttpRequest();
			x.open("GET", "http://danml.com/wave2.gif", true);
			HttpRequest.responseType = 'blob';
			HttpRequest.onload = function (e) {
				download(HttpRequest.response, fileName, mimeType);
			}
			HttpRequest.send();
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

		radioUAEChange: function (oevt) {

			var oModel = oView.getModel("G7Json").oData[0];
			if (oevt.getSource().getSelectedButton().getProperty("text") === "Yes") {
				oModel.FLAG = "Yes";
				oView.byId("id_attachUIDTable").setVisible(true);
				oView.byId("id_attachUID2Table").setVisible(true);
			} else if (oevt.getSource().getSelectedButton().getProperty("text") === "No") {
				oModel.FLAG = "No";
				oView.byId("id_attachUIDTable").setVisible(false);
				oView.byId("id_attachUID2Table").setVisible(false);
			}
			oView.getModel("G7Json").refresh(true);

		},

		radioChange: function (oevt) {

			var sbIndex = parseInt(oevt.getSource().getParent().mAggregations.cells[2].mBindingInfos.text.binding.sPath.split(
				"/DESCRIPTION")[
				0].split("/")[1]);
			var oModel = oView.getModel("G6Json").oData[sbIndex];
			if (oevt.getSource().getSelectedButton().getProperty("text") === "Yes") {
				oModel.FLAG = "Yes";
			} else if (oevt.getSource().getSelectedButton().getProperty("text") === "No") {
				oModel.FILE_CONTENT = null;
				oModel.FILE_NAME = "";
				oModel.FILE_MIMETYPE = "";
				oModel.FLAG = "No";
			}
			oView.getModel("G6Json").refresh(true);

		},

		handleAddAttach: function (val,oEvent) {
			debugger;
			var grp, tableItems, desc, code, certi_desc;
			var arr = oView.getModel(val).oData;

			if (val === "G1Json") {
				grp = "G1";
				desc = "_CP";
				code = 1;
			} else if (val === "G2Json") {
				grp = "G2";
				desc = "_PRQA";
				code = 3;
			} else if (val === "G3Json") {
				grp = "G3";
				desc = "_ISO";
				code = 23;
				certi_desc = "ISO Certificate";
			} else if (val === "G4Json") {
				grp = "G4";
				desc = "_QC";
				code = 17;
				certi_desc = "Other Certificate";
			} else if (val === "G8Json") {
				grp = "G8";
				desc = "_PASS1";
				code = 5;
			} else if (val === "G9Json") {
				grp = "G9";
				desc = "_PASS2";
				code = 24;
			} else if (val === "G11Json") {
				grp = "G11";
				desc = "_CAT";
				code = 2;
			} else if (val === "G12Json") {
				grp = "G12";
				desc = "_POA";
				code = 4;
			} else if (val === "G13Json") {
				grp = "G13";
				desc = "_BANK";
				code = 7;
			} else if (val === "G14Json") {
				grp = "G14";
				desc = "_TRN";
				code = 12;
			} else if (val === "G15Json") {
				grp = "G15";
				desc = "_CUST";
				code = 18;
			} else if (val === "G16Json") {
				grp = "G16";
				desc = "_SUPPL";
				code = 19;
			} else if (val === "G17Json") {
				grp = "G17";
				desc = "_REF";
				code = 20;
			} else if (val === "G18Json") {
				grp = "G18";
				desc = "_POTAC";
				code = 21;
			} else if (val === "G19Json") {
				grp = "G19";
				desc = "_OEM";
				code = 22;
			} else if (val === "G20Json") {
				grp = "G20";
				desc = "_UID1";
				code = 6;
			} else if (val === "G21Json") {
				grp = "G21";
				desc = "_UID2";
				code = 25;
			} else if (val === "G22Json") {
				grp = "G22";
				desc = "_VATEVD";
				code = 27;
			} else if (val === "G23Json") {
				grp = "G23";
				desc = "_ICV";
				code = 28;
			} else if (val === "G24Json") {
				grp = "G24";
				desc = "_OA";
				code = 29;
				certi_desc = "Other Attachment";
			} else if (val === "G25Json") {
				// this.sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
				grp = "G25";
				desc = "_PAN";
				code = 31;
				certi_desc = "PAN Certificate";
			} else if (val === "G26Json") {
				grp = "G26";
				desc = "_DIS";
				code = 32;
				certi_desc = "Disclosure Form";
			} else if (val === "G27Json") {
				grp = "G27";
				desc = "_GST";
				code = 33;
				certi_desc = "GST Certificate";
			} else if (val === "G28Json") {
				grp = "G28";
				desc = "_LIC";
				code = 34;
				certi_desc = "License Certificate";
			}

			oView.getModel(val).oData.push({
				"GROUP2": grp,
				"FILE_CONTENT": null,
				"FILE_MIMETYPE": null,
				"EXPIRY_DATE": null,
				"FILE_NAME": "",
				"TYPE": "ONB",
				"DESCRIPTION": certi_desc,
				"ATTACH_SHORT_DEC": desc + "_" + Math.floor(100 + Math.random() * 900),
				"CODE": code,
				"OT_DOC_ID": null
			});
			
			oView.getModel(val).refresh(true);

			// var oModel = oView.getModel(val).oData[context.sbIndex];
			var sbIndex = oView.getModel(val).getData().length - 1;
			if(val === "G25Json"){
				var enableG25=oView.byId("S4A6F1").getItems()[sbIndex].getCells()[6];
				enableG25.setEnabled(true);
			}else if(val === "G27Json"){
				var enableG27=oView.byId("S4A8F1").getItems()[sbIndex].getCells()[6];
				enableG27.setEnabled(true);
			}else if(val === "G28Json"){
				var enableG28=oView.byId("S4A9F1").getItems()[sbIndex].getCells()[6];
				enableG28.setEnabled(true);
			}else if(val === "G26Json"){
				var enableG26=oView.byId("S4A7F1").getItems()[sbIndex].getCells()[6];
				enableG26.setEnabled(true);
			}else{
				var enableG24=oView.byId("S4A10F1").getItems()[sbIndex].getCells()[6];
				enableG24.setEnabled(true);
			}
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

			//added by Farzeen
			// if (simpleFormId === "simpleForm5" && loginData.CREATION_TYPE === 3) {
			// 	oView.byId("simpleForm5").setVisible(false);
			// }
		},

		validateSectionOneSimpleForm: function () {

			this.checkSimpleFormVisibility("simpleForm5");
			this.checkSimpleFormVisibility("simpleForm40");
			///////////////////////////////////////////////

			if (this.progressIndicatorFlag === 'X') {
				this.handleProgressIndicator(0);
			}

		},

		validateSectionThreeSimpleForm: function () {

			this.checkSimpleFormVisibility("simpleForm12");
		},

		validateSectionFourSimpleForm: function () {

			this.checkSimpleFormVisibility("simpleForm23");
			this.checkSimpleFormVisibility("simpleForm24");
			// this.checkSimpleFormVisibility("simpleForm15");
			// this.checkSimpleFormVisibility("simpleForm16");
			// this.checkSimpleFormVisibility("simpleForm17");
			// this.checkSimpleFormVisibility("simpleForm18");
			// this.checkSimpleFormVisibility("simpleForm19");
			// this.checkSimpleFormVisibility("simpleForm20");
			// this.checkSimpleFormVisibility("simpleForm33");
		},

		setTableDataEmpty: function (sectionNo, visibleModel, data) {

			if (sectionNo === 1) {
				if (visibleModel.S1G5T2F1 !== "X") data.contact = [];
			} else if (sectionNo === 2) {
				if (visibleModel.S1G5T2F1 !== "X") data.contact = [];
				// if (visibleModel.S2G2T1F1 !== "X") data.finInfo = [];
				// if (visibleModel.S2G3T1F1 !== "X") data.ownerInfo = [];
			} else if (sectionNo === 3) {
				if (visibleModel.S1G5T2F1 !== "X") data.contact = [];
				// if (visibleModel.S2G2T1F1 !== "X") data.finInfo = [];
				// if (visibleModel.S2G3T1F1 !== "X") data.ownerInfo = [];
				// if (visibleModel.S3G1T1F4 !== "X") data.productInfo = [];
				// if (visibleModel.S3G2T1F1 !== "X") data.operationalCap = [];
				// if (visibleModel.S3G4T1F1 !== "X") data.clientInfo = [];
				// if (visibleModel.S3G5T1F1 !== "X") data.OEMInfo = [];
				// if (visibleModel.S3G5T2F1 !== "X") data.NONOEMInfo = [];

			} else if (sectionNo === 4) {
				if (visibleModel.S1G5T2F1 !== "X") data.contact = [];
				// if (visibleModel.S2G2T1F1 !== "X") data.finInfo = [];
				// if (visibleModel.S2G3T1F1 !== "X") data.ownerInfo = [];
				// if (visibleModel.S3G1T1F4 !== "X") data.productInfo = [];
				// if (visibleModel.S3G2T1F1 !== "X") data.operationalCap = [];
				// if (visibleModel.S3G4T1F1 !== "X") data.clientInfo = [];
				// if (visibleModel.S3G5T1F1 !== "X") data.OEMInfo = [];
				// if (visibleModel.S3G5T2F1 !== "X") data.NONOEMInfo = [];
				// if (visibleModel.S4G11D1 !== "X") data.qualityCertificate = [];
				// if (visibleModel.S4G5D1 !== "X") data.relationName = [];
			}
		},

		_charactersValidation: function (oEvent) {

			validations._charactersValidation(oEvent);

			context.onChange(oEvent);
		},

		designationValidation: function (oEvent) {

			validations.designationValidation(oEvent);

			context.onChange(oEvent);
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
			context.onChange(oEvent); //komal
		},

		_validateHOCContactNum: function (oEvent) {

			var eventIndicator = "HOCC";
			var isContactContactExist = context.checkHOCDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, 0);
			var selectCount = this.getView().getModel("blankJson").getProperty("/MDContact");

			if (selectCount.CONTACT_TELECODE === null || selectCount.CONTACT_TELECODE === "") {
				oEvent.getSource().setValue(null);
				MessageBox.warning("Select Tele Code");
				return;
			}
			if (isContactContactExist === true) {
				oView.getModel("blankJson").setProperty("/MDContact/CONTACT_TELECODE", null);
				oView.getModel("blankJson").setProperty("/MDContact/CONTACT_NO", null);
				MessageBox.warning("Contact Number already exist");
			}
			if(selectCount.NATIONALITY === "IN"){
				var oSource = oEvent.getSource();
				var reg = /[0-9]{10}$/.test(oSource.getValue());
				if (reg === true || oSource.getValue() === "") {
					oSource.setValueState(sap.ui.core.ValueState.None);
					context.onChange(oEvent);
				} else {
					oEvent.getSource().setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter 10 digit mobile number");
				}
			}else{
				validations._validateMobileNum(oEvent);
				context.onChange(oEvent);
			}
		},

		_validateHOCMobileNum: function (oEvent) {

			var eventIndicator = "HOCM";
			var isContactMobileExist = context.checkHOCDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, 0);
			var selectCount = this.getView().getModel("blankJson").getProperty("/MDContact");
			if (selectCount.MOBILE_TELECODE === null || selectCount.MOBILE_TELECODE === "") {
				oEvent.getSource().setValue(null);
				MessageBox.warning("Select Tele Code");
				return;
			}
			if (isContactMobileExist === true) {
				oView.getModel("blankJson").setProperty("/MDContact/MOBILE_TELECODE", null);
				oView.getModel("blankJson").setProperty("/MDContact/MOBILE_NO", null);
				MessageBox.warning("Mobile Number already exist");
			}
			if(selectCount.NATIONALITY === "IN"){
				var oSource = oEvent.getSource();
				var reg = /[0-9]{10}$/.test(oSource.getValue());
				if (reg === true || oSource.getValue() === "") {
					oSource.setValueState(sap.ui.core.ValueState.None);
					context.onChange(oEvent);
				} else {
					oEvent.getSource().setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter 10 digit mobile number");
				}
			}else{
				validations._validateMobileNum(oEvent);
				context.onChange(oEvent);
			}
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

		_validateEmail: function (oEvent) {

			validations._validateEmail(oEvent);

			context.onChange(oEvent); //komal
		},

		_validateHOAEmail: function (oEvent) {

			validations._validateEmail(oEvent);
			context.onChange(oEvent);
			oView.getModel("blankJson").setProperty("/address/EMAIL", oEvent.getSource().getValue().toLowerCase().trim());
		},

		_tableValidateEmail: function (oEvent) {

			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]); //komal
			validations._validateEmail(oEvent);

			context._onTableValueChange(oEvent); //komal
			oView.getModel("blankJson").setProperty("/otherAddress/" + index + "/EMAIL", oEvent.getSource().getValue().toLowerCase().trim());

		},

		validateContactEmail: function (oEvent) {

			var eventIndicator = "E";
			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;
			oView.getModel("blankJson").setProperty("/contact/" + parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split(
				"/")[2]) + "/EMAIL", oEvent.getSource().getValue().toLowerCase().trim());
			var isEmailExist = context.checkDuplicateContacts(oEvent.getSource().getValue(), eventIndicator, index);

			if (isEmailExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().EMAIL = null;
				this.getView().getModel("blankJson").refresh(true);
				MessageBox.warning("Email Id already exist");
			}

			validations._validateEmail(oEvent);
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

		_validateMobileNum: function (oEvent) {
			var selectedCountry = this.getView().getModel("blankJson").getProperty("/address").COUNTRY;
			var selectedTeleCode = this.getView().getModel("blankJson").getProperty("/address").CONTACT_TELECODE;
			if (selectedTeleCode === null || selectedTeleCode === "") {
				oEvent.getSource().setValue(null);
				MessageBox.warning("Select Tele Code");
				return;
			}
			if(selectedCountry === "IN"){
				var oSource = oEvent.getSource();
				var reg = /[0-9]{10}$/.test(oSource.getValue());
				if (reg === true || oSource.getValue() === "") {
					oSource.setValueState(sap.ui.core.ValueState.None);
					context.onChange(oEvent);
				} else {
					oEvent.getSource().setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter 10 digit mobile number");
				}
			}else{
			validations._validateMobileNum(oEvent);
			context.onChange(oEvent); //komal
			}
		},

		_tableValidateMobileNum: function (oEvent) { //komal

			validations._validateMobileNum(oEvent);

			context._onTableValueChange(oEvent); //komal
		},

		hboxcontactNumberValidation: function (oEvent) {

			var eventInd = "C";
			var sObject = oEvent.getSource().getBindingContext("blankJson").getObject();

			if (sObject.CONTACT_TELECODE === null || sObject.CONTACT_TELECODE === "") {
				oEvent.getSource().setValue(null);
				MessageBox.warning("Select Tele Code");
				return;
			}
			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;
			var isContactNumExist = context.checkDuplicateContacts(oEvent.getSource().getValue(), eventInd, index);
			if (isContactNumExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().CONTACT_TELECODE = null;
				oEvent.getSource().getBindingContext("blankJson").getObject().CONTACT_NO = null;
				MessageBox.warning("Contact Number already exist");
			}

			if(sObject.NATIONALITY === "IN"){
				var oSource = oEvent.getSource();
				var reg = /[0-9]{10}$/.test(oSource.getValue());
				if (reg === true || oSource.getValue() === "") {
					oSource.setValueState(sap.ui.core.ValueState.None);
					context.onChange(oEvent);
				} else {
					oEvent.getSource().setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter 10 digit mobile number");
				}
			}else{
				validations._validateMobileNum(oEvent);
				context.onTableHboxValueChange(oEvent);
			}
		},

		hboxMobileNumberValidation: function (oEvent) {

			var eventInd = "M";
			var sObject = oEvent.getSource().getBindingContext("blankJson").getObject();
			if (sObject.MOBILE_TELECODE === null || sObject.MOBILE_TELECODE === "") {
				oEvent.getSource().setValue(null);
				MessageBox.warning("Select Tele Code");
				return;
			}
			
			if(sObject.MOBILE_TELECODE === "91"){
			}

			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;
			var isContactNumExist = context.checkDuplicateContacts(oEvent.getSource().getValue(), eventInd, index);
			if (isContactNumExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().MOBILE_TELECODE = null;
				oEvent.getSource().getBindingContext("blankJson").getObject().MOBILE_NO = null;
				MessageBox.warning("Mobile Number already exist");
			}
			validations._validateMobileNum(oEvent);

			context.onTableHboxValueChange(oEvent);
		},

		//new
		alphaNumaricVaidation: function (oEvent) {

			validations.alphaNumaricVaidation(oEvent);
			context.onChange(oEvent); //komal
		},

		contactPassportValidation: function (oEvent) {

			validations.alphaNumaricVaidation(oEvent);
			context._onTableValueChange(oEvent);
		},

		benificiaryNameValidation: function (oEvent) {

			validations.benificiaryNameValidation(oEvent);
			context.onChange(oEvent);
		},

		tradeLicenseValidation: function (oEvent) {

			validations.tradeLicenseValidation(oEvent);
			context.onChange(oEvent);
		},

		VATRegNumValidation: function (oEvent) {

			if (oView.getModel("blankJson").oData.address.COUNTRY === "AE") {
				validations.VATRegNumValidation(oEvent);
			}
			else if (oView.getModel("blankJson").oData.address.COUNTRY === "IN") {
				validations.TAXRegNumValidation(oEvent);
			}
			else {
				validations.OtherRegNumValidation(oEvent);
			}

			context.onChange(oEvent);
		},

		tableAlphaNumaricVaidation: function (oEvent) {

			validations.alphaNumaricVaidation(oEvent);

			context._onTableValueChange(oEvent); //komal
		},

		tableAlphanumaricSpaceValidation: function (oEvent) {

			validations.benificiaryNameValidation(oEvent);

			context._onTableValueChange(oEvent);
		},

		onBranchNameChangeOfTable: function (oEvent) {

			context._onTableValueChange(oEvent);
		},

		handleTextArea: function (oEvent) {

			var oSource = oEvent.getSource();
			if (oSource.getValue().length > 1000) {
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter comment less than 1000 characters");
			} else {
				oSource.setValueState(sap.ui.core.ValueState.None);
			}

		},

		postalCodeValidation: function (oEvent) {

			context.onChange(oEvent); //komal
			var reg1 = null;
			var headOfficeCountry = oView.getModel("blankJson").getProperty("/address");
			//check whether country is select or not 03/03/2022
			if (headOfficeCountry.COUNTRY === null || headOfficeCountry.COUNTRY === "") {
				MessageBox.information("Please Select Country");
				oEvent.getSource().setValue("");
				return;
			}
			this.readPostalCodeFormates(headOfficeCountry.COUNTRY, "checkRegex", oEvent);
		},

		contactMDPostalValidation: function (oEvent) {

			var reg1 = null;
			var MDContactDetails = oView.getModel("blankJson").getProperty("/MDContact");

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
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code eg: " + oView.getModel(
					"localModel")
					.getProperty("/pcode_MDformat"));
				return;
			}

			context.onChange(oEvent);
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

			this.readPostalCodeFormates(sObject.COUNTRY, "R");

			jQuery.sap.delayedCall(700, this, function () {
				var reg = oView.getModel("localModel").getProperty("/regex_OTH").test(oSource.getValue());
				if (reg === true || oSource.getValue() === "") {
					oSource.setValueState(sap.ui.core.ValueState.None);
				} else {
					oSource.setValue("");
					oSource.setValueState(sap.ui.core.ValueState.Error).
						setValueStateText("Enter valid postal code eg: " + oView.getModel("localModel").getProperty("/pcode_OTHformat"));
					return;
				}
			});
			//	context.readPostalCodeLength(sObject.COUNTRY, "R");

			// jQuery.sap.delayedCall(700, this, function () {
			// 	//var reg = /^[0-9 -]+$/.test(oSource.getValue());
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

			// 	} else if (registerPincode === 0) {
			// 		if (oSource.getValue().length > 10) {
			// 			oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code");
			// 			oSource.setValue("");
			// 		} else {
			// 			oSource.setValueState(sap.ui.core.ValueState.None);
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

			this.readPostalCodeFormates(sObject.NATIONALITY, "CR");

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

			context._onTableValueChange(oEvent);
		},

		_IBANValidation: function (oEvent) {

			validations._IBANValidation(oEvent);

			context.onChange(oEvent); //komal
		},

		_SWIFTCodeValidation: function (oEvent) {

			validations._SWIFTCodeValidation(oEvent);

			context.onChange(oEvent); //komal
		},

		_BICCodeValidation: function (oEvent) {

			validations._BICCodeValidation(oEvent);

			context.onChange(oEvent);
		},

		_numberValidation: function (oEvent) {

			validations._numberValidation(oEvent);

			context.onChange(oEvent); //komal
		},

		_mainBankAccNumValidation: function (oEvent) {

			var eventAccInd = "MA";
			var isMainBankAccNumExist = this.findDuplicateMainBankDetails(oEvent.getSource().getValue(), 0, eventAccInd);

			if (isMainBankAccNumExist === true) {
				oView.getModel("blankJson").setProperty("/bankDetails/ACCOUNT_NO", null);
				MessageBox.warning("Account Number already exist");
			}

			validations._numberValidation(oEvent);
			context.onChange(oEvent);
		},

		_mainBankIBANValidation: function (oEvent) {

			var eventIBANInd = "MIBAN";
			var isMainBankIBANNumExist = this.findDuplicateMainBankDetails(oEvent.getSource().getValue(), 0, eventIBANInd);

			if (isMainBankIBANNumExist === true) {
				oView.getModel("blankJson").setProperty("/bankDetails/IBAN_NUMBER", null);
				MessageBox.warning("IBAN Number already exist");
			}

			validations._IBANValidation(oEvent);
			context.onChange(oEvent);
		},

		findDuplicateMainBankDetails: function (sValue, iIndex, sIndicator) {

			var isMainBankDataExist = null;
			var otherBankData = oView.getModel("blankJson").getProperty("/otherBankDetails");

			if (sIndicator === "MA") {
				isMainBankDataExist = otherBankData.some(function (obj) {
					return obj.ACCOUNT_NO === sValue;
				});
			} else if (sIndicator === "MIBAN") {
				isMainBankDataExist = otherBankData.some(function (obj) {
					return obj.IBAN_NUMBER === sValue;
				});
			}

			return isMainBankDataExist;
		},

		_tableNumberValidation: function (oEvent) {

			validations._numberValidation(oEvent);

			context._onTableValueChange(oEvent);

		},

		_mNewTableNumberValidation: function (oEvent) {

			validations._numberValidation(oEvent);

			context._mTableValueChange(oEvent);

		},

		tableIBANValidation: function (oEvent) {

			var eventInd = "IB";
			validations._IBANValidation(oEvent);
			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;
			var isBankDataExist = this.findDuplicateBankDetails(oEvent.getSource().getValue(), index, eventInd);

			if (isBankDataExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().IBAN_NUMBER = null;
				MessageBox.warning("IBAN Number already exist");
			}
			context._onTableValueChange(oEvent);
		},

		checkDuplicateAccountNo: function (oEvent) {

			var eventInd = "A";
			var index = parseInt(oEvent.getSource().getBindingContext("blankJson").getPath().split("/")[2]) + 1;
			var isBankDataExist = this.findDuplicateBankDetails(oEvent.getSource().getValue(), index, eventInd);

			if (isBankDataExist === true) {
				oEvent.getSource().getBindingContext("blankJson").getObject().ACCOUNT_NO = null;
				MessageBox.warning("Account Number already exist");
			}

			validations._numberValidation(oEvent);
			context._onTableValueChange(oEvent);
		},

		findDuplicateBankDetails: function (sValue, iIndex, sInd) {

			var isBankExist = null;
			var b1Data = [].concat(oView.getModel("blankJson").getProperty("/bankDetails"), oView.getModel("blankJson").getProperty(
				"/otherBankDetails"));
			if (sInd === "A") {
				isBankExist = b1Data.some(function (obj, currentIndex) {
					if (currentIndex !== iIndex) {
						return obj.ACCOUNT_NO === sValue;
					}
				});
			} else if (sInd === "IB") {
				isBankExist = b1Data.some(function (obj, currentIndex) {
					if (currentIndex !== iIndex) {
						return obj.IBAN_NUMBER === sValue;
					}
				});
			}
			return isBankExist;
		},

		_mTableNumberValidation: function (oEvent) { //komal

			validations._numberValidation(oEvent);

			context._oNmTableValueChange(oEvent); //komal

		},

		dateFormation: function (date) {

			var value = new Date(date);
			return value;
		},

		onBack: function () {

			var userAttributes = this.getOwnerComponent().getModel("userAttriJson").getData();
			if (Object.keys(userAttributes).length > 0 && Object.keys(userAttributes).includes("mail") === true) {
				this._setBlankJsonModel(this._getBlankObject());

				context.wizar.discardProgress(this.byId("wStep1_Id"));
				oView.byId("nBtn1").setVisible(true);
				oView.byId("nBtn2").setVisible(true);
				// oView.byId("nBtn3").setVisible(true);
				// oView.byId("nBtn4").setVisible(true);
				oView.byId("nBtn5").setVisible(true);
				oView.byId("submit_Id").setVisible(false);
				oRouter.navTo("displayForm", true);
				//BusyIndicator.show();

			} else if (loginData.DIST_CODE === "SR") {
				this._setBlankJsonModel(this._getBlankObject());

				context.wizar.discardProgress(this.byId("wStep1_Id"));
				oView.byId("nBtn1").setVisible(true);
				oView.byId("nBtn2").setVisible(true);
				// oView.byId("nBtn3").setVisible(true);
				// oView.byId("nBtn4").setVisible(true);
				oView.byId("nBtn5").setVisible(true);
				oView.byId("submit_Id").setVisible(false);
				oRouter.navTo("preRegistration", true);

			} else {

				this._setBlankJsonModel(this._getBlankObject());
				context.wizar.discardProgress(this.byId("wStep1_Id"));
				oView.byId("nBtn1").setVisible(true);
				oView.byId("nBtn2").setVisible(true);
				// oView.byId("nBtn3").setVisible(true);
				// oView.byId("nBtn4").setVisible(true);
				//oView.byId("nBtn5").setVisible(true);
				oView.byId("submit_Id").setVisible(false);
				oRouter.navTo("RouteLoginPage", true);

			}

		},

		onChange: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, val;
				if (oEvent.getId() === "change") {
					model = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1];
					property = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[2];
					val = oEvent.getSource().getValue();
				} else if (oEvent.getId() === "selectionChange") {
					model = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath.split("/")[1];
					property = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath.split("/")[2];
					val = oEvent.getSource().getSelectedKey();
				} else if (oEvent.getId() === "selectionFinish") {
					model = oEvent.getSource().mBindingInfos.selectedKeys.binding.sPath.split("/")[1];
					property = oEvent.getSource().mBindingInfos.selectedKeys.binding.sPath.split("/")[2];
					val = oEvent.getSource().getSelectedKeys();
				}

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				if (headData[property] !== val) {
					if (!updateId.includes(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1])) {
						updateId.push(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
		},

		onDateChange: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property;
				model = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1];
				property = oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[2];
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-ddTHH:mm:ss"
				});
				if (headData[property] !== dateFormat.format(oEvent.getSource().getDateValue()) + ".000Z") {
					if (!updateId.includes(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1])) {
						updateId.push(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().mBindingInfos.visible.parts[0].path.split("/")[1]);
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
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
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
		},

		handleExpiryDate: function (oEvent) {

			var selectedDate = oEvent.getSource().getDateValue();
			var currentDate = new Date();

		},

		//Ui table change functions

		_tableCharactersValidation: function (oEvent) {

			context._onTableValueChange(oEvent);
			validations._charactersValidation(oEvent);
		},

		_mTableCharactersValidation: function (oEvent) {

			context._mTableValueChange(oEvent);
			validations._charactersValidation(oEvent);
		},

		_doubleDecimalValidation: function (oEvent) {

			var oSource = oEvent.getSource();
			var reg = /\d+\.\d{2}$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oEvent.getSource().setValue(Number(oSource.getValue()));
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter double decimal value");
			}

			context._mTableValueChange(oEvent);
		},

		_tableDesignationValidation: function (oEvent) {

			context._onTableValueChange(oEvent);
			validations.designationValidation(oEvent);
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
			validations._charactersValidation(oEvent);
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

				var oArray = [];
				for (var i = 0; i < oEvent.getSource().oParent.oParent.mAggregations.columns.length; i++) {
					if (oEvent.getSource().oParent.oParent.mAggregations.columns[i].mBindingInfos.visible.binding.aValues[0] === "X") {
						oArray.push(oEvent.getSource().oParent.oParent.mAggregations.columns[i]);
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
				var id = oArray[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];
				if (headData[dataIndex][property] !== val) {
					if (!updateId.includes(id)) {
						updateId.push(id);
					}
				} else {
					var index = updateId.indexOf(id);
					updateId.splice(index, 1);
				}
			}
		},

		_mTableValueChange: function (oEvent) {

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

				var oArray = [];
				for (var i = 0; i < oEvent.getSource().oParent.oParent.mAggregations.columns.length; i++) {
					if (oEvent.getSource().oParent.oParent.mAggregations.columns[i].mBindingInfos.visible.binding.aValues[0] === "X") {
						oArray.push(oEvent.getSource().oParent.oParent.mAggregations.columns[i]);
					}
				}

				if (oEvent.getId() === "change") {
					model = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[1];
					dataIndex = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[2]);
					property = oEvent.getSource().mBindingInfos.value.binding.sPath;
					val = oEvent.getSource().getValue();
				}

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var id = oArray[index].mAggregations.header.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];
				if (headData[dataIndex][property] !== val) {
					if (!updateId.includes(id)) {
						updateId.push(id);
					}
				} else {
					var index = updateId.indexOf(id);
					updateId.splice(index, 1);
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

				var oArray = [];
				for (var i = 0; i < oEvent.getSource().oParent.oParent.mAggregations.columns.length; i++) {
					if (oEvent.getSource().oParent.oParent.mAggregations.columns[i].mBindingInfos.visible.binding.aValues[0] === "X") {
						oArray.push(oEvent.getSource().oParent.oParent.mAggregations.columns[i]);
					}
				}

				model = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[1];
				dataIndex = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[2]);
				property = oEvent.getSource().mBindingInfos.value.binding.sPath;
				//	val = oEvent.getSource().getValue();

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				//context.id = oEvent.getSource().oParent.oParent.mAggregations.columns[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];
				context.id = oArray[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];
				context.valueHelpOldValue = headData[dataIndex][property];
			}
		},

		_onTableValueHelpChange2: function (oEvent) {

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

				var oArray = [];
				for (var i = 0; i < oEvent.getSource().oParent.oParent.mAggregations.columns.length; i++) {
					if (oEvent.getSource().oParent.oParent.mAggregations.columns[i].mBindingInfos.visible.binding.aValues[0] === "X") {
						oArray.push(oEvent.getSource().oParent.oParent.mAggregations.columns[i]);
					}
				}

				model = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[1];
				dataIndex = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[2]);
				property = oEvent.getSource().mBindingInfos.value.binding.sPath;
				//	val = oEvent.getSource().getValue();

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				//context.id = oEvent.getSource().oParent.oParent.mAggregations.columns[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];
				context.id = oArray[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];
				context.valueHelpOldValue2 = headData[dataIndex][property];
			}
		},

		_onTableValueHelpChange3: function (oEvent) {

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

				var oArray = [];
				for (var i = 0; i < oEvent.getSource().oParent.oParent.mAggregations.columns.length; i++) {
					if (oEvent.getSource().oParent.oParent.mAggregations.columns[i].mBindingInfos.visible.binding.aValues[0] === "X") {
						oArray.push(oEvent.getSource().oParent.oParent.mAggregations.columns[i]);
					}
				}

				model = oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[1];
				dataIndex = parseInt(oEvent.getSource().mBindingInfos.value.binding.oContext.sPath.split("/")[2]);
				property = oEvent.getSource().mBindingInfos.value.binding.sPath;
				//	val = oEvent.getSource().getValue();

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				//context.id = oEvent.getSource().oParent.oParent.mAggregations.columns[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];
				context.id = oArray[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];
				context.valueHelpOldValue3 = headData[dataIndex][property];

			}
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

				var oArray = [];
				for (var i = 0; i < oEvent.getSource().oParent.oParent.oParent.mAggregations.columns.length; i++) {
					if (oEvent.getSource().oParent.oParent.oParent.mAggregations.columns[i].mBindingInfos.visible.binding.aValues[0] === "X") {
						oArray.push(oEvent.getSource().oParent.oParent.oParent.mAggregations.columns[i]);
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

				var id = oArray[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];

				if (headData[dataIndex][property] !== val) {
					if (!updateId.includes(id)) {
						updateId.push(id);
					}
				} else {
					var index = updateId.indexOf(id);
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
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

				var oArray = [];
				for (var i = 0; i < oEvent.getSource().oParent.oParent.oParent.mAggregations.columns.length; i++) {
					if (oEvent.getSource().oParent.oParent.oParent.mAggregations.columns[i].mBindingInfos.visible.binding.aValues[0] === "X") {
						oArray.push(oEvent.getSource().oParent.oParent.oParent.mAggregations.columns[i]);
					}
				}

				// if (oEvent.getSource().oParent.oParent.mAggregations.columns === undefined && totalcell.length === 8) {
				// 	for (var i = 0; i < oEvent.getSource().oParent.oParent.oParent.mAggregations.columns.length; i++) {
				// 		var a = oEvent.getSource().oParent.oParent.oParent.mAggregations.columns[i].sId;
				// 		var b = a.split("__column")[1];
				// 		if (sId.includes(b)) {
				// 			index = i;
				// 			break;
				// 		}
				// 	}
				// }

				if (oEvent.getId() === "selectionChange") {
					model = oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split("/")[1];
					dataIndex = parseInt(oEvent.getSource().mBindingInfos.selectedKey.binding.oContext.sPath.split("/")[2]);
					property = oEvent.getSource().mBindingInfos.selectedKey.binding.sPath;
					val = oEvent.getSource().getSelectedKey();
				}

				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var id = oArray[index].mAggregations.label.mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1];

				if (headData[dataIndex][property] !== val) {
					if (!updateId.includes(id)) {
						updateId.push(id);
					}
				} else {
					var index = updateId.indexOf(id);
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
		},

		_onTableRadioBtnChange: function (oEvent) {

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, index = null,
					dataIndex = null;
				var totalcell = oEvent.getSource().oParent.mAggregations.cells;
				var sId = oEvent.getSource().getId();
				for (var i = 0; i < totalcell.length; i++) {
					if (sId === totalcell[i].sId) {
						index = i;
						break;
					}
				}
				model = oEvent.getSource().mBindingInfos.selectedIndex.binding.oContext.sPath.split("/")[1];
				dataIndex = parseInt(oEvent.getSource().mBindingInfos.selectedIndex.binding.oContext.sPath.split("/")[2]);
				property = oEvent.getSource().mBindingInfos.selectedIndex.binding.sPath;
				var headData = oView.getModel("originalJson").getProperty("/" + model);
				var id = oEvent.getSource().oParent.oParent.mAggregations.columns[index].mAggregations.label.mBindingInfos.required.binding.aBindings[
					0]
					.sPath.split("/")[1];
				if (headData[dataIndex][property] !== oEvent.getSource().getSelectedButton().getText()) {
					if (!updateId.includes(id)) {
						updateId.push(id);
					}
				} else {
					var index = updateId.indexOf(id);
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
		},

		// M Table change function
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
					//delete updateId[index];
					updateId.splice(index, 1);
				}
			}
		},

		onAttachDateChange: function (oEvent) {

			var index = parseInt(oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1]);
			if (index === 0) {
				var tDate = oEvent.getSource().getDateValue().getTime() + 86400000;
				oView.getModel("blankJson").setProperty("/headerData/TRADE_LIC_NO_DATE", new Date(tDate));
				oView.getModel("blankJson").refresh(true);
			}

			if (loginData.REQUEST_TYPE === 5) {
				var model, property, sbIndex;

				sbIndex = parseInt(oEvent.getSource().mBindingInfos.value.binding.sPath.split("/")[1]);
				var headData = oView.getModel("G7Json").oData[sbIndex];
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				var data = oView.getModel("G7OldJson").oData[sbIndex];
				if (dateFormat.format(headData.EXPIRY_DATE) !== data.EXPIRY_DATE) {
					if (!updateId.includes(oEvent.getSource().getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1])) {
						updateId.push(oEvent.getSource().getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1]);
					}
				} else {
					var index = updateId.indexOf(oEvent.getSource().getParent().mAggregations.cells[0].mBindingInfos.required.binding.aBindings[0].sPath.split("/")[1]);
					updateId.splice(index, 1);
				}
			}
		},

		onSinceDateChange: function (oEvent) {

		},

		//20/21
		handleSecondaryEmails: function (oEvent) {

			var oSource = oEvent.getSource();
			var reg = /^[\.a-zA-Z0-9 @; ]*$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
			}
		},

		readComments: function (registerNo) {
			var registeFilter = "(REQUEST_NO eq " + registerNo + ")";
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegEventsLog?$filter=" + registeFilter;

			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (oData, response) {

					if (oData.value.length > 0) {
						oView.byId("sbMsgId").setVisible(true);
						var index = oData.value.length - 1;
						oView.byId("sbMsgId").setText("Reason for sendback: " + oData.value[parseInt(index)].COMMENT);
					} else {
						console.log("Error While Reading RegEventsLog Entity")
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

		//21/21
		handleTokenUpdate: function (oEvent) {

			var oMultiInput1 = oView.byId("multiInput1");
			var oSource = oEvent.getSource();
			var reg =
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid email address");
				return;
			}

			var fnValidator = function (args) {
				var text = args.text;

				return new Token({
					key: text,
					text: text
				});
			};

			oMultiInput1.addValidator(fnValidator);

		},

		//Open Server Text 
		getToken: function (oModel, blobData, model, value) {

			//
			var credentials = oView.getModel("openTextJson").getData();
			var form = new FormData();
			form.append("username", credentials.USERNAME);
			form.append("password", credentials.PASSWORD);
			// $.ajax({
			// 	url: "/OpenText/otcs/cs.exe/api/v1/auth",
			// 	type: 'POST',
			// 	processData: false,
			// 	mimeType: "multipart/form-data",
			// 	contentType: false,
			// 	data: form,
			// 	async: false,
			// 	success: function (response) {

			// 		if (value === "U") {
			// 			context._postOSTFile(oModel, blobData, model, response);
			// 		} else if (value === "F") {
			// 			context.createFolder(response);
			// 		} else if (value === "DEL") {
			// 			//context._deleteOSTFile(oModel, blobData, model, response);
			// 			if (loginData.REQUEST_TYPE === 1 || loginData.REQUEST_TYPE === 2 || loginData.REQUEST_TYPE === 3 || (loginData.REQUEST_TYPE ===
			// 				5 && oModel.UPDATE_FLAG === "X")) {
			// 				context._deleteOSTFile(oModel, blobData, model, response);
			// 			} else {
			// 				context._moveFileToOldFolder(oModel, blobData, model, response);
			// 			}
			// 		} else if (value === "DOWN") {
			// 			context._downOSTFile(oModel, response);
			// 		}

			// 	},
			// 	error: function (error) {
			// 		//	
			// 		
			// 		context.errorLogCreation(error.responseText, error.status, oView.getModel("blankJson").getProperty("/headerData/REQUEST_NO"),
			// 			oView.getModel("blankJson").getProperty("/headerData/REGISTERED_ID"), "API");
			// 		var oXMLMsg, oXML;
			// 		if (context.isValidJsonString(error.responseText)) {
			// 			oXML = JSON.parse(error.responseText);
			// 			oXMLMsg = oXML.error["message"].value;
			// 		} else {
			// 			oXMLMsg = error.responseText
			// 		}

			// 		MessageBox.error(oXMLMsg);
			// 	}
			// });
		},

		createFolder: function (token) {

			//	
			var credentials = oView.getModel("openTextJson").getData();
			var form = new FormData();
			form.append("type", 0);
			form.append("parent_id", parseInt(credentials.ADD_INFO1, 10));
			form.append("name", loginData.IDEAL_DIST_CODE);

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

					//	
					oView.getModel("blankJson").setProperty("/headerData/OT_PARENT_ID", JSON.parse(response).id);
					context.createSubFolder(JSON.parse(response).id, "Active Attachments", token);
					context.createSubFolder(JSON.parse(response).id, "Deactive Attachments", token);
					//	context.createSubFolder(JSON.parse(response).id, "Rejected Attachments", token);

				},
				error: function (error) {
					BusyIndicator.hide();
					//context.errorLogCreation(error.responseText, error.status, oView.getModel("blankJson").getProperty("/headerData/REQUEST_NO"), oView.getModel("blankJson").getProperty("/headerData/REGISTERED_ID"), "API");
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
					} else if (folderName === "Deactive Attachments") {
						oView.getModel("blankJson").setProperty("/headerData/OT_FOLDER2_ID", JSON.parse(response).id);
					} else {
						oView.getModel("blankJson").setProperty("/headerData/OT_FOLDER3_ID", JSON.parse(response).id);
					}

				},
				error: function (error) {


					//context.errorLogCreation(error.responseText, error.status, oView.getModel("blankJson").getProperty("/headerData/REQUEST_NO"), oView.getModel("blankJson").getProperty("/headerData/REGISTERED_ID"), "API");
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

		readCitySet: function (regionKey, indicator) {

			var that = this;

			var rFilter = new sap.ui.model.Filter("Regio", sap.ui.model.FilterOperator.EQ, regionKey);
			context.oDataModel.read("/GetCitySet", {
				filters: [rFilter],
				success: function (oData, responce) {

					if (indicator === "H") {
						var CityJson = new JSONModel();
						CityJson.setData(oData);
						CityJson.setSizeLimit(oData.results.length);
						that.getView().setModel(CityJson, "CityJson");
					} else {
						var CityJson1 = new JSONModel();
						CityJson1.setData(oData);
						CityJson1.setSizeLimit(oData.results.length);
						that.getView().setModel(CityJson1, "CityJson1");
					}
					//	
				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		},

		handleCitySearch: function (oEvent) {

			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("Bezei", sap.ui.model.FilterOperator.Contains, sQuery),
				new sap.ui.model.Filter("Cityc", sap.ui.model.FilterOperator.Contains, sQuery)
				];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}
			var oList = sap.ui.getCore().byId("city_listId");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		closeCityDialog: function () {
			this.cityDialog.close();
		},

		handleRACity: function (oEvent) {

			var index = parseInt(context.selectedCityObject.getBindingContext("blankJson").getPath().split("/")[2]);
			var cityCode = oEvent.getSource().getSelectedItem().getBindingContext("CityJson1").getObject().Cityc;
			var cityDesc = oEvent.getSource().getSelectedItem().getBindingContext("CityJson1").getObject().Bezei;
			this.getView().getModel("blankJson").getProperty("/otherAddress")[index].CITY = cityCode;
			this.getView().getModel("blankJson").getProperty("/otherAddress")[index].CITY_DESC = cityDesc;
			//	context.selectedObject.setValue(regionDesc);
			oView.getModel("blankJson").refresh(true);
			sap.ui.getCore().byId("citySrchId").setValue("");
			this.cityDialog.close();

			//get updated id

			if (loginData.REQUEST_TYPE === 5) {
				if (context.valueHelpOldValue !== cityDesc) {
					if (!updateId.includes(context.id)) {
						updateId.push(context.id);
					}
				} else {
					var index1 = updateId.indexOf(context.id);
					//delete updateId[index1];
					updateId.splice(index1, 1);
				}
			}
		},

		readContactCitySet: function (countryKey, indicator) {

			var that = this;

			var cFilter = new sap.ui.model.Filter("Land1", sap.ui.model.FilterOperator.EQ, countryKey);
			context.oDataModel.read("/GetCitySet", {
				filters: [cFilter],
				success: function (oData, responce) {

					if (indicator === "H") {
						var contactCityJson = new JSONModel();
						contactCityJson.setData(oData);
						contactCityJson.setSizeLimit(oData.results.length);
						that.getView().setModel(contactCityJson, "contactCityJson");
					} else {
						var contactCityJson1 = new JSONModel();
						contactCityJson1.setData(oData);
						contactCityJson1.setSizeLimit(oData.results.length);
						that.getView().setModel(contactCityJson1, "contactCityJson1");
					}
				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
					if (context.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"].value;
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
		}

	});

});
