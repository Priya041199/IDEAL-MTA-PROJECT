sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"com/ibs/ibsappidealregistrationform/model/down",
	"sap/m/Token",
	"com/ibs/ibsappidealregistrationform/model/formatter",
	"sap/ui/core/BusyIndicator"

], function (BaseController, JSONModel, MessageToast, Filter, FilterOperator, MessageBox, History, down, Token, formatter,
	BusyIndicator) {
	"use strict";
	var data;
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
	var myJSONModel7;
	var myJSONModel8;
	var myJSONModel9;
	var myJSONModel10;
	var myJSONModel11, myJSONModel12, myJSONModel13, tradelicModel, suppNameModel, vatNoModel, localModel, myJSONModelToken;
	var LogDetailModel, IbanPRIModel, IbanOTHModel;

	return BaseController.extend("com.ibs.ibsappidealregistrationform.controller.displayForm", {
		formatter: formatter,

		onInit: function () {
			context = this;
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);

			var userAttributes = this.getOwnerComponent().getModel("userAttriJson").getData();
			context.UserId = userAttributes.userId;

			oView = this.getView();
			oModel = context.getOwnerComponent().getModel();
			context.oDataModel = context.getOwnerComponent().getModel("onPremiseModel");

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

			BusyIndicator.hide();
			var oRouter = this.getOwnerComponent().getRouter();
			var getRoute = oRouter.getRoute("displayForm");
			getRoute.attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			BusyIndicator.hide();
			if (context.getOwnerComponent().getModel("loginData") === undefined) {
				oRouter.navTo("RouteLoginPage", true);
				return;
			}
			var loginData = context.getOwnerComponent().getModel("loginData").getData();
			requestNo = loginData.REQUEST_NO;

			this.onMainContent(true);

			oViewModel = context.getView().getModel("loginData");
			context.getClientInfo();

			if(loginData.STATUS === 11){
				this.getView().byId("edit").setVisible(true);
			}else{
				this.getView().byId("edit").setVisible(false);
			}

			if (oViewModel !== undefined) {
				var NavModel = new JSONModel();
				NavModel.setData(oViewModel.getData());
				context.getView().setModel(NavModel, "navData");
			}
			this._readTimelineData();

			var oDraft = context.readDraft(loginData.REQUEST_NO, loginData.ENTITY_CODE, loginData.CREATION_TYPE);

			oDraft.then(function (oDataData) {

				if (oDataData !== null) {
					context._getUserId();
				}
			});
		},

		readDraft: function (ReqNo, ReqEntity, CreateType) {

			oView.setBusy(true);
			var oDeferred = new jQuery.Deferred();
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/GetDraftData(requestNo=" + ReqNo + ",entityCode='" + ReqEntity + "',creationType=" + CreateType + ",userId='" + context.UserId + "',userRole='DISTRIBUTOR')";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (oData, response) {

					oView.setBusy(false);
					var olabelJson = new JSONModel();
					olabelJson.setData(oData.value[0].LABELS[0]);
					oView.setModel(olabelJson, "labelJson");

					oDeferred.resolve(oData);
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

					oDeferred.reject(oXMLMsg);
				}
			});
			return oDeferred.promise();
		},

		_getUserId: function () {
			var that = this;
			var getUserData = context.getOwnerComponent().getModel("userAttriJson").getData();

			that._sUserID = getUserData.userId;
			that._sUserName = getUserData.userName;

			this._readData(requestNo);
			this._readLogDetails();
			this._attachTable();
			// this._qualityCert();

			localModel = new JSONModel();
			var tradeObj = {
				MsgStrip1: false,
				MsgStrip2: false,
				MsgStrip3: false,
				Notificationlist: false
			};
			localModel.setData(tradeObj);
			context.getView().setModel(localModel, "localModel");

			//load a section 1 by default
			context.getView().byId("ObjectPageLayout").setSelectedSection(context.getView().byId("firstSection"));
		},

		getClientInfo: function () {
			var that = this;
			BusyIndicator.show();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterClientInfo";
			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					BusyIndicator.hide();
					oView.setBusy(false);
					that.clientInfo = oData.value[0];
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
		//Navigate to service not found page 
		_navtoNotFoundPage: function (value, status) {
			var navObj = {
				"STATUS": status
			};

			var oViewModel1 = new sap.ui.model.json.JSONModel(navObj);
			context.getOwnerComponent().setModel(oViewModel1, "viewStatus");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(context);
			oRouter.navTo("NotFound", {
				OBRNO: value
			});
		},

		postAjaxs: function (url, type, data, model, ApprovalType) {
			BusyIndicator.show();
			var that = this;
			$.ajax({
				url: url,
				type: type,
				contentType: 'application/json',
				data: data,
				success: function (data, response) {
					BusyIndicator.hide();
					if (model === null) {
						if (ApprovalType === "SubmitApproval") {
							if (myJSONModel.getData().results[0].APPROVER_LEVEL === 2) {
								that._updateFolder(data.Message);
							}
						}
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
		//Read supplier Data
		_readData: function (oFilters) {

			if (oFilters === undefined) {
				var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo(" + requestNo + ")";
			}
			else {
				var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo(" + oFilters + ")";
			}

			var data = {
				$expand: 'TO_ATTACHMENTS,TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY,TO_REGION,TO_ADDR_TYPE),TO_CONTACTS($expand=TO_COUNTRY,TO_REGION),TO_STATUS,TO_BANKS($expand=TO_COUNTRY),TO_MANDATORY_FIELDS,TO_UPDATED_FIELDS,TO_VISIBLE_FIELDS,TO_ATTACH_FIELDS,TO_CUSTOMERS,TO_BANKING_DETAILS,TO_BUSINESS_HISTORY,TO_PROMOTERS'
			};
			this._getodata(url, 'GET', data, "vendorDetails")
		},
		_getodata: function (url, type, data, model) {
			myJSONModel = new JSONModel();

			BusyIndicator.show();
			$.ajax({
				url: url,
				type: type,
				contentType: 'application/json',
				data: data,
				success: function (Data) {
					
					BusyIndicator.hide();

					if (oViewModel === undefined) {
						var NavModel = new JSONModel();
						NavModel.setData(Data);
						context.getView().setModel(NavModel, "navData");
					}

					if (Data.REQUEST_TYPE !== 5) {
						Data.TO_UPDATED_FIELDS = [];
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
						//context.getView().byId("sendbackBt").setVisible(false);
					}
					if (myJSONModel.getData().DIST_CODE === "" || myJSONModel.DIST_CODE === null) {
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
					var sAddrType = null;
					if (RegAddLen > 0) {

						if (Data.TO_ADDRESS[0].COUNTRY === context.clientInfo.CLIENT_COUNTRY) {
							context.OG_BP_TYPE_CODE = Data.BP_TYPE_CODE;
							Data.BP_TYPE_CODE = "B";
						} else {
							context.OG_BP_TYPE_CODE = Data.BP_TYPE_CODE;
							Data.BP_TYPE_CODE = "";
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
										"COUNTRY": Data.TO_ADDRESS[i].TO_COUNTRY.LANDX,
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
								if (Data.TO_ADDRESS[i].TO_ADDR_TYPE != null) {
									sAddrType = Data.TO_ADDRESS[i].TO_ADDR_TYPE.DESC || "";
								}
								var obj = {
									"ADDRESS_TYPE": Data.TO_ADDRESS[i].ADDRESS_TYPE,
									"ADDRESS_DESC": Data.TO_ADDRESS[i].ADDRESS_DESC,
									"ADDR_TYPE": sAddrType,
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

					var email2 = Data.SECONDARY_EMAILS_ID;
					if (email2 !== "" && email2 !== null && email2 !== undefined) {
						var secondaryEmails = email2.split(";");
						var oMultiInput1 = context.getView().byId("multiInput1");
						var tokensArr = [];
						for (var a = 0; a < secondaryEmails.length; a++) {
							var token = new Token({
								text: secondaryEmails[a],
								key: secondaryEmails[a]
							});
							tokensArr.push(token);
						}
						oMultiInput1.setTokens(tokensArr);
					} else {
						context.getView().byId("multiInput1").setTokens([new Token({
							text: "NA",
							key: "NA"
						})]);
					}

					var addLen = AddressObj.results.length;
					context.getView().byId("trAddId").setVisibleRowCount(addLen);

					var contactLen = Data.TO_CONTACTS.length;
					var contArr = [];
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
								"STATE": state,
								"POSTAL_CODE": Data.TO_CONTACTS[i].POSTAL_CODE
							};
							contArr.push(objAUTH);
						}
					}
					var contArryObj = {
						"results": contArr
					};
					myJSONModel4 = new JSONModel();
					myJSONModel4.setData(contArryObj);
					context.getView().setModel(myJSONModel4, "authDetails");

					var contLen = contArryObj.results.length;
					context.getView().byId("table_contactId").setVisibleRowCount(contLen);

					if (Data.TO_VISIBLE_FIELDS.S1G4T1F10 === 'X') {
						context.getView().byId("contactSubSectionTitle_Id").setTitle("Primary Contact");
						context.getView().byId("contactTable_Id").setText("Other Contacts");
					} else {
						context.getView().byId("contactSubSectionTitle_Id").setTitle("Contacts");
						context.getView().byId("contactTable_Id").setText("");
					}

					var bankDetailsLen = Data.TO_BANKS.length;
					var bankArr = [];
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
						context.getView().byId("bankTableId").setVisible(false);
					} else {
						context.getView().byId("bankTableId").setVisible(true);
						context.getView().byId("bankTableId").setVisibleRowCount(otherBankLen);
					}

					var bankingDetailsLen = Data.TO_BANKING_DETAILS.length;
					if (bankingDetailsLen > 0) {
						for (i = 0; i < bankingDetailsLen; i++) {
							var objBankingDetails = {
								results: [{
									"NAME": Data.TO_BANKING_DETAILS[i].NAME,
									"BRANCH_NAME": Data.TO_BANKING_DETAILS[i].BRANCH_NAME,
									"FACILTY": Data.TO_BANKING_DETAILS[i].FACILTY,
									"AMOUNT_LIMIT": Data.TO_BANKING_DETAILS[i].AMOUNT_LIMIT,
									"ASSO_SINCE": Data.TO_BANKING_DETAILS[i].ASSO_SINCE
								}]
							};
							myJSONModel7 = new JSONModel();
							myJSONModel7.setData(objBankingDetails);
							context.getView().setModel(myJSONModel7, "BankingDetailsModel");
						}
					}
					else {
						var objBankingDetails = {
							results: []
						};
						myJSONModel7 = new JSONModel();
						myJSONModel7.setData(objBankingDetails);
						context.getView().setModel(myJSONModel7, "BankingDetailsModel");
					}
				
					if (Data.BP_TYPE_CODE === "B") {
						oView.byId("S1G6T1F4_lbl").setRequired(true);
						oView.byId("S1G6T1F4_lblExp").setRequired(true);
					} else if (Data.BP_TYPE_CODE !== "B") {
						oView.byId("S1G6T1F4_lbl").setRequired(true);
						oView.byId("S1G6T1F4_lblExp").setRequired(false);
					}

					if (Data.VAT_CHECK === "N") {
						context.getView().byId("simpleForm24").setVisible(false);
					} else {
						context.getView().byId("simpleForm24").setVisible(true);
						context.getView().byId("S2G2T2F2_lbl").setRequired(true);
						context.getView().byId("S2G2T2F3_lbl").setRequired(true);
					}

					var busiHistoryLen = Data.TO_BUSINESS_HISTORY.length;
					if (busiHistoryLen > 0) {
						for (i = 0; i < busiHistoryLen; i++) {
							var objBusiHistory = {
								results: [{
									"DEALERSHIP": Data.TO_BUSINESS_HISTORY[i].DEALERSHIP,
									"SUPPLIER_NAME": Data.TO_BUSINESS_HISTORY[i].SUPPLIER_NAME,
									"SINCE": Data.TO_BUSINESS_HISTORY[i].SINCE,
									"PROD_GROUP": Data.TO_BUSINESS_HISTORY[i].PROD_GROUP,
									"PURCHASES": Data.TO_BUSINESS_HISTORY[i].PURCHASES
								}]
							};
							myJSONModel8 = new JSONModel();
							myJSONModel8.setData(objBusiHistory);
							context.getView().setModel(myJSONModel8, "BusinessHistoryModel");
						}
					}
					else {
						var objBusiHistory = {
							results: []
						};
						myJSONModel8 = new JSONModel();
						myJSONModel8.setData(objBusiHistory);
						context.getView().setModel(myJSONModel8, "BusinessHistoryModel");
					}

					var customersLen = Data.TO_CUSTOMERS.length;
					if (customersLen > 0) {
						for (i = 0; i < customersLen; i++) {
							var objCustomers = {
								results: [{
									"CUST_NO": Data.TO_CUSTOMERS[i].CUST_NO,
									"CUSTOMER_NAME": Data.TO_CUSTOMERS[i].CUSTOMER_NAME,
									"YEAR1": Data.TO_CUSTOMERS[i].YEAR1,
									"YEAR2": Data.TO_CUSTOMERS[i].YEAR2
								}]
							};
							myJSONModel9 = new JSONModel();
							myJSONModel9.setData(objCustomers);
							context.getView().setModel(myJSONModel9, "customerModel");
						}
					}
					else {
						var objCustomers = {
							results: []
						};
						myJSONModel9 = new JSONModel();
						myJSONModel9.setData(objCustomers);
						context.getView().setModel(myJSONModel9, "customerModel");
					}

					var promotorLen = Data.TO_PROMOTERS.length;
					if (promotorLen > 0) {
						for (i = 0; i < promotorLen; i++) {
							var objPromotors = {
								results: [{
									"NAME": Data.TO_PROMOTERS[i].NAME,
									"QUALIFICATION": Data.TO_PROMOTERS[i].QUALIFICATION,
									"WORK_EXP": Data.TO_PROMOTERS[i].WORK_EXP,
									"YRS_IN_COMP": Data.TO_PROMOTERS[i].YRS_IN_COMP,
									"DESIGNATION": Data.TO_PROMOTERS[i].DESIGNATION,
									"ROLE": Data.TO_PROMOTERS[i].ROLE
								}]
							};
							myJSONModel10 = new JSONModel();
							myJSONModel10.setData(objPromotors);
							context.getView().setModel(myJSONModel10, "promotorsModel");
						}
					}
					else {
						var objPromotors = {
							results: []
						};
						myJSONModel10 = new JSONModel();
						myJSONModel10.setData(objPromotors);
						context.getView().setModel(myJSONModel10, "promotorsModel");
					}

					// context._simpleFormHideShow();

					if (Data.ACK_VALIDATION === 'Yes') {
						context.getView().byId("checkboxId").setSelected(true);
					} else {
						context.getView().byId("checkboxId").setSelected(false);
					}

					//Section 5
					context._readAttachment();

					// context._readIBAN();
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

		//Added by Sumit Singh
		readDupValue: function (iTradeLic, iSupplName, iVatNo, iRequsetNo) {

			var getEventsData;
			var that = this;
			tradelicModel = new JSONModel();
			suppNameModel = new JSONModel();
			vatNoModel = new JSONModel();
			getEventsData = context.getView().getModel("comm").getData();

			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormDataApproval";

			var oPayoload =
			{
				"action": "DUPLICATECHECK",
				"inputData": [{
					"TRADE_LIC_NO": iTradeLic,
					"VAT_REG_NUMBER": iVatNo,
					"VENDOR_NAME1": iSupplName,
					"REQUEST_NO": iRequsetNo
				}],
				"eventsData": getEventsData
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
					var oModel = new JSONModel(data.value[0]);
					context.getView().setModel(oModel, "checkDuplicates");

					var Data = data.value[0];
					if (Data.TRADE_LIC_NO.length === 0) {
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

					if (Data.VENDOR_NAME1.length === 0) {
						that.getView().getModel("localModel").setProperty("/MsgStrip2", false);
						that.getView().getModel("localModel").refresh(true);
					}
					else {
						that.getView().getModel("localModel").setProperty("/Notificationlist", true);
						that.getView().getModel("localModel").setProperty("/MsgStrip2", true);
						that.getView().getModel("localModel").refresh(true);
						suppNameModel.setData(Data.VENDOR_NAME1[0].VENDOR_NAME1);
						sap.ui.getCore().setModel(suppNameModel, "suppNameDetails");
					}

					if (Data.VAT_REG_NUMBER.length === 0) {
						that.getView().getModel("localModel").setProperty("/MsgStrip3", false);
						that.getView().getModel("localModel").refresh(true);
					} else {
						that.getView().getModel("localModel").setProperty("/Notificationlist", true);
						that.getView().getModel("localModel").setProperty("/MsgStrip3", true);
						that.getView().getModel("localModel").refresh(true);

						vatNoModel.setData(Data.VAT_REG_NUMBER);
						sap.ui.getCore().setModel(vatNoModel, "vatDetails");
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

		_readIBAN: function () {

			var that = this;
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
			BusyIndicator.show();
			var that = this;
			IbanPRIModel = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIbanCountry?$filter=LAND1 eq '" + countryKey + "'";

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (data, response) {
					BusyIndicator.hide();
					if (data.value.length > 0) {
						context.getView().byId("S2G1T1F5_lbl").setRequired(true);
					} else {
						context.getView().byId("S2G1T1F5_lbl").setRequired(false);
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

		_readIBAN_OTHCondition: function (countryKey) {
			IbanOTHModel = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIbanCountry?$filter=LAND1 eq '" + countryKey + "'";
			BusyIndicator.show();
			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (data, response) {
					BusyIndicator.hide();
					if (data.value.length > 0) {
						context.getView().byId("tableIbanId").setRequired(true);
					} else {
						context.getView().byId("tableIbanId").setRequired(false);
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

			BusyIndicator.show();
			LogDetailModel = new JSONModel();

			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegSupplierLog?$filter=REQUEST_NO eq " + requestNo + "";

			$.ajax({
				url: path,
				type: 'GET',

				contentType: 'application/json',
				async: false,
				success: function (Data, response) {

					BusyIndicator.hide();

					for (var i = 0; i < Data.value.length; i++) {
						Data.value[i].UPDATED_ON = new Date(Data.value[i].UPDATED_ON);
					}
					LogDetailModel.setData(Data.value);
					context.getView().setModel(LogDetailModel, "displayLog");
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

		//Trade License number duplicate check
		_tradeDupCheck: function (value, requestNo) {
			var that = this;
			// sap.ui.core.BusyIndicator.show();
			// context.getView().setBusy(true);
			tradelicModel = new JSONModel();
			var sEntity = "/VenOnboardForm";
			var oFilters = [];
			if (value !== null) {
				var F1 = new sap.ui.model.Filter("TRADE_LIC_NO", sap.ui.model.FilterOperator.EQ, value);
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

		//Duplicate Supplier check
		_suppDupCheck: function (value, requestNo) {

			var that = this;
			// sap.ui.core.BusyIndicator.show();
			// context.getView().setBusy(true);
			suppNameModel = new JSONModel();
			var sEntity = "/VenOnboardForm";
			var oFilters = [];
			var F1 = new sap.ui.model.Filter("VENDOR_NAME1", sap.ui.model.FilterOperator.EQ, value);
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

		//VAT number duplicate check
		_vatDupCheck: function (value, requestNo) {
			var that = this;
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

		handleTradeSearch: function (oEvent) {

			var sQuery = oEvent.getParameter('value');
			var oTable = sap.ui.getCore().byId("myTradeDialog");
			this.binding = oTable.getBinding("items");

			if (sQuery && sQuery.length > 0) {

				var oFilter = new Filter("VENDOR_NAME1", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFilter1 = new Filter("REQUEST_NO", sap.ui.model.FilterOperator.Contains, sQuery);
				var oFil = new sap.ui.model.Filter([oFilter, oFilter1]);
				this.binding.filter(oFil, sap.ui.model.FilterType.Application);
			} else {
				this.binding.filter([]);
			}
		},

		onTradeLicCheck: function () {

			if (!this.tradefrag) {
				this.tradefrag = sap.ui.xmlfragment("com.nihilent.edge.edge_vendor_form_approval.fragments.tradeCheck", this);
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
				this.suppcheckfrag = sap.ui.xmlfragment("com.nihilent.edge.edge_vendor_form_approval.fragments.supplierCheck", this);
			}
			this.suppcheckfrag.open();
		},

		handleSuppClose: function () {

			this.suppcheckfrag.destroy();
			this.suppcheckfrag = null;
		},

		onVatCheck: function () {

			if (!this.vatfrag) {
				this.vatfrag = sap.ui.xmlfragment("com.nihilent.edge.edge_vendor_form_approval.fragments.vatCheck", this);
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

		_validateBussinessInfoTable: function () {

			if (data.VISIBLE[0].S1G4T2F1 === null && data.VISIBLE[0].S1G4T3F1 === null && data.VISIBLE[0].S1G4T4F1 === null &&
				data.VISIBLE[0].S1G4T5F1 === null && data.VISIBLE[0].S1G4T6F1 === null && data.VISIBLE[0].S1G4T7F1 === null) {
				this.getView().byId("bussinessInfoTable_Id").setVisible(false);
			}
		},

		//Reading supplier attachments
		_readAttachment: function () {
			var G1 = [];
			var G2 = [];
			var G3 = [];
			var G4 = [];
			var G5 = [];
			var G6 = [];
			var G7 = [];
			var G8 = [];
			var G9 = [];
			var G10 = [];
			var G11 = [];
			var G12 = [];
			var G13 = [];
			var G14 = [];
			var G15 = [];
			var G16 = [];
			var G17 = [];
			var G18 = [];
			var G19 = [];
			var G20 = [];
			var G21 = [];
			var G22 = [];
			var G23 = [];
			var G24 = [];
			var G25 = [];
			var G26 = [];
			var G27 = [];
			var G28 = [];
			var attachLen = myJSONModel.getData().TO_ATTACHMENTS.length;
			for (var i = 0; i < attachLen; i++) {
				if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G1') {
					G1.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G2') {
					G2.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G3') {
					G3.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G4') {
					G4.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G5') {
					G5.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G6') {
					if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_DESC === 'Digital Certificate') {
						myJSONModel.getData().TO_ATTACHMENTS[i].ISSUE_ELEC_TAX_INV = myJSONModel.getData().results[0].AttachFieldsRef
							.results[0].ISSUE_ELEC_TAX_INV;
						G6.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
					}
					if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_DESC ===
						'Certificate issued from the Manufacturer / service provider') {
						myJSONModel.getData().TO_ATTACHMENTS[i].SOLE_DIST_MFG_SER = myJSONModel.getData().results[0].AttachFieldsRef.results[
							0].SOLE_DIST_MFG_SER;
						G6.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
					}
					//	G6.push(data.DRAFT.ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G7') {
					G7.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G8') {
					G8.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G9') {
					G9.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G10') {
					G10.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G11') {
					G11.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G12') {
					G12.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G13') {
					G13.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G14') {
					G14.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G15') {
					G15.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G16') {
					G16.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G17') {
					G17.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G18') {
					G18.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G19') {
					G19.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G20') {
					G20.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G21') {
					G21.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G22') {
					G22.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G23') {
					G23.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G24') {
					G24.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G25') {
					G25.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G26') {
					G26.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G27') {
					G27.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				} else if (myJSONModel.getData().TO_ATTACHMENTS[i].ATTACH_GROUP === 'G28') {
					G28.push(myJSONModel.getData().TO_ATTACHMENTS[i]);
				}
			}

			var G1Model = new JSONModel();
			G1Model.setData(G1);
			context.getView().setModel(G1Model, "G1Json");

			var G2Model = new JSONModel();
			G2Model.setData(G2);
			context.getView().setModel(G2Model, "G2Json");

			var G3Model = new JSONModel();
			G3Model.setData(G3);
			context.getView().setModel(G3Model, "G3Json");

			var G4Model = new JSONModel();
			G4Model.setData(G4);
			context.getView().setModel(G4Model, "G4Json");

			var G5Model = new JSONModel();
			G5Model.setData(G5);
			context.getView().setModel(G5Model, "G5Json");

			var G8Model = new JSONModel();
			G8Model.setData(G8);
			context.getView().setModel(G8Model, "G8Json");

			var G9Model = new JSONModel();
			G9Model.setData(G9);
			context.getView().setModel(G9Model, "G9Json");

			var G10Model = new JSONModel();
			G10Model.setData(G10);
			context.getView().setModel(G10Model, "G10Json");

			var G11Model = new JSONModel();
			G11Model.setData(G11);
			context.getView().setModel(G11Model, "G11Json");

			var G12Model = new JSONModel();
			G12Model.setData(G12);
			context.getView().setModel(G12Model, "G12Json");

			var G13Model = new JSONModel();
			G13Model.setData(G13);
			context.getView().setModel(G13Model, "G13Json");

			var G14Model = new JSONModel();
			G14Model.setData(G14);
			context.getView().setModel(G14Model, "G14Json");

			var G15Model = new JSONModel();
			G15Model.setData(G15);
			context.getView().setModel(G15Model, "G15Json");

			var G16Model = new JSONModel();
			G16Model.setData(G16);
			context.getView().setModel(G16Model, "G16Json");

			var G17Model = new JSONModel();
			G17Model.setData(G17);
			context.getView().setModel(G17Model, "G17Json");

			var G18Model = new JSONModel();
			G18Model.setData(G18);
			context.getView().setModel(G18Model, "G18Json");

			var G19Model = new JSONModel();
			G19Model.setData(G19);
			context.getView().setModel(G19Model, "G19Json");

			var G20Model = new JSONModel();
			G20Model.setData(G20);
			context.getView().setModel(G20Model, "G20Json");

			var G21Model = new JSONModel();
			G21Model.setData(G21);
			context.getView().setModel(G21Model, "G21Json");

			var G22Model = new JSONModel();
			G22Model.setData(G22);
			context.getView().setModel(G22Model, "G22Json");

			var G23Model = new JSONModel();
			G23Model.setData(G23);
			context.getView().setModel(G23Model, "G23Json");

			var G24Model = new JSONModel();
			G24Model.setData(G24);
			context.getView().setModel(G24Model, "G24Json");

			var G25Model = new JSONModel();
			G25Model.setData(G25);
			context.getView().setModel(G25Model, "G25Json");

			var G26Model = new JSONModel();
			G26Model.setData(G26);
			context.getView().setModel(G26Model, "G26Json");

			var G27Model = new JSONModel();
			G27Model.setData(G27);
			context.getView().setModel(G27Model, "G27Json");

			var G28Model = new JSONModel();
			G28Model.setData(G28);
			context.getView().setModel(G28Model, "G28Json");
		},

		//Downlod attachments
		onDownload: function (oEvent) {

			var sbIndex = "",
				content = "",
				fileName = "",
				mimeType = "";
			var model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;

			if (model === "G7Json" || model === "G6Json" || model === "G10Json" || model === "G22Json" || model === "G23Json") {
				sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
			} else {
				sbIndex = parseInt(oEvent.getSource().getBindingContext(model).getPath().split("/")[1]);
			}

			var oModel = oView.getModel(model).oData[sbIndex];

			//var obj = oEvent.getSource().getBindingContext(model).getObject();

			var iDocId = oModel.OT_DOC_ID;
			BusyIndicator.show();
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormCMS("+ iDocId +")/$value";
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (data, responce) {
					BusyIndicator.hide();
					// if (data.value.length > 0) {
					// 	context.downloadFileContent(data.value[0].FILE_TYPE, data.value[0].SR_NO, data.value[0].FILE_NAME, data.value[0].FILE_MIMETYPE, data.value[0].FILE_CONTENT);
					// } else {
					// 	MessageBox.error("Attachments are empty.");
					// }
					context.fileType(iDocId, data);
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
			var that = this;
			sap.ui.core.BusyIndicator.show();
			myJSONModelToken = new JSONModel();
			var sEntity = "/CredentialMaster";

			oModel.read(sEntity, {
				success: function (Data) {

					sap.ui.core.BusyIndicator.hide();
					if (Data.results.length !== 0) {
						that.tokenusername = Data.USERNAME;
						that.tokenpass = Data.PASSWORD;
					} else {
						MessageBox.error("Open text credentials missing.");
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
		onPostMessage: function () {

			var that = this;
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MessengerService";
			var vendorDetails = context.getView().getModel("vendorDetails").getData();
			var userDetails = context.getView().getModel("userAttriJson").getData();
			var oPayload =
			{
				"action": "DISTRIBUTOR",
				"appType": "REG",
				"messengerData": {
					"loginId": vendorDetails.REGISTERED_ID,
					"mailTo": vendorDetails.REQUESTER_ID
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
					"EVENT_CODE": 10,
					"EVENT_TYPE": "MSG",
					"USER_ID": vendorDetails.REGISTERED_ID,
					"USER_NAME": vendorDetails.DIST_NAME1,
					"REMARK": "Vendor sent email to CM",
					"COMMENT": that.getView().byId("emailTextId").getValue(),
					"CREATED_ON": new Date()
				}],
				"userDetails": {
					"USER_ROLE": "DISTRIBUTOR",
					"USER_ID": context.UserId
				}
			}
			BusyIndicator.show();
			var Postdata = JSON.stringify(oPayload);
			this.postAjaxs(url, "POST", Postdata, "messagePost");
		},

		_readTimelineData: function () {
			myJSONModel12 = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RegEventsLog?$filter=(REQUEST_NO eq " + requestNo + ") and (EVENT_TYPE eq 'MSG')";
			BusyIndicator.show();
			$.ajax({
				url: url,
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (data, response) {

					BusyIndicator.hide();
					// context.handleEvents();

					for (var i = 0; i < data.value.length; i++) {
						data.value[i].CREATED_ON = new Date(data.value[i].CREATED_ON);
					}
					var oModel = new JSONModel(data.value);
					myJSONModel12.setData(data.value);
					context.getView().setModel(oModel, "comm");

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
		//Handle Back navigation
		onBack: function () {

			myJSONModel1.setData(null);
			myJSONModel2.setData(null);
			myJSONModel3.setData(null);
			myJSONModel4.setData(null);
			myJSONModel5.setData(null);
			myJSONModel6.setData(null);
			myJSONModel7.setData(null);
			myJSONModel8.setData(null);
			myJSONModel9.setData(null);
			myJSONModel10.setData(null);
			
			myJSONModel.setData(null);
			context.getView().getModel("localModel").setProperty("/Notificationlist", false);
			context.getView().getModel("localModel").setProperty("/MsgStrip1", false);
			context.getView().getModel("localModel").setProperty("/MsgStrip2", false);
			context.getView().getModel("localModel").setProperty("/MsgStrip3", false);
			context.getView().getModel("localModel").refresh(true);
			context.getView().byId("multiInput1").removeAllTokens();
			context.getView().byId("multiInput1").setValue(null);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteLoginPage");

		},
		//reading quality certificates
		_qualityCert: function () {

			var oFilters = [];
			myJSONModel11 = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormDiscQaCertif?$filter=REQUEST_NO eq " + requestNo;
			BusyIndicator.show();
			$.ajax({
				url: url,
				type: "GET",
				contentType: 'application/json',
				data: null,
				success: function (Data, response) {

					BusyIndicator.hide();
					myJSONModel11.setData(Data.value);
					context.getView().setModel(myJSONModel11, "qualCert");
					var len = Data.value.length;
					context.getView().byId("table_qualityId").setVisibleRowCount(len);
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

		handleRefreshEvents: function () {
			var that = this;
			that._readTimelineData();
		},
		//Close events tab
		handleSideContentHide: function () {
			this.getView().byId("DynamicSideContent").setShowSideContent(false);
			this.onMainContent(true);
		},

		//Open events tab
		handleEvents: function () {
			// debugger;
			// this.getView().byId("DynamicSideContent").setShowSideContent(true);

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
			}
		},
		onMainContent:function(sValue){
			this.getView().byId("DynamicSideContent").setShowMainContent(sValue);
		},
		//commonRead functionality for APPROVE || REJECT || SENDBACK
		commonRequestAction: function (oAction, ApprovalType) {
			var that = this;

			var url = "/odata/v4/ideal-registration-form-srv/RegFormDataApproval";
			var approvalData = context.getView().getModel("vendorDetails").getData();

			var payload = {
				"action": oAction, //APPROVE|REJECT|SENDBACK
				"inputData": [{
					"REQUEST_NO": approvalData.REQUEST_NO,
					"ENTITY_CODE": approvalData.ENTITY_CODE,
					"REQUEST_TYPE": approvalData.REQUEST_TYPE,
					"REGISTERED_ID": approvalData.REGISTERED_ID,
					"APPROVER_LEVEL": approvalData.APPROVER_LEVEL,
					"VENDOR_NAME1": approvalData.VENDOR_NAME1,
					"REQUESTER_ID": approvalData.REQUESTER_ID


				}],
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
				}]
			};

			var Postdata = JSON.stringify(payload);
			// context.onBack();
			BusyIndicator.show();
			this.postAjaxs(url, "POST", Postdata, null, ApprovalType);
		},

		onApprove: function (oEvent) {
			// if (isNewSwiftCodeExist) { //added by pranay 20-10-2022
			// 	MessageBox.warning("Invalid Swift Code found. Kindly re-verify the bank details.");
			// 	return;
			// }

			if (!this.filterfrag) {
				this.filterfrag = sap.ui.xmlfragment("com.ibspl.ideal.idealregistrationform.view.fragments.approveFrag", this);
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
			var that = this;

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
			this.commonRequestAction("APPROVE", "SubmitApproval");
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
				this.filterfrag = sap.ui.xmlfragment("com.ibspl.ideal.idealregistrationform.view.fragments.approveFrag", this);
			}
			this.filterfrag.open();
			context.filterfrag.setModel(context.getView().getModel("localModel"), "localModel");
			context.filterfrag.setModel(context.getView().getModel("detailsForm"), "detailsForm");
			sap.ui.getCore().byId("id_approve").setVisible(false);
			sap.ui.getCore().byId("id_reject").setVisible(true);
			sap.ui.getCore().byId("id_back").setVisible(false);
			sap.ui.getCore().byId("id_lable").setRequired(true);
			sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to Reject ?");
		},
		//Reject Functionality
		onSubmitRejection: function () {
			this.commonRequestAction("REJECT");
		},

		onSendBack: function (oEvent) {

			if (!this.filterfrag) {
				this.filterfrag = sap.ui.xmlfragment("com.ibspl.ideal.idealregistrationform.view.fragments.approveFrag", this);
			}
			this.filterfrag.open();
			context.filterfrag.setModel(context.getView().getModel("localModel"), "localModel");
			context.filterfrag.setModel(context.getView().getModel("detailsForm"), "detailsForm");
			sap.ui.getCore().byId("id_approve").setVisible(false);
			sap.ui.getCore().byId("id_reject").setVisible(false);
			sap.ui.getCore().byId("id_back").setVisible(true);
			sap.ui.getCore().byId("id_lable").setRequired(true);
			sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to Send Back ?");
		},

		//Buyer Send back functionality
		onSubmitBack: function () {
			this.commonRequestAction("SENDBACK");
		},

		handleEditForm: function (oEvent) {
			MessageBox.information("Do you want to Edit ?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (Action) {
					if (Action === "YES") {
						var loginData = context.getOwnerComponent().getModel("loginData").getData();
						var entityCode = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, loginData.ENTITY_CODE);
						var sapVendorCode = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, loginData.SAP_DIST_CODE);
						BusyIndicator.show(0);
						context.oDataModel.read("/GetCustomersSet", {
							filters: [entityCode, sapVendorCode],
							success: function (oData, responce) {

								var isVendorExist = oData.results.some(function (value) {
									var newValue = value.Kunnr.slice(3);
									return newValue === loginData.SAP_DIST_CODE;
								});

								if (isVendorExist === true && loginData.STATUS === 11) {
									context.handleEditRequest();
								} else {
									MessageBox.warning("Form cannot be edited currently. Previous request in process");
									return;
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
				}
			});
		},
		
		handleEditRequest: function (oEvent) {
			var registeredData = {};
			var viewModel = new JSONModel();
			var loginData = context.getOwnerComponent().getModel("loginData").getData();
			var payload = {
				"action": "DIST_EDIT",
				"reqHeader": [{
					"REQUEST_NO": loginData.REQUEST_NO,
					"SAP_DIST_CODE": loginData.SAP_DIST_CODE,
					"IDEAL_DIST_CODE": loginData.IDEAL_DIST_CODE,
					"STATUS": loginData.STATUS,
					"REGISTERED_ID": loginData.REGISTERED_ID,
					"ENTITY_CODE": loginData.ENTITY_CODE,
					"REQUEST_TYPE": loginData.REQUEST_TYPE,
					"CREATION_TYPE": loginData.CREATION_TYPE,
					"DIST_NAME1": loginData.VENDOR_NAME1
				}],
				"eventsData": [{
					"REQUEST_NO": loginData.REQUEST_NO,
					"EVENT_NO": 0,
					"EVENT_CODE": 2,
					"EVENT_TYPE": "REG",
					"USER_ID": loginData.REGISTERED_ID,
					"USER_NAME": loginData.DIST_NAME1,
					"REMARK": "Update Request Created",
					"COMMENT": "Testing",
					"CREATED_ON": new Date()
				}],
				"userDetails": {
					"USER_ROLE": "CM",
					"USER_ID": context.UserId
				}
			};
			var data = JSON.stringify(payload);
			var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormDistEdit";
			$.ajax({
				url: path,
				type: 'POST',
				data: data,
				contentType: 'application/json',
				success: function (oData, responce) {
					// debugger;
					BusyIndicator.hide(0);
					if (oData.value[0].status === 'Success') {
						MessageBox.success(oData.value[0].message, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
									registeredData.REQUEST_NO = oData.value[0].results[0].REQUEST_NO;
									registeredData.ENTITY_CODE = oData.value[0].results[0].ENTITY_CODE;
									registeredData.REGISTERED_ID = oData.value[0].results[0].REGISTERED_ID;
									registeredData.DIST_NAME1 = oData.value[0].results[0].DIST_NAME1;
									registeredData.REQUEST_TYPE = oData.value[0].results[0].REQUEST_TYPE;
									registeredData.STATUS = oData.value[0].results[0].STATUS;
									registeredData.CREATION_TYPE = oData.value[0].results[0].CREATION_TYPE;
									registeredData.IDEAL_DIST_CODE = oData.value[0].results[0].IDEAL_DIST_CODE;
									registeredData.SAP_DIST_CODE = oData.value[0].results[0].SAP_DIST_CODE;
									registeredData.SUPPL_TYPE = oData.value[0].results[0].SUPPL_TYPE;
									registeredData.SUPPL_TYPE_DESC = oData.value[0].results[0].SUPPL_TYPE_DESC;
									registeredData.REQUESTER_ID = oData.value[0].results[0].REQUESTER_ID;
									registeredData.BP_TYPE_CODE = oData.value[0].results[0].BP_TYPE_CODE;
									registeredData.BP_TYPE_DESC = oData.value[0].results[0].BP_TYPE_DESC;
									registeredData.DIST_CODE = oData.value[0].results[0].DIST_CODE;
									registeredData.NDA_TYPE = oData.value[0].results[0].NDA_TYPE;
									registeredData.REMINDER_COUNT = oData.value[0].results[0].REMINDER_COUNT;
									registeredData.BUYER_ASSIGN_CHECK = oData.value[0].results[0].BUYER_ASSIGN_CHECK;
									registeredData.CREATED_ON = oData.value[0].results[0].CREATED_ON;
									registeredData.COMMENT = oData.value[0].results[0].COMMENT;
									registeredData.LEGACY_ID = oData.value[0].results[0].LEGACY_ID;
									viewModel.setData(registeredData);
									context.getOwnerComponent().setModel(viewModel, "loginData");
									var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
									oRouter.navTo("instructionView", true);
								}
							}
						});
					}
				},
				error: function (error) {
					BusyIndicator.hide(0);
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
	});

});