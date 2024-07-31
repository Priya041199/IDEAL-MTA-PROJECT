sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "com/ibs/ibsappidealrgarequestcreation/model/formatter",
    "sap/ui/core/BusyIndicator",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox"
],
function (BaseController,JSONModel,Sorter,formatter,BusyIndicator,library,Spreadsheet,MessageBox) {
    "use strict";
    var context;
    var sKey;
    var filters;
    var temp;
    var filterFlag = false;
    var EdmType = library.EdmType;
    var aFilterItems;
    return BaseController.extend("com.ibs.ibsappidealrgarequestcreation.controller.MasterPage", {
        formatter: formatter,
        onInit: function () {
            context = this;
                var oMinDateModel = new JSONModel({
                    minDate: new Date()
                });
                this.getView().setModel(oMinDateModel, "minDateModel");

                this.getOwnerComponent().setModel(new JSONModel([]), "appView");
                this.getOwnerComponent().getModel("appView").setProperty("/selectedkey","(STATUS eq 1)")

                var oRouter = context.getOwnerComponent().getRouter().getRoute("RouteMasterPage")
                oRouter.attachPatternMatched(context._onObjMatch, context)
        },
        _onObjMatch : function(){
            // debugger;
            var sLoginId = '1100013';
            var flexiblelayout = this.getView().getParent().getParent()
            flexiblelayout.toBeginColumnPage(this.getView())
            // if(this._aDialog1 === "" || this._aDialog1 === undefined || this._aDialog1 === null){
            this._getUserAttributes();
            
            // }else{
                // var value = this._aDialog1.mProperties.sortDescending;
                // if(value === true){
                //     this.getView().byId("idProductsTable").setSort(true);
                // }else{
                //     this.getView().byId("idProductsTable").setSort(false);
                // }
            // }
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
                // // this.readUserMasterEntities(aFilters);
                // // this.onReadGRNO(aFilters);
                // this.onReadFilter();
                // }else{
                // // this.readUserMasterEntities(aFilters);
                // // this.onReadGRNO(aFilters);
                // this.onReadFilter();
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
                            context.onReadFilter();
                }else{
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
                var EntityFilters = aFilter ||   this.getOwnerComponent().getModel("appView").getProperty("/selectedkey") ;
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
                    this.onReadGRNO(loginId);
                }else{
                    this.readUserMasterEntities(loginId, sSelectedKey);
                    this.onReadGRNO(loginId);
                }
                }else{
                    if(Key === "Created"){
                        var status = "(STATUS eq 1)";
                        var newFilter = aFilter + " and " + status;
                        this.readUserMasterEntities(newFilter, sSelectedKey); 
                    }else if(Key === "InApproval"){
                        var status = "(STATUS eq 2)";
                        var newFilter = aFilter + " and " + status;
                        this.readUserMasterEntities(newFilter, sSelectedKey); 
                    }else if(Key === "Approved"){
                        var status = "(STATUS eq 3)";
                        var newFilter = aFilter + " and " + status;
                        this.readUserMasterEntities(newFilter, sSelectedKey);
                    }else if(Key === "Rejected"){
                        var status = "(STATUS eq 4)";
                        var newFilter = aFilter + " and " + status;
                        this.readUserMasterEntities(newFilter, sSelectedKey);
                    }else if(Key === "All"){
                        aFilter = loginId + " and " + EntityFilters;       
                        this.readUserMasterEntities(aFilter, sSelectedKey);
                    }
                }
            },
            readUserMasterEntities: function(aFilters,sSelectedKey) {
                // debugger
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var loginId = "(DISTRIBUTOR_ID eq '1100013')";
                // var no = "1100013";
                if(sSelectedKey===null || sSelectedKey==="All"){
                    if(filters === null || filters === undefined || filters === ""){
                        var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$expand=TO_STATUS,RGA_ITEMS_REF&$filter=" + loginId;
                    }else{
                        var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$expand=TO_STATUS,RGA_ITEMS_REF&$filter=" + aFilters;
                    }
                }else if(sSelectedKey !== "" && filters === undefined){
                    if(sSelectedKey === "Created"){
                        var status = "(STATUS eq 1)";
                        var newFilter = aFilters + " and " + status;
                    }else if(sSelectedKey === "InApproval"){
                        var status = "(STATUS eq 2)";
                        var newFilter = aFilters + " and " + status;
                    }else if(sSelectedKey === "Approved"){
                        var status = "(STATUS eq 3)";
                        var newFilter = aFilters + " and " + status;
                    }else if(sSelectedKey === "Rejected"){
                        var status = "(STATUS eq 4)";
                        var newFilter = aFilters + " and " + status;
                    }else if(sSelectedKey === "All"){
                        var newFilter = aFilters
                    }
                    var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$expand=TO_STATUS,RGA_ITEMS_REF&$filter=" + newFilter;
                }else{
                var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$expand=TO_STATUS,RGA_ITEMS_REF&$filter=" + aFilters;
                }

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        BusyIndicator.hide();
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
                                "All": data.value.length
                            }
                            for (var j = 0; j < data.value.length; j++) {
                                // data.value[j].STATUS = String(data.value[j].STATUS);
                                if (data.value[j].STATUS === 1) {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.Created = oObj.Created + 1
                                }
                                else if (data.value[j].STATUS === 2) {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.InApproval = oObj.InApproval + 1
                                }
                                else if (data.value[j].STATUS === 4) {
                                    oObj.Rejected = oObj.Rejected + 1
                                }
                                else if (data.value[j].STATUS === 3) {
                                    oObj.Approved = oObj.Approved + 1
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
                                    if(data.value[j].STATUS === 2){
                                        aIntialData.value.push(data.value[j]);
                                    }
                                }
                            }else if(keyData === "Rejected"){
                                for(var j=0;j<data.value.length;j++){
                                    if(data.value[j].STATUS === 4){
                                        aIntialData.value.push(data.value[j]);
                                    }
                                }
                            }else if(keyData === "Approved"){
                                for(var j=0;j<data.value.length;j++){
                                    if(data.value[j].STATUS === 3){
                                        aIntialData.value.push(data.value[j]);
                                    }
                                }
                            }else{
                                for(var j=0;j<data.value.length;j++){
                                        aIntialData.value.push(data.value[j]);
                                }
                                // aIntialData.value.push(data.value);
                            }

                            for(var i=0;i<data.value.length;i++){
                                if(data.value[i].CREATED_ON === null || data.value[i].CREATED_ON === undefined || data.value[i].CREATED_ON === ""){
                                    data.value[i].CREATED_ON = data.value[i].CREATED_ON;
                                }else{
                                    var DateInstance = new Date(data.value[i].CREATED_ON);
                                    var date = sap.ui.core.format.DateFormat.getDateInstance({
                                    pattern: "dd.MM.yyyy" });
                                    data.value[i].CREATED_ON = date.format(DateInstance);;
                                } 
                            }

                            var oModel = new JSONModel(aIntialData);
                            context.getView().setModel(oModel,"rModel");
                        }else if(sSelectedKey === null && temp === "reset"){
                            temp ="";
                            var keyData = "Created";
                            var oObj = {
                                "Created": 0,
                                "InApproval": 0,
                                "Rejected": 0,
                                "Approved": 0,
                                "All": data.value.length
                            }
                            for (var j = 0; j < data.value.length; j++) {
                                // data.value[j].STATUS = String(data.value[j].STATUS);
                                if (data.value[j].STATUS === 1) {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.Created = oObj.Created + 1
                                }
                                else if (data.value[j].STATUS === 2) {
                                    // aIntialData.value.push(data.value[j]);
                                    oObj.InApproval = oObj.InApproval + 1
                                }
                                else if (data.value[j].STATUS === 4) {
                                    oObj.Rejected = oObj.Rejected + 1
                                }
                                else if (data.value[j].STATUS === 3) {
                                    oObj.Approved = oObj.Approved + 1
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
                                    if(data.value[j].STATUS === 2){
                                        // aIntialData.value.push(data.value[j]);
                                    }
                                }
                            }else if(keyData === "Rejected"){
                                for(var j=0;j<data.value.length;j++){
                                    if(data.value[j].STATUS === 4){
                                        // aIntialData.value.push(data.value[j]);
                                    }
                                }
                            }else if(keyData === "Approved"){
                                for(var j=0;j<data.value.length;j++){
                                    if(data.value[j].STATUS === 3){
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
                                if(data.value[i].RGA_NO === null || data.value[i].RGA_NO === undefined || data.value[i].RGA_NO === ""){
                                    data.value[i].RGA_NO = data.value[i].RGA_NO;
                                }else{
                                    data.value[i].RGA_NO = data.value[i].RGA_NO.toString();
                                } 
                            }

                            for(var i=0;i<data.value.length;i++){
                                if(data.value[i].CREATED_ON === null || data.value[i].CREATED_ON === undefined || data.value[i].CREATED_ON === ""){
                                    data.value[i].CREATED_ON = data.value[i].CREATED_ON;
                                }else{
                                    var DateInstance = new Date(data.value[i].CREATED_ON);
                                    var date = sap.ui.core.format.DateFormat.getDateInstance({
                                    pattern: "dd.MM.yyyy" });
                                    data.value[i].CREATED_ON = date.format(DateInstance);;
                                } 
                            }
                            
                            var oModel = new JSONModel(aIntialData);
                            context.getView().setModel(oModel,"rModel");

                            context.getView().byId("idIconTabBar").setSelectedKey("Created");
                        }else 
                        if(sSelectedKey === "" || sSelectedKey === null || sSelectedKey === undefined){
                            for(var i=0;i<data.value.length;i++){
                                if(data.value[i].RGA_NO === null || data.value[i].RGA_NO === undefined || data.value[i].RGA_NO === ""){
                                    data.value[i].RGA_NO = data.value[i].RGA_NO;
                                }else{
                                    data.value[i].RGA_NO = data.value[i].RGA_NO.toString();
                                } 
                            }
                        var oObj = {
                            "Created": 0,
                            "InApproval": 0,
                            "Rejected": 0,
                            "Approved": 0,
                            "All": data.value.length
                        }
                        for (var j = 0; j < data.value.length; j++) {
                            // data.value[j].STATUS = String(data.value[j].STATUS);
                            if (data.value[j].STATUS === 1) {
                                aIntialData.value.push(data.value[j]);
                                oObj.Created = oObj.Created + 1
                            }else if (data.value[j].STATUS === 2) {
                                // aIntialData.value.push(data.value[j]);
                                oObj.InApproval = oObj.InApproval + 1
                            }else if (data.value[j].STATUS === 4) {
                                oObj.Rejected = oObj.Rejected + 1
                            }
                            else if (data.value[j].STATUS === 3) {
                                oObj.Approved = oObj.Approved + 1
                            }
                        }

                        var oModel = new JSONModel(oObj);
                        context.getView().setModel(oModel, "countModel");

                        for(var i=0;i<data.value.length;i++){
                            if(data.value[i].CREATED_ON === null || data.value[i].CREATED_ON === undefined || data.value[i].CREATED_ON === ""){
                                data.value[i].CREATED_ON = data.value[i].CREATED_ON;
                            }else{
                                var DateInstance = new Date(data.value[i].CREATED_ON);
                                var date = sap.ui.core.format.DateFormat.getDateInstance({
                                pattern: "dd.MM.yyyy" });
                                data.value[i].CREATED_ON = date.format(DateInstance);;
                            } 
                        }

                        var oModel = new JSONModel(aIntialData);
                        context.getView().setModel(oModel,"rModel");
                        }
                        else{
                            for(var i=0;i<data.value.length;i++){
                                if(data.value[i].RGA_NO === null || data.value[i].RGA_NO === undefined || data.value[i].RGA_NO === ""){
                                    data.value[i].RGA_NO = data.value[i].RGA_NO;
                                }else{
                                    data.value[i].RGA_NO = data.value[i].RGA_NO.toString();
                                } 
                            }

                            for(var i=0;i<data.value.length;i++){
                                if(data.value[i].CREATED_ON === null || data.value[i].CREATED_ON === undefined || data.value[i].CREATED_ON === ""){
                                    data.value[i].CREATED_ON = data.value[i].CREATED_ON;
                                }else{
                                    var DateInstance = new Date(data.value[i].CREATED_ON);
                                    var date = sap.ui.core.format.DateFormat.getDateInstance({
                                    pattern: "dd.MM.yyyy" });
                                    data.value[i].CREATED_ON = date.format(DateInstance);;
                                } 
                            }

                            var oModel = new JSONModel(data);
                            context.getView().setModel(oModel,"rModel");

                            context.getView().getModel("countModel").setProperty("/" + sSelectedKey, data.value.length);
                        }
                        
                    },
                    error: function (e) {
                        BusyIndicator.hide(0);

            // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
            },
            onFilterSelect: function (oEvent) {
                // 
                // debugger;
                var oBinding = this.byId("idProductsTable").getBinding("items"),
                    sKey,
                    model=this.getOwnerComponent().getModel("appView"),

                    // Array to combine filters
                    aFilter ;
                if(oEvent === null || oEvent === undefined || oEvent === ""){
                    sKey = "Created";
                    // model.setProperty("/selectedkey",sKey)
                }else{
                    sKey = oEvent.getParameter("key");
                    // model.setProperty("/selectedkey",sKey)
                }

                var searchValue = this.getView().byId("onSearchMasterData").getValue();
            if(searchValue !== "" || searchValue !== null || searchValue !== undefined){
                this.getView().byId("onSearchMasterData").setValue("")
            }

                // if (sKey == "Invited") {
                //     aFilters.push(
                //         new Filter([new Filter("STATUS", "EQ", 2)])
                //     )    
                // }
                if(filters){
                    this.onReadFilter(filters,sKey);
               }else
                if (sKey == "Created") {
                    aFilter = "(STATUS eq 1)";
                    this.onReadFilter(aFilter);
                }
                else if (sKey == "InApproval") {
                     aFilter = "(STATUS eq 2)";
                    this.onReadFilter(aFilter);
                }
                else if (sKey == "Rejected") {
                     aFilter = "(STATUS eq 4)";
                    this.onReadFilter(aFilter);
                }
                else if (sKey == "Approved") {
                     aFilter = "(STATUS eq 3)";
                    this.onReadFilter(aFilter);
                }
                else if (sKey == "All") {
                    this.onReadFilter(aFilter);
                }
                model.setProperty("/selectedkey",aFilter)

            },
            onReadGRNO : function(aFilter){
                // var crno = this.getView().getModel("cModel").getData();

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                // var no = "1100013";
              
                var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$filter=" + aFilter;

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        for(var i=0;i<data.value.length;i++){
                            if(data.value[i].RGA_NO === null || data.value[i].RGA_NO === undefined || data.value[i].RGA_NO === ""){
                                data.value[i].RGA_NO = data.value[i].RGA_NO;
                            }else{
                                data.value[i].RGA_NO = data.value[i].RGA_NO.toString();
                            } 
                        }
                        var cModel = new JSONModel(data);
                        context.getView().setModel(cModel,"grNoModel")
                        // that.onReadCRNO();
                    },
                    error: function (e) {
                        BusyIndicator.hide(0);

            // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
            },
            onSort: function (oEvent) {
                if (!this._aDialog1) {
                    this._aDialog1 = sap.ui.xmlfragment("com.ibs.ibsappidealrgarequestcreation.view.fragments.sortDialog", this);
                    context.getView().addDependent(this._aDialog1);
                }
                this._aDialog1.open();
                // this.getView().byId("sort").setType("Emphasized");
            },
            onFilter: function (oEvent) {
                var that = this;
                // if (that.filterdialog === true) {
                //     that._oViewSettingsDialog.clearFilters();
                // }
                // that._handleCounrtySet();
                if (!this._oViewSettingsDialog) {
                    this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealrgarequestcreation.view.fragments.filterDialog", this);
                    this.getView().addDependent(this._oViewSettingsDialog);
                }
                
                if(this.getView().byId("onSearchMasterData").getValue() !== ""){
                    this.getView().byId("onSearchMasterData").setValue(null);
                }

                this._oViewSettingsDialog.open();
                // this.getView().byId("filter").setType("Emphasized");
                // that.filterdialog = true;
            },
            onPress: function (oEvent) {
                // debugger;
                var rgaNo = oEvent.getSource().getBindingContext("rModel").getProperty("RGA_NO");
                if(this.getView().byId("onSearchMasterData").getValue() !== ""){
                    this.getView().byId("onSearchMasterData").setValue(null);
                }
                this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("DetailPage", {
                    RGA_NO: rgaNo
                });  
            },
            pressCreate : function(){
                debugger;
                this.getView().getModel("appView").setProperty("/layout", "OneColumn");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CreateRequest");
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

                if(bDescending === false || sPath !== "RGA_NO"){
                    this.getView().byId("sort").setType("Emphasized");
                } else {
                    this.getView().byId("sort").setType("Transparent");
                }

                aSorters.push(new Sorter(sPath, bDescending));
                oBinding.sort(aSorters);


            },
            onReset : function(){
                if(this._oViewSettingsDialog !== undefined){
                    this._oViewSettingsDialog.clearFilters();
                }
                
                if(this._aDialog1 !== undefined){
                    this._aDialog1.clearFilters();
                }

                if(this.getView().byId("onSearchMasterData").getValue() !== ""){
                    this.getView().byId("onSearchMasterData").setValue(null);
                }
                filters = undefined;
                temp = "reset";
                this.getView().byId("filter").setType("Default");
                this.getView().byId("sort").setType("Default");
                this._onObjMatch();
            },
            onConfirmViewSettingsDialog: function (oEvent) {
                // debugger;
                BusyIndicator.show();
                aFilterItems = oEvent.getParameters().filterItems;
                var dateValue = sap.ui.getCore().byId("date_fId");
            
                

                var aFilters = [];
                var sFinalString2 = "";
                var finalString;
                var string = [];
                var sFinalString = "(DISTRIBUTOR_ID eq '1100013')"
                
                // aFilterItems.forEach(function (oItem) {
                //     if (oItem.getKey() === "request") {
                //         for (var i = 0; i < aFilterItems.length; i++) {
                //             // debugger;
                //             if (aFilterItems.length === 1) {
                //                 var req = oItem.getText();
                //                 sFinalString2 = "(RGA_NO eq " + req + ")";
                //                 finalString = "" + sFinalString2 + "";
                //             }
                //             else if (aFilterItems.length > 1) {
                //                 var req = oItem.getText();
                //                 var concat = "(RGA_NO eq " + req + ")";
                //                 if (sFinalString2.includes("or") == false) {
                //                     sFinalString2 = sFinalString2 + concat + " or ";
                //                     break;
                //                 }
                //                 else {
                //                     var sFinalString3 = sFinalString2 + concat;
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
                            sFinalString2 = "(RGA_NO eq " + req + ")";
                            finalString = "" + sFinalString2 + "";
                        }else{
                            var req = aFilterItems[i].getText();
                            var concat = "(RGA_NO eq " + req + ")";
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
                    this.getView().byId("filter").setType("Transparent");
                }
                filterFlag = true;
                this.readUserMasterEntities(filters);
            },
            onCancelFilter : function(){
                this._oViewSettingsDialog.clearFilters();
                this.onReset();
                var dateValue = sap.ui.getCore().byId("date_fId");
                
                if(aFilterItems.length === 0 && dateValue.getValue() === ""){
                    this.getView().byId("filter").setType("Default");
                }
            },
            onSearch : function(oEvent){
                // debugger;
                var sValue = oEvent.getParameter("newValue");
                // var oFilter = new Filter("REQ_ID", FilterOperator.EQ, sValue, false); 
                var oFilter=new sap.ui.model.Filter("RGA_NO", sap.ui.model.FilterOperator.Contains, sValue, false);
                var bindings = this.byId("idProductsTable").getBinding("items");
                bindings.filter(oFilter);
            },
            onExport: function () {
                // debugger;
                this.getView().byId("exportTable").setType("Emphasized");
                var currentDate = new Date();
                // var fName = newDate + ".xlsx";

                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yy" });

                // Format the date
                var formattedDate = dateFormat.format(currentDate);
                var fName = "RGA Request" + " " + formattedDate + ".xlsx";

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
                    label:"RGA Request No",
                    property: 'RGA_NO'
                });
                
                aCols.push({
                    label:"RGA Type",
                    property: 'DISTRIBUTOR_REASON'
                });

                aCols.push({
                    label:"Created On",
                    property: 'CREATED_ON'
                });

                aCols.push({
                    label:"Status",
                    property: 'TO_STATUS/DESC'
                });
                return aCols;
            }
    });
});
