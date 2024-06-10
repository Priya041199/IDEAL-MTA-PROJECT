sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.ibspl.onpremiseproject1.controller.MasterPage", {
        onInit: function () {

        },
        onNavigate : function(){
            var param = {};
            var oSemantic = "OnPremise_Fiori";
            var hash = {};
            hash = "#ZIBS_ONPREMISE_DEMO-release";
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                // var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                // target: {
                // semanticObject: oSemantic,
                // action: "display"
                // }
                // ,
                // params: param
                // })) || ""; // generate the Hash to display a Supplier
   
             
                    oCrossAppNavigator.toExternal({
                        target: {
                        shellHash: hash
                        }
                        });
        }
    });
});
