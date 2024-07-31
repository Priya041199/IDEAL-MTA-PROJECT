sap.ui.define([
    // "sap/ui/core/mvc/Controller",
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"com/ibs/ibsappidealdealerprofile/model/down",
	"sap/m/Token",
	"com/ibs/ibsappidealdealerprofile/model/formatter",
	"sap/ui/core/BusyIndicator",
	'sap/ui/core/Fragment'

], function (BaseController,JSONModel, MessageToast, Filter, FilterOperator, MessageBox, History,down, Token, formatter,
	BusyIndicator,Fragment) {
	"use strict";
	var data, that;
	var context = null;
	var oModel,appModulePath;
	var oView = null;
	var requestNo,sapVendorNo;
	var oViewModel,myJSONModel, myJSONModel1, myJSONModel2,  myJSONModel3,
	 myJSONModel4,  myJSONModel5, myJSONModel6,myJSONModel7, myJSONModel11,
	  myJSONModelEdit, myLocalModel,LocalObject,businessHisModel,custDetailsModel,promoDetailsModel;
	var LogDetailModel;
	//	var isNewSwiftCodeExist = null;

	return BaseController.extend("com.ibs.ibsappidealdealerprofile.controller.DetailPage", {
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
			// this.getView().byId("displayEditButton").setVisible(false);
			context.oDataModel = context.getOwnerComponent().getModel("onPremiseModel");
			// var distModel
			var distData = that.getOwnerComponent().getModel("vendorDetail").getData();
			
			// if(distData === undefined || distData === "" || distData === null){
			// 	that.getView().byId("back").setVisible(true);
			// 	this.getView().byId("displayEditButton").setVisible(true);
			// }else{
			// 	that.getView().byId("back").setVisible(false);
			// 	this.getView().byId("displayEditBtn").setVisible(true);
			// }
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteDetailPage").attachMatched(this._onRouteMatched, this);
		},

	
		

		_onRouteMatched: function (oEvent) {
			
			BusyIndicator.hide();
			oViewModel = context.getView().getModel("vendorDetail");

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

			//added on 23-05-2023 by Sumit
			if (oViewModel !== undefined) {
				var NavModel = new JSONModel();
				NavModel.setData(oViewModel.getData());
				context.getView().setModel(NavModel, "navData");
			}		

			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);
			var attr = appModulePath + "/user-api/attributes";

			that.getUserData = this.getOwnerComponent().getModel("userModel");

		// 	if(that.getUserData === undefined){
		// 		// this.onBack();
		// 		// MessageBox.error("Error while reading User Attributes");

		// 		// that._sUserID = "farzeen.s@intellectbizware.com";
		// 		// that._sUserName = "Farzeen Sayeed";
		// 		// var oModel = new JSONModel({
		// 		// 	userId: that._sUserID,
		// 		// 	userName: that._sUserName
		// 		// });
		// 		// this.getOwnerComponent().setModel(oModel, "userModel");
		// 		// this._getUserId();
		// }

			if(that.getUserData === undefined){
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
						// that._getUserId();
					},
					error: function (oError) {
						MessageBox.error("Error while reading User Attributes");
					}
				});
			});
			}
			else{
				sapVendorNo = oEvent.getParameter("arguments").SAPVENDORNO;
				requestNo = oViewModel.getData().REQUEST_NO;
				
				that._sUserID = that.getUserData.getProperty("/userId");
				// this.readUserMasterData(that._sUserID);
				this._getUserId();
			}
		},
		readUserMasterData: function(userEmail){
			var userDetailModel = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-additional-process-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
			var data = { $expand: 'TO_USER_ENTITIES' };

				$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
						if(data.value.length === 0){
							// MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
							that.getView().byId("back").setVisible(false);
							that.readDraft();
						}
						else{
							// if(data.value[0].TO_USER_ENTITIES.length > 0){
							// 	if (data.value[0].USER_ROLE === 'BYR') {
                            //         that.getView().byId("displayEditButton").setVisible(true);
                            //     } else if (data.value[0].USER_ROLE === 'PM') {
							// 		that.getView().byId("displayEditButton").setVisible(false);
                            //     }
                            //     userDetailModel.setData(data.value[0]);
                            //     that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");

							// 	// userDetailModel.setData(data.value[0].TO_USER_ENTITIES);
							// 	// that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");
							// 	that.readDraft();
							// }
							// else{
							// 	MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
							// }
							that.getView().byId("back").setVisible(true);
							that.readDraft();
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
		readDraft: function () {
			var that = this;
			var ReqNo = oViewModel.getData().REQUEST_NO;
			var entityCode = oViewModel.getData().ENTITY_CODE;
			var creationType = oViewModel.getData().CREATION_TYPE;
			var userRole;
			var userid = "@intellectbizware.com";
			// that.getOwnerComponent().getModel("userDetailsModel").getProperty("/USER_ROLE");
			if(that._sUserID.includes(userid)){
				userRole = 'SA';
				that.getView().byId("back").setVisible(true);
				this.getView().byId("displayEditButton").setVisible(true);
			}
			else{
				userRole = 'Distributor';
				that.getView().byId("back").setVisible(false);
				this.getView().byId("displayEditBtn").setVisible(true);
			}
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/GetDraftData(requestNo=" + ReqNo + ",entityCode='" + entityCode + "',creationType=" + creationType + ",userId='" + that._sUserID + "',userRole='"+ userRole +"')";
			var oDraftData = {
				userRole: userRole,
				userId:that._sUserID,
				requestNo:ReqNo,
				entityCode:entityCode,
				creationType:creationType ,
				draftData:true,
				visibility:true,
				mandatory:true,
				updated:true,
				openText:true,
				clientInfo:true,
				totalCount:true,
				settings:true,
				labels:true
			}

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

					that._readData(requestNo);
					that._supplierEditstatus();
					that._readLogDetails();
					that._attachTable();
					// that._qualityCert();
					that._setlocalmodel();
						
					//load a section 1 by default
					context.getView().byId("ObjectPageLayout").setSelectedSection(context.getView().byId("firstSection"));
				
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
		//Getting login user attributes
		_getUserId: function () {
			var that = this;
			var getUserData = context.getOwnerComponent().getModel("userModel").getData();
			that._sUserID = (getUserData.userId).toLowerCase();
			that._sUserName = getUserData.userName;
				
			that.readUserMasterData(that._sUserID);
		},
		getClientInfo: function () {
			
			var that = this;
			var url = appModulePath+"/odata/v4/ideal-additional-process-srv/MasterClientInfo";

			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (oData, response) {
					
					oView.setBusy(false);
					that.clientInfo = oData.value[0];
				},
				error: function (error) {
					

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

			// var oRouter = sap.ui.core.UIComponent.getRouterFor(context);
			// oRouter.navTo("NotFound", {
			// 	REQUEST_NO: requestNo
			// });
		},

		// readUserMasterData : function(userEmail){
		// 	var url = appModulePath + "/odata/v4/addtional-process/MasterIvenUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
		// 	var that = this;
		// 		$.ajax({
        //             url: url,
        //             type: "GET",
        //             contentType: 'application/json',
        //             data: null,
        //             success: function (data, response) {
						
        //                 BusyIndicator.hide();
		// 				var userDetailModel = new JSONModel();
        //                     if (data.value.length !== 0) {
        //                         //setting roles here
        //                         if (data.value[0].USER_ROLE === 'BYR') {
        //                             that.getView().byId("displayEditButton").setVisible(true);
        //                         } else if (data.value[0].USER_ROLE === 'PM') {
		// 							that.getView().byId("displayEditButton").setVisible(false);
        //                         }
        //                         userDetailModel.setData(data.value[0]);
        //                         that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");
        //                     }
					
		// 			},
        //             error: function (error) {
        //                 BusyIndicator.hide();
		// 				var oXML,oXMLMsg;
		// 				if (context.isValidJsonString(error.responseText)) {
		// 					oXML = JSON.parse(error.responseText);
		// 					oXMLMsg = oXML.error["message"];
		// 				} else {
		// 					oXMLMsg = error.responseText
		// 				}
        //                 MessageBox.error(oXMLMsg);
        //                 // MessageBox.error(e.responseText);
        //             }
        //         });
		// },
		
		//Read supplier Data
		_readData: function (oFilters) {
			
			if (oFilters === undefined) {
				var url = appModulePath + "/odata/v4/ideal-additional-process-srv/RequestInfo("+requestNo+")";
			}
			else {
				var url = appModulePath + "/odata/v4/ideal-additional-process-srv/RequestInfo("+oFilters+")";
			}

			var data = {
				$expand: 'TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY,TO_REGION),TO_CONTACTS($expand=TO_COUNTRY,TO_REGION),TO_STATUS,TO_BANKS($expand=TO_COUNTRY),TO_MANDATORY_FIELDS,TO_UPDATED_FIELDS,TO_ATTACHMENTS,TO_VISIBLE_FIELDS,TO_ATTACH_FIELDS,TO_CUSTOMERS,TO_PROMOTERS,TO_BUSINESS_HISTORY,TO_BANKING_DETAILS,TO_REQUEST_ACTIVE_STATUS'
			};
			this._getodata(url,'GET',data,"vendorDetails")
		},

		_getodata:function(url, type, data, model){
			myJSONModel = new JSONModel();
			
			$.ajax({
				url: url,
				type: type,
				contentType: 'application/json',
				data: data,
				success: function (Data) {
					
					BusyIndicator.hide();
					if (Data === null) {
						context._navtoNotFoundPage(requestNo, "NotFound");
					} 
					else if (context._sUserID !== Data.NEXT_APPROVER) {
						context._navtoNotFoundPage(requestNo, "NotAuth");
					}
					 else if (Data.STATUS === 8) {
						context._navtoNotFoundPage(requestNo, Data.STATUS);
					}

					
					//added on 23-05-2023 by Sumit
					if (oViewModel === undefined) {
						var NavModel = new JSONModel();
						NavModel.setData(Data);
						context.getView().setModel(NavModel, "navData");
					}

					if (Data.REQUEST_TYPE !== 5) {
						Data.TO_UPDATED_FIELDS = [];
					}
					myJSONModel.setData(Object.assign({},Data));
					context.getView().setModel(myJSONModel, "vendorDetails");
					
					var sEntityDesc = Data.TO_ENTITY_CODE.BUTXT || 'NA';
					context._sEntity = Data.ENTITY_CODE || '';
					var entitydesc = {
						"ENTITY_DESC": sEntityDesc
					};

					var i18Model = new JSONModel();
					i18Model.setData(entitydesc);
					context.getOwnerComponent().setModel(i18Model, "i18entitydesc");
					
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
						else if(Data.TO_ADDRESS[0].COUNTRY != context.clientInfo.CLIENT_COUNTRY){
							// if(Data.TO_ADDRESS[0].COUNTRY === 'AE'){
								context.OG_BP_TYPE_CODE = Data.BP_TYPE_CODE;
								Data.BP_TYPE_CODE = "";
							// }
							// else{
							// 	context.OG_BP_TYPE_CODE = Data.BP_TYPE_CODE;
							// 	Data.BP_TYPE_CODE = ""
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
					context.getView().byId("trAddId").setVisibleRowCount(addLen);

					//contact detials data

					var contactLen = Data.TO_CONTACTS.length;
					var contArr = [];
					if(contactLen > 0){
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
					}
					if(myJSONModel3 === undefined){
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
							myJSONModel7 = new JSONModel();
							myJSONModel7.setData(objHOD);
							context.getView().setModel(myJSONModel7, "hodDetails");
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
					var bankDetailsArr = [];
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

					if (Data.BP_TYPE_CODE !== "B"){
					// && (Data.SUPPL_TYPE !== "ZGOV" || Data.SUPPL_TYPE !== "ZUNI")) {
						// oView.byId("S1G4T9F1_lbl").setRequired(true);
						// oView.byId("S1G4T9F1_lblExp").setRequired(true);

						oView.byId("vatDetails_Id").setTitle("TAX/VAT/GSTN Details");
						// oView.byId("VAT_RId").setText("Reason for TAX/VAT/GSTN exemption");
						// oView.byId("VAT_EVI").setText("TAX/VAT/GSTN Evidence");
						// oView.byId("S1G4T9F1_lbl").setText(oView.getModel("labelJson").getData().S1G4T9F1);
						// oView.byId("S1G4T9F1_lblExp").setText(oView.getModel("labelJson").getData().S1G4T9F1 + " Expiry Date");
						// oView.byId("idVAT_lbl").setText("TAX/VAT/GSTN Registration Details are available?: ");
						// oView.byId("idICV_lbl").setText("Are you accredited into the ICV program?: ");
						// oView.byId("S2G1T3F13_lbl").setText("TAX/VAT/GSTN Registration Number");
						// oView.byId("S2G1T3F14_lbl").setText("TAX/VAT/GSTN Registration Date");

						// oView.byId("icvDetails_Id").setVisible(true);
						// oView.byId("icvquestion").setVisible(true);
						// context.getView().byId("icv_lpId").setRequired(true);
						// context.getView().byId("icv_lvId").setRequired(true);
						// context.getView().byId("icvId").setRequired(true);
						// context.getView().byId("icv_certiId").setRequired(true);
						// context.getView().byId("vatquestion").setVisible(true);

						// oView.byId("S1G4T9F1_lbl").setText("Trade License No.");
						// oView.byId("S1G4T9F1_lblExp").setText("Trade License Expiry Date");
						// oView.byId("idVAT_lbl").setText("VAT Registration Details are available?: ");
						// oView.byId("idICV_lbl").setText("Are you accredited into the ICV program?: ");
						// oView.byId("S2G1T3F13_lbl").setText("VAT Registration Number");
						// oView.byId("S2G1T3F14_lbl").setText("VAT Registration Date");
						// oView.byId("icvDetails_Id").setVisible(true);

					} else if (Data.BP_TYPE_CODE === "B"){
					// && (Data.SUPPL_TYPE !== "ZGOV" || Data.SUPPL_TYPE !=="ZUNI")) {
						// oView.byId("S1G4T9F1_lbl").setRequired(true);
						// oView.byId("S1G4T9F1_lblExp").setRequired(false);

						// oView.byId("S1G4T9F1_lbl").setText(oView.getModel("labelJson").getData().S1G5T3F1);
						// oView.byId("S1G4T9F1_lblExp").setText(oView.getModel("labelJson").getData().S1G5T3F1 + " Expiry Date");
						// oView.byId("idVAT_lbl").setText("TAX/VAT/GSTN Registration Details are available?: ");
						// //oView.byId("idICV_lbl").setText("Are you accredited into the ICV program?: ");
						// oView.byId("S2G1T3F13_lbl").setText("TAX/VAT/GSTN Registration Number");
						// oView.byId("S2G1T3F14_lbl").setText("TAX/VAT/GSTN Registration Date");
						// oView.byId("vatDetails_Id").setTitle("TAX/VAT/GSTN Details");

						// oView.byId("icvDetails_Id").setVisible(false);
						// oView.byId("icvquestion").setVisible(false);
						// context.getView().byId("icv_lpId").setRequired(false);
						// context.getView().byId("icv_lvId").setRequired(false);
						// context.getView().byId("icvId").setRequired(false);
						// context.getView().byId("icv_certiId").setRequired(false);

						// oView.byId("vatDetails_Id").setTitle("Tax Details");
						// oView.byId("VAT_RId").setText("Reason for Tax exemption");
						// oView.byId("VAT_EVI").setText("Tax Evidence");
						// oView.byId("S1G4T9F1_lbl").setText("Certificate of Incorporation No.");
						// oView.byId("S1G4T9F1_lblExp").setText("Certificate of Incorporation Expiry Date");
						// oView.byId("idVAT_lbl").setText("Tax Registration Details are available?: ");
						// oView.byId("idICV_lbl").setText("Are you accredited into the ICV program?: ");
						// oView.byId("S2G1T3F13_lbl").setText("Tax Registration Number");
						// oView.byId("S2G1T3F14_lbl").setText("Tax Registration Date");
						// oView.byId("icvDetails_Id").setVisible(false);
					}

					// commented by vishal
					//  else if (Data.BP_TYPE_CODE !== "B" && (Data.SUPPL_TYPE === "ZGOV" || Data.SUPPL_TYPE ===
					// 		"ZUNI")) {
					// 	oView.byId("idVAT_lbl").setText("UAE VAT Registration Details are availablec?: ");
					// 	oView.byId("idICV_lbl").setText("Are you accredited into the ICV program of UAE?: ");
					// 	oView.byId("S2G1T3F13_lbl").setText("UAE VAT Registration Number");
					// 	oView.byId("S2G1T3F14_lbl").setText("UAE VAT Registration Date");
					// 	oView.byId("icvDetails_Id").setVisible(true);
					// } else if (Data.BP_TYPE_CODE === "B" && (Data.SUPPL_TYPE === "ZGOV" || Data.SUPPL_TYPE ===
					// 		"ZUNI")) {
					// 	oView.byId("idVAT_lbl").setText("VAT Registration Details are availabled?: ");
					// 	oView.byId("idICV_lbl").setText("Are you accredited into the ICV program?: ");
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
					// if (Data.BP_TYPE_CODE === "B") {
					// 	// context.getView().byId("VAT_RId").setRequired(true);
					// 	// context.getView().byId("VAT_FId").setRequired(true);
					// 	context.getView().byId("icv_lpId").setRequired(true);
					// 	context.getView().byId("icv_lvId").setRequired(true);
					// 	context.getView().byId("icvId").setRequired(true);
					// 	context.getView().byId("icv_certiId").setRequired(true);
					// } else {
					// 	context.getView().byId("VAT_RId").setRequired(true);
					// 	context.getView().byId("VAT_FId").setRequired(false);

					// 	context.getView().byId("icv_lpId").setRequired(false);
					// 	context.getView().byId("icv_lvId").setRequired(false);
					// 	context.getView().byId("icvId").setRequired(false);
					// 	context.getView().byId("icv_certiId").setRequired(false);
					// }

					// if (Data.ICV_CHECK === "Y") {
					// 	context.getView().byId("simpleForm25").setVisible(true);
					// 	context.getView().byId("id_icvevidence").setVisible(true);
					// } else {
					// 	context.getView().byId("simpleForm25").setVisible(false);
					// 	context.getView().byId("id_icvevidence").setVisible(false);
					// }

					//Visible row count for financial
					// var financialLen = Data.TO_FINANCE.length;
					// context.getView().byId("table_finId").setVisibleRowCount(financialLen);

					// //Visible row count for major/Client table
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

					//Fields and tables are hide and show based on company.
					context._simpleFormHideShow();

					

					//section 6
					if (Data.ACK_VALIDATION === 'Yes') {
						context.getView().byId("checkboxId").setSelected(true);
					} else {
						context.getView().byId("checkboxId").setSelected(false);
					}

					//Section 5
					context._readAttachment();
					// if (Data.REQUEST_TYPE === 1 || Data.REQUEST_TYPE === 2 || Data.REQUEST_TYPE === 3) {
					// 	context.readDupValue(Data.TRADE_LIC_NO, Data.VENDOR_NAME1, Data.VAT_REG_NUMBER, Data.REQUEST_NO);
					// }

					//check IBAN is required or not for the selected bank country
					context._readIBAN();

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


				},
				error: function (error) {
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
						if(jsonError.error.code === "404"){
							context._navtoNotFoundPage(requestNo, "NotFound");
						}
						else{
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

		_readIBAN: function () {
			
			var that = this;
			var paymentlength = myJSONModel.getData().TO_BANKS.length;

			for (var i = 0; i < paymentlength; i++) {
				if (myJSONModel.getData().TO_BANKS[i].PAYMENT_TYPE === 'PRI') {
					if (myJSONModel.getData().TO_BANKS[i].TO_COUNTRY !== null) {
						var priBankCountry = myJSONModel.getData().TO_BANKS[i].TO_COUNTRY.LAND1;
						that._readIBAN_PRICondition(priBankCountry,"primaryBankCountry");
					} else {
						priBankCountry = null;
						context.getView().byId("S2G1T1F5_lbl").setRequired(false);
					}
				}
				if (myJSONModel.getData().TO_BANKS[i].PAYMENT_TYPE === 'OTH') {
					if (myJSONModel.getData().TO_BANKS[i].TO_COUNTRY !== null) {
						var othBankCountry = myJSONModel.getData().TO_BANKS[i].TO_COUNTRY.LAND1;
						that._readIBAN_OTHCondition(othBankCountry,"otherBankCountry");
					} else {
						othBankCountry = null;
						context.getView().byId("tableIbanId").setRequired(false);
					}
				}
			}

		},

		_readIBAN_PRICondition: function (countryKey) {
			// sap.ui.core.BusyIndicator.show();
			var that = this;
			var IbanPRIModel = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-additional-process-srv/MasterIbanCountry?$filter=LAND1 eq '" +countryKey+ "'";
			
			$.ajax({
				url: url,
				type: 'GET',
				contentType: 'application/json',
				data: null,
				success: function (data, response) {
					if (data.value.length > 0) {
						context.getView().byId("S2G1T1F5_lbl").setRequired(true);
					} else {
					context.getView().byId("S2G1T1F5_lbl").setRequired(false);
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

		_readIBAN_OTHCondition: function (countryKey) {
			IbanOTHModel = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-additional-process-srv/MasterIbanCountry?$filter=LAND1 eq '" +countryKey+"'";
			
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

			var path = appModulePath+"/odata/v4/ideal-additional-process-srv/RegSupplierLog?$filter=SAP_DIST_CODE eq '" + sapVendorNo +"'";

			$.ajax({
				url: path,
				type: 'GET',
				data: data,
				contentType: 'application/json',
				async: false,
				success: function (Data, response) {
					
					sap.ui.core.BusyIndicator.hide();

					for(var i=0;i<Data.value.length;i++){
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
			var that = this;
			if (!that.filterfrag1) {
				that.filterfrag1 = sap.ui.xmlfragment("com.ibspl.ideal.idealdealerprofile.view.fragments.logTable", that);
				that.getView().addDependent(that.filterfrag1);
			}
			that.filterfrag1.open();
		},

		closelogDialog: function () {
			var that = this;
			that.filterfrag1.close();
			that.filterfrag1.destroy();
			that.filterfrag1 = null;
		},

		//General Section EDIT functionality for Procurement Team
		handleEditForm: function (oEvent) {
			// debugger;
			var that = this;
			myJSONModelEdit = new JSONModel();
			var url = appModulePath + "/odata/v4/ideal-additional-process-srv/ViewRequestActiveStatus?$filter=SAP_DIST_CODE eq '"+sapVendorNo+"' and STATUS ne 3 and STATUS ne 8 and STATUS ne 11";

			var IS_UAE_COMPANY = null;
			var ISSUE_ELEC_TAX_INV = null;
			var SOLE_DIST_MFG_SER = null;
			// added on 13-04-2023 by Inder Chouhan
			if (myJSONModel.getData().TO_ATTACH_FIELDS.length === 0) {
				IS_UAE_COMPANY = "";
				ISSUE_ELEC_TAX_INV = "";
				SOLE_DIST_MFG_SER = "";
			} else {
				IS_UAE_COMPANY = myJSONModel.getData().TO_ATTACH_FIELDS[0].IS_UAE_COMPANY;
				ISSUE_ELEC_TAX_INV = myJSONModel.getData().TO_ATTACH_FIELDS[0].ISSUE_ELEC_TAX_INV;
				SOLE_DIST_MFG_SER = myJSONModel.getData().TO_ATTACH_FIELDS[0].SOLE_DIST_MFG_SER;
			}

            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                // data: data,
                success: function (Data, response) {
                
                BusyIndicator.hide();

                if (Data.value.length > 0) {
					MessageBox.information("Distributor detail update in process. You cannot edit.");
				} else {
					var navObj = {
						"USER_ID": that._sUserID,
						"UNAME": that._sUserName,
						"ENTITY_CODE": myJSONModel.getData().ENTITY_CODE,
						"REG_NO": myJSONModel.getData().REQUEST_NO,
						"CREATION_TYPE": myJSONModel.getData().CREATION_TYPE,
						"VNAME": myJSONModel.getData().VENDOR_NAME1,
						"SAP_DIST_CODE": myJSONModel.getData().SAP_DIST_CODE,
						"VEMAIL": myJSONModel.getData().REGISTERED_ID,
						"REQUEST_TYPE": myJSONModel.getData().REQUEST_TYPE,
						"STATUS": myJSONModel.getData().STATUS,
						"STATUS_DESC": myJSONModel.getData().TO_STATUS.DESCRIPTION || "",
						"BP_TYPE_CODE": context.BP_TYPE_CODE,
						"BP_TYPE_DESC": myJSONModel.getData().BP_TYPE_DESC,
						"SUPPLIERTYPE_CODE": myJSONModel.getData().SUPPL_TYPE,
						"SUPPLIER_TYPE_DESC": myJSONModel.getData().SUPPL_TYPE_DESC,
						"IDEAL_DIST_CODE": myJSONModel.getData().IDEAL_DIST_CODE,
						"CREATED_BY": myJSONModel.getData().REQUESTER_ID,
						"IS_UAE_COMPANY": IS_UAE_COMPANY, // added on 13-04-2023 by Inder Chouhan
						"ISSUE_ELEC_TAX_INV": ISSUE_ELEC_TAX_INV, // added on 13-04-2023 by Inder Chouhan
						"SOLE_DIST_MFG_SER": SOLE_DIST_MFG_SER, // added on 13-04-2023 by Inder Chouhan
						"APPROVER_LEVEL": myJSONModel.getData().APPROVER_LEVEL,
						"APPROVER_ROLE": myJSONModel.getData().APPROVER_ROLE,
						"NEXT_APPROVER": myJSONModel.getData().NEXT_APPROVER,
						"LAST_SAVED_STEP": myJSONModel.getData().LAST_SAVED_STEP,
						"SUBMISSION_DATE": myJSONModel.getData().SUBMISSION_DATE,
						"VAT_CHECK": myJSONModel.getData().VAT_CHECK,
						"REGISTERED_ID" : myJSONModel.getData().REGISTERED_ID

					};
					var oEditViewModel = new sap.ui.model.json.JSONModel(navObj);
					that.getOwnerComponent().setModel(oEditViewModel, "editDetail");

					BusyIndicator.show();
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("EditDetails", {
					RequestNO: oEditViewModel.getData().REG_NO
			});
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
        _setlocalmodel:function(){
            var obj = {
				"isInProgress": false,
				"progressStatus": null,
				"progressStatusDesc": null,
				"MsgStrip1": false
			};
			LocalObject = new JSONModel();
			LocalObject.setData(obj);
			context.getView().setModel(LocalObject, "localmodel");
        },
        _supplierEditstatus:function(){
			
            myLocalModel = new JSONModel();
            var url = appModulePath + "/odata/v4/ideal-additional-process-srv/ViewRequestActiveStatus?$filter=SAP_DIST_CODE eq '"+sapVendorNo+"' and STATUS ne 3 and STATUS ne 8 and STATUS ne 11 and STATUS ne 14";

			var data = {
				$expand: 'TO_STATUS'
			};

            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                data: data,
                success: function (Data, response) {
                
                BusyIndicator.hide();

                if (Data.value.length > 0) {
                    context.getView().getModel("localmodel").setProperty("/isInProgress", true);
                    context.getView().getModel("localmodel").setProperty("/progressStatusDesc", Data.value[0].TO_STATUS.DESCRIPTION);
                    context.getView().getModel("localmodel").setProperty("/progressStatus", Data.value[0].STATUS);
                    context.getView().getModel("localmodel").setProperty("/MsgStrip1", true);
                    context.getView().getModel("localmodel").refresh(true);
                } else {
                    context.getView().getModel("localmodel").setProperty("/isInProgress", false);
                    context.getView().getModel("localmodel").setProperty("/MsgStrip1", false);
                    context.getView().getModel("localmodel").refresh(true);
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

		_validateSectionOneSimpleForm: function () {},

		_validateSectionTwoSimpleForm: function () {
			this._checkSimpleFormVisibility("simpleForm6", "paymentInfo_Id");
		},

		_validateSectionThreeSimpleForm: function () {
			// this._checkSimpleFormVisibility("simpleForm20", "supplier_Id");
			// this._checkSimpleFormVisibility("simpleForm7", "orderDetails_Id");
		},

		_validateSectionFourSimpleForm: function () {
			// this._checkSimpleFormVisibility("simpleForm8", "itar_fcpa_Id");
			// this._checkSimpleFormVisibility("simpleForm9", "itEquTools_Id");
			// this._checkSimpleFormVisibility("simpleForm11", "overview_Id");
			// this._checkSimpleFormVisibility("simpleForm12", "supplierInputMat_Id");
			// this._checkSimpleFormVisibility("simpleForm13", "production_Id");
			// this._checkSimpleFormVisibility("simpleForm14", "storage_Id");
			// this._checkSimpleFormVisibility("simpleForm16", "technology_Id");
			// this._checkSimpleFormVisibility("simpleForm21", "healthEnvi_Id");
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
		},

		//Downlod attachments
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
	
			var iDocId = "(DOC_ID eq " + oModel.OT_DOC_ID + ")";
			
			var path = appModulePath + "/odata/v4/ideal-additional-process-srv/RegFormCMS?$filter=" + iDocId;
			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (data, responce) {
					
					if (data.value.length > 0) {
						context.downloadFileContent(data.value[0].FILE_TYPE, data.value[0].SR_NO, data.value[0].FILE_NAME, data.value[0].FILE_MIMETYPE, data.value[0].FILE_CONTENT);
					} else {
						MessageBox.error("Attachments are empty.");
					}
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

		downloadFileContent: function (iREQUEST_NO, iSR_NO, sFILE_NAME, sFILE_MIMETYPE, sFILE_CONTENT) {
			
			var aFilter = [],
				fileContent = null;
			sFILE_CONTENT = atob(sFILE_CONTENT);
			sFILE_CONTENT = sFILE_CONTENT;
			context.downloadAttachment(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);

		},
		downloadAttachment: function (content, fileName, mimeType) {
			download("data:application/octet-stream;base64," + content, fileName, mimeType);
			var HttpRequest = new XMLHttpRequest();
			x.open("GET", "http://danml.com/wave2.gif", true);
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
		
		//Handle Back navigation
		onBack: function () {
			if (myJSONModel !== undefined) {
				myJSONModel.setData(null);
			}
			
			if (myJSONModel1 !== undefined) {
				myJSONModel1.setData(null);
			}
			if (myJSONModel2 !== undefined) {
				myJSONModel2.setData(null);
			}
			if(myJSONModel7 !== undefined){
				myJSONModel7.setData(null);
			}
			if (myJSONModel3 !== undefined) {
				if (myJSONModel3.getData() !== null && myJSONModel3.getData() !== undefined && myJSONModel3.getData() !== "") {
					myJSONModel3.setData(null);
				}
			}
			if (myJSONModel5 !== undefined) {
				myJSONModel5.setData(null);
			}
			if (myJSONModel6 !== undefined) {
				myJSONModel6.setData(null);
			}
			if (myJSONModel4 !== undefined) {
				myJSONModel4.setData(null);
			}
			if (myJSONModel11 !== undefined) {
				myJSONModel11.setData(null);
			}
			// myJSONModel12.setData(null);
			// if (myJSONModel.getData().REQUEST_TYPE === 1 || myJSONModel.getData().REQUEST_TYPE === 2 || myJSONModel.getData().REQUEST_TYPE === 3) {
			// 	tradelicModel.setData(null);
			// 	suppNameModel.setData(null);
			// 	vatNoModel.setData(null);
			// }
			// myJSONModel.setData(null);

			if(oViewModel !== undefined){
				var onbackObj = {
					"BACK_INDICATOR": "X"
				};
				var onBackModel = new sap.ui.model.json.JSONModel(onbackObj);
				this.getOwnerComponent().setModel(onBackModel, "vendorProfile");
			}

			// context.getView().byId("multiInput1").removeAllTokens();
			// context.getView().byId("multiInput1").setValue(null);
			// context.getView().byId("suppMultiInputId").removeAllTokens();
			// context.getView().byId("suppMultiInputId").setValue(null);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			
			BusyIndicator.show(0);
			jQuery.sap.delayedCall(300, this, function () {
			oRouter.navTo("RouteMasterPage");
			});

		},
		//reading quality certificates
		// _qualityCert: function () {
		// 	var oFilters = [];
		// 	myJSONModel11 = new JSONModel();
		// 	var url = appModulePath + "/odata/v4/ideal-additional-process-srv/RegFormDiscQaCertif?$filter=REQUEST_NO eq "+requestNo;

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
					name: "com.ibspl.iven.ivenvendorprofile.view.fragments.swiftCodeFrag",
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
		onlogSearch:function(oEvent){
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
		handleMyBuddyDetails : function(){
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
				"REGISTERED_ID" : approvalData.REGISTERED_ID,
				"SAP_DIST_CODE" : approvalData.SAP_DIST_CODE
			};

			var myBuddyModel = new sap.ui.model.json.JSONModel(navObj);
			that.getOwnerComponent().setModel(myBuddyModel, "myBuddyDetail");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("MyBuddy", {
				SAPVENDORNO: approvalData.SAP_DIST_CODE
			});
		},
		handleEditForm1 : function(){
			// debugger;
			MessageBox.information("Do you want to Edit ?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (Action) {
					if (Action === "YES") {
						var loginData = oViewModel.getData();
						var entityCode = new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, loginData.ENTITY_CODE);
						var sapVendorCode = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, loginData.SAP_DIST_CODE);
						BusyIndicator.show(0);
						context.oDataModel.read("/GetCustomersSet", {
							filters: [entityCode, sapVendorCode],
							success: function (oData, responce) {
								var loginStatus = that.getView().byId("changeStatus").getText();
								if(loginStatus === "Invited" || loginStatus === "Not Invited" || loginStatus === "Form Submitted" || loginStatus === "Invite Resent"){
									MessageBox.warning("You cannot edit. Previous request in process");
									BusyIndicator.hide(0);
									return;
								}else{
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
		handleEditRequest : function(){
			var registeredData = {};
			var viewModel = new JSONModel();
			var loginData = oViewModel.getData();
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
					"DIST_NAME1": loginData.DIST_NAME1,
					"REQUESTER_ID" : loginData.REGISTERED_ID
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
									// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
									// oRouter.navTo("instructionView", true);
									that._supplierEditstatus();

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
		}		
	});

});