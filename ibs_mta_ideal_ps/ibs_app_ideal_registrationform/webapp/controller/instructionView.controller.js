sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/BusyIndicator",
      "sap/ui/model/json/JSONModel",
      "sap/m/MessageToast",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/m/MessageBox",
      "sap/ui/core/routing/History"
    ],
    function (BaseController, BusyIndicator, JSONModel, MessageToast, Filter, FilterOperator, MessageBox, History) {
      "use strict";
      var oRouter = null;
      var loginData, that;
      var appModulePath;
      var context;
  
      return BaseController.extend("com.ibs.ibsappidealregistrationform..controller.instructionView", {
        onInit: function () {
  
          BusyIndicator.hide();
          context = this;
          that = this;
          // viewModel = new JSONModel();
          oRouter = context.getOwnerComponent().getRouter();
  
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          appModulePath = jQuery.sap.getModulePath(appPath);
  
          // this.oCloudSrvModel = context.getOwnerComponent().getModel("cloudService");
  
          var getRoute = oRouter.getRoute("instructionView");
          getRoute.attachPatternMatched(context._onObjectMatched, this);
        },
  
        // getRouter: function () {
        //   return sap.ui.core.UIComponent.getRouterFor(this);
        // },
  
        _onObjectMatched: function (oEvent) {
          
          loginData = this.getOwnerComponent().getModel("loginData").getData();
  
          this.readDraft(loginData.REQUEST_NO, loginData.ENTITY_CODE, loginData.CREATION_TYPE);
        },
  
        readDraft: function (VregNo, Ventity, V_CreateType) {
          
          BusyIndicator.show();
          var userAttributes = this.getOwnerComponent().getModel("userAttriJson").getData();
          var UserId = userAttributes.userId;
          //var path = appModulePath + "/odata/v4/registration-process/GetDraftData(requestNo=" + VregNo + ",entityCode='" + Ventity + "',creationType=" + V_CreateType + ",userId='" +UserId +"',userRole='VENDOR')";
  
          var obj = JSON.stringify({
            "requestNo": VregNo,
            "entityCode": Ventity,
            "creationType": V_CreateType,
            "userId": UserId,
            "userRole": "CM",
            // "draftData":false,
            // "visibility":false,
            // "mandatory":false,
            // "updated":false,
            // "openText":false,
            // "clientInfo":true,
            // "totalCount":false,
            // "settings":false,
            // "labels":false
            // requestNo=100000048,entityCode='T-TC',creationType=1,userId='aniket.s@intellectbizware.com',userRole='CM'
          });
          var path = appModulePath + "/odata/v4/ideal-registration-form-srv/GetDraftData(requestNo=" + VregNo + ",entityCode='" + Ventity + "',creationType=" + V_CreateType + ",userId='" + UserId + "',userRole='CM')";
  
          that = this;
          $.ajax({
            url: path,
            type: 'GET',
            contentType: 'application/json',
            success: function (oData, response) {
              
              var data = oData;
              var loginJsonData = new JSONModel();
              loginJsonData.setData(data.value[0].CLIENT_INFO);
              that.getView().setModel(loginJsonData, "loginJsonData");
              BusyIndicator.hide();
  
            },
            error: function (error) {
              
              BusyIndicator.hide();
              var oXMLMsg, oXML;
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
        handleNext: function () {
          var oRouter = this.getOwnerComponent().getRouter();
          BusyIndicator.show(0);
          oRouter.navTo("vendorForm", true)
        }
      });
    }
  );