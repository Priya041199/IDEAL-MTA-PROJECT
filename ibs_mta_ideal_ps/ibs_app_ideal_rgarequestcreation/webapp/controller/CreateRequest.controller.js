sap.ui.define([
    // "sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/m/MessageBox",
	"sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "com/ibs/ibsappidealrgarequestcreation/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,MessageBox,MessageToast,BusyIndicator,JSONModel,formatter) {
        "use strict";
        var that;
        var claimFrom; 
        var attachdata = [];
        var blanckJsonModel;
        var oModel;
        var unit;
        var rType;
        var reason;
        var userData;
        var iModel;
        var sUserRole=[];
        var flag;
        return BaseController.extend("com.ibs.ibsappidealrgarequestcreation.controller.CreateRequest", {
            formatter: formatter,
            onInit: function () {
                debugger;
                that=this;
                that.oDataModel = this.getOwnerComponent().getModel("onPremiseModel");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("CreateRequest").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched :  function(){
                debugger;
                var sLoginId = '1100013';
                userData = this.getOwnerComponent().getModel("userModel").getData();
                that.readInvoiceDataS4Hana();
                var blankObject = {
                    "businessUnit": null,
                    "typeOfReturn": null,
                    "returnReason" : null,
                    "invoice" : null
                };
                blanckJsonModel = new JSONModel(blankObject);
			    that.getView().setModel(blanckJsonModel, "blankJson");
                // that._readClaimAttachments(sLoginId);
                var g = this.getView().getParent().getParent(); 
                g.toBeginColumnPage(this.getView())
                this.readMasterIdealUser();
            },
            handleBUnit : function(oEvent){
                //debugger;
                unit = oEvent.getSource().getSelectedKey();
                this.getView().getModel("blankJson").setProperty("/businessUnit",unit)
            },
            handleReturnType : function(oEvent){
                rType = oEvent.getSource().getSelectedKey();
                this.getView().getModel("blankJson").setProperty("/typeOfReturn",rType)
            },
            onComments : function(oEvent){
                //debugger;
                reason = oEvent.getSource().getValue();
                this.getView().getModel("blankJson").setProperty("/returnReason",reason)
            },
            onBack : function(){
                // debugger;
                
                if(blanckJsonModel !== undefined){
                    // this.getView().getModel("blankJson").setData("");
                    blanckJsonModel.setData(null);
                }

                if(oModel !== undefined){
                    oModel.setData(null);
                }

                if(iModel !== undefined){
                    iModel.setData(null);
                    this.getView().byId("invoiceNumber").setValue(null);
                }
            
                // if()
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteMasterPage");
            },
            handleClaimType : function(oEvent){
                // debugger;
                
                var unit = this.getView().byId("bUnit").getSelectedKey();
                var claimType = this.getView().byId("typeofReturn").getSelectedKey(); 
                // if(unit === "" || unit === undefined || unit === null){
                //     MessageBox.warning("Please Select Business Unit");
                // }else{
                    // this.getView().byId("priceDifferent").setVisible(true);
                    this.getView().getModel("blankJson").setProperty("/businessUnit",unit)
                    this.getView().getModel("blankJson").setProperty("/typeOfReturn",claimType)

                    // if(unit != ""){
                    //     attachdata = [{
					// 		"ATTACH_CODE": 1,
					// 		"ATTACH_NO": 1,
					// 		"ATTACH_NAME": "Invoice"
					// 	}]
                    // }

                    // var claimAttachMapJson = new JSONModel();
					// claimAttachMapJson.setData(attachdata);
					// this.getView().setModel(claimAttachMapJson, "claimAttachMapJson");
					// this.getView().byId("attachsId").setVisible(true);
                // }
            },
            // onComments : function(oEvent){
            //     // debugger;
            //     var reason = oEvent.getSource().getValue();
            //     this.getView().getModel("blankJson").setProperty("/returnReason",reason)
            // },
            handleUpload : function(oEvent){
            // debugger;
            var sbfileDetails = oEvent.getParameters("file").files;
			var filesize = sbfileDetails[0].size;
			var fileSizeInBytes = filesize;
			// Convert the bytes to Kilobytes (1 KB = 1024 Bytes)
			var fileSizeInKB = fileSizeInBytes / 1024;
			// Convert the KB to MegaBytes (1 MB = 1024 KBytes)
			var fileSizeInMB = fileSizeInKB / 1024;

			var fName = sbfileDetails[0].name;

			if (fileSizeInMB > 5) {
				MessageBox.warning("File size should be less than or equal to 5MB", {
					icon: MessageBox.Icon.WARNING,
					title: "WARNING",
					actions: sap.m.MessageBox.Action.OK,
					emphasizedAction: sap.m.MessageBox.Action.OK
				});
			} else if (fName.includes(".pdf") || fName.includes(".xlsx") || fName.includes(".docm") ||
				fName.includes(".docx") || fName.includes(".jpg") || fName.includes(".txt")) {
				// this.model = oEvent.getSource().mBindingInfos.enabled.parts[0].model;
				this.sourceData = oEvent.getSource();

				// if (this.model === "G7Json" || this.model === "G6Json" || this.model === "G10Json" || this.model === "G22Json" ||
				// 	this.model === "G23Json") {
					// this.sbIndex = parseInt(oEvent.getSource().mBindingInfos.enabled.parts[0].path.split("/FILE_NAME")[0].split("/")[1]);
				// }
				// else {
					this.sbIndex = parseInt(oEvent.getSource().getBindingContext("claimAttachMapJson").getPath().split("/")[1]);
				// }

				this.sbfileUploadArr = [];
				if (sbfileDetails.lenghth != 0) {
					for (var i in sbfileDetails) {
						var mimeDet = sbfileDetails[i].type,
							fileName = sbfileDetails[i].name,
                            fileType = sbfileDetails[i].type;
						this.sbfileName = fileName;
						// Calling method....
						this.sbBase64conversionMethod(mimeDet, fileName, sbfileDetails[i], fileType);
					}
				} else {
					this.sbfileUploadArr = [];
				}
			}
			else {
				MessageBox.warning("Please select correct File Type");
			}
            },
            sbBase64conversionMethod: function (fileMime, fileName, fileDetails, fileType) {
                // var context = this;
                var that = this;
				if (!FileReader.prototype.readAsBinaryString) {
					FileReader.prototype.readAsBinaryString = function (fileData) {
						var binary = "";
						var reader = new FileReader();
						reader.onload = function (e) {
							var bytes = e.reader.result;
							var length = bytes.byteLength;
							for (var i = 0; i < length; i++) {
								binary += String.fromCharCode(bytes[i]);
							}
							that.sbbase64ConversionRes = btoa(binary);
							that.sbfileUploadArr.push({
								"MimeType": fileMime,
								"FileName": fileName,
								"Content": that.sbbase64ConversionRes,
                                "Type": fileType
							});
						};

						reader.readAsArrayBuffer(fileData);

					};
				}
				var reader = new FileReader();
				reader.onload = function (readerEvt) {
					var binaryString = readerEvt.target.result;
					that.sbbase64ConversionRes = btoa(binaryString);
                    that.sbfileUploadArr = [];
					that.sbfileUploadArr.push({
						"MimeType": fileMime,
						"FileName": fileName,
						"Content": that.sbbase64ConversionRes,
                        "Type": fileType
					});
					that._sbgetUploadedFiles();
				};
				reader.readAsBinaryString(fileDetails);
            },
            _sbgetUploadedFiles: function () {
                // debugger;
				var that = this;
				if (this.sbfileUploadArr.length != 0) {
					for (var fdata in this.sbfileUploadArr) {
						this.sbAttachmentArr = {
							"FILE_NAME": this.sbfileUploadArr[fdata].FileName,
							"FILE_MIMETYPE": this.sbfileUploadArr[fdata].MimeType,
							"FILE_CONTENT": this.sbfileUploadArr[fdata].Content,
                            "FILE_TYPE": this.sbfileUploadArr[fdata].Type
						};
					}
				}

				this.sbfileUploadArr = [];
				MessageBox.success("Your file has been uploaded successfully", {
					actions: [MessageBox.Action.OK],
					onClose: function (oAction) {
						if (oAction === "OK") {
							attachdata[that.sbIndex].FILE_CONTENT = that.sbAttachmentArr.FILE_CONTENT;
							attachdata[that.sbIndex].FILE_MIMETYPE = that.sbAttachmentArr.FILE_MIMETYPE;
							attachdata[that.sbIndex].FILE_NAME = that.sbAttachmentArr.FILE_NAME;
                            attachdata[that.sbIndex].FILE_TYPE = that.sbAttachmentArr.FILE_TYPE;

                            that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[1].setEnabled(false);
							that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[3].setEnabled(true);
							that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[4].setEnabled(true);

							// var attachJson = new JSONModel();
							// attachJson.setData(that.attachmentData);
							// that.getView().setModel(attachJson, "attachJson");

							// that.getView().byId("attachDisId").getRows()[parseInt(that.sbIndex)].getCells()[3].setEnabled(true);
							// that.getView().byId("attachDisId").getRows()[parseInt(that.sbIndex)].getCells()[1].setEnabled(false);

							// that.sbAttachmentArr = {};
                            that.getView().getModel("claimAttachMapJson").refresh(true);
						}

					}
				})

			},
            readInvoiceDataS4Hana: function (oFilter) {
                // debugger;
                // if (that.getView().getModel("vendorDataModel") === undefined) {
                    BusyIndicator.show(0);
                    var sLoginId = '1100013';
                    var oFilter = new sap.ui.model.Filter("Kunnr", sap.ui.model.FilterOperator.EQ, sLoginId);
                    that.oDataModel.read("/INVOICEF4Set", {
                        filters : [oFilter],
                        success: function (data) {
                           BusyIndicator.hide(0);
                        //    debugger
                           var oModel = new JSONModel(data);
                           that.getView().setModel(oModel,"iModel");
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
                // }
            },
            handleInvoiceDialog : function(){
                // debugger;
                // BusyIndicator.show(0);
			if (!this.invoiceDialog) {
				this.invoiceDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealrgarequestcreation.view.fragments.invoiceAdd", this);
				this.getView().addDependent(this.invoiceDialog);
			}
			// BusyIndicator.hide();
			this.invoiceDialog.open();
            },
            closeAddInvoiceDialog : function () {

                if(this.invoiceDialog !== undefined){

                    // this.getView().getModel("itemModel").setData(null);
                }
                
                this.invoiceDialog.close();
                this.invoiceDialog.destroy();
                this.invoiceDialog = null;

                this.getView().getModel("itemModel").setData(null);
                // this.invoiceDialog.null();
            },
            invoiceItemsDialog : function(){
                this.itemsDialog = undefined;
                if (!this.itemsDialog) {
                    this.itemsDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealrgarequestcreation.view.fragments.invoiceItems", this);
                    this.getView().addDependent(this.itemsDialog);
                }
                // BusyIndicator.hide();
                this.itemsDialog.open();
            },
            closeInvoiceItemDialog : function(oEvent){
                // oEvent.getSource().getParent().close();
                // this.itemsDialog.close();
                this.itemsDialog.destroy();
                // this.itemsDialog = null;
            },
            onSelectInvoice : function(oEvent){
                // debugger;
                this.itemsDialog.destroy();
                this.itemsDialog = null;
                var iNo = oEvent.getParameters().selectedItem.getTitle();
                that.invoiceItemRead(iNo);
            },
            getReqformat: function (sValue) {
                if (sValue == "Price Different") {
                    return 1;
                } else if (sValue == "Product Complaint") {
                    return 2;
                } else if (sValue == "Workshops") {
                    return 3;
                } else if (sValue == "Evaluation") {
                    return 4;
                }else if (sValue == "Invoice Correction") {
                    return 5;
                }
            },
            invoiceItemRead : function(iNo){
                // debugger;
                var oFilter = new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.EQ, iNo);
                    that.oDataModel.read("/INVOICEITEMSet", {
                        filters : [oFilter],
                        success: function (data) {
                           BusyIndicator.hide(0);
                        //    debugger
                           iModel = new JSONModel(data);
                           that.getView().setModel(iModel,"itemModel");

                           sap.ui.getCore().byId("itemsTableId").setVisibleRowCount(data.results.length);
                        },
                        error: function (e) {
                            BusyIndicator.hide();
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
            addInvoice : function(oEvent){
                // debugger;
                
                var checkLength = sap.ui.getCore().byId("itemsTableId").getSelectedIndices();
                var newData = [];
                var newArray = [];
                if(checkLength.length === 0){
                    MessageBox.error("Please select invoice items");
                }else{
                    var data = this.getView().getModel("itemModel").getData();
                    this.getView().byId("invoiceNumber").setValue(data.results[0].Vbeln);
                    if(checkLength.length > 1){
                        for(var i=0;i<checkLength.length;i++){
                            var len = checkLength[i]

                            var sInvItem = {
                                "ITEM_CODE": data.results[len].Matnr,
                                "ITEM_DESC": data.results[len].Arktx,
                                "BATCH": data.results[len].Charg,
                                "EXPIRY_DATE": data.results[len].Vfdat,
                                "SALEABLE": "Y",
                                "INVOICE_NO": data.results[len].Vbeln,
                                "INVOICE_DATE": data.results[len].Fkdat,
                                "INVOICE_QUANTITY": parseInt(data.results[len].Fkimg),
                                "PRICE": parseFloat(data.results[len].Netwr),
                                "EXTENDED": parseFloat(data.results[len].Netwr),
                                "RETURN_QUANTITY": parseInt(data.results[len].Fkimg)
                            };

                            newData.push(sInvItem);
                        }
                        
                        this.invoiceDialog.destroy();
                        this.invoiceDialog = null;
                        

                        oModel = new JSONModel(newData);
                        that.getView().setModel(oModel,"fragModel");
                            
                        that.getView().byId("invoiceTableId").setVisibleRowCount(newData.length);
                        this.getView().getModel("itemModel").setData(null);

                    }else{
                        this.invoiceDialog.destroy();
                        this.invoiceDialog = null;

                        var len = checkLength[0];

						var sInvItem = {
                            "ITEM_CODE": data.results[len].Matnr,
                            "ITEM_DESC": data.results[len].Arktx,
                            "BATCH": data.results[len].Charg,
                            "EXPIRY_DATE": data.results[len].Vfdat,
                            "SALEABLE": "Y",
                            "INVOICE_NO": data.results[len].Vbeln,
                            "INVOICE_DATE": data.results[len].Fkdat,
                            "INVOICE_QUANTITY": parseInt(data.results[len].Fkimg),
                            "PRICE": parseFloat(data.results[len].Netwr),
                            "EXTENDED": parseFloat(data.results[len].Netwr),
                            "RETURN_QUANTITY": parseInt(data.results[len].Fkimg)
                        };

						newArray.push(sInvItem)
                        oModel = new JSONModel(newArray);

                        // oModel = new JSONModel(data.results);
                        that.getView().setModel(oModel,"fragModel");

                        that.getView().byId("invoiceTableId").setVisibleRowCount(newArray.length);

                        this.getView().getModel("itemModel").setData(null);
                    }
                }
            },
            validateRequest : function(){
                var cFrom = this.getView().byId("DP1");
                var cTo = this.getView().byId("DP2");
                var bUnit = this.getView().byId("bUnit");
                var typeClaim = this.getView().byId("typeofClaim");
            },
            readMasterIdealUser: function () {
                // debugger;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                 // var url = appModulePath + "/ideal-master-maintenance/MasterIdeaUsers?$filter=ACTIVE eq 'X'";
                 var url = appModulePath + "/odata/v4/ideal-master-maintenance/MasterIdealUsers";
                 // var data = { $expand: 'TO_USER_ROLE,TO_ENTITY_CODE,TO_USER_ENTITIES' };
                //  this.postAjax(url, "GET", null, "idealUser");
                // if(aFilter.length === 0){
                // 	var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo";
                // 	}else{
                // 		var url = appModulePath + "/odata/v4/ideal-request-process-srv/RequestInfo?$filter=" + aFilter;
                // 	}
        
                    // ?$filter=" + aFilter;
                    BusyIndicator.show();
        
                    $.ajax({
                        url: url,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (data, response) {
        
                            BusyIndicator.hide();
                            // sUserRole = [];
                            for(var i = 0;i<data.value.length; i++){
                                if(userData.userId === data.value[i].USER_ID){
                                    sUserRole.push(data.value[i].USER_ROLE);
                                }
                                
                                // if(that._sUserID === data.value[i].USER_ID){
                                //     if(i === 0)
                                //     {
                                //         sUserRole1 = data.value[i].USER_ROLE;
                                //     }
                                //     else{
                                //         sUserRole1 = sUserRole +","+data.value[i].USER_ROLE;
                                //     }
                                    
                                // }
    
                            }
                            // that.readUserMasterEntities();
                        },
                        error: function (e) {
                            // debugger;
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
            onSubmtit : function(){
                // debugger;
                BusyIndicator.show();
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                
                var headerData = this.getView().getModel("blankJson").getData();
                // if(this.getView().getModel("fragModel") === null || )
                
                // var typeClaim = this.getView().byId("typeofClaim").getSelectedKey();
                if(unit === "" || rType === "" || unit === undefined || rType === undefined){
                    BusyIndicator.hide();
                    MessageBox.warning("Please fill mandatory field")
                    return;
                }
                // COMMENTED FOR TESTING PURPOSE
                else if(this.getView().byId("invoiceNumber").getValue() === ""){
                    // if ( === "") {
                        BusyIndicator.hide();
                        MessageBox.warning("Please select the invoice number");
                        return;
                    // }
                }
                else if(reason === "" || reason === undefined || reason === null){
                    BusyIndicator.hide();
                    MessageBox.warning("Please enter the Comments");
                }else if(flag === false){
                    BusyIndicator.hide();
                    MessageBox.warning("Please enter correct RGA Quantity");
                    return;
                }else{

                    // COMMENTED FOR TESTING PURPOSE
                    var itemsData = this.getView().getModel("fragModel").getData();

                var url = appModulePath + "/odata/v4/ideal-rga-process/rgaProcess";

                var headerPaylod=[{
                    "RGA_NO": 1,
                    "DISTRIBUTOR_ID": "1100013",
                    "DISTRIBUTOR_NAME":"Star Enterprise",
                    "DISTRIBUTOR_REASON": headerData.typeOfReturn, 
                    "STATUS": 1,
                    "APPROVER_LEVEL": 1,
                    "APPROVER_ROLE": "SM",
                    "BU_CODE": headerData.businessUnit,
                    "SAP_RETURN_CODE": "",
                    "COMMENT" : headerData.returnReason,
                    "CREATED_ON": new Date()
                }]

                var itemsPaylod = []

                // COMMENTED FOR TESTING PURPOSE
                for(var i=0;i<itemsData.length;i++){
                    if (itemsData[i].INVOICE_DATE){
                        var oDate3 = new Date(itemsData[i].INVOICE_DATE);
                        var sDate3 = oDate3.toISOString().split('T')[0];
                    }

                    if (itemsData[i].EXPIRY_DATE){
                        var oDate = new Date(itemsData[i].EXPIRY_DATE);
                // var date = new Date();
                        var sDate = oDate.toISOString().split('T')[0];
                    }

                    var item = {
                        "RGA_NO": 1,
                        "RGA_ITEM_NO": 1,
                        "ITEM_CODE": itemsData[i].ITEM_CODE,
                        "ITEM_DESCRIPTION" : itemsData[i].ITEM_DESC,
                        "BATCH": itemsData[i].BATCH,
                        "EXPIRY_DATE": sDate,
                        "SALEABLE": "Y",
                        "INVOICE_NO": itemsData[i].INVOICE_NO,
                        "INVOICE_DATE": sDate3,
                        "INVOICE_QUANTITY": parseInt(itemsData[i].INVOICE_QUANTITY),
                        "PRICE": parseFloat(itemsData[i].PRICE),
                        "EXTENDED": itemsData[i].EXTENDED,
                        "RETURN_QUANTITY": parseInt(itemsData[i].RETURN_QUANTITY),
                        "ACCEPTED_QUANTITY": parseInt(itemsData[i].INVOICE_QUANTITY - itemsData[i].RETURN_QUANTITY),
                        "ACCEPTED_PRICE": parseFloat(itemsData[i].PRICE - itemsData[i].EXTENDED)
                    }
                    itemsPaylod.push(item);
                }
                
                    //    var item = {
                    //     "RGA_NO": 1,
                    //     "RGA_ITEM_NO": 1,
                    //     "ITEM_CODE": "3456789",
                    //     "ITEM_DESCRIPTION" : "ERGHJKL",
                    //     "BATCH": "34567890",
                    //     "EXPIRY_DATE": sDate,
                    //     "SALEABLE": "Y",
                    //     "INVOICE_NO": "456789",
                    //     "INVOICE_DATE": sDate,
                    //     "INVOICE_QUANTITY": 345678,
                    //     "PRICE": 5678.78,
                    //     "EXTENDED": 6789,
                    //     "RETURN_QUANTITY": 567890,
                    //     "ACCEPTED_QUANTITY": 456789,
                    //     "ACCEPTED_PRICE": 6789.890
                    // }
                    // itemsPaylod.push(item);
                var payload = {
                    "action": "CREATE",
                    "appType":"RG",
                    "rgHeader": headerPaylod,
                    "rgItems": itemsPaylod,
                    "rgEvent": [
                        {
                            "RGA_NO": 1,
                            "EVENT_NO": 1,
                            "EVENT_CODE": 1,
                            "USER_ID": "starenterprize@gmail.com",
                            "USER_NAME": "Star Enterprise",
                            "USER_ROLE": "DIST",
                            "REMARK": "Created by Distributor",
                            "COMMENT": "RGA request created",
                            "CREATION_DATE": new Date()
                        }
                    ]
                }

            var Postdata = JSON.stringify(payload);
			// context.onBack();
			// BusyIndicator.show();
			   $.ajax({
                    url: url,
                    type: 'POST',
                    data: Postdata,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        BusyIndicator.hide();
                        MessageBox.success(data.value.OUT_SUCCESS, {
							actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
							onClose: function (oAction) {
								if (oAction === "OK") {
                                    
                                    if(blanckJsonModel !== undefined){
                                        // this.getView().getModel("blankJson").setData("");
                                        blanckJsonModel.setData(null);
                                    }
                    
                                    if(oModel !== undefined){
                                        oModel.setData(null);
                                    }
                                    
                                    // COMMENTED FOR TESTING PURPOSE

                                    if(iModel !== undefined){
                                        iModel.setData(null);
                                        // this.getView().byId("invoiceNumber").setValue(null);
                                        that.getView().byId("invoiceNumber").setValue(null);
                                    }
                                    
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                    oRouter.navTo("RouteMasterPage");
								}
							}
						});
                    },
                    error: function (e) {
                        BusyIndicator.hide();
						var oXML,oXMLMsg;
                        // that.errorLogCreation(e.respo/nseText, e.statusCode, null, that._sUserID);
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
            // }
            },
            onItemChange : function(oEvent){
            // debugger;
            var aFilter = [];
			var sQuery = oEvent.getSource()._sSearchFieldValue;
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.Contains, sQuery)];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}
			var oList = sap.ui.getCore().byId("itemsTableId");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
            },
            onValueHelpSearch : function(oEvent){
                // debugger;
            var aFilter = [];
			var sQuery = oEvent.getSource()._sSearchFieldValue;
			if (sQuery) {
				var oFilter1 = [new sap.ui.model.Filter("Vbeln", sap.ui.model.FilterOperator.Contains, sQuery)];
				var allFilters = new sap.ui.model.Filter(oFilter1, false);
				aFilter.push(allFilters);
			}

			var oList = sap.ui.getCore().byId("idMasterTableDialog");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
            },
            onChange : function(oEvent){
                // debugger;
                var rgaQuntity = oEvent.getSource().getValue();
				var sObject = oEvent.getSource().getBindingContext("fragModel").getObject();
                this.sbIndex = parseInt(oEvent.getSource().getBindingContext("fragModel").getPath().split("/")[1]);
				if (rgaQuntity <= 0) {
					oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText("RGA quantity should not be zero");
                    // this.getView().byId("invoiceTableId").getItems()[this.sbIndex].getCells()[9];
                    flag = false;
					return;
				}
                 
                var invPerUnitPrice = parseInt(sObject.PRICE) / parseInt(sObject.INVOICE_QUANTITY);
                var rgaPrice = parseInt(invPerUnitPrice * rgaQuntity);
                // sObject.EXTENDED = rgaPrice;
                this.getView().getModel("fragModel").setProperty("/"+this.sbIndex+"/EXTENDED",rgaPrice);


                // this.getView().byId("invoiceTableId").getItems()[this.sbIndex].getCells()[9].setText(sObject.EXTENDED);
                
				if (sObject.INVOICE_QUANTITY < rgaQuntity) {
					oEvent.getSource().setValueState(sap.ui.core.ValueState.Error).setValueStateText(
						"RGA quantity should be less than invoice quantity");
                        flag = false;
                    // this.getView().byId("fragModel").getItems()[this.sbIndex].getCells()[8].setValue("");
                    // this.getView().byId("approveBt").setVisible(false);
				}else{
					oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                    flag = true;
                    // this.getView().byId("approveBt").setVisible(true);
				}
            }
        });
    });
