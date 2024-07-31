sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/ui/core/routing/History",
        "sap/ui/core/BusyIndicator"
    ],
    function(BaseController, JSONModel, MessageToast, Filter, FilterOperator, MessageBox, History, BusyIndicator) {
      "use strict";
      var context = null;
    var viewModel = null;
    var oRouter = null;
    var that = null;
    var appModulePath;
      return BaseController.extend("com.ibs.ibsappidealregistrationform.controller.App", {
        onInit: function() {
          context = this;
          that = this;
          viewModel = new JSONModel();
          oRouter = context.getOwnerComponent().getRouter();
  
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          appModulePath = jQuery.sap.getModulePath(appPath);
  
          this.oCloudSrvModel = context.getOwnerComponent().getModel("cloudService");
  
          var getRoute = oRouter.getRoute("Routeapp");
          getRoute.attachPatternMatched(context._onObjectMatched, this);
        },
        getRouter: function () {
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
        _onObjectMatched: function (oEvent) {
          
          var that = this;
          var oCloud = true;
          var oPremise = true;
          var url = appModulePath + "/odata/v4/ideal-additional-process-srv/checkServiceAvailability(cloudSrv=" + oCloud + ",onPremiseSrv=" + oPremise + ")";
         
          $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            success: function (data, response) {
              if(oCloud === true && oPremise === true && data.value[0].cloudSrv !== null && data.value[0].onPremiseSrv !== null) {
                that.getRouter().navTo("RouteLoginPage");
              }
              else if(oCloud === true && oPremise === false && data.value[0].cloudSrv !== null) {
                that.getRouter().navTo("RouteLoginPage");
              }
              else if(oCloud === false && oPremise === true && data.value[0].onPremiseSrv !== null) {
                that.getRouter().navTo("RouteLoginPage");
              }
              else {
                that.getRouter().navTo("ServiceMsg");
              }
            },
            error: function (oError) {
              that.getRouter().navTo("ServiceMsg");
            }
          });
  
        // this.getRouter().navTo("RouteLoginPage");
        }  
      });
    }
  );
  