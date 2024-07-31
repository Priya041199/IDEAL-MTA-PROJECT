sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "sap/m/Token"
],
function (BaseController, JSONModel, MessageBox, Fragment, Filter, FilterOperator, BusyIndicator,Token) {
    "use strict";
    var that = null;
    var oView = null;
    var context = null;
    var appModulePath = null;
    return BaseController.extend("com.ibs.ibsappidealusermaster.controller.MasterPage", {
        onInit: function () {
            context = this;
                that = this;
                oView = that.getView();

                var object = {
                    "USER_ID": "",
                    "EMAIL": "",
                    "USER_ROLE": "",
                    "USER_NAME": "",
                    "COMPANY_CODE": "",
                    "ENTITY_DESC": "",
                    "EMP_NO": "",
                    "USER_CC_Description": "",
                    "SR_NO": 1
                };
                var tableJson = new JSONModel(object);
                that.getView().setModel(tableJson, "tableJson");

                that.oPModel = this.getOwnerComponent().getModel("oPropertyModel");

                that.onPremiseM = this.getOwnerComponent().getModel("onPremiseSrv");
                that._getUserAttributes();
        },
        _getUserAttributes: function () {
            // 
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);
            var attr = appModulePath + "/user-api/attributes";
            // that._sUserID = "darshan.l@intellectbizware.com";
            // that._sUserName = "Darshan Lad";
            // that.readMatrixData();
            // that.readNewMatrixData();

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: attr,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, response) {
                        that._sUserID = data.email.toLowerCase();
                        that._sUserName = data.firstname + " " + data.lastname;
                        that.readMatrixData();
                        that.readNewMatrixData();
                    },
                    error: function (oError) {
                        MessageBox.error("Error while reading User Attributes");
                    }
                });
            });
        },

        postAjax: function (url, type, data, model) {
            BusyIndicator.show();
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
                    // 
                    BusyIndicator.hide();
                    if (model === "newMatrixJson") {
                        var modifiedData = {};
                        var modifiedrole = {};// Object to store modified data
// Iterate through the original data
data.value.forEach(function(item) {
var name = item.EMAIL; // Assuming 'name' is the key field for identifying the person
var uRole = item.USER_ROLE; // Assuming 'company' is the field for the associated company
var uRoleDescription = item.TO_USER_ROLE.DESCRIPTION;
var eArr = [];
for(var i = 0 ; i<item.TO_USER_ENTITIES.length; i++){
            var a = item.TO_USER_ENTITIES[i].ENTITY_DESC;
            eArr.push(a);
}

var code = [];
for(var i = 0 ; i<item.TO_USER_ENTITIES.length; i++){
            var b = item.TO_USER_ENTITIES[i].ENTITY_CODE;
            code.push(b);
}

var roleCode = [];
// for(var i = 0 ; i<item.length; i++){
//             var c = item.TO_USER_ROLE.CODE;
//             roleCode.push(c);
// }
 var c = item.USER_ROLE;
    roleCode.push(c);

if (modifiedData[name]) {
    modifiedData[name].USER_ROLE.push(uRole);
    modifiedData[name].DESCRIPTION.push(uRoleDescription); // Store multiple companies associated with the person
} else {
    // Create a new entry for unique names
    modifiedData[name] = {
        EMAIL: name,
        USER_NAME : item.USER_NAME,
        companies : [eArr],
        USER_ROLE : [uRole],
        SR_NO : item.SR_NO,
        ENTITY_CODE : code,
        USER_ROLE_CODE : [roleCode],
        DESCRIPTION : [uRoleDescription]
         // Store the first company associated with the person in an array
    };
}
});

// Convert the modified data object to an array for table binding
var modifiedDataArray = [];
for (var key in modifiedData) {
modifiedDataArray.push(modifiedData[key]);
}

var oNewModelmat = new JSONModel(modifiedDataArray);
context.getView().setModel(oNewModelmat, "newMatrixJson");

// function createTokens(userRoles) {
//     var tokens = [];
//     if (userRoles !== null && userRoles !== " " && userRoles !== undefined) {
//         userRoles.forEach(function(role) {
//             var token = new sap.m.Token({
//                 text: role,
//                 key: role
//             });
//             tokens.push(token);
//         });
//     } else {
//         tokens.push(new sap.m.Token({
//             text: "NA",
//             key: "NA"
//         }));
//     }
//     return tokens;
// }

// Iterate through modifiedDataArray to set tokens for each MultiInput
// var userTable = context.getView().byId("id_Table");
// modifiedDataArray.forEach(function(userData) {
//     var multiInput = new sap.m.MultiInput({
//         tokens: {
//             path: "USER_ROLE",
//             template: new sap.m.Token({
//                 text: "{USER_ROLE}"
//             })
//         },
//         showValueHelp: true
//     });

//     var userRoles = userData.USER_ROLE;
//     multiInput.setTokens(createTokens(userRoles)); // Set tokens for the MultiInput

//     var oItemTemplate = userTable.getItems()[0].clone();
//     oItemTemplate.getCells()[1] = multiInput;
//     userTable.addItem(oItemTemplate);
// });               

                    }else if(model === "matrixJson"){
                        var oModelmat = new JSONModel(data);
                        context.getView().setModel(oModelmat, "matrixJson");

                    }else if (model === "userRoleModel") {
                        var userRoleModel = new JSONModel(data);
                        sap.ui.getCore().byId("id_userRole").setModel(userRoleModel, "userRoleModel");
                    }
                    // else if (model === "entityDetails") {
                    //     var entityModel = new JSONModel(data);
                    //     that.getView().setModel(entityModel, "entityDetails");
                    // }
                    else if (model === "user_ID_Model") {
                        var entityId = sap.ui.getCore().byId("id_F4Entity");
                        var userIdModel = new JSONModel(data);
                        entityId.setModel(userIdModel, "user_ID_Model");
                        that.entityFragment.open();
                    }
                    else if(model === "userEntityCode" ){
                        var entityModel = new JSONModel(data);
                        that.getView().setModel(entityModel, "entityDetails");
                    }
                    else if (model === "handleSubmit") {
                        var oAction = that.oPModel.getProperty("/sAction");
                        if (oAction === "UPDATE" || oAction === "CREATE") {
                            that.matrixDialog.close();
                            that.matrixDialog.destroy();
                            that.matrixDialog = null;
                        }
                        var msg = data.value.outputScalar.OUT_SUCCESS;
                        MessageBox.success(msg, {
                            actions: [MessageBox.Action.OK],
                            onClose: function (oAction) {
                                if (oAction === "OK") {
                                    that.readNewMatrixData();
                                }
                            }
                        });
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
        // formatRoles : function(roles){
        //     ;
        //     var tokens = [];
        // if (Array.isArray(roles)) {
        //     roles.forEach(function(role) {
        //         tokens.push(new Token({
        //             text: role,
        //             key: role
        //         }));
        //     });
        // }
        // return tokens;
        // },
        readNewMatrixData: function () {
            // var url = appModulePath + "/ideal-master-maintenance/MasterIdeaUsers?$filter=ACTIVE eq 'X'";
            var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterIdealUsers?$filter=ACTIVE eq 'X'";
            var data = { $expand: 'TO_USER_ROLE,TO_ENTITY_CODE,TO_USER_ENTITIES' };
            this.postAjax(url, "GET", data, "newMatrixJson");
        },

        readMatrixData: function () {
            // var url = appModulePath + "/ideal-master-maintenance/MasterIdeaUsers?$filter=ACTIVE eq 'X'";
            var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterIdealUsers?$filter=ACTIVE eq 'X'";
            var data = { $expand: 'TO_USER_ROLE,TO_ENTITY_CODE,TO_USER_ENTITIES' };
            this.postAjax(url, "GET", data, "matrixJson");
        },

        onSearch: function (oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var oFilter1 = [new sap.ui.model.Filter("USER_NAME", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("EMAIL", sap.ui.model.FilterOperator.Contains, sQuery)];
                var allFilters = new sap.ui.model.Filter(oFilter1, false);
                aFilters.push(allFilters);
            }
            var oList = this.byId("id_Table");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        },

        handleMatrixDialog: function (evt) {
            // 
            if (!this.matrixDialog) {
                this.matrixDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealusermaster.view.fragment.matrix", this);
                this.getView().addDependent(this.matrixDialog);
            }
            that.readUserRole();
            that.readEntityDetails();
            this.matrixDialog.open();

            var matrixData = that.getView().getModel("tableJson").getData();
            matrixData.USER_ID = "";
            matrixData.USER_ROLE = "";
            matrixData.ENTITY_CODE = "";
            matrixData.ENTITY_DESC = "";
            matrixData.APPROVER_LEVEL = "";
            matrixData.EMAIL = "";
            matrixData.USER_NAME = "";
            matrixData.EMP_NO = "";
            matrixData.USER_CC_Description = "";
            matrixData.COMPANY_CODE = "";
            that.getView().getModel("tableJson").refresh(true);

            that.oPModel.setProperty("/title", "Add User");
            that.oPModel.setProperty("/sAction", "CREATE");
            that.oPModel.setProperty("/require", true);
            that.oPModel.setProperty("/submit", true);
            that.oPModel.setProperty("/update", false);
            that.oPModel.setProperty("/valEntity", true);
            that.oPModel.setProperty("/valUserRole", true);
        },

        readUserRole: function () {
            var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterUserRole";
            this.postAjax(url, "GET", null, "userRoleModel");
        },

        readEntityDetails: function () {
            var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterEntityCode";
            this.postAjax(url, "GET", null, "userEntityCode");
        },

        onUpdate: function (evt) {
            // ;
            if (!this.matrixDialog) {
                this.matrixDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealusermaster.view.fragment.matrix", this);
                this.getView().addDependent(this.matrixDialog);
            }
            that.readUserRole();
            that.readEntityDetails();
            this.matrixDialog.open();

            // var object = evt.getSource().getBindingContext("newMatrixJson").getObject();
            that.oPModel.setProperty("/title", "Update User");
            that.oPModel.setProperty("/sAction", "UPDATE");
            var object = evt.getSource().getBindingContext("newMatrixJson").getObject();
            var matrixData = that.getView().getModel("tableJson").getData();
            var aEntityArray = [];

            for (var i = 0; i < object.ENTITY_CODE.length; i++) {
                aEntityArray.push(object.ENTITY_CODE[i]);
            }

            sap.ui.getCore().byId("id_entityCode").setSelectedKeys(aEntityArray);

            matrixData.USER_ID = object.USER_ID;

            sap.ui.getCore().byId("id_userRole").setSelectedKeys(object.USER_ROLE);
            matrixData.USER_ROLE = object.USER_ROLE;
            matrixData.USER_NAME = object.USER_NAME;
            matrixData.EMAIL = object.EMAIL;
            matrixData.COMPANY_CODE = object.companies;
            matrixData.SR_NO = object.SR_NO;
            matrixData.USER_ID = object.EMAIL;

            that.getView().getModel("tableJson").refresh(true);
            that.oPModel.setProperty("/require", false);
            that.oPModel.setProperty("/submit", false);
            that.oPModel.setProperty("/update", true);
            that.oPModel.setProperty("/valEntity", false);
            that.oPModel.setProperty("/valUserRole", false);

            // that.getView().getModel("tableJson").setProperty("/EMAIL" , object.EMAIL);
        },

        _closeDialog: function () {
            this.matrixDialog.close();
            this.matrixDialog.destroy();
            this.matrixDialog = null;
        },

        onDelete: function (evt) {
            
            var object = evt.getSource().getBindingContext("newMatrixJson").getObject();
            var matrixData = that.getView().getModel("tableJson").getData();
            matrixData.USER_ID = object.USER_ID;
            matrixData.USER_ROLE = object.USER_ROLE;
            matrixData.USER_NAME = object.USER_NAME;
            matrixData.EMAIL = object.EMAIL;
            matrixData.COMPANY_CODE = object.companies;
            matrixData.SR_NO = object.SR_NO;
            that.oPModel.setProperty("/sAction", "DELETE");

            MessageBox.confirm("Are you sure you want to delete this User?", {
                title: "CONFIRMATION",
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (sAction) {
                    if (sAction === "YES") {
                        that.handleSubmit();
                    }
                }
            });
        },

        handleSubmit: function () {
            // debugger;
            var distData = that.getView().getModel("tableJson").getData();
            var oArray = this.getView().getModel("matrixJson").getData().value;
            var oAction = that.oPModel.getProperty("/sAction");

            // var fragData=sap.ui.getCore().byId("id_user").getSelectedItems();
            // for (let i = 0; i < fragData.length;i++) {
            //     arr.push(fragData[i].getProperty("text"));
            // }

            var url = appModulePath + "/odata/v4/ideal-master-maintenance/PostUserMaster"
            if (oAction === "DELETE") {
                var payload = that._getPayload();
                var data = JSON.stringify(payload);

                this.postAjax(url, "POST", data, "handleSubmit");
            }
            else {
                var duplicateEmail = null;
                for (var i = 0; i < oArray.length; i++) {
                    if (oArray[i].EMAIL === distData.EMAIL) {
                        duplicateEmail = oArray[i].EMAIL;
                        break;
                    }
                }
                if ((oAction === "CREATE") && (duplicateEmail !== null)) {
                    MessageBox.warning("This user already exist.");
                }
                else {
                    var msg = "",
                        valid = true;
                    if (oAction !== "DELETE") {
                        valid = that.validateForm();
                    }
                    if (valid === true) {
                        var payload = that._getPayload();
                        var data = JSON.stringify(payload);

                        this.postAjax(url, "POST", data, "handleSubmit");
                    }else{

                    }
                }
            }

        },

        validateForm: function () {
            
            var flag = true;
            var entity = sap.ui.getCore().byId("id_entity");
            // var userId = sap.ui.getCore().byId("id_userId");
            var userRole = sap.ui.getCore().byId("id_userRole");
            var entityCode = sap.ui.getCore().byId("id_entityCode");

            if (entity.getValue() === "") {
                entity.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select User ID.");
                entity.focus();
                flag = false;
            } else entity.setValueState(sap.ui.core.ValueState.None);
            if (entityCode.getSelectedKeys().length === 0) {
                entityCode.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select at least One Entity.");
                entityCode.focus();
                flag = false;
            } else entityCode.setValueState(sap.ui.core.ValueState.None);
            if (userRole.getSelectedKeys().length === 0) {
                userRole.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Select User Role.");
                userRole.focus();
                flag = false;
            } else userRole.setValueState(sap.ui.core.ValueState.None);
            return flag;
        },

        _getPayload: function () {
            
            var distData = that.getView().getModel("tableJson").getData();
            var entityCode = sap.ui.getCore().byId("id_entityCode");
            var role = sap.ui.getCore().byId("id_userRole");
            var aEntityCode = []
            var aEntityArray = [];
            var aRole = [];
            var oAction = that.oPModel.getProperty("/sAction");
            if (oAction === "DELETE") {
                var role = distData.USER_ROLE;
               
                for(var i = 0; i < role.length; i++){
                    ;
                    if(role[i] === "Commercial Manager"){
                        role[i] = "CM"
                    }else{
                        role[i] = "SA"
                    }
                    var rObject = role[i];
                    var registeredObject = {
                        "SR_NO": distData.SR_NO,
                        "USER_ID": distData.EMAIL,
                        "USER_ROLE": rObject,
                        "USER_NAME": distData.USER_NAME,
                        "EMAIL": distData.EMAIL,
                        "COMPANY_CODE": aEntityCode.toString(),
                        "EMP_NO": distData.EMP_NO,
                        "CREATED_ON": new Date(),
                        "UPDATED_ON": new Date(),
                        "ACTIVE": "X"
                    };
                    aRole.push(registeredObject);
                }
            }
            else {
                distData.USER_ROLE = role;
                for(var j = 0;j < role.getSelectedKeys().length; j++){
                    ;
                    for (var i = 0; i < entityCode.getSelectedKeys().length; i++) {
                        var itemObject = entityCode.getSelectedItems()[i].getBindingContext("entityDetails").getObject();
                        var roleObject = role.getSelectedItems()[j].getBindingContext("userRoleModel").getObject();
                        var obj = {
                            "USER_ID": distData.USER_ID,
                            "USER_ROLE": roleObject.CODE,
                            "ENTITY_CODE": itemObject.BUKRS,
                            "ENTITY_DESC": itemObject.BUTXT,
                            "EMAIL": distData.EMAIL
                        };
                        aEntityArray.push(obj);
                        aEntityCode.push(itemObject.BUKRS);
                    }
                }

                for(var i = 0; i < role.mProperties.selectedKeys.length; i++){
                    // ;
                    var rObject = role.mProperties.selectedKeys[i];
                    var registeredObject = {
                        "SR_NO": distData.SR_NO,
                        "USER_ID": distData.USER_ID,
                        "USER_ROLE": rObject,
                        "USER_NAME": distData.USER_NAME,
                        "EMAIL": distData.EMAIL,
                        "COMPANY_CODE": aEntityCode.toString(),
                        "EMP_NO": distData.EMP_NO,
                        "CREATED_ON": new Date(),
                        "UPDATED_ON": new Date(),
                        "ACTIVE": "X"
                    };
                    aRole.push(registeredObject);
                }
            }

            var userDetails = {
                "USER_ROLE": "SA",
                "USER_ID": that._sUserID
            };

            var action = that.oPModel.getProperty("/sAction");
            var payload = {
                "input": {
                    "ACTION": action,
                    "USER_DETAILS": userDetails,
                    "VALUE": [{
                        "USERMASTER": aRole,
                        "ENTITYDATA": aEntityArray
                    }]
                }
            };
            return payload;
        },

        handleEntityDesc: function (oEvent) {
            
            var oButton = oEvent.getSource();
            var oView = this.getView();
            var sObject = oEvent.getSource().getBindingContext("newMatrixJson").getObject();
            var sEntityJson = new JSONModel();
            var entityObject = sObject.companies[0];
            var moArr =[];
            for(var k=0;k<entityObject.length;k++){
                var mo=entityObject[k];
                moArr.push(mo);
            }
            
            var distinctValues = new Set(moArr);
            var distinctArray=[...distinctValues];

            sEntityJson.setData( distinctArray );
            oView.setModel(sEntityJson, "sEntityJson")

            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "com.ibs.ibsappidealusermaster.view.fragment.entity",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    oPopover.bindElement("/sEntityJson");
                    return oPopover;
                });
            }
            this._pPopover.then(function (oPopover) {
                oPopover.setPlacement("Right");
                oPopover.openBy(oButton);
            });
        },

        handleCloseButton: function (oEvent) {
            this.byId("myPopover").close();
        },

        handleValueEntityHelp: function (oEvent) {
            
            if (!this.entityFragment) {
                this.entityFragment = sap.ui.xmlfragment("com.ibs.ibsappidealusermaster.view.fragment.user_ID", this);
                this.getView().addDependent(this.entityFragment);
            }
            var oFilters = [];

            var entityId = sap.ui.getCore().byId("id_F4Entity");
            var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterIasUser";
            this.postAjax(url, "GET", null, "user_ID_Model");
        },

        handleEntityValueHelpSearch: function (evt) {
            var aFilter = [];
            var sQuery = evt.getParameter("value");
            if (sQuery) {
                var oFilter1 = [new sap.ui.model.Filter("EMAIL", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("USER_NAME", sap.ui.model.FilterOperator.Contains, sQuery)
                ];
                var allFilters = new sap.ui.model.Filter(oFilter1, false);
                aFilter.push(allFilters);
            }
            var oList = sap.ui.getCore().byId("id_F4Entity");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },

        handleEntityValueHelpClose: function (evt) {
            
            var oSelectedItem = evt.getParameter("selectedItem");
            that.getView().getModel("tableJson").setProperty("/EMAIL", oSelectedItem.getBindingContext("user_ID_Model").getProperty("EMAIL"));
            sap.ui.getCore().byId("id_entity").setValueState(sap.ui.core.ValueState.None);
            var oFIRST_NAME = oSelectedItem.getBindingContext("user_ID_Model").getProperty("FIRST_NAME");
            var oLAST_NAME = oSelectedItem.getBindingContext("user_ID_Model").getProperty("LAST_NAME");
            that.getView().getModel("tableJson").setProperty("/USER_NAME", oFIRST_NAME + " " + oLAST_NAME);
            that.getView().getModel("tableJson").setProperty("/COMPANY_CODE", oSelectedItem.getBindingContext("user_ID_Model").getProperty("COMPANY_CODE"));
            that.getView().getModel("tableJson").setProperty("/USER_ID", oSelectedItem.getBindingContext("user_ID_Model").getProperty("EMAIL"));
            that.getView().getModel("tableJson").setProperty("/EMP_NO", oSelectedItem.getBindingContext("user_ID_Model").getProperty("EMP_NO"));
        },

        onEntityChange: function (evt) {
            evt.getSource().setValueState(sap.ui.core.ValueState.None);
        },

        onUserRoleChange: function (evt) {
            evt.getSource().setValueState(sap.ui.core.ValueState.None);
        }
    });
});
