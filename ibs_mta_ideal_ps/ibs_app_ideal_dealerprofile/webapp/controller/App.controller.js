sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController,JSONModel) {
      "use strict";
      var appModulePath;
      var that;
      return BaseController.extend("com.ibs.ibsappidealdealerprofile.controller.App", {
        onInit: function() {
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
      var appPath = appId.replaceAll(".", "/");
      appModulePath = jQuery.sap.getModulePath(appPath);

      // var oRouter = this.getOwnerComponent().getRouter().getRoute("RouteApp");
      // oRouter.attachPatternMatched(this.handleRouteMatched, this);
      this.handleRouteMatched();
        },
        getRouter: function () {
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
  
        handleRouteMatched: function (oEvent) {
          // debugger;
          that = this;
          var oCloud = true;
          var oPremise = false;
          var url = appModulePath + "/odata/v4/ideal-additional-process-srv/checkServiceAvailability(cloudSrv=true,onPremiseSrv=true)";
          $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            success: function (data, response) {
              if(oCloud === true && oPremise === true && data.value[0].cloudSrv !== null && data.value[0].onPremiseSrv !== null) {
                // that.getRouter().navTo("RouteMasterPage");
                that.getUserAttribute();
              }
              else if(oCloud === true && oPremise === false && data.value[0].cloudSrv !== null) {
                // that.getRouter().navTo("RouteMasterPage");
                that.getUserAttribute();
              }
              else if(oCloud === false && oPremise === true && data.value[0].onPremiseSrv !== null) {
                // that.getRouter().navTo("RouteMasterPage");
                that.getUserAttribute();
              }
              else {
                that.getRouter().navTo("ServiceMsg");
              }
            },
            error: function (oError) {
              that.getRouter().navTo("ServiceMsg");
            }
          });
        },
        getUserAttribute : function(){
          // debugger;
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          appModulePath = jQuery.sap.getModulePath(appPath);
          var attr = appModulePath + "/user-api/attributes";
         
          // that._sUserID = "testdist2@gmail.com";
          // that._sUserName = "TEST DIST 2";
        //   that._sUserID = "darshan.l@intellectbizware.com";
        //   that._sUserName = "Darshan Lad";
        // var oModel = new JSONModel({
        // 	userId: that._sUserID,
        // 	userName: that._sUserName
        // });
        // this.getOwnerComponent().setModel(oModel, "userModel");
        // this.readUserMasterData(that._sUserID);
  
          return new Promise(function (resolve, reject) {
                    $.ajax({
                      url: attr,
                      type: 'GET',
                      contentType: 'application/json',
                      success: function (data, response) {
                var obj={
                userId : data.email.toLowerCase(),
                        userName : data.firstname + " " + data.lastname
                }
                var oModel = new JSONModel(obj);
                that.getOwnerComponent().setModel(oModel, "userModel");
                that._sUserID = data.email.toLowerCase();
                that.readUserMasterData(that._sUserID);
                      },
                      error: function (oError) {
                        MessageBox.error("Error while reading User Attributes");
                      }
                    });
                  });
        },
        readUserMasterData : function(aFilters){
          // debugger;
          var userDetailModel = new JSONModel();
        var url = appModulePath + "/odata/v4/ideal-additional-process-srv/MasterIdealUsers?$filter=(EMAIL eq '" + aFilters + "') and (ACTIVE eq 'X')";
        
          $.ajax({
                      url: url,
                      type: "GET",
                      contentType: 'application/json',
                      data: null,
                      success: function (data, response) {
              if(data.value.length === 0){
                // MessageBox.error("You are not an authorized user to take action.");
  
                userDetailModel.setData(that._sUserID);
                that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");
                that._readData();
              }
              else{
              userDetailModel.setData(data.value[0]);
              that.getOwnerComponent().setModel(userDetailModel, "userDetailsModel");
              that._readData(that._sUserID);
              }
            },
                      error: function (error) {
                          // BusyIndicator.hide();
              var oXML,oXMLMsg;
              if (context.isValidJsonString(error.responseText)) {
                oXML = JSON.parse(error.responseText);
                oXMLMsg = oXML.error["message"];
              } else {
                oXMLMsg = error.responseText
              }
                          MessageBox.error(oXMLMsg);
                          // MessageBox.error(e.responseText);
                      }
                  });
        },
        _readData : function(oFilter,oFilterOn,oFilter2){
          // debugger;
          var id = "testdist2@gmail.com";
          if (oFilter === undefined) {
            var url = appModulePath + "/odata/v4/ideal-additional-process-srv/ViewRequestActiveStatus?$filter=ACTIVE eq 'A' and STATUS eq 11 and REGISTERED_ID eq '"+ that._sUserID + "'";
          }else{
            var url = appModulePath + "/odata/v4/ideal-additional-process-srv/ViewRequestActiveStatus?$filter=ACTIVE eq 'A' and STATUS eq 11";
          }
          var data = null;
          // this.postAjax(url, "GET"\, data, "onBoarding",oFilterOn);
  
          $.ajax({
            url: url,
            type: "GET",
            contentType: 'application/json',
            // data: data,
            success: function (data, response) {
                // BusyIndicator.hide();
                var oModel = new JSONModel(data.value[0]);
                that.getOwnerComponent().setModel(oModel, "vendorDetail");
  
                if(data.value.length === 1){
                  that.getRouter().navTo("RouteDetailPage", {
                    SAPVENDORNO : data.value[0].SAP_DIST_CODE
                   });
                }else{
                  that.getRouter().navTo("RouteMasterPage"); 
                }
            },
            error: function (error) {
                // BusyIndicator.hide();
                // that.getRouter().navTo("RouteMasterPage");
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
        }
      });
    }
  );
  