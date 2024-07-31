sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
      var that = null;
      var appModulePath;
      return BaseController.extend("com.ibs.ibsappidealrequestapproval.controller.App", {
        onInit: function() {
          // debugger;
        that = this;
        this.reqNo = document.URL.split("MasterPage/")[1];
        if (this.reqNo === undefined) {
          this.reqNo = "";
        }
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        appModulePath = jQuery.sap.getModulePath(appPath);

        var oRouter = this.getOwnerComponent().getRouter().getRoute("RouteApp");
        oRouter.attachPatternMatched(this.handleRouteMatched, this);
        },
        getRouter: function () {
          // debugger;
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
  
        handleRouteMatched: function (oEvent) {
          // debugger;
          var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo";
          $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            success: function (data, response) {
              // debugger;
              if(data.value[0].Cloud !== null && data.value[0].onPremise !== null){
                if (that.reqNo === "") {
                  that.getRouter().navTo("MasterPage");
                } else {
                  that.getRouter().navTo("MasterPage", {
                    REQNO: that.reqNo
                  });
                }
              }
              else { 
               that.getRouter().navTo("ServiceMsg");
              }
            },
            error: function (oError) {
              // debugger
              that.getRouter().navTo("ServiceMsg");
            }
          });
        }
  });
});
  