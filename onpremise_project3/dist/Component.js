sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","com/ibspl/onpremiseproject3/model/models"],function(e,i,t){"use strict";return e.extend("com.ibspl.onpremiseproject3.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device")}})});
//# sourceMappingURL=Component.js.map