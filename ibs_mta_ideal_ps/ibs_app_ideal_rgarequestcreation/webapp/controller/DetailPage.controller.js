sap.ui.define(
    [
      "./BaseController",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/BusyIndicator",
      "com/ibs/ibsappidealrgarequestcreation/model/formatter",
      "sap/m/MessageBox"
    ],
    function(BaseController,JSONModel,BusyIndicator,formatter,MessageBox) {
      "use strict";
      var that;
      var myJSONModel12;
      return BaseController.extend("com.ibs.ibsappidealrgarequestcreation.controller.DetailPage", {
        formatter: formatter,
        onInit: function() {
          // debugger;
          that = this;
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.getRoute("DetailPage").attachPatternMatched(that.objectRouteMatched, that)
        },
        objectRouteMatched : function(oEvent){
          // debugger;
          BusyIndicator.show();
          var RGA_NO = Number(oEvent.getParameters().arguments.RGA_NO);
          this.onMainContent(true);
          var iWindowWidth = window.innerWidth;
          if (iWindowWidth < 600) {
            this.getView().byId("idMTable").setVisible(true);
            this.getView().byId("invoiceTableId").setVisible(false);
          } else {
            this.getView().byId("invoiceTableId").setVisible(true);
            this.getView().byId("idMTable").setVisible(false);
          }
          that.readData(RGA_NO);
          that._readTimelineData(RGA_NO);
          // that.readAttachments(RGA_NO)
        },
        _readTimelineData: function (rgNo) {
          // debugger;
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          var appModulePath = jQuery.sap.getModulePath(appPath);
          myJSONModel12 = new JSONModel();
          var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Event_Logs?$filter=RGA_NO eq " + rgNo;
  
          $.ajax({
              url: url,
              type: "GET",
              contentType: 'application/json',
              data: null,
              success: function (data, response) {
                  // debugger;
                  BusyIndicator.hide();
                  // that.getView().byId("DynamicSideContent").setShowSideContent(true);
                  // context.handleEvents();
  
                  for (var i = 0; i < data.value.length; i++) {
                      data.value[i].CREATED_ON = new Date(data.value[i].CREATED_ON);
                  }

                  for (var i = 0; i < data.value.length; i++) {
                    data.value[i].LANE_ID = i;
                    if(i === 0){
                      data.value[i].NODE_ID = 1;
                      var val = 1 + "0";
                      data.value[i].CHILDREN = [Number(val)];
                    }else{
                      var val = i + "0";
                      data.value[i].NODE_ID = Number(val);
                      var j = i + 1;
                      var child = j + "0";
                      data.value[i].CHILDREN = [Number(child)];
                    }

                    if(i === data.value.length-1){
                      data.value[i].CHILDREN = null;
                    }
                }

                  var oModel = new JSONModel(data.value);
                  myJSONModel12.setData(data.value);
                  that.getView().setModel(oModel, "comm");
  
                  // that.onSideContent("REGAPPR_EVENT");
                  that.getView().byId("processflow1").setWheelZoomable(true);
              },
              error: function (error) {
                BusyIndicator.hide(0);

                // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                var oXMLMsg, oXML;
                if (that.isValidJsonString(e.responseText)) {
                    oXML = JSON.parse(e.responseText);
                    oXMLMsg = oXML.error.message.value;
                } else {
                    oXMLMsg = error.responseText
                }
                MessageBox.error(oXMLMsg);
              }
          });
      },
      onZoomIn: function () {
        this.getView().byId("processflow1").zoomIn();
  
        // MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
      },
      onZoomOut: function () {
        this.getView().byId("processflow1").zoomOut();
  
        // MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
      },
        handleEvents: function () {
          var dynamicSideContentState = this.getView().byId("DynamicSideContent").getShowSideContent();
          var iWindowWidth = window.innerWidth;
          if (dynamicSideContentState === true) {
              this.getView().byId("DynamicSideContent").setShowSideContent(false);
          }
          else {
              this.getView().byId("DynamicSideContent").setShowSideContent(true);
              if(iWindowWidth < 600){
                this.onMainContent(false);
            }
          }
          // this.getView().byId("DynamicSideContent").setShowSideContent(true);
      },
      onMainContent:function(sValue){
        this.getView().byId("DynamicSideContent").setShowMainContent(sValue);
    },
      handleSideContentHide: function () {
        this.getView().byId("DynamicSideContent").setShowSideContent(false);
        this.onMainContent(true);
    },
        readData : function(sLoginId){
          // debugger;
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$filter=RGA_NO eq "+ sLoginId +"&$expand=TO_STATUS,RGA_ITEMS_REF";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        BusyIndicator.hide();
                        if(data.value[0].STATUS === 3){
                          that.getView().byId("sapno").setVisible(true);
                        }else{
                          that.getView().byId("sapno").setVisible(false);
                        }
                        var oModel = new JSONModel(data.value[0]);
                        that.getView().setModel(oModel,"cModel");

                        that.getView().byId("invoiceTableId").setVisibleRowCount(data.value[0].RGA_ITEMS_REF.length);
                    },
                    error: function (e) {
                      BusyIndicator.hide(0);

                      // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                      var oXMLMsg, oXML;
                      if (that.isValidJsonString(e.responseText)) {
                          oXML = JSON.parse(e.responseText);
                          oXMLMsg = oXML.error.message.value;
                      } else {
                          oXMLMsg = error.responseText
                      }
                      MessageBox.error(oXMLMsg);
                    }
                });
        },
        // readAttachments : function(crNo){
        //   var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        //   var appPath = appId.replaceAll(".", "/");
        //   var appModulePath = jQuery.sap.getModulePath(appPath);
        //   var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimAttachments?$filter=CR_NO eq "+ crNo;

        //   $.ajax({
        //       url: url,
        //       type: 'GET',
        //       data: null,
        //       contentType: 'application/json',
        //       success: function (data, responce) {
        //           debugger;
        //           var oModel = new JSONModel(data.value);
        //           that.getView().setModel(oModel,"aModel");

        //           // that.getView().byId("priceDifferentTable").setVisibleRowCount(data.value[0].length);
        //       },
        //       error: function (e) {
        //           debugger
        //           MessageBox.error("error");
        //       }
        //   });
        // },
        onExit : function(oEvent){
          // debugger;
          that.getView().getModel("appView").setProperty("/layout", "OneColumn");
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.navTo("RouteMasterPage");
        },
        onFullScreen:function(){

          if(this.getView().getModel("appView").getProperty("/layout") == "TwoColumnsMidExpanded"){
              this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
              this.getView().getModel("appView").setProperty("/icon", "sap-icon://exit-full-screen");
          }else{
              this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
              this.getView().getModel("appView").setProperty("/icon", "sap-icon://full-screen");
          }
          
      },
      });
    });
  