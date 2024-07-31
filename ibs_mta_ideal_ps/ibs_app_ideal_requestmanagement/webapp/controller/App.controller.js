sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
      var that = null;
    var appModulePath;
      return BaseController.extend("com.ibs.ibsappidealrequestmanagement.controller.App", {
        onInit: function() {
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
          // 
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
  
        handleRouteMatched: function (oEvent) {
          
          
            var that = this;
            var oCloud = true;
            var oPremise = true;
            var url = appModulePath + "/odata/v4/ideal-additional-process-srv/checkServiceAvailability(cloudSrv=" + oCloud + ",onPremiseSrv=" + oPremise + ")";
           
            $.ajax({
              url: url,
              type: 'GET',
              contentType: 'application/json',
              success: function (data, response) {
                if(oCloud === true && oPremise === true && data.value[0].cloudSrv !== null) {
                  that.getRouter().navTo("MasterPage");
                }
                else if(oCloud === true && oPremise === false && data.value[0].cloudSrv !== null) {
                  that.getRouter().navTo("MasterPage");
                }
                else if(oCloud === false && oPremise === true) {
                  that.getRouter().navTo("MasterPage");
                }
                else {
                  that.getRouter().navTo("ServicePg");
                }
              },
              error: function (oError) {
                that.getRouter().navTo("ServicePg");
              }
            });
    
          //this.getRouter().navTo("RouteLoginPage");
          
  
          // var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo";
          // $.ajax({
          //   url: url,
          //   type: 'GET',
          //   contentType: 'application/json',
          //   success: function (data, response) {
          //     // 
          //     if(data.value[0].Cloud !== null){
          //       if (that.reqNo === "") {
          //         that.getRouter().navTo("MasterPage");
          //       } else {
          //         that.getRouter().navTo("MasterPage", {
          //           REQNO: that.reqNo
          //         });
          //       }
          //     }
          //     else { 
          //      that.getRouter().navTo("ServicePg");
          //     }
          //   },
          //   error: function (oError) {
          //     // debugger
          //     that.getRouter().navTo("ServicePg");
          //   }
          // });
        }
      });
    }
  );
  