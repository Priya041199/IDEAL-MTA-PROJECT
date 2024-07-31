// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ],
// function (Controller) {
//     "use strict";

//     return Controller.extend("com.ibs.ibsappidealregistrationapproval.controller.MasterPage", {
//         onInit: function () {

//         }
//     });
// });


sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "sap/ui/model/Sorter",
    "sap/ui/core/BusyIndicator",
    "com/ibs/ibsappidealregistrationapproval/model/formatter"
],
    function (BaseController, JSONModel, MessageToast, Filter, MessageBox, History, Sorter,
        BusyIndicator, formatter) {
        "use strict";
        var oModel;
        var context, that;
        var appModulePath;
        return BaseController.extend("com.ibs.ibsappidealregistrationapproval.controller.MasterPage", {
            formatter: formatter,
            onInit: function () {
                // ;
                that = this;
                context = this;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                oModel = context.getOwnerComponent().getModel();

                var oRouter = this.getOwnerComponent().getRouter().getRoute("RouteMasterPage");
                oRouter.attachPatternMatched(this.handleRouteMatched, this);
            },
            handleRouteMatched: function (oEvent) {
                // ;
                BusyIndicator.hide();
                this.getView().byId("onSearchMasterData").setValue("");
                this._getUserAttributes();
            },
            _getUserAttributes: function () {
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var attr = appModulePath + "/user-api/attributes";

                that._sUserID = "priya.g@intellectbizware.com";
                that._sUserName = "Priya Gawde";
                var oModel = new JSONModel({
                    userId: that._sUserID,
                    userName: that._sUserName
                });
                this.getOwnerComponent().setModel(oModel, "userModel");
                this.readUserMasterData(that._sUserID);
                // this.sampleData();

                // return new Promise(function (resolve, reject) {
                //     $.ajax({
                //         url: attr,
                //         type: 'GET',
                //         contentType: 'application/json',
                //         success: function (data, response) {
                //             var obj = {
                //                 userId: data.email.toLowerCase(),
                //                 userName: data.firstname + " " + data.lastname
                //             }
                //             var oModel = new JSONModel(obj);
                //             that.getOwnerComponent().setModel(oModel, "userModel");
                //             that._sUserID = data.email.toLowerCase();
                //             that.readUserMasterData(that._sUserID);
                //         },
                //         error: function (oError) {
                //             MessageBox.error("Error while reading User Attributes");
                //         }
                //     });
                // });
            },
            calView : function(){
            var userEmail = that._sUserID;
			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'REG'";
			// var data = { $expand: 'TO_USER_ENTITIES' };
                var hLevelArr = [];
                return new Promise(function(resolve,reject){
				$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
						// ;
						// for(var i = 0; i < data.value.length; i++){
                        //     var hierarchyId = data.value[i].HIERARCHY_ID;
                        //     hIdArr.push(hierarchyId);
                        // }

                    var mHierarchyLevel = data.value.map((x)=>{if(x.USER_IDS.includes(that._sUserID)){return x.LEVEL}});
					for(var i = 0; i < mHierarchyLevel.length; i++){
					if(mHierarchyLevel[i] === undefined || mHierarchyLevel[i] === null || mHierarchyLevel[i] === "")
					{
						continue;
					}
					else
					{
						hLevelArr.push(mHierarchyLevel[i]);
					}
				}
					resolve(hLevelArr);
                        // resolve(hIdArr);
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
            })
            },
            calViewEntity : function(){
                var userEmail = that._sUserID;
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'REG'"
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

            _readData: async function (oFilter, oFilterOn, oFilter2) {
                // ;
                BusyIndicator.show();
                var userId = that.getOwnerComponent().getModel("userModel").getProperty("/userId");
                var hierarchyLevel = await that.calView();
                // ;
                var entityCode = await that.calViewEntity();
                var sFinalString = "";
                if(entityCode.length === 0){
                    MessageBox.error("")
                }

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

                // var sValue = "";

                // for (var i = 0; i < hierarchyId.length; i++) {
                //     if (i < hierarchyId.length - 1) {
                //         var concat = "HIERARCHY_ID eq '" + hierarchyId[i] + "'";
                //         sValue = sValue + concat + " or ";
                //     }else {
                //         var concat = "HIERARCHY_ID eq '" + hierarchyId[i] + "'";
                //         sValue = sValue + concat;
                //     }
                // }


                var sConcat = "(" + sFinalString + ")";

                if (oFilter === undefined || oFilterOn === "None") {
                    var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY),TO_CONTACTS,TO_STATUS&$filter=(STATUS eq 5 or STATUS eq 6 or STATUS eq 9 or STATUS eq 10 or STATUS eq 13) and "+ sConcat +"";
                    // NEXT_APPROVER eq '"+userId+"' and "+that.entity_Code+" and 
                }
                else if (oFilterOn === "Country") {
                    var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY;$filter=" + oFilter + " and ADDRESS_TYPE eq 'HQ'),TO_CONTACTS,TO_STATUS&$filter=STATUS eq 5 or STATUS eq 6 or STATUS eq 9 or STATUS eq 10 or STATUS eq 13 and "+ sConcat +"";
                    // NEXT_APPROVER eq '"+userId+"' and "+that.entity_Code+" and 
                }
                else if(oFilterOn === "MultipleFilter"){
                    var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY;$filter="+oFilter+ " and ADDRESS_TYPE eq 'HQ'),TO_CONTACTS,TO_STATUS&$filter="+that.entity_Code+" and " + oFilter2 + "";
                }
                else {
                    var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$expand=TO_ENTITY_CODE,TO_ADDRESS($expand=TO_COUNTRY),TO_CONTACTS,TO_STATUS&$filter="+that.entity_Code+" and " + oFilter + "";
                }
                var data = null;
                this.postAjax(url, "GET", data, "onBoarding", oFilterOn);

            },
            postAjax: function (url, type, data, model, filterOn) {
                var arr = [];
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
                        // ;
                        BusyIndicator.hide();
                        if (type === "GET") {
                            if (filterOn === undefined) {
                                filterOn = null;
                            }
                            if (model != "countrySet" && filterOn === null) {
                                for (var i = 0; i < data.value.length; i++) {
                                    data.value[i].REQUEST_NO = String(data.value[i].REQUEST_NO);
                                }
                                var oModel = new JSONModel(data.value);
                                context.getView().setModel(oModel, model);
                            }
                            else if (filterOn === "Country" || filterOn === "MultipleFilter") {

                                for (var i = 0; i < data.value.length; i++) {
                                    if (data.value[i].TO_ADDRESS.length < 1) {
                                        data.value.splice(i, 1);
                                        i = -1;
                                    }
                                    else if (data.value[i].TO_ADDRESS[0].ADDRESS_TYPE === 'OTH') {
                                        data.value.splice(i, 1);
                                        i = -1;
                                    }
                                }
                                var oModel = new JSONModel(data.value);
                                context.getView().setModel(oModel, model);
                            }
                            else {
                                var oModel = new JSONModel(data.value);
                                oModel.setSizeLimit(data.value.length);
                                context.getView().setModel(oModel, model);
                            }
                        }
                    },
                    error: function (error) {
                        BusyIndicator.hide();
                        var oXML, oXMLMsg;
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
                // debugger;
                var creationType = oEvent.getSource().getBindingContext("onBoarding").getProperty("CREATION_TYPE");
                var bpTypCode = oEvent.getSource().getBindingContext("onBoarding").getProperty("BP_TYPE_CODE");
                var requestNo = oEvent.getSource().getBindingContext("onBoarding").getProperty("REQUEST_NO");
                var Ventity = oEvent.getSource().getBindingContext("onBoarding").getProperty("ENTITY_CODE");
                var status = oEvent.getSource().getBindingContext("onBoarding").getProperty("STATUS");
                var createdBy = oEvent.getSource().getBindingContext("onBoarding").getProperty("COMPLETED_BY");
                var createdOn = oEvent.getSource().getBindingContext("onBoarding").getProperty("CREATED_ON");
                var aLevel = oEvent.getSource().getBindingContext("onBoarding").getProperty("APPROVER_LEVEL")

                //Get data in obj and set in json model.
                var navObj = {
                    "USER_ID": context._sUserID,
                    "UNAME": context._sUserName,
                    "ENTITY_CODE": Ventity,
                    "STATUS": status,
                    "CREATED_BY": createdBy,
                    "CREATED_ON": createdOn,
                    "CREATION_TYPE": creationType,
                    "BP_TYPE_CODE": bpTypCode,
                    "APPROVER_LEVEL" : aLevel 
                };

                var oViewModel = new sap.ui.model.json.JSONModel(navObj);
                // this.getOwnerComponent().setModel(oViewModel, "distributorDetail");
                this.getOwnerComponent().setModel(oViewModel, "vendorDetail");
                //Navigate to detail page.
                BusyIndicator.show();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDetailPage", {
                    RequestNO: requestNo
                });
                // window.onpopstate = function (event) {
                //     var sPath = window.location.href.split("UI5");
                //     var slocation = window.location.href.split("&/")[1];
                //     var baz = { baz: true };
                //     history.pushState(baz, document.title, "#iven_registration_approval-display&/" + slocation);
                // }
            },
            handleRefresh: function () {
                var that = this;
                this.getView().byId("onSearchMasterData").setValue("");
                if (that.filterdialog === true) {
                    that._oViewSettingsDialog.clearFilters();
                }
                if (this.filterfrag2) {
                    this.filterfrag2.destroy();
                    this.filterfrag2 = null;
                }
                context._readData();
            },
            onselectDropdown: function (oEvent) {
                var visible = this.getView().byId("user_id").getVisible();
                if (visible === false) {
                    this.getView().byId("user_id").setVisible(true);
                } else {
                    this.getView().byId("user_id").setVisible(false);
                }
            },
            onConfirmViewSettingsDialog: function (oEvent) {
                var that = this;
                var countryData = [];
                var mulitipleFilter = [];
                var multipleFields = [];
                var ocountryFilter;
                var oFilterOn = "None"
                var aFilterItems = oEvent.getParameters().filterItems;
                var dateValue = sap.ui.getCore().byId("date_fId");
                var aFilters = [];
                var sFinalString = "";
                var finalString;
                aFilterItems.forEach(function (oItem) {
                    oFilterOn = "Country";
                    var oSelectedKey = oItem.getKey();
                    sFinalString = oSelectedKey;
                    if (sFinalString !== "") {
                        countryData.push(sFinalString);
                    }
                });
                if (countryData.length > 1) {
                    for (var i = 0; i < countryData.length; i++) {
                        mulitipleFilter.push("TO_COUNTRY/LAND1 eq '" + countryData[i] + "'");
                    }
                    aFilters = mulitipleFilter.join(" or ");
                    multipleFields.push(aFilters);
                }
                else {
                    if (sFinalString !== "") {
                        aFilters = "TO_COUNTRY/LAND1 eq '" + sFinalString + "'";
                        multipleFields.push(aFilters);
                    }
                }
                ocountryFilter = aFilters;

                if (dateValue.getValue()) {
                    oFilterOn = "Date"
                    var sStatus = "(STATUS eq 5 or STATUS eq 6 or STATUS eq 9 or STATUS eq 13)"
                    var fDate = dateValue.getDateValue().toISOString();
                    var tDate = dateValue.getSecondDateValue().toISOString();
                    var gtDate = "(CREATED_ON gt " + fDate + ")";
                    var ltDate = "(CREATED_ON lt " + tDate + ")";
                    aFilters = gtDate + " and " + ltDate + " and " + sStatus;
                    multipleFields.push(aFilters);
                    sap.ui.getCore().byId("date_fId").setValue("");
                }
                if (multipleFields.length > 1) {
                    var dateRangeFilter = gtDate + " and " + ltDate + " and " + sStatus;
                    oFilterOn = "MultipleFilter";
                }
                if (oFilterOn === "MultipleFilter") {
                    that._readData(ocountryFilter, oFilterOn, dateRangeFilter);
                }
                else {
                    that._readData(aFilters, oFilterOn);
                }
            },
            _handleCounrtySet: function () {
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterCountry";
                this.postAjax(url, "GET", null, "countrySet");
            },
            onSearch: function (oEvent) {
                var sQuery = oEvent.getSource().getValue();
                var oTable = this.getView().byId("idRegistrationApprovalTable");
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
            onFilter: function (oEvent) {
                var that = this;
                if (that.filterdialog === true) {
                    that._oViewSettingsDialog.clearFilters();
                }
                that._handleCounrtySet();
                if (!this._oViewSettingsDialog) {
                    this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.filterDialog", this);
                    this.getView().addDependent(this._oViewSettingsDialog);
                }
                this._oViewSettingsDialog.open();

                that.filterdialog = true;
            },
            onCancelFilter: function (oEvent) {
                context._oViewSettingsDialog.clearFilters();
                context._readData();
            },
            handleSort: function (oEvent) {
                if (!this.filterfrag2) {
                    this.filterfrag2 = sap.ui.xmlfragment("com.ibs.ibsappidealregistrationapproval.view.fragments.Sort", this);
                    this.getView().addDependent(this.filterfrag2);
                }
                this.filterfrag2.open();
            },
            handleConfirm: function (oEvent) {
                var sPath = "";
                var bDescending = "";
                var oView = this.getView();
                var oTable = oView.byId("idRegistrationApprovalTable");
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
            },
            handleSortDialogConfirm: function (oEvent) {
                var oTable = this.byId("idRegistrationApprovalTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];

                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },
            readUserMasterData: function (userEmail) {
                var that = this;
                var entityCodeArr = [];
                var oEntityCode;
                var userDetailModel = new JSONModel();
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
                var data = { $expand: 'TO_USER_ENTITIES' };

                $.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
                        if (data.value.length === 0) {
                            MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                        }
                        else {
                            oEntityCode = data.value[0].TO_USER_ENTITIES;

                            if (oEntityCode.length > 0) {
                                for (var i = 0; i < oEntityCode.length; i++) {
                                    entityCodeArr.push("ENTITY_CODE eq '" + oEntityCode[i].ENTITY_CODE + "'");
                                }
                            }
                            else {
                                MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                            }

                            if (entityCodeArr.length > 1) {
                                that.entity_Code = "(" + entityCodeArr.join(" or ") + ")";
                            }
                            else {
                                that.entity_Code = entityCodeArr[0];
                            }
                            userDetailModel.setData(data.value[0]);
                            that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");
                            that._readData();
                        }
                    },
                    error: function (error) {
                        var oXML, oXMLMsg;
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
        });
    });

