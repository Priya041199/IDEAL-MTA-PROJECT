sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "com/ibs/ibsappidealclaimrequestcreation/model/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator"
],
function (BaseController, JSONModel,formatter,Sorter,library,Spreadsheet,MessageBox,BusyIndicator) {
    "use strict";
    var context; 
    var that;
    var sKey;
    var filters;
    var temp;
    var filterFlag = false;
    var EdmType = library.EdmType;
    var aFilterItems;
    return BaseController.extend("com.ibs.ibsappidealclaimrequestcreation.controller.MasterPage", {
        formatter: formatter,
        onInit: function () {
            //  debugger;
            context = this;
            that = this;
            var oMinDateModel = new JSONModel({
                minDate: new Date()
            });
            this.getView().setModel(oMinDateModel, "minDateModel");
            this.getOwnerComponent().setModel(new JSONModel([]), "appView");

            this.getOwnerComponent().getModel("appView").setProperty("/selectedkey","(STATUS eq 1)")
            var oRouter = context.getOwnerComponent().getRouter().getRoute("RouteMasterPage")
            oRouter.attachPatternMatched(context._onObjMatch, context);
        },
        _onObjMatch : function(){
            //  debugger;
        var flexiblelayout = this.getView().getParent().getParent()
        flexiblelayout.toBeginColumnPage(this.getView())
            this._getUserAttributes();
            // this.getOwnerComponent().getModel("appView").setProperty("/selectedkey","(STATUS eq 1)")
        },
        _getUserAttributes: function () {
            // debugger;
            var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
                
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var attr = appModulePath + "/user-api/attributes";

            // this._sUserID = "darshan.l@intellectbizware.com";
            // this._sUserName = "Darshan Lad";
            // var obj = {
            //     userId: "darshan.l@intellectbizware.com",
            //     userName: "Darshan Lad"
            // }
            // var oModel = new JSONModel(obj);
            // this.getOwnerComponent().setModel(oModel, "userModel");
            // if(this._aDialog1 === "" || this._aDialog1 === undefined || this._aDialog1 === null){
            //     // var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
            //     // this.readUserMasterEntities(aFilters);
            //     // this.onReadCRNO(aFilters);
            //     this.onReadFilter();
            // }else{
            //     // var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
            //     // this.readUserMasterEntiti`es(aFilters);
            //     // this.onReadCRNO(aFilters);
            //     this.onReadFilter();
            // }
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: attr,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, response) {
                        // debugger;
                        context._sUserID = data.email.toLowerCase().trim();
                        context._sUserName = data.firstname + " " + data.lastname;
                        // that.readMasterIdealUser();
                        var obj = {
                            userId: data.email.toLowerCase(),
                            userName: data.firstname + " " + data.lastname
                        }
                        
                        var oModel = new JSONModel(obj);
                        context.getOwnerComponent().setModel(oModel, "userModel");

                       if(context._aDialog1 === "" || context._aDialog1 === undefined || context._aDialog1 === null){
                            // var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
                            // context.readUserMasterEntities(aFilters);
                            // context.onReadCRNO(aFilters);
                            context.onReadFilter();
            }else{
                //  var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
                // this.readUserMasterEntities(aFilters);
                // this.onReadCRNO(aFilters);
                context.onReadFilter();
            }
        },
                    error: function (oError) {
                        // debugger;
                        MessageBox.error("Error while reading User Attributes");
                    }
                });
            });
        },
        
        onReadFilter : function(aFilter,Key){
            // debugger;
            var loginId = "(DISTRIBUTOR_ID eq '1100013')"
            var EntityFilters = aFilter ||  this.getOwnerComponent().getModel("appView").getProperty("/selectedkey") ;
            var sSelectedKey = this.getView().byId("idIconTabBar").getSelectedKey() || sKey;

            if((aFilter === undefined || aFilter === null || aFilter === "") && sSelectedKey === "Created"){
                sSelectedKey = null;
            }
            if(temp === "reset"){
                sSelectedKey = null;
            }
            if(Key === undefined || Key === "" || Key === null){
                if(EntityFilters !== "" && EntityFilters !== null && EntityFilters !== undefined){
                    aFilter = loginId + " and " + EntityFilters;       
                    this.readUserMasterEntities(aFilter, sSelectedKey);
                    this.onReadCRNO(loginId);
                }else{
                    this.readUserMasterEntities(loginId, sSelectedKey);
                    this.onReadCRNO(loginId);
                }
            }else{
                if(Key === "Created"){
                    var status = "(STATUS eq 1)";
                    var newFilter = aFilter + " and " + status;
                    this.readUserMasterEntities(newFilter, sSelectedKey); 
                }else if(Key === "InApproval"){
                    var status = "(STATUS eq 4)";
                    var newFilter = aFilter + " and " + status;
                    this.readUserMasterEntities(newFilter, sSelectedKey); 
                }else if(Key === "Approved"){
                    var status = "(STATUS eq 2)";
                    var newFilter = aFilter + " and " + status;
                    this.readUserMasterEntities(newFilter, sSelectedKey);
                }else if(Key === "Rejected"){
                    var status = "(STATUS eq 3)";
                    var newFilter = aFilter + " and " + status;
                    this.readUserMasterEntities(newFilter, sSelectedKey);
                }else if(Key === "SendBack"){
                    var status = "(STATUS eq 5)";
                    var newFilter = aFilter + " and " + status;
                    this.readUserMasterEntities(newFilter, sSelectedKey);
                }else if(Key === "All"){
                    aFilter = loginId + " and " + EntityFilters;       
                    this.readUserMasterEntities(aFilter, sSelectedKey);
                }
            }
        },
        readUserMasterEntities: function(aFilters,sSelectedKey) {
            //  debugger
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var loginId = "(DISTRIBUTOR_ID eq '1100013')";

            // var no = "1100013";
            
            if(sSelectedKey===null || sSelectedKey==="All"){
                if(filters === null || filters === undefined || filters === ""){
                    var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$expand=TO_STATUS,TO_ITEMS&$filter=" + loginId;
                }else{
                    var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$expand=TO_STATUS,TO_ITEMS&$filter=" + aFilters;
                }
            }else if(sSelectedKey !== "" && filters === undefined){
                if(sSelectedKey === "Created"){
                    var status = "(STATUS eq 1)";
                    var newFilter = aFilters + " and " + status;
                }else if(sSelectedKey === "InApproval"){
                    var status = "(STATUS eq 4)";
                    var newFilter = aFilters + " and " + status;
                }else if(sSelectedKey === "Approved"){
                    var status = "(STATUS eq 2)";
                    var newFilter = aFilters + " and " + status;
                }else if(sSelectedKey === "Rejected"){
                    var status = "(STATUS eq 3)";
                    var newFilter = aFilters + " and " + status;
                }else if(sSelectedKey === "SendBack"){
                    var status = "(STATUS eq 5)";
                    var newFilter = aFilters + " and " + status;
                }else if(sSelectedKey === "All"){
                    var newFilter = aFilters
                }
                var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$expand=TO_STATUS,TO_ITEMS&$filter=" + newFilter;
            }else{
            var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$expand=TO_STATUS,TO_ITEMS&$filter=" + aFilters;
            }

            $.ajax({
                url: url,
                type: 'GET',
                data: null,
                contentType: 'application/json',
                success: function (data, responce) {
                    // debugger;
                    var aIntialData = {
                        value: []
                    }; 
                    
                    if(filterFlag === true && sSelectedKey === undefined){
                        // temp ="";
                        var keyData = context.getView().byId("idIconTabBar").getSelectedKey();
                        var oObj = {
                            "Created": 0,
                            "InApproval": 0,
                            "Rejected": 0,
                            "Approved": 0,
                            "SendBack": 0,
                            "All": data.value.length
                        }
                        for (var j = 0; j < data.value.length; j++) {
                            // data.value[j].STATUS = String(data.value[j].STATUS);
                            if (data.value[j].STATUS === 1) {
                                // aIntialData.value.push(data.value[j]);
                                oObj.Created = oObj.Created + 1
                            }
                            else if (data.value[j].STATUS === 4) {
                                // aIntialData.value.push(data.value[j]);
                                oObj.InApproval = oObj.InApproval + 1
                            }
                            else if (data.value[j].STATUS === 3) {
                                oObj.Rejected = oObj.Rejected + 1
                            }
                            else if (data.value[j].STATUS === 2) {
                                oObj.Approved = oObj.Approved + 1
                            }else if(data.value[j].STATUS === 5){
                                oObj.SendBack = oObj.SendBack + 1
                            }
                        }

                        var oModel = new JSONModel(oObj);
                        context.getView().setModel(oModel, "countModel");

                        if(keyData === "Created"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 1){
                                    aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else if(keyData === "InApproval"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 4){
                                    aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else if(keyData === "Rejected"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 3){
                                    aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else if(keyData === "Approved"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 2){
                                    aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else if(keyData === "SendBack"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 5){
                                    aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else{
                            for(var j=0;j<data.value.length;j++){
                                    aIntialData.value.push(data.value[j]);
                            }
                            // aIntialData.value.push(data.value);
                        }
                        var oModel = new JSONModel(aIntialData);
                        context.getView().setModel(oModel,"cModel");
                        context.onReadCRNO(loginId);
                    }else if(sSelectedKey === null && temp === "reset"){
                        temp ="";
                        var keyData = "Created";
                        var oObj = {
                            "Created": 0,
                            "InApproval": 0,
                            "Rejected": 0,
                            "Approved": 0,
                            "SendBack": 0,
                            "All": data.value.length
                        }
                        for (var j = 0; j < data.value.length; j++) {
                            // data.value[j].STATUS = String(data.value[j].STATUS);
                            if (data.value[j].STATUS === 1) {
                                // aIntialData.value.push(data.value[j]);
                                oObj.Created = oObj.Created + 1
                            }
                            else if (data.value[j].STATUS === 4) {
                                // aIntialData.value.push(data.value[j]);
                                oObj.InApproval = oObj.InApproval + 1
                            }
                            else if (data.value[j].STATUS === 3) {
                                oObj.Rejected = oObj.Rejected + 1
                            }
                            else if (data.value[j].STATUS === 2) {
                                oObj.Approved = oObj.Approved + 1
                            }else if(data.value[j].STATUS === 5){
                                oObj.SendBack = oObj.SendBack + 1
                            }
                        }

                        var oModel = new JSONModel(oObj);
                        context.getView().setModel(oModel, "countModel");

                        if(keyData === "Created"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 1){
                                    aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else if(keyData === "InApproval"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 4){
                                    // aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else if(keyData === "Rejected"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 3){
                                    // aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else if(keyData === "Approved"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 2){
                                    // aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else if(keyData === "SendBack"){
                            for(var j=0;j<data.value.length;j++){
                                if(data.value[j].STATUS === 5){
                                    // aIntialData.value.push(data.value[j]);
                                }
                            }
                        }else{
                            for(var j=0;j<data.value.length;j++){
                                    // aIntialData.value.push(data.value[j]);
                            }
                            // aIntialData.value.push(data.value);
                        }

                        for(var i=0;i<data.value.length;i++){
                            if(data.value[i].CR_NO === null || data.value[i].CR_NO === undefined || data.value[i].CR_NO === ""){
                                data.value[i].CR_NO = data.value[i].CR_NO;
                            }else{
                                data.value[i].CR_NO = data.value[i].CR_NO.toString();
                            } 
                        }
                        
                        var oModel = new JSONModel(aIntialData);
                        context.getView().setModel(oModel,"cModel");
                        context.onReadCRNO(loginId);

                    }else if(sSelectedKey === "" || sSelectedKey === null || sSelectedKey === undefined){
                        for(var i=0;i<data.value.length;i++){
                            if(data.value[i].CR_NO === null || data.value[i].CR_NO === undefined || data.value[i].CR_NO === ""){
                                data.value[i].CR_NO = data.value[i].CR_NO;
                            }else{
                                data.value[i].CR_NO = data.value[i].CR_NO.toString();
                            } 
                        }

                        var oObj = {
                            "Created": 0,
                            "InApproval": 0,
                            "Rejected": 0,
                            "Approved": 0,
                            "SendBack": 0,
                            "All": data.value.length
                        }

                        for (var j = 0; j < data.value.length; j++) {
                            // data.value[j].STATUS = String(data.value[j].STATUS);
                            if (data.value[j].STATUS === 1) {
                                aIntialData.value.push(data.value[j]);
                                oObj.Created = oObj.Created + 1
                            }
                            else if (data.value[j].STATUS === 4) {
                                // aIntialData.value.push(data.value[j]);
                                oObj.InApproval = oObj.InApproval + 1
                            }
                            else if (data.value[j].STATUS === 3) {
                                oObj.Rejected = oObj.Rejected + 1
                            }
                            else if (data.value[j].STATUS === 2) {
                                oObj.Approved = oObj.Approved + 1
                            }else if(data.value[j].STATUS === 5){
                                oObj.SendBack = oObj.SendBack + 1
                            }
                        }

                        var oModel = new JSONModel(oObj);
                        context.getView().setModel(oModel, "countModel");

                        var oModel = new JSONModel(aIntialData);
                        context.getView().setModel(oModel,"cModel");
                        context.onReadCRNO(loginId);
                    }else{
                        for(var i=0;i<data.value.length;i++){
                            if(data.value[i].CR_NO === null || data.value[i].CR_NO === undefined || data.value[i].CR_NO === ""){
                                data.value[i].CR_NO = data.value[i].CR_NO;
                            }else{
                                data.value[i].CR_NO = data.value[i].CR_NO.toString();
                            } 
                        }
                        var oModel = new JSONModel(data);
                        context.getView().setModel(oModel,"cModel");
                        context.getView().getModel("countModel").setProperty("/" + sSelectedKey, data.value.length);
                        context.onReadCRNO(loginId);
                    }
                },
                error: function (e) {
                    BusyIndicator.hide();
                    var oXMLMsg, oXML;
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
        onFilterSelect: function (oEvent) {
            // 
            // debugger;
            var oBinding = this.byId("idProductsTable").getBinding("items"),
                sKey,
                model=this.getOwnerComponent().getModel("appView"),

                // Array to combine filters
                aFilter ;

            var searchValue = this.getView().byId("onSearchMasterData").getValue();
            if(searchValue !== "" || searchValue !== null || searchValue !== undefined){
                this.getView().byId("onSearchMasterData").setValue("")
            }

            if(oEvent === null || oEvent === undefined || oEvent === ""){
                sKey = "Created";
                // model.setProperty("/selectedkey",sKey)
            }else{
                sKey = oEvent.getParameter("key");
                // model.setProperty("/selectedkey",sKey)
            }

            // if (sKey == "Invited") {
            //     aFilters.push(
            //         new Filter([new Filter("STATUS", "EQ", 2)])
            //     )    
            // }

            if(filters){
                this.onReadFilter(filters,sKey);
           }else if (sKey == "Created") {
                aFilter = "(STATUS eq 1)";
                this.onReadFilter(aFilter);
            }
            else if (sKey == "InApproval") {
                 aFilter = "(STATUS eq 4)";
                this.onReadFilter(aFilter);
            }
            else if (sKey == "Rejected") {
                 aFilter = "(STATUS eq 3)";
                this.onReadFilter(aFilter);
            }
            else if (sKey == "Approved") {
                 aFilter = "(STATUS eq 2)";
                this.onReadFilter(aFilter);
            }
            else if (sKey == "SendBack") {
                aFilter = "(STATUS eq 5)";
               this.onReadFilter(aFilter);
           }
            else if (sKey == "All"){
                this.onReadFilter(aFilter);
            }
            model.setProperty("/selectedkey",aFilter)
            
        },
       
        onReadCRNO : function(aFilter){
            // var crno = this.getView().getModel("cModel").getData();
             
            
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            // var no = "1100013";
          
            var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$filter=" + aFilter;

            $.ajax({
                url: url,
                type: 'GET',
                data: null,
                contentType: 'application/json',
                success: function (data, responce) {
                    // debugger;
                    for(var i=0;i<data.value.length;i++){
                        if(data.value[i].CR_NO === null || data.value[i].CR_NO === undefined || data.value[i].CR_NO === ""){
                            data.value[i].CR_NO = data.value[i].CR_NO;
                        }else{
                            data.value[i].CR_NO = data.value[i].CR_NO.toString();
                        } 
                    }
                    var cModel = new JSONModel(data);
                    cModel.setSizeLimit(1000);
                    context.getView().setModel(cModel,"crNoModel")
                    // that.onReadCRNO();

                    
                },
                error: function (e) {
                    BusyIndicator.hide();
                    var oXMLMsg, oXML;
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
        
        
        pressCreate : function(){
            // debugger;
            var searchValue = this.getView().byId("onSearchMasterData").getValue();
            if(searchValue !== "" || searchValue !== null || searchValue !== undefined){
                this.getView().byId("onSearchMasterData").setValue("")
            }
            this.getView().getModel("appView").setProperty("/layout", "OneColumn");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("CreateRequest");
        },
        onFilter: function (oEvent) {
            // this._oViewSettingsDialog = null;
            if (!this._oViewSettingsDialog){
                this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealclaimrequestcreation.view.fragment.filterDialog", this);
                this.getView().addDependent(this._oViewSettingsDialog);
            }

            if(this.getView().byId("onSearchMasterData").getValue() !== ""){
                this.getView().byId("onSearchMasterData").setValue(null);
            }

            
            this._oViewSettingsDialog.open();
            // this.getView().byId("filter").setType("Emphasized");
            // this.readUserMasterEntities([]);
            // that.handleValueEntityHelp();
            // this._oViewSettingsDialog = true;
        },
        onSort: function (oEvent) {
            if (!this._aDialog1) {
                this._aDialog1 = sap.ui.xmlfragment("com.ibs.ibsappidealclaimrequestcreation.view.fragment.sortDialog", this);
                this.getView().addDependent(this._aDialog1);
            }
            this._aDialog1.open();
            // this.getView().byId("sort").setType("Emphasized");
        },
        onPress: function (oEvent) {
            // debugger;
            var crNo = oEvent.getSource().getBindingContext("cModel").getProperty("CR_NO");
            this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("DetailPage", {
                CR_NO: crNo
            });
           
            // oRouter.navTo("DetailPage");
        },
        handleCancel: function (oEvent) {
            // this._onObjMatch();
            // var aFilterItems = oEvent.getParameters().filterItems;
            this._oViewSettingsDialog.clearFilters();
            this.onReset();
            var dateValue = sap.ui.getCore().byId("date_fId");
            
            if(aFilterItems.length === 0 && dateValue.getValue() === ""){
                this.getView().byId("filter").setType("Default");
            }
        },
        onReset : function(){
            // this._oViewSettingsDialog.clearFilters();
            var oTable = this.getView().byId("idProductsTable");
            var oBindings = oTable.getBinding("items");
            if(this._oViewSettingsDialog !== undefined){
                this._oViewSettingsDialog.clearFilters();
            }

            if(this._aDialog1 !== undefined){
                // this._aDialog1.clearFilters();
                oBindings.sort([]);
            }

            // if(){

            // }

            if(this.getView().byId("onSearchMasterData").getValue() !== ""){
                this.getView().byId("onSearchMasterData").setValue(null);
            }

            filters = undefined;
            temp = "reset";
            this.getView().byId("filter").setType("Default");
            this.getView().byId("sort").setType("Default");
            this.getView().byId("exportTable").setType("Default");
            this._onObjMatch();
        },
        onSearch : function(oEvent){
            // debugger;
            var sValue = oEvent.getParameter("newValue");
            // var oFilter = new Filter("REQ_ID", FilterOperator.EQ, sValue, false); 
            var oFilter=new sap.ui.model.Filter("CR_NO", sap.ui.model.FilterOperator.Contains, sValue, false);
            var bindings = this.byId("idProductsTable").getBinding("items");
            bindings.filter(oFilter);
        },
        handleConfirm: function (oEvent,sFilterReset) {
            // debugger;
            var oTable = this.byId("idProductsTable"),
                mParams = oEvent.getParameters(),
                oBinding = oTable.getBinding("items"),
                sPath,
                bDescending,
                aSorters = [];

            sPath = mParams.sortItem.getKey();
            bDescending = mParams.sortDescending;

            if(bDescending === false || sPath !== "CR_NO"){
                this.getView().byId("sort").setType("Emphasized");
            } else {
                this.getView().byId("sort").setType("Transparent");
            }

            aSorters.push(new Sorter(sPath, bDescending));
            oBinding.sort(aSorters);
        },
        onConfirmViewSettingsDialog: function (oEvent) {
            // debugger;
            aFilterItems = oEvent.getParameters().filterItems;
            var dateValue = sap.ui.getCore().byId("date_fId");
            filters = [];
            var sFinalString2 = "";
            var finalString;
            var sFinalString3;
            var concat;
            var string = [];
            var sFinalString = "(DISTRIBUTOR_ID eq '1100013')"
            
            // aFilterItems.forEach(function (oItem) {
            //     if (oItem.getKey() === "request") {
            //         for (var i = 0; i < aFilterItems.length; i++) {
            //             // debugger;
            //             if (aFilterItems.length === 1) {
            //                 var req = oItem.getText();
            //                 sFinalString2 = "(CR_NO eq " + req + ")";
            //                 finalString = "" + sFinalString2 + "";
            //             }else if (aFilterItems.length > 1) {
            //                 var req = oItem.getText();
            //                 concat = "(CR_NO eq " + req + ")";
            //                 if (sFinalString2.includes("or") == false) {
            //                     sFinalString2 = sFinalString2 + concat + " or ";
            //                     break;
            //                 }else{
            //                     sFinalString3 = sFinalString2 + concat;
            //                     req = "";
            //                     finalString = "" + sFinalString3 + "";
            //                 }
            //             }
            //         }
            //     }
            // });

            for(var i=0;i<aFilterItems.length;i++){
                if(aFilterItems[i].getKey() === "request"){
                    if(aFilterItems.length === 1){
                        var req = aFilterItems[i].getText();
                        sFinalString2 = "(CR_NO eq " + req + ")";
                        finalString = "" + sFinalString2 + "";
                    }else{
                        var req = aFilterItems[i].getText();
                        var concat = "(CR_NO eq " + req + ")";
                        string.push(concat)
                    }
                }
            }

            if(aFilterItems.length > 1){
                finalString = string.join(" or ");
            }
            
            // var sStatus = "((STATUS eq 1) or (STATUS eq 4))";
            // var sNextApprover = "(NEXT_APPROVER eq '" + that._sUserID + "')";

            if (finalString !== undefined) {
                this.getView().byId("filter").setType("Emphasized");
                filters = "(" + finalString + ")" + " and " + sFinalString;
                // aFilters =  + " and " + sFinalString;
            } else {
                this.getView().byId("filter").setType("Transparent");
                filters = sFinalString;
            }

            if (dateValue.getValue() && finalString === undefined) {
                var fDate = dateValue.getDateValue().toISOString();
                var tDate = dateValue.getSecondDateValue().toISOString();
                var gtDate = "(CREATED_ON gt " + fDate + ")";
                var ltDate = "(CREATED_ON lt " + tDate + ")";
                this.getView().byId("filter").setType("Emphasized");
                filters = "(" + gtDate + " and " + ltDate + ")" + " and " + sFinalString;
                sap.ui.getCore().byId("date_fId").setValue("");
            }else if (dateValue.getValue() && finalString !== undefined) {
                var fDate = dateValue.getDateValue().toISOString();
                var tDate = dateValue.getSecondDateValue().toISOString();
                var gtDate = "(CREATED_ON gt " + fDate + ")";
                var ltDate = "(CREATED_ON lt " + tDate + ")";
                this.getView().byId("filter").setType("Emphasized");
                filters = sFinalString + " and (" + gtDate + " and " + ltDate + ")";
                sap.ui.getCore().byId("date_fId").setValue("");
            }

            if(aFilterItems.length === 0 && dateValue.getValue() === ""){
                this.getView().byId("filter").setType("Default");
            }
            // var key = sSelectedKey;
            filterFlag = true;
            this.readUserMasterEntities(filters);

            // this._oViewSettingsDialog = null;
        },
        onExport: function () {
            // debugger;
            this.getView().byId("exportTable").setType("Emphasized");
            var currentDate = new Date();
            // var fName = newDate + ".xlsx";

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yy" });

            // Format the date
            var formattedDate = dateFormat.format(currentDate);
            var fName = "Claim Request" + " " + formattedDate + ".xlsx";

            var aCols, oRowBinding, oSettings, oSheet, oTable, oSheet;

            if (!this._oTable) {
                this._oTable = this.byId('idProductsTable');
            }

            oTable = this._oTable;
            oRowBinding = oTable.getBinding('items');
            aCols = this.createColumnConfig();

            oSettings = {
                workbook: {
                    columns: aCols,
                    hierarchyLevel: 'Level'
                },

                dataSource: oRowBinding,
                fileName: fName,
                worker: false
            };
            //  sap.ui.export.Spreadsheet---Directly libary used here
            oSheet = new sap.ui.export.Spreadsheet(oSettings);
            oSheet.build().
                finally(function () {
                    oSheet.destroy();
                });
        },
        createColumnConfig: function () {
            // debugger;
            var aCols = [];

            aCols.push({
                label:"Claim Request No",
                property: 'CR_NO'
            });
            
            aCols.push({
                label:"Claim Type",
                property: 'CLAIM_DESC'
            });

            aCols.push({
                label:"Claim From",
                property: 'CLAIM_FROM'
            });

            aCols.push({
                label:"Claim To",
                property: 'CLAIM_TO'
            });

            aCols.push({
                label:"Creation Date",
                property: 'CREATED_ON',
                type: EdmType.Date
            });

            aCols.push({
                label:"Status",
                property: 'TO_STATUS/DESC'
            });
            return aCols;
        }
    });
});
