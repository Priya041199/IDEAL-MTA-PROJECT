sap.ui.define([], function () {
	"use strict";
	return {

		_charactersValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[A-Za-z\s]+$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only alphabets");
			}
		},

		_validateMobileNum: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[- +()]*[0-9][- +()0-9]*$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid mobile number");
			}
		},

		_validateEmail: function (oEvent) {
			// var oSource = oEvent.getSource();
			// var reg = /^[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}$/
			// .test(oSource.getValue());
			// 	// /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				
			// if (reg === true || oSource.getValue() === "") {
			// 	oSource.setValueState(sap.ui.core.ValueState.None);
			// } else {
			// 	oEvent.getSource().setValue("");
			// 	oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid email address");
			// }

			var oSource = oEvent.getSource();
			var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(oSource.getValue());
			
			if (reg === true && (oSource.getValue() !== "" || oSource.getValue() !== null)) {
				var email = oSource.getValue();
				email.trim();
				oSource.setValue(email);
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid email address");
			}
		},

		_numberValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]+$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only numbers");
			}
		},

		benificiaryNameValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[A-Za-z0-9? ,_-]+$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
			}
		},

		alphaNumaricVaidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^\s*([0-9a-zA-Z]*)\s*$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
			}
		},

		tradeLicenseValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^\s*([0-9a-zA-Z-./]*)\s*$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
			}
		},

		designationValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^\s*([0-9a-zA-Z\s-&/]*)\s*$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Only -, &, and / allowed");
			}
		},

		VATRegNumValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			//var reg = /^[0-9]+$/.test(oSource.getValue());
			var reg = /^\s*([0-9a-zA-Z -]*)\s*$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
				if ((oSource.getValue() !== "" || oSource.getValue() !== null) && oSource.getValue().indexOf(" ") >= 0) {
					oSource.setValue(oSource.getValue().replaceAll(" ", ""));
				}
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
			}

			if (oSource.getValue().length > 15) {
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Only 15 digits are allowed");
				oEvent.getSource().setValue("");
			}

		},

		postalCodeValidation: function (oEvent, postalCodeLength) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]+$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only numbers");
				return;
			}

			if (!isNaN(postalCodeLength)) {
				if (oSource.getValue().length !== postalCodeLength && oSource.getValue().length !== 0) {
					oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code with " + postalCodeLength +
						" digits");
					oEvent.getSource().setValue("");
				}
			} else {
				oSource.setValueState(sap.ui.core.ValueState.None);
			}
		},

		_IBANValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
				if ((oSource.getValue() !== "" || oSource.getValue() !== null) && oSource.getValue().indexOf(" ") >= 0) {
					oSource.setValue(oSource.getValue().replaceAll(" ", ""));
				}
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Valid IBAN Number");
			}
		},

		_SWIFTCodeValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Valid SWIFT Code");
			}
		},

		floatValidation: function (oEvent) {
			var oSource = oEvent.getSource();
			var reg = /^[0-9]*\.?[0-9]*$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid percentage");
			}
		},

		checkIFEmpty: function (value, vModelId, mandatoryId) {
			var flag = false;
			if ((value === null || value === "" || value === undefined) && vModelId === "X" && mandatoryId === "X") {
				flag = true;
			}
			return flag;
		},
		//5/22
		checkOtherBankValues: function (sValue) {
			var flag = false;
			if (sValue === null || sValue === "" || sValue === undefined) {
				flag = true;
			}

			return flag;
		},

		_validateFirstSection: function (array_s1, headerData, data, vModel, mandatoryModel) {
			// debugger;
			//var array_s1 = [];
			if ((headerData[0].DIST_NAME1 === "" && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X") ||
				(headerData[0].DIST_NAME1 === null && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X") ||
				(headerData[0].DIST_NAME1 === undefined && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X")) {
				array_s1.push({
					"section": 1,
					"description": "Enter Distributor Name",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"vInfo"
				});
			}

			// if ((headerData[0].DIST_NAME2 === "" && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X") ||
			// 	(headerData[0].DIST_NAME2 === null && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X") ||
			// 	(headerData[0].DIST_NAME2 === undefined && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X")) {
			// 	array_s1.push({
			// 		"section": 1,
			// 		"description": "Enter Vendor Name In Arabic",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"vInfo"
			// 	});
			// }

			if ((headerData[0].WEBSITE === "" && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X") ||
				(headerData[0].WEBSITE === null && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X") ||
				(headerData[0].WEBSITE === undefined && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X")) {
				array_s1.push({
					"section": 1,
					"description": "Enter Website",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"vInfo"
				});
			}
			var subTitleString = [];
			// if ((this.checkIFEmpty(data.address.HOUSE_NUM1, vModel.S1G1T1F3, mandatoryModel.S1G1T1F3))) {

			// 	subTitleString.push("Street No");
			// }
			if ((this.checkIFEmpty(data.address.STREET1, vModel.S1G2T1F1, mandatoryModel.S1G2T1F1))) {
				subTitleString.push("Street 1");
			}
			if (this.checkIFEmpty(data.address.STREET2, vModel.S1G2T1F2, mandatoryModel.S1G2T1F2)) {

				subTitleString.push("Street 2");
			}
			if (this.checkIFEmpty(data.address.STREET3, vModel.S1G2T1F3, mandatoryModel.S1G2T1F3)) {

				subTitleString.push("Street 3");
			}

			if (this.checkIFEmpty(data.address.STREET4, vModel.S1G2T1F4, mandatoryModel.S1G2T1F4)) {

				subTitleString.push("Street 4");
			}
			if (this.checkIFEmpty(data.address.EMAIL, vModel.S1G2T1F5, mandatoryModel.S1G2T1F5)) {
				subTitleString.push("Email");
			}
			if (this.checkIFEmpty(data.address.COUNTRY, vModel.S1G2T1F6, mandatoryModel.S1G2T1F6)) {

				subTitleString.push("Country");
			}
			if (this.checkIFEmpty(data.address.STATE, vModel.S1G2T1F7, mandatoryModel.S1G2T1F7)) {
				subTitleString.push("Region");
			}
			if (this.checkIFEmpty(data.address.CITY, vModel.S1G2T1F8, mandatoryModel.S1G2T1F8)) {
				subTitleString.push("City");
			}

			// if (this.checkIFEmpty(data.address.CONTACT_TELECODE, vModel.S1G1T1F8, mandatoryModel.S1G1T1F8)) {
			// 	subTitleString.push("Contact Telecode");
			// }
			if (this.checkIFEmpty(data.address.CONTACT_NO, vModel.S1G2T1F9, mandatoryModel.S1G2T1F9)) {
				subTitleString.push("Contact No");
			}
			if (this.checkIFEmpty(data.address.POSTAL_CODE, vModel.S1G2T1F10, mandatoryModel.S1G2T1F10)) {
				subTitleString.push("Postal Code");
			}
			if (subTitleString.length > 0) {
				array_s1.push({
					"section": 1,
					"description": "Enter Mandatory Distributor Address fields",
					"subtitle": subTitleString.toString(),
					"type": "Warning",
					"subsection":"vAddress"
				});
			}

			if (vModel.S1G3T1F11 === "X") {
				for (var i = 0; i < data.otherAddress.length; i++) {
					var address = data.otherAddress[i];

					if ((address.ADDRESS_TYPE === "REG" || address.ADDRESS_TYPE === "OTH") && vModel.S1G3T1F11 === "X") {
						var subTitleStringReg = [];

						if ((this.checkIFEmpty(address.STREET1, vModel.S1G3T1F1, mandatoryModel.S1G3T1F1))) {
							subTitleStringReg.push("Street 1");
						}
						if (this.checkIFEmpty(address.STREET2, vModel.S1G3T1F2, mandatoryModel.S1G3T1F2)) {

							subTitleStringReg.push("Street 2");
						}
						if (this.checkIFEmpty(address.STREET3, vModel.S1G3T1F3, mandatoryModel.S1G3T1F3)) {
							subTitleStringReg.push("Street 3");
						}

						if (this.checkIFEmpty(address.STREET4, vModel.S1G3T1F4, mandatoryModel.S1G3T1F4)) {
							subTitleStringReg.push("Street 4");
						}
						if (this.checkIFEmpty(address.EMAIL, vModel.S1G3T1F5, mandatoryModel.S1G3T1F5)) {
							subTitleStringReg.push("Email");
						}
						if (this.checkIFEmpty(address.COUNTRY, vModel.S1G3T1F6, mandatoryModel.S1G3T1F6)) {

							subTitleStringReg.push("Country");
						}
						if (this.checkIFEmpty(address.STATE, vModel.S1G3T1F7, mandatoryModel.S1G3T1F7)) {
							subTitleStringReg.push("Region");
						}
						if (this.checkIFEmpty(address.CITY, vModel.S1G3T1F8, mandatoryModel.S1G3T1F8)) {
							subTitleStringReg.push("City");
						}

						// if (this.checkIFEmpty(address.CONTACT_TELECODE, vModel.S1G1T2F8, mandatoryModel.S1G1T2F8)) {
						// 	subTitleStringReg.push("Contact Telecode");
						// }
						if (this.checkIFEmpty(address.CONTACT_NO, vModel.S1G3T1F9, mandatoryModel.S1G3T1F9)) {
							subTitleStringReg.push("Contact No");
						}
						if (this.checkIFEmpty(address.POSTAL_CODE, vModel.S1G3T1F10, mandatoryModel.S1G3T1F10)) {
							subTitleStringReg.push("Postal Code");
						}
						if (subTitleStringReg.length > 0) {
							array_s1.push({
								"section": 1,
								"description": "Enter Mandatory Other Office Address fields",
								"subtitle": subTitleStringReg.toString(),
								"type": "Warning",
								"subsection":"vAddress"
							});
						}
					}

				}
			}

			if (vModel.S1G4T1F10 === "X") {
				// if ((this.checkIFEmpty(data.MDContact.NAME1, vModel.S1G2T1F1, mandatoryModel.S1G2T1F1)) ||
				// 	(this.checkIFEmpty(data.MDContact.NAME2, vModel.S1G2T1F1, mandatoryModel.S1G2T1F1)) ||
				// 	(this.checkIFEmpty(data.MDContact.DESIGNATION, vModel.S1G2T1F2, mandatoryModel.S1G2T1F2)) ||
				// 	(this.checkIFEmpty(data.MDContact.EMAIL, vModel.S1G2T1F3, mandatoryModel.S1G2T1F3)) ||
				// 	(this.checkIFEmpty(data.MDContact.MOBILE_TELECODE, vModel.S1G2T1F5, mandatoryModel.S1G2T1F5)) ||
				// 	(this.checkIFEmpty(data.MDContact.MOBILE_NO, vModel.S1G2T1F5, mandatoryModel.S1G2T1F5)) ||
				// 	(this.checkIFEmpty(data.MDContact.CONTACT_TELECODE, vModel.S1G2T1F4, mandatoryModel.S1G2T1F4)) ||
				// 	(this.checkIFEmpty(data.MDContact.CONTACT_NO, vModel.S1G2T1F4, mandatoryModel.S1G2T1F4)) ||
				// 	(this.checkIFEmpty(data.MDContact.NATIONALITY, vModel.S1G2T1F6, mandatoryModel.S1G2T1F6)) ||
				// 	(this.checkIFEmpty(data.MDContact.CITY, vModel.S1G2T1F7, mandatoryModel.S1G2T1F7)) ||
				// 	(this.checkIFEmpty(data.MDContact.STATE, vModel.S1G2T1F8, mandatoryModel.S1G2T1F8)) ||
				// 	(this.checkIFEmpty(data.MDContact.POSTAL_CODE, vModel.S1G2T1F9, mandatoryModel.S1G2T1F9))) {
				// 	array_s1.push({
				// 		"section": 1,
				// 		"description": "Enter Head of the Company Contact Details",
				// 		"subtitle": "NAME, DESIGNATION, EMAIL, CONTACT_NO, MOBILE_NO, NATIONALITY, STATE, CITY, POSTAL CODE",
				// 		"type": "Warning"
				// 	});
				// }
				var subTitleStringMDcontact = []
				if ((this.checkIFEmpty(data.MDContact.NAME1, vModel.S1G4T1F1, mandatoryModel.S1G4T1F1))) {

					subTitleStringMDcontact.push("First Name");
				}
				if ((this.checkIFEmpty(data.MDContact.NAME2, vModel.S1G4T1F11, mandatoryModel.S1G4T1F11))) {
					subTitleStringMDcontact.push("Last Name");
				}
				if (this.checkIFEmpty(data.MDContact.DESIGNATION, vModel.S1G4T1F2, mandatoryModel.S1G4T1F2)) {

					subTitleStringMDcontact.push("Designation");
				}
				if (this.checkIFEmpty(data.MDContact.CONTACT_NO, vModel.S1G4T1F5, mandatoryModel.S1G4T1F5)) {

					subTitleStringMDcontact.push("Contact No");
				}
				if (this.checkIFEmpty(data.MDContact.MOBILE_NO, vModel.S1G4T1F6, mandatoryModel.S1G4T1F6)) {

					subTitleStringMDcontact.push("Mobile No");
				}
				if (this.checkIFEmpty(data.MDContact.EMAIL, vModel.S1G4T1F4, mandatoryModel.S1G4T1F4)) {

					subTitleStringMDcontact.push("Email");
				}

				if (this.checkIFEmpty(data.MDContact.NATIONALITY, vModel.S1G4T1F3, mandatoryModel.S1G4T1F3)) {

					subTitleStringMDcontact.push("Country");
				}
				if (this.checkIFEmpty(data.MDContact.STATE, vModel.S1G4T1F8, mandatoryModel.S1G4T1F8)) {

					subTitleStringMDcontact.push("Region");
				}
				if (this.checkIFEmpty(data.MDContact.CITY, vModel.S1G4T1F7, mandatoryModel.S1G4T1F7)) {

					subTitleStringMDcontact.push("City");
				}

				if (this.checkIFEmpty(data.MDContact.POSTAL_CODE, vModel.S1G4T1F9, mandatoryModel.S1G4T1F9)) {
					subTitleStringMDcontact.push("Postal Code");
				}

				if (this.checkIFEmpty(data.MDContact.CONTACT_TELECODE, vModel.S1G4T1F5, mandatoryModel.S1G4T1F5)) {

					subTitleStringMDcontact.push("Contact Telecode");
				}

				if (this.checkIFEmpty(data.MDContact.MOBILE_TELECODE, vModel.S1G4T1F6, mandatoryModel.S1G4T1F6)) {

					subTitleStringMDcontact.push("Mobile Telecode");
				}

				if (subTitleStringMDcontact.length > 0) {
					array_s1.push({
						"section": 1,
						"description": "Enter Primary Contact Details",
						"subtitle": subTitleStringMDcontact.toString(),
						"type": "Warning",
						"subsection":"contacts"
					});
				}
			}

			if (vModel.S1G5T2F1 === "X" && mandatoryModel.S1G5T2F1 === "X") {
				for (var j = 0; j < data.contact.length; j++) {
					if (data.contact[j].CONTACT_TYPE === "AUTH") {

						// if ((this.checkIFEmpty(data.contact[j].NAME1, vModel.S1G2T2F1, mandatoryModel.S1G2T2F1)) ||
						// 	(this.checkIFEmpty(data.contact[j].NAME2, vModel.S1G2T2F1, mandatoryModel.S1G2T2F1)) ||
						// 	(this.checkIFEmpty(data.contact[j].DESIGNATION, vModel.S1G2T2F3, mandatoryModel.S1G2T2F3)) ||
						// 	(this.checkIFEmpty(data.contact[j].EMAIL, vModel.S1G2T2F4, mandatoryModel.S1G2T2F4)) ||
						// 	(this.checkIFEmpty(data.contact[j].CONTACT_TELECODE, vModel.S1G2T2F5, mandatoryModel.S1G2T2F5)) ||
						// 	(this.checkIFEmpty(data.contact[j].CONTACT_NO, vModel.S1G2T2F5, mandatoryModel.S1G2T2F5)) ||
						// 	(this.checkIFEmpty(data.contact[j].MOBILE_TELECODE, vModel.S1G2T2F8, mandatoryModel.S1G2T2F8)) ||
						// 	(this.checkIFEmpty(data.contact[j].MOBILE_NO, vModel.S1G2T2F8, mandatoryModel.S1G2T2F8)) ||
						// 	(this.checkIFEmpty(data.contact[j].NATIONALITY, vModel.S1G2T2F6, mandatoryModel.S1G2T2F6)) ||
						// 	(this.checkIFEmpty(data.contact[j].CITY, vModel.S1G2T2F9, mandatoryModel.S1G2T2F9)) ||
						// 	(this.checkIFEmpty(data.contact[j].PASSPORT_NO, vModel.S1G2T2F7, mandatoryModel.S1G2T2F7)) ||
						// 	(this.checkIFEmpty(data.contact[j].STATE, vModel.S1G2T2F10, mandatoryModel.S1G2T2F10)) ||
						// 	(this.checkIFEmpty(data.contact[j].POSTAL_CODE, vModel.S1G2T2F11, mandatoryModel.S1G2T2F11))) {
						// 	array_s1.push({
						// 		"section": 1,
						// 		"description": "Enter Mandatory Contact Details",
						// 		"subtitle": "NAME, DESIGNATION, EMAIL, CONTACT_NO, MOBILE_NO, NATIONALITY, STATE, CITY, POSTAL CODE",
						// 		"type": "Warning"
						// 	});
						// }
						var subTitleStringContacts = []
						if ((this.checkIFEmpty(data.contact[j].NAME1, vModel.S1G5T2F1, mandatoryModel.S1G5T2F1))) {

							subTitleStringContacts.push("First Name");
						}
						if ((this.checkIFEmpty(data.contact[j].NAME2, vModel.S1G4T1F11, mandatoryModel.S1G4T1F11))) {
							subTitleStringContacts.push("Last Name");
						}
						if (this.checkIFEmpty(data.contact[j].DESIGNATION, vModel.S1G5T2F2, mandatoryModel.S1G5T2F2)) {

							subTitleStringContacts.push("Designation");
						}
						if (this.checkIFEmpty(data.contact[j].NATIONALITY, vModel.S1G5T2F3, mandatoryModel.S1G5T2F3)) {

							subTitleStringContacts.push("Country");
						}
						if (this.checkIFEmpty(data.contact[j].STATE, vModel.S1G5T2F8, mandatoryModel.S1G5T2F8)) {

							subTitleStringContacts.push("Region");
						}
						if (this.checkIFEmpty(data.contact[j].CITY, vModel.S1G5T2F7, mandatoryModel.S1G5T2F7)) {

							subTitleStringContacts.push("City");
						}
						// if (this.checkIFEmpty(data.contact[j].PASSPORT_NO, vModel.S1G2T2F7, mandatoryModel.S1G2T2F7)) {

						// 	subTitleStringContacts.push("Passport No");
						// }
						if (this.checkIFEmpty(data.contact[j].EMAIL, vModel.S1G5T2F4, mandatoryModel.S1G5T2F4)) {

							subTitleStringContacts.push("Email");
						}

						// if (this.checkIFEmpty(data.contact[j].CONTACT_TELECODE, vModel.S1G5T2F5, mandatoryModel.S1G5T2F5)) {

						// 	subTitleStringContacts.push("Contact Telecode");
						// }
						if (this.checkIFEmpty(data.contact[j].CONTACT_NO, vModel.S1G5T2F5, mandatoryModel.S1G5T2F5)) {

							subTitleStringContacts.push("Contact No");
						}
						// if (this.checkIFEmpty(data.contact[j].MOBILE_TELECODE, vModel.S1G2T2F8, mandatoryModel.S1G2T2F8)) {

						// 	subTitleStringContacts.push("Mobile Telecode");
						// }
						if (this.checkIFEmpty(data.contact[j].MOBILE_NO, vModel.S1G5T2F6, mandatoryModel.S1G5T2F6)) {

							subTitleStringContacts.push("Mobile No");
						}
						if (this.checkIFEmpty(data.contact[j].POSTAL_CODE, vModel.S1G5T2F9, mandatoryModel.S1G5T2F9)) {
							subTitleStringContacts.push("Postal Code");
						}
						if (subTitleStringContacts.length > 0) {
							array_s1.push({
								"section": 1,
								"description": "Enter Mandatory Contacts Details",
								"subtitle": subTitleStringContacts.toString(),
								"type": "Warning",
								"subsection":"contacts"
							});
						}
					}
				}
			}

			if ((this.checkIFEmpty(headerData[0].TOT_PERM_EMP, vModel.S1G7T1F1, mandatoryModel.S1G7T1F1))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Permanent Employess",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			if ((this.checkIFEmpty(headerData[0].NOE_ACC, vModel.S1G7T1F3, mandatoryModel.S1G7T1F3))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Employess in Account Department",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			if ((this.checkIFEmpty(headerData[0].NOE_QA, vModel.S1G7T1F6, mandatoryModel.S1G7T1F6))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Employess in Quality Assuarance Department",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			if ((this.checkIFEmpty(headerData[0].NOE_MAN, vModel.S1G7T1F7, mandatoryModel.S1G7T1F7))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Employess in Manufacturing Department",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			if ((this.checkIFEmpty(headerData[0].NOE_ADM, vModel.S1G7T1F4, mandatoryModel.S1G7T1F4))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Employess in Admin Department",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			if ((this.checkIFEmpty(headerData[0].NOE_ANY, vModel.S1G7T1F10, mandatoryModel.S1G7T1F10))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Employess in Any Other Department",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			if ((this.checkIFEmpty(headerData[0].NOE_HR, vModel.S1G7T1F5, mandatoryModel.S1G7T1F5))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Employess in HR Department",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			if ((this.checkIFEmpty(headerData[0].NOE_SAL, vModel.S1G7T1F8, mandatoryModel.S1G7T1F8))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Employess in Sales Department",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			if ((this.checkIFEmpty(headerData[0].NOE_SEC, vModel.S1G7T1F9, mandatoryModel.S1G7T1F9))) {
				array_s1.push({
					"section": 1,
					"description": "Enter Number Of Employess in Security Department",
					"subtitle": "Mandatory Field",
					"type": "Warning",
					"subsection":"bussinessInfoTable_Id"
				});
			}

			// if ((headerData[0].BUSINESS_TYPE === undefined && vModel.S1G4T8F1 === "X" && mandatoryModel.S1G4T8F1 === "X") ||
			// 	(headerData[0].BUSINESS_TYPE === "" && vModel.S1G4T8F1 === "X" && mandatoryModel.S1G4T8F1 === "X") ||
			// 	(headerData[0].BUSINESS_TYPE === null && vModel.S1G4T8F1 === "X" && mandatoryModel.S1G4T8F1 === "X")) {
			// 	array_s1.push({
			// 		"section": 1,
			// 		"description": "Select Business Type",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Error",
			// 		"subsection":"otherDetailsS1_Id"
			// 	});
			// }

			// if ((headerData[0].LEGAL_STRUCTURE === "" && vModel.S1G3T1F1 === "X" && mandatoryModel.S1G3T1F1 === "X") ||
			// 	(headerData[0].LEGAL_STRUCTURE === undefined && vModel.S1G3T1F1 === "X" && mandatoryModel.S1G3T1F1 === "X") ||
			// 	(headerData[0].LEGAL_STRUCTURE === null && vModel.S1G3T1F1 === "X" && mandatoryModel.S1G3T1F1 === "X")) {
			// 	array_s1.push({
			// 		"section": 1,
			// 		"description": "Select Registering Office Legal Structure",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning",
			// 		"subsection":"otherDetailsS1_Id"
			// 	});
			// }

			// if ((headerData[0].ORG_ESTAB_YEAR === null && vModel.S1G6T1F1 === "X" && mandatoryModel.S1G6T1F1 === "X") ||
			// 	(headerData[0].ORG_ESTAB_YEAR === "" && vModel.S1G6T1F1 === "X" && mandatoryModel.S1G6T1F1 === "X")) {
			// 	array_s1.push({
			// 		"section": 3,
			// 		"description": "Select Establishment Date",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning",
			// 		"subsection":"otherDetailsS1_Id"
			// 	});
			// }

			// if ((headerData[0].LIC_NO === null && vModel.S1G6T1F4 === "X" && mandatoryModel.S1G6T1F4 === "X") ||
			// 	(headerData[0].LIC_NO === "" && vModel.S1G6T1F4 === "X" && mandatoryModel.S1G6T1F4 === "X")) {
			// 	array_s1.push({
			// 		"section": 3,
			// 		"description": "Select License Number",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning",
			// 		"subsection":"otherDetailsS1_Id"
			// 	});
			// }

			// if ((headerData[0].LIC_NO_DATE === null && vModel.S1G6T1F5 === "X" && mandatoryModel.S1G6T1F5 === "X") ||
			// 	(headerData[0].LIC_NO_DATE === "" && vModel.S1G6T1F5 === "X" && mandatoryModel.S1G6T1F5 === "X")) {
			// 	array_s1.push({
			// 		"section": 3,
			// 		"description": "Select License Expiry Date",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning",
			// 		"subsection":"otherDetailsS1_Id"
			// 	});
			// }

			// if ((headerData[0].SUPPL_TYPE === null && vModel.S1G5T2F1 === "X" && mandatoryModel.S1G5T2F1 === "X") ||
			// 	(headerData[0].SUPPL_TYPE === "" && vModel.S1G5T2F1 === "X" && mandatoryModel.S1G5T2F1 === "X")) {
			// 	array_s1.push({
			// 		"section": 3,
			// 		"description": "Select Supplier Type",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning",
			// 		"subsection":"otherDetailsS1_Id"
			// 	});
			// }

			return array_s1;
		},

		validateSectionTwo: function (array_s1, headerArray, bankDetails, data, vModel, mandatoryModel) {

			if (bankDetails.length > 0) {
				if (bankDetails[0].BANK_COUNTRY === null && vModel.S2G1T1F1 === "x" && mandatoryModel.S2G1T1F1 === "x") {
					array_s1.push({
						"section": 2,
						"description": "Select Bank Country",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				if (bankDetails[0].SWIFT_CODE === null && vModel.S2G1T1F2 === "x" && mandatoryModel.S2G1T1F2 === "x") {
					array_s1.push({
						"section": 2,
						"description": "Enter Swift Code",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				if (bankDetails[0].NAME === null && vModel.S2G1T1F3 === "x" && mandatoryModel.S2G1T1F3 === "x") {
					array_s1.push({
						"section": 2,
						"description": "Enter Bank Name",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				if (bankDetails[0].BENEFICIARY === null && vModel.S2G1T1F5 === "x" && mandatoryModel.S2G1T1F5 === "x") {
					array_s1.push({
						"section": 2,
						"description": "Enter Beneficiary Name",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				if (bankDetails[0].ACCOUNT_NO === null && vModel.S2G1T1F6 === "x" && mandatoryModel.S2G1T1F6 === "x") {
					array_s1.push({
						"section": 2,
						"description": "Enter Account Number",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				if (bankDetails[0].BRANCH_NAME === null && vModel.S2G1T1F4 === "x" && mandatoryModel.S2G1T1F4 === "x") {
					array_s1.push({
						"section": 2,
						"description": "Enter Branch Name",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				// if (bankDetails[0].IBAN_NUMBER === null && vModel.S2G1T1F5 === "X" && mandatoryModel.S2G1T1F5 === "X") {
				// 	array_s1.push({
				// 		"section": 2,
				// 		"description": "Enter IBAN Number",
				// 		"subtitle": "Mandatory Field",
				// 		"type": "Warning"
				// 	});
				// }

				// if (bankDetails[0].OTHER_CODE_VAL === null && vModel.S2G1T1F9 === "X" && mandatoryModel.S2G1T1F9 === "X") {
				// 	array_s1.push({
				// 		"section": 2,
				// 		"description": "Enter Other Code Name",
				// 		"subtitle": "Mandatory Field",
				// 		"type": "Warning"
				// 	});
				// }

				if (bankDetails[0].OTHER_CODE_NAME === null && vModel.S2G1T1F9 === "x" && mandatoryModel.S2G1T1F9 === "x") {
					array_s1.push({
						"section": 2,
						"description": "Enter Other Code",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				if (bankDetails[0].BANK_CURRENCY === null && vModel.S2G1T1F10 === "x" && mandatoryModel.S2G1T1F10 === "x") {
					array_s1.push({
						"section": 2,
						"description": "Select Bank Currency",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				// if (bankDetails[0].DUNS_NUMBER === null && vModel.S2G1T4F15 === "X" && mandatoryModel.S2G1T4F15 === "X") {
				// 	array_s1.push({
				// 		"section": 2,
				// 		"description": "Enter DUNS Number",
				// 		"subtitle": "Mandatory Field",
				// 		"type": "Warning"
				// 	});
				// }

			}

			//5/22
			if (data.otherBankDetails.length > 0) {
				for (var k = 0; k < data.otherBankDetails.length; k++) {

					if (this.checkOtherBankValues(data.otherBankDetails[k].BANK_COUNTRY)) {
						array_s1.push({
							"section": 2,
							"description": "Bank country Missing in Other Bank Details Row: " + (k + 1),
							"subtitle": "Mandatory",
							"type": "Warning"
						});
					}

					if (this.checkOtherBankValues(data.otherBankDetails[k].SWIFT_CODE)) {
						array_s1.push({
							"section": 2,
							"description": "Swift Code Missing in Other Bank Details Row: " + (k + 1),
							"subtitle": "Mandatory",
							"type": "Warning"
						});
					}

					if (this.checkOtherBankValues(data.otherBankDetails[k].NAME)) {
						array_s1.push({
							"section": 2,
							"description": "Bank Name Missing in Other Bank Details Row: " + (k + 1),
							"subtitle": "Mandatory",
							"type": "Warning"
						});
					}

					if (this.checkOtherBankValues(data.otherBankDetails[k].BRANCH_NAME)) {
						array_s1.push({
							"section": 2,
							"description": "Branch Name missing in Other Bank Details Row: " + (k + 1),
							"subtitle": "Mandatory",
							"type": "Warning"
						});
					}

					if (this.checkOtherBankValues(data.otherBankDetails[k].ACCOUNT_NO)) {
						array_s1.push({
							"section": 2,
							"description": "Account Number missing in Other Bank Details Row: " + (k + 1),
							"subtitle": "Mandatory",
							"type": "Warning"
						});
					}

					// if (this.checkOtherBankValues(data.otherBankDetails[k].IBAN_NUMBER)) {
					// 	array_s1.push({
					// 		"section": 2,
					// 		"description": "IBAN number missing in Other Bank Details Row: " + (k + 1),
					// 		"subtitle": "Mandatory",
					// 		"type": "Warning"
					// 	});
					// }

					if (this.checkOtherBankValues(data.otherBankDetails[k].BENEFICIARY)) {
						array_s1.push({
							"section": 2,
							"description": "Baneficiary name missing in Other Bank Details Row: " + (k + 1),
							"subtitle": "Mandatory",
							"type": "Warning"
						});
					}

					if (this.checkOtherBankValues(data.otherBankDetails[k].BANK_CURRENCY)) {
						array_s1.push({
							"section": 2,
							"description": "Bank Currency missing in Other Bank Details Row: " + (k + 1),
							"subtitle": "Mandatory",
							"type": "Warning"
						});
					}

					// if (data.otherBankDetails[k].BANK_COUNTRY === "AE") {
					// 	if (this.checkOtherBankValues(data.otherBankDetails[k].VAT_REG_DATE) ||
					// 		this.checkOtherBankValues(data.otherBankDetails[k].VAT_REG_NUMBER)) {
					// 		array_s1.push({
					// 			"section": 2,
					// 			"description": "Enter VAT Registration Date and VAT Registration No in Other Bank Details Row: " + (k + 1),
					// 			"subtitle": "Other Bank Details",
					// 			"type": "Warning"
					// 		});
					// 	}
					// }

					if (data.otherBankDetails[k].BANK_COUNTRY === "US") {
						if (this.checkOtherBankValues(data.otherBankDetails[k].ROUTING_CODE)) {
							array_s1.push({
								"section": 2,
								"description": "Enter Routing Code in Other Bank Details Row: " + (k + 1),
								"subtitle": "Other Bank Details",
								"type": "Warning"
							});
						}
					}
				}
			}

			// if (vModel.S2G2T1F1 === "x" && mandatoryModel.S2G2T1F1 === "x") {
			// 	for (var i = 0; i < data.finInfo.length; i++) {

			// 		if ((this.checkIFEmpty(data.finInfo[i].TOTAL_REVENUE, vModel.S2G2T1F1, mandatoryModel.S2G2T1F1)) ||
			// 			(this.checkIFEmpty(data.finInfo[i].NET_PROFIT_LOSS, vModel.S2G2T2F1, mandatoryModel.S2G2T2F1)) ||
			// 			(this.checkIFEmpty(data.finInfo[i].TOTAL_ASSETS, vModel.S2G2T3F1, mandatoryModel.S2G2T3F1)) ||
			// 			(this.checkIFEmpty(data.finInfo[i].TOTAL_EQUITY, vModel.S2G2T4F1, mandatoryModel.S2G2T4F1))) {
			// 			array_s1.push({
			// 				"section": 2,
			// 				"description": "Enter Mandatory Fields in Financial Information of year: " + data.finInfo[i].FIN_YEAR,
			// 				"subtitle": "TOTAL_REVENUE, NET_PROFIT_LOSS, TOTAL_ASSETS, TOTAL_EQUITY, CURRENCY",
			// 				"type": "Warning"
			// 			});
			// 		}
			// 	}
			// }

			// if (vModel.S2G3T1F1 === "X" && mandatoryModel.S2G3T1F1 === "X") {
			// 	for (var j = 0; j < data.ownerInfo.length; j++) {

			// 		if ((this.checkIFEmpty(data.ownerInfo[j].NAME, vModel.S2G3T1F1, mandatoryModel.S2G3T1F1)) ||
			// 			(this.checkIFEmpty(data.ownerInfo[j].NATIONALITY, vModel.S2G3T1F3, mandatoryModel.S2G3T1F3)) ||
			// 			(this.checkIFEmpty(data.ownerInfo[j].OWNERSHIP_PERCENT, vModel.S2G3T1F6, mandatoryModel.S2G3T1F6)) ||
			// 			(this.checkIFEmpty(data.ownerInfo[j].CONTACT_NO, vModel.S2G3T1F4, mandatoryModel.S2G3T1F4)) ||
			// 			(this.checkIFEmpty(data.ownerInfo[j].PASSPORT_NO, vModel.S2G3T1F5, mandatoryModel.S2G3T1F5))) {
			// 			array_s1.push({
			// 				"section": 2,
			// 				"description": "Enter Mandatory Fields in Owner's Information",
			// 				"subtitle": "NAME, NATIONALITY, PHONE NUMBER, OWNERSHIP_PERCENT",
			// 				"type": "Warning"
			// 			});
			// 		}
			// 	}
			// }

		},

		validateSectionThree: function (array_s1, headerArray, data, vModel, mandatoryModel) {
			// if (vModel.S3G1T1F1 === "X" && mandatoryModel.S3G1T1F1 === "X") {
			// 	for (var i = 0; i < data.productInfo.length; i++) {
			// 		if ((this.checkIFEmpty(data.productInfo[i].PROD_NAME, vModel.S3G1T1F1, mandatoryModel.S3G1T1F1)) ||
			// 			(this.checkIFEmpty(data.productInfo[i].PROD_CATEGORY, vModel.S3G1T1F4, mandatoryModel.S3G1T1F4)) ||
			// 			(this.checkIFEmpty(data.productInfo[i].PROD_DESCRIPTION, vModel.S3G1T1F3, mandatoryModel.S3G1T1F3))) {
			// 			array_s1.push({
			// 				"section": 3,
			// 				"description": "Enter Mandatory Fields in Product Details Row: " + (i + 1),
			// 				"subtitle": "PROD_NAME, PROD_DESCRIPTION, PROD_CATEGORY",
			// 				"type": "Warning"
			// 			});
			// 		}
			// 	}

			// }

			// if (vModel.S3G4T1F1 === "X" && mandatoryModel.S3G4T1F1 === "X") {
			// 	for (var j = 0; j < data.clientInfo.length; j++) {
			// 		if (data.clientInfo[j].CUSTOMER_NAME === null || data.clientInfo[j].CUSTOMER_SHARE === null ||
			// 			data.clientInfo[j].CUSTOMER_NAME === "" || data.clientInfo[j].CUSTOMER_SHARE === "") {
			// 			array_s1.push({
			// 				"section": 3,
			// 				"description": "Enter Mandatory Fields in Major Customers Row: " + (j + 1),
			// 				"subtitle": "CUSTOMER_NAME, CUSTOMER_SHARE",
			// 				"type": "Warning"
			// 			});
			// 		}
			// 	}
			// }

			// if (vModel.S3G2T2F1 === "X") {
			// 	for (var k = 0; k < data.operationalCap.length; k++) {

			// 		if ((this.checkIFEmpty(data.operationalCap[k].COUNTRY, vModel.S3G2T2F1, mandatoryModel.S3G2T2F1)) ||
			// 			(this.checkIFEmpty(data.operationalCap[k].CITY, vModel.S3G2T2F3, mandatoryModel.S3G2T2F3)) ||
			// 			(this.checkIFEmpty(data.operationalCap[k].PLANT_MANF_CAPABILITY, vModel.S3G2T2F4, mandatoryModel.S3G2T2F4)) ||
			// 			(this.checkIFEmpty(data.operationalCap[k].PROD_CAPACITY, vModel.S3G2T2F5, mandatoryModel.S3G2T2F5)) ||
			// 			(this.checkIFEmpty(data.operationalCap[k].TIME_TO_SERVICE, vModel.S3G2T2F6, mandatoryModel.S3G2T2F6))) {
			// 			array_s1.push({
			// 				"section": 3,
			// 				"description": "Enter Mandatory Fields in Operational Capacity Row: " + (k + 1),
			// 				"subtitle": "COUNTRY, CITY, PLANT_MANF_CAPABILITY, PRODUCT CAPACITY",
			// 				"type": "Warning"
			// 			});
			// 		}
			// 	}
			// }
		},

		validateSectionFour: function (array_s1, headerArray, data, disclousersData, i18nModel, vModel, mandatoryModel) {
			//Conflict of Interest:
			// if (disclousersData[0].INTEREST_CONFLICT === null && vModel.S4G1D1 === "X" && mandatoryModel.S4G1D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Select Conflict of Interest",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].ANY_LEGAL_CASES === null && vModel.S4G2D1 === "X" && mandatoryModel.S4G2D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Select Legal Case Disclosure",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].ACADEMIC_DISCOUNT === null && vModel.S4G4D1 === "X" && mandatoryModel.S4G4D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Select Academic Discount",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].RELATIVE_WORKING === null && vModel.S4G5D1 === "X" && mandatoryModel.S4G5D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Select Relatives working for the Entity",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].REACH_COMPLIANCE === null && vModel.S4G7D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Select REACH Compliance",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].CLP_COMPLIANCE === null && vModel.S4G8D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Select CLP Compliance",
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].APPLY_ITAR_REG === null && vModel.S4G9D1 === "X" && mandatoryModel.S4G9D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("APPLY_ITAR_REG"),
			// 		"subtitle": "ITAR and FCPA compliance",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].APPLY_FCPA === null && vModel.S4G9D3 === "X" && mandatoryModel.S4G9D3 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("APPLY_FCPA"),
			// 		"subtitle": "ITAR and FCPA compliance",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].SUPPLY_ITAR_EAR === null && vModel.S4G9D2 === "X" && mandatoryModel.S4G9D2 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("SUPPLY_ITAR_EAR"),
			// 		"subtitle": "ITAR and FCPA compliance",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].US_ORIGIN_SUPPL === null && vModel.S4G9D4 === "X" && mandatoryModel.S4G9D4 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("US_ORIGIN_SUPPL"),
			// 		"subtitle": "ITAR and FCPA compliance",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].ERP_MGMT_SYSTEM === null && vModel.S4G10D1 === "X" && mandatoryModel.S4G10D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("ERP_MGMT_SYSTEM"),
			// 		"subtitle": "IT Equipment and Tools",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].INDUSRIAL_DESIGN_SW === null && vModel.S4G10D2 === "X" && mandatoryModel.S4G10D2 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("INDUSRIAL_DESIGN_SW"),
			// 		"subtitle": "IT Equipment and Tools",
			// 		"type": "Warning"
			// 	});
			// }
			// //Overview Section
			// if (disclousersData[0].COUNTERFIET_PARTS_PCD === null && vModel.S4G12D1 === "X" && mandatoryModel.S4G12D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("COUNTERFIET_PARTS_PCD"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }
			// if (disclousersData[0].MANUFACTURING_PCD === null && vModel.S4G12D3 === "X" && mandatoryModel.S4G12D3 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("MANUFACTURING_PCD"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].PLAN_COLLECTION === null && vModel.S4G12D5 === "X" && mandatoryModel.S4G12D5 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("PLAN_COLLECTION"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].CONFIG_CTRL_SYSTEM === null && vModel.S4G12D7 === "X" && mandatoryModel.S4G12D7 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("CONFIG_CTRL_SYSTEM"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].CONT_IMPROVEMENT_PROG === null && vModel.S4G12D9 === "X" && mandatoryModel.S4G12D9 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("CONT_IMPROVEMENT_PROG"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].QUALITY_AGREEMENT === null && vModel.S4G12D2 === "X" && mandatoryModel.S4G12D2 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("QUALITY_AGREEMENT"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].TECH_SPEC_MFG_SRV === null && vModel.S4G12D4 === "X" && mandatoryModel.S4G12D4 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("TECH_SPEC_MFG_SRV"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].ANALYSIS_RISKMGMT_PROC === null && vModel.S4G12D6 === "X" && mandatoryModel.S4G12D6 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("ANALYSIS_RISKMGMT_PROC"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].CTRL_PLANNING_PROC === null && vModel.S4G12D8 === "X" && mandatoryModel.S4G12D8 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("CTRL_PLANNING_PROC"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].EPI_QUALITY_SUPPL_REQ === null && vModel.S4G12D10 === "X" && mandatoryModel.S4G12D10 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("EPI_QUALITY_SUPPL_REQ"),
			// 		"subtitle": "Overview Section",
			// 		"type": "Warning"
			// 	});
			// }

			// //Suppliers / imput material section
			// if (disclousersData[0].SUPPL_EVAL_PROC === null && vModel.S4G13D1 === "X" && mandatoryModel.S4G13D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("SUPPL_EVAL_PROC"),
			// 		"subtitle": "Suppliers / imput material",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].TECH_SPEC_MATERIAL === null && vModel.S4G13D3 === "X" && mandatoryModel.S4G13D3 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("TECH_SPEC_MATERIAL"),
			// 		"subtitle": "Suppliers / imput material",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].CTRL_ORDERS_DOC_PROC === null && vModel.S4G13D5 === "X" && mandatoryModel.S4G13D5 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("CTRL_ORDERS_DOC_PROC"),
			// 		"subtitle": "Suppliers / imput material",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].NON_CONF_ANALYSIS === null && vModel.S4G13D2 === "X" && mandatoryModel.S4G13D2 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("NON_CONF_ANALYSIS"),
			// 		"subtitle": "Suppliers / imput material",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].MATERIAL_INSPECTION_TESTS === null && vModel.S4G13D4 === "X" && mandatoryModel.S4G13D4 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("MATERIAL_INSPECTION_TESTS"),
			// 		"subtitle": "Suppliers / imput material",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].TECHNICAL_DOC_PROC === null && vModel.S4G13D6 === "X" && mandatoryModel.S4G13D6 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("TECHNICAL_DOC_PROC"),
			// 		"subtitle": "Suppliers / imput material",
			// 		"type": "Warning"
			// 	});
			// }

			// //Production
			// if (disclousersData[0].QUALIFIED_STAFF === null && vModel.S4G14D1 === "X" && mandatoryModel.S4G14D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("QUALIFIED_STAFF"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].PROC_FOR_INCOMING === null && vModel.S4G14D3 === "X" && mandatoryModel.S4G14D3 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("PROC_FOR_INCOMING"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].INTERAL_QUAL_AUDITS === null && vModel.S4G14D5 === "X" && mandatoryModel.S4G14D5 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("PROC_FOR_INCOMING"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].NON_CONF_TREATMENT_PROC === null && vModel.S4G14D7 === "X" && mandatoryModel.S4G14D7 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("NON_CONF_TREATMENT_PROC"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].IDENTIFICATION_METHOD === null && vModel.S4G14D9 === "X" && mandatoryModel.S4G14D9 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("IDENTIFICATION_METHOD"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].WORK_INSTRUCTION_METHODS === null && vModel.S4G14D11 === "X" && mandatoryModel.S4G14D11 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("WORK_INSTRUCTION_METHODS"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].PLANNING_CONTROL_SYSTEM === null && vModel.S4G14D13 === "X" && mandatoryModel.S4G14D13 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("PLANNING_CONTROL_SYSTEM"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].QUALIFICATION_ARRAY === null && vModel.S4G14D2 === "X" && mandatoryModel.S4G14D2 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("QUALIFICATION_ARRAY"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].MFG_INSPECTION_TESTS === null && vModel.S4G14D4 === "X" && mandatoryModel.S4G14D4 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("MFG_INSPECTION_TESTS"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].MEASURING_EQUIP_CALIB === null && vModel.S4G14D6 === "X" && mandatoryModel.S4G14D6 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("MEASURING_EQUIP_CALIB"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].REPTITIVE_CAUSES_PROC === null && vModel.S4G14D8 === "X" && mandatoryModel.S4G14D8 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("REPTITIVE_CAUSES_PROC"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].MAINTENANCE_SCHEDULES === null && vModel.S4G14D10 === "X" && mandatoryModel.S4G14D10 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("MAINTENANCE_SCHEDULES"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].DOCUMENTED_PROC === null && vModel.S4G14D12 === "X" && mandatoryModel.S4G14D12 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("DOCUMENTED_PROC"),
			// 		"subtitle": "Production Section",
			// 		"type": "Warning"
			// 	});
			// }
			// //Storage
			// if (disclousersData[0].CRITERIA_COLLECT_PROC === null && vModel.S4G15D1 === "X" && mandatoryModel.S4G15D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("CRITERIA_COLLECT_PROC"),
			// 		"subtitle": "Storage Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].ESTAB_CRITERIA === null && vModel.S4G15D3 === "X" && mandatoryModel.S4G15D3 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("ESTAB_CRITERIA"),
			// 		"subtitle": "Storage Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].COMP_BASED_WMS === null && vModel.S4G15D2 === "X" && mandatoryModel.S4G15D2 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("COMP_BASED_WMS"),
			// 		"subtitle": "Storage Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].DEFINED_POLICIES === null && vModel.S4G15D4 === "X" && mandatoryModel.S4G15D4 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("DEFINED_POLICIES"),
			// 		"subtitle": "Storage Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].CUSTOMER_SERVICE === null && vModel.S4G16D1 === "X" && mandatoryModel.S4G16D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("CUSTOMER_SERVICE"),
			// 		"subtitle": "Select Customer Service",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].MASS_SERIES_PROD === null && vModel.S4G17D1 === "X" && mandatoryModel.S4G17D1 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("MASS_SERIES_PROD"),
			// 		"subtitle": "Technology Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (disclousersData[0].TECH_SUPPORT === null && vModel.S4G17D2 === "X" && mandatoryModel.S4G17D2 === "X") {
			// 	array_s1.push({
			// 		"section": 4,
			// 		"description": "Mandatory - " + i18nModel.getResourceBundle().getText("TECH_SUPPORT"),
			// 		"subtitle": "Technology Section",
			// 		"type": "Warning"
			// 	});
			// }

			// if (vModel.S4G11D1 === "X" && mandatoryModel.S4G11D1 === "X") {
			// 	for (var a = 0; a < data.qualityCertificate.length; a++) {
			// 		var certificate = data.qualityCertificate[a];
			// 		if (certificate.AVAILABLE === -1 || certificate.DONE_BY === "") {
			// 			array_s1.push({
			// 				"section": 4,
			// 				"description": "Select Mandatory fields of: " + certificate.CERTI_NAME,
			// 				"subtitle": "Quality Certificates",
			// 				"type": "Warning"
			// 			});
			// 		}
			// 	}
			// }

		},

		validateSectionFive: function (array_s1, headerArray, data, disclousersData, attachmentData, vModel, mandatoryModel) {
			var G1Grp = [],
				G2Grp = [],
				G3Grp = [],
				G4Grp = [],
				G5Grp = [],
				G6Grp = [],
				G8Grp = [],
				G9Grp = [],
				G10Grp = [],
				G11Grp = [],
				G12Grp = [],
				G13Grp = [],
				G14Grp = [],
				G15Grp = [],
				G16Grp = [],
				G17Grp = [],
				G18Grp = [],
				G19Grp = [],
				G20Grp = [],
				G21Grp = [],
				G7Grp = [];

			for (var i = 0; i < attachmentData.attachments2.length; i++) {
				if (attachmentData.attachments2[i].ATTACH_GROUP === "G1") {
					G1Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G2") {
					G2Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G3") {
					G3Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G4") {
					G4Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G5") {
					G5Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G6") {
					G6Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G8") {
					G8Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G20") {
					G20Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G9") {
					G9Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G21") {
					G21Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G11") {
					G11Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G12") {
					G12Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G13") {
					G13Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G14") {
					G14Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G15") {
					G15Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G16") {
					G16Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G17") {
					G17Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G7") {
					G7Grp.push(attachmentData.attachments2[i]);
				}

				if (attachmentData.attachFields.IS_UAE_COMPANY === "Yes" && attachmentData.attachments2[i].ATTACH_GROUP === "G7") {
					if (attachmentData.attachments2[i].ATTACH_CODE === 8) {
						this.checkUAEAttachment(array_s1, attachmentData.attachments2[i].ATTACH_DESC, attachmentData.attachments2[i].EXPIRY_DATE,
							attachmentData.attachments2[
								i].FILE_NAME, vModel.S5A7F1,
							mandatoryModel.S5A7F1);
					}

					// if (attachmentData.attachments2[i].ATTACH_CODE === 9) {
					// 	this.checkUAEAttachment(array_s1, attachmentData.attachments2[i].ATTACH_DESC, attachmentData.attachments2[i].EXPIRY_DATE,
					// 		attachmentData.attachments2[
					// 			i].FILE_NAME, vModel.S5A7F2,
					// 		mandatoryModel.S5A7F2);
					// }

					// if (attachmentData.attachments2[i].ATTACH_CODE === 13) {
					// 	this.checkUAEAttachment(array_s1, attachmentData.attachments2[i].ATTACH_DESC, attachmentData.attachments2[i].EXPIRY_DATE,
					// 		attachmentData.attachments2[
					// 			i].FILE_NAME, vModel.S5A11F1,
					// 		mandatoryModel.S5A11F1);
					// }
				} else if (attachmentData.attachFields.IS_UAE_COMPANY === "No" && attachmentData.attachments2[i].ATTACH_GROUP === "G7") {
					if (attachmentData.attachments2[i].ATTACH_CODE === 10) {
						this.checkUAEAttachment(array_s1, attachmentData.attachments2[i].ATTACH_DESC, "not null",
							attachmentData.attachments2[
								i].FILE_NAME, vModel.S5A7F1,
							mandatoryModel.S5A7F1);
					}
				}

				// if (attachmentData.attachments2[i].ATTACH_CODE === 15) {
				// 	this.checkIfAttachment(array_s1, attachmentData.attachments2[i].ATTACH_DESC, attachmentData.attachments2[i].FILE_NAME, vModel.S5A14F1,
				// 		mandatoryModel.S5A14F1);
				// }

				if (attachmentData.attachments2[i].ATTACH_CODE === 16) {
					this.checkIfAttachment(array_s1, attachmentData.attachments2[i].ATTACH_DESC, attachmentData.attachments2[i].FILE_NAME, vModel.S5A14F1,
						mandatoryModel.S5A14F1);
				}

			}

			if (vModel.S4A1F1 === "x" && mandatoryModel.S4A1F1 === "x") {
				this.checkAttachTable(array_s1, G1Grp, "Company Profile");
			}

			// if (vModel.S5A3F1 === "X" && mandatoryModel.S5A3F1 === "X") {
			// 	this.checkAttachTable(array_s1, G2Grp, "Production/Quality Resources");
			// }

			if (vModel.S4A5F1 === "x" && mandatoryModel.S4A5F1 === "x") {
				this.checkAttachTable(array_s1, G3Grp, "ISO Certificates");
			}

			if (vModel.S4A6F1 === "x" && mandatoryModel.S4A6F1 === "x") {
				this.checkAttachTable(array_s1, G4Grp, "Quality Certificates");
			}
			// if (vModel.S5A7F1 === "X" && mandatoryModel.S5A9F1 === "X" && attachmentData.attachFields.ISSUE_ELEC_TAX_INV === 'Yes') {
			// 	this.checkAttachTable(array_s1, G6Grp, "Digital Certificate");
			// }
			// if (vModel.S5A7F1 === "X" && mandatoryModel.S5A12F1 === "X" && attachmentData.attachFields.SOLE_DIST_MFG_SER === 'Yes') {
			// 	this.checkAttachTable(array_s1, G6Grp, "Certificate issued from the Manufacturer / service provider");
			// }
			// if (vModel.S5A5F1 === "X" && mandatoryModel.S5A5F1 === "X") {
			// 	this.checkAttachTable(array_s1, G8Grp, "Passport Copy (Passport of Authorized Signatory)");
			// }

			// if (vModel.S5A5F1 === "X" && mandatoryModel.S5A5F1 === "X" && attachmentData.attachFields.IS_UAE_COMPANY === "Yes") {
			// 	this.checkAttachTable(array_s1, G20Grp, "UID Copy (Passport of Authorized Signatory)");
			// }

			// if (vModel.S5A5F2 === "X" && mandatoryModel.S5A5F2 === "X") {
			// 	this.checkAttachTable(array_s1, G9Grp, "Passport Copy (Passport Representative / Authorized person)");
			// }

			// if (vModel.S5A5F2 === "X" && mandatoryModel.S5A5F2 === "X" && attachmentData.attachFields.IS_UAE_COMPANY === "Yes") {
			// 	this.checkAttachTable(array_s1, G21Grp, "UID Copy (Passport Representative / Authorized person)");
			// }

			// if (vModel.S5A2F1 === "X" && mandatoryModel.S5A2F1 === "X") {
			// 	this.checkAttachTable(array_s1, G11Grp, "Catalogue of Products/services");
			// }

			// if (vModel.S5A4F1 === "X" && mandatoryModel.S5A4F1 === "X") {
			// 	this.checkAttachTable(array_s1, G12Grp, "Power Of Attorney");
			// }

			if (vModel.S4A3F1 === "x" && mandatoryModel.S4A3F1 === "x") {
				this.checkAttachTable(array_s1, G13Grp, "Bank Account letter issued by the Bank");
			}

			if (vModel.S4A4F1 === "x" && mandatoryModel.S4A4F1 === "x") {
				this.checkAttachTable(array_s1, G14Grp, "TRN Certificate");
			}
			// if (headerArray[0].BP_TYPE_CODE === "B") {
			// 	this.checkAttachTable(array_s1, G14Grp, "TRN Certificate");
			// }

			// if (vModel.S5A17F1 === "X" && mandatoryModel.S5A17F1 === "X") {
			// 	this.checkAttachTable(array_s1, G15Grp, "Major Customers");
			// }

			// if (vModel.S5A18F1 === "X" && mandatoryModel.S5A18F1 === "X") {
			// 	this.checkAttachTable(array_s1, G16Grp, "Major Suppliers");
			// }

			// if (vModel.S5A19F1 === "X" && mandatoryModel.S5A19F1 === "X") {
			// 	this.checkAttachTable(array_s1, G17Grp, "List Of References");
			// }

			if (vModel.S4A3F1 === "x" && mandatoryModel.S4A3F1 === "x" && attachmentData.attachFields.IS_UAE_COMPANY === "Yes") {
				if (G8Grp.length !== G20Grp.length) {
					array_s1.push({
						"section": 5,
						"description": "Number of passports copies and UID copies should be equal",
						"subtitle": "Passport of Authorized Signatory",
						"type": "Warning"
					});
				}
			}

			if (vModel.S4A1F1 === "x" && mandatoryModel.S4A1F1 === "x" && attachmentData.attachFields.IS_UAE_COMPANY === "Yes") {
				if (G9Grp.length !== G21Grp.length) {
					array_s1.push({
						"section": 5,
						"description": "Number of passports copies and UID copies should be equal",
						"subtitle": "Passport Representative / Authorized person",
						"type": "Warning"
					});
				}
			}

		},

		checkAttachTable: function (array_s1, sGroup, sDesc) {

			var length = sGroup.filter(function (obj) {
				if (obj.FILE_NAME !== "") {
					return obj;
				}
			});

			if (length == 0) {
				array_s1.push({
					"section": 5,
					"description": "Upload " + sDesc,
					"subtitle": "Mandatory",
					"type": "Warning"
				});
			}

		},

		checkUAEAttachment: function (array_s1, attachDesc, eDate, fileName, visibleModel, mandatory) {
			if ((fileName === "" || eDate === null) && visibleModel === "X" && mandatory === "X") {
				array_s1.push({
					"section": 5,
					"description": "Upload " + attachDesc + " Attachment",
					"subtitle": "Mandatory",
					"type": "Warning"
				});
			}
		},

		checkIfAttachment: function (array_s1, attachDesc, fileName, visibleModel, mandatory) {
			if (fileName === "" && visibleModel === "X" && mandatory === "X") {
				array_s1.push({
					"section": 5,
					"description": "Upload " + attachDesc + " Attachment",
					"subtitle": "Mandatory",
					"type": "Warning"
				});
			}
		},

		validateSectionSix: function (array_s1, headerArray, disclousersData, data, vModel, mandatoryModel) {
			// debugger;
			if ((this.checkIFEmpty(headerArray[0].COMPLETED_BY, vModel.S7G1D1, mandatoryModel.S7G1D1))) {
				array_s1.push({
					"section": 6,
					"description": "Enter Completed By",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			}

			if ((this.checkIFEmpty(headerArray[0].COMPLETED_BY_POSITION, vModel.S7G1D2, mandatoryModel.S7G1D2))) {
				array_s1.push({
					"section": 6,
					"description": "Enter Designation (Person Designation Completed by)",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			}

			// if ((this.checkIFEmpty(disclousersData[0].VALID_SIGNATORY_NAME, vModel.S7G1D4, mandatoryModel.S7G1D4))) {
			// 	array_s1.push({
			// 		"section": 6,
			// 		"description": "Enter Name of Authorized Signatory",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning"
			// 	});
			// }

			// if ((this.checkIFEmpty(disclousersData[0].VALID_DESIGNATION, vModel.S7G1D4, mandatoryModel.S7G1D4))) {
			// 	array_s1.push({
			// 		"section": 6,
			// 		"description": "Enter Authorized Designation",
			// 		"subtitle": "Mandatory Field",
			// 		"type": "Warning"
			// 	});
			// }

			//disclousersData[0].MASS_SERIES_PROD
		},

		// checkIFAttachment: function (visibleModel, mandatory, fileName) {
		// 	var flag = false;
		// 	if (visibleModel === "X" || mandatory === "X" || fileName === "") {
		// 		flag = true;
		// 	}
		// 	return flag;
		// },

		validateSections: function (headerArray, bankDetails, data, disclousersData, attachmentData, i18nModel, vModel, mandatoryModel,
			section) {
				// debugger;
			var array_s1 = [];
			if (section === 1) {
				this._validateFirstSection(array_s1, headerArray, data, vModel, mandatoryModel);
			} else if (section === 2) {
				this._validateFirstSection(array_s1, headerArray, data, vModel, mandatoryModel);
				this.validateSectionTwo(array_s1, headerArray, bankDetails, data, vModel, mandatoryModel);
			} else if (section === 3) {
				this._validateFirstSection(array_s1, headerArray, data, vModel, mandatoryModel);
				this.validateSectionTwo(array_s1, headerArray, bankDetails, data, vModel, mandatoryModel);
				// this.validateSectionThree(array_s1, headerArray, data, vModel, mandatoryModel);
			} else if (section === 4) {
				this._validateFirstSection(array_s1, headerArray, data, vModel, mandatoryModel);
				this.validateSectionTwo(array_s1, headerArray, bankDetails, data, vModel, mandatoryModel);
				// this.validateSectionThree(array_s1, headerArray, data, vModel, mandatoryModel);
				// this.validateSectionFour(array_s1, headerArray, data, disclousersData, i18nModel, vModel, mandatoryModel);
			} else if (section === 5) {
				this._validateFirstSection(array_s1, headerArray, data, vModel, mandatoryModel);
				this.validateSectionTwo(array_s1, headerArray, bankDetails, data, vModel, mandatoryModel);
				// this.validateSectionThree(array_s1, headerArray, data, vModel, mandatoryModel);
				// this.validateSectionFour(array_s1, headerArray, data, disclousersData, i18nModel, vModel, mandatoryModel);
				this.validateSectionFive(array_s1, headerArray, data, disclousersData, attachmentData, vModel, mandatoryModel);
			} else if (section === 6) {
				this._validateFirstSection(array_s1, headerArray, data, vModel, mandatoryModel);
				this.validateSectionTwo(array_s1, headerArray, bankDetails, data, vModel, mandatoryModel);
				// this.validateSectionThree(array_s1, headerArray, data, vModel, mandatoryModel);
				// this.validateSectionFour(array_s1, headerArray, data, disclousersData, i18nModel, vModel, mandatoryModel);
				this.validateSectionFive(array_s1, headerArray, data, disclousersData, attachmentData, vModel, mandatoryModel);
				this.validateSectionSix(array_s1, headerArray, disclousersData, data, vModel, mandatoryModel);
			}

			return array_s1;
		}

	};
});