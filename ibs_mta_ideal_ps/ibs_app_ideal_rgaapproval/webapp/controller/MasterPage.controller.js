sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
    "com/ibs/ibsappidealrgaapproval/model/formatter"
],
function (BaseController,JSONModel,MessageBox,Sorter,formatter) {
    "use strict";
    var that;
    var sFinalString;
    var flag;
    var aFilterItems;
    return BaseController.extend("com.ibs.ibsappidealrgaapproval.controller.MasterPage", {
        formatter: formatter,
        onInit: function () {
            that=this;
                var oMinDateModel = new JSONModel({
                    minDate: new Date()
                });
                this.getView().setModel(oMinDateModel, "minDateModel");
                var oRouter = that.getOwnerComponent().getRouter().getRoute("RouteMasterPage")
                oRouter.attachPatternMatched(that._onObjMatch, that)
        },
        _onObjMatch : function(){
            // debugger;
        var aFilter;
        var cr;
        // that.urlCrNo = oEvent.getParameter("arguments").CR_NO;
        // if (that.urlCrNo === undefined) {
        // 	aFilter = "";
        // }
        // else{
        // 	cr = that.urlCrNo;
        // 	aFilter = "(CR_NO eq " + cr + ")";
        // 	that.checkValidCRNo(aFilter);
        // }

        if(this._aDialog1 === "" || this._aDialog1 === undefined || this._aDialog1 === null){
            that._getUserAttributes();
        }else{
                // var value = this._aDialog1.mProperties.sortDescending;
                // if(value === true){
                //     this.getView().byId("idProductsTable").setSort(true);
                // }else{
                //     this.getView().byId("idProductsTable").setSort(false);
                // }
        }
        },
        checkValidCRNo: function (aFilter) {
            // debugger;
            var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$expand=TO_STATUS,RGA_ITEMS_REF&$filter=" + aFilter;

            BusyIndicator.show();

            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                // data: { $expand: 'TO_STATUS,TO_ENTITY_CODE' },
                success: function (data) {
                    // debugger;
                    BusyIndicator.hide();
                    if (data.value.length === 0 || (data.value[0].STATUS !== 1 && data.value[0].STATUS !== 15)) {
                        that.getRouter().navTo("notFound", {
                            CR_NO: that.urlCrNo
                        });
                    }
                    if(that._oViewSettingsDialog){
                        that._oViewSettingsDialog.clearFilters();
                    }
                    
                },
                error: function (e) {
                    // debugger;
                    BusyIndicator.hide();
                    // MessageBox.warning("Error while reading VendorInvite data");
                    that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                    var oXMLMsg, oXML;
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
        _getUserAttributes: function () {
            // debugger;
            var aFilters = "(DISTRIBUTOR_ID eq '1100013')"
                
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var attr = appModulePath + "/user-api/attributes";

            // that._sUserID = "darshan.l@intellectbizware.com";
            // that._sUserName = "Darshan Lad";
            // var obj = {
            //     userId: "darshan.l@intellectbizware.com",
            //     userName: "Darshan Lad"
            // }
            // that._sUserID = "priya.g@intellectbizware.com";
            // that._sUserName = "Priya gawde";
            // var obj = {
            //     userId: "priya.g@intellectbizware.com",
            //     userName: "Priya gawde"
            // }

            // var oModel = new JSONModel(obj);
            // that.getOwnerComponent().setModel(oModel, "userModel");
            // that.readUserMasterEntities();
            // this.readUserMasterEntities();
            
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: attr,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, response) {
                        // debugger;
                        that._sUserID = data.email.toLowerCase().trim();
                        that._sUserName = data.firstname + " " + data.lastname;
                        // that.readMasterIdealUser();
                        var obj = {
                            userId: data.email.toLowerCase(),
                            userName: data.firstname + " " + data.lastname
                        }
                        var oModel = new JSONModel(obj);
                        that.getOwnerComponent().setModel(oModel, "userModel");

                        that.readUserMasterEntities();
                    },
                    error: function (oError) {
                        // debugger;
                        MessageBox.error("Error while reading User Attributes");
                    }
                });
            });
        },
        readUserMasterEntities: async function () {
            // debugger
            var hierarchyLevel = await that.calView();
            var entityCode = await that.calViewEntity();
            var aEntityArray = [];
            var sREG;
            if (aFilter === undefined || aFilter === null || aFilter === "") {
                aFilter = [];
            }
            else {
                that.sFilter = aFilter;
            }

            if(entityCode.length === 0){
                MessageBox.error("No claims are assigned for " + that._sUserID + ". Contact admin team.");
            }else{ 
                if (that.urlCrNo !== undefined) {
                    sREG = "(RGA_NO eq " + that.urlCrNo + ")";
                } else {
                    sREG = "";
                }
                sFinalString = "";
                        for (var i = 0; i < entityCode.length; i++) {
                            if (i < entityCode.length - 1) {
                                var concat = "(APPROVER_LEVEL eq " + hierarchyLevel[i] + ")";
                                sFinalString = sFinalString + concat + " or ";
                            }
                            else {
                                var concat = "(APPROVER_LEVEL eq " + hierarchyLevel[i] +")";
                                sFinalString = sFinalString + concat;
                            }
                        }

                        that.EntityFilters = aFilter
                        sFinalString = "(" + sFinalString + ")";
                        var sLoginId = "(DISTRIBUTOR_ID eq '1100013')"
                        var sStatus = "((STATUS eq 1) or (STATUS eq 2))";
                        if(sREG === ""){
                            var aFilter = sFinalString + " and " + sStatus + " and " + sLoginId;
                        }else{
                            var aFilter = sREG + " and " + sFinalString + " and " + sStatus + " and " + sLoginId;
                        }
                        that.readEntityData(aFilter);
                        that.onReadRGNO(aFilter);
            }
        },
        calView : function(){
            var userEmail = that._sUserID;
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'RG'"
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
                        var mLevel = data.value.map((x)=>{if(x.USER_IDS.includes(that._sUserID)){return x.LEVEL}});
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
                        BusyIndicator.hide();
                        var oXML,oXMLMsg;
                        // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'RG'"
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
                        BusyIndicator.hide();
                        var oXML,oXMLMsg;
                        // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                        if (that.isValidJsonString(error.responseText)) {
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
    readEntityData : function(aFilter){
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        // var no = "1100013";
      
        var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$expand=TO_STATUS,RGA_ITEMS_REF&$filter=" + aFilter;

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
                var oModel = new JSONModel(data);
                that.getView().setModel(oModel,"rModel");
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
    onReadRGNO : function(aFilter){
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
                that.getView().setModel(cModel,"grNoModel")
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
    onPress: function (oEvent) {
        // debugger;
        var rgNo = oEvent.getSource().getBindingContext("rModel").getProperty("RGA_NO");
        if(this.getView().byId("onSearchMasterData").getValue() !== ""){
            this.getView().byId("onSearchMasterData").setValue(null);
        }
        this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("DetailPage", {
            RGA_NO: rgNo,
            FLAG : true
        });
        
        // oRouter.navTo("DetailPage");
    },
    onSort: function (oEvent) {
        if (!this._aDialog1) {
            this._aDialog1 = sap.ui.xmlfragment("com.ibs.ibsappidealrgaapproval.view.fragments.sortDialog", this);
            that.getView().addDependent(this._aDialog1);
        }
        this._aDialog1.open();
        // this.getView().byId("sort").setType("Emphasized");
    },
    handleConfirm: function (oEvent,sFilterReset) {
        // debugger;
        var oTable = this.byId("idClaimTable"),
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
    onFilter: function (oEvent) {
        var that = this;
        // if (that.filterdialog === true) {
        //     that._oViewSettingsDialog.clearFilters();
        // }
        // that._handleCounrtySet();
        if (!this._oViewSettingsDialog) {
            this._oViewSettingsDialog = sap.ui.xmlfragment("com.ibs.ibsappidealrgaapproval.view.fragments.filterDialog", this);
            this.getView().addDependent(this._oViewSettingsDialog);
        }
        this._oViewSettingsDialog.open();
        // this.getView().byId("filter").setType("Emphasized");
        // that._oViewSettingsDialog = true;
    },
    onConfirmViewSettingsDialog: function (oEvent) {
        // debugger;
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
        //                 sFinalString2 = "(CR_NO eq " + req + ")";
        //                 finalString = "" + sFinalString2 + "";
        //             }
        //             else if (aFilterItems.length > 1) {
        //                 var req = oItem.getText();
        //                 var concat = "(CR_NO eq " + req + ")";

        //                 // if (sFinalString2.includes("or") == false) {
        //                 //     sFinalString2 = sFinalString2 + concat + " or ";
        //                 //     break;
        //                 // }else{
        //                 //     var sFinalString3 = sFinalString2 + concat;
        //                 //     req = "";
        //                 //     finalString = "" + sFinalString3 + "";
        //                 // }
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
        
        var sStatus = "((STATUS eq 1) or (STATUS eq 2))";
        // var sNextApprover = "(NEXT_APPROVER eq '" + that._sUserID + "')";

        if (finalString !== undefined) {
            this.getView().byId("filter").setType("Emphasized");
            flag = true;
            // aFilters = "(" + finalString + ")" + " and " + sStatus + " and " + sFinalString;
            aFilters = "(" + finalString + ")" + " and " + sStatus + " and " + sFinalString;
        } else {
            this.getView().byId("filter").setType("Transparent");
            flag = false
            aFilters = sStatus + " and " + sFinalString;
        }

        if (dateValue.getValue() && finalString === undefined) {
            var fDate = dateValue.getDateValue().toISOString();
            var tDate = dateValue.getSecondDateValue().toISOString();
            var gtDate = "(CREATED_ON gt " + fDate + ")";
            var ltDate = "(CREATED_ON lt " + tDate + ")";
            this.getView().byId("filter").setType("Emphasized");
            flag = true;
            aFilters = "(" + gtDate + " and " + ltDate + ")" + " and " + sStatus + " and " + sFinalString;
            sap.ui.getCore().byId("date_fId").setValue("");
        }else if (dateValue.getValue() && finalString !== undefined) {
            var fDate = dateValue.getDateValue().toISOString();
            var tDate = dateValue.getSecondDateValue().toISOString();
            var gtDate = "(CREATED_ON gt " + fDate + ")";
            var ltDate = "(CREATED_ON lt " + tDate + ")";
            this.getView().byId("filter").setType("Emphasized");
            flag = true;
            aFilters = aFilters + " and (" + gtDate + " and " + ltDate + ")";
            sap.ui.getCore().byId("date_fId").setValue("");
        }

        if(aFilterItems.length === 0 && dateValue.getValue() === ""){
            this.getView().byId("filter").setType("Default");
        }
        
        that.readEntityData(aFilters);
        
        // this._oViewSettingsDialog.destroy();
        // this._oViewSettingsDialog = null;
    },
    onResetFilter: function () {
        // debugger;
        // that.getView().getModel("appView").setProperty("/layout", "OneColumn");
        // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // that.getRouter().navTo("RouteMaster");
        // oRouter.navTo("RouteMaster");
        // that.readEntitiesOnReset();

      
        that.readUserMasterEntities();
        that.getView().byId("onSearchMasterData").setValue();
        that.getView().byId("filter").setType("Default");
        that.getView().byId("sort").setType("Default");

        if(that._oViewSettingsDialog !== undefined){
            that._oViewSettingsDialog.clearFilters();
        }
        

        
        // if (that.filter === true) {
        //     that.filter = false;
        //     this._oViewSettingsDialog.clearFilters();
        // }
    },
    readEntitiesOnReset: async function (aFilter) {

        var hierarchyLevel = await that.calView();
        var entityCode = await that.calViewEntity();
        var aEntityArray = [];
        var sREG;
        if (aFilter === undefined || aFilter === null || aFilter === "") {
            aFilter = [];
        }else {
            that.sFilter = aFilter;
        }
        if(entityCode.length === 0){
            MessageBox.error("No claims are assigned for " + that._sUserID + ". Contact admin team.");
        }else{ 
            if (that.urlReqNo !== undefined) {
                sREG = "(REQUEST_NO eq " + that.urlReqNo + ")";
            }
            else {
                sREG = "";
            }
            sFinalString = "";
                    for (var i = 0; i < entityCode.length; i++) {
                        if (i < entityCode.length - 1) {
                            var concat = "(APPROVER_LEVEL eq " + hierarchyLevel[i] + ")";
                            sFinalString = sFinalString + concat + " or ";
                        }
                        else {
                            var concat = "(APPROVER_LEVEL eq " + hierarchyLevel[i] +")";
                            sFinalString = sFinalString + concat;
                        }
                    }

                    that.EntityFilters = aFilter
                    sFinalString = "(" + sFinalString + ")";
                    var sLoginId = "(DISTRIBUTOR_ID eq '1100013')"
                    var sStatus = "((STATUS eq 1) or (STATUS eq 4))";
                    if(sREG === ""){
                        var aFilter = sFinalString + " and " + sStatus + " and " + sLoginId;
                    }else{
                        var aFilter = sREG + " and " + sFinalString + " and " + sStatus + " and " + sLoginId;
                    }
                    

                    that.readEntityData(aFilter);
                }
    },
    onSearch : function(oEvent){
        // debugger;
        var sValue = oEvent.getParameter("newValue");
        // var oFilter = new Filter("REQ_ID", FilterOperator.EQ, sValue, false); 
        var oFilter=new sap.ui.model.Filter("RGA_NO", sap.ui.model.FilterOperator.Contains, sValue, false);
        var bindings = this.byId("idClaimTable").getBinding("items");
        bindings.filter(oFilter);
    }, 
    onCancelFilter : function(oEvent){
        // debugger;
        // if(flag === true){
        //     // that._oViewSettingsDialog.clearFilters();
        //     // this.readUserMasterEntities();
        //     this.getView().byId("filter").setType("Emphasized");
        // }else{
        //     this.getView().byId("filter").setType("Transparent");
        // }

        this._oViewSettingsDialog.clearFilters();
        this.readUserMasterEntities();
        var dateValue = sap.ui.getCore().byId("date_fId");
            
        if(aFilterItems.length === 0 && dateValue.getValue() === ""){
            this.getView().byId("filter").setType("Transparent");
        }else{
            this.getView().byId("filter").setType("Transparent");
        }
    }   
    });
});
