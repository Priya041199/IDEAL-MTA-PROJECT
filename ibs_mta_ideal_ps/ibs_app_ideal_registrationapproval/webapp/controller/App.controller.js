sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
      var that = null;
      var appModulePath;
      return BaseController.extend("com.ibs.ibsappidealregistrationapproval.controller.App", {
        onInit: function() {
          that = this;
          this.reqNo = document.URL.split("RouteMasterPage/")[1];
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
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
        handleRouteMatched: function (oEvent) {
          var oCloud = true;
          var oPremise = false;

          var url = appModulePath + "/odata/v4/ideal-additional-process-srv/checkServiceAvailability(cloudSrv=" + oCloud + ",onPremiseSrv=" + oPremise + ")";
          $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            success: function (data, response) {
              // debugger;
              // if(data.value[0].Cloud !== null && data.value[0].onPremise !== null){
              //   // that.getRouter().navTo("RouteMasterPage");
              //   if (that.reqNo === "") {
              //     that.getRouter().navTo("RouteMasterPage");
              //   } else {
              //     that.getRouter().navTo("RouteMasterPage", {
              //       REQNO: that.reqNo
              //     });
              //   }
              // }
              // else {
              //   that.getRouter().navTo("ServiceMsg");
              // }
                  if(oCloud === true && oPremise === true && data.value[0].cloudSrv !== null && data.value[0].onPremiseSrv !== null) {
                    that.getRouter().navTo("RouteMasterPage");
                  }
                  else if(oCloud === true && oPremise === false && data.value[0].cloudSrv !== null) {
                    that.getRouter().navTo("RouteMasterPage");
                  }
                  else if(oCloud === false && oPremise === true && data.value[0].onPremiseSrv !== null) {
                    that.getRouter().navTo("RouteMasterPage");
                  }
                  else {
                    that.getRouter().navTo("ServiceMsg");
                  }
            },
            error: function (oError) {
              // debugger;
              that.getRouter().navTo("RouteMasterPage");
            }
          });

          
        }
      });
    }
  );
  