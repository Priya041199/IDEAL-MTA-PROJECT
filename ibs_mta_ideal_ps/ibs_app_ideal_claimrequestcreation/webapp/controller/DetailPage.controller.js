sap.ui.define(
    [
      "./BaseController",
      "sap/ui/model/json/JSONModel",
      "com/ibs/ibsappidealclaimrequestcreation/model/formatter",
      "com/ibs/ibsappidealclaimrequestcreation/model/down",
      "sap/ui/core/BusyIndicator",
      "sap/m/MessageBox" 
    ],
    function(BaseController,JSONModel,formatter,down,BusyIndicator,MessageBox) {
      "use strict";
      var that;
      var myJSONModel12;
      var crNo;
      return BaseController.extend("com.ibs.ibsappidealclaimrequestcreation.controller.DetailPage", {
        formatter: formatter,
        onInit: function() {
          // debugger;
          BusyIndicator.show();
          that = this;
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.getRoute("DetailPage").attachPatternMatched(that.objectRouteMatched, that)
        },
        objectRouteMatched : function(oEvent){
          // debugger;
          BusyIndicator.show();
          crNo = Number(oEvent.getParameters().arguments.CR_NO);
          this.onMainContent(true);
          var iWindowWidth = window.innerWidth;
          if (iWindowWidth < 600) {
              this.getView().byId("idMTable").setVisible(true);
              this.getView().byId("invoiceTableId").setVisible(false);
          }
          else {
              this.getView().byId("invoiceTableId").setVisible(true);
              this.getView().byId("idMTable").setVisible(false);
          }
          that.readData(crNo);
          that.readAttachments(crNo);
          that._readTimelineData(crNo);
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
      _readTimelineData: function (crNo) {
        // debugger;
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        myJSONModel12 = new JSONModel();
        var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimEventLog?$filter=CR_NO eq " + crNo;

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
                
                that.getView().byId("processflow1").setWheelZoomable(true);
                // that.onSideContent("REGAPPR_EVENT");

            },
            error: function (error) {
                // debugger;
                BusyIndicator.hide();
                var oXML,oXMLMsg;
                // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                if (that.isValidJsonString(error.responseText)) {
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
    onZoomIn: function () {
			this.getView().byId("processflow1").zoomIn();

			// MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
		},
    onZoomOut: function () {
			this.getView().byId("processflow1").zoomOut();

			// MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
		},
        readData : function(sLoginId){
          // debugger;
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimHeader?$filter=CR_NO eq "+ sLoginId +"&$expand=TO_STATUS,TO_ITEMS";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                      BusyIndicator.hide();
                        if(data.value[0].STATUS === 2){
                          that.getView().byId("sapId").setVisible(true);
                        }else{
                          that.getView().byId("sapId").setVisible(false);
                        }
                        var oModel = new JSONModel(data.value[0]);
                        that.getView().setModel(oModel,"cModel");

                        that.getView().byId("invoiceTableId").setVisibleRowCount(data.value[0].TO_ITEMS.length);
                    },
                    error: function (e) {
                      BusyIndicator.hide();
                      var oXMLMsg, oXML;
                      // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                      if (that.isValidJsonString(e.responseText)) {
                        oXML = JSON.parse(e.responseText);
                        oXMLMsg = oXML.error["message"];
                      } else {
                        oXMLMsg = e.responseText;
                      }
                      MessageBox.error(oXMLMsg);
                    }
                });
        },
        readAttachments : function(crNo){
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          var appModulePath = jQuery.sap.getModulePath(appPath);
          var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimAttachments?$filter=CR_NO eq "+ crNo;

          $.ajax({
              url: url,
              type: 'GET',
              data: null,
              contentType: 'application/json',
              success: function (data, responce) {
                  // debugger;
                  var oModel = new JSONModel(data.value);
                  that.getView().setModel(oModel,"aModel");

                  // that.getView().byId("priceDifferentTable").setVisibleRowCount(data.value[0].length);
              },
              error: function (e) {
                BusyIndicator.hide();
                var oXMLMsg, oXML;
                // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                if (that.isValidJsonString(e.responseText)) {
                  oXML = JSON.parse(e.responseText);
                  oXMLMsg = oXML.error["message"];
                } else {
                  oXMLMsg = e.responseText;
                }
                MessageBox.error(oXMLMsg);
              }
          });
        },
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
      onDownload : function(){
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        var iDocId = crNo;

			// var path = appModulePath + "/odata/v4/ideal-registration-form-srv/RegFormCMS?$filter=" + iDocId;

			var path = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimAttachments("+ iDocId +")/$value";

			$.ajax({
				url: path,
				type: 'GET',
				contentType: 'application/json',
				success: function (data, responce) {
					that.fileType(iDocId, data);
					// context.downloadFileContent('text/plain', 1,'CLAIM REQUEST PAYLOAD.txt', 'text/plain', data);
					
				},
				error: function (error) {
					BusyIndicator.hide();
					var oXMLMsg, oXML;
          // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
					if (that.isValidJsonString(error.responseText)) {
						oXML = JSON.parse(error.responseText);
						oXMLMsg = oXML.error["message"];
					} else {
						oXMLMsg = error.responseText;
					}
					MessageBox.error(oXMLMsg);
				}
			});
    },
    fileType : function(iDocId, data){
        // debugger;
        var iDocId = "(CR_NO eq " + iDocId + ")";
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        var path = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimAttachments?$filter=" + iDocId;
        var FILE_CONTENT = data;
        $.ajax({
            url: path,
            type: 'GET',
            contentType: 'application/json',
            success: function (data, responce) {
                // debugger;
                if (data.value.length > 0) {
                    that.downloadFileContent(data.value[0].FILE_TYPE || null, data.value[0].SR_NO || null, data.value[0].FILE_NAME, data.value[0].FILE_MIMETYPE, FILE_CONTENT);
                } else {
                    MessageBox.error("Attachments are empty.");
                }
            },
            error: function (error) {
                // debugger;
                BusyIndicator.hide();
                var oXMLMsg, oXML;
                // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                if (that.isValidJsonString(error.responseText)) {
                    oXML = JSON.parse(error.responseText);
                    oXMLMsg = oXML.error["message"];
                } else {
                    oXMLMsg = error.responseText;
                }
                MessageBox.error(oXMLMsg);
            }
        });
    },
    downloadFileContent: function (iFILE_TYPE, iSR_NO, sFILE_NAME, sFILE_MIMETYPE, sFILE_CONTENT) {
        // this.sbIndex = parseInt(oEvent.getSource().getBindingContext("aModel").getPath().split("/")[1]);
        var aFilter = [],
        fileContent = null;

        // var data = this.getView().getModel("aModel").getData()[this.sbIndex];

        // if(data.FILE_MIMETYPE === "text/plain")
        // {
        // 	var sFILE_CONTENT = atob(data.FILE_CONTENT);
        // }
        // sFILE_CONTENT = atob(data.FILE_CONTENT);
        // sFILE_CONTENT = sFILE_CONTENT;
        this.downloadAttachment(sFILE_CONTENT, sFILE_NAME, sFILE_MIMETYPE);
    },
    downloadAttachment: function (content, fileName, mimeType) {
         
        download("data:application/octet-stream;base64," + content, fileName, mimeType);
        var HttpRequest = new XMLHttpRequest();
        // x.open("GET", "http://danml.com/wave2.gif", true);
        HttpRequest.responseType = 'blob';
        HttpRequest.onload = function (e) {
            download(HttpRequest.response, fileName, mimeType);
        }
        HttpRequest.send();
    },
      });
    });
  