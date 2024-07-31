jQuery.sap.require("com.ibs.ibsappidealsystemconfiguration.model.down");
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/BindingMode",
    "sap/ui/core/BusyIndicator",
    "com/ibs/ibsappidealsystemconfiguration/model/downloadLib",
    "com/ibs/ibsappidealsystemconfiguration/model/formatter",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
    "sap/ui/core/util/File",
    "sap/ui/export/library",
    "sap/m/Token"
],
function (Controller, JSONModel, Column, ColumnListItem, Filter, FilterOperator, Spreadsheet, MessageBox,
    MessageToast, BindingMode, BusyIndicator, downloadLib, formatter, ChartFormatter, Format, utilFile,
    exportLibrary, Token) {
    "use strict";
    var oAddTable;
    var myJSONModel;
    var onPremiseModel;
    var onConfigModel;
    var oTable;
    var oModel1, oModel;
    var oChartModel;
    var origModel;
    var OriginalData;
    var oColumn;
    var dataSource;
    var context = null;
    var counter;
    var Value;
    var oMasterArray;
    var sCountryCode;
    var sTableName;
    var aHeaderText;
    var aPropertytext;
    var tabEvent;
    var csvPreviewData;
    var obj;
    var mastTabLen = 0;
    var tableStatus;
    var btoAconvert;
    var mimeType;
    var iRequestTypeVH;
    var sEntityCodeVH;
    var myJSONModel2,that;
    var data1;
    var csvBtn;
    var aEmailTo;
    var aEmailCc;
    var headerRowsText;
    var EdmType = exportLibrary.EdmType;
    var appModulePath;
    var sUserRole;
    return Controller.extend("com.ibs.ibsappidealsystemconfiguration.controller.MasterPage", {
        formatter: formatter,
        onInit: function () {
            myJSONModel2 = new JSONModel();
                context = this;
                that = this;
                counter = 0;
                that.tokenModel = new JSONModel();
                that.oMultiToken = new JSONModel();
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                onPremiseModel = context.getOwnerComponent().getModel("onPremiseModel");
                onConfigModel = context.getOwnerComponent().getModel();
                this._getUserAttributes();
                this._setBlankJsonModel(this._getBlankObject());
                this._getDashBoardData("DASHBOARD");
                this.fragValueStates();

                var oView = this.getView();
			    var oModel = new JSONModel();
			    oView.setModel(oModel);

                var oMultiInput1 = oView.byId("idCcEmail");
                // var oMultiInput2 = sap.ui.getCore().byId("idCcEmailFrag");

                var fnValidator = function(args){
                    var text = args.text;
    
                    return new Token({key: text, text: text});
                };
    
                oMultiInput1.addValidator(fnValidator);
        },
        _getUserAttributes: function () {
            // 
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);
            var attr = appModulePath + "/user-api/attributes";

            context._sUserID = "darshan.l@intellectbizware.com";
            context._sUserName = "Darshan Lad";

            // return new Promise(function (resolve, reject) {
            //     $.ajax({
            //         url: attr,
            //         type: 'GET',
            //         contentType: 'application/json',
            //         success: function (data, response) {

            //             context._sUserName = data.firstname + " " + data.lastname;
            //             context._sUserID = data.email.toLowerCase().trim();
            //         },
            //         error: function (oError) {
            //             MessageBox.error("Error while reading User Attribute");
            //         }
            //     });
            // });
        },
        
        onAfterRendering: function () {
            // 
            this.readCompanyCodeset();
            this.onMasteriDealAttachmentsRead();
            this.onNdaAttachmentTypeRead();
            // this.onOTtableRead();
            this.readCountrySet();
            this.readFormEntries();
            this.readFormErrorlog();
            this.readUserRole();
            var oModel = new JSONModel([]);
            context.getView().setModel(oModel, "payloadData");
            context.enableMdgPayloadBtn(false, false, false);
        },
        // getUserMasterEntities : function(){
        //     ;
        //     var url = appModulePath + "/ideal-admin-panel-srv/GetAdminPanelData(action='MASTER_FORMS',tableCode=null,requestNo=null)";
        //     this.postAjax(url, "GET", null, "readFormDetails", "readFormDetails");
        // },
        _getBlankObject: function () {
            // 
            var jsonObject = {
                "Client_Info": {},
                "Sap_Info": {},
                "SubAccount_Info": {},
                "masterCredential_Info": {}
            }
            return JSON.parse(JSON.stringify(jsonObject));
        },

        _numberValidation: function (oEvent) {
            // 
            var oSource = oEvent.getSource();
            var reg = /^[0-9]+$/.test(oSource.getValue());
            if (reg === true || oSource.getValue() === "") {
                oSource.setValueState(sap.ui.core.ValueState.None);
            } else {
                oEvent.getSource().setValue("");
                oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only numbers");
            }
        },

        isValidJsonString: function (sDataString) {
            // 
            var value = null;
            var oArrObj = null;
            var sErrorMessage = "";
            try {
                if (sDataString === null || sDataString === "" || sDataString === undefined) {
                    throw "No data found.";
                }

                value = JSON.parse(sDataString);
                if (toString.call(value) === '[object Object]' && Object.keys(value).length > 0) {
                    return true;
                } else {
                    throw "Error";
                }
            }
            catch (errorMsg) {
                if (errorMsg === "No data found.") {
                    sErrorMessage = errorMsg;
                } else {
                    sErrorMessage = "Invalid JSON data."
                }
                return false;
            }
            return true;
        },

        _validateEmail: function (oEvent) {
            // 
            var oSource = oEvent.getSource();

            var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(oSource.getValue());

            if (reg === true && (oSource.getValue() !== "" || oSource.getValue() !== null)) {
                var email = oSource.getValue();
                email = email.trim();
                oSource.setValue(email);
                oSource.setValueState(sap.ui.core.ValueState.None);
            } else {
                oEvent.getSource().setValue("");
                oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid email address");
            }
        },

        onHostChange: function (oEvent) {
            // 
            var oSource = oEvent.getSource();
            var reg = /^\s*[\w.-]+(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{3,}\s*$/.test(oSource.getValue());
            if (reg === true || oSource.getValue() === "") {
                oSource.setValueState(sap.ui.core.ValueState.None);
            } else {
                oEvent.getSource().setValue("");
                //oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("eg. https://www.example.com");
                oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("eg- smtp.office365.com");
            }
        },

        onPasswordChange: function (oEvent) {
            // 
            var password = oEvent.getSource().getValue();

            var minLength = 8;
            var hasUppercase = /[A-Z]/.test(password);
            var hasLowercase = /[a-z]/.test(password);
            var hasNumber = /\d/.test(password);
            var hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

            if ((password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) || oEvent.getSource().getValue() === "") {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
            }
            else {
                oEvent.getSource().setValue("");
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Weak password");
            }
        },

        _setBlankJsonModel: function (jsonObject) {
            // 
            var blanckJsonModel = new JSONModel(jsonObject);
            this.getView().setModel(blanckJsonModel, "blankJson");
            var clientInfo = {
                "CLIENT_COUNTRY": null,
                "CLIENT_FULL_NAME": null,
                "CLIENT_SHORT_NAME": null,
                "CONTACT_ID_1": null,
                "CONTACT_ID_2": null,
                "CONTACT_ID_3": null,
                "EMAIL_NOTIF_1": null,
                "EMAIL_NOTIF_2": null,
                "EMAIL_NOTIF_3": null,
                "SR_NO": null
            }
            this.getView().getModel("blankJson").setProperty("/clientinfo", clientInfo);

            var sapInfo = {
                CLIENT: null,
                DESTINTAION: null,
                SR_NO: null
            }
            this.getView().getModel("blankJson").setProperty("/sapinfo", sapInfo);

            var attchInfo = {
                SETTING: null,
                DESCRIPTION: null,
                URL: null
            }
            this.getView().getModel("blankJson").setProperty("/attchinfo", attchInfo);

            var subAccountInfo = {
                PORTAL_LINK: null,
                SR_NO: null,
                SUBACCOUNT: null
            }
            this.getView().getModel("blankJson").setProperty("/subaccinfo", subAccountInfo);

            var masterCredentialInfo = {
                SR_NO: null,
                USERNAME: null,
                PASSWORD: null,
                TYPE: "USER",
                ADD_INFO1: null,
                ADD_INFO2: null,
                ADD_INFO3: null,
                CREATED_ON: null
            }
            this.getView().getModel("blankJson").setProperty("/mastercredinfo", masterCredentialInfo);

            var SmtpConfig = {
                HOST: null,
                PORT: null,
                SECURE: "false",
                USERNAME: null,
                PASSWORD: null,
                SENDER_ID: null
            };
            this.getView().getModel("blankJson").setProperty("/smtpConf", SmtpConfig);
        },
        readUserRole: function () {
            var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterUserRole";
            this.postAjax(url, "GET", null, "userRoleModel", "userRoleModel");
        },
        readOrgConfigData: function (sAction, sValue) {
            //debugger;
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/GetAdminPanelData(action='MASTER_FORMS',tableCode=null,requestNo=null)";
            this.postAjax(url, "GET", null, "readFormDetails", "readFormDetails");
        },

        _getDashBoardData: function (sAction, sValue) {
            // 
            if (sAction == "DASHBOARD") {
                var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/GetAdminPanelData(action='" + sAction + "',tableCode=null,requestNo=null)";
                this.postAjax(url, "GET", null, "dashBdModel", "dashBdModel");
            }
            else if (sAction == "MDG_PAYLOAD") {
                var TableCode = context.getView().getModel("payloadData").getProperty("/ENTITY_CODE");
                var Req = context.getView().getModel("payloadData").getProperty("/REQUEST_NO")
                var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/GetAdminPanelData(action='" + sAction + "',tableCode='" + TableCode + "',requestNo=" + Req + ")";
                this.postAjax(url, "GET", null, "mdgPayloadModel", "mdgPayloadModel");
            }
        },

        //**********************************  FORM FIELDS ICON TAB BAR  ********************************//

        onValueHelpRequestForm: function () {
            
            this.openFormListDialog();
        },

        openFormListDialog: function () {
            
            if (!this.formDialog) {
                this.formDialog = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.formList", this);
                this.getView().addDependent(this.formDialog);
            }
            this.formDialog.open();
        },
        onValueHelpReqType: function () {
            
            if (!this.reqList) {
                this.reqList = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.reqTypeAdd", this);
                this.getView().addDependent(context.reqList);
            }
            this.reqList.open();
            myJSONModel.setData(null);
            context.getView().setModel(myJSONModel, "availableMandatoryFields");
        },
        onAddTable : function(){
            ;
            if (!this.dialog191) {
                this.dialog191 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.addFormFields", this);
                this.getView().addDependent(this.dialog191);
            }
            this.dialog191.open();
        },
        onCloseAddTable:function(){
            // ;
            this.dialog191.close();
            this.dialog191.destroy();
            this.dialog191 = null;
        },
        handleCloseAddList: function (oEvent) {
            ;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
            var preSelected = sap.ui.getCore().byId("idFragInp").getValue();
            var iRequestType = oEvent.getSource()._oSelectedItem.getBindingContext("formdata").getObject().CODE;
            sap.ui.getCore().byId("idFragInp").setValue(oSelectedItem.getTitle());
            this.getView().getModel("addFieldsData").setProperty("/requestTypeCode", iRequestType);

            if (preSelected !== oSelectedItem.getTitle()) {
                sap.ui.getCore().byId("idFragEntityInp").setValue("");
                sap.ui.getCore().byId("idCopyEntity").setValue("");

                sap.ui.getCore().byId("RB-1").setSelected(false);
                sap.ui.getCore().byId("RB-2").setSelected(true);
                sap.ui.getCore().byId("idCopyEntity").setVisible(false);
                sap.ui.getCore().byId("idCopyEntityLbl").setVisible(false);
            }

            sap.ui.getCore().byId("idFragInp").setValue(oSelectedItem.getTitle());
            this.getView().getModel("addFieldsData").setProperty("/requestTypeCode", iRequestType);
            this.getView().getModel("addFieldsData").setProperty("/requestType", "None");
            this.getView().getModel("addFieldsData").setProperty("/requestTypeText", "");
            this.oGetMandatoryFields(iRequestType);
           
        },
        onValueHelpEntity : function(){
            ;
            // if (!this.entityListFrag) {
            //     this.entityListFrag = sap.ui.xmlfragment("com.ibspl.ideal.idealsystemconfiguration.view.fragment.onAddEntity", this);
            //     this.getView().addDependent(this.entityListFrag);
            // }
            // this.entityListFrag.open();
            if (!this.entityListFrag) {
                this.entityListFrag = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.onAddEntity", this);
                this.getView().addDependent(this.entityListFrag);
            }
            this.entityListFrag.open();
        },
        handleCloseAddEntityList : function(oEvent){
            
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
            var sEntityCode = oEvent.getSource()._oSelectedItem.getBindingContext("companycodes").getObject().BUKRS;
            sap.ui.getCore().byId("idFragEntityInp").setValue(oSelectedItem.getTitle());
            this.getView().getModel("addFieldsData").setProperty("/entityCodeValue", sEntityCode);
        },
        handleCloseFormList: function (oEvent) {
            ;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
            iRequestTypeVH = oEvent.getSource()._oSelectedItem.getBindingContext("formdata").getObject().CODE;
            this.byId("idFormInp").setValue(oSelectedItem.getTitle());
            

        },
        readFormEntries: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterRequestType";
            this.postAjax(url, "GET", null, "formdata", "formdata");
        },

        onValueHelpFormSearch: function (oEvent) {
            // 
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, sValue);
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        closeFormListDialog: function (oEvent) {
            // 
            oEvent.getSource().getBinding("items").filter([]);
        },
        onValueHelpReqSearch : function(oEvent){
            // debugger;
            var sValue = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter([new Filter("BUKRS", sap.ui.model.FilterOperator.Contains, sValue),
            new Filter("BUTXT", sap.ui.model.FilterOperator.Contains, sValue)], false);
            
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },
        handleCloseFormList: function (oEvent) {
            
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
            iRequestTypeVH = oEvent.getSource()._oSelectedItem.getBindingContext("formdata").getObject().CODE;
            this.byId("idFormInp").setValue(oSelectedItem.getTitle());
        },
        onValueHelpEntityForm: function () {
            
            
            // this.onSearchForm("filter");
            
            this.openEntityFormListDialog();
            // var oBinding = this.byId("idFormTable").getBinding("items");
            // oBinding.filter([]);
//                 var aFilters = [];
// this.getView().byId("idFormTable").getBinding("items").filter(aFilters);
// var data = this.getView().geModel("tbldata").getData();
        },

        openEntityFormListDialog: function () {
            
            if (!this.dialog18) {
                this.dialog18 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.entityList", this);
                this.getView().addDependent(this.dialog18);
                
                // var oSearchField = this.byId("idFormSrchFld");
                // Clear the value of the search field
                // oSearchField.setValue("");
                
                // oSearchField.attachLiveChange(function (oEvent) {
                //     var sNewValue = oEvent.getParameter("newValue");
                
                //     // Handle the live change event
                //     // You can add additional logic here if needed
                // });
                
                // oSearchField.attachSearch(function (oEvent) {
                //     // Handle the search event
                //     // You can add additional logic here if needed
                // });
            }
            this.dialog18.open();
        },

        onCloseFormEdit:function(){
            // ;
            this.dialog18.close();
            this.dialog18.destroy();
            this.dialog18 = null;
        },

        onValueHelpEntityFormSearch: function (oEvent) {
            // 
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter({
                filters: [
                    new Filter("BUKRS", sap.ui.model.FilterOperator.Contains, sValue),
                    new Filter("BUTXT", sap.ui.model.FilterOperator.Contains, sValue)
                ]
            });
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        handleCloseEntityFormList: function (oEvent) {
            
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
            sEntityCodeVH = oEvent.getSource()._oSelectedItem.getBindingContext("companycodes").getObject().BUKRS;
            this.byId("idFormEntityInp").setValue(oSelectedItem.getTitle());
        },
        // handleCloseEntityList : function(oEvent){
        //     ;
        //     var oSelectedItem = oEvent.getParameter("selectedItem");
        //     oEvent.getSource().getBinding("items").filter([]);
        //     sEntityCodeVH = oEvent.getSource()._oSelectedItem.getBindingContext("companycodes").getObject().BUKRS;
        //     this.byId("idFormEntityInp").setValue(oSelectedItem.getTitle());
        // },
        closeEntityFormListDialog: function (oEvent) {
            // 
            oEvent.getSource().getBinding("items").filter([]);
        },

        onSelectGo: function (oEvent) {
            // 
            this.getView().byId("idFormSrchFld").setValue();
            if (iRequestTypeVH === undefined && sEntityCodeVH === undefined) {
                MessageBox.error("Please select Request Type & Entity Code");
            } else if (iRequestTypeVH === "" || iRequestTypeVH === undefined || iRequestTypeVH === null) {
                MessageBox.error("Please select Request Type");
            } else if (sEntityCodeVH === "" || sEntityCodeVH === undefined || sEntityCodeVH === null) {
                MessageBox.error("Please select Entity Code");
            } else {
                this.readVisibleMandatoryData(iRequestTypeVH, sEntityCodeVH);
            }
        },

        readVisibleMandatoryData: function (requestType, entityCode) {
            
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/GetVisbleMandatoryFields(requestType=" + requestType + ",entityCode='" + entityCode + "')";
            this.postAjax(url, "GET", null, "tbldata", null);
        },

        onResetFormTable: function () {
            // 
            var oModel6 = new JSONModel();
            context.getView().setModel(oModel6, "tbldata");
            this.byId("idFormInp").setValue("");
            this.byId("idFormEntityInp").setValue("");
            this.byId("idFormSrchFld").setValue("");
            iRequestTypeVH = "";
            sEntityCodeVH = "";
            context.getView().byId("idTotalItemsFormTable").setVisible(false);
        },
        onSearchSection : function(oEvent){
            ;
            var sQuery = oEvent.getSource().getValue();
        var pFilter = [];
        if (sQuery) {
            pFilter.push(new Filter("CODE", sap.ui.model.FilterOperator.Contains, sQuery));
        }
        var listItem = sap.ui.getCore().byId("idtblform");
        var item = listItem.getBinding("items");
        item.filter(pFilter);
        },
        onFormsetting: function (oEvent) {
            // 
            this.openEditFormSetting();
        },

        openEditFormSetting: function () {
            
            if (!this.dialogsetting) {
                this.dialogsetting = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.Editform", this);
                this.getView().addDependent(this.dialogsetting);
            }
            this.dialogsetting.open();
            this.readiDealformSettingEntries();
        },
        onSectionEdit: function (oEvent) {
            myJSONModel2.setData(Object.assign({}, this.getView().getModel("idealsetdata").getData()));
            this.getView().setModel(myJSONModel2, "oAssignModel");
            that.oPath = oEvent.getSource().getBindingContext("idealsetdata").getPath().split("/")[2];

            // that.oSelectedRowValueTab1 = myJSONModel2.getData().value[oPath];
            var sCode = oEvent.getSource().getBindingContext("idealsetdata").getProperty("CODE");
            var sPreviousCode = myJSONModel.getProperty("/CODE");

            
            if (that.oSelectedRowValueTab1 === undefined) {
                that.oSelectedRowValueTab1 = oEvent.getSource().getBindingContext("idealsetdata").getObject();
            }
            else if (that.oSelectedRowValueTab1 !== undefined && (sCode !== sPreviousCode)) {
                that.oSelectedRowValueTab1 = this.getView().getModel("oAssignModel").getData().value[that.oPath];
            }
            else if (that.oSelectedRowValueTab1 !== undefined && (sCode === sPreviousCode)) {
                that.oSelectedRowValueTab1 = this.getView().getModel("oAssignModel").getData().value[that.oPath];
            }

            myJSONModel.setData(Object.assign({}, that.oSelectedRowValueTab1));
            that.oType = oEvent.getSource().getBindingContext("idealsetdata").getProperty("TYPE");
            var oModel = new JSONModel(that.oSelectedRowValueTab1);
            this.getView().setModel(oModel, "oSelectedRowModel");

            if (!this.formSectionFrag) {
                this.formSectionFrag = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.editFormSection", this);
                this.getView().addDependent(this.formSectionFrag);
            }
            this.formSectionFrag.open();

            if(sCode === "MAX_APPR_LIMIT"){
                // if(sap.ui.getCore().byId("appLimitId") !== undefined){
                    sap.ui.getCore().byId("appLimitId").setVisible(true);
                    sap.ui.getCore().byId("idSwitchformSection").setVisible(false);
                // }
            }else{
                sap.ui.getCore().byId("appLimitId").setVisible(false);
                sap.ui.getCore().byId("idSwitchformSection").setVisible(true);
            }

            // sap.ui.getCore().byId("idChangeSettings").setVisible(true);
        },
        onCloseEditTable: function () {
            this.getView().getModel("oAssignModel").setProperty("/value/" + that.oPath + "/SETTING", myJSONModel.getProperty("/SETTING"));
            this.getView().getModel("oAssignModel").setProperty("/value/" + that.oPath + "/DESCRIPTION", myJSONModel.getProperty("/DESCRIPTION"));
            that.oSelectedRowValueTab1 = myJSONModel.getData();
            this.getView().setModel(myJSONModel, "oSelectedRowModel");

            this.formSectionFrag.close();
        },
        onSubmitSettings: function () {
            var sCode, sDesc, sSetting;

            sCode = sap.ui.getCore().byId("idSectionCode").getValue();
            sDesc = sap.ui.getCore().byId("idSectionDescription").getValue();
            var sExistingDesc = myJSONModel.getProperty("/DESCRIPTION");
            var sExistingSetting = myJSONModel.getProperty("/SETTING");

            var url = appModulePath + "/odata/v4/admin-panel/MasterIdealSettings?$filter=TYPE eq 'EMAIL' or TYPE eq 'PORTAL' or TYPE eq 'REGAPPR'";

            var sState = sap.ui.getCore().byId("idSwitchformSection").getState();
            var value = sap.ui.getCore().byId("appLimitId").getValue();

            if(sCode === "MAX_APPR_LIMIT"){
                if (sState === true) {
                    sSetting = value;
                }
                else {
                    sSetting = null;
                }
            }else{
                if (sState === true) {
                    sSetting = "X";
                }
                else {
                    sSetting = null;
                }
            }
            
            if(sCode === "MAX_APPR_LIMIT"){
                if (sExistingDesc === sDesc && sExistingSetting === sSetting) {
                    MessageBox.information("Please Change the fields and Save");
                }
                else if(sSetting === "" || sSetting === null || sSetting === undefined){
                    MessageBox.information("Please set the approver limit");
                }else{
                    this.onSubmitFormSetting(sCode, sDesc, sSetting, that.oType, url); 
                }
            }else{
                if (sExistingDesc === sDesc && sExistingSetting === sSetting) {
                    MessageBox.information("Please Change the fields and Save");
                }
                else {
                    this.onSubmitFormSetting(sCode, sDesc, sSetting, that.oType, url);
                }
            }
        },
        onCloseFormsetting: function () {
            // 
            this.dialogsetting.close();
        },

        readiDealformSettingEntries: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterIdealSettings?$filter=TYPE eq 'REGFORM' or TYPE eq 'PORTAL'";
            this.postAjax(url, "GET", null, "idealsetdata", null);
        },
        onSubmitFormSetting: function (sCode, sDesc, sSetting, oType, sUrl) {
            var tData = this.getView().getModel("idealsetdata").getData();
            var setting, oRowObj, aRowArray = [];

            oRowObj = {
                "CODE": sCode,
                "DESCRIPTION": sDesc,
                "SETTING": sSetting,
                "TYPE": oType
            };
            aRowArray.push(oRowObj);
             var sPayload = JSON.stringify({
                "EDIT_TYPE": "FORM_SETTINGS",
                "VALUE": [{
                    "TABLE_DATA": aRowArray
                }],
                "USER_DETAILS": {
                    "USER_ID": context._sUserID,
                    "USER_ROLE": sUserRole
                }
            });
            sPayload = JSON.stringify({
                "input": sPayload
            });

            // var inputStringified = JSON.stringify({
            //     "VALUE": [{
            //         "TABLE_DATA": aRowArray
            //     }]
            // });
            // var sPayload = JSON.stringify({
            //     "EDIT_TYPE": "FORM_SETTINGS",
            //     "VALUE": inputStringified,
            //     "userDetails": {
            //         "USER_ID": context._sUserID,
            //         "USER_ROLE": context._sUserName
            //     }
            // });

            MessageBox.confirm("Are you sure you want to Submit?", {
                title: "Confirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {

                    if (sButton === MessageBox.Action.OK) {
                        BusyIndicator.show();
                        var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EditAdminPanelData";
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: sPayload,
                            contentType: 'application/json',
                            success: function (data, response) {
                                var sUrl = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterIdealSettings?$filter=TYPE eq 'REGFORM' or TYPE eq 'PORTAL'";
                                BusyIndicator.hide();
                                that.formSectionFrag.close()
                                that.postAjax(sUrl, "GET", null, "idealsetdata", null);
                                MessageToast.show(data.value[0].OUT_SUCCESS);
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
                    }
                    else {
                        that.getView().byId("idTab1").mAggregations.items[iPath].getCells()[2].setState(false);

                        that.getView().byId("idTab1").mAggregations.items[iPath].getCells()[2].setState(true);
                    }
                }
            });
        },

        onPressOutboudPayload: function () {
            // 
            if (!this.dialogPayload) {
                this.dialogPayload = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.generatePayload", this);
                this.getView().addDependent(this.dialogPayload);
            }
            context.getView().getModel("payloadData").setProperty("/", []);
            context.getView().getModel("payloadData").setProperty("/TextArea", "");
            context.enableMdgPayloadBtn(false, false, false);
            this.dialogPayload.open();
        },

        onGeneratePayloadClose: function () {
            // 
            sap.ui.getCore().byId("idRequestNoInp").setValueState(sap.ui.core.ValueState.None);
            this.dialogPayload.close();
        },

        onGeneratePayload: function (oEvent) {
            // 
            var sValue = sap.ui.getCore().byId("idRequestNoInp").getValue();
            this._getDashBoardData("MDG_PAYLOAD", sValue);
        },

        onGeneratePayloadCopy: function (oEvent) {
            // 
            var sTextAreaVal = context.getView().getModel("payloadData").getProperty("/TextArea");
            var copyText = document.createElement("input");
            copyText.value = sTextAreaVal;
            document.body.appendChild(copyText);
            copyText.select();
            document.execCommand("Copy");
            MessageToast.show("Copied to clipboard");
        },

        onGeneratePayloadDownload: function (oEvent) {
            // 
            var sSupplier = context.getView().getModel("payloadData").getProperty("/VENDOR_NAME1");
            var sTextArea = context.getView().getModel("payloadData").getProperty("/TextArea");
            var sSupplierType = context.getView().getModel("payloadData").getProperty("/SUPPL_TYPE");
            var sCrNo = context.getView().getModel("payloadData").getProperty("/MDG_CR_NO");

            var sFileName = 'MDG Payload for ' + sSupplier + " (" + sSupplierType + ")";
            if (sCrNo !== "" && sCrNo !== null) {
                sFileName += " with CR No. " + sCrNo;
            }

            utilFile.save(sTextArea, sFileName, 'txt', null, null, null);
        },

        enableMdgPayloadBtn: function (enableGetPayloadBtn, enableCopyBtn, enableDownloadBtn) {
            // 
            context.getView().getModel("payloadData").setProperty("/enableGetPayloadBtn", enableGetPayloadBtn);
            context.getView().getModel("payloadData").setProperty("/enableCopyBtn", enableCopyBtn);
            context.getView().getModel("payloadData").setProperty("/enableDownloadBtn", enableDownloadBtn);
            context.getView().getModel("payloadData").refresh(true);
        },

        onRequestNumberValidate: function (oEvent) {
            // 
            var sRequestNumber = oEvent.getSource().getValue();
            sRequestNumber = Number(sRequestNumber);
            this.validationCheckForNumber(sRequestNumber, "idRequestNoInp");
        },

        validationCheckForNumber: function (sNumber, sControlId) {
            // 
            var reg = /^[0-9]+$/.test(sNumber);
            if (reg === true || sNumber === "") {
                sap.ui.getCore().byId(sControlId).setValueState(sap.ui.core.ValueState.None);
                return true;
            } else {
                // var sCorrectedNumber = sNumber.replace(/[^\d.-]/g, '');
                //sap.ui.getCore().byId(sControlId).setValue(sCorrectedNumber);
                sap.ui.getCore().byId(sControlId).setValue(null);
                sap.ui.getCore().byId(sControlId).setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only Numbers.");
                return false;
            }
        },

        handleJsonPayloadClear: function () {
            // 
            context.getView().getModel("payloadData").setProperty("/", {});
            sap.ui.getCore().byId("idRequestNoInp").setValueState(sap.ui.core.ValueState.None);
            context.enableMdgPayloadBtn(false, false, false);
        },

        onGetRequestNumber: function (oEvent) {
            // 
            var sValue = oEvent.getSource().getValue();
            var isValidNumber = this.validationCheckForNumber(sValue, "idRequestNoInp");
            if (sValue !== "" && sValue !== undefined && sValue !== null && sValue.length === 9 && isValidNumber) {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                context.getView().getModel("payloadData").setProperty("/TextArea", "");
                context.enableMdgPayloadBtn(false, false, false);
                this.readGeneratePayload(sValue);
            }
            else if (sValue.length < 9) {
                // oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Length of Request No should be 9.");
                context.getView().getModel("payloadData").setProperty("/", {});
                context.enableMdgPayloadBtn(false, false, false);
            }
            else if ((sValue === "" || sValue === null) || !isValidNumber) {
                context.enableMdgPayloadBtn(false, false, false);
                context.getView().getModel("payloadData").setProperty("/", {});
            }
        },

        readGeneratePayload: function (iReqNo) {
            // 
            jQuery.sap.delayedCall(100, this, function () {
                BusyIndicator.show(0);
            });
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/RequestInfo?$filter=(REQUEST_NO eq " + iReqNo + ")&$expand=TO_STATUS,TO_REQUEST_TYPE,TO_ENTITY_CODE";
            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                success: function (Data, response) {
                    // 
                    BusyIndicator.hide();
                    if (Data.value.length === 1) {
                        if (Data.value[0].STATUS > 5 && Data.value[0].STATUS <= 11) {
                            context.getView().getModel("payloadData").setProperty("/", Data.value[0]);
                            context.enableMdgPayloadBtn(true, false, false);
                        } else {
                            context.getView().getModel("payloadData").setProperty("/", {});
                            context.getView().getModel("payloadData").setProperty("/TextArea", "Status for Request No: " +
                                Data.value[0].REQUEST_NO + " - " + Data.value[0].VENDOR_NAME1 +
                                " is '" + Data.value[0].TO_STATUS.DESCRIPTION +
                                "'. \nPayload can be only generated after supplier submits the registration form.");

                            context.enableMdgPayloadBtn(false, false, false);
                            context.getView().getModel("payloadData").setProperty("/REQUEST_NO", Data.value[0].REQUEST_NO);
                        }
                    } else if (Data.value.length === 0) {
                        context.getView().getModel("payloadData").setProperty("/TextArea", "No data found for Request No: " + iReqNo);
                        context.enableMdgPayloadBtn(false, false, false);
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

        postAjax: function (url, type, data, sModelName, sOnSuccess) {
            // 
            jQuery.sap.delayedCall(100, this, function () {
                
            });
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
                    // 
                    BusyIndicator.hide();
                    var oModel = new JSONModel(data);
                    if (sModelName === "tbldata") {
                        data1 = data;
                        var oModel6 = new JSONModel(data1);
                        context.getView().setModel(oModel6, "tbldata");
                        context.getView().byId("idTotalItemsFormTable").setVisible(true);
                        context.getView().byId("idTotalItemsFormTable").setText("Items (" + data.value[0].DATA.length + ")");
                    }
                    if (sOnSuccess === null) {
                        context.getView().setModel(oModel, sModelName);
                    }
                    else if (sOnSuccess === "readClientData") {

                    }
                    else if (sOnSuccess === "dashBdModel") {

                        context.getView().setModel(oModel, sModelName);
                        context._getChartModel(data.value[0].ALL_MASTERS_ROW_COUNT, "Master", "bar", "chartModel_Master");
                        context._getChartModel(data.value[0].ALL_CONGIG_FIELD_PERCENT.CHART_ARRAY, null, "pie", "chartModel_Config");
                        //context._getProgressBarModel(data.value[0].ALL_CONGIG_FIELD_PERCENT, "progressBarModel");
                    }
                    else if (sOnSuccess === "mdgPayloadModel") {

                        context.getView().getModel("payloadData").setProperty("/TextArea", JSON.stringify(data.value[0].MDGPayload, null, "\t"));
                        context.enableMdgPayloadBtn(true, true, true);
                    }
                    else if (sOnSuccess === "readFormDetails") {

                        // context.data = Object.assign({}, data);
                        //var oOriginalData = Object.assign({}, data);

                        OriginalData = structuredClone(data);

                        origModel = new JSONModel(data.value[0].Results);

                        origModel.setDefaultBindingMode(BindingMode.OneWay);
                        context.getView().setModel(origModel, "origJson");
                        context.draftDataBinding(OriginalData);
                        context._getProgressBarModel(data.value[0].ProgressBar, "progressBarModel");
                    }
                    else if (sOnSuccess === "Download") {
                        if (data.value.length > 0) {
                            context.downloadAttachmentContent(data.value[0].FILE_TYPE, data.value[0].SR_NO, data.value[0].FILE_NAME, data.value[0].FILE_MIMETYPE, data.value[0].FILE_CONTENT);
                        } else {
                            MessageBox.error("Attachments are empty.");
                        }
                    }
                    else if (sOnSuccess === "Update") {

                        var oModel = new JSONModel(data.value[0]);
                        context.getView().setModel(oModel, "AttachmentContent");
                        var filecontent = atob(data.value[0].FILE_CONTENT);
                        var fileName = sap.ui.getCore().byId("idFileNameInp").getValue();
                        var date = new Date();
                        var attTypeCode;
                        var attTypeDesc;
                        var sEntityCode = sap.ui.getCore().byId("idEntityCodeInpt").getSelectedKey();
                        var attCode = Number(sap.ui.getCore().byId("idAttachTypeSlct").getSelectedKey());
                        var attDesc = sap.ui.getCore().byId("idAttachTypeSlct").getSelectedItem().getText();

                        var srNo = context.SR_NO;
                        if (attCode === 15) {
                            attTypeCode = sap.ui.getCore().byId("idAttachSubTypeSlct").getSelectedKey();
                            attTypeDesc = sap.ui.getCore().byId("idAttachSubTypeSlct").getSelectedItem().mProperties.text;
                        } else {
                            attTypeCode = "";
                            attTypeDesc = "";
                        }

                        if (attCode === 30) {
                            sEntityCode = "";
                        }
                        var oObj = context.getView().getModel("DynamicPrimaryKeyForAttach").getData();
                        var oPayload = {
                            "EDIT_TYPE": "EDIT_FORMS",
                            "VALUE": [{
                                "TABLE_NAME": "MASTER_IDEAL_ATTACHMENTS",
                                "TABLE_DESCRIPTION": "Ideal Attachments",
                                "CHANGE_FLAG": "YES",
                                "TABLE_DATA": [{
                                    "SR_NO": srNo,
                                    "ENTITY_CODE": sEntityCode,
                                    "ATTACH_CODE": attCode,
                                    "ATTACH_GROUP": "",
                                    "ATTACH_DESC": attDesc,
                                    "FILE_NAME": fileName,
                                    "FILE_TYPE": "ONB",
                                    "FILE_MIMETYPE": obj.FILE_MIMETYPE,
                                    "FILE_CONTENT": filecontent,
                                    "UPLOADED_ON": date,
                                    "ATTACH_TYPE_CODE": attTypeCode,
                                    "ATTACH_TYPE_DESC": attTypeDesc
                                }],
                                "PRIMARY_KEY_DETAILS": oObj
                            }],
                            "USER_DETAILS": {
                                "USER_ID": context._sUserID,
                                "USER_ROLE": sUserRole
                            }
                        }

                        oPayload = JSON.stringify({
                            "input": JSON.stringify(oPayload)
                        });
                        context.updateAjax(oPayload);
                    }
                    else if (sOnSuccess === "formdata") {
                        ;
                        context.getView().setModel(oModel, "formdata");

                        //hide code 5 and 7	
                        for (var i = 0; i < data.value.length; i++) {
                            if (data.value[i].CODE == 5) {
                                data.value.splice(i, 1)
                            }
                            if (data.value[i].CODE == 7) {
                                data.value.splice(i, 1)
                            }
                        }
                    }
                    else if (sOnSuccess === "onMasterSelection") {
                        
                        // oMasterArray = [];
                        // var sPrimary = context.PRIMARY_KEY;
                        // if (sPrimary.includes(",")) {
                        //     sPrimary = sPrimary.split(",");
                        //     oMasterArray = sPrimary;
                        // } else {
                        //     sPrimary = context.PRIMARY_KEY;
                        //     oMasterArray.push(sPrimary);
                        // }



                        context.getView().byId("idSaveBtn").setVisible(false);

                        if (Object.keys(data.value[0].sTableName).length > 0) {
                            tableStatus = "fullTable";
                            dataSource = [];
                            var len = Object.values(data.value[0].sTableName).length;
                            for (var i = 0; i < len; i++) {
                                dataSource.push(data.value[0].sTableName[i]);
                            }
                            context.TableCreate(data.value[0].sTableName);

                            context.getView().byId("idMasterTable").setVisible(true);
                            context.getView().byId("idTotalItemsTtl").setText("Items (" + len + ")");
                            context.getView().byId("idMasterTableOvrFTlbr").setVisible(true);

                            oModel1 = new JSONModel(data.value[0].sTableName);
                            context.getView().setModel(oModel1, "data");
                        }
                        else {
                            tableStatus = "emptyTable";
                            dataSource = [];
                            var len = Object.values(data.value[0].TableColumns).length;
                            for (var i = 0; i < len; i++) {
                                dataSource.push(data.value[0].TableColumns[i])
                            }
                            context.TableCreate(data.value[0].TableColumns);

                            context.getView().byId("idMasterTable").setVisible(true);
                            context.getView().byId("idTotalItemsTtl").setText("Items (0)");
                            context.getView().byId("idMasterTableOvrFTlbr").setVisible(true);
                            oModel1 = new JSONModel(data.value[0].TableColumns);
                            context.getView().setModel(oModel1, "data");
                        }
                    }
                    else if (sOnSuccess === "readEmailConfig") {
                        context.getView().getModel("blankJson").setProperty("/smtpConf", data.value[0] || []);
                        context.getView().byId("idPassword").setType("Password");
                    }else if (sModelName === "idealUser") {
                        // var userRoleModel = new JSONModel(data);
                        // sap.ui.getCore().byId("id_userRole").setModel(userRoleModel, "userRoleModel");
                        for(var i = 0;i<data.value.length; i++){
                            if(that._sUserID === data.value[i].USER_ID){
                                sUserRole = data.value[i].USER_ROLE;
                            }
                        }
                    }

                    if (type === "POST") {
                        MessageBox.success(data.value[0], {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                context.readOrgConfigData();
                                context.onCancel();
                            }
                        });
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

        updateAjax: function (oPayload) {
            // 
            jQuery.sap.delayedCall(100, this, function () {
                
            });
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EditAdminPanelData";
            $.ajax({
                url: url,
                type: 'POST',
                data: oPayload,
                contentType: 'application/json',
                success: function (data, response) {
                    // 
                    BusyIndicator.hide();
                    context.onAttachmentDialogClose();
                    MessageBox.success("" + data.value[0] + "", {
                        actions: [MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            context.onNdaAttachmentTypeRead();
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

        _getChartModel: function (oData, sTableType, sChartType, sModelName) {
            // 
            var arr = [];
            var obj = {};
            if (sChartType === "bar") {
                for (var i = 0; i < oData.length; i++) {
                    if (oData[i].TABLE_TYPE === sTableType) {
                        obj = {
                            "TITLE": oData[i].TABLE_NAME,
                            "VALUE": oData[i].TABLE_DESCRIPTION,
                            "COUNT": oData[i].COUNT,
                        };
                        arr.push(obj);
                    }
                }
            } else if (sChartType === "pie") {
                for (var i = 0; i < oData.length; i++) {
                    obj = {
                        "VALUE": oData[i].VALUE,
                        "COUNT": oData[i].COUNT
                    };
                    arr.push(obj);
                }
            }

            oChartModel = new JSONModel();
            oChartModel.setData(arr);
            context.getView().setModel(oChartModel, sModelName);
        },

        _getProgressBarModel: function (oData, sModelName) {
            // 
            oChartModel = new JSONModel();
            oChartModel.setData(oData);
            context.getView().setModel(oChartModel, sModelName);
        },

        //**********************************  MASTERS ICON TAB BAR  ********************************//

        onValueHelpRequest: function () {
            // 
            this.TableFragmentDialog();
        },

        TableFragmentDialog: function () {
            // 
            if (!this.empDialog2) {
                this.empDialog2 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.Table", this);
                this.getView().addDependent(this.empDialog2, this);
            }
            this.empDialog2.open();
            this.onMasterTableRead();
        },

        onMasterTableRead: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterTableNames?$filter=(TABLE_TYPE eq 'Master')";
            this.postAjax(url, "GET", null, "masterTable", null);
        },

        onValueHelpSearch: function (oEvent) {
            // 
            var aFilters = [];
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter({
                filters: [
                    new Filter("TABLE_NAME", sap.ui.model.FilterOperator.Contains, sValue),
                    new Filter("TABLE_CODE", sap.ui.model.FilterOperator.Contains, sValue),
                ], and: false,
            })
            var allFilters = new sap.ui.model.Filter(oFilter, false);
            aFilters.push(allFilters);
            oEvent.getSource().getBinding("items").filter(aFilters);
        },

        closeMasterTableDialog: function (oEvent) {
            // 
            oEvent.getSource().getBinding("items").filter([]);
        },

        handleCloseMasterTable: function (oEvent) {
            // 
            sTableName = oEvent.getParameter("selectedItems")[0].getProperty("title");
            var oMasterTbl = oEvent.getSource()._oSelectedItem.getBindingContext("masterTable").getObject();
            this.TABLE_CODE = oEvent.getSource()._oSelectedItem.getBindingContext("masterTable").getObject().TABLE_CODE;
            this.TABLE_NAME = oEvent.getSource()._oSelectedItem.getBindingContext("masterTable").getObject().TABLE_NAME;
            this.TABLE_DESCRIPTION = oEvent.getSource()._oSelectedItem.getBindingContext("masterTable").getObject().TABLE_DESCRIPTION;
            this.PRIMARY_KEY = oEvent.getSource()._oSelectedItem.getBindingContext("masterTable").getObject().PRIMARY_KEY;
            this.getView().byId("idMasterSrchFld").setPlaceholder("Search by " + this.PRIMARY_KEY);
            this.getView().byId("idMasterSrchFld").setValue(null);
            mastTabLen = oMasterTbl.COLUMN_COUNT;
            this.byId("idMasterTableInp").setValue(sTableName);

            oMasterArray = [];
            var sPrimary = this.PRIMARY_KEY;
            if (sPrimary.includes(",")) {
                sPrimary = sPrimary.split(",");
                oMasterArray = sPrimary;
            } else {
                sPrimary = this.PRIMARY_KEY;
                oMasterArray.push(sPrimary);
            }

            this.onChange("MASTER_TABLES", "Masters");
        },

        onChange: function (sAction, oEvnt) {
            // 
            var sPayload = JSON.stringify({

                "ACTION": "MASTER_TABLES",
                "TABLE_CODE": this.TABLE_CODE,
                "REQUEST_NO": null
            });
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/GetAdminPanelData(action='MASTER_TABLES',tableCode='" + this.TABLE_CODE + "',requestNo=null)";
            this.postAjax(url, "GET", null, "onMasterSelection", "onMasterSelection");
        },

        TableCreate: function (Array) {
            // 

            var context = this;
            if (tableStatus === "emptyTable") {
                this.getView().byId("idMasterTable").destroyColumns();
                this.getView().byId("idMasterTable").destroyItems();
                oTable = this.getView().byId("idMasterTable");
            } else {
                oModel = new JSONModel(Array);
                this.getView().byId("idMasterTable").destroyColumns();
                this.getView().byId("idMasterTable").destroyItems();
                oTable = this.getView().byId("idMasterTable");
                oTable.setModel(oModel);
            }

            if (tableStatus === "emptyTable") {
                var iHeaderLength = Object.keys(Array).length;
                var count = Number(iHeaderLength);
                var headerText = Object.values(Array);
                headerRowsText = Object.values(Array);
                headerText.push("ACTIONS");
            } else {
                var count = Object.keys(Array[0]).length;
                var headerText = Object.keys(Array[0]);
                headerRowsText = Object.keys(Array[0]);
                this.setTableHeaderJsonModel(headerRowsText);
                headerText.push("ACTIONS");
                var propertytext = Object.keys(Array[0]);
            }

            var celltext = [];
            for (var i = 0; i < count + 1; i++) {
                oColumn = new sap.m.Column({
                    // hAlign: "Begin",
                    header: new sap.m.Label({
                        text: headerText[i],
                        design: "Bold",
                        wrapping: true
                    })
                })
                var text = "{" + headerText[i] + "}"
                celltext.push(text);
                oTable.addColumn(oColumn);
            }

            if (tableStatus === "emptyTable") {
                context.aCells = headerText;
            } else {
                context.aCells = headerText;
                var cells = []
                for (var j = 0; j < celltext.length; j++) {
                    if (j == celltext.length - 1) {
                        var col = new sap.m.FlexBox({

                        })
                        var col1 = new sap.ui.core.Icon({
                            src: "sap-icon://edit",
                            color: "blue",
                            tooltip: "Update",
                            width: "50px",
                            press: function (oEvent) {
                                context.EditTableFragmentDialog(oEvent);
                            }
                        })
                        col.addItem(col1);
                        var col2 = new sap.ui.core.Icon({
                            src: "sap-icon://delete",
                            color: "red",
                            tooltip: "Delete",
                            press: function (oEvent) {
                                context.onDelete(oEvent);
                            }
                        })
                        col.addItem(col2);
                    } else {
                        var col = new sap.m.Text({
                            text: celltext[j]

                        })
                    }
                    cells.push(col)
                }
                var oTemplate = new sap.m.ColumnListItem({
                    cells: cells
                });
                oTable.bindItems("/", oTemplate);
            }
        },

        setTableHeaderJsonModel: function (jsonObject) {
            // 
            var tableHeaderJsonModel = new JSONModel(jsonObject);
            this.getView().setModel(tableHeaderJsonModel, "origHeaderRowJson");
        },

        onDelete: function (oEvent) {
            // 
            var masterEmptyValueArr = [];
            var oCode, oCode1 = "",
                oCode2 = "";
            var oID = oEvent.getSource().getParent().oParent.mAggregations.cells[0].sId;
            if (oID.includes("__input")) {
                oCode = oEvent.getSource().getParent().oParent.mAggregations.cells[0].getProperty("value");
            }

            var removedItem = oEvent.getSource().getParent().oParent;
            if (oID.includes("__input")) {

                context.byId("idMasterTable").removeItem(removedItem);
                MessageBox.success("Sucessfully Deleted");

                var getMasterTableItems = context.byId("idMasterTable").getItems();

                for (var i = 0; i < getMasterTableItems.length; i++) {
                    var getMasterTableCells = context.byId("idMasterTable").getItems()[i].getCells();
                    for (var j = 0; j < getMasterTableCells.length - 1; j++) {
                        var getColumnValue = context.byId("idMasterTable").getItems()[i].getCells()[j].getProperty("text");
                        if (getColumnValue === "") {
                            var getColumnLabel = context.byId("idMasterTable").getItems()[i].getCells()[j].mBindingInfos.text.parts[0].path;
                            var emptyValueObj = {
                                emptyLabel: getColumnLabel
                            }
                            masterEmptyValueArr.push(emptyValueObj);
                        }

                    }
                }
                context.byId("idMasterTable").getItems()[2].getCells()[1].getProperty("text")

                if (masterEmptyValueArr.length !== 0) {
                    context.byId("idSaveBtn").setVisible(false);
                }
                else if (masterEmptyValueArr.length === 0) {
                    context.byId("idSaveBtn").setVisible(true);
                }


                context.byId("idMasterOverToolFoot").setVisible(false);
                context.byId("idPage").setShowFooter(false);
            } else {

                if (this.byId("idMasterTableInp").getProperty("value") == "Region") {
                    oCode = oEvent.getParameters().listItem.getCells()[0].getProperty("text");
                    oCode1 = oEvent.getParameters().listItem.getCells()[1].getProperty("text");
                    oCode2 = oEvent.getParameters().listItem.getCells()[2].getProperty("text");
                } else if (this.byId("idMasterTableInp").getProperty("value") == "City") {
                    oCode = oEvent.getParameters().listItem.getCells()[0].getProperty("text");
                    oCode1 = oEvent.getParameters().listItem.getCells()[2].getProperty("text");
                    oCode2 = oEvent.getParameters().listItem.getCells()[4].getProperty("text");
                } else {
                    oCode = oEvent.getSource().getParent().oParent.mAggregations.cells[0].getProperty("text");
                }

                //added by Farzeen
                // var oObject = {};
                // var dynamicValueArray = [];
                // var sPrimaryKey = this.PRIMARY_KEY;
                // for (var i = 0; i < oEvent.getSource().getParent().oParent.mAggregations.cells.length - 1; i++) {
                //     var dynamicColumnName = oEvent.getSource().getParent().oParent.mAggregations.cells[i].mBindingInfos.text.parts[0].path;
                //     if (sPrimaryKey.includes(dynamicColumnName)) {
                //         var dynamicValue = oEvent.getSource().getParent().oParent.mAggregations.cells[i].getText();
                //         oObject[dynamicColumnName] = dynamicValue;
                //         dynamicValueArray.push(oEvent.getSource().getParent().oParent.mAggregations.cells[i].getText());
                //     }
                // }

                var oObject = this.dynamicPrimaryKey(oEvent);

                var oVal1 = this.byId("idMasterTableInp").getProperty("value");
                var sPayload = JSON.stringify({
                    "ACTION": "DELETE",
                    //"TABLE_NAME": this.TABLE_CODE,
                    "TABLE_NAME": this.TABLE_NAME,
                    "TABLE_DESCRIPTION": this.TABLE_DESCRIPTION,
                    //"ID": oCode,
                    "INPUT_DATA": [{
                        "DELETED_DETAILS": oObject
                    }],
                    "USER_DETAILS": {
                        "USER_ID": context._sUserID,
                        "USER_ROLE": sUserRole
                    }
                });
                sPayload = JSON.stringify({
                    "input": sPayload
                });
            }

            if (sPayload !== undefined) {
                var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/PostAdminPanelData";
                MessageBox.confirm("Are you sure you want to Delete?", {
                    title: "Confirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            jQuery.sap.delayedCall(100, this, function () {
                                ""
                            });
                            $.ajax({
                                url: url,
                                type: 'POST',
                                data: sPayload,
                                contentType: 'application/json',
                                success: function (data, response) {
                                    BusyIndicator.hide();
                                    var sAction = "MASTER_TABLES";
                                    context.onChange(sAction, "Masters");
                                    context.byId("idSaveBtn").setVisible(false);
                                    context.byId("idMasterOverToolFoot").setVisible(false);
                                    context.byId("idPage").setShowFooter(false);
                                    MessageBox.success(data.value[0]);
                                    context.onCancel();
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
                        } else if (sButton === MessageBox.Action.CANCEL) {

                        }
                    }
                });
            }
        },

        dynamicPrimaryKey: function (oEvent) {
            // 
            var oObject = {};
            var dynamicValueArray = [];
            var sPrimaryKey = this.PRIMARY_KEY;
            for (var i = 0; i < oEvent.getSource().getParent().oParent.mAggregations.cells.length - 1; i++) {
                var dynamicColumnName = oEvent.getSource().getParent().oParent.mAggregations.cells[i].mBindingInfos.text.parts[0].path;
                if (sPrimaryKey.includes(dynamicColumnName)) {
                    var dynamicValue = oEvent.getSource().getParent().oParent.mAggregations.cells[i].getText();
                    oObject[dynamicColumnName] = dynamicValue;
                    dynamicValueArray.push(oEvent.getSource().getParent().oParent.mAggregations.cells[i].getText());
                }
            }
            return oObject;
        },

        onResetMasterTab: function () {
            // 
            this.getView().byId("idMasterTable").setVisible(false);
            this.getView().byId("idMasterTableOvrFTlbr").setVisible(false);
            this.getView().byId("idMasterOverToolFoot").setVisible(false);
            this.getView().byId("idPage").setShowFooter(false);
            this.getView().byId("idSaveBtn").setVisible(false);
            this.getView().byId("idMasterTableInp").setValue("");
            this.getView().byId("idMasterSrchFld").setValue("");
        },

        onSearchMasterTable: function (oEvent) {
            // 
            var sValue = this.getView().byId("idMasterSrchFld").getValue();
            var oFilter = [];
            var aFilters = [];
            if (sValue === "") {
                this.onChange("MASTER_TABLES", "Masters");
            } else {
                for (var i = 0; i < oMasterArray.length; i++) {
                    var regex = /^[0-9]+$/
                    var regex2 = /^[a-zA-Z0-9]+$/
                    var regex3 = /^[a-zA-Z]+$/
                    if(regex.test(sValue)){
                        oFilter.push(new Filter(oMasterArray[i], sap.ui.model.FilterOperator.EQ, Number(sValue)));
                    } 
                    else if(regex2.test(sValue)){
                        oFilter.push(new Filter(oMasterArray[i], sap.ui.model.FilterOperator.Contains, sValue));
                    }
                    else if(regex3.test(sValue)){
                        oFilter.push(new Filter(oMasterArray[i], sap.ui.model.FilterOperator.Contains, sValue));
                    }
                    
                }
                var allFilters = new sap.ui.model.Filter(oFilter, false);
                aFilters.push(allFilters);
                oTable.getBinding("items").filter(aFilters);
                var tblLen = oTable.getItems().length;
                this.getView().byId("idTotalItemsTtl").setText("Items (" + tblLen + ")");
            }

            // var sTableCode = this.TABLE_CODE;
            // var aFilters = [];
            // var sValue = this.getView().byId("idMasterSrchFld").getValue();
            // if (sTableCode == "MasterTableNames" || sTableCode == "Status" || sTableCode == "RequestType" || sTableCode == "AttachmentTypes") {
            //     if (sValue === "") {
            //         this.onChange("MASTER_TABLES", "Masters");
            //     } else {
            //         var sValue = Number(this.getView().byId("idMasterSrchFld").getValue());
            //         var oTable = this.getView().byId("idMasterTable");
            //         var sKey = this.getView().byId("idMasterTable").getItems()[0].mAggregations.cells[0].mBindingInfos.text.binding.sPath;
            //         var oFilter = [new Filter(sKey, sap.ui.model.FilterOperator.EQ, sValue)];
            //         var allFilters = new sap.ui.model.Filter(oFilter, false);
            //         aFilters.push(allFilters);
            //         oTable.getBinding("items").filter(aFilters);
            //         var tblLen = oTable.getItems().length;
            //         this.getView().byId("idTotalItemsTtl").setText("Items (" + tblLen + ")");
            //     }
            // } else {
            //     if (sValue === "") {
            //         this.onChange("MASTER_TABLES", "Masters");
            //     } else {
            //         var oTable = this.getView().byId("idMasterTable");
            //         var sKey = this.getView().byId("idMasterTable").getItems()[0].mAggregations.cells[0].mBindingInfos.text.binding.sPath;
            //         var oFilter = [new Filter(sKey, sap.ui.model.FilterOperator.Contains, sValue)];
            //         var allFilters = new sap.ui.model.Filter(oFilter, false);
            //         aFilters.push(allFilters);
            //         oTable.getBinding("items").filter(aFilters);
            //         var tblLen = oTable.getItems().length;
            //         this.getView().byId("idTotalItemsTtl").setText("Items (" + tblLen + ")");
            //     }
            // }
        },

        onAdd: function (oEvent) {
            // 
            var context = this;
            var sMastName = this.getView().byId("idMasterTableInp").getValue();
            this.byId("idMasterOverToolFoot").setVisible(true);
            this.byId("idPage").setShowFooter(true);
            this.byId("idSaveBtn").setVisible(true);
            var date = new Date().toISOString();
            var oArr = [];
            var oTable = this.getView().byId("idMasterTable");
            var oTableCol = this.getView().byId("idMasterTable").getColumns();
            var cells = []
            for (var j = 0; j < oTableCol.length; j++) {
                if (j == oTableCol.length - 1) {
                    var row = new sap.m.FlexBox({

                    });
                    var col1 = new sap.ui.core.Icon({
                        src: "sap-icon://edit",
                        color: "blue",
                        tooltip: "Update",
                        width: "50px",
                        press: function (oEvent) {
                            context.EditTableFragmentDialog(oEvent);
                        }
                    });
                    row.addItem(col1);

                    var col2 = new sap.ui.core.Icon({
                        src: "sap-icon://delete",
                        color: "red",
                        tooltip: "Delete",
                        press: function (oEvent) {
                            context.onDelete(oEvent);
                        }
                    });
                    row.addItem(col2);
                }
                else {
                    if (sMastName === "MASTER_IVEN_USERS" && j === 7) {
                        var row = new sap.m.Input({
                            value: date,
                            change: function (OEvent) {
                                var oInput = OEvent.getSource();
                                var sValue = oInput.getValue().trim();
                                oInput.setValue(sValue);
                            }
                        });
                    }
                    else {
                        var row = new sap.m.Input({
                            value: "",
                            change: function (OEvent) {
                                var oInput = OEvent.getSource();
                                var sValue = oInput.getValue().trim();
                                oInput.setValue(sValue);
                            }
                        });
                    }
                }
                oArr.push(row);
            };
            var oTemplate1 = new sap.m.ColumnListItem({
                cells: oArr
            });
            var oTable = this.getView().byId("idMasterTable");
            oTable.insertItem(oTemplate1, 0);
        },

        EditTableFragmentDialog: function (oEvent) {
            // 
            if (!this.empDialog3) {
                this.empDialog3 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.editTable", this);
                this.getView().addDependent(this.empDialog3, this);
            }

            if (oEvent.getSource().getBindingContext()) {
                this.empDialog3.open();
                var oDialog = sap.ui.getCore().byId("idMasterEditDialog");
                oDialog.setTitle(this.TABLE_DESCRIPTION);
                var oPath = Number(oEvent.getSource().getBindingContext().getPath().split("/")[1]);
                var obj = this.getView().byId("idMasterTable").getModel().getData()[oPath];
                this.editDialogCreate(obj);

                var oObject2 = this.dynamicPrimaryKey(oEvent);
                var oModel = new JSONModel(oObject2);
                this.getView().setModel(oModel, "masterEditDynamicPrimaryKeyModel");
            } else {
                MessageBox.information("After saving, Edit can be done");
            }
        },

        editDialogCreate: function (obj) {
            // 
            context = this;
            var sMastName = this.getView().byId("idMasterTableInp").getValue();
            var date = new Date().toISOString();
            sap.ui.getCore().byId("idSimpleFormEditMaster").destroyContent();
            var oEditDialog = sap.ui.getCore().byId("idSimpleFormEditMaster");
            aHeaderText = Object.keys(obj);
            aPropertytext = Object.values(obj);
            for (var i = 0; i < aHeaderText.length; i++) {
                var label = new sap.m.Label({
                    text: aHeaderText[i],
                    design: "Bold",
                    required: true
                });
                oEditDialog.addContent(label);
                if (i === 0) {
                    var Input = new sap.m.Input({
                        value: aPropertytext[i],
                        editable: false
                    });
                }
                else {
                    if (sMastName === "MASTER_IVEN_USERS" && i === 8) {
                        var Input = new sap.m.Input({
                            value: date
                        });
                    } else {
                        var Input = new sap.m.Input({
                            value: aPropertytext[i]
                        });
                    }
                }
                oEditDialog.addContent(Input);
            }
        },

        onSaveMasterEdit: function (oEvent) {
            // 
            var sTitle = this.TABLE_CODE;
            var idStart = Number(sap.ui.getCore().byId("idSimpleFormEditMaster").getContent()[1].sId.substring(7));
            var idConstStart = Number(sap.ui.getCore().byId("idSimpleFormEditMaster").getContent()[1].sId.substring(7));
            var sCountLength = sap.ui.getCore().byId("idSimpleFormEditMaster").getContent().length;
            var iCount = Number(sCountLength / 2);
            var sCon = iCount + idStart;
            var aTableData = [];
            for (idStart; idStart < sCon; idStart++) {
                var sVal = sap.ui.getCore().byId("__input" + [idStart]).mProperties.value;
                var bValidate = this.masterEditValidate(sTitle, idStart, idConstStart);
                if (bValidate === false) {
                    break;
                } else {
                    aTableData.push(sVal);
                }
            }

            if (bValidate === false) {

            } else {

                var oObject = {}
                for (var i = 0; i < aHeaderText.length; i++) {
                    oObject[aHeaderText[i]] = aTableData[i]
                }

                var oObject2 = this.getView().getModel("masterEditDynamicPrimaryKeyModel").getData();

                var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EditAdminPanelData";
                var editPayload = JSON.stringify({
                    "EDIT_TYPE": "EDIT_MASTERS",
                    "VALUE": [{
                        //"TABLE_NAME": this.TABLE_CODE,
                        "TABLE_NAME": this.TABLE_NAME,
                        "CHANGE_FLAG": null,
                        "TABLE_DESCRIPTION": this.TABLE_DESCRIPTION,
                        "TABLE_DATA": [oObject],
                        "PRIMARY_KEY_DETAILS": oObject2
                    }],
                    "USER_DETAILS": {
                        "USER_ID": context._sUserID,
                        "USER_ROLE": sUserRole
                    }
                });
                editPayload = JSON.stringify({
                    "input": editPayload
                });


                context.onCloseMasterEdit();
                jQuery.sap.delayedCall(100, this, function () {
                    
                });
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: editPayload,
                    contentType: 'application/json',
                    success: function (data, response) {
                        BusyIndicator.hide();
                        // 
                        MessageBox.success(data.value[0], {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                context.onCancel();
                                context.onChange("MASTER_TABLES", "Masters");
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
            }
        },

        onCloseMasterEdit: function () {
            // 
            this.empDialog3.close();
            this.empDialog3.destroy();
            this.empDialog3 = null;
        },

        onUploadOption: function () {
            // 
            if (!this.onUpload) {
                this.onUpload = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.UploadOptionselection", this);
                this.getView().addDependent(this.onUpload);
            }
            this.onUpload.open();
        },

        handleUploadOptionFragClose: function () {
            // 
            this.onUpload.close();
        },

        handleUploadJson: function () {
            // 
            if (!this.dialog6) {
                this.dialog6 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.previewTable", this);
                this.getView().addDependent(this.dialog6);
            }
            this.dialog6.open();
            this.onUpload.close();
            csvBtn = "false"
            sap.ui.getCore().byId("csvPreviewTitleId").setText("JSON data");
            sap.ui.getCore().byId("previewTableId").setVisible(false);
            sap.ui.getCore().byId("jsonUploadTextArea").setVisible(true);
            sap.ui.getCore().byId("idJSONMsgStrip").setVisible(true);
            sap.ui.getCore().byId("idJSONMsgStrip1").setVisible(false);
            sap.ui.getCore().byId("idJSONFragValidate").setVisible(true);
            sap.ui.getCore().byId("idJSONFragClear").setVisible(true);
        },

        handleJsonClear: function () {
            // 
            sap.ui.getCore().byId("jsonUploadTextArea").setValue("")
        },

        onJsonValidate: function (oEvent) {
            // 
            var sDataString = sap.ui.getCore().byId("jsonUploadTextArea").getValue();
            if (sDataString === "" && csvBtn === "true") {
                var origData = this.getView().getModel("origHeaderRowJson").oData;
                var newData = this.getView().getModel("newHeaderRowJson").oData;
                var bFlag = JSON.stringify(origData) === JSON.stringify(newData);
                if (bFlag == true) {
                    sap.ui.getCore().byId("jsonUploadTextArea").setValue(JSON.stringify(JSON.parse(sDataString), null, "\t"));
                    sap.ui.getCore().byId("idJSONFragSave").setEnabled(true);
                }
                else {
                    sap.ui.getCore().byId("idJSONFragSave").setEnabled(false);
                    MessageToast.show("Upload valid File");
                }
            }
            else {
                var bDataCheck = this.isValidJsonString(sDataString);
                if (bDataCheck) {
                    sap.ui.getCore().byId("jsonUploadTextArea").setValue(JSON.stringify(JSON.parse(sDataString), null, "\t"));
                    sap.ui.getCore().byId("idJSONFragSave").setEnabled(true);
                }
                else {
                    sap.ui.getCore().byId("idJSONFragSave").setEnabled(false);
                }
            }
        },

        isValidJsonString: function (sDataString) {
            // 
            var value = null;
            var oArrObj = null;
            var sErrorMessage = "";
            try {
                if (sDataString === null || sDataString === "" || sDataString === undefined) {
                    throw "No data found.";
                }
                value = JSON.parse(sDataString);
                if (toString.call(value) === '[object Object]' && Object.keys(value).length > 0) {
                    return true;
                } else if (toString.call(value) === '[object Array]' && value.length > 0) {
                    var checkArray = false;
                    Object.keys(value).map(function (key) {
                        if (toString.call(value[key]) === '[object Object]' && Object.keys(value).length > 0) {
                            return true;
                        } else {
                            throw "Error";
                        }
                    });
                } else {
                    throw "Error";
                }
            } catch (errorMsg) {
                if (errorMsg === "No data found.") {
                    sErrorMessage = errorMsg;
                } else {
                    sErrorMessage = "Invalid JSON data."
                }
                MessageToast.show(sErrorMessage);
                return false;
            }
            MessageToast.show("Valid JSON data.");
            return true;
        },

        onPreviewSave: function (aData) {
            // 
            var oPayload;
            var jsonValidCheck;
            var jsonData;
            if (sap.ui.getCore().byId("jsonUploadTextArea").getVisible()) {
                jsonData = sap.ui.getCore().byId("jsonUploadTextArea").getValue();
                jsonValidCheck = context.isValidJsonString(jsonData);
            }
            if (sap.ui.getCore().byId("previewTableId").getVisible() || jsonValidCheck === true) {
                MessageBox.confirm("Are you sure you want to Save?", {
                    title: "Confirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            if (sap.ui.getCore().byId("previewTableId").getVisible()) {
                                oPayload = context.getCsvPayload(csvPreviewData);
                                context.postCsvData(oPayload, context.TABLE_CODE);
                            } else {
                                var oData = JSON.parse(jsonData);
                                oPayload = context.getCsvPayload(oData);
                                context.postCsvData(oPayload, context.TABLE_CODE);
                            }
                        };
                    }
                });
            } else {
                MessageBox.error("JSON is not valid, please check.")
            }
        },

        getCsvPayload: function (aData) {
            // 
            var Payload = {
                "ACTION": "IMPORT_CSV",
                //"TABLE_NAME": this.TABLE_CODE,
                "TABLE_NAME": this.TABLE_NAME,
                "TABLE_DESCRIPTION": this.TABLE_DESCRIPTION,
                "ID": null,
                "INPUT_DATA": aData,
                "USER_DETAILS": {
                    "USER_ID": context._sUserID,
                    "USER_ROLE": sUserRole
                }
            };
            Payload = JSON.stringify({
                "input": JSON.stringify(Payload)
            })
            return Payload;
        },

        postCsvData: function (oPayload, sAction) {
            // 
            jQuery.sap.delayedCall(100, this, function () {
                
            });
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/PostAdminPanelData"
            $.ajax({
                url: url,
                type: 'POST',
                data: oPayload,
                contentType: 'application/json',
                success: function (data, response) {
                    // 
                    context.onPreviewClose();
                    BusyIndicator.hide();
                    MessageBox.success(data.value[0], {
                        actions: [MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (oAction) {
                            context.onCancel();
                            context.onChange("MASTER_TABLES", "Masters");
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

                    context.onPreviewClose();
                    context.onCancel();
                    context.onChange("MASTER_TABLES", "Masters");
                }
            });
        },

        onPreviewClose: function () {
            // 
            this.dialog6.close();
            this.dialog6.destroy();
            this.dialog6 = null;
        },

        onDownload: function () {
            // 
            var aCols, oSettings, oSheet;
            aCols = this.createColumnConfig();
            var aColslen = Number(aCols.length - 1);
            var deleteCol = aCols.splice(aColslen, 1);

            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: "Level",
                    sheetName: "Master Table List"
                },
                fileName: this.TABLE_DESCRIPTION + ".xlsx",
                // dataSource: dataSource.sort((a, b) => a.SR_NO - b.SR_NO),
                dataSource: dataSource,
                worker: false
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build().then(function () {
                MessageToast.show("Spreadsheet Export Has Finished");
            }).finally(function () {
                oSheet.destroy();
            });
        },

        createColumnConfig: function (oEvent) {
            // 
            var oLabel = this.byId("idMasterTable").getColumns();
            var colsForSheet = [];
            for (var i = 0; i < oLabel.length; i++) {
                var obj = {
                    label: oLabel[i].getAggregation("header").getProperty("text"),
                    property: oLabel[i].getAggregation("header").getProperty("text"),
                    width: '8rem'
                }
                colsForSheet.push(obj);
            }
            return colsForSheet;
        },

        removeEmptyStringFromHeader: function (arr) {
            // 
            //['', 'CODE', 'DESCRIPTION']
            for (var i = 0; i < arr.length; i++) {
                if (arr[0] === "") {
                    arr.splice(i, 1);
                }
            }
            return arr
        },

        onTemplateUpload: function (e) {
            // 
            this.onUpload.close();
            var fU = this.getView().byId("idFileUploaderBtn");
            csvBtn = "true";
            var file = (e.getParameter("files") && e.getParameter("files")[0]);
            var reader = new FileReader();
            var jsonObj = "";
            reader.onload = function (oEvent) {
                var strCSV = oEvent.target.result;

                var arrCSV = context.parseCsvData(strCSV, ";")

                //Added by Sumit Singh on 15-06-2023
                var sOrigHeader = headerRowsText.toString();
                var sCsvHeader = context.removeEmptyStringFromHeader(arrCSV[0]).toString();

                if (sOrigHeader === sCsvHeader) {
                    var arrCSVModified = context.CreateCSVModel(arrCSV);

                    //Open fragment with csv data      
                    context.openPreviewFragment(arrCSVModified);
                    return jsonObj;
                } else {
                    MessageBox.error("Please upload valid CSV File");
                }
            };
            reader.readAsText(file);
        },

        parseCsvData: function (csvData, delimiter) {
            // 
            var rows = csvData.split("\n");
            var parsedData = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i].trim();
                if (row.length > 0) {
                    parsedData.push(row.split(delimiter));
                }
            }
            return parsedData;
        },

        openPreviewFragment: function (jsonObj) {
            // 
            context.openPfrag();
            context.PreviewTableCreate(jsonObj);
        },

        PreviewTableCreate: function (Array) {
            // 
            var context = this;
            sap.ui.getCore().byId("idJSONMsgStrip").setVisible(false);
            // sap.ui.getCore().byId("idJSONMsgStrip1").setVisible(false);
            sap.ui.getCore().byId("idJSONFragValidate").setVisible(false);
            sap.ui.getCore().byId("idJSONFragClear").setVisible(false);
            sap.ui.getCore().byId("idJSONFragSave").setEnabled(true);
            sap.ui.getCore().byId("csvPreviewTitleId").setText("CSV Preview " + "(" + Array.length + " Items)");
            oModel = new JSONModel(Array);
            sap.ui.getCore().byId("previewTableId").destroyColumns();
            oTable = sap.ui.getCore().byId("previewTableId");
            oTable.setModel(oModel);
            var count = Object.keys(Array[0]).length;
            var headerText = Object.keys(Array[0]);
            var previewTableHeaderJsonModel = new JSONModel(headerText);
            this.getView().setModel(previewTableHeaderJsonModel, "newHeaderRowJson");
            var propertytext = Object.keys(Array[0]);
            var celltext = []
            for (var i = 0; i < count; i++) {
                oColumn = new sap.m.Column({
                    hAlign: "Center",
                    header: new sap.m.Text({
                        text: headerText[i]

                    })
                })
                var text = "{" + headerText[i] + "}"
                celltext.push(text)
                oTable.addColumn(oColumn);
            }
            context.aCells = headerText;
            var cells = []
            for (var j = 0; j < celltext.length; j++) {
                var col = new sap.m.Text({
                    text: celltext[j]
                })
                cells.push(col)
            }

            var oTemplate = new sap.m.ColumnListItem({
                cells: cells
            });
            oTable.bindItems("/", oTemplate);
            csvPreviewData = Array;
        },

        openPfrag: function () {
            // 
            if (!this.dialog6) {
                this.dialog6 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.previewTable", this);
                this.getView().addDependent(this.dialog6);
            }
            this.dialog6.open();
        },

        CreateCSVModel: function (arrCSV) {
            // 
            if (arrCSV[0].length !== arrCSV[1].length) {
                for (i = 1; i < arrCSV.length; i++) {
                    var firstvalue = arrCSV[i][0];
                    var arrayIndex = arrCSV[i].indexOf(firstvalue);
                    arrCSV[i].splice(arrayIndex, 1);
                    //arrCSV[i].splice(arrCSV[i][0], 1);
                }
            }
            var aModifiedArray = [];
            var arrValue = "";
            var aHeaderArr = "";
            var oObject = {};
            var aRowArr = null;
            for (var i = 0; i < arrCSV.length; i++) {
                if (i === 0) {
                    aHeaderArr = arrCSV[i]; //["", "CODE", "DESCRIPTION"]
                } else {
                    aRowArr = arrCSV[i];
                    for (let j in aHeaderArr) {
                        arrValue = aHeaderArr[j];
                        if (arrValue !== "") {
                            if (aRowArr[j].split('"').length > 1) { //['','trert,tyu,erter,ertrt,ertt',''];
                                oObject[arrValue] = aRowArr[j].split('"')[1];
                            } else {
                                oObject[arrValue] = aRowArr[j];
                            }
                        }
                    }
                    aModifiedArray.push(Object.assign({}, oObject));
                }
            }
            return aModifiedArray;
        },

        //**********************************  ATTACHMENTS ICON TAB BAR  ********************************//

        onAddAttachment: function (oEvent) {
            // 
            this.addAttachmentTableDialog(oEvent);
        },

        addAttachmentTableDialog: function (oEvent) {
            // 
            if (!this.dialog8) {
                this.dialog8 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.addAttachmentTable", this);
                this.getView().addDependent(this.dialog8, this);
            }
            this.dialog8.open();
            sap.ui.getCore().byId("idEntityCodeLbl").setRequired(true);
                sap.ui.getCore().byId("idEntitycd").setEditable(false);
        },

        onCloseAttachmntTbl: function () {
            // 
            this.dialog8.close();
            this.dialog8.destroy();
            this.dialog8 = null;
        },

        readCompanyCodeset: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterEntityCode";
            this.postAjax(url, "GET", null, "companycodes", null);
        },

        onAttchUpload: function (oEvent) {
            // 
            var sbIndex = "",
                content = "",
                fileName = "",
                mimeType = "";
            var sbfileDetails = oEvent.getParameters("file").files;
            this.sourceData = oEvent.getSource();

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
        },
       
        sbBase64conversionMethod: function (fileMime, fileName, fileDetails) {
            // 
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
                // 
                var binaryString = readerEvt.target.result;
                context.sbbase64ConversionRes = btoa(binaryString);
                var blobData = context.b64toBlob(context.sbbase64ConversionRes, fileName, "", fileMime); ////with mimetype
                context.sbfileUploadArr = [];

                context.sbfileUploadArr.push({
                    "MimeType": null,
                    "FileName": fileName.split(".")[fileName.split(".").length - 1],
                    "Content": null
                });

                var sEditFname = sap.ui.getCore().byId("idFileNameInp");
                if (sEditFname !== undefined) {
                    sEditFname.setValue(fileName); //FileName
                }

                var sAddFname = sap.ui.getCore().byId("idFilenm");
                if (sAddFname !== undefined) {
                    sAddFname.setValue(fileName); //FileName
                }

            };
            reader.readAsBinaryString(fileDetails);
        },

        b64toBlob: function (b64Data, contentType, sliceSize, filemime) {
            // 
            btoAconvert = b64Data;
            mimeType = filemime;
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
            var blob = new File(byteArrays, {
                type: contentType

            });
            var blob = new File(byteArrays, contentType, { //with mimetype
                type: filemime

            });
            return blob;
        },

        onSelectNdaAttach1: function () {
            // 
            var ndaAttachType = sap.ui.getCore().byId("idATTypeLbl").getSelectedItem();
            if (ndaAttachType.mProperties.key === "15") {
                sap.ui.getCore().byId("idEntityCodeLbl").setRequired(true);
                sap.ui.getCore().byId("idEntitycd").setEditable(true);
                sap.ui.getCore().byId("idAttSubTypeLbl").setVisible(true);
                sap.ui.getCore().byId("idAttSubtypeLbl").setVisible(true);
            } else if (ndaAttachType.mProperties.key === "30") {
                sap.ui.getCore().byId("idEntityCodeLbl").setRequired(false);
                sap.ui.getCore().byId("idEntitycd").setEditable(false);
                sap.ui.getCore().byId("idAttSubTypeLbl").setVisible(false);
                sap.ui.getCore().byId("idAttSubtypeLbl").setVisible(false);
            } else {
                sap.ui.getCore().byId("idEntityCodeLbl").setRequired(true);
                sap.ui.getCore().byId("idEntitycd").setEditable(false);
                sap.ui.getCore().byId("idAttSubTypeLbl").setVisible(false);
                sap.ui.getCore().byId("idAttSubtypeLbl").setVisible(false);
            }
        },

        validAddAttachment: function () {
            // 
            var attTypedesc;
            var attTypeCode;
            var attCode = Number(sap.ui.getCore().byId("idATTypeLbl").getSelectedKey());
            var attDesc = sap.ui.getCore().byId("idATTypeLbl")._getSelectedItemText();
            if (attCode === 15) {
                attTypedesc = sap.ui.getCore().byId("idAttSubTypeLbl")._getSelectedItemText();
                attTypeCode = sap.ui.getCore().byId("idAttSubTypeLbl").getSelectedKey();
            } else {
                attTypedesc = "";
                attTypeCode = "";
            }

            var sAttCode = sap.ui.getCore().byId("idATTypeLbl").getSelectedKey();
            var sEntityCode = sap.ui.getCore().byId("idEntitycd").getSelectedKey();
            var sFilename = sap.ui.getCore().byId("idFilenm").getValue();
            if (sAttCode === "30") {
                if (sFilename === "") {
                    MessageBox.error("Please fill Mandatory fields.");
                    return false;
                } else {
                    return true;
                }
            }
            else {
                if (sFilename === "") {
                    MessageBox.error("Please fill Mandatory fields.");
                    return false;
                } else {
                    return true;
                }
            }
        },

        onAddAttachmentTbl: function () {
            // 
            var bEvt = this.validAddAttachment();
            if (bEvt === true) {

                var date = new Date().toISOString();
                var attTypedesc;
                var attTypeCode;
                var attCode = Number(sap.ui.getCore().byId("idATTypeLbl").getSelectedKey());
                var attDesc = sap.ui.getCore().byId("idATTypeLbl")._getSelectedItemText();
                if (attCode === 15) {
                    attTypedesc = sap.ui.getCore().byId("idAttSubTypeLbl")._getSelectedItemText();
                    attTypeCode = sap.ui.getCore().byId("idAttSubTypeLbl").getSelectedKey();
                } else {
                    attTypedesc = "";
                    attTypeCode = "";
                }

                var selectedKey = Number(sap.ui.getCore().byId("idATTypeLbl").getSelectedKey());
                var modelArray = this.getView().getModel("ndaAttachment").getData().value;
                if (attCode !== 15) {
                    for (var i = 0; i < modelArray.length; i++) {
                        if (modelArray[i].ATTACH_CODE === selectedKey) {
                            MessageBox.warning("Same Attach Types are not allowed");
                            return;
                        }
                    }
                } else if (attCode === 15) {
                    var subTypeSelectedKey = sap.ui.getCore().byId("idAttSubTypeLbl").getSelectedKey();
                    var sEntity_Code = sap.ui.getCore().byId("idEntitycd").getSelectedKey();
                    for (var i = 0; i < modelArray.length; i++) {
                        if (subTypeSelectedKey === modelArray[i].ATTACH_TYPE_CODE && sEntity_Code === modelArray[i].ENTITY_CODE) {
                            MessageBox.warning("Same Attach Types or SubType or Entity Code are not allowed");
                            return;
                        }
                    }
                }

                for(var i=0; i<this.getView().getModel("ndaAttachment").getData().value.length; i++){
                    var srNo = this.getView().getModel("ndaAttachment").getData().value[i].SR_NO+1
                }

                var oPayload = {
                    "ACTION": "CREATE",
                    "TABLE_NAME": "MASTER_IDEAL_ATTACHMENTS",
                    "TABLE_DESCRIPTION": "Ideal Attachments",
                    "ID": null,
                    "INPUT_DATA": [{
                        "SR_NO": 1,
                        "ENTITY_CODE": sap.ui.getCore().byId("idEntitycd").getSelectedKey(),
                        "ATTACH_CODE": attCode,
                        "ATTACH_GROUP": "",
                        "ATTACH_DESC": attDesc,
                        "FILE_NAME": sap.ui.getCore().byId("idFilenm").getValue(),
                        "FILE_TYPE": "",
                        "FILE_MIMETYPE": mimeType,
                        "FILE_CONTENT": btoAconvert,
                        "UPLOADED_ON": date,
                        "ATTACH_TYPE_CODE": attTypeCode,
                        "ATTACH_TYPE_DESC": attTypedesc
                    }],
                    "USER_DETAILS": {
                        "USER_ID": context._sUserID,
                        "USER_ROLE": sUserRole
                    }
                };

                oPayload = JSON.stringify({
                    "input": JSON.stringify(oPayload)
                });

                MessageBox.confirm("Are you sure you want to Save?", {
                    title: "Confirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/PostAdminPanelData";
                        if (sButton === MessageBox.Action.OK) {
                            context.onCloseAttachmntTbl();
                            jQuery.sap.delayedCall(100, this, function () {
                                
                            });
                            $.ajax({
                                url: url,
                                type: 'POST',
                                data: oPayload,
                                contentType: 'application/json',
                                success: function (data, response) {
                                    // 
                                    BusyIndicator.hide();
                                    MessageBox.success(data.value[0], {
                                        actions: [MessageBox.Action.OK],
                                        emphasizedAction: MessageBox.Action.OK,
                                        onClose: function (sAction) {

                                            context.onMasteriDealAttachmentsRead();
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
                        };
                    }
                });
            }
        },

        validEditAttachment: function () {
            // 
            var sEntityCode = sap.ui.getCore().byId("idEntityCodeInpt").getSelectedKey();
            var attCode = Number(sap.ui.getCore().byId("idAttachTypeSlct").getSelectedKey());
            if (attCode === 30) {
                return true;
            } else {
                if (sEntityCode === "") {
                    MessageBox.error("Please fill Mandatory fields.");
                    return false;
                } else {
                    return true;
                }
            }
        },

        onAttachmentDialogSave: function (oEvent) {
            // 
            var bEvt = this.validEditAttachment();
            // var attachContent = context.getView().getModel("AttachmentContent").getData();
            if (bEvt === true) {
                var filecontent;
                var attTypeCode;
                var attTypeDesc;
                var sEntityCode = sap.ui.getCore().byId("idEntityCodeInpt").getSelectedKey();
                var attCode = Number(sap.ui.getCore().byId("idAttachTypeSlct").getSelectedKey());
                var attDesc = sap.ui.getCore().byId("idAttachTypeSlct").getSelectedItem().getText();

                var srNo = this.SR_NO;
                if (attCode === 15) {
                    attTypeCode = sap.ui.getCore().byId("idAttachSubTypeSlct").getSelectedKey();
                    attTypeDesc = sap.ui.getCore().byId("idAttachSubTypeSlct").getSelectedItem().mProperties.text;
                } else {
                    attTypeCode = "";
                    attTypeDesc = "";
                }

                if (attCode === 30) {
                    sEntityCode = "";
                }

                if (btoAconvert == "" || btoAconvert == null || btoAconvert == undefined) {
                    this.onNdaAttachmentRead(srNo, "Update");
                } else {
                    filecontent = btoAconvert
                    this.onSubmitEditAttachmentSave(srNo, sEntityCode, attCode, attDesc, filecontent, attTypeCode, attTypeDesc);
                }
            }
        },

        onSubmitEditAttachmentSave: function (srNo, sEntityCode, attCode, attDesc, filecontent, attTypeCode, attTypeDesc) {
            // 
            var fileName = sap.ui.getCore().byId("idFileNameInp").getValue();
            var date = new Date();
            var oObj = this.getView().getModel("DynamicPrimaryKeyForAttach").getData();
            var oPayload = {
                "EDIT_TYPE": "EDIT_FORMS",
                "VALUE": [{
                    "TABLE_NAME": "MASTER_IDEAL_ATTACHMENTS",
                    "TABLE_DESCRIPTION": "Ideal Attachments",
                    "CHANGE_FLAG": "YES",
                    "TABLE_DATA": [{
                        "SR_NO": srNo,
                        "ENTITY_CODE": sEntityCode,
                        "ATTACH_CODE": attCode,
                        "ATTACH_GROUP": "",
                        "ATTACH_DESC": attDesc,
                        "FILE_NAME": fileName,
                        "FILE_TYPE": "ONB",
                        "FILE_MIMETYPE": obj.FILE_MIMETYPE,
                        "FILE_CONTENT": filecontent,
                        "UPLOADED_ON": date,
                        "ATTACH_TYPE_CODE": attTypeCode,
                        "ATTACH_TYPE_DESC": attTypeDesc
                    }],
                    "PRIMARY_KEY_DETAILS": oObj
                }],
                "USER_DETAILS": {
                    "USER_ID": context._sUserID,
                    "USER_ROLE": sUserRole
                }
            }

            oPayload = JSON.stringify({
                "input": JSON.stringify(oPayload)
            })

            jQuery.sap.delayedCall(100, this, function () {
                
            });

            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EditAdminPanelData";
            $.ajax({
                url: url,
                type: 'POST',
                data: oPayload,
                contentType: 'application/json',
                success: function (data, response) {
                    // 
                    BusyIndicator.hide();
                    context.onAttachmentDialogClose();
                    MessageBox.success("" + data.value[0] + "", {
                        actions: [MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            context.onMasteriDealAttachmentsRead();
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

        onNdaAttachmentTypeRead: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterAttachmentTypes?$filter=(CODE eq 15) or (CODE eq 26) or (CODE eq 30)";
            this.postAjax(url, "GET", null, "ndaAttachmentType", null);
        },

        onMasteriDealAttachmentsRead: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterIdealAttachments";
            this.postAjax(url, "GET", null, "ndaAttachment", null);
        },

        onFilterAttach: function () {
            // 
            var sValue = this.getView().byId("idAttachmntSrchFld").getValue();
            var oTable = this.getView().byId("idAttachmntTable");
            var oFilter1 = new sap.ui.model.Filter("FILE_NAME", sap.ui.model.FilterOperator.Contains, sValue);

            var oCombinedFilter = new sap.ui.model.Filter([oFilter1]);

            oTable.getBinding("items").filter(oCombinedFilter, sap.ui.model.FilterType.Application);
            var tblLen = oTable.getItems().length;
            this.getView().byId("idTotalItemsAttachmnt").setText("Items (" + tblLen + ")");
        },

        onSearchForm: function (oEvent) {
            // 
            // if(oEvent === "filter"){
            // 	 var search =""
            // }
            // else{
            var search = oEvent.getSource().getValue();
            // }
            var oTable = this.getView().byId("idFormTable");
            var oFilter = new Filter({
                filters: [
                    new Filter("FIELDS", sap.ui.model.FilterOperator.Contains, search),
                    new Filter("DESCRIPTION", sap.ui.model.FilterOperator.Contains, search),
                    new Filter("SECTION", sap.ui.model.FilterOperator.Contains, search),
                ]
            });
            var oBinding = this.byId("idFormTable").getBinding("items");
            oBinding.filter(oFilter);

            // oBinding.getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);
            // var tblLen = oTable.getItems().length;
            var tblLen = oBinding.aIndices.length;
            this.getView().byId("idTotalItemsFormTable").setText("Items (" + tblLen + ")");
        },


        onResetAttachmentTable: function () {
            // 
            this.onMasteriDealAttachmentsRead();
            // this.onChange("MASTER_FORMS", "Attachments");
            this.getView().byId("idAttachmntSrchFld").setValue("");
        },

        onDownloadAttachDialog: function (oEvent) {
            // 
            var sbIndex = "",
                content = "",
                fileName = "",
                mimeType = "";
            obj = oEvent.getSource().getParent().getBindingContext("ndaAttachment").getObject();
            var srNo = obj.SR_NO;
            this.onNdaAttachmentRead(srNo, "Download");
        },

        onNdaAttachmentRead: function (iSrNo, sChangeType) {
            // 
            context = this;
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterIdealAttachments?$filter=SR_NO eq " + iSrNo;
            this.postAjax(url, "GET", null, sChangeType, sChangeType);
        },

        downloadAttachmentContent: function (iFILE_TYPE, iSR_NO, sFILE_NAME, sFILE_MIMETYPE, sFILE_CONTENT) {
            // 
            var aFilter = [],
                fileContent = null;
            // sFILE_CONTENT = atob(sFILE_CONTENT);
            // context.downloadAttachment(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);
            context.downloadANi(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);
        },

        downloadANi:function(content, fileName, mimeType){
            // ;
            var fName = fileName;
                var fType = mimeType;
                var fContent = content;
                var magic;
                var base64 = "data:" + fType + ";base64,";
                if (fType === "text/plain") {
                    magic = atob(atob(fContent))
                    var fileNameExtSplit = fName.split(".")
                    sap.ui.core.util.File.save(magic, fileNameExtSplit[0], fileNameExtSplit[1], fType);
                }
                else{
                    var magic1 = btoa(fContent)
                    magic = atob(atob(magic1))
                    var byteNumbers = new Array(magic.length);
                    for (let index = 0; index < magic.length; index++) {
                        byteNumbers[index] = magic.charCodeAt(index)
                    }
                    var byteArray = new Uint8Array(byteNumbers)
                    var blob = new Blob([byteArray], {
                        type: fType
                    });
                    var sBlobURL = URL.createObjectURL(blob)
                    const oLink = document.createElement('a')
                    oLink.href = sBlobURL;
                    oLink.download = fName;
                    oLink.target = '_blank';
                    document.body.appendChild(oLink);
                    oLink.click();
                    document.body.removeChild(oLink);
                }
            
            
        },

        downloadAttachment: function (content, fileName, mimeType) {
            // 
            // downloadLib.download("data:application/octet-stream;base64," + content, fileName, mimeType);
            // var HttpRequest = new XMLHttpRequest();
            // x.open("GET", "http://danml.com/wave2.gif", true);
            // HttpRequest.responseType = 'blob';
            // HttpRequest.onload = function (e) {
            //     downloadLib.download(HttpRequest.response, fileName, mimeType);
            // }
            // HttpRequest.send();

            var content2 = atob(content);
        download("data:application/octet-stream;base64," + content2, fileName, mimeType);
        var HttpRequest = new XMLHttpRequest();
        x.open("GET", "http://danml.com/wave2.gif", true);
        HttpRequest.responseType = 'blob';
        HttpRequest.onload = function (e) {
            download(HttpRequest.response, fileName, mimeType);
        }
        HttpRequest.send();
        },


        openAttachmentDialog: function (oEvent) {
            // 
            this.editAttachmentTableDialog(oEvent);
            
            obj = oEvent.getSource().getParent().getBindingContext("ndaAttachment").getObject();
            this.SR_NO = obj.SR_NO;
            this.ATTACH_CODE = obj.ATTACH_CODE;
            if (this.ATTACH_CODE === 30) {
                sap.ui.getCore().byId("idEntityCodeLblEdit").setRequired(false);
                sap.ui.getCore().byId("idEntityCodeInpt").setEditable(false);
            } else {
                sap.ui.getCore().byId("idEntityCodeInpt").setSelectedKey(obj.ENTITY_CODE);
            }
            sap.ui.getCore().byId("idAttachTypeSlct").setSelectedKey(this.ATTACH_CODE);
            sap.ui.getCore().byId("idFileNameInp").setValue(obj.FILE_NAME);
            sap.ui.getCore().byId("idAttachSubTypeSlct").setSelectedKey(obj.ATTACH_TYPE_CODE);

            var oObject = {};
            var obj2 = oEvent.getSource().getParent().getBindingContext("ndaAttachment").getObject();

            var ArrayOfObj = Object.keys(obj2);
            var ArrayOfObjValue = Object.values(obj2);

            var sPrimaryKey = this.PRIMARY_KEY_FOR_ATTACH;
            sPrimaryKey = sPrimaryKey.split(",");

            for(var i=0; i<sPrimaryKey.length; i++){
                var prime = sPrimaryKey[i];
                for(var j=0; j<ArrayOfObj.length; j++){
                    if(sPrimaryKey[i] === ArrayOfObj[j]){
                        var dynamicColumnName = ArrayOfObj[j];
                        var dynamicValue = ArrayOfObjValue[j];
                        oObject[dynamicColumnName] = dynamicValue
                    }
                }
            }
            var oModel = new JSONModel(oObject);
            this.getView().setModel(oModel, "DynamicPrimaryKeyForAttach");

            context.onSelectNdaAttach();
        },

        onSelectNdaAttach: function () {
            // 
            var ndaAttachType = sap.ui.getCore().byId("idAttachTypeSlct").getSelectedItem();
            if (ndaAttachType.mProperties.key === "15") {
                sap.ui.getCore().byId("idEntityCodeLblEdit").setRequired(true);
                sap.ui.getCore().byId("idEntityCodeInpt").setEditable(true);
                sap.ui.getCore().byId("idAttachSubTypeSlct").setVisible(true);
                sap.ui.getCore().byId("idAttachSubTypeLbl").setVisible(true);
            } else if (ndaAttachType.mProperties.key === "30") {
                sap.ui.getCore().byId("idEntityCodeLblEdit").setRequired(false);
                sap.ui.getCore().byId("idEntityCodeInpt").setValue("");
                sap.ui.getCore().byId("idEntityCodeInpt").setEditable(false);
                sap.ui.getCore().byId("idAttachSubTypeSlct").setVisible(false);
                sap.ui.getCore().byId("idAttachSubTypeLbl").setVisible(false);
            } else {
                sap.ui.getCore().byId("idEntityCodeLblEdit").setRequired(true);
                sap.ui.getCore().byId("idEntityCodeInpt").setEditable(false);
                sap.ui.getCore().byId("idAttachSubTypeSlct").setVisible(false);
                sap.ui.getCore().byId("idAttachSubTypeLbl").setVisible(false);
            }
        },

        editAttachmentTableDialog: function (oEvent) {
            // 
            if (!this.dialog7) {
                this.dialog7 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.editAttachmentTable", this);
                this.getView().addDependent(this.dialog7);
            }
            this.dialog7.open();
        },

        onAttachmentDialogClose: function () {
            // 
            this.dialog7.close();
            this.dialog7.destroy();
            this.dialog7 = null;
        },

        onDeletetbld: function (oEvent) {
            // 
            var oObject = {};
            var dynamicValueArray = [];
            // this.draftDataBinding();
            var sPrimaryKey = this.PRIMARY_KEY_FOR_ATTACH;
            sPrimaryKey = sPrimaryKey.split(",");

            
            // for (var i = 0; i < oEvent.getSource().getParent().oParent.mAggregations.cells.length - 1; i++) {
            //     var dynamicColumnName = oEvent.getSource().getParent().oParent.mAggregations.cells[i].mBindingInfos.text.parts[0].path;
            //     if (sPrimaryKey.includes(dynamicColumnName)) {
            //         var dynamicValue = oEvent.getSource().getParent().oParent.mAggregations.cells[i].getText();
            //         oObject[dynamicColumnName] = dynamicValue;
            //         dynamicValueArray.push(oEvent.getSource().getParent().oParent.mAggregations.cells[i].getText());
            //     }
            // }
            var iSelected = oEvent.getSource().getParent().getBindingContext("ndaAttachment").getObject().SR_NO;

            var obj = oEvent.getSource().getParent().getBindingContext("ndaAttachment").getObject();

            var ArrayOfObj = Object.keys(obj);
            var ArrayOfObjValue = Object.values(obj);

            for(var i=0; i<sPrimaryKey.length; i++){
                var prime = sPrimaryKey[i];
                for(var j=0; j<ArrayOfObj.length; j++){
                    if(sPrimaryKey[i] === ArrayOfObj[j]){
                        var dynamicColumnName = ArrayOfObj[j];
                        var dynamicValue = ArrayOfObjValue[j];
                        oObject[dynamicColumnName] = dynamicValue
                    }
                }
            }
            var oPayload = JSON.stringify({
                "ACTION": "DELETE",
                "TABLE_NAME": "MASTER_IDEAL_ATTACHMENTS",
                "TABLE_DESCRIPTION": "Ideal Attachments",
                "ID": iSelected,
                "INPUT_DATA": [{
                    "DELETED_DETAILS": oObject
                }],
                "USER_DETAILS": {
                    "USER_ID": context._sUserID,
                    "USER_ROLE": sUserRole
                }
            });
            oPayload = JSON.stringify({
                "input": oPayload
            });

            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/PostAdminPanelData";

            MessageBox.confirm("Are you sure you want to Delete?", {
                title: "Confirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {

                    if (sButton === MessageBox.Action.OK) {
                        jQuery.sap.delayedCall(100, this, function () {
                            
                        });
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: oPayload,
                            contentType: 'application/json',
                            success: function (data, response) {
                                // 
                                BusyIndicator.hide();
                                MessageBox.success("" + data.value[0] + "", {
                                    actions: [MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (sAction) {
                                        context.onMasteriDealAttachmentsRead();
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
                    };
                }
            });
        },

        //**********************************  ORGANIZATION CONFIG  ********************************//

        handleTestMail: function () {
            // 
            //var sSenderId = this.getView().byId("idSenderIdInp").getValue();
            var sSenderId = this.getView().byId("idSenderID").getValue();
            if (sSenderId === "") {
                MessageBox.information("Please enter Sender ID.");
            } else if (!sSenderId.match(/^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+\.)+[a-z]{2,5}$/)) {
                MessageBox.information("Please enter valid Sen\
                if (!this.dialogemailform) {
                    this.dialogemailform = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.testEmail", this);
                    this.getView().addDependent(this.dialogemailform);
                }
                this.dialogemailform.open();

                sap.ui.getCore().byId("idFormInp").setValue(sSenderId);
                
                var oMultiInput2 = sap.ui.getCore().byId("idCcEmailFrag");

                var fnValidator = function(args){
                    var text = args.text;        
                    return new Token({key: text, text: text});
                };
                    oMultiInput2.addValidator(fnValidator);

                sap.ui.getCore().byId("idToInp").setValue("");
                
                sap.ui.getCore().byId("idFormInp").setValue(sSenderId);
                if(that.tokenModel !== undefined){
                    tokensArr = that.tokenModel.getData();
                }
                else{
                    tokensArr = this.getOwnerComponent().getModel("oMultiInputData").getData();
                }
                oMultiInput2.setTokens(tokensArr);
            }
        },

        handleCloseTestEmail: function () {
            // 
            this.dialogemailform.close();
            this.dialogemailform.destroy();
            this.dialogemailform = null;
        },

        handleSubmitTestEmail: function () {
            // 
            var bBlankEvt = this.validateTestEmailDialog();
            var bEmailToEvt = this.validateTestEmailToValDialog();
            var bEmailCcEvt = this.validateTestEmailCcValDialog();
            var sFrom = sap.ui.getCore().byId("idFormInp").getValue().trim();
            var sSubject = sap.ui.getCore().byId("idSubjectInp").getValue().trim();
            var sMessage = sap.ui.getCore().byId("idMessageTextArea").getValue().trim();
            if (bEmailToEvt === false && bEmailCcEvt === false) {
                MessageBox.error("Enter valid Email ID in To & Cc");
            } else if (bEmailToEvt === false) {
                MessageBox.error("Enter valid Email ID in To");
            } else if (bEmailCcEvt === false) {
                MessageBox.error("Enter valid Email ID in Cc");
            }

            if (bBlankEvt === true && bEmailToEvt === true && bEmailCcEvt === true) {
                MessageBox.confirm("Are you sure you want to Send Email?", {
                    title: "Confirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {

                        jQuery.sap.delayedCall(100, this, function () {
                            
                        });

                        if (sButton === MessageBox.Action.OK) {
                            context.handleCloseTestEmail();


                            var oPayload = JSON.stringify({
                                "ACTION": "TEST_EMAIl",
                                "TABLE_NAME": null,
                                "TABLE_DESCRIPTION": null,
                                "ID": null,
                                "INPUT_DATA": [{
                                    "EMAIL_BODY": sMessage,
                                    "EMAIL_SUBJECT": sSubject,
                                    "EMAIL_TO": aEmailTo,
                                    "EMAIL_CC": aEmailCc,
                                    "EMAIL_SENDER": sFrom
                                }],
                                "USER_DETAILS": {
                                    "USER_ID": context._sUserID,
                                    "USER_ROLE": sUserRole
                                }
                            });
                            oPayload = JSON.stringify({
                                "input": oPayload
                            })


                            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/PostAdminPanelData"
                            $.ajax({
                                url: url,
                                type: 'POST',
                                data: oPayload,
                                contentType: 'application/json',
                                success: function (data, response) {
                                    // 

                                    BusyIndicator.hide();
                                    MessageBox.success("Email has been sent"), {
                                        actions: [MessageBox.Action.OK],
                                        emphasizedAction: MessageBox.Action.OK,
                                        onClose: function (sAction) {

                                        }
                                    };
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
                        };
                    }
                });
            }

        },

        validateTestEmailDialog: function () {
            // 
            var tO = sap.ui.getCore().byId("idToInp").getValue();
            var subject = sap.ui.getCore().byId("idSubjectInp").getValue();
            var message = sap.ui.getCore().byId("idMessageTextArea").getValue();

            if (tO === "" || subject === "" || message === "") {
                MessageBox.error("Enter Mandatory Fields");
                return false;
            } else {
                return true;
            }
        },

        validateTestEmailToValDialog: function () {
            // 
            var tO = sap.ui.getCore().byId("idToInp").getValue();
            var aTo = tO.split(",");
            var aBoolTo = [];
            aEmailTo = [];
            if (tO !== "") {
                for (var i = 0; i < aTo.length; i++) {
                    if (!aTo[i].match(/^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+\.)+[a-z]{2,5}$/)) {
                        aBoolTo.push("false");
                    } else {
                        aBoolTo.push("true");
                        aEmailTo.push(aTo[i]);
                    }
                }
            }
            if (aBoolTo.includes("false")) {
                return false;
            } else {
                return true;
            }
        },

        validateTestEmailCcValDialog: function (idMultiInput) {
            // 
            // var cC = sap.ui.getCore().byId("idCcInp").getValue().replace(/ /g, '');
            // var aCc = cC.split(",");
            // var aBoolCc = [];
            // aEmailCc = [];

            var cC;
            var aBoolCc = [];
            aEmailCc = [];

            if(idMultiInput === "idCcEmailFrag"){
                cC = sap.ui.getCore().byId(idMultiInput).getTokens();
            }
            else{
                cC = this.getView().byId(idMultiInput).getTokens();
            }
            
            if (cC !== "") {
                for (var i = 0; i < cC.length; i++) {
                    if (!cC[i].getProperty("key").match(/^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+\.)+[a-z]{2,5}$/)) {
                        aBoolCc.push("false");
                    } else {
                        aBoolCc.push("true");
                        cC[i].getProperty("key").trim();
                        aEmailCc.push(cC[i]);
                    }
                }
            }
            if (aBoolCc.includes("false")) {
                return false;
            } else {
                return true;
            }
        },

        handleEditPress: function (oEvent) {
            // 
            if (oEvent.getSource().getPressed()) {
                this.getView().byId("idMasterOverToolFoot").setVisible(true);
                this.getView().byId("idPage").setShowFooter(true);
                this.getView().byId("idSaveBtn").setVisible(true);

                var fullName = this.getView().byId("idClientFullNameInp");
                var shortName = this.getView().byId("idClientShrtNameInp");
                var country = this.getView().byId("idCountryInp");
                var senderid = this.getView().byId("idSenderIdInp");
                var email = this.getView().byId("idContactIdInp");  
                var ccEmail = this.getView().byId("idCcEmail");

                senderid.setEditable();
                email.setEditable();
                fullName.setEditable();
                shortName.setEditable();
                country.setEditable();
                ccEmail.setEditable();
            } else {
                this.getView().byId("idMasterOverToolFoot").setVisible(false);
                this.getView().byId("idPage").setShowFooter(false);
                this.getView().byId("idSaveBtn").setVisible(false);

                var fullName = this.getView().byId("idClientFullNameInp");
                var shortName = this.getView().byId("idClientShrtNameInp");
                var country = this.getView().byId("idCountryInp");
                var senderid = this.getView().byId("idSenderIdInp");
                var email = this.getView().byId("idContactIdInp");
                var ccEmail = this.getView().byId("idCcEmail");

                senderid.setEditable(false);
                email.setEditable(false);
                fullName.setEditable(false);
                shortName.setEditable(false);
                country.setEditable(false);
                ccEmail.setEditable();
            }
        },

        onValueHelpCountry: function () {
            // 
            this.TableFragmentCountry();
        },

        TableFragmentCountry: function () {
            // 
            if (!this.empDialog4) {
                this.empDialog4 = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.countryTable", this);
                this.getView().addDependent(this.empDialog4, this);
            }
            this.empDialog4.open();
        },

        readCountrySet: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/MasterCountry";
            this.postAjax(url, "GET", null, "countryJson", null);
        },

        onValueHelpSearchCountry: function (oEvent) {
            // 
            var aFilters = [];
            var sValue = oEvent.getParameter("value");
            var oFilter = [new Filter("LANDX", sap.ui.model.FilterOperator.Contains, sValue)];
            var allFilters = new sap.ui.model.Filter(oFilter, false);
            aFilters.push(allFilters);
            oEvent.getSource().getBinding("items").filter(aFilters);
        },

        closeCountryDialog: function (oEvent) {
            // 
            oEvent.getSource().getBinding("items").filter([]);
        },

        onSelectCountryDialog: function (oEvent) {
            // 
            sCountryCode = oEvent.getParameter("selectedItems")[0].getProperty("description");
            var sValCountry = oEvent.getParameter("selectedItems")[0].getProperty("title");
            this.byId("idCountryInp").setValue(sValCountry);
            oEvent.getSource().getBinding("items").filter([]);
        },

        //**********************************  SAP CONFIG ICON TAB BAR  ********************************//

        onTestHANAConnection: function (oEvent) {
            // 

            var sClientSystem = this.getView().byId("idClientSystInp").getValue();
            var sDestinationName = this.getView().byId("idDestFileNmInp").getValue();
            if (sClientSystem === "" || sDestinationName === "") {
                MessageBox.information("Please enter SAP Client System & Destination Name.");
            }
            else {
                // var oPayload = {
                //     "VALUE": {
                //         "CLIENT_SYS": sClientSystem || "",
                //         "DESTINATION_FILE": sDestinationName || ""
                //     }
                // };
                var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/TestOnPremiseConnection(sapClient='',destFileName='')";
                jQuery.sap.delayedCall(100, this, function () {
                    
                });
                //"/iVen_EDGE/VENDOR_PORTAL/XSJS/ADMINPANEL_GETDATA.xsjs?ACTION=HAHA_DEST_CHECK"
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,

                    contentType: 'application/json',
                    success: function (data, response) {
                        // 
                        BusyIndicator.hide();
                        MessageBox.success(data.value[0]);
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
            }
        },

        handleEditPress2: function (oEvent) {
            // 
            if (oEvent.getSource().getPressed()) {
                this.byId("idMasterOverToolFoot").setVisible(true);
                this.byId("idPage").setShowFooter(true);
                this.getView().byId("idSaveBtn").setVisible(true);

                var clientSystem = this.getView().byId("idClientSystInp");
                var destinationFile = this.getView().byId("idDestFileNmInp");
                var subAccName = this.getView().byId("idSubAccountNameInp");
                var portalLink = this.getView().byId("idPortalLinkInp");

                clientSystem.setEditable();
                destinationFile.setEditable();
                subAccName.setEditable();
                portalLink.setEditable();
            } else {
                this.byId("idMasterOverToolFoot").setVisible(false);
                this.getView().byId("idSaveBtn").setVisible(true);

                var clientSystem = this.getView().byId("idClientSystInp");
                var destinationFile = this.getView().byId("idDestFileNmInp");
                var subAccName = this.getView().byId("idSubAccountNameInp");
                var portalLink = this.getView().byId("idPortalLinkInp");

                clientSystem.setEditable(false);
                destinationFile.setEditable(false);
                subAccName.setEditable(false);
                portalLink.setEditable(false);
            }
        },

        handleEditPress4: function (oEvent) {
            // 
            if (oEvent.getSource().getPressed()) {
                this.byId("idMasterOverToolFoot").setVisible(true);
                this.byId("idPage").setShowFooter(true);
                this.getView().byId("idSaveBtn").setVisible(true);

                var host = this.getView().byId("idHost");
                var port = this.getView().byId("idPort");
                var security = this.getView().byId("idSecurity");
                var username = this.getView().byId("idUserName");
                var password = this.getView().byId("idPassword");
                var senderid = this.getView().byId("idSenderID");

                host.setEditable();
                port.setEditable();
                security.setEditable();
                username.setEditable();
                password.setEditable();
                senderid.setEditable();
            } else {
                this.byId("idMasterOverToolFoot").setVisible(false);
                this.getView().byId("idSaveBtn").setVisible(true);

                var host = this.getView().byId("idHost");
                var port = this.getView().byId("idPort");
                var security = this.getView().byId("idSecurity");
                var username = this.getView().byId("idUserName");
                var password = this.getView().byId("idPassword");
                var senderid = this.getView().byId("idSenderID");

                host.setEditable(false);
                port.setEditable(false);
                security.setEditable(false);
                username.setEditable(false);
                password.setEditable(false);
                senderid.setEditable(false);
            }
        },

        //**********************************  OPEN TEXT ICON TAB BAR  ********************************//

        onTestConnection: function (oEvent) {
            // 
            var sUsername = this.getView().byId("idUsernameInp").getValue();
            var sPassword = this.getView().byId("idPasswordInp").getValue();
            if (sUsername === "" || sPassword === "") {
                MessageBox.information("Please enter OpenText Username & Password.");
            }
            else {
                jQuery.sap.delayedCall(100, this, function () {
                    
                });
                var form = new FormData();
                form.append("username", sUsername);
                form.append("password", sPassword);
                $.ajax({
                    url: "/OpenText/otcs/cs.exe/api/v1/auth",
                    type: 'POST',
                    processData: false,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    data: form,
                    async: false,
                    success: function (response) {
                        BusyIndicator.hide();
                        MessageBox.success("Connected Successfully");
                    },
                    error: function (error) {
                        BusyIndicator.hide();
                        var oXMLMsg = JSON.parse(error.responseText)["error"];
                        MessageBox.error(oXMLMsg);
                    }
                });
            }
        },

        handleEditPress3: function (oEvent) {
            // 
            if (oEvent.getSource().getPressed()) {
                this.byId("idMasterOverToolFoot").setVisible(true);
                this.byId("idPage").setShowFooter(true);
                this.getView().byId("idSaveBtn").setVisible(true);

                var username = this.getView().byId("idUsernameInp");
                var password = this.getView().byId("idPasswordInp");
                var folder = this.getView().byId("idFolderIdInp");

                username.setEditable();
                password.setEditable();
                folder.setEditable();
            } else {
                this.byId("idMasterOverToolFoot").setVisible(false);
                this.getView().byId("idSaveBtn").setVisible(false);
                this.getView().byId("idPasswordInp").setType("Password");
                this.getView().byId("idPasswordInp").setValueHelpIconSrc("sap-icon://show");

                var username = this.getView().byId("idUsernameInp");
                var password = this.getView().byId("idPasswordInp");
                var folder = this.getView().byId("idFoldereadFormErrorlogrIdInp");

                username.setEditable(false);
                password.setEditable(false);
                folder.setEditable(false);
            }
        },

        handleEditPress5: function (oEvent) {
            // 
            if (oEvent.getSource().getPressed()) {
                this.byId("idMasterOverToolFoot").setVisible(true);
                this.byId("idPage").setShowFooter(true);
                this.getView().byId("idSaveBtn").setVisible(true);
                this.getView().byId("idPortalHelpLink").setEditable(true);
            } else {
                this.getView().byId("idPortalHelpLink").setEditable(false);
                this.byId("idMasterOverToolFoot").setVisible(false);
                this.getView().byId("idSaveBtn").setVisible(false);
            }
        },

        //**********************************  ERROR LOG ICON TAB BAR  ********************************//

        readFormErrorlog: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/IdealErrorLog";
            this.postAjax(url, "GET", null, "ErrorLog", null);
        },

        onFilErrorTable: function () {
            // 
            var sValue = this.getView().byId("idErrorSrchFld").getValue();
            var oTable = this.getView().byId("idErrorlog");
            var filters = new sap.ui.model.Filter([
                new sap.ui.model.Filter("LOG_ID", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("SR_NO", sap.ui.model.FilterOperator.EQ, sValue),
                new sap.ui.model.Filter("ERROR_CODE", sap.ui.model.FilterOperator.EQ, sValue),
                new sap.ui.model.Filter("APP_NAME", sap.ui.model.FilterOperator.Contains, sValue)
            ],
                false); // false for OR
            oTable.getBinding("items").filter(filters);
            // var tblLen = oTable.getItems().length;
            // this.getView().byId("iderrorhead").setText("Items (" + tblLen + ")");
        },

        onDatePickerChange: function (oEvent) {
            // 
            var sFrom = oEvent.getParameter("from"),
                sTo = oEvent.getParameter("to"),
                bValid = oEvent.getParameter("valid");
            if (bValid) {
                context.DateRange = {
                    "sFrom": sFrom,
                    "sTo": sTo
                };
            } else {
                oEvent.getSource().setValue("");
                context.DateRange = "";
            }
        },

        onSelectGo1: function (oEvent) {
            // 
            var oTable = this.getView().byId("idErrorlog");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];
            var dateRangeValue = context.DateRange;
            if (dateRangeValue) {
                var oFilter = new sap.ui.model.Filter("CREATED_ON", sap.ui.model.FilterOperator.BT, new Date(dateRangeValue.sFrom), new Date(dateRangeValue.sTo));
                aFilters.push(oFilter);
            }
            // this.readFormErrorlog(aFilters);
            oBinding.filter(aFilters);
        },

        handleRefreshlog: function () {
            // 
            context.getView().byId("DP1").setValue(null);
            context.readFormErrorlog();
            this.getView().byId("idErrorSrchFld").setValue("");
        },

        //***********************************  ON RESETTING  *********************************//

        onFilterSelect: function (oEvent) {
            // 
            tabEvent = oEvent.getParameter("key");

            if (tabEvent == "Masters") {
                this.readOrgConfigData();
                this.onCancel();
            }
            else if (tabEvent == "ClientInfo") {
                this.readOrgConfigData();
                this.onCancel();
            }
            else if (tabEvent == "SapConfig") {
                this.readOrgConfigData();
                this.onCancel();
            }
            else if (tabEvent == "OpenText") {
                this.onCancel();
            }
            else if (tabEvent == "Attachments") {
                this.onMasteriDealAttachmentsRead();

                this.readOrgConfigData();
                this.onCancel();
            }
            else if (tabEvent == "Admin") {
                this._getDashBoardData("DASHBOARD");
                this.onCancel();
            }
            else if (tabEvent == "FormField") {
                this.readiDealformSettingEntries();
                this.onCancel();
            }
            else if (tabEvent == "Smtp") {
                this.readEmailConfig();
                this.onCancel();
            }
        },

        readEmailConfig: function () {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EmailConfig";
            context.postAjax(url, "GET", null, "readEmailConfig", "readEmailConfig");
        },

        onCancel: function () {
            // 
            this.getView().byId("idEditOrgInfo").setVisible(true);
            this.getView().byId("idEditSapConfig").setVisible(true);
            //this.getView().byId("idEditOpenTxtInfo").setVisible(true);
            this.getView().byId("idEditOrgInfo").setPressed(false);
            this.getView().byId("idEditSapConfig").setPressed(false);
            this.getView().byId("idEditSmtp").setVisible(true);
            this.getView().byId("idEditSmtp").setPressed(false);
            //this.getView().byId("idEditOpenTxtInfo").setPressed(false);
            this.getView().byId("idSaveBtn").setVisible(false);
            //this.getView().byId("idPasswordInp").setType("Password");
            //this.getView().byId("idPasswordInp").setValueHelpIconSrc("sap-icon://show");
            this.getView().byId("idMasterSrchFld").setValue("");
            this.byId("idMasterOverToolFoot").setVisible(false);
            this.byId("idPage").setShowFooter(false);

            this.getView().byId("idSenderIdInp").setEditable(false);
            this.getView().byId("idContactIdInp").setEditable(false);
            this.getView().byId("idClientFullNameInp").setEditable(false);
            this.getView().byId("idClientShrtNameInp").setEditable(false);
            this.getView().byId("idSubAccountNameInp").setEditable(false);
            this.getView().byId("idPortalLinkInp").setEditable(false);
            this.getView().byId("idCountryInp").setEditable(false);
            this.getView().byId("idClientSystInp").setEditable(false);
            this.getView().byId("idDestFileNmInp").setEditable(false);
            this.getView().byId("idHost").setEditable(false);
            this.getView().byId("idPort").setEditable(false);
            this.getView().byId("idSecurity").setEditable(false);
            this.getView().byId("idUserName").setEditable(false);
            this.getView().byId("idPassword").setEditable(false);
            this.getView().byId("idSenderID").setEditable(false);

            this.getView().byId("idCcEmail").setEditable(false);
            //this.getView().byId("idUsernameInp").setEditable(false);
            //this.getView().byId("idPasswordInp").setEditable(false);
            //this.getView().byId("idFolderIdInp").setEditable(false);

            // this.getView().byId("id_No").setSelected(true);
            // this.getView().byId("idPortalHelpValue").setEditable(false);
            // this.getView().byId("idPortalHelpLink").setEditable(false);
            // this.getView().byId("idEditAttachInfo").setPressed(false);
        },

        onSave: function () {
            // 
            if (tabEvent == "Masters") {
                counter = 0
                var object = {

                }

                var oTable = this.getView().byId("idMasterTable");
                if (this.TABLE_CODE === undefined) {
                    MessageBox.error("Please Select Table.")
                    this.getView().byId("idSaveBtn").setVisible(false);
                }

                for (var q = 0; q < oTable.getItems().length; q++) {
                    var oID = oTable.getItems()[q].getAggregation("cells")[0].sId
                    if (oID.includes("__input")) {
                        counter++
                    }
                }

                var dynamicValueArray = [];
                var dynamicEmptyStringArray = [];
                var sPrimaryKey = this.PRIMARY_KEY;

                for (var c = 0; c < counter; c++) {
                    for (var s = 0; s < context.aCells.length - 1; s++) {
                        if (sPrimaryKey.includes(context.aCells[s])) {
                            dynamicValueArray.push(context.aCells[s]);
                            dynamicEmptyStringArray.push(oTable.getItems()[c].getCells()[s].getValue());
                        }
                        object["" + context.aCells[s] + ""] = oTable.getItems()[c].getCells()[s].getValue();
                    }

                    var dynamicMessage = [];
                    for (var i = 0; i < dynamicEmptyStringArray.length; i++) {
                        if (dynamicEmptyStringArray[i] === '') {
                            dynamicMessage.push(dynamicValueArray[i]);
                        }
                    }
                    if (dynamicMessage.length > 0) {
                        dynamicMessage = dynamicMessage.toString();
                        MessageBox.warning("'" + dynamicMessage + "' should not be blank");
                        return;
                    }

                    // for (var p = c + 1; p < this.byId("idMasterTable").getItems().length; p++) {

                    //     if (this.TABLE_CODE == "Country" || this.TABLE_CODE == "RegexPostalCode" || this.TABLE_CODE == "IBANCountry" || this.TABLE_CODE ==
                    //         "IVENUsers" ||
                    //         this.TABLE_CODE == "Telecode") {

                    //         if (object.LAND1 == "") {
                    //             MessageBox.error("'LAND1' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "EmailID" || this.TABLE_CODE == "Credential") {

                    //         if (object.SR_NO == "") {
                    //             MessageBox.error("'SR_NO' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "Currency") {

                    //         if (object.WAERS == "") {
                    //             MessageBox.error("'WAERS' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "EntityCode") {

                    //         if (object.BUKRS == "") {
                    //             MessageBox.error("'BUKRS' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "SAPClient") {

                    //         if (object.CLIENT == "") {
                    //             MessageBox.error("'CLIENT' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "SAPVendorNo") {

                    //         if (object.IVEN_VENDOR_CODE == "") {
                    //             MessageBox.error("'IVEN_VENDOR_CODE' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "SubAccount") {

                    //         if (object.SUBACCOUNT == "") {
                    //             MessageBox.error("'SUBACCOUNT' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "IVENUsers") {

                    //         if (object.SR_NO == "") {
                    //             MessageBox.error("'SR_NO' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "Status" || this.TABLE_CODE == "UserRole") {

                    //         if (object.CODE == "") {
                    //             MessageBox.error("'CODE' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "City") {

                    //         if (object.LAND1 == "") {
                    //             MessageBox.error("'LAND1' should not be blank")
                    //             return
                    //         } else if (object.Regio == "") {
                    //             MessageBox.error("'Regio' should not be blank")
                    //             return
                    //         } else if (object.Cityc == "") {
                    //             MessageBox.error("'Cityc' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "Region") {

                    //         if (object.LAND1 == "") {
                    //             MessageBox.error("'LAND1' should not be blank")
                    //             return
                    //         } else if (object.BLAND == "") {
                    //             MessageBox.error("'BLAND' should not be blank")
                    //             return
                    //         } else if (object.BEZEI == "") {
                    //             MessageBox.error("'BEZEI' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "RequestType") {
                    //         if (object.CODE == "") {
                    //             MessageBox.error("'CODE' should not be blank")
                    //             return
                    //         } else if (object.DESCRIPTION == "") {
                    //             MessageBox.error("'DESCRIPTION' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "AttachmentTypes") {
                    //         if (object.CODE == "") {
                    //             MessageBox.error("'CODE' should not be blank")
                    //             return
                    //         } else if (object.DESCRIPTION == "") {
                    //             MessageBox.error("'DESCRIPTION' should not be blank")
                    //             return
                    //         } else if (object.SHORT_DESCRIPTION == "") {
                    //             MessageBox.error("'SHORT_DESCRIPTION' should not be blank")
                    //             return
                    //         } else if (object.TYPE == "") {
                    //             MessageBox.error("'TYPE' should not be blank")
                    //             return
                    //         }
                    //     } else if (this.TABLE_CODE == "MasterTableNames") {
                    //         if (object.SR_NO == "") {
                    //             MessageBox.error("'SR_NO' should not be blank")
                    //             return
                    //         } else if (object.TABLE_CODE == "") {
                    //             MessageBox.error("'TABLE_CODE' should not be blank")
                    //             return
                    //         } else if (object.TABLE_NAME == "") {
                    //             MessageBox.error("'TABLE_NAME' should not be blank")
                    //             return
                    //         } else if (object.TABLE_TYPE == "") {
                    //             MessageBox.error("'TABLE_TYPE' should not be blank")
                    //             return
                    //         } else if (object.COLUMN_COUNT == "") {
                    //             MessageBox.error("'COLUMN_COUNT' should not be blank")
                    //             return
                    //         } else if (object.TABLE_DESCRIPTION == "") {
                    //             MessageBox.error("'TABLE_DESCRIPTION' should not be blank")
                    //             return
                    //         }
                    //     }
                    // }

                    var Payload = {
                        "ACTION": "CREATE",
                        //"TABLE_NAME": this.TABLE_CODE,
                        "TABLE_NAME": this.TABLE_NAME,
                        "TABLE_DESCRIPTION": this.TABLE_DESCRIPTION,
                        "ID": null,
                        "INPUT_DATA": [],
                        "USER_DETAILS": {
                            "USER_ID": context._sUserID,
                            "USER_ROLE": sUserRole
                        }
                    };

                    Payload.INPUT_DATA.push(Object.assign({}, object))
                    //Payload.Table_Data.push(Object.assign({}, object))
                    dataSource.splice(0, 0, object)

                    Payload = JSON.stringify({
                        "input": JSON.stringify(Payload)
                    })
                }

                var oProperty = Object.values(oModel.getProperty("/"))
                oProperty.splice(0, 0, object)

                object = {}
                counter = 0;
                this.onCreate(Payload, tabEvent, "MASTER_TABLES");

            } else if (tabEvent == "ClientInfo") {
                this.clientInfoFlag(tabEvent);
            } else if (tabEvent == "SapConfig") {
                this.sapConfigFlag1(tabEvent);
            } else if (tabEvent == "OpenText") {
                this.openTextFlag(tabEvent);
            } else if (tabEvent == "Smtp") {
                this.smtpFlag(tabEvent);
            } else if (tabEvent == "Attachments") {
                this.AttachFlag(tabEvent);
            }
        },

        onPortalHelpLinkChange: function (oEvent) {
            // 
            var sValue = oEvent.getParameter('value');
            var pattern = /^https:/;
            var isMatch = pattern.test(sValue);
            if (isMatch) {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
            } else {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("Link must contain https:");
            }
        },

        AttachFlag: function (tabEvent) {
            
            var sPortal = this.getView().byId("idPortalHelpLink").getValue();
            var label = this.byId("idVAT_lbl").getText();
            var sSettings;
            if(this.byId("idVisibilitySwitchform").getState() === true) {
                sSettings = "X";
            } else if(this.byId("idVisibilitySwitchform").getState() === false) {
                sSettings = null;
            }
            var bValidation = this.validateForm(tabEvent, sPortal);
            if (bValidation === true) {
                var editPayload = JSON.stringify({
                    "EDIT_TYPE": "USER_MANUAL",
                    "VALUE": [{
                        "TABLE_DATA": [
                        {
                            "CODE": "PORTAL_HELP_URL",
                            "DESCRIPTION": "Custom URL for User Manual",
                            "SETTING": sPortal,
                            "TYPE": "VALUE"
                        },
                        {
                            "CODE": "PORTAL_HELP_CONFIG",
                            "DESCRIPTION": label,
                            "SETTING": sSettings,
                            "TYPE": "PORTAL"
                        }
                    ]}],
                    "USER_DETAILS": {
                        "USER_ID": context._sUserID,
                        "USER_ROLE": sUserRole
                    }
                });
                editPayload = JSON.stringify({
                    "input": editPayload
                });

                MessageBox.confirm("Are you sure you want to Save?", {
                    title: "Confirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                       
                        if (sButton === MessageBox.Action.OK) {
                            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EditAdminPanelData";
                            $.ajax({
                                url: url,
                                type: 'POST',
                                data: editPayload,
                                contentType: 'application/json',
                                success: function (data, response) {
                                //    
                                    BusyIndicator.hide();
                                    MessageBox.success(data.value[0].OUT_SUCCESS);
                                    context.readOrgConfigData();
                                    context.onCancel();
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
                            context.onCancel();
                        };
                    }
                });
            }
        },

        smtpFlag: function (tabEvent) {
            // 
            var host = this.getView().byId("idHost").getValue();
            var port = this.getView().byId("idPort").getValue();
            var security;
            if (this.getView().byId("idSecurity").getSelectedKey() === 'true') {
                security = true;
            } else if (this.getView().byId("idSecurity").getSelectedKey() === 'false') {
                security = false;
            }
            var username = this.getView().byId("idUserName").getValue();
            var password = this.getView().byId("idPassword").getValue();
            var senderid = this.getView().byId("idSenderID").getValue();

            var bValidation = this.validateForm(tabEvent, host, port, security, username, password, senderid);

            if (bValidation === true) {
                var editPayload = JSON.stringify({
                    "EDIT_TYPE": "EDIT_FORMS",
                    "VALUE": [{
                        "PRIMARY_KEY_DETAILS":{
                            "SR_NO": 1
                        },
                        "TABLE_NAME": "EMAIL_CONFIG",
                        "CHANGE_FLAG": "YES",
                        "TABLE_DESCRIPTION": "EmailConfig",
                        "TABLE_DATA": [{
                            "SR_NO": 1,
                            "HOST": host,
                            "PORT": Number(port),
                            "SECURE": security,
                            "SENDER_EMAIL": senderid,
                            "USERNAME": username,
                            "PASSWORD": password,
                            "CREATED_ON": new Date()
                        }]
                    }],
                    "USER_DETAILS": {
                        "USER_ID": context._sUserID,
                        "USER_ROLE": sUserRole
                    }
                });
                editPayload = JSON.stringify({
                    "input": editPayload
                });

                MessageBox.confirm("Are you sure you want to Save?", {
                    title: "Confirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {

                        if (sButton === MessageBox.Action.OK) {
                            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EditAdminPanelData";
                            $.ajax({
                                url: url,
                                type: 'POST',
                                data: editPayload,
                                contentType: 'application/json',
                                success: function (data, response) {
                                    // 
                                    BusyIndicator.hide();
                                    MessageBox.success(data.value[0]);
                                    context.getView().byId("idPassword").setType("Password");

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
                            context.onCancel();
                        };
                    }
                });


            }
        },

        onEyeChange: function (oEvent) {
            // 
            if (oEvent.getSource().getValueHelpIconSrc() === 'sap-icon://hide') {
                oEvent.getSource().setValueHelpIconSrc('sap-icon://show');
                oEvent.getSource().setType('Text');
            }
            else if (oEvent.getSource().getValueHelpIconSrc() === 'sap-icon://show') {
                oEvent.getSource().setValueHelpIconSrc('sap-icon://hide');
                oEvent.getSource().setType('Password');
            }
        },

        onCreate: function (oPayload, oEvnt, sAction) {
            // 
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/PostAdminPanelData";
            MessageBox.confirm("Are you sure you want to Save?", {
                title: "Confirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {

                    if (sButton === MessageBox.Action.OK) {
                        jQuery.sap.delayedCall(100, this, function () {
                            
                        });
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: oPayload,
                            contentType: 'application/json',
                            success: function (data, response) {
                                // 
                                BusyIndicator.hide();
                                MessageBox.success(data.value[0], {
                                    actions: [MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (oAction) {
                                        context.onChange(sAction, oEvnt);
                                        context.onCancel();
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

                    }
                }
            });

        },
        _handleValueHelpClose:function(){
            this.fragEmail.close();
        },
        clientInfoFlag: function (tabEvent) {
            // 
            var origDataCcLength;
            var bEmailCcEvt = true;
            var oTempData = this.getView().getModel("blankJson").getData();
            var oMultiInputTokens = this.getView().byId("idCcEmail").getTokens();
            var newData = oTempData.clientinfo;
            var origData = origModel.oData.Client_Info[0];
            var bFlag = JSON.stringify(origData) === JSON.stringify(newData);

            if(oMultiInputTokens.length > 0){
                bEmailCcEvt = this.validateTestEmailCcValDialog("idCcEmail");
            }
            if (bEmailCcEvt === false) {
                MessageBox.error("Enter valid Email ID in CC");
            }
            else{
                if(origData.EMAIL_CC === ""){
                    origDataCcLength = 0;
                }
                else{
                    origDataCcLength = origData.EMAIL_CC.split(",").length;
                }

                if(origDataCcLength !== oMultiInputTokens.length){
                    bFlag = false;
                }
            if (bFlag == true) {
                bFlag = "NO"
            } else {
                bFlag = "YES"
            }
            this.clientInfoTab(bFlag, tabEvent);
        }
    },
        clientInfoTab: function (bFlag, tabEvent) {
            // 
            // debugger;
            var clientFullName = this.getView().byId("idClientFullNameInp").getValue();
            var clientShortName = this.getView().byId("idClientShrtNameInp").getValue();

            var aTokens= this.getView().byId("idCcEmail").getTokens();

            var sCcEmail = aTokens.map(function(oToken) {
                return oToken.getKey();
              }).join(",");

            var origData = origModel.oData.Client_Info[0];
            var clientCountry = sCountryCode;
            if (clientCountry === undefined) {
                var clientCountry = origData.CLIENT_COUNTRY;
            }
            var emailSenderId = this.getView().byId("idSenderIdInp").getValue();
            var emailContactId = this.getView().byId("idContactIdInp").getValue();

            var origEmailArr = origData.EMAIL_CC.split(",");
            that.oArr = [];

            for(var i=0;i<origEmailArr.length;i++){
                var result1 = aTokens.filter(function (a) {
                   if(origEmailArr[i] === a.getProperty("key")){
                    that.oArr.push(a.getProperty("key"));
                    return a.getProperty("key");
                   }
                })
            }

            if(result1){
                console.log(result1);
            }
            var flag = bFlag;

            if(that.oArr.length !== aTokens.length){
                flag = "YES";
            }

            var bValidation = this.validateForm(tabEvent, clientFullName, clientShortName, sCountryCode, emailSenderId, emailContactId);

            if (bValidation === true) {
                var editPayload = JSON.stringify({
                    "EDIT_TYPE": "EDIT_FORMS",
                    "VALUE": [{
                        "PRIMARY_KEY_DETAILS":{
                            "SR_NO": 1
                        },
                        "TABLE_NAME": "MASTER_EMAIL_CONTACT_ID",
                        "CHANGE_FLAG": flag,
                        "TABLE_DESCRIPTION": "Client Info",
                        "TABLE_DATA": [{
                            "SR_NO": 1,
                            "EMAIL_NOTIF_1": emailSenderId,
                            "EMAIL_NOTIF_2": "",
                            "EMAIL_NOTIF_3": "",
                            "CONTACT_ID_1": emailContactId,
                            "CONTACT_ID_2": "",
                            "CONTACT_ID_3": "",
                            "CLIENT_FULL_NAME": clientFullName,
                            "CLIENT_SHORT_NAME": clientShortName,
                            "CLIENT_COUNTRY": clientCountry,
                            "EMAIL_CC":sCcEmail
                        }]
                    }],
                    "USER_DETAILS": {
                        "USER_ID": context._sUserID,
                        "USER_ROLE": sUserRole
                    }
                });
                editPayload = JSON.stringify({
                    "input": editPayload
                });
                this.onEditForm(editPayload, tabEvent);
            }
        },

        onEditForm: function (oPayload, oEvent) {
            // 
            MessageBox.confirm("Are you sure you want to Save?", {
                title: "Confirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    // debugger;
                    if (sButton === MessageBox.Action.OK) {
                        // debugger;
                        var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EditAdminPanelData";
                        context.postAjax(url, "POST", oPayload, null, null);
                        context.onCancel();
                    };
                }
            });
        },

        validateForm: function (tabEvent, sField1, sField2, sField3, sField4, sField5, sField6) {
            // 
            var bValid = this.formValidation(tabEvent, sField1, sField2, sField3, sField4, sField5, sField6);
            if (bValid === true) {
                return true;
            } else {
                return false;
            }
        },

        formValidation: function (tabEvent, sField1, sField2, sField3, sField4, sField5, sField6) {
            // 
            if (tabEvent === "ClientInfo") {
                if (sField1 === "" || sField2 === "" || sField3 === "" || sField4 === "" || sField5 === "") {
                    MessageBox.error("Enter Mandatory Fields.");
                    return false;
                } else if (!sField4.match(/^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+\.)+[a-z]{2,5}$/) || !sField5.match(
                    /^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+\.)+[a-z]{2,5}$/)) {
                    if (!sField4.match(/^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+\.)+[a-z]{2,5}$/)) {
                        this.getView().byId("idSenderIdInp").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid Email ID.");
                    }
                    if (!sField5.match(/^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+\.)+[a-z]{2,5}$/)) {
                        this.getView().byId("idContactIdInp").setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid Email ID.");
                    }
                    return false;
                } else {
                    this.getView().byId("idClientFullNameInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idClientShrtNameInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idCountryInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idSenderIdInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idContactIdInp").setValueState(sap.ui.core.ValueState.None);
                    return true;
                }
            } else if (tabEvent === "SapConfig") {
                if (sField1 === "" || sField2 === "" || sField3 === "" || sField4 === "") {
                    MessageBox.error("Enter Mandatory Fields.");
                    return false;
                } else {
                    this.getView().byId("idClientSystInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idDestFileNmInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idSubAccountNameInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idPortalLinkInp").setValueState(sap.ui.core.ValueState.None);
                    return true;
                }
            } else if (tabEvent === "OpenText") {
                if (sField1 === "" || sField2 === "" || sField3 === "") {
                    MessageBox.error("Enter Mandatory Fields.");
                    return false;
                } else {
                    this.getView().byId("idUsernameInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idPasswordInp").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idFolderIdInp").setValueState(sap.ui.core.ValueState.None);
                    return true;
                }
            } else if (tabEvent === "Smtp") {
                if (sField1 === "" || sField2 === "" || sField3 === "" || sField4 === "" || sField5 === "" || sField6 === "") {
                    MessageBox.error("Enter Mandatory Fields.");
                    return false;
                } else {
                    this.getView().byId("idHost").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idPort").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idSecurity").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idUserName").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idPassword").setValueState(sap.ui.core.ValueState.None);
                    this.getView().byId("idSenderID").setValueState(sap.ui.core.ValueState.None);
                    return true;
                }
            } else if (tabEvent === "Attachments") {
                if (sField1 === "") {
                    MessageBox.error("Enter Mandatory Fields.");
                    return false;
                } else {
                    this.getView().byId("idPortalHelpLink").setValueState(sap.ui.core.ValueState.None);
                    return true;
                }
            }
        },

        sapConfigFlag1: function (tabEvent) {
            // 
            var oTempData = this.getView().getModel("blankJson").getData();
            var newData = oTempData.sapinfo;
            var origDataSapInfo = origModel.oData.Sap_Info[0];
            var bFlag = JSON.stringify(origDataSapInfo) === JSON.stringify(newData);
            if (bFlag == true) {
                bFlag = "NO"
            } else {
                bFlag = "YES"
            }
            this.sapConfigFlag2(bFlag, tabEvent);
        },

        sapConfigFlag2: function (bFlag1, tabEvent) {
            // 
            var oTempData = this.getView().getModel("blankJson").getData();
            var newData = oTempData.subaccinfo;
            var origDataSubAccInfo = origModel.oData.SubAccount_Info[0];
            var bFlag = JSON.stringify(origDataSubAccInfo) === JSON.stringify(newData);
            if (bFlag == true) {
                bFlag = "NO"
            } else {
                bFlag = "YES"
            }
            this.sapConfigTab(bFlag1, bFlag, tabEvent);
        },

        sapConfigTab: function (bFlag1, bFlag2, tabEvent) {
            // 
            var sapClientSys = this.getView().byId("idClientSystInp").getValue();
            var sapDestFileName = this.getView().byId("idDestFileNmInp").getValue();
            var subAccInfo = this.getView().byId("idSubAccountNameInp").getValue();
            var portalLink = this.getView().byId("idPortalLinkInp").getValue();
            var flag1 = bFlag1;
            var flag2 = bFlag2;
            var bValidation = this.validateForm(tabEvent, sapClientSys, sapDestFileName, subAccInfo, portalLink, "");

            if (bValidation === true) {
                var editPayload = JSON.stringify({
                    "EDIT_TYPE": "EDIT_FORMS",
                    "VALUE": [{
                        "PRIMARY_KEY_DETAILS":{
                            "SR_NO": 1
                        },
                        "TABLE_NAME": "MASTER_SAP_CLIENT",
                        "CHANGE_FLAG": flag1,
                        "TABLE_DESCRIPTION": "Sap_Info",
                        "TABLE_DATA": [{
                            "SR_NO": 1,
                            "CLIENT": sapClientSys,
                            "DESTINTAION": sapDestFileName
                        }]
                    },
                    {
                        "PRIMARY_KEY_DETAILS":{
                            "SR_NO": 1
                        },
                        "TABLE_NAME": "MASTER_SUBACCOUNT",
                        "TABLE_DESCRIPTION": "SubAccount Info",
                        "CHANGE_FLAG": flag2,
                        "TABLE_DATA": [{
                            "SR_NO": 1,
                            "SUBACCOUNT": subAccInfo,
                            "PORTAL_LINK": portalLink
                        }]
                    }],
                    "USER_DETAILS": {
                        "USER_ID": context._sUserID,
                        "USER_ROLE": sUserRole
                    }
                });
                editPayload = JSON.stringify({
                    "input": editPayload
                });

                this.onEditForm(editPayload, tabEvent);
            }
        },

        openTextFlag: function (tabEvent) {
            // 
            var oTempData = this.getView().getModel("blankJson").getData();
            var newData = oTempData.masterCredential_Info;
            var origDataRef = origModel.oData.masterCredential_Info;
            if (origDataRef !== undefined) {
                var origData = origModel.oData.masterCredential_Info[0];
                var bFlag = JSON.stringify(origData) === JSON.stringify(newData);
                if (bFlag == true) {
                    bFlag = "NO"
                } else {
                    bFlag = "YES"
                }
                this.openTextTab(bFlag, tabEvent);
            } else {
                this.openTextTab("YES", tabEvent);
            }
        },

        onSwitchChange: function (oEvent) {
            // 
            if (oEvent.getSource().getState() === false) {
                this.getView().byId("idPortalHelpLinkLabel").setRequired(false);
            } else if (oEvent.getSource().getState() === true) {
                this.getView().byId("idPortalHelpLinkLabel").setRequired(true);
            }
        },

        draftDataBinding: function (data) {
            // 
            this.getView().getModel("blankJson").setProperty("/clientinfo", data.value[0].Results.Client_Info[0] || []);

            this.getView().getModel("blankJson").setProperty("/sapinfo", data.value[0].Results.Sap_Info[0] || []);

            this.getView().getModel("blankJson").setProperty("/attchinfo", data.value[0].Results.IdealAttachments || {});
            this.getView().getModel("blankJson").setProperty("/subaccinfo", data.value[0].Results.SubAccount_Info[0] || []);
            this.PRIMARY_KEY_FOR_ATTACH = data.value[0].Results.IdealAttachments.PrimaryKey[0].PRIMARY_KEY;
            if (data.value[0].Results.IdealAttachments.EnableUserManualViaURL[0].SETTING === 'X') {
                this.getView().byId("idVisibilitySwitchform").setState(true);
                this.getView().byId("idPortalHelpLinkLabel").setRequired(true);
            } else {
                this.getView().byId("idVisibilitySwitchform").setState(false);
                this.getView().byId("idPortalHelpLinkLabel").setRequired(false);
            }

            this.PRIMARY_KEY_FOR_ATTACH = data.value[0].Results.IdealAttachments.PrimaryKey[0].PRIMARY_KEY;

            // this.getView().getModel("blankJson").setProperty("/subaccinfo", data.value[0].Results.SubAccount_Info[0] || []);

            this.getView().getModel("blankJson").setProperty("/mastercredinfo", data.value[0].Results.MasterCredential_Info[0] || []);


            var email2 = data.value[0].Results.Client_Info[0].EMAIL_CC;
            if (email2 !== "" && email2 !== null && email2 !== undefined) {

            var secondaryEmails = email2.split(",");

            var oMultiInput1 = this.getView().byId("idCcEmail");

            var tokensArr = [];
            for (var a = 0; a < secondaryEmails.length; a++) {
                var token = new Token({
                    text: secondaryEmails[a],
                    key: secondaryEmails[a]
            });
            tokensArr.push(token);
            }

            var oModel = new JSONModel(tokensArr);
            this.getOwnerComponent().setModel(oModel,"oMultiInputData");

            that.oMultiinputData = this.getOwnerComponent().getModel("oMultiInputData").getData();
            that.tokenModel.setData(that.oMultiinputData);  
            that.oMultiToken.setData(that.oMultiinputData);
            oMultiInput1.setTokens(tokensArr);
            }else{
                var tokensArr = [];
                tokensArr.push();

                var oMultiInput1 = this.getView().byId("idCcEmail");

                var oModel = new JSONModel(tokensArr);
            this.getOwnerComponent().setModel(oModel,"oMultiInputData");

                that.oMultiinputData = this.getOwnerComponent().getModel("oMultiInputData").getData();
                that.tokenModel.setData(that.oMultiinputData);  
                that.oMultiToken.setData(that.oMultiinputData);
                oMultiInput1.setTokens(tokensArr); 
            } 
            
            var oArray = data.value[0].Results.IdealAttachments.AttachmentTable;
            var obj = {
                "value": oArray
            }
            var oModel3 = new JSONModel(obj);
            context.getView().setModel(oModel3, "ndaAttachment");
            this.getView().byId("idTotalItemsAttachmnt").setText("Items (" + data.value[0].Results.IdealAttachments.AttachmentTable.length + ")");
        },

        EditFormBtn: function (oEvent) {
            
            this.openUpdateDialogForm();
            obj = oEvent.getSource().getParent().getBindingContext("tbldata").getObject();
            var oObj = new JSONModel(obj);
            this.getView().setModel(oObj, "editformtable")
        },

        onSubmitEditForm: function (oEvent) {
            
            var mData = this.getView().getModel("editformtable").getData();

            var ccode = data1.value[0].CCODE;
            var visibility;
            var mandatory;

            if (sap.ui.getCore().byId("idVisibilitySwitch").getState() == true) {
                visibility = "X"
            } else {
                visibility = null
            }

            if (sap.ui.getCore().byId("idMandatorySwitch").getState() == true) {
                mandatory = "X"
            } else {
                mandatory = null
            }

            var sPayload = JSON.stringify({
                "EDIT_TYPE": "FORM_FIELDS",
                "CCODE": ccode,
                "REQ_TYPE": iRequestTypeVH,
                "VALUE": [{
                    "TABLE_DATA": [{
                        "FIELDS": mData.FIELDS,
                        "VISIBILITY": visibility,
                        "MANDATORY": mandatory,
                        "DESCRIPTION": mData.DESCRIPTION.trim()
                    }]
                }],
                "USER_DETAILS": {
                    "USER_ID": context._sUserID,
                    "USER_ROLE": sUserRole
                }
            });
            sPayload = JSON.stringify({
                "input": sPayload
            });

            MessageBox.confirm("Are you sure you want to Submit?", {
                title: "Confirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    ;
                    if (sButton === MessageBox.Action.OK) {
                        context.byId("idFormSrchFld").setValue("");
                        context.dialogform.close();
                        
                        var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/EditAdminPanelData";
                        $.ajax({
                            url: url,
                            type: 'POST',
                            data: sPayload,
                            contentType: 'application/json',
                            success: function (data, response) {
                                
                                BusyIndicator.hide();
                                MessageBox.success("The Field ID" + " " + sap.ui.getCore().byId("idFieldInp").getValue() + " " + "updated sucessfully", {
                                    actions: [MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                    onClose: function (sAction) {

                                        context.readVisibleMandatoryData(iRequestTypeVH, ccode);
                                        context.onCloseEditForm();
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
                    };
                }
            });
        },

        onCloseEditForm: function () {
            // 
            this.dialogform.close();
        },

        openUpdateDialogForm: function () {
            
            if (!this.dialogform) {

                this.dialogform = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.editForm", this);
                this.getView().addDependent(this.dialogform);
            }
            this.dialogform.open();
        },

        masterEditValidate: function (sTable, iNum, iActnum) {
            // 
            var bValid = this.masterDialogValidation(sTable, iNum, iActnum);

            if (bValid === true) {
                return true;
            } else {
                MessageBox.error("Enter Mandatory Fields.");
                return false;
            }
        },

        masterDialogValidation: function (sTable, iNum, iActnum) {
            // 
            var sVal = sap.ui.getCore().byId("__input" + [iNum]).mProperties.value;
            if (sTable === "MasterTableNames") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "Country") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "Currency") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "EntityCode") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "IBANCountry") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "IVENUsers") {
                var oAno = Number(iActnum + 9);
                if (iNum < oAno) {
                    if (sVal === "") {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }

            }

            if (sTable === "RegexPostalCode") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "UserRole") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "Status") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "Telecode") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "MasterTableNames") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "RequestType") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }

            if (sTable === "AttachmentTypes") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }
            if (sTable === "iVenSettings") {
                if (sVal === "") {
                    return false;
                } else {
                    return true;
                }
            }
        },
        onSubmitAdd: function () {
            ;
            var that = this;
            var isRBSelected = sap.ui.getCore().byId("RB-1").getSelected();
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/PostVisibleMandatoryFields";
            var sRequestType = sap.ui.getCore().byId("idFragInp").getValue();
            var sEntityType = sap.ui.getCore().byId("idFragEntityInp").getValue();
            var sCopyEntityType = sap.ui.getCore().byId("idCopyEntity").getValue();


            if ((sRequestType === "" || sEntityType === "") || (isRBSelected === true && sCopyEntityType === "")) {

                if (sRequestType === "") {
                    this.getView().getModel("addFieldsData").setProperty("/requestType", "Error");
                    this.getView().getModel("addFieldsData").setProperty("/requestTypeText", "Please Select Request Type");
                }

                if (sEntityType === "") {
                    this.getView().getModel("addFieldsData").setProperty("/entityCode", "Error");
                    this.getView().getModel("addFieldsData").setProperty("/entityCodeText", "Please Select Entity Type");
                }

                if (isRBSelected === true && sCopyEntityType === "") {
                    this.getView().getModel("addFieldsData").setProperty("/copyEntityCode", "Error");
                    this.getView().getModel("addFieldsData").setProperty("/copyEntityCodeText", "Please Select Previous Entity");
                }
            }
            else if (isRBSelected === true && sCopyEntityType === "") {
                this.getView().getModel("addFieldsData").setProperty("/copyEntityCode", "Error");
                this.getView().getModel("addFieldsData").setProperty("/copyEntityCodeText", "Please Select Previous Entity");
            }
            else if (sEntityType === sCopyEntityType) {
                MessageBox.error("Please select a different entity from the previous entity.");
                sap.ui.getCore().byId("idFragInp").setValue("");
                sap.ui.getCore().byId("idFragEntityInp").setValue("");
                sap.ui.getCore().byId("idCopyEntity").setValue("");
            }
            else {
                BusyIndicator.show();
                iRequestTypeVH = this.getView().getModel("addFieldsData").getProperty("/requestTypeCode");
                var ccode = this.getView().getModel("addFieldsData").getProperty("/entityCodeValue");
                var payload =
                {
                    "requestType": iRequestTypeVH,
                    "entityCode": ccode,
                    "copyEntityCode": this.getView().getModel("addFieldsData").getProperty("/copyEntity"),
                    "userDetails": {
                        "USER_ROLE": sUserRole,
                        "USER_ID": context._sUserID
                    }
                }
                var oPayload = JSON.stringify(payload);
                // var oPayload = JSON.stringify({
                //     "input": JSON.stringify(payload)
                // })

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: oPayload,
                    contentType: 'application/json',
                    success: function (data, response) {
                        ;
                        BusyIndicator.hide();
                        that.onCloseAdd();
                        var addtionalText = ". Do You want to edit the fields ? "
                        MessageBox.success(data.value[0].outputScalar.OUT_SUCCESS + addtionalText,
                            {
                                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                                onClose: function (oAction) {
                                    if (oAction === "YES") {
                                        that.onFieldSet(iRequestTypeVH, ccode, sRequestType, sEntityType)
                                    }

                                }
                            });
                    },
                    error: function (error) {
                        ;
                        BusyIndicator.hide();
                        var oXML, oXMLMsg;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            if (oXML.error['code'] === "500") {
                                sap.ui.getCore().byId("idFragInp").setValue("");
                                sap.ui.getCore().byId("idFragEntityInp").setValue("");
                                sap.ui.getCore().byId("idCopyEntity").setValue("");
                            }
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText
                        }
                        MessageBox.error(oXMLMsg);
                    }
                });
            }
        },
        fragValueStates: function () {
            oAddTable = {
                requestType: "None",
                requestTypeText: "",
                entityCode: "None",
                entityCodeText: "",
                copyEntityCode: "None",
                copyEntityText: "",
                copyEntity: ""
            }

            var oModel = new JSONModel(oAddTable);
            this.getView().setModel(oModel, "addFieldsData");

            myJSONModel = new JSONModel();

            // sap.ui.getCore().byId("idCopyEntity").setVisible(false);
        },
        onCloseAdd : function(){
            this.dialog191.close();
            this.dialog191.destroy();
            this.dialog191 = null;
        },
        onSelectRB1: function (oEvent) {
            ;
            var availbleEntity = this.getView().getModel("availableMandatoryFields");
            var sRequestType = sap.ui.getCore().byId("idFragInp").getValue();
            var sEntityCode = sap.ui.getCore().byId("idFragEntityInp").getValue();

            if (sRequestType === "" && sEntityCode === "") {
                this.getView().getModel("addFieldsData").setProperty("/requestType", "Error");
                this.getView().getModel("addFieldsData").setProperty("/requestTypeText", "Please Select Request Type");

                this.getView().getModel("addFieldsData").setProperty("/entityCode", "Error");
                this.getView().getModel("addFieldsData").setProperty("/entityCodeText", "Please Select Entity");

                sap.ui.getCore().byId("RB-2").setSelected(true);
            }
            else if (sRequestType === "") {
                this.getView().getModel("addFieldsData").setProperty("/requestType", "Error");
                this.getView().getModel("addFieldsData").setProperty("/requestTypeText", "Please Select Request Type");

                sap.ui.getCore().byId("RB-2").setSelected(true);
            }
            else if (sEntityCode === "") {
                this.getView().getModel("addFieldsData").setProperty("/entityCode", "Error");
                this.getView().getModel("addFieldsData").setProperty("/entityCodeText", "Please Select Entity");
                sap.ui.getCore().byId("RB-2").setSelected(true);
            }
            else if (availbleEntity.getData().length === 0) {
                this.onCloseRB1();
            }
            else if (availbleEntity.getData().length > 0) {
                sap.ui.getCore().byId("idCopyEntity").setVisible(true);
                sap.ui.getCore().byId("idCopyEntityLbl").setVisible(true);
            }
        },
        onSelectRB2: function () {
            sap.ui.getCore().byId("idCopyEntity").setVisible(false);
            sap.ui.getCore().byId("idCopyEntityLbl").setVisible(false);
        },
        onCloseRB1: function () {
            MessageBox.information("There are no form fields available to copy for selected request type", {
                actions: [MessageBox.Action.OK],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
                    sap.ui.getCore().byId("RB-1").setSelected(false);
                    sap.ui.getCore().byId("RB-2").setSelected(true);
                }
            });
        },
        oGetMandatoryFields: function (iRequestType) {
            ;
            var that = this;
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/GetAllVisibleMandatoryEntity(userId='" + context._sUserID + "',userRole='ADMIN',reqTypeCode=" + iRequestType + ")";
            // /odata/v4/admin-panel/GetAllVisbleMandatoryEntity(userId='chandan.m@intellectbizware.com',userRole='BYR',reqTypeCode=2,action='A')
            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                success: function (Data, response) {
                    ;
                    // var oModel = new JSONModel(Data.value[0].AVAILABLE.MANDATORY);
                    myJSONModel.setData(Data.value[0].AVAILABLE.MANDATORY);
                    that.getView().setModel(myJSONModel, "availableMandatoryFields");

                    var oModel2 = new JSONModel(Data.value[0].NOT_AVAILABLE.MANDATORY);
                    that.getView().setModel(oModel2, "notAvaiableMandatoryFields");
                },
                error: function (error) {
                    // BusyIndicator.hide();
                    ;
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
        onValueHelpCopyEntity : function(){
            var sRequestType = sap.ui.getCore().byId("idFragInp").getValue();

            if (sRequestType === "") {
                this.getView().getModel("addFieldsData").setProperty("/requestType", "Error");
                this.getView().getModel("addFieldsData").setProperty("/requestTypeText", "Please Select Request Type");
            }
            else {
                if (!this.copyEntity) {
                    this.copyEntity = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.copyEntityList", this);
                    this.getView().addDependent(this.copyEntity);
                }
                this.copyEntity.open();
            }
        },
        handleCloseCopyEntity: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);
            var sCopyEntityCode = oEvent.getSource()._oSelectedItem.getBindingContext("availableMandatoryFields").getObject().BUKRS;
            sap.ui.getCore().byId("idCopyEntity").setValue(oSelectedItem.getTitle());
            this.getView().getModel("addFieldsData").setProperty("/copyEntity", sCopyEntityCode);
            this.getView().getModel("addFieldsData").setProperty("/copyEntityCode", "None");
            this.getView().getModel("addFieldsData").setProperty("/copyEntityCodeText", "");
        },
        onFieldSet: function (iRequestTypeVH, ccode, sRequestType, sEntityType) {
            ;
            var sEntityValue = sEntityType;
            this.getView().byId("idFormInp").setValue(sRequestType);
            this.getView().byId("idFormEntityInp").setValue(sEntityValue);
            this.readVisibleMandatoryData(iRequestTypeVH, ccode);
        },
        onTokenFrag:function(oEvent){
            if (!this.fragEmail) {
                this.fragEmail = sap.ui.xmlfragment("com.ibs.ibsappidealsystemconfiguration.view.fragment.emailFrag", this);
                this.getView().addDependent(this.fragEmail);
            }
            this.fragEmail.open();
        },
        onTokenUpdate:function(oEvent){
            // debugger;
            var multiInputData = this.getOwnerComponent().getModel("oMultiInputData").getData();

            var sType = oEvent.getParameter("type");
            if(sType === "added"){
                var aFragEmailVal = that.validateTestEmailCcValDialog("idCcEmail");
                if(aFragEmailVal === false){
                    MessageBox.error("Enter valid Email ID in CC");
                    if(that.oMultiToken.getData().length === undefined){
                        this.getView().byId("idCcEmail").setTokens(multiInputData);
                    }
                    else{
                        this.getView().byId("idCcEmail").setTokens(that.oMultiToken.getData());
                    }
                }
                else{
                    that.oMultiToken.setData(this.getView().byId("idCcEmail").getTokens());
                }
            }
            else if(sType === "removed"){
                var sKey = oEvent.getParameter("removedTokens")[0].getProperty("key");
                var aData = that.oMultiToken.getData();
                for (var i = 0, len = aData.length; i < len; i++) {
                    var idx;
                    if (aData[i].getProperty("key") === sKey) {
                        idx = i;
                    }
                    
                }
                if(idx !== undefined){
                    aData.splice(idx,1);
                }
                
                this.getView().byId("idCcEmail").setTokens(aData);
            }
        },

    });
});
