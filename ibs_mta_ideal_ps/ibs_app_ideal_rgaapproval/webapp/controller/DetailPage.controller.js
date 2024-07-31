sap.ui.define(
    [
      "./BaseController",
      "sap/ui/model/json/JSONModel",
      "com/ibs/ibsappidealrgaapproval/model/formatter",
      "sap/ui/core/BusyIndicator",
      "sap/m/MessageBox",
      "/sap/m/MessageToast"
    ],
    function(BaseController,JSONModel,formatter,BusyIndicator,MessageBox,MessageToast) {
      "use strict";
      var that;
      var myJSONModel12;
      var userData;
      var hierarchyLevel;
      var rgNo;
      var appModulePath;
      var level;
      var sUserRole;
      return BaseController.extend("com.ibs.ibsappidealrgaapproval.controller.DetailPage", {
        formatter: formatter,
        onInit: function() {
        //   debugger;
          that = this;
          var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
          var appPath = appId.replaceAll(".", "/");
          appModulePath = jQuery.sap.getModulePath(appPath);
          var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
          oRouter.getRoute("DetailPage").attachPatternMatched(that.objectRouteMatched, that)
          this.getOwnerComponent().getModel("userModel");
        },
        objectRouteMatched : function(oEvent){
        //   debugger;
        BusyIndicator.show();
        rgNo = Number(oEvent.getParameters().arguments.RGA_NO);
        var flag = oEvent.getParameters().arguments.FLAG;
        if(flag === "true"){
            this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
        }else{
            this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
        }
        var iWindowWidth = window.innerWidth;
        if (iWindowWidth < 600) {
            this.getView().byId("idMTable").setVisible(true);
            this.getView().byId("invoiceTableId").setVisible(false);
        } else {
            this.getView().byId("invoiceTableId").setVisible(true);
            this.getView().byId("idMTable").setVisible(false);
        }
        this.onMainContent(true);
        if (that.getUserData === undefined) {

			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);
			var attr = appModulePath + "/user-api/attributes";
            
            // that._sUserID = "darshan.l@intellectbizware.com";
            // that._sUserName = "Darshan Lad";
            // var obj = {
            //     userId: "darshan.l@intellectbizware.com",
            //     userName: "Darshan Lad"
            // }

            // that._sUserID = "priya.g@intellectbizware.com";
                // that._sUserName = "Priya gawde";
                // var obj = {
                //     userId: "priya.g@intellectbizware.com",
                //     userName: "Priya gawde"
                // }
                
            // var oModel = new JSONModel(obj);
            // that.getOwnerComponent().setModel(oModel, "userModel");
            // // that.readUserMasterEntities();
            // that.readUserMasterData(that._sUserID);

				return new Promise(function (resolve, reject) {
					$.ajax({
						url: attr,
						type: 'GET',
						contentType: 'application/json',
						success: function (data, response) {
							var obj = {
								userId: data.email.toLowerCase(),
								userName: data.firstname + " " + data.lastname
							}
							var oModel = new JSONModel(obj);
							that.getOwnerComponent().setModel(oModel, "userModel");

                            userData = that.getOwnerComponent().getModel("userModel").getData();
							that._sUserID = data.email.toLowerCase();
							that.readUserMasterData(that._sUserID);
							// that.readAccess(that._sUserID);
						},
						error: function (oError) {
							MessageBox.error("Error while reading User Attributes");
						}
					});
				});
			} else {
                userData = this.getOwnerComponent().getModel("userModel").getData();
                rgNo = Number(oEvent.getParameters().arguments.RGA_NO);
                that.readUserMasterEntities();
                that._readTimelineData(rgNo);
			}
        //   that.readAttachments(rgNo)
        },
        readUserMasterData : function(userEmail){
            var userDetailModel = new JSONModel();

			var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
			var appPath = appId.replaceAll(".", "/");
			appModulePath = jQuery.sap.getModulePath(appPath);

			var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealUsers?$filter=(EMAIL eq '" + userEmail + "') and (ACTIVE eq 'X')";
			var data = { $expand: 'TO_USER_ENTITIES' };

				$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    data: data,
                    success: function (data, response) {
						if(data.value.length === 0){
							MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
						}
						else{
                            userData = that.getOwnerComponent().getModel("userModel").getData();
                            // rgNo = Number(oEvent.getParameters().arguments.RGA_NO);
                            that.readUserMasterEntities();
                            that._readTimelineData(rgNo);
						}

						for(var i = 0;i<data.value.length; i++){
							if(that._sUserID === data.value[i].USER_ID){
								if(i === 0)
								{
									sUserRole = data.value[i].USER_ROLE;
								}
								else{
									sUserRole = sUserRole +","+data.value[i].USER_ROLE;
								}
								
							}
						}
					},
                    error: function (error) {
                        BusyIndicator.hide();
						var oXML,oXMLMsg;
                        // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
        readUserMasterEntities: async function () {
            // debugger
            // hierarchyLevel = await that.calLevel();
            // that.calView(hierarchyLevel,userData.userId);
            that.checkUserId(rgNo, userData.userId)
        },
        checkUserId : function(rgNo,userId){
			// debugger;

			// var aFilter = "REQUEST_NO eq '"+ reqNo +"' "ideal-claim-creation-srv/ClaimHeader?$filter=CR_NO eq "+ sLoginId 
			var url = appModulePath + "/odata/v4/ideal-rga-process/Rga_Header?$filter=RGA_NO eq " + rgNo + "";
			$.ajax({
				url: url,
				type: "GET",
				contentType: 'application/json',
				// data: data,
				success: function (data, response) {
					// debugger;
					// entityCode = data.value[0].ENTITY_CODE;
					level = data.value[0].APPROVER_LEVEL;
                    that.readData(rgNo);
                    that.readAccess(level, userData.userId);
					// that.calView(level,userData.userId);
				},
				error: function (error) {
					// debugger;
					BusyIndicator.hide();
					var oXML,oXMLMsg;
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
        calView : function(hierarchyLevel,userId){
            // debugger;
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=(TYPE eq 'CR') and (LEVEL eq " + hierarchyLevel + ") and (USER_IDS eq '" + userId +"')";
			// var data = { $expand: 'TO_USER_ENTITIES' };
                var hLevelArr = [];
                // return new Promise(function(resolve,reject){
				$.ajax({
                    url: url,
                    type: "GET",
                    contentType: 'application/json',
                    // data: data,
                    success: function (data, response) {
						// debugger;
						if(data.value.length === 0){
							MessageBox.error("No entities assigned for " + that._sUserID + ". Contact admin team.");
						}else{
                            // var crNo = Number(oEvent.getParameters().arguments.CR_NO);
                           
						}
					},
                    error: function (error) {
						// ;
                        BusyIndicator.hide();
						var oXML,oXMLMsg;
                        // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
        readData : function(sLoginId){
        //   debugger;
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
                        var oModel = new JSONModel(data.value[0]);
                        that.getView().setModel(oModel,"rModel");

                        that.getView().byId("invoiceTableId").setVisibleRowCount(data.value[0].RGA_ITEMS_REF.length);
                    },
                    error: function (e) {
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
                    var oXML,oXMLMsg;
                    // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
                    if (that.isValidJsonString(error.responseText)) {
                        oXML = JSON.parse(error.responseText);
                        oXMLMsg = oXML.error["message"];
                    } else {
                        oXMLMsg = error.responseText
                    }
                    MessageBox.error(oXMLMsg);
                }
            });
          },
        onExit : function(oEvent){
        //   debugger;
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
                // debugger;
                BusyIndicator.hide();
                var oXML,oXMLMsg;
                // that.errorLogCreation(e.responseText, e.statusCode, null, that._sUserID);
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
    onZoomIn: function () {
        this.getView().byId("processflow1").zoomIn();

        // MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
    },
onZoomOut: function () {
        this.getView().byId("processflow1").zoomOut();

        // MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
    },
    // calLevel : function(){
    //     var userEmail = that._sUserID;
    //     var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
    //     var appPath = appId.replaceAll(".", "/");
    //     var appModulePath = jQuery.sap.getModulePath(appPath);
    //     var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=TYPE eq 'CR'"
    //     // ?$filter=(USER_IDS contains '" + userEmail + "')";
    //     // var data = { $expand: 'TO_USER_ENTITIES' };
    //         var hLevelArr = [];
    //         return new Promise(function(resolve,reject){
    //         $.ajax({
    //             url: url,
    //             type: "GET",
    //             contentType: 'application/json',
    //             // data: data,
    //             success: function (data, response) {
    //                 // debugger;
    //                 var mLevel = data.value.map((x)=>{if(x.USER_IDS.includes(userData.userId)){return x.LEVEL}});
    //                 for(var i = 0; i < mLevel.length; i++){
    //                 if(mLevel[i] === undefined || mLevel[i] === null || mLevel[i] === "")
    //                 {
    //                     continue;
    //                 }
    //                 else
    //                 {
    //                     hLevelArr.push(mLevel[i]);
    //                 }
    //             }
    //                 resolve(hLevelArr);
    //                 // const fruits = new Map([data]);
    //             },
    //             error: function (error) {
    //                 // debugger;
    //                 // BusyIndicator.hide();
    //                 var oXML,oXMLMsg;
    //                 if (context.isValidJsonString(error.responseText)) {
    //                     oXML = JSON.parse(error.responseText);
    //                     oXMLMsg = oXML.error["message"];
    //                 } else {
    //                     oXMLMsg = error.responseText
    //                 }
    //                 MessageBox.error(oXMLMsg);
    //             }
    //         });
    //     })
    // },
    readAccess: function(level, userEmail){
        // debugger;
        // var userDetailModel = new JSONModel();
        // var vendorDetailsData2 = this.getOwnerComponent().getModel("vendorDetail").getData();
        // var eCode = vendorDetailsData2.ENTITY_CODE;
        // var appLevel = vendorDetailsData2.APPROVER_LEVEL;\
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        var hType = "RG";
        var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterApprovalHierarchy?$filter=(ENTITY_CODE eq '1000') and (LEVEL eq " + level + ") and (TYPE eq '" + hType + "')";
        // var data = { $expand: 'TO_USER_ENTITIES' };
        // (USER_IDS eq '" + userEmail + "')

            $.ajax({
                url: url,
                type: "GET",
                contentType: 'application/json',
                // data: data,
                success: function (data, response) {
                    // debugger;

                    var mHierarchyId = data.value.map((x)=>{if(x.USER_IDS.includes(userData.userId)){return x}});
                    
                    // if(mHierarchyId[0].ACCESS_SENDBACK === true){
                    //     that.getView().byId("sendbackBt").setVisible(true);
                    // }else{
                    //     that.getView().byId("sendbackBt").setVisible(false);
                    // }

                    if(mHierarchyId[0].ACCESS_APPROVE === true){
                        that.getView().byId("approveBt").setVisible(true);
                    }else{
                        that.getView().byId("approveBt").setVisible(false);
                    }

                    if(mHierarchyId[0].ACCESS_REJECT === true){
                        that.getView().byId("rejectBt").setVisible(true);
                    }else{
                        that.getView().byId("rejectBt").setVisible(false);
                    }

                    // if(mHierarchyId[0].ACCESS_EDIT === true){
                    //     that.getView().byId("editBtn").setVisible(true);
                    // }else{
                    //     that.getView().byId("editBtn").setVisible(false);
                    // }
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
                }
            });
    },
    onSideContent:function(sCode){
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        var url = appModulePath + "/odata/v4/ideal-registration-form-srv/MasterIdealSettings?$filter=CODE eq '" + sCode+"'";

        $.ajax({
            url: url,
            type: "GET",
            contentType: 'application/json',
            data: null,
            success: function (data, response) {
                BusyIndicator.hide();
                var isEnable = data.value[0].SETTING;
                if(isEnable === "X"){
                    that.getView().byId("DynamicSideContent").setShowSideContent(true);
                }
                else{
                    that.getView().byId("DynamicSideContent").setShowSideContent(false);
                }
            },
            error: function (error) {
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
            }
        });

    },
    onApprove: function (oEvent) {
        if (!this.filterfrag) {
            this.filterfrag = sap.ui.xmlfragment("com.ibs.ibsappidealrgaapproval.view.fragments.approveFrag", this);
        }
        this.filterfrag.open();
        
        // context.filterfrag.setModel(context.getView().getModel("localModel"), "localModel");
        // context.filterfrag.setModel(context.getView().getModel("detailsForm"), "detailsForm");
        sap.ui.getCore().byId("id_approve").setVisible(true);
        sap.ui.getCore().byId("id_reject").setVisible(false);
        sap.ui.getCore().byId("id_back").setVisible(false);
        sap.ui.getCore().byId("id_lable").setRequired(false);
        sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to approve ?");
        // isNewSwiftCodeExist = null;
    },
    closeDialog: function () {
        this.filterfrag.close();
        this.filterfrag.destroy();
        this.filterfrag = null;
    },
    onSubmitApproval: function () {
        // debugger;
        // sap.ui.getCore.byId("id_lable").setRequired(true);
        this.commonRequestAction("APPROVE");
    },
    commonRequestAction: function (oAction) {
        // debugger;
        var updateRequestPaylod;
        var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
        var appPath = appId.replaceAll(".", "/");
        var appModulePath = jQuery.sap.getModulePath(appPath);
        var url = appModulePath + "/odata/v4/ideal-rga-process/rgaProcess";

        var headerData = that.getView().getModel("rModel").getData();

        // var userDetails = that.getView().getModel("userModel").getData();
        if(oAction === "APPROVE"){
            var comm = "RGA Request Approved"
        }else{
            var comm = sap.ui.getCore().byId("id_comment").getValue();
        }
        
        // if (approvalData.LAST_UPDATED){
        //     var oDate3 = new Date(approvalData.LAST_UPDATED);
        //     var sDate3 = oDate3.toISOString().split('T')[0];
        // }
        // if (approvalData.CREATED_ON){
        //     var oDate = new Date(approvalData.CREATED_ON);
        //     var sDate = oDate3.toISOString().split('T')[0];
        // }
       var headerPaylod=[{
                    "RGA_NO": headerData.RGA_NO,
                    "DISTRIBUTOR_ID": "1100013",
                    "DISTRIBUTOR_NAME": headerData.DISTRIBUTOR_NAME,
                    "DISTRIBUTOR_REASON": headerData.DISTRIBUTOR_REASON, 
                    "STATUS": 1,
                    "APPROVER_LEVEL": headerData.APPROVER_LEVEL,
                    "APPROVER_ROLE": headerData.APPROVER_ROLE,
                    "BU_CODE": headerData.BU_CODE,
                    "SAP_RETURN_CODE": "",
                    "COMMENT" : headerData.COMMENT,
                    "CREATED_ON": new Date()
                }]

                var itemsPaylod = []
                for(var i=0;i<headerData.RGA_ITEMS_REF.length;i++){
                    if (headerData.RGA_ITEMS_REF[i].INVOICE_DATE){
                        var oDate3 = new Date(headerData.RGA_ITEMS_REF[i].INVOICE_DATE);
                        var sDate3 = oDate3.toISOString().split('T')[0];
                    }

                    if (headerData.RGA_ITEMS_REF[i].EXPIRY_DATE){
                        var oDate = new Date(headerData.RGA_ITEMS_REF[i].EXPIRY_DATE);
                        var sDate = oDate.toISOString().split('T')[0];
                    }
                    var acceptedQuantity = parseInt(headerData.RGA_ITEMS_REF[i].INVOICE_QUANTITY) - parseInt(headerData.RGA_ITEMS_REF[i].RETURN_QUANTITY);
                    var acceptedPrice = parseFloat(headerData.RGA_ITEMS_REF[i].PRICE) - parseFloat(headerData.RGA_ITEMS_REF[i].EXTENDED);
                    var item = {
                        "RGA_NO": 1,
                        "RGA_ITEM_NO": Number(headerData.RGA_ITEMS_REF[i].RGA_ITEM_NO),
                        "ITEM_CODE": headerData.RGA_ITEMS_REF[i].ITEM_CODE,
                        "BATCH": headerData.RGA_ITEMS_REF[i].BATCH,
                        "EXPIRY_DATE": sDate,
                        "SALEABLE": "Y",
                        "INVOICE_NO": headerData.RGA_ITEMS_REF[i].INVOICE_NO,
                        "INVOICE_DATE": sDate3,
                        "INVOICE_QUANTITY": parseInt(headerData.RGA_ITEMS_REF[i].INVOICE_QUANTITY),
                        "PRICE": parseFloat(headerData.RGA_ITEMS_REF[i].PRICE),
                        "EXTENDED": parseFloat(headerData.RGA_ITEMS_REF[i].EXTENDED),
                        "RETURN_QUANTITY": parseInt(headerData.RGA_ITEMS_REF[i].RETURN_QUANTITY),
                        "ACCEPTED_QUANTITY": acceptedQuantity,
                        "ACCEPTED_PRICE": acceptedPrice
                    }
                    itemsPaylod.push(item);
                }

                var payload = {
                    "action": oAction,
                    "appType":"RG",
                    "rgHeader": headerPaylod,
                    "rgItems": itemsPaylod,
                    "rgEvent": [
                        {
                            "RGA_NO": 1,
                            "EVENT_NO": 1,
                            "EVENT_CODE": 1,
                            "USER_ID": userData.userId,
                            "USER_NAME": userData.userName,
                            "USER_ROLE": "Asso",
                            "REMARK": "Created by Distributor",
                            "COMMENT": comm || null,
                            "CREATION_DATE": new Date()
                        }
                    ]
                }

        var Postdata = JSON.stringify(payload);
        // context.onBack();
        BusyIndicator.show();
        if(oAction === "APPROVE"){
            this.postAjaxs(url, "POST", Postdata, "APPROVE");
        }else{
            this.postAjaxs(url, "POST", Postdata, "REJECT");
        }
    },
    postAjaxs: function (url, type, data, model) {
        // debugger;
        $.ajax({
            url: url,
            type: type,
            contentType:'application/json',
            data: data,
            success: function (data, response) {
                // debugger;
                BusyIndicator.hide();

                if (model === "REJECT") {
                    that.filterfrag.close();
                    that.filterfrag.destroy();
                    that.filterfrag = null;
                    MessageBox.success(data.value.OUT_SUCCESS, {
                        actions: [MessageBox.Action.OK],
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                oRouter.navTo("RouteMasterPage");
                            }
                        }
                    });
                }else{
                    MessageBox.success(data.value.OUT_SUCCESS, {
                        actions: [MessageBox.Action.OK],
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                oRouter.navTo("RouteMasterPage");
                            }
                        }
                    });
                }
            },
            error: function (error) {
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
            }
        });
    },
    onSubmitRejection: function () {
        var commentVal = sap.ui.getCore().byId("id_comment");
       
        var validComment = commentVal.getValue().match(/^[a-zA-Z0-9 \n!@#$&()`.+,/"-]*$/);
        if (commentVal.getValue() === "") {
            MessageToast.show("Please Enter Comment");
        }
        else{
            this.commonRequestAction("REJECT");
        } 
    },
    // commonRequestAction: function (oAction) {
    //     // debugger;
    //     // var updateRequestPaylod;
    //     var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
    //     var appPath = appId.replaceAll(".", "/");
    //     var appModulePath = jQuery.sap.getModulePath(appPath);
    //     var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/CreateClaimReq";
    //     var approvalData = that.getView().getModel("cModel").getData();

    //     var headerPaylod = [{
    //         "CR_NO": approvalData.CR_NO,
    //         "DISTRIBUTOR_ID":approvalData.DISTRIBUTOR_ID,
    //         "CLAIM_TYPE":approvalData.CLAIM_TYPE,
    //         "CLAIM_REASON":approvalData.CLAIM_REASON,
    //         "CLAIM_FROM":approvalData.CLAIM_FROM,
    //         "CLAIM_TO":approvalData.CLAIM_TO,
    //         "STATUS":approvalData.STATUS,
    //         "APPROVER_LEVEL":approvalData.APPROVER_LEVEL,
    //         "APPROVER_ROLE":approvalData.APPROVER_ROLE,
    //         "NEXT_APPROVER":null,
    //         "SALES_ASSOCIATE_ID":approvalData.SALES_ASSOCIATE_ID,
    //         "REGION_CODE":"T",
    //         "SAP_CREDIT_NOTE":"",
    //         "LAST_UPDATED":approvalData.LAST_UPDATED,
    //         "CREATED_ON":approvalData.CREATED_ON
    //     }]

    // var itemsPaylod=[{
    //         "CR_NO":approvalData.TO_ITEMS[0].CR_NO,
    //         "ITEM_NO":approvalData.TO_ITEMS[0].ITEM_NO,
    //         "ITEM_CODE":approvalData.TO_ITEMS[0].ITEM_CODE,
    //         "ITEM_DESC" : approvalData.TO_ITEMS[0].ITEM_DESC,
    //         "HOSPITAL_CODE":approvalData.TO_ITEMS[0].HOSPITAL_CODE,
    //         "INVOICE_NO":approvalData.TO_ITEMS[0].INVOICE_NO,
    //         "INVOICE_DATE":approvalData.TO_ITEMS[0].INVOICE_DATE,
    //         "INVOICE_QUANTITY": approvalData.TO_ITEMS[0].INVOICE_QUANTITY,
    //         "INVOICE_RATE":approvalData.TO_ITEMS[0].INVOICE_RATE,
    //         "REQUESTED_RATE":approvalData.TO_ITEMS[0].REQUESTED_RATE,
    //         "REQUESTED_QUANTITY":approvalData.TO_ITEMS[0].REQUESTED_QUANTITY,
    //         "REQUESTED_AMOUNT":approvalData.TO_ITEMS[0].REQUESTED_AMOUNT,
    //         "PROCESSSED_RATE":approvalData.TO_ITEMS[0].PROCESSSED_RATE,
    //         "PROCESSSED_QUANTITY":approvalData.TO_ITEMS[0].PROCESSSED_QUANTITY,
    //         "PROCESSSED_AMOUNT": approvalData.TO_ITEMS[0].PROCESSSED_AMOUNT
    //     }]


    //     var payload = {
    //         "action": oAction,
    //         "appType":"CR",
    //         "crHeader": headerPaylod,
    //         "crItems": itemsPaylod,
    //         "crAttachments":[],
    //         "crEvent": [{
    //             "CR_NO": 1,
    //             "EVENT_NO": 1,
    //             "EVENT_CODE": 1,
    //             "USER_ID": userData.userId,
    //             "USER_ROLE": "CEO",
    //             "USER_NAME": userData.userName,
    //             "REMARK":"Claim Request Approved",
    //             "COMMENT": ,
    //             "CREATION_DATE": null
    //         }],
    //         "userDetails": {
    //             "USER_ROLE": "CEO",
    //             "USER_ID": userData.userId
    //         }
    //     };

    //     var Postdata = JSON.stringify(payload);
    //     // context.onBack();
    //     BusyIndicator.show();
    //     this.postAjaxs(url, "POST", Postdata, null);
    // },
    onReject: function (oEvent) {

        if (!this.filterfrag) {
            this.filterfrag = sap.ui.xmlfragment("com.ibs.ibsappidealrgaapproval.view.fragments.approveFrag", this);
        }
        this.filterfrag.open();
        sap.ui.getCore().byId("id_approve").setVisible(false);
        sap.ui.getCore().byId("id_reject").setVisible(true);
        sap.ui.getCore().byId("id_back").setVisible(false);
        sap.ui.getCore().byId("id_lable").setRequired(true);
        sap.ui.getCore().byId("idApproveDialog").setTitle("Do you want to Reject ?");
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
  