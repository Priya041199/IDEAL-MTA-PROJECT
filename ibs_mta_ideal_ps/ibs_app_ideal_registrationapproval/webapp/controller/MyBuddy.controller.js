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
        var oView, oModel, oRouter;
        var salesModel;
        var financeModel;
        var serviceModel;
        var logisticsModel; 
        var distData; 
        return BaseController.extend("com.ibs.ibsappidealregistrationapproval.controller.MyBuddy", {
            formatter: formatter,
            onInit: function () {
                // ;
            context = this;
			that = this;
			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);
			oView = context.getView();
			oModel = context.getOwnerComponent().getModel();
			context.oDataModel = context.getOwnerComponent().getModel("onPremiseModel");
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("MyBuddy").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (oEvent) {
                // ;
                BusyIndicator.hide();
                this._getUserAttributes();
            },
            _getUserAttributes: function () {
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var attr = appModulePath + "/user-api/attributes";

                // that._sUserID = "darshan.l@intellectbizware.com";
                // that._sUserName = "Darshan Lad";
                // var oModel = new JSONModel({
                //     userId: that._sUserID,
                //     userName: that._sUserName
                // });
                // this.getOwnerComponent().setModel(oModel, "userModel");
                // distData = this.getOwnerComponent().getModel("myBuddyDetail").getData();

                // this._readSalesData(distData.ENTITY_CODE);
                // this._readFinanceData(distData.ENTITY_CODE);
                // this._readServiceData(distData.ENTITY_CODE);
                // this._readLogisticsData(distData.ENTITY_CODE);

                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: attr,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (data, response) {
                            var obj = {
                                userId: data.email.toLowerCase(),
                                userName: data.firstname + " " + data.lastname
                            }
                            var oModel = new JSONModel(obj);
                            that.getOwnerComponent().setModel(oModel, "userModel");
                            that._sUserID = data.email.toLowerCase();

                            distData = that.getOwnerComponent().getModel("myBuddyDetail").getData();

                            that._readSalesData(distData.ENTITY_CODE);
                            that._readFinanceData(distData.ENTITY_CODE);
                            that._readServiceData(distData.ENTITY_CODE);
                            that._readLogisticsData(distData.ENTITY_CODE);
                        },
                        error: function (oError) {
                            MessageBox.error("Error while reading User Attributes");
                        }
                    });
                });
            },
            _readSalesData: function (aFilter) {
                BusyIndicator.show();
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterSales?$filter=(ENTITY_CODE eq '" + aFilter + "')";
                this.postAjax(url, "GET", "sales");
            },
            _readFinanceData: function (aFilter) {
                BusyIndicator.show();
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterFinance?$filter=(ENTITY_CODE eq '" + aFilter + "')";
                this.postAjax(url, "GET", "finance");
            },
            _readServiceData: function (aFilter) {
                BusyIndicator.show();
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterService?$filter=(ENTITY_CODE eq '" + aFilter + "')";
                this.postAjax(url, "GET", "service");
            },
            _readLogisticsData: function (aFilter) {
                BusyIndicator.show();
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterLogistics?$filter=(ENTITY_CODE eq '" + aFilter + "')";
                this.postAjax(url, "GET", "logistics");
            },
            postAjax: function (url, type, model) {
                debugger;
                var arr = [];
                $.ajax({
                    url: url,
                    type: type,
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
                        debugger;
                        BusyIndicator.hide();
                        if (model === "sales") {
                           salesModel = new JSONModel(data);
                           that.getView().setModel(salesModel , "salesModel")
                        }else if (model === "finance") {
                            financeModel = new JSONModel(data);
                            that.getView().setModel(financeModel , "financeModel")
                        }else if (model === "service") {
                            serviceModel = new JSONModel(data);
                            that.getView().setModel(serviceModel , "serviceModel")
                        }else if (model === "logistics") {
                            logisticsModel = new JSONModel(data);
                            that.getView().setModel(logisticsModel , "logisticsModel")
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
            onBack : function(){
                debugger;

                if(salesModel !== undefined){
                    salesModel.setData(null);
                }

                if(financeModel !== undefined){
                    financeModel.setData(null);
                }

                if(serviceModel !== undefined){
                    serviceModel.setData(null);
                }

                if(logisticsModel !== undefined){
                    logisticsModel.setData(null);
                }

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.navTo("RouteDetailPage", {
                    RequestNO : distData.REG_NO
                });
            }
            // readUserMasterData: function (userEmail) {
            //     var that = this;
            //     var entityCodeArr = [];
            //     var oEntityCode;
            //     var userDetailModel = new JSONModel();
            //     var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
            //     var data = { $expand: 'TO_USER_ENTITIES' };

            //     $.ajax({
            //         url: url,
            //         type: "GET",
            //         contentType: 'application/json',
            //         data: data,
            //         success: function (data, response) {
            //             if (data.value.length === 0) {
            //                 MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
            //             }
            //             else {
            //                 oEntityCode = data.value[0].TO_USER_ENTITIES;

            //                 if (oEntityCode.length > 0) {
            //                     for (var i = 0; i < oEntityCode.length; i++) {
            //                         entityCodeArr.push("ENTITY_CODE eq '" + oEntityCode[i].ENTITY_CODE + "'");
            //                     }
            //                 }
            //                 else {
            //                     MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
            //                 }

            //                 userDetailModel.setData(data.value[0]);
            //                 that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");

            //                 that._readData();
            //             }
            //         },
            //         error: function (error) {
            //             var oXML, oXMLMsg;
            //             if (context.isValidJsonString(error.responseText)) {
            //                 oXML = JSON.parse(error.responseText);
            //                 oXMLMsg = oXML.error["message"];
            //             } else {
            //                 oXMLMsg = error.responseText
            //             }
            //             MessageBox.error(oXMLMsg);
            //         }
            //     });
            // }
        });
    });

