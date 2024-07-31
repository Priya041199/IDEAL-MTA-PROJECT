sap.ui.define([
    "./BaseController",
    // "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
	"sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "com/ibs/ibsappidealclaimrequestcreation/model/formatter",
    "com/ibs/ibsappidealclaimrequestcreation/model/down"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,MessageBox,MessageToast,BusyIndicator,JSONModel,formatter,down) {
        "use strict";
        var that;
        var claimFrom; 
        var attachdata = [];
        var fModel;
        var blanckJsonModel;
        var userData;
        var claimAttachMapJson;
        var sUserRole = [];
        return BaseController.extend("com.ibs.ibsappidealclaimrequestcreation.controller.CreateRequest", {
            formatter: formatter,
            onInit: function () {
                // debugger;
                that=this;
                that.oDataModel = this.getOwnerComponent().getModel("onPremiseModel");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.getRoute("CreateRequest").attachMatched(this._onRouteMatched, this);
            },
            _onRouteMatched :  function(){
                // debugger;
                var sLoginId = '1100013';
                that.readInvoiceDataS4Hana();
                var blankObject = {
                    "customer": null,
                    "salesAssociate": null,
                    "claimFrom": null,
                    "claimTo": null,
                    "businessUnit": null,
                    "typeOfClaim": null,
                    "claimReason" : null
                };
                blanckJsonModel = new JSONModel(blankObject);
			    that.getView().setModel(blanckJsonModel, "blankJson");
                // that._readClaimAttachments(sLoginId);
                this.readAttachData();
                userData = this.getOwnerComponent().getModel("userModel").getData();
                var g = this.getView().getParent().getParent(); 
                g.toBeginColumnPage(this.getView())

                var oMinDateModel = new JSONModel({
                    minDate: new Date()
                });
                that.getView().setModel(oMinDateModel, "minDateModel");

                this.readMasterIdealUser();
            },
            onBack : function(){
                // debugger;
                if(blanckJsonModel !== undefined){
                    // this.getView().getModel("blankJson").setData("");
                    blanckJsonModel.setData(null);
                }

                if(fModel !== undefined){
                    this.getView().getModel("fragModel").setData("");
                    this.getView().byId("invoiceNumber").setValue("")
                }

                if(claimAttachMapJson !== undefined){
                    claimAttachMapJson.setData(null)
                }

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteMasterPage");
            },
            _readClaimAttachments: function (claimNumber) {
				var that = this;
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);
                var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/ClaimAttachments?$filter=CR_NO eq "+ claimNumber +"";

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: null,
                    contentType: 'application/json',
                    success: function (data, responce) {
                        // debugger;
                        data.value.FILE_CONTENT = "";
                        data.value.FILE_MIMETYPE = "";
                        data.value.FILE_NAME = "";

                        var attachJson = new JSONModel();
						that.attachmentData = data;
						attachJson.setData(data);
						that.getView().setModel(attachJson, "attachJson");
						that.getView().byId("priceDifferentTable").setVisibleRowCount(data.value.length);
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
            handleClaimType : function(oEvent){
                // debugger;
                var unit = this.getView().byId("bUnit").getSelectedKey();
                if(unit === "" || unit === undefined || unit === null){
                    MessageBox.warning("Please Select Business Unit",{
                        actions: [MessageBox.Action.OK],
                        onClose: function (oAction) {
                            that.getView().byId("typeofClaim").setValue("");
                        }
                    });

                }else{
                    var claimType = this.getView().byId("typeofClaim").getSelectedKey(); 
                    this.getView().byId("priceDifferent").setVisible(true);
                    this.getView().getModel("blankJson").setProperty("/businessUnit",unit)
                    this.getView().getModel("blankJson").setProperty("/typeOfClaim",claimType)
					// this.getView().byId("attachsId").setVisible(true);
                }
            },
            readAttachData : function(unit){
                // debugger;
                // if(unit != ""){
                    attachdata = [{
                        "ATTACH_CODE": 1,
                        "ATTACH_NO": 1,
                        "ATTACH_NAME": "Invoice"
                    }]
                // }

                claimAttachMapJson = new JSONModel();
                claimAttachMapJson.setData(attachdata);
                this.getView().setModel(claimAttachMapJson, "claimAttachMapJson");
            },
            onClaimFrom : function(oEvent){
                claimFrom = oEvent.getSource().mProperties.dateValue;
                this.getView().getModel("blankJson").setProperty("/claimFrom",claimFrom)
            },
            onClaimTo : function(oEvent){
                var claimTo = oEvent.getSource().mProperties.dateValue;
                var oDate = new Date(claimFrom);
                var sDate = oDate.toISOString().split('T')[0];

                var oDate2 = new Date(claimTo);
                var sDate2 = oDate2.toISOString().split('T')[0];
                if(sDate < sDate2){
                    this.getView().getModel("blankJson").setProperty("/claimTo",claimTo)
                }else{
                    MessageBox.error("Please Select Correct Date",{
                        actions: [MessageBox.Action.OK],
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                               that.getView().byId("DP2").setValue("");
                            }
                        }
                    });
                }
            },
            onReason : function(oEvent){
                // debugger;
                var reason = oEvent.getSource().getValue();
                this.getView().getModel("blankJson").setProperty("/claimReason",reason)
            },
            handleBUnit : function(oEvent){
                // debugger;
                var unit = oEvent.getSource().getSelectedKey();
                this.getView().getModel("blankJson").setProperty("/businessUnit",unit)
            },
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
                            // BusyIndicator.hide(0);
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
                // }
            },
            handleInvoiceDialog : function(){
                // debugger;
                // BusyIndicator.show(0);
			if (!this.invoiceDialog) {
				this.invoiceDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealclaimrequestcreation.view.fragment.invoiceAdd", this);
				this.getView().addDependent(this.invoiceDialog);
			}
			// BusyIndicator.hide();
			this.invoiceDialog.open();
            },
            closeAddInvoiceDialog: function () {
                this.invoiceDialog.close();
                this.invoiceDialog.destroy();
                this.invoiceDialog = null;
                // if()
                this.getView().getModel("itemModel").setData(null);
                // this.invoiceDialog.null();
            },
            invoiceItemsDialog : function(){
                this.itemsDialog = undefined;
                if (!this.itemsDialog) {
                    this.itemsDialog = new sap.ui.xmlfragment("com.ibs.ibsappidealclaimrequestcreation.view.fragment.invoiceItems", this);
                    this.getView().addDependent(this.itemsDialog);
                }
                // BusyIndicator.hide();
                this.itemsDialog.open();
            },
            closeInvoiceItemDialog : function(){
                this.itemsDialog.close();
                this.itemsDialog.destroy();
                this.itemsDialog = null;
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
                           var oModel = new JSONModel(data);
                           that.getView().setModel(oModel,"itemModel");

                           sap.ui.getCore().byId("itemsTableId").setVisibleRowCount(data.results.length);
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
            addInvoice : function(oEvent){
                // debugger;
                
                var checkLength = sap.ui.getCore().byId("itemsTableId").getSelectedIndices();
                var newData = [];
                // var newArray = [];
                if(checkLength.length === 0){
                    MessageBox.error("Please select invoice items");
                }else{
                    var data = this.getView().getModel("itemModel").getData();
                    this.getView().byId("invoiceNumber").setValue(data.results[0].Vbeln);
                    // if(checkLength.length > 1){
                        for(var i=0;i<checkLength.length;i++){
                            var len = checkLength[i];
                            newData.push(data.results[len]);
                            // fModel = new JSONModel(newData);
                            // that.getView().setModel(fModel,"fragModel");
                        }
                        this.invoiceDialog.destroy();
                this.invoiceDialog = null;

                fModel = new JSONModel(newData);
                that.getView().setModel(fModel,"fragModel");

                that.getView().byId("invoiceTableId").setVisibleRowCount(newData.length);
                this.getView().getModel("itemModel").setData(null);
                // }
                // else{

                //     var len = checkLength[0];
                //     fModel = new JSONModel(data.results);
                //     that.getView().setModel(fModel,"fragModel");

                // that.getView().byId("invoiceTableId").setVisibleRowCount(len);
                // this.getView().getModel("itemModel").setData(null);

                // this.invoiceDialog.destroy();
                // this.invoiceDialog = null;
                // }

                // this.invoiceDialog.destroy();
                // this.invoiceDialog = null;

                // fModel = new JSONModel(data);
                // that.getView().setModel(fModel,"fragModel");

                // that.getView().byId("invoiceTableId").setVisibleRowCount(data.results.length);
                // this.getView().getModel("itemModel").setData(null);

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
            onSubmtit : function(oEvent){
                // debugger;
                // this.sbIndex = parseInt(oEvent.getSource().getBindingContext("claimAttachMapJson").getPath().split("/")[1]);
                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                var appModulePath = jQuery.sap.getModulePath(appPath);

                var attachData = this.getView().getModel("claimAttachMapJson").getData();
                var cFrom = this.getView().byId("DP1").getDateValue();
                var cTo = this.getView().byId("DP2").getDateValue();
                var bUnit = this.getView().byId("bUnit").getSelectedKey();
                var typeClaim = this.getView().byId("typeofClaim").getSelectedKey();
                
                if(cFrom === "" || cTo === "" || bUnit === "" || typeClaim === ""){
                    MessageBox.warning("Please fill mandatory field")
                    return;
                }else if(attachData[0].FILE_CONTENT === undefined || attachData[0].FILE_MIMETYPE === undefined){
                    MessageBox.warning("Please Upload file");
                    return;
                }
                // commented for hard coded testing
                else if(this.getView().byId("invoiceNumber").getValue() === ""){
                    // if ( === "") {
                        MessageBox.warning("Please select the invoice number");
                        return;
                    // }
                }
                else if(this.getView().byId("reasonText").getValue() === ""){
                    MessageBox.warning("Please enter the claim reason");
                    return;
                }else{

                // }
                BusyIndicator.show();
                var url = appModulePath + "/odata/v4/ideal-claim-creation-srv/CreateClaimReq";
                var headerData = this.getView().getModel("blankJson").getData();
                
                // commented for hard coded testing 
                var itemsData = this.getView().getModel("fragModel").getData();

                if (headerData.claimFrom){
                    var oDate = new Date(headerData.claimFrom);
                    var sDate = oDate.toISOString().split('T')[0];
                }
                if (headerData.claimTo){
                    var oDate1 = new Date(headerData.claimTo);
                    var sDate1 = oDate1.toISOString().split('T')[0];
                }

                // // edited for hard coded testing
                if (itemsData[0].Fkdat){
                    var oDate3 = new Date(itemsData[0].Fkdat);
                    var sDate3 = oDate3.toISOString().split('T')[0];
                }

                var type = that.getReqformat(typeClaim);

                var headerPaylod=[{
                        "CR_NO":1,
                        "DISTRIBUTOR_ID" : "1100013",
                        "DISTRIBUTOR_NAME" : "Star Enterprise",
                        "CLAIM_TYPE": type,
                        "CLAIM_DESC" : typeClaim,
                        "CLAIM_REASON": headerData.claimReason,
                        "CLAIM_FROM": sDate,
                        "CLAIM_TO": sDate1,
                        "STATUS":1,
                        "APPROVER_LEVEL":null,
                        "APPROVER_ROLE":null,
                        // "NEXT_APPROVER":null,
                        "SALES_ASSOCIATE_ID":"5035",
                        "REGION_CODE":"T",
                        "SAP_CREDIT_NOTE":"",
                        "LAST_UPDATED":null,
                        "CREATED_ON":null
                    }]

                var itemsPaylod = []

                // COMMENTED FOR TESTING PURPOSE
                for(var i=0;i<itemsData.length;i++){
                    
                    let value = itemsData[i].Fkimg;
                    let intValue = Math.floor(value);

                    var item={
                        "CR_NO":1,
                        "ITEM_NO":1,
                        "ITEM_CODE":itemsData[i].Matnr,
                        "ITEM_DESC" : itemsData[i].Arktx,
                        "HOSPITAL_CODE":123,
                        "INVOICE_NO":Number(itemsData[i].Vbeln),
                        "INVOICE_DATE":sDate3,
                        "INVOICE_QUANTITY": intValue,
                        "INVOICE_RATE":Number(itemsData[i].Rate),
                        "REQUESTED_RATE":Number(itemsData[i].Rate),
                        "REQUESTED_QUANTITY" : intValue,
                        "REQUESTED_AMOUNT":Number(itemsData[i].Netwr),
                        "PROCESSSED_RATE":10.00,
                        "PROCESSSED_QUANTITY":1,
                        "PROCESSSED_AMOUNT":100.00
                    }
                    itemsPaylod.push(item);
                }

                var attachmentsPayload = [{
                    "CR_NO" : 1,
                    "ATTACH_CODE" : attachData[0].ATTACH_CODE,
                    "FILE_ID" : 1,
                    "FILE_NAME" : attachData[0].FILE_NAME,
                    "FILE_TYPE" : attachData[0].FILE_TYPE,
                    "FILE_MIMETYPE" : attachData[0].FILE_MIMETYPE,
                    "FILE_CONTENT" : attachData[0].FILE_CONTENT,
                    "UPLOAD_DATE" : new Date()
            
                }]

                var payload = {
                    "action": "CREATE",
                    "appType":"CR",
                    "crHeader": headerPaylod,
                    "crItems": itemsPaylod,
                    "crAttachments": attachmentsPayload,
                        // "CR_NO" : 1,
                        // "ATTACH_CODE" : 1,
                        // "FILE_ID" : 1,
                        // "FILE_NAME" : "",
                        // "FILE_TYPE" : "",
                        // "FILE_MIMETYPE" : "",
                        // "FILE_CONTENT" : "",
                        // "UPLOAD_DATE" : null
                
                    // }],
                    "crEvent": [{
                        "CR_NO": 1,
                        "EVENT_NO": 1,
                        "EVENT_CODE": 1,
                        "USER_ID": "starenterprize@gmail.com",
                        "USER_ROLE": "DIST",
                        "USER_NAME": "Star Enterprise",
                        "REMARK":"Claim Request Created",
                        "COMMENT": headerData.claimReason,
                        "CREATION_DATE": null
                    }],   
                    "userDetails": {
                        "USER_ROLE": "DIST",
                        "USER_ID": "starenterprize@gmail.com"
                    }
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
                        MessageBox.success(data.value.OUT_SUCCESS, {
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {
								if (oAction === "OK") {
                                    BusyIndicator.hide();

                                    // commented for testing purpose
                                    that.getView().getModel("fragModel").setData("");
                                    that.getView().byId("DP1").setValue("");
                                    that.getView().byId("DP2").setValue("");
                                    that.getView().byId("bUnit").setSelectedKey("");
                                    that.getView().byId("typeofClaim").setSelectedKey("");
                                    that.getView().byId("reasonText").setValue("");
                                    that.getView().getModel("appView").setProperty("/layout", "OneColumn");
                                    var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                    oRouter.navTo("RouteMasterPage");
								}
							}
						});
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
            }
            },
            downloadFileContent: function (oEvent) {
                this.sbIndex = parseInt(oEvent.getSource().getBindingContext("claimAttachMapJson").getPath().split("/")[1]);
                var aFilter = [],
                fileContent = null;

                var data = this.getView().getModel("claimAttachMapJson").getData()[this.sbIndex];

                // if(data.FILE_MIMETYPE === "text/plain")
                // {
                // 	var sFILE_CONTENT = atob(data.FILE_CONTENT);
                // }
                // sFILE_CONTENT = atob(data.FILE_CONTENT);
                // sFILE_CONTENT = sFILE_CONTENT;
                this.downloadAttachment(data.FILE_CONTENT, data.FILE_NAME, data.FILE_MIMETYPE);
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
            onDelete : function(oEvent){
                // debugger;
                this.sbIndex = parseInt(oEvent.getSource().getBindingContext("claimAttachMapJson").getPath().split("/")[1]);
                var oArray = this.getView().getModel("claimAttachMapJson").oData;
                MessageBox.information("Are you sure you want to delete the file ?",{
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (Action) {
                        if(Action === "YES"){
                            // oArray.splice(this.sbIndex, 1);
                            var oModel = that.getView().getModel("claimAttachMapJson").getData()[that.sbIndex];

							oModel.FILE_CONTENT = null;
						    oModel.FILE_NAME = "";
							oModel.FILE_MIMETYPE = null;
                            oModel.FILE_TYPE = "";
							// oModel.ATTACH_VALUE = null;
							// oModel.EXPIRY_DATE = null;
                            var enabledownload=that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[3];
							enabledownload.setEnabled(false);

                            var enableDelete=that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[4];
							enableDelete.setEnabled(false);

                            var enableUpload=that.getView().byId("priceDifferentTable").getItems()[that.sbIndex].getCells()[1];
							enableUpload.setEnabled(true);
                            // that.getView().getModel("claimAttachMapJson").setData("");
                            that.getView().getModel("claimAttachMapJson").refresh(true);
                        }
                }
            });
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
            }

        });
    });
