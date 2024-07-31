sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/ibs/ibsappidealrequestmanagement/model/formatter",
    "sap/ui/core/BusyIndicator",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/ui/core/Core"
],
function (BaseController, JSONModel, MessageBox, Filter, FilterOperator, formatter, BusyIndicator, Dialog, Button, Label, mobileLibrary, MessageToast, Text, TextArea, Core) {
    "use strict";
    var ButtonType = mobileLibrary.ButtonType;
    var DialogType = mobileLibrary.DialogType;
    var that;
    var appModulePath;
    var sEntity;
    var andFilter;
    var orFilter;
    var aSupplierType = [];
    var flagOne = false;
    var flagTwo = false;
    var flagThree = false;
    var flagFour = false;
    var suggestFlag = null;
    var context = null;
    var oObj,temp;
    return BaseController.extend("com.ibs.ibsappidealrequestmanagement.controller.MasterPage", {
        formatter: formatter,
        onInit: function () {
            // debugger;
            that = this;
            context = this;
            that.oPModel = this.getOwnerComponent().getModel("oPropertyModel");
            that.cloudService = this.getOwnerComponent().getModel();
            that.oDataModel = this.getOwnerComponent().getModel("onPremiseModel");
            this.oMockData(); //added for mock JSON remove in future
            this._getUserAttributes();
            this.readTypeData([]);
            this.readBPTypeData();
            this.readStatusData();
            this.readTypeDataEdit();


            var oObject = {
                "REQUEST_TYPE_FROM_DESC": null,
                "SUB_TYPE_FROM_DESC": null,
                "PRE_REQUEST_TYPE_CODE": null,
                "PRE_SUPPL_TYPE_CODE": null,
                "PRE_SUBTYPE_TYPE_CODE": null,
                "PRE_SUPPL_TYPE_DESC": null
            };
            var oTableJson = new JSONModel(oObject);
            this.getView().setModel(oTableJson, "fragmentModel");
            
            // this.dynamicReadCall(that.oDataModel, "/GetAccountGrpSet", "suppModel", []);
           
            // this.dynamicReadCall(that.oDataModel, "/BPTypeSet", "bpTypeJson", []);
        },
        _getUserAttributes: function () {
            // 
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);
            var attr = appModulePath + "/user-api/attributes";

            // that._sUserID = "darshan.l@intellectbizware.com";
            // that._sUserName = "Darshan Lad";
            // that.readUserMasterData(that._sUserID);
            // that.readUserMasterEntities();

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: attr,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, response) {

                        that._sUserName = data.firstname + " " + data.lastname;
                        that._sUserID = data.email.toLowerCase().trim();
                        that.readUserMasterData(that._sUserID);
                        that.readUserMasterEntities();
                    },
                    error: function (oError) {
                        MessageBox.error("Error while reading User Attribute");
                    }
                });
            });
        },
        onLink:function(){
            // 
            var additionalHash = "&/editDetails/100000454";
            that.crossNavigation("1104321","iven_registration_approval",additionalHash,{});
        },

        readVendorMasterS4Hana: function (oFilter) {
            
            if (that.getView().getModel("vendorDataModel") === undefined) {
                BusyIndicator.show(0);
                var oArray = [];
                oArray.push(sEntity[0]);
                that.oDataModel.read("/GetCustomersSet", {
                    // filters: andFilter,
                    // or: true,
                    filters: sEntity,
                    or: true,
                    success: function (data) {
                        BusyIndicator.hide(0);
                        var vendorModel = new JSONModel();
                        vendorModel.setData(data);
                        if (data.results.length) {
                            vendorModel.setSizeLimit(data.results.length);
                        }
                        that.getView().setModel(vendorModel, "vendorDataModel");
                    },
                    error: function (e) {
                        BusyIndicator.hide(0);

                        //that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                        var oXMLMsg, oXML;
                        if (that.isValidJsonString(e.responseText)) {
                            oXML = JSON.parse(e.responseText);
                            oXMLMsg = oXML.error.message.value;
                        } else {
                            oXMLMsg = error.responseText
                        }
                        MessageBox.error(oXMLMsg);
                    }
                });
            }
        },

        //to check role
        readUserMasterData: function (sUserEmail) {
            // 
            jQuery.sap.delayedCall(100, this, function () {
                BusyIndicator.show();
            });

            //to hide fields based on roles
            // var oIconTabBarFragment = sap.ui.getCore().byId("idIconTabBarNoIcons").getSelectedKey()
            // var sTabKeyToHide = "RequestChangeKey";/

            var oIconTabBar = this.getView().byId("idIconTabBar");

            // if () {
            this.getView().byId("AllTab").setVisible(true)

            var url = appModulePath + "/odata/v4/ideal-request-process-srv/MasterIdealUsers?$filter=(EMAIL eq '" + that._sUserID + "') and (ACTIVE eq 'X')";
            this.postAjax(url, "GET", null, "userDetailsModel", null);

        },
        getUserRole : function(){
            var sRoleArry=[];
            var tRole;
            //aniket edit
            var urlRole = appModulePath + "/odata/v4/ideal-request-process-srv/MasterIdealUsers?$filter=(EMAIL eq '" + that._sUserID + "') and (ACTIVE eq 'X')";
            return new Promise(function(resolve,reject){
            $.ajax({
                url: urlRole,
                type: 'GET',
                data: null,
                contentType: 'application/json',
                success: function (data, responce) {
                    BusyIndicator.hide();
                    // debugger; 
                    for(var i = 0; i < data.value.length;i++){
                        sRoleArry.push(data.value[i].USER_ROLE);
                    }
                    if(sRoleArry.length === 2)
                    {
                        tRole = sRoleArry[0];
                    }
                    else{
                        tRole = sRoleArry[0];
                    }
                    resolve(tRole);
                },
                error: function (e) {
                    // 
                    BusyIndicator.hide();
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                    var oXMLMsg, oXML;
                    if (that.isValidJsonString(e.responseText)) {
                        oXML = JSON.parse(e.responseText);
                        oXMLMsg = oXML.error.message;
                    } else {
                        oXMLMsg = e.responseText;
                    }
                    MessageBox.error(oXMLMsg);
                }
            });
        });
        },
        //read usermaster
        readUserMasterEntities: async function (aFilter, key) {
            var tRole = await that.getUserRole();
            // EntityFilters = aFilter;
            // var hierarchyId = await that.calView();
            var EntityFilters = aFilter, aEntityArray;
            var sSelectedKey = that.getView().byId("idIconTabBar").getSelectedKey() || null;

            if((aFilter === undefined || aFilter === null || aFilter === "") && sSelectedKey === "NotInvited"){
                sSelectedKey = null;
            }

            // and (USER_ROLE eq 'BYR')
            var url = appModulePath + "/odata/v4/ideal-request-process-srv/UserMasterEntities?$filter=(EMAIL eq '" + that._sUserID + "') and (USER_ROLE eq '" + tRole + "') and (ACTIVE eq 'X')";
            jQuery.sap.delayedCall(100, this, function () {
                BusyIndicator.show();
            });
            $.ajax({
                url: url,
                type: 'GET',
                data: null,
                contentType: 'application/json',
                success: function (data, responce) {
                    
                    BusyIndicator.hide();
                    aEntityArray = data.value;
                    // for(var i = 0;i <= aEntityArray.length;i++)
                    // {
                    // var distinctEntityValues = new Set(aEntityArray[i].ENTITY_CODE);
                    // var distinctEntityArray = [...distinctEntityValues];
                    // }
                   
                    // if(data.value.length > 1){
                    //     // for(var i = 0;i < data.value.length;i++){
                    //         if (data.value[0].USER_ROLE === 'SA' &&  data.value[1].USER_ROLE === 'CM' || data.value[0].USER_ROLE === 'CM' &&  data.value[1].USER_ROLE === 'SA') {
                    //             that.oPModel.setProperty("/CreateReq", true);
                    //             that.oPModel.setProperty("/DeleteButton", true);
                    //             that.oPModel.setProperty("/EmailButton", true);
                    //         } 
                    //     // }
                    // }else{

                    for(var i = 0;i < data.value.length;i++){
                        if(data.value[0].USER_ROLE === 'CM' || data.value[0].USER_ROLE === 'SA'  && data.value[i].USER_ROLE === 'SA' || data.value[i].USER_ROLE === 'CM')
                        {
                            that.oPModel.setProperty("/CreateReq", true);
                            that.oPModel.setProperty("/DeleteButton", true);
                            that.oPModel.setProperty("/EmailButton", true);
                        }
                        else{
                            if (data.value[0].USER_ROLE === 'SA') {
                                that.oPModel.setProperty("/CreateReq", true);
                                that.oPModel.setProperty("/DeleteButton", false);
                            } else if (data.value[0].USER_ROLE === 'CM') {
                                that.oPModel.setProperty("/CreateReq", false);
                                that.oPModel.setProperty("/EmailButton", true);
                                that.oPModel.setProperty("/DeleteButton", true);
                            }
                        }
                } 
                        
                    // }
                    
                    //created model and binded to invite fragment in entity
                    var oModel = new JSONModel(data.value)
                    that.getView().setModel(oModel, "EntityDropDownModel")
                    sEntity = [];
                    andFilter = [];
                    orFilter = [];

                    for (var k = 0; k < data.value.length; k++) {
                        //sEntity.push(data.value[k].ENTITY_CODE)
                        var EntCode = data.value[k].ENTITY_CODE;
                        sEntity.push(new Filter("Bukrs", FilterOperator.EQ, EntCode));

                        orFilter.push(new Filter("Bukrs", FilterOperator.EQ, EntCode));
                    }
                    andFilter.push(new Filter(orFilter, false));

                    if (aEntityArray.length > 0) {
                        var sValue = "";
                        for (var i = 0; i < aEntityArray.length; i++) {
                            if (i < aEntityArray.length - 1) {
                                var concat = "(ENTITY_CODE eq '" + aEntityArray[i].ENTITY_CODE + "')";
                                sValue = sValue + concat + " or ";
                            }
                            else {
                                var concat = "(ENTITY_CODE eq '" + aEntityArray[i].ENTITY_CODE + "')";
                                sValue = sValue + concat;
                            }
                        }
                        var sConcat = "(" + sValue + ")";

                        var sStatus = "";
                        if (key !== 'status') {
                            sStatus = "((STATUS eq 1) or (STATUS eq 2) or (STATUS eq 3) or (STATUS eq 4) or (STATUS eq 5) or (STATUS eq 6) or (STATUS eq 7) or (STATUS eq 8) or (STATUS eq 9) or (STATUS eq 10) or (STATUS eq 11) or (STATUS eq 12) or (STATUS eq 13) or (STATUS eq 14) or (STATUS eq 15) or (STATUS eq 21) or (STATUS eq 27))";
                        }
                        // if (aEntityArray.length > 0) {
                        //     var hierarValue = "";
                        // for (var i = 0; i < hierarchyId.length; i++) {
                        //     if (i < hierarchyId.length - 1) {
                        //         var concat = "(HIERARCHY_ID eq '" + hierarchyId[i] + "')";
                        //         hierarValue = hierarValue + concat + " or ";
                        //     }
                        //     else {
                        //         var concat = "(HIERARCHY_ID eq '" + hierarchyId[i] + "')";
                        //         hierarValue = hierarValue + concat;
                        //     }
                        // }
                    // }
                    // var hConcat = "(" + hierarValue + ")";
                    var userid = "(REQUESTER_ID eq '" + that._sUserID + "')"
                        if (sStatus !== "" && sStatus !== null && sStatus !== undefined) {
                            aFilter = sConcat + " and " + sStatus + " and " + userid;
                        }else {
                            aFilter = sConcat
                        }

                        if (EntityFilters !== "" && EntityFilters !== null && EntityFilters !== undefined) {
                            aFilter = sConcat + " and " + EntityFilters + " and " + userid;
                        }
                        // that.onFilterSelect()
                        that.readVendorMasterS4Hana();
                        that.readEntityData(aFilter, sSelectedKey)
                    }else{
                        MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                    }
                    
                    // else {
                    //     MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
                    // }
                },
                error: function (e) {
                    // 
                    BusyIndicator.hide();
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                    var oXMLMsg, oXML;
                    if (that.isValidJsonString(e.responseText)) {
                        oXML = JSON.parse(e.responseText);
                        oXMLMsg = oXML.error.message;
                    } else {
                        oXMLMsg = e.responseText;
                    }
                    MessageBox.error(oXMLMsg);
                }
            });
        },
        //Entity Type chnage
        handleEntityCodeCb: function (oEvent) {
            var entity = sap.ui.getCore().byId("id_entity");
            if (entity.getSelectedKey() == "") {
                entity.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select Entity.");
                entity.focus();
                bFlag = false;
            } else entity.setValueState(sap.ui.core.ValueState.None);
            var oSelected = oEvent.getSource().getSelectedItem().getBindingContext("EntityDropDownModel").getObject();
            that.getView().getModel("tableJsonModel").getData().VENTITY = oSelected.ENTITY_CODE;
            that.getView().getModel("tableJsonModel").getData().VENTITYDESC = oSelected.ENTITY_DESC;

        },
        // GET HIERARCHY ID
        // calView : function(){
        //     // debugger;
        // // var vendorDetailsData2 = this.getOwnerComponent().getModel("vendorDetail").getData();
        // // var eCode = vendorDetailsData2.ENTITY_CODE;
        // // var appLevel = vendorDetailsData2.APPROVER_LEVEL;
        // // var hType = "REG";
        // var userEmail = that._sUserID;
        // var url = appModulePath + "/odata/v4/ideal-registration-form-srv/CalcHierarchyMatrix?$filter=(USER_IDS eq '" + userEmail + "')";
        // // var data = { $expand: 'TO_USER_ENTITIES' };
        //     var hIdArr = [];
        //     return new Promise(function(resolve,reject){
        // 	$.ajax({
        //         url: url,
        //         type: "GET",
        //         contentType: 'application/json',
        //         // data: data,
        //         success: function (data, response) {
        // 			// debugger;
        // 			for(var i = 0; i < data.value.length; i++){
        //                 var hierarchyId = data.value[i].HIERARCHY_ID;
        //                 hIdArr.push(hierarchyId);
        //             }
        //             resolve(hIdArr);
        // 		},
        //         error: function (error) {
        // 			// debugger;
        //             // BusyIndicator.hide();
        // 			var oXML,oXMLMsg;
        // 			if (context.isValidJsonString(error.responseText)) {
        // 				oXML = JSON.parse(error.responseText);
        // 				oXMLMsg = oXML.error["message"];
        // 			} else {
        // 				oXMLMsg = error.responseText
        // 			}
        //             MessageBox.error(oXMLMsg);
        //         }
        //     });
        // })
        // },

        //read master table
        readEntityData: function (aFilter, sSelectedKey) {

            var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo?$filter=" + aFilter;
            // if (aFilter === undefined) {
            //     var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo";
            // }
            // else {
            //     var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo?$filter=" + aFilter;
            // }

            var data = { $expand: 'TO_STATUS,TO_ENTITY_CODE,TO_REQUEST_TYPE' }

            this.postAjax(url, "GET", data, "vendorjsonModel", null, sSelectedKey);

        },
        //table filter
        onFilter: function (oEvent) { 
            if (!this._oViewSettingsDialog) {
                this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.filterDialog", this);
                this.getView().addDependent(this._oViewSettingsDialog);
            }

            var Icontabbar = this.getView().byId("idIconTabBar").getSelectedKey()

            if (Icontabbar === "NotInvited") {
                if (!this._oViewSettingsDialogCopy) {
                    this._oViewSettingsDialogCopy = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.filterDialogCopy", this);
                    this.getView().addDependent(this._oViewSettingsDialogCopy);
                }
                this._oViewSettingsDialogCopy.open();
                return
            } else if (Icontabbar === "Invited") {
                if (!this._oViewSettingsDialogCopy) {
                    this._oViewSettingsDialogCopy = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.filterDialogCopy", this);
                    this.getView().addDependent(this._oViewSettingsDialogCopy);
                }
                this._oViewSettingsDialogCopy.open();
                return
            } else if (Icontabbar === "InviteRejected") {
                if (!this._oViewSettingsDialogCopy) {
                    this._oViewSettingsDialogCopy = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.filterDialogCopy", this);
                    this.getView().addDependent(this._oViewSettingsDialogCopy);
                }
                this._oViewSettingsDialogCopy.open();
                return
            } else if (Icontabbar === "Deleted") {
                if (!this._oViewSettingsDialogCopy) {
                    this._oViewSettingsDialogCopy = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.filterDialogCopy", this);
                    this.getView().addDependent(this._oViewSettingsDialogCopy);
                }
                this._oViewSettingsDialogCopy.open();
                return
            }
            else { this._oViewSettingsDialog.open(); }




            // this._oViewSettingsDialog.open();

            that.readTypeData([]);
            that.readStatusData();
            that.filter = true;
        },
        //for filter
        getStatusformat: function (sValue) {
            // 
            if (sValue == "Request Pending") {
                return "1";
            } else if (sValue == "Invited") {
                return "2";
            } else if (sValue == "Invite Rejected") {
                return "3";
            }
            else if (sValue == "Form In Progress") {
                return "4"
            }
            // else if (sValue == "In Approval - SALES ASSOCIATE") {
            //     return "5"
            // }
            else if (sValue == "Form Submitted") {
                return "6"
            }
            else if (sValue == "Form Sent Back") {
                return "7"
            }
            else if (sValue == "Form Rejected") {
                return "8"
            }
            // else if (sValue == "In Approval - SA Team (Resubmit)") {
            //     return "9"
            // }
            else if (sValue == "In Approval-REG") {
                return "10"
            }
            else if (sValue == "Registered") {
                return "11"
            }
            else if (sValue == "Invite Resent") {
                return "12"
            }
            // else if (sValue == "Rejected - CM") {
            //     return "13"
            // }
            else if (sValue == "Request Deleted") {
                return "14"
            }else if (sValue == "In Approval-REQ") {
                return "15"
            }
            // else if (sValue == "SES Created") {
            //     return "21"
            // }else if (sValue == "SES Deleted") {
            //     return "27"
            // }
        },
        //for filter
        getReqformat: function (sValue) {
            // 
            if (sValue == "Create Normal") {
                return "1";
            } else if (sValue == "Create Low Value") {
                return "2";
            } else if (sValue === "Create Exceptional") {
                return "3";
            } else if (sValue == "Extend Supplier") {
                return "4";
            } else if (sValue == "Update Request") {
                return "5";
            } else if (sValue == "Create Subsidiary") {
                return "6";
            } else if (sValue == "Quick Registration") {
                return "7";
            }
        },

        //filter confirm
        onConfirmViewSettingsDialog: function (oEvent) {
            debugger;
            var aFilterItems = oEvent.getParameters().filterItems;
            var aFilters = [], statusFilter = "", requestTypeFilter = "", finalFilter = "";
            var filterItem = "";
            var sKey = that.getView().byId("idIconTabBar").getSelectedKey() || null;
            if (sKey == "Invited") {
                filterItem = "status";
                statusFilter = "(STATUS eq 2)";
            }
            else if (sKey == "NotInvited") {
                filterItem = "status";
                statusFilter = "(STATUS eq 1)";
            }
            else if (sKey == "InviteRejected") {
                filterItem = "status";
                statusFilter = "(STATUS eq 3)";
            }
            else if (sKey == "Deleted") {
                filterItem = "status";
                statusFilter = "(STATUS eq 14)";
            }

            var oModel = this.getView().getModel("masterstatusModel").getData().value

            aFilterItems.forEach(function (oItem) {
                if (oItem.getKey() === "status") {
                    filterItem = "status";
                    var status = that.getStatusformat(oItem.getText());
                    status = Number(status);
                    if (statusFilter.length === 0) {
                        statusFilter = "(STATUS eq " + status + ")";
                    } else {
                        statusFilter = statusFilter + " or (STATUS eq " + status + ")";
                    }
                }
                if (oItem.getKey() === "request") {
                    var req = that.getReqformat(oItem.getText());
                    req = Number(req);
                    if (requestTypeFilter.length === 0) {
                        requestTypeFilter = "(REQUEST_TYPE eq " + req + ")";
                    } else {
                        requestTypeFilter = requestTypeFilter + " or (REQUEST_TYPE eq " + req + ")";
                    }
                }
            });

            var pattern = /or/;
            if (pattern.test(statusFilter)) {
                statusFilter = "(" + statusFilter + ")"
            }
            if (pattern.test(requestTypeFilter)) {
                requestTypeFilter = "(" + requestTypeFilter + ")"
            }
            if (statusFilter !== "" && requestTypeFilter !== "") {

                finalFilter = statusFilter + " and " + requestTypeFilter;
            } else if (statusFilter !== "") {
                finalFilter = statusFilter;
            } else if (requestTypeFilter !== "") {
                finalFilter = requestTypeFilter;
            }

            that.readUserMasterEntities(finalFilter, filterItem);
        },
        //reset filter
        onResetFilter: function () {
            // 
            that.check()

            that.getView().byId("id_search").setValue();
            // if (that.filter === true) {
            //     that.filter = false;
            //     this._oViewSettingsDialog.clearFilters();
            //     this._oViewSettingsDialogCopy.clearFilter();
            // }

            if (this._oViewSettingsDialog) {
                this._oViewSettingsDialog.clearFilters();
            }

            // Clear filters for _oViewSettingsDialogCopy
            if (this._oViewSettingsDialogCopy) {
                this._oViewSettingsDialogCopy.clearFilters();
            }



            that.filter = false;
            that.resetSortingDialog()


        },

        //sort 
        onSort: function (oEvent) {
            // 
            if (!this._aDialog1) {
                this._aDialog1 = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.sortDialog", this);
                that.getView().addDependent(this._aDialog1);
            }
            this._aDialog1.open();


        },
        //sort confirm
        handleSortDialogConfirm: function (oEvent) {
            
            var oTable = this.getView().byId("idMasterTable");
            var mParams = oEvent.getParameters();
            var oBinding = oTable.getBinding("items");
            var aSorters = [];
            //apply Sorter
            var sPath = mParams.sortItem.getKey();
            var bDescending = mParams.sortDescending;
            aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
            oBinding.sort(aSorters);

        },
        //resetsort fragment cancel

        resetSortingDialog: function () {
            // 
            if (this._aDialog1) {
                // this._aDialog1.close();
                this._aDialog1.destroy();
                this._aDialog1 = null;
            }
        },

        //Table search
        onSearch: function (oEvent) {
            // 
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var oFilter1 = [new sap.ui.model.Filter("DIST_NAME1", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("REGISTERED_ID", sap.ui.model.FilterOperator.Contains, sQuery)
                ];
                var allFilters = new sap.ui.model.Filter(oFilter1, false);
                aFilters.push(allFilters);
            }
            var oList = this.byId("idMasterTable");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        },

        //Invite Create Fragment            
        handleInviteDialog: function () {
            
            if (!this.inviteDialog) {
                this.inviteDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.invite", this);
                this.getView().addDependent(this.inviteDialog);
            }
            this.inviteDialog.open();

            var oDistObject = {
                "VNAME": "",
                "SUPPLIER_TYPE": "",
                "SUPPLIER_DESC": "",
                "BP_TYPE_CODE": "",
                "BP_TYPE_DESC": "",
                "VCODE": "",
                "VEMAIL": "",
                "VENTITY": "",
                "STATUS": "",
                "VENTITYDESC": "",
                "COMMENT": "",
                "SAP_DIST_CODE": "",
                "IDEAL_DIST_CODE": null,
                "CREATION_TYPE": null,
                "BUYER_ASSIGN_CHECK": null,
                "MOBILE_NO" : ""
                // "NDA_TYPE": ""
            };
            var oTableJson = new JSONModel(oDistObject);
            that.getView().setModel(oTableJson, "tableJsonModel");
            var aFilter = [];



            // that.handleValueEntityHelp("", aFilter);
            that.readTypeData([]);


            if (this.getView().getModel("userDetailsModel").getData().length === 0) {
                MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
            } else {
                this.inviteDialog.open();
                that.oPModel.setProperty("/valName", false);
                that.oPModel.setProperty("/valEmail", false);
                that.oPModel.setProperty("/valEntity", false);
                that.oPModel.setProperty("/valSuppType", false);
                that.oPModel.setProperty("/valBPType", false);
                that.oPModel.setProperty("/valNDAType", false);
                that.oPModel.setProperty("/valComment", false);
                that.oPModel.setProperty("/submitBtn", false);
                that.oPModel.setProperty("/valCreateType", false);
                that.oPModel.setProperty("/resetBtn", true);
                that.oPModel.setProperty("/sapCode", false);
                sap.ui.getCore().byId("id_vendor").setFilterFunction(function (sTerm, oItem) {
                    // A case-insensitive "string contains" style filter
                    return oItem.getText().match(new RegExp(sTerm, "i"));
                });
            }
        },


        // dynamicRead call
        dynamicReadCall: function (Service, sEntityName, sModelName, aFilter, urlParameters) {
            // 
            // Service.sServiceUrl = appModulePath + Service.sServiceUrl;
            BusyIndicator.show();
            Service.read(sEntityName, {
                filters: aFilter,
                urlParameters: urlParameters,
                success: function (Data, response) {

                    BusyIndicator.hide();
                    var oModel = new JSONModel(Data);
                    that.getView().setModel(oModel, sModelName)

                    if (sEntityName == "/GetVendorsSet") {

                        if (Data.results.length === 0) {
                            Data = that.getOwnerComponent().getModel("mockdata").getData();
                            var vendorModel = new JSONModel();
                            vendorModel.setData(Data);
                            if (Data.results.length) {
                                vendorModel.setSizeLimit(Data.results.length);
                            }
                            that.getView().setModel(vendorModel, "vendorDataModel");
                        }
                    }
                    else if (sEntityName == "/GetAccountGrpSet") {
                        aSupplierType = Data;
                        var suppModel = new JSONModel(Data.results);
                        if (Data.results.length) {
                            suppModel.setSizeLimit(Data.results.length);
                            that.getView().setModel(suppModel, "suppModel");
                        }
                    }
                    else if (sEntityName == "/BPTypeSet") {
                        var vendorModel = new JSONModel();
                        vendorModel.setData(Data);

                        that.getView().setModel(vendorModel, "bpTypeJson");
                    }


                },
                error: function (e) {
                    BusyIndicator.hide();
                    // that.errorLogCreation(e.responseText, e.statusCode, null,
                    //     that._sUserID);
                    var oXMLMsg, oXML;
                    if (that.isValidJsonString(e.responseText)) {
                        oXML = JSON.parse(e.responseText);
                        oXMLMsg = oXML.error.message.value;
                    } else {
                        oXMLMsg = e.responseText;
                    }
                    MessageBox.error(oXMLMsg);
                }
            });
        },

        //read vendor data
        c: function (entityDetails) {
            // 
            // oView.setBusy(true);
            var aFilter = [];
            // this.dynamicReadCall(that.oDataModel, "/GetVendorsSet", "vendorDataModel", []);
            // that.oDataModel.read("/GetVendorsSet", {
            //     // filters: [filter],
            //     success: function (data) {
            //         var vendorModel = new JSONModel();
            //         vendorModel.setData(data);
            //         if (data.results.length) {
            //             vendorModel.setSizeLimit(data.results.length);
            //         }
            //         that.getView().setModel(vendorModel, "vendorData");
            //         // oView.setBusy(false);
            //     },
            //     error: function (e) {
            //         // oView.setBusy(false);
            //         MessageBox.warning("Error while reading GetVendorsSet data");

            //         that.errorLogCreation(e.responseText, e.statusCode, null,
            //             that._sUserID);
            //         var oXMLMsg, oXML;
            //         if (that.isValidJsonString(e.responseText)) {
            //             oXML = JSON.parse(e.responseText);
            //             oXMLMsg = oXML.error.message;
            //         } else {
            //             oXMLMsg = error.responseText
            //         }

            //         MessageBox.error(oXMLMsg);
            //     }
            // });
        },

        //vendor type f4           
        handleValueSuppTypeHelp: function (val) {
            // 
            if (!this.suppFragment) {
                this.suppFragment = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.supplier_Type", this);
                this.getView().addDependent(this.suppFragment);
            }
            this.suppFragment.open();
            var reqType = sap.ui.getCore().byId("id_type").getSelectedKey();
            // that.handleValueSuppTypeHelpData();
            // that.handleSupplierHelp(reqType);
        },
        //supplier type live search
        handleSuppTypeValueHelpSearch: function (evt) {
            // 
            var aFilter = [];
            var sQuery = evt.getParameter("value");
            if (sQuery) {
                var oFilter1 = [new sap.ui.model.Filter("Ktokk", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("Txt30", sap.ui.model.FilterOperator.Contains, sQuery)
                ];
                var allFilters = new sap.ui.model.Filter(oFilter1, false);
                aFilter.push(allFilters);
            }
            var oList = sap.ui.getCore().byId("id_F4SuppType");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        //setting value for supplier type
        handleSupplierHelp: function (iReqType) {
            // 
            var aSuppData = aSupplierType;
            var suppId = sap.ui.getCore().byId("id_F4SuppType");
            var aRes = [];
            if (iReqType === "3" || iReqType === "1") {
                for (var i = 0; i < aSuppData.results.length; i++) {
                    var value = aSuppData.results[i].Ktokk;
                    aRes.push(aSuppData.results[i]);
                }
            }

            if (iReqType === "3" || iReqType === "1") {
                var suppModels = new JSONModel(aRes);
            }
            // else {
            // 	var suppModels = new JSONModel(aSuppData.results);
            // }

            suppId.setModel(suppModels, "suppModel");
            that.suppFragment.open();
        },

        onVnameChange: function (evt) {
            var idVendor = sap.ui.getCore().byId("id_vendor");
            if (idVendor.getValue() === "") {
                idVendor.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Distributor.");
                idVendor.focus();
                bFlag = false;
            } else idVendor.setValueState(sap.ui.core.ValueState.None);
            var distData = that.getView().getModel("tableJsonModel").getData();
            var name = distData.VNAME;
            var bSupplierDoesntExistIniVen = false;
            var reqType = sap.ui.getCore().byId("id_type").getSelectedKey();
            that.previousReqType = reqType;
            that.previousReqType = Number(that.previousReqType);
            if (suggestFlag === true && (reqType === "1" || reqType === "2" || reqType === "3" || reqType === "6" || reqType === "7")) { //added request type 6
                // var codeLength = distData.VNAME.split("-")[0].length;
                // var name = distData.VNAME.substr(codeLength + 1);
                // distData.VNAME = name;
                that.getView().getModel("tableJsonModel").refresh(true);
                reqType = "5";
                sap.ui.getCore().byId("id_type").setSelectedKey(5);
                // that.oPModel.setProperty("/valEmail", false);
                // that.oPModel.setProperty("/valEntity", false);
                // that.oPModel.setProperty("/valSuppType", false);
                // that.oPModel.setProperty("/valBPType", false);
                // that.oPModel.setProperty("/valNDAType", false);
                // that.oPModel.setProperty("/valComment", false);
                // that.oPModel.setProperty("/submitBtn", false);

                bSupplierDoesntExistIniVen = true;
            } else if (reqType === "2") {
                distData.SAP_DIST_CODE = "";
                distData.IDEAL_DIST_CODE = "";
                that.oPModel.setProperty("/valEmail", true);
                that.oPModel.setProperty("/valEntity", true);
                that.oPModel.setProperty("/valSuppType", true);
                that.oPModel.setProperty("/valBPType", true);
                that.oPModel.setProperty("/valNDAType", false);
                that.oPModel.setProperty("/valComment", true);
                that.oPModel.setProperty("/submitBtn", true);
            } else if (reqType === "3") {
                distData.SAP_DIST_CODE = "";
                distData.IDEAL_DIST_CODE = "";
                that.oPModel.setProperty("/valEmail", true);
                that.oPModel.setProperty("/valEntity", true);
                that.oPModel.setProperty("/valSuppType", true);
                that.oPModel.setProperty("/valBPType", true);
                that.oPModel.setProperty("/valNDAType", false);
                that.oPModel.setProperty("/valComment", true);
                that.oPModel.setProperty("/submitBtn", true);
            } else if (reqType === "6") { //added request type 6
                // distData.SAP_VENDOR_CODE = "";
                distData.IDEAL_DIST_CODE = "";
                that.oPModel.setProperty("/valEmail", true);
                that.oPModel.setProperty("/valEntity", false);
                that.oPModel.setProperty("/valSuppType", false);
                that.oPModel.setProperty("/valBPType", false);
                that.oPModel.setProperty("/valNDAType", true);
                that.oPModel.setProperty("/valComment", true);
                if (distData.SAP_DIST_CODE === "" || distData.SAP_DIST_CODE === null) {
                    that.oPModel.setProperty("/submitBtn", false); /////
                } else {
                    that.oPModel.setProperty("/submitBtn", true); /////
                }
            }
            if (name !== "") {
                if ((reqType === "4" || reqType === "5") && suggestFlag === true) {

                    var sRole = that.getView().getModel("userDetailsModel").getData();
                    //coded by pranay 30-06-2022
                    var aFilter = [];
                    var codeLength = distData.VNAME.split("-");
                    var scodeLength = codeLength[0]
                    var scodeLength1 = codeLength[1]
                    //var name = distData.VNAME.substr(codeLength + 1);
                    distData.VNAME = scodeLength1;
                    that.getView().getModel("tableJsonModel").refresh(true);

                    var sUrl = appModulePath + "/odata/v4/ideal-request-process-srv/RequestProcess";
                    var sPayload = {
                        "action": "VALIDATION",
                        "inputData": [{
                            "REQUEST_NO": 1000,
                            "REQUEST_TYPE": Number(reqType),
                            "ENTITY_CODE": "1010",
                            "SAP_DIST_CODE": scodeLength,
                            "DIST_NAME1": distData.VNAME.toUpperCase().trim()
                        }],
                        "eventsData": [{
                            "REQUEST_NO": 1000,
                            "EVENT_NO": 0
                        }],
                        "userDetails" : {
                            "USER_ROLE": sRole[0].USER_ROLE,
                            "USER_ID": that._sUserID
                        }
                    };
                    var oData = JSON.stringify(sPayload);
                    $.ajax({
                        url: sUrl,
                        type: 'POST',
                        data: oData,
                        contentType: 'application/json',
                        success: function (oData, responce) {
                            // 
                            suggestFlag = null;
                            that.oPModel.setProperty("/valCreateType", false);

                            var editPayloadModel = new JSONModel(oData);
                            that.getView().setModel(editPayloadModel, "editPayloadModel");

                            if (bSupplierDoesntExistIniVen === true && Object.keys(oData.value).length > 0) {
                                MessageBox.warning("Supplier " + name + " already exist. You can update.");
                            }

                            distData.VEMAIL = oData.value[0].REGISTERED_ID;
                            distData.VENTITY = oData.value[0].ENTITY_CODE;
                            sap.ui.getCore().byId("id_entity").setSelectedKey(distData.VENTITY);
                            distData.CREATION_TYPE = oData.value[0].CREATION_TYPE;
                            distData.SUPPLIER_DESC = oData.value[0].SUPPL_TYPE_DESC;
                            distData.SUPPLIER_TYPE = oData.value[0].SUPPL_TYPE;
                            distData.BP_TYPE_CODE = oData.value[0].BP_TYPE_CODE;
                            distData.BP_TYPE_DESC = oData.value[0].BP_TYPE_DESC;
                            distData.NDA_TYPE = oData.value[0].NDA_TYPE;
                            distData.BUYER_ASSIGN_CHECK = oData.value[0].BUYER_ASSIGN_CHECK;
                            // sap.ui.getCore().byId("id_bpType").setSelectedKey(distData.BP_TYPE_CODE);
                            distData.SAP_DIST_CODE = oData.value[0].SAP_DIST_CODE;
                            //distData.SAP_VENDOR_CODE = that.lifnr;
                            distData.IDEAL_DIST_CODE = oData.value[0].IDEAL_DIST_CODE;
                            distData.MOBILE_NO = oData.value[0].MOBILE_NO;
                            that.oPModel.setProperty("/valName", true);
                            //that.oPModel.setProperty("/valEditReqType", false);
                            that.oPModel.setProperty("/valEntity", false);
                            that.oPModel.setProperty("/valSuppType", false);
                            that.oPModel.setProperty("/valBPType", false);
                            //that.oPModel.setProperty("/valNDAType", false);
                            that.oPModel.setProperty("/valEmail", false);
                            that.oPModel.setProperty("/valComment", true);
                            that.oPModel.setProperty("/submitBtn", true);
                            that.getView().getModel("tableJsonModel").refresh(true);
                        },
                        error: function (error) {
                            // 
                            if (error.status === 303 && suggestFlag === true) {
                                MessageBox.warning("Selected distributor not registered on E-vendor portal.");
                                suggestFlag = null;
                                distData.SAP_DIST_CODE = that.lifnr;
                                distData.IDEAL_DIST_CODE = null;
                                distData.VEMAIL = "";
                                distData.VENTITY = null;
                                distData.SUPPLIER_DESC = "";
                                distData.SUPPLIER_TYPE = "";
                                distData.BP_TYPE_CODE = "";
                                distData.BP_TYPE_DESC = "";
                                distData.ENTITY_CODE = null;
                                distData.ENTITY_DESC = null;
                                sap.ui.getCore().byId("id_entity").setSelectedKey(null);
                                that.getView().getModel("tableJsonModel").refresh(true);
                                that.oPModel.setProperty("/valCreateType", false);
                                that.oPModel.setProperty("/valEmail", false);
                                that.oPModel.setProperty("/valEntity", false);
                                that.oPModel.setProperty("/valSuppType", false);
                                that.oPModel.setProperty("/valBPType", false);
                                that.oPModel.setProperty("/valNDAType", false);
                                that.oPModel.setProperty("/valComment", false);
                                that.oPModel.setProperty("/submitBtn", false);
                            }
                            else {
                                suggestFlag = null;

                                if (that.previousReqType === 1 || that.previousReqType === 2 || that.previousReqType === 3 || that.previousReqType === 7) {
                                    that.oPModel.setProperty("/valEmail", true);
                                    that.oPModel.setProperty("/valEntity", true);
                                    that.oPModel.setProperty("/valSuppType", true);
                                    that.oPModel.setProperty("/valBPType", true);
                                    that.oPModel.setProperty("/valNDAType", false);
                                    that.oPModel.setProperty("/valComment", true);
                                    that.oPModel.setProperty("/submitBtn", true);
                                }
                                else if (that.previousReqType === 5) {
                                    distData.SAP_DIST_CODE = "";
                                    distData.IDEAL_DIST_CODE = "";
                                    distData.VEMAIL = "";
                                    distData.SUPPLIER_DESC = "";
                                    distData.SUPPLIER_TYPE = "";
                                    distData.BP_TYPE_CODE = "";
                                    distData.BP_TYPE_DESC = "";
                                    distData.ENTITY_CODE = null;
                                    distData.ENTITY_DESC = null;
                                    sap.ui.getCore().byId("id_entity").setSelectedKey(null);

                                    that.oPModel.setProperty("/valCreateType", false);
                                    that.oPModel.setProperty("/valEmail", false);
                                    that.oPModel.setProperty("/valEntity", false);
                                    that.oPModel.setProperty("/valSuppType", false);
                                    that.oPModel.setProperty("/valBPType", false);
                                    that.oPModel.setProperty("/valNDAType", false);
                                    that.oPModel.setProperty("/valComment", false);
                                    that.oPModel.setProperty("/submitBtn", false);
                                }
                                sap.ui.getCore().byId("id_type").setSelectedKey(that.previousReqType);
                                that.getView().getModel("tableJsonModel").refresh(true);

                                var oXMLMsg, oXML;
                                if (that.isValidJsonString(error.responseText)) {
                                    oXML = JSON.parse(error.responseText);
                                    oXMLMsg = oXML.error.message;
                                } else {
                                    oXMLMsg = error.responseText;
                                }
                                MessageBox.warning(oXMLMsg);
                            }
                        }
                    });





                    // var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo?$filter=(VENDOR_NAME1 eq '" + distData.VNAME + "') and (SAP_VENDOR_CODE eq '" + scodeLength + "')";
                    // var data = { $expand: 'TO_STATUS,TO_ENTITY_CODE,TO_REQUEST_TYPE' };
                    // $.ajax({
                    //     url: url,
                    //     type: 'GET',
                    //     data: data,
                    //     contentType: 'application/json',
                    //     success: function (oData, responce) {

                    //         suggestFlag = null;
                    //         that.oPModel.setProperty("/valCreateType", false);

                    //         var editPayloadModel = new JSONModel(oData);
                    //         that.getView().setModel(editPayloadModel, "editPayloadModel");

                    //         if (bSupplierDoesntExistIniVen === true && Object.keys(oData).length > 0) {
                    //             MessageBox.warning("Supplier " + name + " already exist. You can update.");
                    //         }

                    //         distData.VEMAIL = oData.value[0].REGISTERED_ID;
                    //         distData.VENTITY = oData.value[0].ENTITY_CODE;
                    //         sap.ui.getCore().byId("id_entity").setSelectedKey(distData.VENTITY);
                    //         distData.CREATION_TYPE = oData.value[0].CREATION_TYPE;
                    //         distData.SUPPLIER_DESC = oData.value[0].SUPPL_TYPE_DESC;
                    //         distData.SUPPLIER_TYPE = oData.value[0].SUPPL_TYPE;
                    //         distData.BP_TYPE_CODE = oData.value[0].BP_TYPE_CODE;
                    //         distData.BP_TYPE_DESC = oData.value[0].BP_TYPE_DESC;
                    //         distData.NDA_TYPE = oData.value[0].NDA_TYPE;
                    //         distData.BUYER_ASSIGN_CHECK = oData.value[0].BUYER_ASSIGN_CHECK;
                    //         sap.ui.getCore().byId("id_bpType").setSelectedKey(distData.BP_TYPE_CODE);
                    //         distData.SAP_VENDOR_CODE = that.lifnr;
                    //         distData.IVEN_VENDOR_CODE = oData.value[0].IVEN_VENDOR_CODE;
                    //         distData.VENTITYDESC = oData.value[0].TO_ENTITY_CODE.BUTXT;
                    //         that.oPModel.setProperty("/valName", true);
                    //         //that.oPModel.setProperty("/valEditReqType", false);
                    //         that.oPModel.setProperty("/valEntity", false);
                    //         that.oPModel.setProperty("/valSuppType", false);
                    //         that.oPModel.setProperty("/valBPType", false);
                    //         //that.oPModel.setProperty("/valNDAType", false);
                    //         that.oPModel.setProperty("/valEmail", false);
                    //         that.oPModel.setProperty("/valComment", true);
                    //         that.oPModel.setProperty("/submitBtn", true);
                    //         that.getView().getModel("tableJsonModel").refresh(true);
                    //     },
                    //     error: function (error) {

                    //         if (error.status === 303 && suggestFlag === true) {
                    //             MessageBox.warning("Selected supplier not registered on E-vendor portal.");
                    //             suggestFlag = null;
                    //             distData.SAP_VENDOR_CODE = that.lifnr;
                    //             distData.IVEN_VENDOR_CODE = null;
                    //             distData.VEMAIL = "";
                    //             distData.SUPPLIER_DESC = "";
                    //             distData.SUPPLIER_TYPE = "";
                    //             distData.BP_TYPE_CODE = "";
                    //             distData.BP_TYPE_DESC = "";
                    //             distData.ENTITY_CODE = null;
                    //             distData.ENTITY_DESC = null;
                    //             sap.ui.getCore().byId("id_entity").setSelectedKey(null);
                    //             that.getView().getModel("tableJsonModel").refresh(true);
                    //             that.oPModel.setProperty("/valCreateType", false);
                    //             that.oPModel.setProperty("/valEmail", false);
                    //             that.oPModel.setProperty("/valEntity", false);
                    //             that.oPModel.setProperty("/valSuppType", false);
                    //             that.oPModel.setProperty("/valBPType", false);
                    //             that.oPModel.setProperty("/valNDAType", false);
                    //             that.oPModel.setProperty("/valComment", false);
                    //             that.oPModel.setProperty("/submitBtn", false);
                    //         }
                    //         else {
                    //             suggestFlag = null;
                    //             that.oPModel.setProperty("/valCreateType", false);
                    //             that.oPModel.setProperty("/valEmail", false);
                    //             that.oPModel.setProperty("/valEntity", false);
                    //             that.oPModel.setProperty("/valSuppType", false);
                    //             that.oPModel.setProperty("/valBPType", false);
                    //             that.oPModel.setProperty("/valNDAType", false);
                    //             that.oPModel.setProperty("/valComment", false);
                    //             that.oPModel.setProperty("/submitBtn", false);
                    //             var oXML = JSON.parse(error.responseText).OUT_SUCCESS;
                    //             MessageBox.warning(oXML);
                    //         }
                    //     }
                    // });
                }
                else if (reqType === "5") {
                    MessageBox.warning("You have to select distributor from suggestion for update request.");
                    distData.SAP_DIST_CODE = "";
                    distData.VNAME = "";
                    distData.VEMAIL = "";
                    distData.SUPPLIER_DESC = "";
                    distData.SUPPLIER_TYPE = "";
                    distData.BP_TYPE_CODE = "";
                    distData.BP_TYPE_DESC = "";
                    // distData.NDA_TYPE = "";
                    that.oPModel.setProperty("/valCreateType", false);
                    that.oPModel.setProperty("/valEmail", false);
                    that.oPModel.setProperty("/valEntity", false);
                    that.oPModel.setProperty("/valSuppType", false);
                    that.oPModel.setProperty("/valBPType", false);
                    that.oPModel.setProperty("/valNDAType", false);
                    that.oPModel.setProperty("/valComment", false);
                    that.oPModel.setProperty("/submitBtn", false);
                    that.getView().getModel("tableJsonModel").refresh(true);
                }
            }
        },

        onSuggestionItemSelected: function (evt) {
            // 
            suggestFlag = true;
            that.lifnr = "0000000000" + evt.getParameters().selectedItem.getBindingContext("vendorDataModel").getObject().LIFNR;
            that.lifnr = that.lifnr.slice(-9);
        },

        //supplier type 
        handleValueSuppTypeHelpData: function (iReqType) {
            // 
            jQuery.sap.delayedCall(100, this, function () {
                // BusyIndicator.show();
            });
            var suppId = sap.ui.getCore().byId("id_F4SuppType");
            // this.dynamicReadCall(that.oDataModel, "/GetAccountGrpSet", "suppModel", []);

        },
        //vendor type f4 confirm
        handleSuppTypeValueHelpClose: function (evt) {
            // 
            var oSelectedItem = evt.getParameter("selectedItem");
            // that.getView().getModel("tableJsonModel").setProperty("/SUPPLIER_TYPE", oSelectedItem.getBindingContext("suppModel").getProperty(
            //     "Ktokk"));
            // that.getView().getModel("tableJsonModel").setProperty("/SUPPLIER_DESC", oSelectedItem.getBindingContext("suppModel").getProperty(
            //     "Txt30"));

            that.getView().getModel("tableJsonModel").setProperty("/SUPPLIER_TYPE", oSelectedItem.getBindingContext("distribut_Type").getProperty(
                "Ktokk"));
            that.getView().getModel("tableJsonModel").setProperty("/SUPPLIER_DESC", oSelectedItem.getBindingContext("distribut_Type").getProperty(
                "Txt30"));
            // sap.ui.getCore().byId("id_supplier").setValueState(sap.ui.core.ValueState.None);
            this.oPModel.setProperty("/VendorTypeState", "None")
        },

        //read trading partner         
        readTradingPartnerData: function () {
            // 
            // this.dynamicReadCall(that.oDataModel, "/TradingPartnerSet", "tpJsonModel", []);
            that.oDataModel.read("/TradingPartnerSet", {
                success: function (oData, response) {
                    // 
                    var tradingPartnerModel = new JSONModel();
                    tradingPartnerModel.setData(oData);
                    tradingPartnerModel.setSizeLimit(oData.results.length);
                    oView.setModel(tradingPartnerModel, "tpJsonModel");
                },
                error: function (e) {
                    // 
                    // MessageBox.warning("Error while reading Trading Partner Data");
                    // that.errorLogCreation(e.responseText, e.statusCode, null,
                    //     that._sUserID);
                    var oXMLMsg, oXML;
                    if (that.isValidJsonString(e.responseText)) {
                        oXML = JSON.parse(e.responseText);
                        oXMLMsg = oXML.error.message.value;
                    } else {
                        oXMLMsg = e.responseText
                    }
                    MessageBox.error(oXMLMsg);
                }
            });
        },

        emailvalidation: function (oEvent) {
            // 
            var oSource = oEvent.getSource();
            // var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            // 		.test(oSource.getValue());
            var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(oSource.getValue());

            if (reg === true && (oSource.getValue() !== "" || oSource.getValue() !== null)) {
                var email = oSource.getValue();
                email = email.trim();
                email = email.toLowerCase();
                // email = email.trim();
                oSource.setValue(email);
                oSource.setValueState(sap.ui.core.ValueState.None);
            } else {
                oEvent.getSource().setValue("");
                oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid email address");
            }
        },

        mobnovalidation: function (oEvent) {
            // 
            var oSource = oEvent.getSource();
            // // var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            // // 		.test(oSource.getValue());
            // var reg = /^\s*[\w.-]+@(?!.*(\.[a-z\d-]+){2,})([a-z\d-]+\.)+[a-z]{2,}\s*$/.test(oSource.getValue());

            // if (reg === true && (oSource.getValue() !== "" || oSource.getValue() !== null)) {
            //     var email = oSource.getValue();
            //     email = email.trim();
            //     oSource.setValue(email);
            //     oSource.setValueState(sap.ui.core.ValueState.None);
            // } else {
            //     oEvent.getSource().setValue("");
            //     oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid email address");
            // }

            var regMob = /[0-9]{10}$/.test(oSource.getValue());
            if (oSource.getValue() === "") {
                oSource.setValue("");
                oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Mobile no");
                // mobNo.focus();
                // bFlag = false;
            } else if (regMob === false && oSource.getValue() !== "") {
                oSource.setValue("");
                oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid Mobile no");
                // mobNo.focus();
                // bFlag = false;
            } else oSource.setValueState(sap.ui.core.ValueState.None);
        },
        //selection of trading partner
        onSelectionTradingPartner: function (oEvent) {
            // 
            var tradingPnrumber = oEvent.getSource().getSelectedKey();
            var tpName = oEvent.getSource().getSelectedItem().getBindingContext("tpJsonModel").getObject().Name1;
            this.getView().getModel("tableJsonModel").setProperty("/SAP_DIST_CODE", "000000" + tradingPnrumber);
            this.getView().getModel("tableJsonModel").setProperty("/VNAME", tpName);

            that.oModel.read("/CheckVendorCodeSet('" + tradingPnrumber + "')", {
                success: function (oData, response) {
                    if (oData.Status === "X") {
                        that.onSAPCodeChange();
                    } else if (oData.Status === "") {
                        MessageBox.warning("Trading Partner : " + tradingPnrumber + " already used");
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

        //vendor subtype read          
        readBPTypeData: function () {
            // 
            // BusyIndicator.show();
            // this.dynamicReadCall(that.oDataModel, "/BPTypeSet", "bpTypeJson", []);

        },

        //change for sub type
        handleSupplierSubType: function (oEvent) {
            // 
            // sap.ui.getCore().byId("id_bpType").setValueState(sap.ui.core.ValueState.None);
            this.oPModel.setProperty("/BpTypeState", "None")
            var BpType = oEvent.getSource().getSelectedKey();
            if (BpType === "D") {
                prvSubType = BpType;
                reqIndicator = "Y";
                sap.ui.getCore().byId("id_type").setSelectedKey(6);
            } else if (BpType === "B" || BpType === "C" || BpType === "SRM") {
                var reqType = sap.ui.getCore().byId("id_type").getSelectedKey();
                var rType = sap.ui.getCore().byId("id_type");
                if (reqType !== "" && reqIndicator === "Y") {
                    MessageBox.information("Are you sure you want to change Supplier Sub Type ?", {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (Action) {
                            if (Action === "YES") {
                                reqIndicator = null;
                                sap.ui.getCore().byId("id_type").setSelectedKey(null);
                                var oDistData = that.getView().getModel("tableJsonModel").getData();
                                oDistData.VNAME = "";
                                oDistData.VCODE = "";
                                oDistData.VEMAIL = "";
                                oDistData.COMMENT = "";
                                oDistData.SUPPLIER_DESC = "";
                                oDistData.SUPPLIER_TYPE = "";
                                oDistData.BP_TYPE_CODE = "";
                                oDistData.BP_TYPE_DESC = "";
                                // oDistData.NDA_TYPE = "";
                                oDistData.SAP_DIST_CODE = "";
                                oDistData.IDEAL_DIST_CODE = null;
                                that.getView().getModel("tableJsonModel").refresh(true);

                                rType.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select Request Type");
                                rType.focus();
                            }
                            if (Action === "NO") {
                                sap.ui.getCore().byId("id_bpType").setSelectedKey(prvSubType);
                            }
                        }
                    });

                }
            }
            that.oPModel.setProperty("/valNDAType", true);
            // sap.ui.getCore().byId("id_NDAType").setSelectedKey();
            var aFilter = [];
            if (BpType === "C") {
                aFilter.push(new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, "OU"),
                    new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, "OM"));
            } else {
                aFilter.push(new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, "LU"),
                    new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, "LM"));
            }
            //that.readNDATypeData(aFilter);
        },

        //Request onChange function          
        onTypeChange: function () {
            
            var oDistData = that.getView().getModel("tableJsonModel").getData();
            oDistData.VNAME = "";
            oDistData.VCODE = "";
            oDistData.VEMAIL = "";
            oDistData.COMMENT = "";
            oDistData.SUPPLIER_DESC = "";
            oDistData.SUPPLIER_TYPE = "";
            oDistData.BP_TYPE_CODE = "";
            oDistData.BP_TYPE_DESC = "";
            oDistData.SAP_DIST_CODE = ""; 
            oDistData.IDEAL_DIST_CODE = null;
            oDistData.NDA_TYPE = "";
            that.getView().getModel("tableJsonModel").refresh(true);
            var reqType = sap.ui.getCore().byId("id_type").getSelectedKey();
            sap.ui.getCore().byId("id_vendor").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_sapCode").setValueState(sap.ui.core.ValueState.None);
            sap.ui.getCore().byId("id_type").setValueState(sap.ui.core.ValueState.None);
            sap.ui.getCore().byId("id_email").setValueState(sap.ui.core.ValueState.None);
            sap.ui.getCore().byId("id_entity").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_supplier").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_bpType").setValueState(sap.ui.core.ValueState.None);
            // this.oPModel.setProperty("/vendorName", "None")
            // this.oPModel.setProperty("/sapCodeState", "None")
            // this.oPModel.setProperty("/idTypeState", "None")
            // this.oPModel.setProperty("/EmailState", "None")
            // this.oPModel.setProperty("/EntityState", "None")
            // this.oPModel.setProperty("/VendorTypeState", "None")
            // this.oPModel.setProperty("/BpTypeState", "None")

            if (reqType === "4" || reqType === "5") {
                that.oPModel.setProperty("/autoName", true);
                that.oPModel.setProperty("/valName", true);
                that.oPModel.setProperty("/valCreateType", false);
                that.oPModel.setProperty("/valEmail", false);
                that.oPModel.setProperty("/valEntity", false);
                that.oPModel.setProperty("/valSuppType", false);
                that.oPModel.setProperty("/valBPType", false);
                that.oPModel.setProperty("/valNDAType", false);
                that.oPModel.setProperty("/valComment", false);
                that.oPModel.setProperty("/submitBtn", true);
                that.oPModel.setProperty("/sapCode", false);
                
            } else if (reqType === "1" || reqType === "2" || reqType === "3" || reqType === "6" || reqType === "7") {
                that.oPModel.setProperty("/autoName", false);
                that.oPModel.setProperty("/valName", true);
                that.oPModel.setProperty("/valCreateType", false);
                that.oPModel.setProperty("/valEmail", true);
                that.oPModel.setProperty("/valEntity", true);
                sap.ui.getCore().byId("id_entity").setSelectedKey(null);
                // ******************************************************************************
                // removed gloabl variable sEntity
                // sap.ui.getCore().byId("id_entity").setValue(sEntity);
                that.oPModel.getProperty("/Entity")

                //sap.ui.getCore().byId("id_entity").setSelectedKey(null);
                that.oPModel.setProperty("/valSuppType", true);
                that.oPModel.setProperty("/valBPType", true);
                that.oPModel.setProperty("/valNDAType", false);
                that.oPModel.setProperty("/valComment", true);
                that.oPModel.setProperty("/submitBtn", true);
                that.oPModel.setProperty("/sapCode", false);
            }

            //Added by Sumit Singh on 19-06-2023
            // if (reqType === "1") {
            //     that.getView().getModel("tableJson").setProperty("/SUPPLIER_TYPE", "ZVND");
            //     that.getView().getModel("tableJson").setProperty("/SUPPLIER_DESC", "Commercial Vendor/Supplier");
            //     that.oPModel.setProperty("/valSuppType", false);
            // }

            if (reqType === "7") {
                // that.getView().getModel("tableJson").setProperty("/SUPPLIER_TYPE", "ZVND");
                // that.getView().getModel("tableJson").setProperty("/SUPPLIER_DESC", "Commercial Vendor/Supplier");
                that.oPModel.setProperty("/valSuppType", true);
            }

            if (reqType === "3") {
                // that.getView().getModel("tableJson").setProperty("/BP_TYPE_CODE", "9003");
                // that.getView().getModel("tableJson").setProperty("/BP_TYPE_DESC", "Others");
                that.oPModel.setProperty("/valBPType", true);
            }

            //Coded by Pranay
            if (reqType === "6") {
                // that.readTradingPartnerData();
                that.oPModel.setProperty("/submitBtn", false); //////////
                that.oPModel.setProperty("/sapCode", true);
                sap.ui.getCore().byId("id_bpType").setSelectedKey("D");
                that.oPModel.setProperty("/valBPType", false);
                that.oPModel.setProperty("/valNDAType", true);

                //coded by pranay 30-06-2022
                that.getView().getModel("tableJsonModel").setProperty("/SUPPLIER_TYPE", "ZICB");
                that.getView().getModel("tableJsonModel").setProperty("/SUPPLIER_DESC", "Intercompany Vendors");
                that.oPModel.setProperty("/valSuppType", false);

                // sap.ui.getCore().byId("id_NDAType").setSelectedKey();
                var aFilter = [];
                aFilter.push(new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, "LU"),
                new sap.ui.model.Filter("ATTACH_TYPE_CODE", sap.ui.model.FilterOperator.EQ, "LM"));
                that.readNDATypeData(aFilter);
            }
            if (reqType !== "") {
                // sap.ui.getCore().byId("id_type").setValueState(sap.ui.core.ValueState.None);
                this.oPModel.setProperty("/idTypeState", "None")
            }

            that.handleValueSuppTypeHelpData();

        },
        readTypeDataEdit: function (filter) {
            // 
            // oView.setBusy(true);
            BusyIndicator.show()
            var url = appModulePath + "/odata/v4/ideal-request-process-srv/MasterRequestType";
            this.postAjax(url, "GET", null, "typeJsonEditModel", null);
        },
        //Request Type create fragment          
        readTypeData: function (filter) {
            // 
            // oView.setBusy(true);
            BusyIndicator.show()
            var url = appModulePath + "/odata/v4/ideal-request-process-srv/MasterRequestType";
            this.postAjax(url, "GET", null, "typeJson", null);
        },
        //read status for filter dialog
        readStatusData: function () {
            // 
            // oView.setBusy(true);
            BusyIndicator.show()
            // var aFilters = "((CODE eq 1) or (CODE eq 2) or (CODE eq 3) or (CODE eq 4) or (CODE eq 6) or (CODE eq 7) or (CODE eq 8) or (CODE eq 10) or (CODE eq 11) or (CODE eq 12) or (CODE eq 14) or (CODE eq 15))"
            var url = appModulePath + "/odata/v4/ideal-request-process-srv/MasterStatus";
            this.postAjax(url, "GET", null, "masterstatusModel", null);
        },
        //ajax 
        postAjax: function (url, type, data, sModelName, sOnSuccess, sSelectedKey) {
            // 
            // oView.setBusy(true);
            BusyIndicator.show();
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
                    
                    BusyIndicator.hide();
                    if (sModelName == "masterivenModel") {
                        var oModel = new JSONModel(data);
                        that.getView().setModel(oModel, "masterivenModel")

                        that.filterfrag5.open();
                    }
                    else if (sModelName == "vendorDataModel") {

                        var vendorModel = new JSONModel();
                        vendorModel.setData(data);
                        that.getView().setModel(vendorModel, "vendorDataModel");
                    }
                    else if (sModelName == "userDetailsModel") {
                        var vendorModel = new JSONModel();
                        if (data.value.length !== 0) {
                            vendorModel.setData(data.value);
                            that.getView().setModel(vendorModel, "userDetailsModel");
                        }
                    }
                    else if (sModelName == "vendorjsonModel" && (sSelectedKey === "" || sSelectedKey === null || sSelectedKey === undefined)) {
                        var aIntialData = {
                            value: []
                        } 
                        if(temp === "create"){
                            temp = "";
                        }
                        //to set count for icon tab bar
                        oObj = {
                            "Invited": 0,
                            "NotInvited": 0,
                            "InviteRejected": 0,
                            "Deleted": 0,
                            "All": data.value.length
                        }

                        for (var j = 0; j < data.value.length; j++) {
                            data.value[j].REQUEST_NO = String(data.value[j].REQUEST_NO);
                            if (data.value[j].STATUS === 2) {
                                oObj.Invited = oObj.Invited + 1
                            }
                            else if (data.value[j].STATUS === 1 || data.value[j].STATUS === 15) {
                                aIntialData.value.push(data.value[j]);
                                oObj.NotInvited = oObj.NotInvited + 1
                            }
                            else if (data.value[j].STATUS === 3) { 
                                oObj.InviteRejected = oObj.InviteRejected + 1
                            }
                            else if (data.value[j].STATUS === 14) {
                                oObj.Deleted = oObj.Deleted + 1
                            }
                        }

                        var vendorModel = new JSONModel();
                        vendorModel.setData(aIntialData);

                        that.getView().setModel(vendorModel, "vendorjsonModel");
                        //model to see count of icon tab bar                
                        var oModel = new JSONModel(oObj);
                        that.getView().setModel(oModel, "countModel")

                    }
                    else if (sModelName == "vendorjsonModel" && (sSelectedKey !== "" || sSelectedKey !== null || sSelectedKey !== undefined)) {
                        for (var i = 0; i < data.value.length; i++) {
                            data.value[i].REQUEST_NO = String(data.value[i].REQUEST_NO);
                        }
                        var length = data.value.length - 1;

                        var count = 0;
                        var vendorModel = new JSONModel();
                        vendorModel.setData(data);

                        that.getView().setModel(vendorModel, "vendorjsonModel");
                        // var desc = data.value[length].STATUS;
                        // // var des = data.value[length].TO_STATUS.DESCRIPTION;
                        // if (desc === 2) {
                        //     oObj.Invited = oObj.Invited + 1
                        //     count =  oObj.Invited;
                        //     var des = "Invited";
                        //     that.getView().getModel("countModel").setProperty("/" + des, count)
                        // }
                        // else if (desc === 1 || desc === 15) {
                        //     oObj.NotInvited = oObj.NotInvited + 1
                        //     count =  oObj.NotInvited;
                        //     var des = "NotInvited";
                        //     that.getView().getModel("countModel").setProperty("/" + des, count)
                        // }
                        // else if (desc === 3) { 
                        //     oObj.InviteRejected = oObj.InviteRejected + 1
                        //     count =  oObj.InviteRejected;
                        //     var des = "InviteRejected";
                        //     that.getView().getModel("countModel").setProperty("/" + des, count)
                        // }
                        // else if (desc === 14) {
                        //     oObj.Deleted = oObj.Deleted + 1
                        //     count =  oObj.Deleted;
                        //     var des = "Deleted";
                        //     that.getView().getModel("countModel").setProperty("/" + des, count)
                        // }
                        if(temp === "create"){
                        temp = "";
                        
                        oObj = {
                            "Invited": 0,
                            "NotInvited": 0,
                            "InviteRejected": 0,
                            "Deleted": 0,
                            "All": data.value.length
                        }

                        for (var j = 0; j < data.value.length; j++) {
                            data.value[j].REQUEST_NO = String(data.value[j].REQUEST_NO);
                            if (data.value[j].STATUS === 2) {
                                oObj.Invited = oObj.Invited + 1
                            }
                            else if (data.value[j].STATUS === 1 || data.value[j].STATUS === 15) {
                                oObj.NotInvited = oObj.NotInvited + 1
                            }
                            else if (data.value[j].STATUS === 3) { 
                                oObj.InviteRejected = oObj.InviteRejected + 1
                            }
                            else if (data.value[j].STATUS === 14) {
                                oObj.Deleted = oObj.Deleted + 1
                            }
                        }
                        var oModel = new JSONModel(oObj);
                        that.getView().setModel(oModel, "countModel");
                    }else{
                        that.getView().getModel("countModel").setProperty("/" + sSelectedKey, data.value.length);
                    }

                    if(temp === "delete" && sSelectedKey !== "Deleted"){
                        temp = "";
                        that.getView().getModel("countModel").setProperty("/Deleted", that.getView().getModel("countModel").getData().Deleted + 1);
                    }
                        
                        
                        // that.readEntityData();
                    } else if (sModelName === "masterstatusModel") {
                        var oArray = [];
                        for (var i = 0; i < data.value.length; i++) {
                            if (data.value[i].CODE >= 1 && data.value[i].CODE <= 15){
                                if(data.value[i].CODE === 10){
                                    var join = data.value[i].DESCRIPTION + "-" + "REG";
                                    data.value[i].DESCRIPTION = join;
                                    oArray.push(data.value[i]);
                                }else if(data.value[i].CODE === 15){
                                    var join = data.value[i].DESCRIPTION + "-" + "REQ";
                                    data.value[i].DESCRIPTION = join;
                                    oArray.push(data.value[i]);
                                }else{
                                    oArray.push(data.value[i]);
                                } 
                            }
                        }
                        data = {
                            value: oArray
                        };
                        
                        var oModel = new JSONModel(data);
                        that.getView().setModel(oModel, "masterstatusModel")

                    }
                    // else{
                    // var vendorModel = new JSONModel();
                    // vendorModel.setData(data);
                    // var aDeletedData = data.value
                    // delete aDeletedData[2]
                    // that.getView().setModel(vendorModel, sModelName);
                    // }
                    else if (sModelName === "typeJson") {
                        // var oModel = new JSONModel(data);
                        // that.getView().setModel(aDeletedData, "typeJson")

                        var oModel = new JSONModel(data);
                        that.getView().setModel(oModel, "typeJson");
                    }
                    else if (sModelName === "typeJsonEditModel") {

                        var filteredData = data.value.filter(function (item) {
                            return item.CODE !== 5 && item.CODE !== 7;
                        });

                        var oModel = new JSONModel(filteredData);

                        that.getView().setModel(oModel, "typeJsonEditModel");



                        var filteredData2 = data.value.filter(function (item) {
                            return item.CODE !== 5 && item.CODE !== 7;
                        });

                        var oModel = new JSONModel(filteredData2);

                        that.getView().setModel(oModel, "typeJsonEditModel2");
                    }
                },
                error: function (error) {
                    // 
                    BusyIndicator.hide();
                    oXML = JSON.parse(error.responseText);
                    oXMLMsg = oXML.error["message"];
                    MessageBox.error(oXMLMsg);
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

        //create request form validation
        validateForm: function () {
            // debugger;
            var bFlag = true;
            var idVendor = sap.ui.getCore().byId("id_vendor");
            var idType = sap.ui.getCore().byId("id_type");
            var idEmail = sap.ui.getCore().byId("id_email");
            var entity = sap.ui.getCore().byId("id_entity");
            var idSupplierType = sap.ui.getCore().byId("id_supplier");
            var idBpType = sap.ui.getCore().byId("id_bpType");
            var idComment = sap.ui.getCore().byId("id_comment");
            var mobNo = sap.ui.getCore().byId("id_mobile");
            var reg = /^[A-Za-z\s]+$/.test(idVendor.getValue());
            
            if (idVendor.getValue() === "") {
                idVendor.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Distributor.");
                idVendor.focus();
                bFlag = false;
            } else idVendor.setValueState(sap.ui.core.ValueState.None);

            if (idType.getSelectedKey() === "") {
                idType.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select Type.");
                idType.focus();
                bFlag = false;
            } else idType.setValueState(sap.ui.core.ValueState.None);

            if (entity.getSelectedKey() == "") {
                entity.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select Entity.");
                entity.focus();
                bFlag = false;
            } else entity.setValueState(sap.ui.core.ValueState.None);

            // var regEmail =
            //     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            //         .test(idEmail.getValue());

            var regEmail = /^[\w.-]+@(?!.*(\.[a-z\d-]+){2,})([a-z\d-]+\.)+[a-z]{2,}$/.test(idEmail.getValue());
            if (idEmail.getValue() === "") {
                idEmail.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Email.");
                idEmail.focus();
                bFlag = false;
            } else if (regEmail === false && idEmail.getValue() !== "") {
                idEmail.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid Email.");
                idEmail.focus();
                bFlag = false;
            } else idEmail.setValueState(sap.ui.core.ValueState.None);

            var regMob = /[0-9]{10}$/.test(mobNo.getValue());
            if (mobNo.getValue() === "") {
                mobNo.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Mobile no");
                mobNo.focus();
                bFlag = false;
            } else if (regMob === false && mobNo.getValue() !== "") {
                mobNo.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid Mobile no");
                mobNo.focus();
                bFlag = false;
            } else mobNo.setValueState(sap.ui.core.ValueState.None);
            // if (idSupplierType.getValue() === "") {
            //     idSupplierType.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select Supplier Type.");
            //     idSupplierType.focus();
            //     bFlag = false;
            // } else idSupplierType.setValueState(sap.ui.core.ValueState.None);

            // if (entity.getSelectedKey() === "" || entity.getSelectedKey() === null || entity.getSelectedKey() === undefined) {
            //     entity.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select Entity.");
            //     entity.focus();
            //     bFlag = false;
            // } 
            // else entity.setValueState(sap.ui.core.ValueState.None);

            // if (idBpType.getSelectedKey() === "") {
            //     idBpType.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select Sub Type.");
            //     idBpType.focus();
            //     bFlag = false;
            // } else idBpType.setValueState(sap.ui.core.ValueState.None);

            // if (ndaType.getSelectedKey() === "") {
            // 	ndaType.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select NDA Type.");
            // 	ndaType.focus();
            // 	bFlag = false;
            // } else ndaType.setValueState(sap.ui.core.ValueState.None);

            //	var validComment = comment.getValue().match(/^[- +A-Za-z0-9\n._/,:;$@&() ]+$/);   
            // var validComment = comment.getValue().match(/^[a-zA-Z0-9 \n!@#$&()`.+,/"-]*$/);
            // if (comment.getValue() !== "" && !validComment) {
            // 	comment.setValueState(sap.ui.core.ValueState.Error).setValueStateText(
            // 		"This special characters are not allowed: % ^ * _ ? {} ; : <> []");
            // 	comment.focus();
            // 	bFlag = false;
            // } else 
            if (idComment.getValue().length > idComment.getMaxLength()) {
                idComment.setValueState(sap.ui.core.ValueState.Error).setValueStateText("The text should be less than 1000 characters");
                idComment.focus();
                bFlag = false;
            } else idComment.setValueState(sap.ui.core.ValueState.None);

            // if (idComment.getValue().length === 0) {
            //     idComment.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Please Fill the comment section");
            //     idComment.focus();
            //     bFlag = false;
            // } else idComment.setValueState(sap.ui.core.ValueState.None);

            if (sap.ui.getCore().byId("id_createType").getVisible() === true) {
                var createType = sap.ui.getCore().byId("id_createType");
                if (createType.getSelectedKey() === "") {
                    createType.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select Creation Type.");
                    createType.focus();
                    bFlag = false;
                } else createType.setValueState(sap.ui.core.ValueState.None);
            }
            return bFlag;
        },

        handleLiveChange : function(){
            var idComment = sap.ui.getCore().byId("id_comment");
            if (idComment.getValue().length > idComment.getMaxLength()) {
                idComment.setValueState(sap.ui.core.ValueState.Error).setValueStateText("The text should be less than 1000 characters");
                idComment.focus();
                bFlag = false;
            } else idComment.setValueState(sap.ui.core.ValueState.None);
        },
        //reset create request form
        onReset: function () {
            // 
            var aFilter = [];

            var oDistObject = {
                "VNAME": "",
                "SUPPLIER_TYPE": "",
                "SUPPLIER_DESC": "",
                "BP_TYPE_CODE": "",
                "BP_TYPE_DESC": "",
                "VCODE": "",
                "VEMAIL": "",
                "STATUS": "",
                "COMMENT": "",
                "SAP_DIST_CODE": "",
                "IDEAL_DIST_CODE": null,
                "CREATION_TYPE": null,
                "ENTITY_CODE": "",
                "ENTITY_DESC": ""
                // "NDA_TYPE": ""
            };
            var oTableJson = new JSONModel(oDistObject);
            that.getView().setModel(oTableJson, "tableJsonModel");
            var aFilter = [];
            that.readTypeData([]);
            this.inviteDialog.open();
            that.oPModel.setProperty("/valCreateType", false);
            that.oPModel.setProperty("/valName", false);
            that.oPModel.setProperty("/valEmail", false);
            that.oPModel.setProperty("/valEntity", false);
            // that.oPModel.setProperty("/valEntityVisible", false);
            that.oPModel.setProperty("/valSuppType", false);
            that.oPModel.setProperty("/valBPType", false);
            that.oPModel.setProperty("/valNDAType", false);
            that.oPModel.setProperty("/valComment", false);
            that.oPModel.setProperty("/submitBtn", false);
            that.oPModel.setProperty("/sapCode", false);
            // that.oPModel.setProperty("/valEntityValue", );

            // sap.ui.getCore().byId("id_vendor").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_sapCode").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_type").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_email").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_entity").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_supplier").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_bpType").setValueState(sap.ui.core.ValueState.None);
            // sap.ui.getCore().byId("id_NDAType").setValueState(sap.ui.core.ValueState.None);

            // sap.ui.getCore().byId("id_entity").setValueState(sap.ui.core.ValueState.None);
            sap.ui.getCore().byId("id_entity").setValue();
            sap.ui.getCore().byId("id_entity").setSelectedKey();


            this.oPModel.setProperty("/vendorName", "None")
            this.oPModel.setProperty("/sapCodeState", "None")
            this.oPModel.setProperty("/idTypeState", "None")
            this.oPModel.setProperty("/EmailState", "None")
            this.oPModel.setProperty("/EntityState", "None")
            this.oPModel.setProperty("/VendorTypeState", "None")
            this.oPModel.setProperty("/BpTypeState", "None")
        },

        //for quick registration
        getVcodeFromRequestType: function (sRequestType) {
            // 
            that.sVcode = null;
            if (sRequestType == "1" || sRequestType == "2" || sRequestType == "3" || sRequestType == "5") {
                that.sVcode = "NR";
            } else if (sRequestType == "7") {
                that.sVcode = "QR";
            }
            return that.sVcode;
        },


        //create request submit
        handleVendorSubmit: function () {
            // debugger;
            var sapVCode = null;
            that.getView().getModel("tableJsonModel").setProperty("/MOBILE_NO" , sap.ui.getCore().byId("id_mobile").getValue())
            var oDistData = that.getView().getModel("tableJsonModel").getData();

            var bValid = that.validateForm();

            if (oDistData.SAP_DIST_CODE !== "") { //coded by pranay 08/08/2022
                // sapVCode = "0000000000" + oDistData.SAP_VENDOR_CODE;
                // sapVCode = sapVCode.slice(-9);
                sapVCode = oDistData.SAP_DIST_CODE;
            }

            if (bValid === true) {
                var eventCode = "",
                    remark = "";
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-ddTHH:mm:ss"
                });
                var crt_date = new Date();
                var dateFormatted = dateFormat.format(crt_date);

                var oRegisteredObject = {
                    "REG_NO": 0,
                    //	"SAP_VENDOR_CODE": "000000"+oDistData.SAP_VENDOR_CODE,
                    "SAP_DIST_CODE": sapVCode,
                    "VNAME": oDistData.VNAME.toUpperCase().trim(),
                    // "VCODE": oDistData.VCODE,
                    "VCODE": this.getVcodeFromRequestType(sap.ui.getCore().byId("id_type").getSelectedKey()), // added on 12-04-2023 by Inder Chouhan For Quick Registration
                    "VEMAIL": oDistData.VEMAIL.toLowerCase().trim(),
                    "ENTITY_CODE": oDistData.VENTITY,
                    "SUPPLIER_TYPE_DESC": oDistData.SUPPLIER_DESC,
                    "SUPPLIERTYPE_CODE": oDistData.SUPPLIER_TYPE,
                    // "BP_TYPE_CODE": sap.ui.getCore().byId("id_bpType").getSelectedKey(),
                    // "BP_TYPE_DESC": sap.ui.getCore().byId("id_bpType").getSelectedItem().getText().toUpperCase(),
                    // "NDA_TYPE": sap.ui.getCore().byId("id_NDAType").getSelectedKey(),
                    "NDA_TYPE": null,
                    "ENTITY_DESC": oDistData.VENTITYDESC,
                    "STATUS": 1,
                    "CREATED_ON": dateFormatted,
                    "UPDATED_ON": dateFormatted,
                    // "TYPE": oDistData.TYPE,
                    "REQUEST_TYPE": sap.ui.getCore().byId("id_type").getSelectedKey(),
                    "COMMENT": oDistData.COMMENT,
                    "NEXT_APPROVER": null,
                    // "CREATED_BY": that._sUserID.toLowerCase(),
                    // "CREATED_BY_NAME": that._sUserName,
                    "REMINDER_COUNT": null
                    //"BUYER_ASSIGN_CHECK": oDistData.BUYER_ASSIGN_CHECK || null,
                };
                if (oRegisteredObject.REQUEST_TYPE === "1" || oRegisteredObject.REQUEST_TYPE === "2" ||
                    oRegisteredObject.REQUEST_TYPE === "3" || oRegisteredObject.REQUEST_TYPE === "6") { //added request type 6
                    eventCode = 1;
                    remark = "Request Created";
                    oRegisteredObject.CREATION_TYPE = sap.ui.getCore().byId("id_type").getSelectedKey();
                    oRegisteredObject.IDEAL_DIST_CODE = null;
                } else if (oRegisteredObject.REQUEST_TYPE === "7") {
                    eventCode = 1;
                    remark = "Quick Registration Request Created";
                    oRegisteredObject.CREATION_TYPE = "1";
                    oRegisteredObject.IDEAL_DIST_CODE = null;
                } else {
                    eventCode = 12;
                    remark = "Request updated";
                    if (oDistData.CREATION_TYPE === null) {
                        oRegisteredObject.CREATION_TYPE = sap.ui.getCore().byId("id_createType").getSelectedKey();
                    } else {
                        oRegisteredObject.CREATION_TYPE = oDistData.CREATION_TYPE;
                    }
                    oRegisteredObject.IDEAL_DIST_CODE = oDistData.IDEAL_DIST_CODE;
                }
              
                var sDate = new Date();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-dd" });
                var dateFormatted = dateFormat.format(sDate);
                var sRole = that.getView().getModel("userDetailsModel").getData();
                var sUrl = appModulePath + "/odata/v4/ideal-request-process-srv/RequestProcess";
                var sPayload = {
                    "action": "CREATE",
                    "appType" : "REQ",
                    "inputData": [{
                        "REQUEST_NO": 1000,
                        "MOBILE_NO" : oDistData.MOBILE_NO,
                        "SAP_DIST_CODE": sapVCode,
                        "DIST_NAME1": oDistData.VNAME.toUpperCase().trim(),
                        "DIST_NAME2": "",
                        "DIST_CODE": this.getVcodeFromRequestType(sap.ui.getCore().byId("id_type").getSelectedKey()),
                        // "REGISTERED_ID": "farzeen.s@intellectbizware.com",
                        "REGISTERED_ID": oDistData.VEMAIL.toLowerCase().trim(),
                        "ENTITY_CODE": oDistData.VENTITY,
                        // "ENTITY_DESC": oDistData.VENTITYDESC,
                        // "SUPPL_TYPE_DESC": oDistData.SUPPLIER_DESC.toUpperCase(),
                        // "SUPPL_TYPE": oDistData.SUPPLIER_TYPE,
                        // "BP_TYPE_CODE": sap.ui.getCore().byId("id_bpType").getSelectedKey(),
                        // "BP_TYPE_DESC": sap.ui.getCore().byId("id_bpType").getSelectedItem().getText().toUpperCase(),
                        "NDA_TYPE": null,
                        "STATUS": 1,
                        // "CREATED_ON": dateFormatted,
                        "CREATED_ON": sDate,
                        // "LAST_UPDATED_ON": dateFormatted,
                        "LAST_UPDATED_ON": sDate,
                        "REQUEST_TYPE": Number(sap.ui.getCore().byId("id_type").getSelectedKey()),
                        "CREATION_TYPE": Number(oRegisteredObject.CREATION_TYPE),
                        "COMMENT": oDistData.COMMENT,
                        "APPROVER_LEVEL": null,
                        "REQUESTER_ID": that._sUserID,
                        "REMINDER_COUNT": null,
                        "BUYER_ASSIGN_CHECK": null
                    }],
                    "eventsData": [{
                        "REQUEST_NO": 1000,
                        "EVENT_NO": 0,
                        "EVENT_CODE": eventCode,
                        "EVENT_TYPE": "REQ",
                        "USER_ID": that._sUserID,
                        "USER_NAME": that._sUserName,
                        "REMARK": remark,
                        "COMMENT": oDistData.COMMENT,
                        "CREATED_ON": sDate
                    }],
                    "userDetails" : {
                        "USER_ROLE": sRole[0].USER_ROLE,
                        "USER_ID": that._sUserID
                    }
                };
                //}
                if (oDistData.SAP_DIST_CODE !== "") {
                    sPayload.inputData[0].IDEAL_DIST_CODE = oDistData.IDEAL_DIST_CODE;
                }

                var oData = JSON.stringify(sPayload);

                MessageBox.confirm("Are you sure you want to Submit?", {
                    title: "Confirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {

                        if (sButton === MessageBox.Action.OK) {
                            that._closeDialog();
                            BusyIndicator.show();

                            that.postAjaxDynamic(sUrl, "POST", oData, "InviteCreate", null, null);
                        };
                    }
                });
            }
        },

        //resend email posting
        onSendNotification: function (evt) {
            // 
            var oVendorData = evt.getSource().getBindingContext("vendorjsonModel").getObject();
            var sDate = new Date();
            sap.m.MessageBox.confirm("Do you want to send notification again?", {
                title: "CONFIRMATION",
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (sAction) {
                    if (sAction === "YES") {
                       
                        var sRole = that.getView().getModel("userDetailsModel").getData();
                        var oRegisteredObject = {
                            "action": "RESENDNOTIFICATION",
                            "ENTITY_DESC": oVendorData.ENTITY_DESC,
                            "inputData": [{
                                "REGISTERED_ID": oVendorData.REGISTERED_ID,
                                "REQUEST_NO": Number(oVendorData.REQUEST_NO),
                                "REQUEST_TYPE": oVendorData.REQUEST_TYPE,
                                "DIST_NAME1": oVendorData.DIST_NAME1,
                                "ENTITY_CODE": oVendorData.ENTITY_CODE
                            }],
                            "eventsData": [{
                                "REQUEST_NO": Number(oVendorData.REQUEST_NO),
                                "EVENT_NO": 0,
                                "EVENT_CODE": 8,
                                "EVENT_TYPE": "REQ",
                                "USER_ID": that._sUserID,
                                "USER_NAME": that._sUserName,
                                "REMARK": "Re-Invitation Sent",
                                "COMMENT": "Re-Invitation Sent",
                                "CREATED_ON": sDate
                            }],
                            "userDetails" : {
                                "USER_ROLE": sRole[0].USER_ROLE,
                                "USER_ID": that._sUserID
                            }
                        };
                        var oData = JSON.stringify(oRegisteredObject)
                        BusyIndicator.show();
                        var sUrl = appModulePath + "/odata/v4/ideal-request-process-srv/RequestProcess";
                        that.postAjaxDynamic(sUrl, "POST", oData, "ResendNotify", null, null)
                    }
                }
            });
        },
        //create request fragment close           
        _closeDialog: function () {
            // 
            this.inviteDialog.close();
            this.inviteDialog.destroy();
            this.inviteDialog = null;
        },

        //Assignto fragment
        onAssignToFilter: function (oEvent) {
            // 
            var oObject = this.getView().getModel("changeRequestModel").getData();
            var entityCode = oObject.ENTITY_CODE;
            var that = this;
            // this.inputId = oEvent.getSource().getId();
            if (!this.filterfrag5) {
                this.filterfrag5 = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.assignTo", this);
                this.getView().addDependent(this.filterfrag5);
            }
            var url;
            
            if (oObject.STATUS === 5) {
                url = appModulePath + "/odata/v4/ideal-request-process-srv/UserMasterEntities?$filter=(USER_ROLE eq 'SA') and (ACTIVE eq 'X') and (ENTITY_CODE eq '" +entityCode +"')";
            }
            else if (oObject.STATUS === 1 || oObject.STATUS === 4 || oObject.STATUS === 6 || oObject.STATUS === 9 || oObject.STATUS === 13) {
                url = appModulePath + "/odata/v4/ideal-request-process-srv/UserMasterEntities?$filter=(USER_ROLE eq 'CM') and (ACTIVE eq 'X') and (ENTITY_CODE eq '" +entityCode +"')";
            }
            //url = appModulePath + "/ideal-request-process-srv/MasterIvenUsers?$filter=(EMAIL ne '" + this.oPModel.getProperty("/assignedFrom") + "')";
            this.postAjax(url, "GET", null, "masterivenModel", null);
        },
        //assign to confirm
        _F4AssignToClose: function (evt) {
            // 
            var oSelectedItem = evt.getParameter("selectedItem");
            if (oSelectedItem) {
                var assToid = this.byId(this.inputId5);
                this.assignToName = oSelectedItem.getTitle();
            }

            // this.assignToEmail = oSelectedItem.getDescription();
            // sap.ui.getCore().byId("idassignTo").setValue(this.assignToEmail);

            this.oPModel.setProperty("/Assign", oSelectedItem.getDescription())
            // this.oPModel.setProperty("/Assign", this.oPModel.getProperty("/Assignto"))

            // this.readUserMasterEntities(this.assignToEmail);
            evt.getSource().getBinding("items").filter([]);
            this.oPModel.setProperty("/SubmitButton", true)

            // this.filterfrag5.close();
            // this.filterfrag5.destroy();
            // this.filterfrag5 = null;
        },



        //edit fragment 
        onClick: function (oEvent) {
            // debugger;
            if (!this.editfragment) {
                this.editfragment = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.edit", this);
                this.getView().addDependent(this.editfragment);
            }

            this.oPModel.setProperty("/RegId", "")
            this.oPModel.setProperty("/Assign", "")
            this.oPModel.setProperty("/TextValue", "")
            this.oPModel.setProperty("/NewEmailPropertyState", "None");
            sap.ui.getCore().byId("textareaIdStatus").setValue();

            this.editfragment.open()
            // this.readBPTypeData();
            // this.handleValueSuppTypeHelpData();
            var oObject = oEvent.getSource().getBindingContext("vendorjsonModel").getObject();

            var oObj = new JSONModel(structuredClone(oObject));
            this.getView().setModel(oObj, "changeRequestModel");

            if (oObject.REQUEST_TYPE === 5) {

                sap.ui.getCore().byId("reqTypeId").setVisible(false);
                sap.ui.getCore().byId("requestTypelabel1_id").setVisible(false);

                this.iCreateType = Number(sap.ui.getCore().byId("reqTypeId2").getSelectedKey());
                sap.ui.getCore().byId("reqTypeId2").setVisible(true);
                sap.ui.getCore().byId("requestTypelabel1_id2").setVisible(true);

                var sCreationTypeDesc = null;
                var sRequestTypeDesc = null;

                if (oObject.CREATION_TYPE === 1) {
                    sCreationTypeDesc = "Normal";
                } else if (oObject.CREATION_TYPE === 2) {
                    sCreationTypeDesc = "Low Value";
                } else if (oObject.CREATION_TYPE === 3) {
                    sCreationTypeDesc = "Exceptional";
                } else if (oObject.CREATION_TYPE === 6) {
                    sCreationTypeDesc = "Subsidiary";
                }

                if (oObject.REQUEST_TYPE === 1 || oObject.REQUEST_TYPE === 2 || oObject.REQUEST_TYPE === 3 || oObject.REQUEST_TYPE === 6) {
                    sRequestTypeDesc = "Create";
                } else if (oObject.REQUEST_TYPE === 4) {
                    sRequestTypeDesc = "Extend";
                } else if (oObject.REQUEST_TYPE === 5) {
                    //sRequestTypeDesc = "Update";
                    sRequestTypeDesc = "Create";
                } else if (oObject.REQUEST_TYPE === 7) {
                    sRequestTypeDesc = "Quick Registration";
                }

                var final = sRequestTypeDesc + " " + sCreationTypeDesc;
                sap.ui.getCore().byId("reqTypeId2").setValue(final);

                sap.ui.getCore().byId("requestTypelabel1_id2").setText("Creation Type");
            } else {
                sap.ui.getCore().byId("requestTypelabel1_id").setText("Request Type");
                // sap.ui.getCore().byId("reqTypeId").setEditable(true);

                sap.ui.getCore().byId("reqTypeId").setVisible(true);
                sap.ui.getCore().byId("requestTypelabel1_id").setVisible(true);

                sap.ui.getCore().byId("reqTypeId2").setVisible(false);
                sap.ui.getCore().byId("requestTypelabel1_id2").setVisible(false);
            }



            // this.assignedFrom = oObject.NEXT_APPROVER
            this.oPModel.setProperty("/assignedFrom", oObject.NEXT_APPROVER)

            // var oDefaultmodel = context.getView().getModel("fragmentModel").getData()
            this.getView().getModel("fragmentModel").setProperty("/REQUEST_TYPE_FROM_DESC", oObject.TO_REQUEST_TYPE.DESCRIPTION)
            this.getView().getModel("fragmentModel").setProperty("/SUB_TYPE_FROM_DESC", oObject.BP_TYPE_DESC)
            this.getView().getModel("fragmentModel").setProperty("/PRE_REQUEST_TYPE_CODE", oObject.CREATION_TYPE)
            this.getView().getModel("fragmentModel").setProperty("/PRE_SUPPL_TYPE_CODE", oObject.SUPPL_TYPE)
            this.getView().getModel("fragmentModel").setProperty("/PRE_SUBTYPE_TYPE_CODE", oObject.BP_TYPE_CODE)
            this.getView().getModel("fragmentModel").setProperty("/PRE_SUPPL_TYPE_DESC", oObject.SUPPL_TYPE_DESC)

            this.oPModel.setProperty("/SubmitButton", false)

            //	created for icontab change	
            var oObjicontab = new JSONModel(structuredClone(oObject))
            this.getView().setModel(oObjicontab, "iconTabChangeModel");


            var oIconTabBar = sap.ui.getCore().byId("idIconTabBarNoIcons");
            oIconTabBar.setSelectedKey("RequestChangeKey");

            var oUserData = this.getView().getModel("userDetailsModel").getData()

            if (oUserData[0].USER_ROLE === 'CM') {
                that.oPModel.setProperty("/RequestTypeTab", true);
                that.oPModel.setProperty("/RequestForwardTab", true);
                that.oPModel.setProperty("/StatusDeleteTab", true);
                that.oPModel.setProperty("/RegisterIDTab", false);
                // that.oPModel.setProperty("/EmailButton", false)
            }

            var iconTabBar = sap.ui.getCore().byId("idIconTabBarNoIcons");

            // Find the tab item with the specified key
            var aRegisteredIdChangeTab = null;
            var aTabBarItems = iconTabBar.getItems();
            for (var i = 0; i < aTabBarItems.length; i++) {
               
                if (aTabBarItems[i].getKey() === "RequestChangeKey") {
                    aRegisteredIdChangeTab = aTabBarItems[i];
                    if (oObject.STATUS == 1 || oObject.STATUS == 2 || oObject.STATUS == 3 || oObject.STATUS == 4) {
                        aRegisteredIdChangeTab.setVisible(true)
                    } else {
                        aRegisteredIdChangeTab.setVisible(false)
                    }
                }
                else if (aTabBarItems[i].getKey() === "RequestForward") {
                    aRegisteredIdChangeTab = aTabBarItems[i];
                    if (oObject.STATUS == 1 || oObject.STATUS == 4 || oObject.STATUS == 5 || oObject.STATUS == 6 || oObject.STATUS == 9 || oObject.STATUS == 13) {
                        aRegisteredIdChangeTab.setVisible(true)
                    } else {
                        aRegisteredIdChangeTab.setVisible(false)
                    }
                }
                else if (aTabBarItems[i].getKey() === "StatusChange") {
                    aRegisteredIdChangeTab = aTabBarItems[i];
                    if (oObject.STATUS >= 1 && oObject.STATUS <= 14) {
                        aRegisteredIdChangeTab.setVisible(false);
                    } else {
                        aRegisteredIdChangeTab.setVisible(true);
                    }
                }
            }
            //do not change this sequence  USER_ROLE BYR will come after icontab loop
            if (oUserData[0].USER_ROLE === 'SA') {
                that.oPModel.setProperty("/RequestTypeTab", false);
                that.oPModel.setProperty("/RequestForwardTab", false);
                that.oPModel.setProperty("/StatusDeleteTab", false);
            }
            this.editfragment.open();

            this.iRequestType = Number(sap.ui.getCore().byId("reqTypeId").getSelectedKey());
            // this.iSupplierType = sap.ui.getCore().byId("supTypeId").getSelectedKey();
            this.iSupplierType ="";
            // this.iSupplierSubType = sap.ui.getCore().byId("subTypeId").getSelectedKey();
            this.iSupplierSubType = "";

        },

        forEventsRowPress: function (oEvent) {
            // 
            var oObject = oEvent.getSource().getBindingContext("vendorjsonModel").getObject();
            var vendorModel = new JSONModel();
            vendorModel.setData(oObject);
            that.getView().setModel(vendorModel, "vendorDetails");

            var registerNo = oObject.REQUEST_NO;
            registerNo = Number(registerNo);

            if (!this.eventsVariable) {
                this.eventsVariable = sap.ui.xmlfragment("com.ibs.ibsappidealrequestmanagement.view.fragment.events", this);
                this.getView().addDependent(this.eventsVariable);
            }

            jQuery.sap.delayedCall(100, this, function () {
                this.eventsVariable.open();
            });

            this.readEvents(registerNo);
        },

        readEvents: function (iReqNo) {
            // 
            var sFilter;
            var sRole = that.getView().getModel("userDetailsModel").getData();

            if (sRole[0].USER_ROLE === "CEO") {
                var registeFilter = "(REQUEST_NO eq " + iReqNo + ")";
                sFilter = registeFilter;
            }
            else if (sRole[0].USER_ROLE === "CM") {
                var registeFilter = "(REQUEST_NO eq " + iReqNo + ")";
                var eTypeFilter = "(EVENT_TYPE eq 'MSG')";
                sFilter = registeFilter + " and " + eTypeFilter;
            }else if(sRole[0].USER_ROLE === "SA"){
                var registeFilter = "(REQUEST_NO eq " + iReqNo + ")";
                var eTypeFilter = "(EVENT_TYPE eq 'MSG')";
                sFilter = registeFilter + " and " + eTypeFilter;
            }else if(sRole[0].USER_ROLE === "PM"){
                var registeFilter = "(REQUEST_NO eq " + iReqNo + ")";
                var eTypeFilter = "(EVENT_TYPE eq 'MSG')";
                sFilter = registeFilter + " and " + eTypeFilter;
            }

            var path = appModulePath + "/odata/v4/ideal-request-process-srv/RequestEventsLog?$filter=" + sFilter;

            BusyIndicator.show(0);
            $.ajax({
                url: path,
                type: 'GET',
                contentType: 'application/json',
                success: function (oData, response) {
                    // 
                    BusyIndicator.hide(0);
                    var eventJson = new JSONModel();
                    if (oData.value.length > 0) {
                        eventJson.setData(oData);
                        that.getView().setModel(eventJson, "eventJson");
                    } else {
                        eventJson.setData(oData);
                        that.getView().setModel(eventJson, "eventJson");
                        console.log("Error While Reading VenRegisterEvents Entity")
                    }
                },
                error: function (error) {
                    // 
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

        onReadFragmentClose: function (oEvent) {
            // 
            this.eventsVariable.close();
            this.eventsVariable.destroy();
            this.eventsVariable = null;
        },

        onPost: function (oEvent) {
            // 
            var cMessage = oEvent.getParameter("value");
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MessengerService";
            var sRole = that.getView().getModel("userDetailsModel").getData();
            var sAction = null;
            if (sRole[0].USER_ROLE === "CM") {
                sAction = "APPROVER";
            }
            else if (sRole[0].USER_ROLE === "SA") {
                sAction = "APPROVER";
            }else if(sRole[0].USER_ROLE === "CEO"){
                sAction = "APPROVER";
            }else{
                sAction = "APPROVER";
            }
            var vendorDetails = context.getView().getModel("vendorDetails").getData();
            vendorDetails.REQUEST_NO = Number(vendorDetails.REQUEST_NO);
            var oPayload =
            {
                "action": sAction,
                "messengerData": {
                    "loginId": that._sUserID,
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
                    "EVENT_CODE": 13,
                    "EVENT_TYPE": "MSG",
                    "USER_ID": that._sUserID,
                    "USER_NAME": that._sUserName,
                    "REMARK": "Approver sent email to Distributor",
                    "COMMENT": cMessage,
                    "CREATED_ON": vendorDetails.CREATED_ON
                }],
                "userDetails": {
                    "USER_ROLE": sRole[0].USER_ROLE,
                    "USER_ID": that._sUserID
                }
            }
            BusyIndicator.show(0);
            var Postdata = JSON.stringify(oPayload);
            $.ajax({
                url: url,
                type: "POST",
                data: Postdata,
                contentType: 'application/json',
                success: function (oData, responce) {
                    // 
                    BusyIndicator.hide();
                    // var data = JSON.parse(oData);
                    MessageBox.success(oData.value[0].Message, {
                        actions: [MessageBox.Action.OK],
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                context.readEvents(vendorDetails.REQUEST_NO);
                            }
                        }
                    });
                },
                error: function (error) {
                    // 
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

        //edit fragment close
        onCloseDialog: function () {
            // 
            this.oPModel.setProperty("/RegId", "")
            this.oPModel.setProperty("/Assign", "")
            this.oPModel.setProperty("/TextValue", "")
            this.oPModel.setProperty("/NewEmailPropertyState", "None")
            sap.ui.getCore().byId("textareaIdStatus").setValue();
            // sap.ui.getCore().byId("idVisibilitySwitchform").setState(false);
            // this.getView().getModel("changeRequestModel").setProperty("/REQUEST_TYPE_INV")
            // this.getView().getModel("changeRequestModel").setProperty("/REQUEST_TYPE_DESC_INV")
            this.editfragment.close();
            //this.editfragment.destroy();
        },

        //to get data of selected icon tab table
        onFilterSelect: function (oEvent) {
            // 

            var oBinding = this.byId("idMasterTable").getBinding("items"),
                sKey,
                // Array to combine filters
                aFilters = []
            if (oEvent === null || oEvent === undefined || oEvent === "") {
                sKey = "NotInvited";
            } else {
                sKey = oEvent.getParameter("key");
            }

            // if (sKey == "Invited") {
            //     aFilters.push(
            //         new Filter([new Filter("STATUS", "EQ", 2)])

            //     )    
            // }
            if (sKey == "Invited") {
                var aFilter = "(STATUS eq 2)";

                that.readUserMasterEntities(aFilter);


            }
            else if (sKey == "NotInvited") {
                var aFilter = "(STATUS eq 1 or STATUS eq 15)";
                that.readUserMasterEntities(aFilter);


            }
            else if (sKey == "InviteRejected") {
                var aFilter = "(STATUS eq 3)";

                that.readUserMasterEntities(aFilter);


            }
            else if (sKey == "Deleted") {
                var aFilter = "(STATUS eq 14)";

                that.readUserMasterEntities(aFilter);


            }
            else if (sKey == "All") {

                that.readUserMasterEntities(aFilter);

            }
            that.getView().byId("id_search").setValue();

            that.onResetFilter()
            that.resetSortingDialog();

        },
        //icon tab change
        onIconTab: function (oEvent) {
            // 
            var oOriginal = structuredClone(this.getView().getModel("iconTabChangeModel").getData());
            // var oSuppData = context.getView().getModel("supaccountModel").getData();


            var sGetkey = this.getView().getModel("oPropertyModel").getProperty("/selectedTabKey");

            if (sGetkey == "RequestChangeKey") {

                this.getView().getModel("changeRequestModel").setData(oOriginal);
                this.oPModel.setProperty("/NewEmailPropertyState", "None")
                this.oPModel.setProperty("/TextValue", "")
                //to empty input of eid
                this.getView().getModel("oPropertyModel").setProperty("/RegId", "");
                this.oPModel.setProperty("/Assign", "")
                // sap.ui.getCore().byId("textareaId").setValue();
                this.oPModel.setProperty("/textareaIdStatus", "")
                this.oPModel.setProperty("/SubmitButton", false)


            } else if (sGetkey == "EidchangeKey") {

                this.getView().getModel("changeRequestModel").setData(oOriginal);
                this.oPModel.setProperty("/Assign", "")
                this.oPModel.setProperty("/TextValue", "")
                this.oPModel.setProperty("/NewEmailPropertyState", "None")
                this.oPModel.setProperty("/textareaIdStatus", "")
                // sap.ui.getCore().byId("textareaId").setValue();
                this.oPModel.setProperty("/SubmitButton", false)


            } else if (sGetkey == "StatusChange") {

                this.getView().getModel("changeRequestModel").setData(oOriginal);
                sap.ui.getCore().byId("idVisibilitySwitchform").setState(false);
                // sap.ui.getCore().byId("textareaId").setValue();
                this.oPModel.setProperty("/textareaIdStatus", "")

                this.oPModel.setProperty("/NewEmailPropertyState", "None")
                this.oPModel.setProperty("/Assign", "")
                this.getView().getModel("oPropertyModel").setProperty("/RegId", "");

                this.oPModel.setProperty("/SubmitButton", false)

            } else if (sGetkey == "RequestForward") {

                this.oPModel.setProperty("/NewEmailPropertyState", "None")
                this.oPModel.setProperty("/TextValue", "")
                //to empty input of eid
                this.getView().getModel("oPropertyModel").setProperty("/RegId", "");
                this.oPModel.setProperty("/SubmitButton", false)

            }

        },

        //email id change    
        onChangeEmailid: function (oEvent) {
            // 

            var sNewEmail = this.oPModel.getProperty("/RegId");

            var sExistingEmail = sap.ui.getCore().byId("suppEmailId").getText();


            // var emailreg =
            //     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            //         .test(sNewEmail);

            var emailreg = /^[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}$/.test(sNewEmail);

            if (sNewEmail === "") {
                this.oPModel.setProperty("/NewEmailPropertyState", "Error")
                this.oPModel.setProperty("/NewEmailPropertyStateText", "Enter Email")
                this.oPModel.setProperty("/SubmitButton", false)
                // idSubmitButton.setEnabled(false); // Disable the submit button
            } else if (emailreg === false) {
                this.oPModel.setProperty("/NewEmailPropertyState", "Error")
                this.oPModel.setProperty("/NewEmailPropertyStateText", "Enter valid Email.")
                this.oPModel.setProperty("/SubmitButton", false)
                // idSubmitButton.setEnabled(false); // Disable the submit button
            } else if (sNewEmail === sExistingEmail) {
                this.oPModel.setProperty("/NewEmailPropertyState", "Error")
                this.oPModel.setProperty("/NewEmailPropertyStateText", "New email must be different from existing email.")
                this.oPModel.setProperty("/SubmitButton", false)

            } else {
                this.oPModel.setProperty("/NewEmailPropertyState", "None");
                this.oPModel.setProperty("/SubmitButton", true)

            }
        },
        //request type change
        onRequestTypeChange: function (oEvent) {
            // 
            var oRequestObject = oEvent.getSource().getSelectedItem().getBindingContext("typeJsonEditModel").getObject()
            this.getView().getModel("changeRequestModel").setProperty("/REQUEST_TYPE_INV", oRequestObject.CODE)
            this.getView().getModel("changeRequestModel").setProperty("/REQUEST_TYPE_DESC_INV", oRequestObject.DESCRIPTION)

            if (this.iRequestType !== oRequestObject.CODE) {
                flagOne = true;
            } else if (this.iRequestType === oRequestObject.CODE) {
                flagOne = false;
            }

            if (flagOne === true || flagTwo === true || flagThree === true || flagFour === true) {
                this.oPModel.setProperty("/SubmitButton", true);
            } else {
                this.oPModel.setProperty("/SubmitButton", false);
            }
        },

        onRequestTypeChange2: function (oEvent) {
            // 
            var oRequestObject = oEvent.getSource().getSelectedItem().getBindingContext("typeJsonEditModel2").getObject();
            this.getView().getModel("changeRequestModel").setProperty("/REQUEST_TYPE_INV", oRequestObject.CODE)
            this.getView().getModel("changeRequestModel").setProperty("/REQUEST_TYPE_DESC_INV", oRequestObject.DESCRIPTION)

            if (this.iCreateType !== oRequestObject.CODE) {
                flagFour = true;
            } else if (this.iCreateType === oRequestObject.CODE) {
                flagFour = false;
            }

            if (flagOne === true || flagTwo === true || flagThree === true || flagFour === true) {
                this.oPModel.setProperty("/SubmitButton", true);
            } else {
                this.oPModel.setProperty("/SubmitButton", false);
            }
        },
        //supplier type chnage
        onSupplierTypeChange: function (oEvent) {
            // 
            // var oSupplierObject = oEvent.getSource().getSelectedItem().getBindingContext("suppModel").getObject()
            var oSupplierObject = oEvent.getSource().getSelectedItem().getBindingContext("distribut_Type").getObject()
            this.getView().getModel("changeRequestModel").setProperty("/SUPPL_TYPE_TO_CODE", oSupplierObject.Ktokk)
            this.getView().getModel("changeRequestModel").setProperty("/SUPPL_TYPE_TO_DESC", oSupplierObject.Txt30)

            if (this.iSupplierType !== oSupplierObject.Ktokk) {
                flagTwo = true;
            } else if (this.iSupplierType === oSupplierObject.Ktokk) {
                flagTwo = false;
            }

            if (flagOne === true || flagTwo === true || flagThree === true || flagFour === true) {
                this.oPModel.setProperty("/SubmitButton", true);
            } else {
                this.oPModel.setProperty("/SubmitButton", false);
            }
        },

        onSupplierSubTypeChange: function (oEvent) {
            // 
            var oSupplierSubObject = oEvent.getSource().getSelectedItem().getBindingContext("bpTypeJson").getObject()
            this.getView().getModel("changeRequestModel").setProperty("/SUB_TYPE_TO_CODE", oSupplierSubObject.Bpkind)
            this.getView().getModel("changeRequestModel").setProperty("/SUB_TYPE_TO_DESC", oSupplierSubObject.Text40)

            if (this.iSupplierSubType !== oSupplierSubObject.Bpkind) {
                flagThree = true;
            } else if (this.iSupplierSubType === oSupplierSubObject.Bpkind) {
                flagThree = false;
            }

            if (flagOne === true || flagTwo === true || flagThree === true || flagFour === true) {
                this.oPModel.setProperty("/SubmitButton", true);
            } else {
                this.oPModel.setProperty("/SubmitButton", false);
            }
        },

        //Assign to search
        _F4AssignTo: function (evt) {
            // 
            var sValue = evt.getParameter("value");
            var oFilter = new Filter([
                new sap.ui.model.Filter("USER_NAME", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("EMAIL", sap.ui.model.FilterOperator.Contains, sValue)
            ]);
            evt.getSource().getBinding("items").filter(oFilter);
        },

        //switch button		
        onSwitchStateChange: function (oEvent) {
            // 
            var oSwitchControl = oEvent.getSource();
            var bSwitchState = oEvent.getParameter("state");

            var oPropertyModel = this.getView().getModel("oPropertyModel");

            oPropertyModel.setProperty("/SubmitButton", bSwitchState);
        },


        //edit fragment submit
        handleSubmitReqType: function () {
            // 
            var sRole = that.getView().getModel("userDetailsModel").getData();
            
            var sDate = new Date();
            var sSelectedKey = sap.ui.getCore().byId("idIconTabBarNoIcons").getSelectedKey();
            var sNewsuppEmail = this.oPModel.getProperty("/RegId")
            var idlog = sap.ui.getCore().byId("textareaIdStatus").getValue();
            var idStatusComment = sap.ui.getCore().byId("textareaIdStatus").getValue();
            var oChangeRegisterId = this.getView().getModel("changeRequestModel").getData();
            var aMessageArray = [];

            // if (oChangeRegisterId.SUB_TYPE_TO_CODE === undefined || oChangeRegisterId.SUB_TYPE_TO_DESC === undefined) {
            //     oChangeRegisterId.SUB_TYPE_TO_DESC = sap.ui.getCore().byId("subTypeId").getValue();
            //     oChangeRegisterId.SUB_TYPE_TO_CODE = sap.ui.getCore().byId("subTypeId").getSelectedKey();
            // }
            // if (oChangeRegisterId.SUPPL_TYPE_TO_CODE === undefined || oChangeRegisterId.SUPPL_TYPE_TO_DESC === undefined) {
            //     oChangeRegisterId.SUPPL_TYPE_TO_DESC = sap.ui.getCore().byId("supTypeId").getValue();
            //     oChangeRegisterId.SUPPL_TYPE_TO_CODE = sap.ui.getCore().byId("supTypeId").getSelectedKey();
            // }

            if (oChangeRegisterId.REQUEST_TYPE === 5) {
                if (oChangeRegisterId.REQUEST_TYPE_INV === undefined || oChangeRegisterId.REQUEST_TYPE_DESC_INV === undefined) {
                    oChangeRegisterId.REQUEST_TYPE_DESC_INV = sap.ui.getCore().byId("reqTypeId2").getValue();
                    oChangeRegisterId.REQUEST_TYPE_INV = sap.ui.getCore().byId("reqTypeId2").getSelectedKey();
                }
            } else {
                if (oChangeRegisterId.REQUEST_TYPE_INV === undefined || oChangeRegisterId.REQUEST_TYPE_DESC_INV === undefined) {
                    oChangeRegisterId.REQUEST_TYPE_DESC_INV = sap.ui.getCore().byId("reqTypeId").getValue();
                    oChangeRegisterId.REQUEST_TYPE_INV = sap.ui.getCore().byId("reqTypeId").getSelectedKey();
                }
            }

            
            var oPayload = JSON.stringify({
                "ACTION": "REG_ID_EDIT",
                "USER_DETAILS": {
                    "USER_ROLE": sRole[0].USER_ROLE,
                    "USER_ID": that._sUserID
                },
                "INPUT_DATA": [{
                    "REQUEST_NO": oChangeRegisterId.REQUEST_NO,
                    "STATUS": oChangeRegisterId.STATUS,
                    "CHANGE_TO_ID": sNewsuppEmail,
                    "CHANGE_FROM_ID": oChangeRegisterId.REGISTERED_ID,
                    "COMMENT": "Registered Id changed from " + oChangeRegisterId.REGISTERED_ID + " to " + sNewsuppEmail,
                    "SAP_DIST_CODE": oChangeRegisterId.SAP_DIST_CODE
                }]
            });

            var oPayload = JSON.stringify({
                "input": oPayload
            });


            var suppSubType = this.getView().getModel("fragmentModel").getProperty("/PRE_SUPPL_TYPE_DESC");
            
            var oPayloadTypeChange = JSON.stringify({
                "ACTION": "REQUEST_EDIT",
                "USER_DETAILS": {
                    "USER_ROLE": sRole[0].USER_ROLE,
                    "USER_ID": that._sUserID
                },
                "INPUT_DATA": [{
                    "COMMENT": "",
                    "REQUEST_NO": oChangeRegisterId.REQUEST_NO,
                    "REQUEST_TYPE": oChangeRegisterId.REQUEST_TYPE,
                    "REQUEST_TYPE_TO_CODE": Number(oChangeRegisterId.REQUEST_TYPE_INV),
                    "CHANGE_TYPE": "RT",
                    "REQUEST_TYPE_FROM_DESC": this.getView().getModel("fragmentModel").getProperty("/REQUEST_TYPE_FROM_DESC"),
                    "REQUEST_TYPE_TO_DESC": oChangeRegisterId.REQUEST_TYPE_DESC_INV,
                    "SUB_TYPE_FROM_DESC": "",
                    "SUB_TYPE_TO_CODE": "",
                    "SUB_TYPE_TO_DESC": "",
                    "SUPPL_TYPE_TO_CODE": "",
                    "SUPPL_TYPE_FROM_DESC": "",
                    "SUPPL_TYPE_TO_DESC": "",
                    "USER_ID": that._sUserID
                }]
            })
            var oParsedPayload = JSON.parse(oPayloadTypeChange);
            if (oChangeRegisterId.TO_REQUEST_TYPE.CODE === 5) {
                oParsedPayload.INPUT_DATA[0].REQUEST_TYPE = "UPDATE";
            } else {
                oParsedPayload.INPUT_DATA[0].REQUEST_TYPE = "CREATE";
            }

            oParsedPayload.INPUT_DATA[0].CHANGE_TYPE = "RT";
            if (oChangeRegisterId.TO_REQUEST_TYPE.CODE === 5) {
                oParsedPayload.INPUT_DATA[0].REQUEST_TYPE_TO_CODE = sap.ui.getCore().byId("reqTypeId2").getSelectedKey();
                oParsedPayload.INPUT_DATA[0].REQUEST_TYPE_TO_DESC = sap.ui.getCore().byId("reqTypeId2").getValue();
            } else {
                oParsedPayload.INPUT_DATA[0].REQUEST_TYPE_TO_CODE = sap.ui.getCore().byId("reqTypeId").getSelectedKey();
                oParsedPayload.INPUT_DATA[0].REQUEST_TYPE_TO_DESC = sap.ui.getCore().byId("reqTypeId").getValue();
            }

            oParsedPayload.INPUT_DATA[0].CHANGE_TYPE = "RT";
            // oParsedPayload.INPUT_DATA[0].SUB_TYPE_TO_CODE = sap.ui.getCore().byId("subTypeId").getSelectedKey();
            // oParsedPayload.INPUT_DATA[0].SUB_TYPE_TO_DESC = sap.ui.getCore().byId("subTypeId").getValue();
            // oParsedPayload.INPUT_DATA[0].COMMENT = "Supplier category Changed From " + this.getView().getModel("fragmentModel").getProperty("/SUB_TYPE_FROM_DESC") + " to " + oParsedPayload.INPUT_DATA[0].SUB_TYPE_TO_DESC;
            
            if (parseInt(oParsedPayload.INPUT_DATA[0].REQUEST_TYPE_TO_CODE) !== this.getView().getModel("fragmentModel").getProperty("/PRE_REQUEST_TYPE_CODE")) {
                if(oChangeRegisterId.TO_REQUEST_TYPE.CODE === 5){
                    aMessageArray.push("Creation Type ");
                }
                else {
                    aMessageArray.push("Request Type ");
                }
            }

            // if (oParsedPayload.INPUT_DATA[0].SUPPL_TYPE_TO_CODE !== this.getView().getModel("fragmentModel").getProperty("/PRE_SUPPL_TYPE_CODE")) {
            //     aMessageArray.push(" Dealer Type ");
            // }
            // if (oParsedPayload.INPUT_DATA[0].SUB_TYPE_TO_CODE !== this.getView().getModel("fragmentModel").getProperty("/PRE_SUBTYPE_TYPE_CODE")) {
            //     aMessageArray.push(" Dealer Sub Type ");
            // }

            if(aMessageArray.length > 0){
                oParsedPayload.INPUT_DATA[0].CHANGED_FIELDS = aMessageArray;
            }
            if (aMessageArray.length === 0 && sSelectedKey === 'RequestChangeKey') {
                MessageBox.information("No changes has been detected");
                this.oPModel.setProperty("/SubmitButton", false);
                return;
            }

            var oPayloadTypeChange = JSON.stringify({
                "input": JSON.stringify(oParsedPayload)
            });


            var oPayloadRequestForward = JSON.stringify({
                "ACTION": "REQUEST_FORWARDING",
                "USER_DETAILS": {
                    "USER_ROLE": sRole[0].USER_ROLE,
                    "USER_ID": that._sUserID
                },
                "INPUT_DATA": [{
                    "REQUESTS": [{
                        "REQUEST_NO": Number(oChangeRegisterId.REQUEST_NO),
                        "REQUEST_TYPE": oChangeRegisterId.REQUEST_TYPE,
                        "VENDOR_NAME1": oChangeRegisterId.VENDOR_NAME1,
                        "NEXT_APPROVER": oChangeRegisterId.NEXT_APPROVER,
                        "REQUESTER_ID": oChangeRegisterId.REQUESTER_ID,
                        "STATUS": oChangeRegisterId.STATUS,
                    }],
                    // "ASSIGNED_FROM": this.assignedFrom,

                    // "ASSIGNED_TO": this.assignToEmail,
                    "ASSIGNED_FROM": this.oPModel.getProperty("/assignedFrom"),
                    "ASSIGNED_TO": this.oPModel.getProperty("/Assign"),
                    "USER_ID": that._sUserID
                }]
            })

            var oPayloadRequestForward = JSON.stringify({
                "input": oPayloadRequestForward
            });


            //status payload

            var oRegisteredObject = JSON.stringify({
                "action": "DELETE",
                "inputData": [{
                    "REQUEST_NO": oChangeRegisterId.REQUEST_NO,
                    "REQUEST_TYPE": oChangeRegisterId.REQUEST_TYPE,
                    "CREATION_TYPE": oChangeRegisterId.CREATION_TYPE,
                    "SAP_DIST_CODE": oChangeRegisterId.SAP_DIST_CODE,
                    "VENDOR_NAME1": oChangeRegisterId.VENDOR_NAME1,
                    "VENDOR_CODE": oChangeRegisterId.VENDOR_CODE,
                    "REGISTERED_ID": oChangeRegisterId.REGISTERED_ID,
                    "ENTITY_CODE": oChangeRegisterId.ENTITY_CODE,
                    // "SUPPL_TYPE": oChangeRegisterId.SUPPL_TYPE,
                    // "SUPPL_TYPE_DESC": oChangeRegisterId.SUPPL_TYPE_DESC,
                    "BP_TYPE_CODE": oChangeRegisterId.BP_TYPE_CODE,
                    "BP_TYPE_DESC": oChangeRegisterId.BP_TYPE_DESC,
                    "STATUS": oChangeRegisterId.STATUS,
                    "REQUESTER_ID": oChangeRegisterId.REQUESTER_ID
                }],
                "eventsData": [{
                    "REQUEST_NO": oChangeRegisterId.REQUEST_NO,
                    "EVENT_NO": 0,
                    "EVENT_CODE": 0,
                    "EVENT_TYPE": "REQ",
                    "USER_ID": that._sUserID,
                    "USER_NAME": that._sUserName,
                    "REMARK": "Invite Deleted",
                    "COMMENT": that.oPModel.getProperty("/TextValue"),
                    "CREATED_ON": sDate
                }],
                "userDetails": {
                    "USER_ROLE": sRole[0].USER_ROLE,
                    "USER_ID": that._sUserID
                }
            })


            if (sSelectedKey === "RequestForward" || sSelectedKey === "StatusChange") {
                var idlog;

                if (sSelectedKey === "RequestForward") {
                    idlog = sap.ui.getCore().byId("textareaIdStatus").getValue().trim();
                } else if (sSelectedKey === "StatusChange") {
                    idlog = sap.ui.getCore().byId("textareaIdStatus").getValue().trim();
                }

                // Check if idlog is empty for RequestForward or StatusChange
                if (idlog === "") {
                    MessageBox.warning("Kindly fill all required fields.");
                    return;
                }
            }


            if (sSelectedKey == "RequestChangeKey") {
                var sUrl = appModulePath + "/odata/v4/ideal-request-process-srv/RequestEditProcess"
                var oData = oPayloadTypeChange
            } else if (sSelectedKey == "EidchangeKey") {
                var sUrl = appModulePath + "/odata/v4/ideal-request-process-srv/RequestEditProcess"
                var oData = oPayload
            } else if (sSelectedKey == "RequestForward") {
                var sUrl = appModulePath + "/odata/v4/ideal-request-process-srv/RequestEditProcess"
                var oData = oPayloadRequestForward
            } else if (sSelectedKey == "StatusChange") {
                var sUrl = appModulePath + "/odata/v4/ideal-request-process-srv/RequestProcess"
                var oData = oRegisteredObject
            }

            MessageBox.confirm("Are you sure you want to Submit?", {
                title: "Confirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    
                    if (sButton === MessageBox.Action.OK) {
                        that.oPModel.setProperty("/Assign", "")
                        that.editfragment.close()
                        that.editfragment.destroy();
                        that.editfragment = null;
                        BusyIndicator.show();
                       
                        that.postAjaxDynamic(sUrl, "POST", oData, sSelectedKey, aMessageArray, Number(oChangeRegisterId.REQUEST_NO))

                    };
                }
            });
        },

        onDeleteReq: function (oEvent) {
            // 
            if (!this.oSubmitDialog) {
                this.oSubmitDialog = new Dialog({
                    type: DialogType.Message,
                    title: "Confirm",
                    content: [
                        new Label({
                            text: "Are you sure you want to delete this request?",
                            labelFor: "submissionNote"
                        }),
                        new TextArea("submissionNote", {
                            width: "100%",
                            placeholder: "Add reason (required)",
                            liveChange: function (oEvent) {
                                var sText = oEvent.getParameter("value");
                                this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                            }.bind(this)
                        })
                    ],
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "Submit",
                        enabled: false,
                        press: function () {
                            var sRole = that.getView().getModel("userDetailsModel").getData();
                            var sText = Core.byId("submissionNote").getValue();
                            var oObject = oEvent.getSource().getBindingContext("vendorjsonModel").getObject();
                            var oObj = new JSONModel(structuredClone(oObject));
                            this.getView().setModel(oObj, "deleteRequestModel");
                            var oChangeRegisterId = this.getView().getModel("deleteRequestModel").getData();
                            var oRegisteredObject = JSON.stringify({
                                "action": "DELETE",
                                "inputData": [{
                                    "REQUEST_NO": oChangeRegisterId.REQUEST_NO,
                                    "REQUEST_TYPE": oChangeRegisterId.REQUEST_TYPE,
                                    "CREATION_TYPE": oChangeRegisterId.CREATION_TYPE,
                                    "SAP_DIST_CODE": oChangeRegisterId.SAP_DIST_CODE,
                                    "VENDOR_NAME1": oChangeRegisterId.VENDOR_NAME1,
                                    "VENDOR_CODE": oChangeRegisterId.VENDOR_CODE,
                                    "REGISTERED_ID": oChangeRegisterId.REGISTERED_ID,
                                    "ENTITY_CODE": oChangeRegisterId.ENTITY_CODE,
                                    "SUPPL_TYPE": oChangeRegisterId.SUPPL_TYPE,
                                    "SUPPL_TYPE_DESC": oChangeRegisterId.SUPPL_TYPE_DESC,
                                    "BP_TYPE_CODE": oChangeRegisterId.BP_TYPE_CODE,
                                    "BP_TYPE_DESC": oChangeRegisterId.BP_TYPE_DESC,
                                    "STATUS": oChangeRegisterId.STATUS,
                                    "REQUESTER_ID": oChangeRegisterId.REQUESTER_ID
                                }],
                                "eventsData": [{
                                    "REQUEST_NO": oChangeRegisterId.REQUEST_NO,
                                    "EVENT_NO": 0,
                                    "EVENT_CODE": 0,
                                    "EVENT_TYPE": "REQ",
                                    "USER_ID": that._sUserID,
                                    "USER_NAME": that._sUserName,
                                    "REMARK": "Request Deleted",
                                    "COMMENT": sText,
                                    "CREATED_ON": new Date()
                                }],
                                "userDetails" : {
                                    "USER_ROLE": sRole[0].USER_ROLE,
                                    "USER_ID": that._sUserID
                                }
                            });
                            temp = "delete"
                            var oData = oRegisteredObject;
                            var aMessageArray = [];
                            var sSelectedKey = "StatusChange";
                            var sUrl = appModulePath + "/odata/v4/ideal-request-process-srv/RequestProcess";
                            BusyIndicator.show();
                            that.postAjaxDynamic(sUrl, "POST", oData, sSelectedKey, aMessageArray, Number(oChangeRegisterId.REQUEST_NO))
                            this.oSubmitDialog.close();
                            this.oSubmitDialog.destroy();
                            this.oSubmitDialog = null;
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            this.oSubmitDialog.close();
                            this.oSubmitDialog.destroy();
                            this.oSubmitDialog = null;
                        }.bind(this)
                    })
                });
            }

            this.oSubmitDialog.open();
        },

        postAjaxDynamic: function (url, type, Data, action, aMessageArray, OBRno) {
            // 
            // var oDistData = that.getView().getModel("tableJsonModel").getData();
            var sFilter
            var sSelectedKey = that.getView().byId("idIconTabBar").getSelectedKey() || null;
            // 
            $.ajax({
                url: url,
                type: type,
                data: Data,
                contentType: 'application/json',
                success: function (oData, response) {
                    // 
                    BusyIndicator.hide();
                    if (action == "RequestChangeKey") {
                        var oResposeObj = that.createSuccessMsg(aMessageArray, OBRno);
                        MessageBox.success(oResposeObj, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                that.check();
                            }
                        })
                    }
                    else if (action == "EidchangeKey") {
                        MessageBox.success(oData.value[0].Message, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                that.check();
                            }
                        });
                    }
                    else if (action == "RequestForward") {
                        MessageBox.success(oData.value[0].Message, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                that.check();
                            }
                        });
                    }
                    else if (action == "StatusChange") {
                        MessageBox.success(oData.value[0].OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                that.check();
                            }
                        });
                    }
                    else if (action == "ResendNotify") {
                        MessageBox.success(oData.value.toString());
                        // that.readEntityData();
                    }
                    else if (action == "InviteCreate") {
                        MessageBox.success(oData.value[0].OUT_SUCCESS, {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                // return
                                // that.readEntityData();
                                
                                that.check(true);
                                temp = "create";
                                that.readVendorMasterS4Hana();
                                
                                if(that.sVcode === "QR"){
                                    var oSemantic = "ideal_registration_approval";
                                    var iRequestNo = oData.value[0].OUT_SUCCESS.split(": ")[1];
                                    var additionalHash = "&/editDetails/"+iRequestNo;
                                    var param = {};
                                    that.crossNavigation(iRequestNo,oSemantic,additionalHash,param);
                                
                               // navigate to Supplier application
                                
                                }
                            }
                        })
                    }
                },
                error: function (error) {
                    // 
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
        //to check (values) fields of icontabbar after posting
        check: function (bFlag) {
            // 

            var sFilter
            var sFilter
            var sSelectedKey = that.getView().byId("idIconTabBar").getSelectedKey() || null;

            if (bFlag) {
                sFilter = ""
            }
            else if (sSelectedKey == "Invited") {
                sFilter = "(STATUS eq 2)"

            }
            else if (sSelectedKey == "NotInvited") {
                sFilter = "(STATUS eq 1 or STATUS eq 15)"
            }
            else if (sSelectedKey == "InviteRejected") {
                sFilter = "(STATUS eq 3)"
            }
            else if (sSelectedKey == "Deleted") {
                sFilter = "(STATUS eq 14)"
            }
            else if (sSelectedKey == "All") {
                sFilter = null
            }

            that.readUserMasterEntities(sFilter, null);
        },

        //create success msg for type change
        createSuccessMsg: function (aMsgs, iObrNo) {
            // 
            var successString = "";
            if (aMsgs.length !== 0) {
                for (var i = 0; i < aMsgs.length; i++) {
                    if (i === 0) {
                        successString = aMsgs[i];
                    }



                    if (i !== aMsgs.length - 1 && i !== 0) {
                        successString += ", " + aMsgs[i];
                    } else if (i === aMsgs.length - 1 && i !== 0) {
                        successString += "and " + aMsgs[i];
                    }
                }
                successString += "has been changed for Request No : " + iObrNo;
            }
            return successString;
        },

        oMockData:function(){
            // 
            var obj = {
                "value":[
                    {
                    "Ktokk": "0012",
                    "Txt30": "Hierarchy Node"
                },
                {
                    "Ktokk": "CDP",
                    "Txt30": "One-Time-Distributor"
                },
                {
                    "Ktokk": "MNFR",
                    "Txt30": "Manufacturer (ext.no.assgnmnt)"
                },
                {
                    "Ktokk": "EMPL",
                    "Txt30": "Employee as Supplier"
                },
                
            ]
            }
            var disModel = new JSONModel(obj);
            this.getView().setModel(disModel, "distribut_Type")
        }
    });
});
