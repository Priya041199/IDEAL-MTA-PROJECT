// sap.ui.define(
//     [
//         "sap/ui/core/mvc/Controller"
//     ],
//     function(BaseController) {
//       "use strict";
  
//       return BaseController.extend("com.ibs.ibsappidealusermaster.controller.App", {
//         onInit: function() {
//         }
//       });
//     }
//   );


sap.ui.define(
  [
      "sap/ui/core/mvc/Controller"
  ],
  function(BaseController) {
    "use strict";
    var appModulePath;
    return BaseController.extend("com.ibs.ibsappidealusermaster.controller.App", {
      onInit: function() {
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
      
        var that = this;

        var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterIdealUsers";
        $.ajax({
          url: url,
          type: 'GET',
          contentType: 'application/json',
          success: function (data, response) {
            // ;
              that.getRouter().navTo("MasterPage");
          },
          error: function (oError) {
            // ;
            that.getRouter().navTo("ServiceMsg");
          }
        });
      }
    });
  }
);

  