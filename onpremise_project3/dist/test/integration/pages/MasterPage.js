sap.ui.define(["sap/ui/test/Opa5"],function(e){"use strict";var i="MasterPage";e.createPageObjects({onTheViewPage:{actions:{},assertions:{iShouldSeeThePageView:function(){return this.waitFor({id:"page",viewName:i,success:function(){e.assert.ok(true,"The "+i+" view is displayed")},errorMessage:"Did not find the "+i+" view"})}}}})});
//# sourceMappingURL=MasterPage.js.map