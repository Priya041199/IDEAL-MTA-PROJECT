sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "com/ibs/ibsappidealregistrationform/model/validations"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, MessageBox, BusyIndicator, validations) {
        "use strict";
        var context = null;
        var oView = null;
        var oRouter = null;
        var viewModel = null;
        var entityModel = null;
        var length = "";
        var appModulePath;
        var that = null;

        return BaseController.extend("com.ibs.ibsappidealregistrationform.controller.LoginPage", {
            onInit: function () {

                context = this;
                that = this;
                oView = context.getView();
                viewModel = new JSONModel();
                entityModel = new JSONModel();
                oRouter = this.getOwnerComponent().getRouter();

                // apply content density mode to root view
                // oView.addStyleClass(context.getOwnerComponent().getContentDensityClass());

                // context.oCloudSrvModel = context.getOwnerComponent().getModel("cloudService");

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);

               

                //this._getUserAttributes();

                var getRoute = oRouter.getRoute("RouteLoginPage");
                getRoute.attachPatternMatched(context._onObjectMatched, this);
            },
            _getUserAttributes: function () {

                var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                var appPath = appId.replaceAll(".", "/");
                appModulePath = jQuery.sap.getModulePath(appPath);
                var attr = appModulePath + "/user-api/attributes";
                var ouserAttriJson = new JSONModel();

                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: attr,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (results, response) {

                            var aLength = Object.keys(results).length;
                            var isMail = Object.keys(results).includes("email");

                            if (aLength > 0 && isMail === true) {

                                that._sUserID = results.email.toLowerCase().trim();
                                that._sUserName = results.firstname + " " + results.lastname;
                                var oModel = new JSONModel({
                                    userId: that._sUserID,
                                    userName: that._sUserName
                                });
                                context.getOwnerComponent().setModel(oModel, "userAttriJson");
                                //context.readRegisteredEmaailData(results.mail.trim());

                            }
                            else {
                                var obj = {};
                                ouserAttriJson.setData(obj);
                                context.getOwnerComponent().setModel(ouserAttriJson, "userAttriJson");

                            }
                        },
                        error: function (oError) {

                            MessageBox.error("Error while reading user attributes");
                        }
                    });
                });

            },
            _onObjectMatched: function (oEvent) {

                oView.byId("email_ID").setValue("");
                context.setViewModel();

                // if (this.getOwnerComponent().getModel("paramJson") === undefined) {
                //     this.getView().byId("bBtnId").setVisible(false);
                // } else {
                //     var getParams = this.getOwnerComponent().getModel("paramJson").getData();
                //     if (getParams.bIndicator === "X") {
                //         this.getView().byId("bBtnId").setVisible(true);
                //     } else {
                //         this.getView().byId("bBtnId").setVisible(false);
                //     }
                // }

                if (this.getOwnerComponent().getModel("userAttriJson") === undefined) {
                    var obj = {};
                    var ouserAttriJson = new JSONModel();
                    ouserAttriJson.setData(obj);
                    context.getOwnerComponent().setModel(ouserAttriJson, "userAttriJson");
                }
            },
            generateSecurityPIN: function () {

                var regEmailId = this.getView().byId("email_ID").getValue();
                if (regEmailId !== "") {
                    context.readRegisteredEmaailData(regEmailId.toLowerCase().trim(), "SP");
                    //oView.byId("otpId").setEditable(true);
                } else {
                    MessageBox.information("Enter Registered Email");
                }
            },

            setViewModel: function () {

                var obj = {
                    "entityId": null
                };
                viewModel.setData(obj);
                context.getOwnerComponent().setModel(viewModel, "viewModel");
            },

            onOTPChange: function (oEvent) {

                var sEmail = undefined;
                var input = oEvent.getParameter("value");
                context.readSupplierSecPIN(sEmail, input);
            },

            readRegisteredEmaailData: function (RegisteredMail, sIndicator) {

                var registeredData = {};
                var loginData = null;
                var filterArr = [];

                var sREGISTERED_ID = "(REGISTERED_ID eq '" + RegisteredMail.trim() + "')";
                var sStatus = "((STATUS eq 2) or (STATUS eq 3) or (STATUS eq 4) or (STATUS eq 5) or (STATUS eq 6) or (STATUS eq 7) or (STATUS eq 8) or (STATUS eq 9) or (STATUS eq 10) or (STATUS eq 11))";
                filterArr = sREGISTERED_ID + " and " + sStatus;
                //var url = appModulePath + "/odata/v4/registration-process/RequestInfo?$top=1&$filter=" + filterArr;
                var url = appModulePath + "/odata/v4/ideal-registration-form-srv/RequestInfo?$top=1&$orderby=REQUEST_NO desc&$filter=" + filterArr;

                BusyIndicator.show();

                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: 'application/json',

                    success: function (oData, response) {

                        BusyIndicator.hide();
                        if (oData.value.length > 0 && sIndicator === "EC") {
                            return;
                        }
                        else if (oData.value.length > 0 && sIndicator === "SP") {
                            context.createSecPIN(RegisteredMail.trim(), oData.value[0]);
                        }
                        else if (oData.value.length > 0 && sIndicator === "L") {
                            var currentData = null;

                            that._sUserID = RegisteredMail.trim();
                            that._sUserName = RegisteredMail.trim();
                            var oModel = new JSONModel({
                                userId: that._sUserID,
                                userName: that._sUserName
                            });
                            context.getOwnerComponent().setModel(oModel, "userAttriJson");

                            if (oView.getModel("secPINJson") === undefined) {
                                MessageBox.error("Invalid Security PIN entered");
                                oView.byId("otpId").setValue("");
                                return;
                            }
                            var secPinData = oView.getModel("secPINJson").getData(); //26/05/22
                            var userSecPin = oView.byId("otpId").getValue();

                            var currentTime = new Date().getTime();
                            var createdOn = new Date(secPinData.CREATED_ON);
                            var timeDiff = currentTime - createdOn.getTime();

                            if (timeDiff > 600000) {
                                MessageBox.error("Security PIN Expired, please regenerate the PIN");
                                oView.byId("otpId").setValue("");
                                return;
                            } else if(secPinData.IS_MATCH !== true) {
                                MessageBox.error("Invalid Security PIN entered");
                                oView.byId("otpId").setValue("");
                                return;
                            }

                            if (oData.value[0].STATUS === 2 || oData.value[0].STATUS === 4 || oData.value[0].STATUS === 7) {
                                currentData = oData.value[0];
                                registeredData.REQUEST_NO = oData.value[0].REQUEST_NO;
                                registeredData.MOBILE_NO = oData.value[0].MOBILE_NO;
                                registeredData.ENTITY_CODE = oData.value[0].ENTITY_CODE;
                                registeredData.REGISTERED_ID = oData.value[0].REGISTERED_ID;
                                registeredData.DIST_NAME1 = oData.value[0].DIST_NAME1;
                                registeredData.REQUEST_TYPE = oData.value[0].REQUEST_TYPE;
                                registeredData.STATUS = oData.value[0].STATUS;
                                registeredData.CREATION_TYPE = oData.value[0].CREATION_TYPE;
                                registeredData.IDEAL_DIST_CODE = oData.value[0].IDEAL_DIST_CODE;
                                registeredData.SAP_DIST_CODE = oData.value[0].SAP_DIST_CODE;
                                registeredData.REQUESTER_ID = oData.value[0].REQUESTER_ID;
                                registeredData.BP_TYPE_CODE = oData.value[0].BP_TYPE_CODE;
                                registeredData.BP_TYPE_DESC = oData.value[0].BP_TYPE_DESC;
                                registeredData.DIST_CODE = oData.value[0].DIST_CODE;
                                registeredData.NDA_TYPE = oData.value[0].NDA_TYPE;
                                registeredData.REMINDER_COUNT = oData.value[0].REMINDER_COUNT;
                                registeredData.BUYER_ASSIGN_CHECK = oData.value[0].BUYER_ASSIGN_CHECK;
                                registeredData.CREATED_ON = oData.value[0].CREATED_ON;
                                registeredData.COMMENT = oData.value[0].COMMENT;
                                registeredData.LEGACY_ID = oData.value[0].LEGACY_ID;
                                viewModel.setData(registeredData);
                                context.getOwnerComponent().setModel(viewModel, "loginData");

                            } else {
                                currentData = oData.value[0];
                                viewModel.setData(currentData);
                                context.getOwnerComponent().setModel(viewModel, "loginData");
                            }

                            if ((oData.value[0].STATUS === 2 || oData.value[0].STATUS === 4 || oData.value[0].STATUS === 7) && (oData.value[0].STATUS !== 8)) {
                                oRouter.navTo("instructionView", true);
                                BusyIndicator.show();
                                oView.byId("otpId").setValue("");
                            } else if (oData.value[0].STATUS === 3 || oData.value[0].STATUS === 8) {
                                MessageBox.warning("Your request has been rejected. You are not allowed to fill the form");
                                return;
                            } else {
                                jQuery.sap.delayedCall(100, this, function () {
                                    oView.byId("otpId").setValue("");
                                    BusyIndicator.show();
                                    oRouter.navTo("displayForm", true);
                                });
                            }
                        }
                    },
                    error: function (error) {

                        BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        if (context.isValidJsonString(error.responseText)) {
                            oXML = JSON.parse(error.responseText);
                            oXMLMsg = oXML.error["message"];
                        } else {
                            oXMLMsg = error.responseText;
                        }
                        MessageBox.error(oXMLMsg);
                    }
                });
            },

            createSecPIN: function (sEmail, registaredData) {

                var VName = registaredData.DIST_NAME1;
                var VEmail = registaredData.REGISTERED_ID;
                var Req_ID = registaredData.REQUESTER_ID;
                var path = appModulePath + "/odata/v4/ideal-registration-form-srv/GetSecurityPin(distributorName='" + VName + "',distributorEmail='" + VEmail + "',requesterId='" + Req_ID + "',userId='" + that._sUserID + "',userRole='CM')";

                BusyIndicator.show();

                $.ajax({
                    url: path,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (oData, responce) {

                        BusyIndicator.hide();
                        sap.m.MessageBox.information("Security PIN sent to email Id :" + sEmail.toLowerCase() +
                            " and the PIN will expire after 10 minutes");
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

            // handleLogin: function (oEvent) {
            //     
            //     var registeredMail = oView.byId("email_ID").getValue();
            //     var secPin = oView.byId("otpId").getValue();

            //     if (registeredMail === "" && secPin === "") {
            //         MessageBox.warning("Enter 'Registered Email Address' and 'Security PIN'");
            //         return;
            //     } else if (registeredMail === "") {
            //         MessageBox.warning("Enter Registered Email Address");
            //         return;
            //     } else if (secPin === "") {
            //         MessageBox.warning("Enter Security PIN");
            //         return;
            //     } else {
            //         var path = appModulePath + "/odata/v4/registration-process/CheckSecurityPin(vendorEmail='" + registeredMail.trim() + "',securityPin='" + secPin + "',userId='" + that._sUserID + "',userRole='VENDOR')";
            //         BusyIndicator.show();
            //         $.ajax({
            //             url: path,
            //             type: 'GET',
            //             contentType: 'application/json',
            //             success: function (oData, responce) {
            //                
            //                 BusyIndicator.hide();
            //                 if(oData !== undefined){
            //                     var osecPINJson = new JSONModel();
            //                     osecPINJson.setData(oData);
            //                     context.getView().setModel(osecPINJson, "secPINJson");
            //                     context.readRegisteredEmaailData(registeredMail.toLowerCase(), "L");
            //                 }
            //             },
            //             error: function (error) {
            //                 
            //                 BusyIndicator.hide();
            //                 var oXMLMsg, oXML;
            //                 if (context.isValidJsonString(error.responseText)) {
            //                     oXML = JSON.parse(error.responseText);
            //                     oXMLMsg = oXML.error["message"];
            //                 } else {
            //                     oXMLMsg = error.responseText
            //                 }
            //                 oView.byId("otpId").setValue("");
            //                 MessageBox.error(oXMLMsg);
            //             }
            //         });

            //         //     context.readRegisteredEmaailData(registeredMail.toLowerCase(), "L");

            //     }
            // },
            validateEmail: function (oEvent) {
                
                validations._validateEmail(oEvent);
                var oSource = oEvent.getSource();
                var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(oSource.getValue());
                if (reg === true && (oSource.getValue() !== "" || oSource.getValue() !== null)) {

                    var email = oSource.getValue();
                    email = email.trim();
                    email = email.toLowerCase();
                    oSource.setValue(email);
                    oSource.setValueState(sap.ui.core.ValueState.None);

                    context.readRegisteredEmaailData(email, "EC");
                    this.emailId = email;
                    // context.readSupplierSecPIN(email);
                } else {
                    //	oSource.setValue("");
                    oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid email address");
                }

            },
            handleLogin: function (oEvent) {

                var registeredMail = oView.byId("email_ID").getValue();
                var secPin = oView.byId("otpId").getValue();

                if (registeredMail === "" && secPin === "") {
                    MessageBox.warning("Enter 'Registered Email Address' and 'Security PIN'");
                    return;
                } else if (registeredMail === "") {
                    MessageBox.warning("Enter Registered Email Address");
                    return;
                } else if (secPin === "") {
                    MessageBox.warning("Enter Security PIN");
                    return;
                } else {
                    var path = appModulePath + "/odata/v4/ideal-registration-form-srv/CheckSecurityPin(distributorEmail='" + registeredMail.trim() + "',securityPin='" + secPin + "',userId='" + that._sUserID + "',userRole='CM')";
                    BusyIndicator.show();
                    $.ajax({
                        url: path,
                        type: 'GET',
                        contentType: 'application/json',
                        success: function (oData, responce) {

                            BusyIndicator.hide();
                            if (oData !== undefined) {
                                var osecPINJson = new JSONModel();
                                osecPINJson.setData(oData);
                                context.getView().setModel(osecPINJson, "secPINJson");
                                context.readRegisteredEmaailData(registeredMail.toLowerCase(), "L");
                            }
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
                            oView.byId("otpId").setValue("");
                            MessageBox.error(oXMLMsg);
                        }
                    });

                    //     context.readRegisteredEmaailData(registeredMail.toLowerCase(), "L");

                }
            },

            readSupplierSecPIN: function (sEmail, input) {

                var input = this.getView().byId("otpId").getValue();
                var oSecPin;
                if (input === "" || input === undefined) {
                    oSecPin = null;
                } else {
                    oSecPin = input;
                }

                if (sEmail === undefined) {
                    var sEmail = this.emailId;
                }

                var path;
                if (oSecPin === null) {
                    path = appModulePath + "/odata/v4/ideal-registration-form-srv/CheckSecurityPin(distributorEmail='" + sEmail.trim() + "',securityPin=" + oSecPin + ",userId='" + that._sUserID + "',userRole='CM')";
                } else {
                    path = appModulePath + "/odata/v4/ideal-registration-form-srv/CheckSecurityPin(distributorEmail='" + sEmail.trim() + "',securityPin='" + oSecPin + "',userId='" + that._sUserID + "',userRole='CM')";
                }

                BusyIndicator.show();

                $.ajax({
                    url: path,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (oData, responce) {

                        BusyIndicator.hide();
                        if (oData !== undefined) {
                            if (oData.IS_MATCH) {
                                var osecPINJson = new JSONModel();
                                osecPINJson.setData(oData);
                                context.getView().setModel(osecPINJson, "secPINJson");
                            }
                        }
                    },
                    error: function (error) {

                        BusyIndicator.hide();
                        var oXMLMsg, oXML;
                        // if (context.isValidJsonString(error.responseText)) {
                        //     oXML = JSON.parse(error.responseText);
                        //     oXMLMsg = oXML.error["message"];
                        // } else {
                        //     oXMLMsg = error.responseText
                        // }
                        var err = JSON.parse(error.responseText).error.message;
                        MessageBox.error(err);

                    }
                });
            },
            onEyeChange: function (oEvent) {
                // 
                if (oEvent.getSource().getValueHelpIconSrc() === 'sap-icon://hide') {
                    oEvent.getSource().setValueHelpIconSrc('sap-icon://show');
                    oEvent.getSource().setType('Text');
                }
                else if (oEvent.getSource().getValueHelpIconSrc() === 'sap-icon://show') {
                    oEvent.getSource().setValueHelpIconSrc('sap-icon://hide');
                    oEvent.getSource().setType('Password');
                }
            },
        });
    });
