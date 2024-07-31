sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
    "com/ibs/ibsappidealerrorlog/model/formatter"
],
function (Controller,JSONModel,BusyIndicator,MessageBox,exportLibrary, Spreadsheet,formatter) {
    "use strict";
    var appModulePath;
    var context,that;
    var EdmType = exportLibrary.EdmType;
    return Controller.extend("com.ibs.ibsappidealerrorlog.controller.MasterPage", {
        formatter: formatter,
        onInit: function () {
            context = this;
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            appModulePath = jQuery.sap.getModulePath(appPath);
            this.getUserAttributes();
        },
        getUserAttributes:function(){
            that = this;

            var attr = appModulePath + "/user-api/attributes";

            // var url = appModulePath + "/ideal-admin-panel-srv/IdealErrorLog";
            // that.postAjax(url, "GET", null, "ErrorLog", null);
            // that.readFormErrorlog();

            // this._sUserID = "darshan.l@intellectbizware.com";
            // this._sUserName = "Darshan Lad";
            // var obj = {
            //     userId: "darshan.l@intellectbizware.com",
            //     userName: "Darshan Lad"
            // }
            // var oModel = new JSONModel(obj);
            // this.getOwnerComponent().setModel(oModel, "userModel");
            // this.readFormErrorlog();

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: attr,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data, response) {
                        // debugger
                        var obj = {
                            userId: data.email.toLowerCase(),
                            userName: data.firstname + " " + data.lastname
                        }
                        var oModel = new JSONModel(obj);
                        that.getOwnerComponent().setModel(oModel, "userModel");
                        
                        // var url = appModulePath + "/ideal-admin-panel-srv/IdealErrorLog";
                        // that.postAjax(url, "GET", null, "ErrorLog", null);
                        that.readFormErrorlog();
                    },
                    error: function (oError) {
                        // debugger
                        MessageBox.error("Error while reading User Attributes");
                    }
                });
            });
        },

        postAjax: function (url, type, data, sModelName, oFilter) {
            // jQuery.sap.delayedCall(100, this, function () {
                BusyIndicator.show();
            // });
            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: data,
                success: function (data, response) {
                    // debugger
                    BusyIndicator.hide();
                    var oModel = new JSONModel(data);

                    for(var i=0;i<data.value.length;i++){
                        data.value[i].CREATED_ON = new Date(data.value[i].CREATED_ON);
                    }
                    for(var i=0;i<data.value.length;i++){
                        if(data.value[i].REQUEST_NO === null || data.value[i].REQUEST_NO === undefined || data.value[i].REQUEST_NO === ""){
                            data.value[i].REQUEST_NO = data.value[i].REQUEST_NO;
                        }else{
                            data.value[i].REQUEST_NO = data.value[i].REQUEST_NO.toString();
                        } 
                    }
                    context.getView().setModel(oModel, sModelName);
                    // }
                    context.getView().byId("iderrorhead").setText("Total (" + data.value.length + ")")
                },
                error: function (error) {
                    // debugger
                    BusyIndicator.hide();
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

        onDatePickerChange: function (oEvent) {
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
            var oTable = this.getView().byId("idErrorlog");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];
            var dateValue = context.DateRange;
            if (dateValue) {
                var fDate = dateValue.sFrom.toISOString();
                var tDate = dateValue.sTo.toISOString();
                var gtDate = "CREATED_ON ge " + fDate;
                var ltDate = "CREATED_ON le " + tDate;
                aFilters = gtDate + " and " + ltDate;
               
            }
            
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/IdealErrorLog?$filter="+aFilters;
            this.postAjax(url, "GET", null, "ErrorLog", aFilters);
        },

        handleRefreshlog: function () {
            // debugger
            context.getView().byId("DP1").setValue(null);
            context.readFormErrorlog();
            this.getView().byId("idErrorSrchFld").setValue("");
        },
        readFormErrorlog: function () {
            var url = appModulePath + "/odata/v4/ideal-admin-panel-srv/IdealErrorLog";
            this.postAjax(url, "GET", null, "ErrorLog", null);
        },

        onFilErrorTable: function () {
            // debugger;
            var sValue = this.getView().byId("idErrorSrchFld").getValue();
            var intValue = Number(this.getView().byId("idErrorSrchFld").getValue());
            var oTable = this.getView().byId("idErrorlog");
            var filters = new sap.ui.model.Filter([
                new sap.ui.model.Filter("LOG_ID", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("REQUEST_NO", sap.ui.model.FilterOperator.Contains, sValue),
                new sap.ui.model.Filter("ERROR_CODE", sap.ui.model.FilterOperator.EQ, sValue),
                new sap.ui.model.Filter("APP_NAME", sap.ui.model.FilterOperator.Contains, sValue)
            ],false); // false for OR
            oTable.getBinding("items").filter(filters);
            // var tblLen = oTable.getItems().length;
            // this.getView().byId("iderrorhead").setText("Items (" + tblLen + ")");
        },

        createColumnConfig: function() {
            
            var aCols = [];

            aCols.push({
                label: 'Log ID',
                property: 'LOG_ID',
                type: EdmType.String
            });

            aCols.push({
                label: 'Request Number',
                property: 'REQUEST_NO',
                type: EdmType.Int,
                width:26
            });

            aCols.push({
                label: 'SR Number',
                property: 'SR_NO',
                type: EdmType.Int,
                width:26
            });


            aCols.push({
                label: 'Error Code',
                property: 'ERROR_CODE',
                type: EdmType.Int
            });

            aCols.push({
                label: 'Error Description',
                property: 'ERROR_DESCRPTION',
                type: EdmType.String,
                width:30
            });

            aCols.push({
                label: 'User ID',
                property: 'USER_ID',
                type: EdmType.String,
                width:24,
                textAlign:"left"
            });

            aCols.push({
                label: 'Created On',
                property: 'CREATED_ON',
                type: EdmType.DateTime,
                width:32
            });

            aCols.push({
                label: 'App Name',
                property: 'APP_NAME',
                type: EdmType.String,
                width:25
            });

            aCols.push({
                label: 'Type',
                property: 'TYPE',
                type: EdmType.String,
                width:25
            });

            return aCols;
        },

        onExport: function() {
            var aCols, oRowBinding, oSettings, oSheet, oTable;

            if (!this._oTable) {
                this._oTable = this.byId('idErrorlog');
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
                fileName: 'Error Log Report.xlsx',
                worker: false // We need to disable worker because we are using a MockServer as OData Service
            };

            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function() {
                oSheet.destroy();
            });
        }
    });
});
