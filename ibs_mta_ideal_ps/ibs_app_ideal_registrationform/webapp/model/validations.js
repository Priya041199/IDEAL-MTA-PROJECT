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
		// tradeLicenseValidation: function (oEvent) {

		// 	var oSource = oEvent.getSource();
		// 	var reg = /^\s*([0-9a-zA-Z-./]*)\s*$/.test(oSource.getValue());
		// 	if (reg === true || oSource.getValue() === "") {
		// 		oSource.setValueState(sap.ui.core.ValueState.None);
		// 	} else {
		// 		oEvent.getSource().setValue("");
		// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Special characters not allowed");
		// 	}
		// },

		_validateMobileNum: function (oEvent) {
			// debugger;
			var oSource = oEvent.getSource();
			//	var reg = /^[1-9]{1}[0-9]{9}$/.test(oSource.getValue());
			var reg = /^[- +()]*[0-9][- +()0-9]*$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid mobile number");
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
		_validateEmail: function (oEvent) {

			var oSource = oEvent.getSource();
			// var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			// 		.test(oSource.getValue());
			var reg = /^\s*[\w.-]+@(?!.*(\.[a-zA-Z\d-]+){2,})([a-zA-Z\d-]+\.)+[a-zA-Z]{2,}\s*$/.test(oSource.getValue());

			if (reg === true && (oSource.getValue() !== "" || oSource.getValue() !== null)) {
				var email = oSource.getValue();
				email = email.trim();
				email = email.toLowerCase();
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
				//oSource.setValue(Number(oSource.getValue()));
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only numbers");
			}
		},

		_doubleNumberValidation: function (oEvent) {


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

		VATRegNumValidation: function (oEvent) {

			var oSource = oEvent.getSource();
			var reg = /^[0-9]+$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter only number");
			}

			if (reg === true && oSource.getValue().length !== 15) {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter 15 digit VAT Reg. Number");
			}
		},

		TAXRegNumValidation: function (oEvent) {

			var cinRegex = /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/
			var oSource = oEvent.getSource();
			var cin = oSource.getValue();
			if (cin.match(cinRegex)) {
				oSource.setValueState(sap.ui.core.ValueState.None);
			}
			else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("eg. U72200MH2009PLC123456");
			}
		},

		OtherRegNumValidation: function (oEvent) {

			var oSource = oEvent.getSource();
			var maxLength = oEvent.getSource().getMaxLength();
			var reg = /^[0-9A-Z]+$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Only alphanumeric characters allowed");
			}

			if (reg === true && oSource.getValue().length > maxLength) {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Maximum lenght exceeded");
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

			// if (!isNaN(postalCodeLength)) {
			// 	if (oSource.getValue().length !== postalCodeLength && oSource.getValue().length !== 0) {
			// 		oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter valid postal code with " + postalCodeLength +
			// 			" digits");
			// 		oEvent.getSource().setValue("");
			// 	}
			// } else {
			// 	oSource.setValueState(sap.ui.core.ValueState.None);
			// }
		},

		_IBANValidation: function (oEvent) {

			var oSource = oEvent.getSource();
			var reg = /^([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?$/.test(oSource.getValue());
			if (reg === true || oSource.getValue() === "") {
				oSource.setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValue("");
				oSource.setValueState(sap.ui.core.ValueState.Error).setValueStateText("Enter Valid IBAN Number. e.g. IN840354031005632476001");
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

		checkIFEmpty: function (value, vModelId, mandatoryId) {

			var flag = false;
			if ((value === null || value === "" || value === undefined) && vModelId === "X" && mandatoryId === "X") {
				flag = true;
			}
			return flag;
		},

		checkIFNotEmpty: function (value, vModelId, mandatoryId) {

			var flag = false;
			if ((value !== null && value !== "" && value !== undefined) && vModelId === "X" && mandatoryId === "X") {
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
		checkOtherBankValuesNotEmpty: function (sValue) {
			var flag = false;
			if (sValue !== null || sValue !== "" || sValue !== undefined) {
				flag = true;
			}
			return flag;
		},

		_validateFirstSection: function (validObject, array_s1, headerData, data, vModel, mandatoryModel, oId, cId, labelModel) {

			if ((headerData[0].DIST_NAME1 === "" && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X") ||
				(headerData[0].DIST_NAME1 === null && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X") ||
				(headerData[0].DIST_NAME1 === undefined && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X")) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G1T1F1,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((headerData[0].DIST_NAME1 !== "" && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X") ||
				(headerData[0].DIST_NAME1 !== null && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X") ||
				(headerData[0].DIST_NAME1 !== undefined && vModel.S1G1T1F1 === "X" && mandatoryModel.S1G1T1F1 === "X")) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((headerData[0].DIST_NAME2 === "" && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X") ||
				(headerData[0].DIST_NAME2 === null && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X") ||
				(headerData[0].DIST_NAME2 === undefined && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X")) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G1T1F2,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((headerData[0].DIST_NAME2 !== "" && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X") ||
				(headerData[0].DIST_NAME2 !== null && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X") ||
				(headerData[0].DIST_NAME2 !== undefined && vModel.S1G1T1F2 === "X" && mandatoryModel.S1G1T1F2 === "X")) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((headerData[0].WEBSITE === "" && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X") ||
				(headerData[0].WEBSITE === null && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X") ||
				(headerData[0].WEBSITE === undefined && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X")) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G1T1F3,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((headerData[0].WEBSITE !== "" && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X") ||
				(headerData[0].WEBSITE !== null && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X") ||
				(headerData[0].WEBSITE !== undefined && vModel.S1G1T1F3 === "X" && mandatoryModel.S1G1T1F3 === "X")) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((headerData[0].PROPOSAL_DATE === "" && vModel.S1G1T1F5 === "X" && mandatoryModel.S1G1T1F5 === "X") ||
				(headerData[0].PROPOSAL_DATE === null && vModel.S1G1T1F5 === "X" && mandatoryModel.S1G1T1F5 === "X") ||
				(headerData[0].PROPOSAL_DATE === undefined && vModel.S1G1T1F5 === "X" && mandatoryModel.S1G1T1F5 === "X")) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G1T1F5,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((headerData[0].PROPOSAL_DATE !== "" && vModel.S1G1T1F5 === "X" && mandatoryModel.S1G1T1F5 === "X") ||
				(headerData[0].PROPOSAL_DATE !== null && vModel.S1G1T1F5 === "X" && mandatoryModel.S1G1T1F5 === "X") ||
				(headerData[0].PROPOSAL_DATE !== undefined && vModel.S1G1T1F5 === "X" && mandatoryModel.S1G1T1F5 === "X")) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			var subTitleString = [];

			if ((this.checkIFEmpty(data.address.STREET1, vModel.S1G2T1F1, mandatoryModel.S1G2T1F1))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F1 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(data.address.STREET1, vModel.S1G2T1F1, mandatoryModel.S1G2T1F1)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.STREET2, vModel.S1G2T1F2, mandatoryModel.S1G2T1F2)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F2 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(data.address.STREET2, vModel.S1G2T1F2, mandatoryModel.S1G2T1F2))) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.STREET3, vModel.S1G2T1F3, mandatoryModel.S1G2T1F3)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F3 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(data.address.STREET3, vModel.S1G2T1F3, mandatoryModel.S1G2T1F3))) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.STREET4, vModel.S1G2T1F4, mandatoryModel.S1G2T1F4)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F4 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(data.address.STREET4, vModel.S1G2T1F4, mandatoryModel.S1G2T1F4))) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.EMAIL, vModel.S1G2T1F5, mandatoryModel.S1G2T1F5)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F5 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(data.address.EMAIL, vModel.S1G2T1F5, mandatoryModel.S1G2T1F5))) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.COUNTRY, vModel.S1G2T1F6, mandatoryModel.S1G2T1F6)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F6 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(data.address.COUNTRY, vModel.S1G2T1F6, mandatoryModel.S1G2T1F6))) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.STATE, vModel.S1G2T1F7, mandatoryModel.S1G2T1F7)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F7 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(data.address.STATE, vModel.S1G2T1F7, mandatoryModel.S1G2T1F7))) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.CITY, vModel.S1G2T1F8, mandatoryModel.S1G2T1F8)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F8 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(data.address.CITY, vModel.S1G2T1F8, mandatoryModel.S1G2T1F8))) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.CONTACT_TELECODE, vModel.S1G2T1F9, mandatoryModel.S1G2T1F9)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter Telecode" + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			}

			if (this.checkIFEmpty(data.address.CONTACT_NO, vModel.S1G2T1F9, mandatoryModel.S1G2T1F9)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F9 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(data.address.CONTACT_TELECODE, vModel.S1G2T1F9, mandatoryModel.S1G2T1F9) && this.checkIFNotEmpty(data.address.CONTACT_NO, vModel.S1G2T1F9, mandatoryModel.S1G2T1F9)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (this.checkIFEmpty(data.address.POSTAL_CODE, vModel.S1G2T1F10, mandatoryModel.S1G2T1F10)) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G2T1F10 + " in Distributor Address",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(data.address.POSTAL_CODE, vModel.S1G2T1F10, mandatoryModel.S1G2T1F10))) {
				validObject.ManCount = validObject.ManCount + 1;
			}


			if (vModel.S1G3T1F11 === "X") {
				var otherAddressType = 0,
					otherAddressStreet1 = 0,
					otherAddressStreet2 = 0,
					otherAddressStreet3 = 0,
					otherAddressStreet4 = 0,
					otherAddressEmail = 0,
					otherAddressCountry = 0,
					otherAddressRegion = 0,
					otherAddressCity = 0,
					otherAddressContactNo = 0,
					otherAddressPostalCode = 0,
					otherAddressFaxNo = 0;


				if (data.otherAddress.length > 0) {

					for (var k = 0; k < data.otherAddress.length; k++) {
						var address = data.otherAddress[k];

						if (mandatoryModel.S1G3T1F12 === "X" && this.checkIFEmpty(address.ADDR_CODE, vModel.S1G3T1F12, mandatoryModel.S1G3T1F12)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F12 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F12 === "X" && this.checkIFNotEmpty(address.ADDR_CODE, vModel.S1G3T1F12, mandatoryModel.S1G3T1F12)) {
							otherAddressType = otherAddressType + 1;
						}

						if (mandatoryModel.S1G3T1F1 === "X" && this.checkIFEmpty(address.STREET1, vModel.S1G3T1F1, mandatoryModel.S1G3T1F1)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F1 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F1 === "X" && this.checkIFNotEmpty(address.STREET1, vModel.S1G3T1F1, mandatoryModel.S1G3T1F1)) {
							otherAddressStreet1 = otherAddressStreet1 + 1;
						}

						if (mandatoryModel.S1G3T1F2 === "X" && this.checkIFEmpty(address.STREET2, vModel.S1G3T1F2, mandatoryModel.S1G3T1F2)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F2 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F2 === "X" && this.checkIFNotEmpty(address.STREET2, vModel.S1G3T1F2, mandatoryModel.S1G3T1F2)) {
							otherAddressStreet2 = otherAddressStreet2 + 1;
						}

						if (mandatoryModel.S1G3T1F3 === "X" && this.checkIFEmpty(address.STREET3, vModel.S1G3T1F3, mandatoryModel.S1G3T1F3)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F3 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F3 === "X" && this.checkIFNotEmpty(address.STREET3, vModel.S1G3T1F3, mandatoryModel.S1G3T1F3)) {
							otherAddressStreet3 = otherAddressStreet3 + 1;
						}

						if (mandatoryModel.S1G3T1F4 === "X" && this.checkIFEmpty(address.STREET4, vModel.S1G3T1F4, mandatoryModel.S1G3T1F4)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F4 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F4 === "X" && this.checkIFNotEmpty(address.STREET4, vModel.S1G3T1F4, mandatoryModel.S1G3T1F4)) {
							otherAddressStreet4 = otherAddressStreet4 + 1;
						}

						if (mandatoryModel.S1G3T1F5 === "X" && this.checkIFEmpty(address.EMAIL, vModel.S1G3T1F5, mandatoryModel.S1G3T1F5)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F5 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F5 === "X" && this.checkIFNotEmpty(address.EMAIL, vModel.S1G3T1F5, mandatoryModel.S1G3T1F5)) {
							otherAddressEmail = otherAddressEmail + 1;
						}

						if (mandatoryModel.S1G3T1F6 === "X" && this.checkIFEmpty(address.COUNTRY, vModel.S1G3T1F6, mandatoryModel.S1G3T1F6)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F6 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F6 === "X" && this.checkIFNotEmpty(address.COUNTRY, vModel.S1G3T1F6, mandatoryModel.S1G3T1F6)) {
							otherAddressCountry = otherAddressCountry + 1;
						}

						if (mandatoryModel.S1G3T1F7 === "X" && this.checkIFEmpty(address.STATE, vModel.S1G3T1F7, mandatoryModel.S1G3T1F7)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F7 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F7 === "X" && this.checkIFNotEmpty(address.STATE, vModel.S1G3T1F7, mandatoryModel.S1G3T1F7)) {
							otherAddressRegion = otherAddressRegion + 1;
						}

						if (mandatoryModel.S1G3T1F8 === "X" && this.checkIFEmpty(address.CITY, vModel.S1G3T1F8, mandatoryModel.S1G3T1F8)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F8 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F8 === "X" && this.checkIFNotEmpty(address.CITY, vModel.S1G3T1F8, mandatoryModel.S1G3T1F8)) {
							otherAddressCity = otherAddressCity + 1;
						}

						if (mandatoryModel.S1G3T1F9 === "X" && this.checkIFEmpty(address.CONTACT_TELECODE, vModel.S1G3T1F9, mandatoryModel.S1G3T1F9)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": "Contact Telecode Missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						}

						if (mandatoryModel.S1G3T1F9 === "X" && this.checkIFEmpty(address.CONTACT_NO, vModel.S1G3T1F9, mandatoryModel.S1G3T1F9)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F9 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F9 === "X" && this.checkIFNotEmpty(address.CONTACT_NO, vModel.S1G3T1F9, mandatoryModel.S1G3T1F9)) {
							otherAddressContactNo = otherAddressContactNo + 1;
						}

						if (mandatoryModel.S1G3T1F10 === "X" && this.checkIFEmpty(address.POSTAL_CODE, vModel.S1G3T1F10, mandatoryModel.S1G3T1F10)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G3T1F10 + " missing in Other Office Address Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G3T1F10 === "X" && this.checkIFNotEmpty(address.POSTAL_CODE, vModel.S1G3T1F10, mandatoryModel.S1G3T1F10)) {
							otherAddressPostalCode = otherAddressPostalCode + 1;
						}
					}

					if (data.otherAddress.length === otherAddressType && mandatoryModel.S1G3T1F12 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressType;
					}
					if (data.otherAddress.length === otherAddressStreet1 && mandatoryModel.S1G3T1F1 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressStreet1;
					}
					if (data.otherAddress.length === otherAddressStreet2 && mandatoryModel.S1G3T1F2 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressStreet2;
					}
					if (data.otherAddress.length === otherAddressStreet3 && mandatoryModel.S1G3T1F3 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressStreet3;
					}
					if (data.otherAddress.length === otherAddressStreet4 && mandatoryModel.S1G3T1F4 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressStreet4;
					}
					if (data.otherAddress.length === otherAddressEmail && mandatoryModel.S1G3T1F5 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressEmail;
					}
					if (data.otherAddress.length === otherAddressCountry && mandatoryModel.S1G3T1F6 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressCountry;
					}
					if (data.otherAddress.length === otherAddressRegion && mandatoryModel.S1G3T1F7 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressRegion;
					}
					if (data.otherAddress.length === otherAddressCity && mandatoryModel.S1G3T1F8 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressCity;
					}
					if (data.otherAddress.length === otherAddressContactNo && mandatoryModel.S1G3T1F9 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressContactNo;
					}
					if (data.otherAddress.length === otherAddressPostalCode && mandatoryModel.S1G3T1F10 === 'X') {
						validObject.ManCount = validObject.ManCount + otherAddressPostalCode;
					}
				}
				// if (data.otherAddress.length > 0) {

				// 	var othOffColArray = [];
				// 	for (var i = 0; i < oId.getColumns().length; i++) {
				// 		if (oId.getColumns()[i].mBindingInfos.visible.binding.aValues[0] === "X") {
				// 			othOffColArray.push(oId.getColumns()[i]);
				// 		}
				// 	}

				// 	for (var j = 0; j < oId.mAggregations.rows.length; j++) {
				// 		for (var k = 0; k < oId.mAggregations.rows[j].mAggregations.cells.length - 1; k++) {
				// 			if (othOffColArray[k].mAggregations.label.mBindingInfos.required.binding.aValues[0] === "X") {
				// 				var sValue, sValue1, sValue2;
				// 				if (oId.mAggregations.rows[j].mAggregations.cells[k].mBindingInfos.value === undefined) {
				// 					sValue1 = oId.mAggregations.rows[j].mAggregations.cells[k].mAggregations.items[0].mProperties.value;
				// 					if (sValue1 === "" || sValue1 === null || sValue1 === undefined) {
				// 						validObject.fieldArray.push({
				// 							"section": 1,
				// 							"MandId": "",
				// 							"description": "TeleCode missing in Other Office Address Row: " + (j + 1),
				// 							"subtitle": "Mandatory Field",
				// 							"type": "Warning"
				// 						});
				// 					}

				// 					sValue2 = oId.mAggregations.rows[j].mAggregations.cells[k].mAggregations.items[1].mProperties.value;
				// 					if (sValue2 === "" || sValue2 === null || sValue2 === undefined) {
				// 						var sLabel = othOffColArray[k].mAggregations.label.mBindingInfos.text.binding.oValue;
				// 						validObject.fieldArray.push({
				// 							"section": 1,
				// 							"MandId": "",
				// 							"description": sLabel + " missing in Other Office Address Row: " + (j + 1),
				// 							"subtitle": "Mandatory Field",
				// 							"type": "Warning"
				// 						});
				// 					}
				// 					else {
				// 						validObject.ManCount = validObject.ManCount + 1;
				// 					}
				// 				}
				// 				else {
				// 					sValue = oId.mAggregations.rows[j].mAggregations.cells[k].mBindingInfos.value.binding.oValue;
				// 					if (sValue === "" || sValue === null || sValue === undefined) {
				// 						var sLabel = othOffColArray[k].mAggregations.label.mBindingInfos.text.binding.oValue;
				// 						validObject.fieldArray.push({
				// 							"section": 1,
				// 							"MandId": "",
				// 							"description": sLabel + " missing in Other Office Address Row: " + (j + 1),
				// 							"subtitle": "Mandatory Field",
				// 							"type": "Warning"
				// 						});
				// 					}
				// 					else {
				// 						validObject.ManCount = validObject.ManCount + 1;
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// }
			}

			if (vModel.S1G4T1F10 === "X") {

				var subTitleStringMDcontact = [];
				if ((this.checkIFEmpty(data.MDContact.NAME1, vModel.S1G4T1F1, mandatoryModel.S1G4T1F1))) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F1 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (this.checkIFNotEmpty(data.MDContact.NAME1, vModel.S1G4T1F1, mandatoryModel.S1G4T1F1)) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.NAME2, vModel.S1G4T1F11, mandatoryModel.S1G4T1F11)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F11 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (this.checkIFNotEmpty(data.MDContact.NAME2, vModel.S1G4T1F11, mandatoryModel.S1G4T1F11)) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.DESIGNATION, vModel.S1G4T1F2, mandatoryModel.S1G4T1F2)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F2 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if ((this.checkIFNotEmpty(data.MDContact.DESIGNATION, vModel.S1G4T1F2, mandatoryModel.S1G4T1F2))) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.CONTACT_TELECODE, vModel.S1G4T1F5, mandatoryModel.S1G4T1F5)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter Contact Telecode in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				if (this.checkIFEmpty(data.MDContact.CONTACT_NO, vModel.S1G4T1F5, mandatoryModel.S1G4T1F5)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F5 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (this.checkIFNotEmpty(data.MDContact.CONTACT_NO, vModel.S1G4T1F5, mandatoryModel.S1G4T1F5)) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.MOBILE_TELECODE, vModel.S1G4T1F6, mandatoryModel.S1G4T1F6)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter Mobile Telecode in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				}

				if (this.checkIFEmpty(data.MDContact.MOBILE_NO, vModel.S1G4T1F6, mandatoryModel.S1G4T1F6)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F6 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (this.checkIFNotEmpty(data.MDContact.MOBILE_NO, vModel.S1G4T1F6, mandatoryModel.S1G4T1F6)) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.EMAIL, vModel.S1G4T1F4, mandatoryModel.S1G4T1F4)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F4 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if ((this.checkIFNotEmpty(data.MDContact.EMAIL, vModel.S1G4T1F4, mandatoryModel.S1G4T1F4))) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.NATIONALITY, vModel.S1G4T1F3, mandatoryModel.S1G4T1F3)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F3 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if ((this.checkIFNotEmpty(data.MDContact.NATIONALITY, vModel.S1G4T1F3, mandatoryModel.S1G4T1F3))) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.STATE, vModel.S1G4T1F8, mandatoryModel.S1G4T1F8)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F8 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if ((this.checkIFNotEmpty(data.MDContact.STATE, vModel.S1G4T1F8, mandatoryModel.S1G4T1F8))) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.CITY, vModel.S1G4T1F7, mandatoryModel.S1G4T1F7)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F7 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if ((this.checkIFNotEmpty(data.MDContact.CITY, vModel.S1G4T1F7, mandatoryModel.S1G4T1F7))) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (this.checkIFEmpty(data.MDContact.POSTAL_CODE, vModel.S1G4T1F9, mandatoryModel.S1G4T1F9)) {
					validObject.fieldArray.push({
						"section": 1,
						"MandId": "",
						"description": "Enter " + labelModel.S1G4T1F9 + " in Primary Contact",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if ((this.checkIFNotEmpty(data.MDContact.POSTAL_CODE, vModel.S1G4T1F9, mandatoryModel.S1G4T1F9))) {
					validObject.ManCount = validObject.ManCount + 1;
				}

				// if (subTitleStringMDcontact.length > 0) {
				// 	validObject.fieldArray.push({
				// 		"section": 1,
				// 		"description": "Enter Primary Contact Details",
				// 		"subtitle": subTitleStringMDcontact.toString(),
				// 		"type": "Warning"
				// 	});
				// }
			}

			if (vModel.S1G5T2F11 === "X") {
				var contactName1 = 0,
					contactName2 = 0,
					contactDesignation = 0,
					contactNationality = 0,
					contactRegion = 0,
					contactCity = 0,
					contactEmail = 0,
					contactContactNo = 0,
					contactMobileNo = 0,
					contactPostalCode = 0

				for (var j = 0; j < data.contact.length; j++) {
					if (data.contact[j].CONTACT_TYPE === "AUTH") {
						if (mandatoryModel.S1G5T2F1 === "X" && this.checkIFEmpty(data.contact[j].NAME1, vModel.S1G5T2F1, mandatoryModel.S1G5T2F1)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F1 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F1 === "X" && this.checkIFNotEmpty(data.contact[j].NAME1, vModel.S1G5T2F1, mandatoryModel.S1G5T2F1)) {
							contactName1 = contactName1 + 1;
						}

						if (mandatoryModel.S1G5T2F13 === "X" && this.checkIFEmpty(data.contact[j].NAME2, vModel.S1G5T2F13, mandatoryModel.S1G5T2F13)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F13 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F13 === "X" && this.checkIFNotEmpty(data.contact[j].NAME2, vModel.S1G5T2F13, mandatoryModel.S1G5T2F13)) {
							contactName2 = contactName2 + 1;
						}

						if (mandatoryModel.S1G5T2F2 === "X" && this.checkIFEmpty(data.contact[j].DESIGNATION, vModel.S1G5T2F2, mandatoryModel.S1G5T2F2)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F2 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F2 === "X" && this.checkIFNotEmpty(data.contact[j].DESIGNATION, vModel.S1G5T2F2, mandatoryModel.S1G5T2F2)) {
							contactDesignation = contactDesignation + 1;
						}

						if (mandatoryModel.S1G5T2F3 === "X" && this.checkIFEmpty(data.contact[j].NATIONALITY, vModel.S1G5T2F3, mandatoryModel.S1G5T2F3)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F3 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F3 === "X" && this.checkIFNotEmpty(data.contact[j].NATIONALITY, vModel.S1G5T2F3, mandatoryModel.S1G5T2F3)) {
							contactNationality = contactNationality + 1;
						}

						if (mandatoryModel.S1G5T2F8 === "X" && this.checkIFEmpty(data.contact[j].STATE, vModel.S1G5T2F8, mandatoryModel.S1G5T2F8)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F8 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F8 === "X" && this.checkIFNotEmpty(data.contact[j].STATE, vModel.S1G5T2F8, mandatoryModel.S1G5T2F8)) {
							contactRegion = contactRegion + 1;
						}

						if (mandatoryModel.S1G5T2F7 === "X" && this.checkIFEmpty(data.contact[j].CITY, vModel.S1G5T2F7, mandatoryModel.S1G5T2F7)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F7 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F7 === "X" && this.checkIFNotEmpty(data.contact[j].CITY, vModel.S1G5T2F7, mandatoryModel.S1G5T2F7)) {
							contactCity = contactCity + 1;
						}

						if (mandatoryModel.S1G5T2F4 === "X" && this.checkIFEmpty(data.contact[j].EMAIL, vModel.S1G5T2F4, mandatoryModel.S1G5T2F4)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F4 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F4 === "X" && this.checkIFNotEmpty(data.contact[j].EMAIL, vModel.S1G5T2F4, mandatoryModel.S1G5T2F4)) {
							contactEmail = contactEmail + 1;
						}

						if (mandatoryModel.S1G5T2F5 === "X" && this.checkIFEmpty(data.contact[j].CONTACT_TELECODE, vModel.S1G5T2F5, mandatoryModel.S1G5T2F5)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": "Contact Telecode Missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						}

						if (mandatoryModel.S1G5T2F5 === "X" && this.checkIFEmpty(data.contact[j].CONTACT_NO, vModel.S1G5T2F5, mandatoryModel.S1G5T2F5)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F5 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F5 === "X" && this.checkIFNotEmpty(data.contact[j].CONTACT_TELECODE, vModel.S1G5T2F5, mandatoryModel.S1G5T2F5) &&
							this.checkIFNotEmpty(data.contact[j].CONTACT_NO, vModel.S1G5T2F5, mandatoryModel.S1G5T2F5)) {
							contactContactNo = contactContactNo + 1;
						}

						if (mandatoryModel.S1G5T2F6 === "X" && this.checkIFEmpty(data.contact[j].MOBILE_TELECODE, vModel.S1G5T2F6, mandatoryModel.S1G5T2F6)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": "Mobile Telecode Missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						}

						if (mandatoryModel.S1G5T2F6 === "X" && this.checkIFEmpty(data.contact[j].MOBILE_NO, vModel.S1G5T2F6, mandatoryModel.S1G5T2F6)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F6 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F6 === "X" && this.checkIFNotEmpty(data.contact[j].MOBILE_NO, vModel.S1G5T2F6, mandatoryModel.S1G5T2F6)) {
							contactMobileNo = contactMobileNo + 1;
						}

						if (mandatoryModel.S1G5T2F9 === "X" && this.checkIFEmpty(data.contact[j].POSTAL_CODE, vModel.S1G5T2F9, mandatoryModel.S1G5T2F9)) {
							validObject.fieldArray.push({
								"section": 1,
								"MandId": "",
								"description": labelModel.S1G5T2F9 + " missing in Other Contact Detail Row: " + (j + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S1G5T2F9 === "X" && this.checkIFNotEmpty(data.contact[j].POSTAL_CODE, vModel.S1G5T2F9, mandatoryModel.S1G5T2F9)) {
							contactPostalCode = contactPostalCode + 1;
						}
					}

					if (data.contact.length === contactName1 && mandatoryModel.S1G5T2F1 === 'X') {
						validObject.ManCount = validObject.ManCount + contactName1;
					}
					if (data.contact.length === contactName2 && mandatoryModel.S1G5T2F13 === 'X') {
						validObject.ManCount = validObject.ManCount + contactName2;
					}
					if (data.contact.length === contactDesignation && mandatoryModel.S1G5T2F2 === 'X') {
						validObject.ManCount = validObject.ManCount + contactDesignation;
					}
					if (data.contact.length === contactNationality && mandatoryModel.S1G5T2F3 === 'X') {
						validObject.ManCount = validObject.ManCount + contactNationality;
					}
					if (data.contact.length === contactRegion && mandatoryModel.S1G5T2F8 === 'X') {
						validObject.ManCount = validObject.ManCount + contactRegion;
					}
					if (data.contact.length === contactCity && mandatoryModel.S1G5T2F7 === 'X') {
						validObject.ManCount = validObject.ManCount + contactCity;
					}
					if (data.contact.length === contactEmail && mandatoryModel.S1G5T2F4 === 'X') {
						validObject.ManCount = validObject.ManCount + contactEmail;
					}
					if (data.contact.length === contactContactNo && mandatoryModel.S1G5T2F5 === 'X') {
						validObject.ManCount = validObject.ManCount + contactContactNo;
					}
					if (data.contact.length === contactMobileNo && mandatoryModel.S1G5T2F6 === 'X') {
						validObject.ManCount = validObject.ManCount + contactMobileNo;
					}
					if (data.contact.length === contactPostalCode && mandatoryModel.S1G5T2F9 === 'X') {
						validObject.ManCount = validObject.ManCount + contactPostalCode;
					}
				}

				// for (var j = 0; j < data.contact.length; j++) {
				// 	if (data.contact[j].CONTACT_TYPE === "AUTH") {

				// 		var othContactColArray = [];
				// 		for (var i = 0; i < cId.getColumns().length; i++) {
				// 			if (cId.getColumns()[i].mBindingInfos.visible.binding.aValues[0] === "X") {
				// 				othContactColArray.push(cId.getColumns()[i]);
				// 			}
				// 		}

				// 		for (var j = 0; j < cId.mAggregations.rows.length; j++) {
				// 			for (var k = 0; k < cId.mAggregations.rows[j].mAggregations.cells.length - 1; k++) {
				// 				if (othContactColArray[k].mAggregations.label.mBindingInfos.required.binding.aValues[0] === "X") {
				// 					var sValue, sValue1, sValue2;
				// 					if (cId.mAggregations.rows[j].mAggregations.cells[k].mBindingInfos.value === undefined) {
				// 						sValue1 = cId.mAggregations.rows[j].mAggregations.cells[k].mAggregations.items[0].mProperties.value;
				// 						if (sValue1 === "" || sValue1 === null || sValue1 === undefined) {
				// 							validObject.fieldArray.push({
				// 								"section": 1,
				// 								"MandId": "",
				// 								"description": "TeleCode missing in Other Contact Detail Row: " + (j + 1),
				// 								"subtitle": "Mandatory Field",
				// 								"type": "Warning"
				// 							});
				// 						}

				// 						sValue2 = cId.mAggregations.rows[j].mAggregations.cells[k].mAggregations.items[1].mProperties.value;
				// 						if (sValue2 === "" || sValue2 === null || sValue2 === undefined) {
				// 							var sLabel = othContactColArray[k].mAggregations.label.mBindingInfos.text.binding.oValue;
				// 							validObject.fieldArray.push({
				// 								"section": 1,
				// 								"MandId": "",
				// 								"description": sLabel + " missing in Other Contact Detail Row: " + (j + 1),
				// 								"subtitle": "Mandatory Field",
				// 								"type": "Warning"
				// 							});
				// 						}
				// 						else {
				// 							validObject.ManCount = validObject.ManCount + 1;
				// 						}
				// 					}
				// 					else {
				// 						sValue = cId.mAggregations.rows[j].mAggregations.cells[k].mBindingInfos.value.binding.oValue;
				// 						if (sValue === "" || sValue === null || sValue === undefined) {
				// 							var sLabel = othContactColArray[k].mAggregations.label.mBindingInfos.text.binding.oValue;
				// 							validObject.fieldArray.push({
				// 								"section": 1,
				// 								"MandId": "",
				// 								"description": sLabel + " missing in Other Contact Detail Row: " + (j + 1),
				// 								"subtitle": "Mandatory Field",
				// 								"type": "Warning"
				// 							});
				// 						}
				// 						else {
				// 							validObject.ManCount = validObject.ManCount + 1;
				// 						}
				// 					}
				// 				}
				// 			}
				// 		}
				// 	}
				// }
			}

			if ((this.checkIFEmpty(headerData[0].TOT_PERM_EMP, vModel.S1G7T1F1, mandatoryModel.S1G7T1F1))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F1,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].TOT_PERM_EMP, vModel.S1G7T1F1, mandatoryModel.S1G7T1F1)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerData[0].NOE_QA, vModel.S1G7T1F6, mandatoryModel.S1G7T1F6))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F6,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].NOE_QA, vModel.S1G7T1F6, mandatoryModel.S1G7T1F6)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerData[0].NOE_MAN, vModel.S1G7T1F7, mandatoryModel.S1G7T1F7))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F7,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].NOE_MAN, vModel.S1G7T1F7, mandatoryModel.S1G7T1F7)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerData[0].NOE_ACC, vModel.S1G7T1F3, mandatoryModel.S1G7T1F3))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F3,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].NOE_ACC, vModel.S1G7T1F3, mandatoryModel.S1G7T1F3)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerData[0].NOE_ADM, vModel.S1G7T1F4, mandatoryModel.S1G7T1F4))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F4,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].NOE_ADM, vModel.S1G7T1F4, mandatoryModel.S1G7T1F4)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerData[0].NOE_HR, vModel.S1G7T1F5, mandatoryModel.S1G7T1F5))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F5,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].NOE_HR, vModel.S1G7T1F5, mandatoryModel.S1G7T1F5)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerData[0].NOE_SAL, vModel.S1G7T1F8, mandatoryModel.S1G7T1F8))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F8,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].NOE_SAL, vModel.S1G7T1F8, mandatoryModel.S1G7T1F8)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerData[0].NOE_SEC, vModel.S1G7T1F9, mandatoryModel.S1G7T1F9))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F9,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].NOE_SEC, vModel.S1G7T1F9, mandatoryModel.S1G7T1F9)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerData[0].NOE_ANY, vModel.S1G7T1F10, mandatoryModel.S1G7T1F10))) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Enter " + labelModel.S1G7T1F10,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (this.checkIFNotEmpty(headerData[0].NOE_ANY, vModel.S1G7T1F10, mandatoryModel.S1G7T1F10)) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((headerData[0].ORG_ESTAB_YEAR === null && vModel.S1G6T1F1 === "X" && mandatoryModel.S1G6T1F1 === "X") ||
				(headerData[0].ORG_ESTAB_YEAR === "" && vModel.S1G6T1F1 === "X" && mandatoryModel.S1G6T1F1 === "X") ||
				(headerData[0].ORG_ESTAB_YEAR === undefined && vModel.S1G6T1F1 === "X" && mandatoryModel.S1G6T1F1 === "X")) {
				validObject.fieldArray.push({
					"section": 1,
					"description": "Select " + labelModel.S1G6T1F1,
					"subtitle": "Mandatory",
					"type": "Warning"
				});
			} else if ((headerData[0].ORG_ESTAB_YEAR !== null && vModel.S1G6T1F1 === "X" && mandatoryModel.S1G6T1F1 === "X") ||
				(headerData[0].ORG_ESTAB_YEAR !== "" && vModel.S1G6T1F1 === "X" && mandatoryModel.S1G6T1F1 === "X") ||
				(headerData[0].ORG_ESTAB_YEAR !== undefined && vModel.S1G6T1F1 === "X" && mandatoryModel.S1G6T1F1 === "X")) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			return validObject;
		},

		validateSectionTwo: function (validObject, array_s1, headerArray, bankDetails, data, vModel, mandatoryModel, labelModel, bId) {
			// debugger;
			var bankCountryTable = 0;
			var swiftCodeTable = 0;
			var bankNameTable = 0;
			var branchNameTable = 0;
			var accNoTable = 0;
			var ibanNoTable = 0;
			var benificaryNameTable = 0;
			var bankCurrencyTable = 0;
			var othercodeNameTable = 0;
			var otherCodeValTable = 0;
			var routingCodeTable = 0;

			if (bankDetails.length > 0) {

				if (bankDetails[0].BANK_COUNTRY === null && vModel.S2G1T1F1 === "X" && mandatoryModel.S2G1T1F1 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Select " + labelModel.S2G1T1F1 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].BANK_COUNTRY !== null && vModel.S2G1T1F1 === "X" && mandatoryModel.S2G1T1F1 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].SWIFT_CODE === null && vModel.S2G1T1F2 === "X" && mandatoryModel.S2G1T1F2 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Select " + labelModel.S2G1T1F2 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].SWIFT_CODE !== null && vModel.S2G1T1F2 === "X" && mandatoryModel.S2G1T1F2 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].NAME === null && vModel.S2G1T1F3 === "X" && mandatoryModel.S2G1T1F3 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Enter " + labelModel.S2G1T1F3 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].NAME !== null && vModel.S2G1T1F3 === "X" && mandatoryModel.S2G1T1F3 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].BENEFICIARY === null && vModel.S2G1T1F5 === "X" && mandatoryModel.S2G1T1F5 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Enter " + labelModel.S2G1T1F5 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].BENEFICIARY !== null && vModel.S2G1T1F5 === "X" && mandatoryModel.S2G1T1F5 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].ACCOUNT_NO === null && vModel.S2G1T1F6 === "X" && mandatoryModel.S2G1T1F6 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Enter " + labelModel.S2G1T1F6 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].ACCOUNT_NO !== null && vModel.S2G1T1F6 === "X" && mandatoryModel.S2G1T1F6 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].BRANCH_NAME === null && vModel.S2G1T1F4 === "X" && mandatoryModel.S2G1T1F4 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Enter " + labelModel.S2G1T1F4 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].BRANCH_NAME !== null && vModel.S2G1T1F4 === "X" && mandatoryModel.S2G1T1F4 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].IBAN_NUMBER === null && vModel.S2G1T1F7 === "X" && mandatoryModel.S2G1T1F7 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Enter " + labelModel.S2G1T1F7 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].IBAN_NUMBER !== null && vModel.S2G1T1F7 === "X" && mandatoryModel.S2G1T1F7 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].ROUTING_CODE === null && vModel.S2G1T1F8 === "X" && mandatoryModel.S2G1T1F8 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Enter " + labelModel.S2G1T1F8 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].ROUTING_CODE !== null && vModel.S2G1T1F8 === "X" && mandatoryModel.S2G1T1F8 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].OTHER_CODE_VAL === null && vModel.S2G1T1F11 === "X" && mandatoryModel.S2G1T1F11 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Enter " + labelModel.S2G1T1F11 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].OTHER_CODE_VAL !== null && vModel.S2G1T1F11 === "X" && mandatoryModel.S2G1T1F11 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].OTHER_CODE_NAME === null && vModel.S2G1T1F9 === "X" && mandatoryModel.S2G1T1F9 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Enter " + labelModel.S2G1T1F9 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].OTHER_CODE_NAME !== null && vModel.S2G1T1F9 === "X" && mandatoryModel.S2G1T1F9 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}

				if (bankDetails[0].BANK_CURRENCY === null && vModel.S2G1T1F10 === "X" && mandatoryModel.S2G1T1F10 === "X") {
					validObject.fieldArray.push({
						"section": 2,
						"MandId": "",
						"description": "Select " + labelModel.S2G1T1F10 + " in Primary Payment details",
						"subtitle": "Mandatory Field",
						"type": "Warning"
					});
				} else if (bankDetails[0].BANK_CURRENCY !== null && vModel.S2G1T1F10 === "X" && mandatoryModel.S2G1T1F10 === "X") {
					validObject.ManCount = validObject.ManCount + 1;
				}
			}

			// if (data.otherBankDetails.length > 0) {

			// 	var othBankColArray = [];
			// 	for (var i = 0; i < bId.getColumns().length; i++) {
			// 		if (bId.getColumns()[i].mBindingInfos.visible.binding.aValues[0] === "X") {
			// 			othBankColArray.push(bId.getColumns()[i]);
			// 		}
			// 	}

			// 	for (var j = 0; j < bId.mAggregations.rows.length; j++) {
			// 		for (var k = 0; k < bId.mAggregations.rows[j].mAggregations.cells.length - 1; k++) {
			// 			if (othBankColArray[k].mAggregations.label.mBindingInfos.required.binding.aValues[0] === "X") {
			// 				var sValue, sValue1;
			// 				if (bId.mAggregations.rows[j].mAggregations.cells[k].mBindingInfos.value === undefined) {
			// 					sValue1 = bId.mAggregations.rows[j].mAggregations.cells[k].mProperties.value;
			// 					if (sValue1 === "" || sValue1 === null || sValue1 === undefined) {
			// 						var sLabel = othBankColArray[k].mAggregations.label.mBindingInfos.text.binding.oValue;
			// 						validObject.fieldArray.push({
			// 							"section": 2,
			// 							"MandId": "",
			// 							"description": sLabel + " missing in Other Bank Details Row: " + (j + 1),
			// 							"subtitle": "Mandatory Field",
			// 							"type": "Warning"
			// 						});
			// 					}
			// 					else {
			// 						validObject.ManCount = validObject.ManCount + 1;
			// 					}
			// 				}
			// 				else {
			// 					sValue = bId.mAggregations.rows[j].mAggregations.cells[k].mBindingInfos.value.binding.oValue;
			// 					if (sValue === "" || sValue === null || sValue === undefined) {
			// 						var sLabel = othBankColArray[k].mAggregations.label.mBindingInfos.text.binding.oValue;
			// 						validObject.fieldArray.push({
			// 							"section": 2,
			// 							"MandId": "",
			// 							"description": sLabel + " missing in Other Bank Details Row: " + (j + 1),
			// 							"subtitle": "Mandatory Field",
			// 							"type": "Warning"
			// 						});
			// 					}
			// 					else {
			// 						validObject.ManCount = validObject.ManCount + 1;
			// 					}
			// 				}
			// 			}
			// 		}
			// 	}
			// }

			if (data.otherBankDetails.length > 0) {

				for (var k = 0; k < data.otherBankDetails.length; k++) {

					if (mandatoryModel.S2G2T1F1 === "X" && this.checkOtherBankValues(data.otherBankDetails[k].BANK_COUNTRY)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F1 + " missing in Other Payment Details Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (mandatoryModel.S2G2T1F1 === "X" && this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].BANK_COUNTRY)) {
						bankCountryTable = bankCountryTable + 1;
					}

					if (mandatoryModel.S2G2T1F2 === "X" && this.checkOtherBankValues(data.otherBankDetails[k].SWIFT_CODE)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F2 + " missing in Other Bank Payment Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (mandatoryModel.S2G2T1F2 === "X" && this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].SWIFT_CODE)) {
						swiftCodeTable = swiftCodeTable + 1;
					}

					if (mandatoryModel.S2G2T1F3 === "X" && this.checkOtherBankValues(data.otherBankDetails[k].NAME)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F3 + " missing in Other Bank Payment Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (mandatoryModel.S2G2T1F3 === "X" && this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].NAME)) {
						bankNameTable = bankNameTable + 1;
					}

					if (mandatoryModel.S2G2T1F4 === "X" && this.checkOtherBankValues(data.otherBankDetails[k].BRANCH_NAME) && mandatoryModel.S2G2T1F4) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F4 + " missing in Other Payment Details Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (mandatoryModel.S2G2T1F4 === "X" && this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].BRANCH_NAME) &&
						mandatoryModel.S2G2T1F4) {
						branchNameTable = branchNameTable + 1;
					}

					if (mandatoryModel.S2G2T1F6 === "X" && this.checkOtherBankValues(data.otherBankDetails[k].ACCOUNT_NO)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F6 + " missing in Other Payment Details Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (mandatoryModel.S2G2T1F6 === "X" && this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].ACCOUNT_NO)) {
						accNoTable = accNoTable + 1;
					}

					if (data.otherBankDetails[k].REQUIRED !== false && this.checkOtherBankValues(data.otherBankDetails[k].IBAN_NUMBER)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F7 + " missing in Other Payment Details Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (data.otherBankDetails[k].REQUIRED !== false && this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].IBAN_NUMBER)) {
						ibanNoTable = ibanNoTable + 1;
					}

					if (mandatoryModel.S2G2T1F5 === "X" && this.checkOtherBankValues(data.otherBankDetails[k].BENEFICIARY) && mandatoryModel.S2G2T1F5) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F5 + " missing in Other Payment Details Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (mandatoryModel.S2G2T1F5 === "X" && this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].BENEFICIARY) &&
						mandatoryModel.S2G2T1F5) {
						benificaryNameTable = benificaryNameTable + 1;
					}

					if (mandatoryModel.S2G2T1F10 === "X" && this.checkOtherBankValues(data.otherBankDetails[k].BANK_CURRENCY)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F10 + " missing in Other Payment Details Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (mandatoryModel.S2G2T1F10 === "X" && this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].BANK_CURRENCY)) {
						bankCurrencyTable = bankCurrencyTable + 1;
					}

					if (data.otherBankDetails[k].BANK_COUNTRY === "US" || data.otherBankDetails[k].BANK_COUNTRY === "AU" || data.otherBankDetails[k].BANK_COUNTRY ===
						"CA" || mandatoryModel.S2G2T1F8) {
						if (this.checkOtherBankValues(data.otherBankDetails[k].ROUTING_CODE)) {
							validObject.fieldArray.push({
								"section": 2,
								"MandId": "",
								"description": labelModel.S2G2T1F8 + " missing in Other Payment Details Row: " + (k + 1),
								"subtitle": "Other Bank Details",
								"type": "Warning"
							});
						} else if (this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].ROUTING_CODE)) {
							routingCodeTable = routingCodeTable + 1;
						}
					}

					if ((mandatoryModel.S2G2T1F9 === "X" && data.otherBankDetails[k].BANK_COUNTRY === "IN") && this.checkOtherBankValues(data.otherBankDetails[k].OTHER_CODE_NAME)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F9 + " missing in Other Payment Details Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].OTHER_CODE_NAME) && mandatoryModel.S2G2T1F9) {
						othercodeNameTable = othercodeNameTable + 1;
					}

					if ((mandatoryModel.S2G2T1F12 === "X" && data.otherBankDetails[k].BANK_COUNTRY === "IN") && this.checkOtherBankValues(data.otherBankDetails[k].OTHER_CODE_VAL)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": labelModel.S2G2T1F12 + " missing in Other Payment Details Row: " + (k + 1),
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (this.checkOtherBankValuesNotEmpty(data.otherBankDetails[k].OTHER_CODE_VAL) && mandatoryModel.S2G2T1F12) {
						otherCodeValTable = otherCodeValTable + 1;
					}
				}

				if (data.otherBankDetails.length === bankCountryTable && mandatoryModel.S2G2T1F1 === 'X') {
					validObject.ManCount = validObject.ManCount + bankCountryTable;
				}
				if (data.otherBankDetails.length === swiftCodeTable && mandatoryModel.S2G2T1F2 === 'X') {
					validObject.ManCount = validObject.ManCount + swiftCodeTable;
				}
				if (data.otherBankDetails.length === bankNameTable && mandatoryModel.S2G2T1F3 === 'X') {
					validObject.ManCount = validObject.ManCount + bankNameTable;
				}
				if (data.otherBankDetails.length === branchNameTable && mandatoryModel.S2G2T1F4 === 'X') {
					validObject.ManCount = validObject.ManCount + branchNameTable;
				}
				if (data.otherBankDetails.length === accNoTable && mandatoryModel.S2G2T1F6 === 'X') {
					validObject.ManCount = validObject.ManCount + accNoTable;
				}
				if (data.otherBankDetails.length === ibanNoTable && mandatoryModel.S2G2T1F7 === 'X') {
					validObject.ManCount = validObject.ManCount + ibanNoTable;
				}
				if (data.otherBankDetails.length === benificaryNameTable && mandatoryModel.S2G2T1F5 === 'X') {
					validObject.ManCount = validObject.ManCount + benificaryNameTable;
				}
				if (data.otherBankDetails.length === bankCurrencyTable && mandatoryModel.S2G2T1F10 === 'X') {
					validObject.ManCount = validObject.ManCount + bankCurrencyTable;
				}
				if (data.otherBankDetails.length === othercodeNameTable && mandatoryModel.S2G2T1F9 === 'X') {
					validObject.ManCount = validObject.ManCount + othercodeNameTable;
				}
				if (data.otherBankDetails.length === otherCodeValTable && mandatoryModel.S2G2T1F12 === 'X') {
					validObject.ManCount = validObject.ManCount + otherCodeValTable;
				}
				if (data.otherBankDetails.length === routingCodeTable && mandatoryModel.S2G2T1F8 === 'X') {
					validObject.ManCount = validObject.ManCount + routingCodeTable;
				}
			}

			if (vModel.S2G3T1F6 === "X") {
				if (data.BankingDetails.length > 0) {
					var bankName = 0;
					var branchName = 0;
					var facility = 0;
					var limit = 0;
					var association = 0;
					for (var k = 0; k < data.BankingDetails.length; k++) {
						if (mandatoryModel.S2G3T1F1 === "X" && this.checkOtherBankValues(data.BankingDetails[k].NAME)) {
							validObject.fieldArray.push({
								"section": 2,
								"MandId": "",
								"description": labelModel.S2G3T1F1 + " missing in Other Bank Details Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S2G3T1F1 === "X" && this.checkOtherBankValuesNotEmpty(data.BankingDetails[k].NAME)) {
							bankName = bankName + 1;
						}

						if (mandatoryModel.S2G3T1F2 === "X" && this.checkOtherBankValues(data.BankingDetails[k].BRANCH_NAME)) {
							validObject.fieldArray.push({
								"section": 2,
								"MandId": "",
								"description": labelModel.S2G3T1F2 + " missing in Other Bank Details Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S2G3T1F2 === "X" && this.checkOtherBankValuesNotEmpty(data.BankingDetails[k].BRANCH_NAME)) {
							branchName = branchName + 1;
						}

						if (mandatoryModel.S2G3T1F3 === "X" && this.checkOtherBankValues(data.BankingDetails[k].FACILTY)) {
							validObject.fieldArray.push({
								"section": 2,
								"MandId": "",
								"description": labelModel.S2G3T1F3 + " missing in Other Bank Details Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S2G3T1F3 === "X" && this.checkOtherBankValuesNotEmpty(data.BankingDetails[k].FACILTY)) {
							facility = facility + 1;
						}

						if (mandatoryModel.S2G3T1F4 === "X" && this.checkOtherBankValues(data.BankingDetails[k].AMOUNT_LIMIT)) {
							validObject.fieldArray.push({
								"section": 2,
								"MandId": "",
								"description": labelModel.S2G3T1F4 + " missing in Other Bank Details Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S2G3T1F4 === "X" && this.checkOtherBankValuesNotEmpty(data.BankingDetails[k].AMOUNT_LIMIT)) {
							limit = limit + 1;
						}

						if (mandatoryModel.S2G3T1F5 === "X" && this.checkOtherBankValues(data.BankingDetails[k].ASSO_SINCE)) {
							validObject.fieldArray.push({
								"section": 2,
								"MandId": "",
								"description": labelModel.S2G3T1F5 + " missing in Other Bank Details Row: " + (k + 1),
								"subtitle": "Mandatory Field",
								"type": "Warning"
							});
						} else if (mandatoryModel.S2G3T1F5 === "X" && this.checkOtherBankValuesNotEmpty(data.BankingDetails[k].ASSO_SINCE)) {
							association = association + 1;
						}
					}

					if (data.BankingDetails.length === bankName && mandatoryModel.S2G3T1F1 === 'X') {
						validObject.ManCount = validObject.ManCount + bankName;
					}
					if (data.BankingDetails.length === branchName && mandatoryModel.S2G3T1F2 === 'X') {
						validObject.ManCount = validObject.ManCount + branchName;
					}
					if (data.BankingDetails.length === facility && mandatoryModel.S2G3T1F3 === 'X') {
						validObject.ManCount = validObject.ManCount + facility;
					}
					if (data.BankingDetails.length === limit && mandatoryModel.S2G3T1F4 === 'X') {
						validObject.ManCount = validObject.ManCount + limit;
					}
					if (data.BankingDetails.length === association && mandatoryModel.S2G3T1F5 === 'X') {
						validObject.ManCount = validObject.ManCount + association;
					}
				}
			}

			//--------------------------------yogendra start---------------------------------------------//

			if (vModel.S2G2T1F1 === "X" && mandatoryModel.S2G2T1F1 === "X") {
				var totalRevTab = 0;
				var netProfitTab = 0;
				var totalAssetTab = 0;
				var totalEquity = 0;
				var currentyfinTab = 0;
				for (var i = 0; i < data.finInfo.length; i++) {

					if (this.checkIFEmpty(data.finInfo[i].TOTAL_REVENUE, vModel.S2G2T1F1, mandatoryModel.S2G2T1F1)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": "Total Revenue in Financial Information of year: " + data.finInfo[i].FIN_YEAR,
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.finInfo[i].TOTAL_REVENUE, vModel.S2G2T1F1, mandatoryModel.S2G2T1F1)) {
						totalRevTab = totalRevTab + 1;
					}
					if (this.checkIFEmpty(data.finInfo[i].NET_PROFIT_LOSS, vModel.S2G2T2F1, mandatoryModel.S2G2T2F1)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": "Net Profit/loss in Financial Information of year: " + data.finInfo[i].FIN_YEAR,
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.finInfo[i].NET_PROFIT_LOSS, vModel.S2G2T2F1, mandatoryModel.S2G2T2F1)) {
						netProfitTab = netProfitTab + 1;
					}
					if (this.checkIFEmpty(data.finInfo[i].TOTAL_ASSETS, vModel.S2G2T3F1, mandatoryModel.S2G2T3F1)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": "Total Assets in Financial Information of year: " + data.finInfo[i].FIN_YEAR,
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.finInfo[i].TOTAL_ASSETS, vModel.S2G2T3F1, mandatoryModel.S2G2T3F1)) {
						totalAssetTab = totalAssetTab + 1;
					}
					if (this.checkIFEmpty(data.finInfo[i].TOTAL_EQUITY, vModel.S2G2T4F1, mandatoryModel.S2G2T4F1)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": "Total Equity in Financial Information of year: " + data.finInfo[i].FIN_YEAR,
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.finInfo[i].TOTAL_EQUITY, vModel.S2G2T4F1, mandatoryModel.S2G2T4F1)) {
						totalEquity = totalEquity + 1;
					}
					if (this.checkIFEmpty(data.finInfo[i].CURRENCY, vModel.S2G2T5F1, mandatoryModel.S2G2T5F1)) {
						validObject.fieldArray.push({
							"section": 2,
							"MandId": "",
							"description": "Currency in Financial Information of year: " + data.finInfo[i].FIN_YEAR,
							"subtitle": "Mandatory Field",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.finInfo[i].CURRENCY, vModel.S2G2T5F1, mandatoryModel.S2G2T5F1)) {
						currentyfinTab = currentyfinTab + 1;
					}
				}
				if (data.finInfo.length !== 0 && data.finInfo.length === totalRevTab) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.finInfo.length !== 0 && data.finInfo.length === netProfitTab) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.finInfo.length !== 0 && data.finInfo.length === totalAssetTab) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.finInfo.length !== 0 && data.finInfo.length === totalEquity) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.finInfo.length !== 0 && data.finInfo.length === currentyfinTab) {
					validObject.ManCount = validObject.ManCount + 1;
				}
			}

			//----------------------------yogendra end-----------------------------------------------------//
		},

		validateSectionThree: function (validObject, array_s1, headerArray, data, vModel, mandatoryModel, labelModel) {

			if (vModel.S3G1T1F7 === "X") {
				var dealership = 0;
				var suppName = 0;
				var since = 0;
				var prodGroup = 0;
				var purhase = 0;
				for (var i = 0; i < data.busHistory.length; i++) {

					if (this.checkIFEmpty(data.busHistory[i].DEALERSHIP, vModel.S3G1T1F1, mandatoryModel.S3G1T1F1)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G1T1F1 + " missing in Business History Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.busHistory[i].DEALERSHIP, vModel.S3G1T1F1, mandatoryModel.S3G1T1F1)) {
						dealership = dealership + 1;
					}

					if (this.checkIFEmpty(data.busHistory[i].SUPPLIER_NAME, vModel.S3G1T1F2, mandatoryModel.S3G1T1F2)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G1T1F2 + " missing in Business History Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.busHistory[i].SUPPLIER_NAME, vModel.S3G1T1F2, mandatoryModel.S3G1T1F2)) {
						suppName = suppName + 1;
					}

					if (this.checkIFEmpty(data.busHistory[i].SINCE, vModel.S3G1T1F3, mandatoryModel.S3G1T1F3)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G1T1F3 + " missing in Business History Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.busHistory[i].SINCE, vModel.S3G1T1F3, mandatoryModel.S3G1T1F3)) {
						since = since + 1;
					}

					if (this.checkIFEmpty(data.busHistory[i].PROD_GROUP, vModel.S3G1T1F4, mandatoryModel.S3G1T1F4)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G1T1F4 + " missing in Business History Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.busHistory[i].PROD_GROUP, vModel.S3G1T1F4, mandatoryModel.S3G1T1F4)) {
						prodGroup = prodGroup + 1;
					}

					if (this.checkIFEmpty(data.busHistory[i].PURCHASES, vModel.S3G1T1F5, mandatoryModel.S3G1T1F5)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G1T1F5 + " missing in Business History Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.busHistory[i].PURCHASES, vModel.S3G1T1F5, mandatoryModel.S3G1T1F5)) {
						purhase = purhase + 1;
					}
				}

				if (data.busHistory.length === dealership) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.busHistory.length === suppName) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.busHistory.length === since) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.busHistory.length === prodGroup) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.busHistory.length === purhase) {
					validObject.ManCount = validObject.ManCount + 1;
				}
			}

			if (vModel.S3G2T1F5 === "X") {
				var customerName = 0;
				var customerNumber = 0;
				var year1 = 0;
				var year2 = 0;
				
				for (var i = 0; i < data.customerDetail.length; i++) {

					if (this.checkIFEmpty(data.customerDetail[i].CUST_NO, vModel.S3G2T1F4, mandatoryModel.S3G2T1F4)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G2T1F4 + " missing in Customer Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.customerDetail[i].CUST_NO, vModel.S3G2T1F4, mandatoryModel.S3G2T1F4)) {
						customerNumber = customerNumber + 1;
					}

					if (this.checkIFEmpty(data.customerDetail[i].CUSTOMER_NAME, vModel.S3G2T1F1, mandatoryModel.S3G2T1F1)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G2T1F1 + " missing in Customer Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.customerDetail[i].CUSTOMER_NAME, vModel.S3G2T1F1, mandatoryModel.S3G2T1F1)) {
						customerName = customerName + 1;
					}

					if (this.checkIFEmpty(data.customerDetail[i].YEAR1, vModel.S3G2T1F2, mandatoryModel.S3G2T1F2)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G2T1F2 + " missing in Customer Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.customerDetail[i].YEAR1, vModel.S3G2T1F2, mandatoryModel.S3G2T1F2)) {
						year1 = year1 + 1;
					}

					if (this.checkIFEmpty(data.customerDetail[i].YEAR2, vModel.S3G2T1F3, mandatoryModel.S3G2T1F3)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G2T1F3 + " missing in Customer Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.customerDetail[i].YEAR2, vModel.S3G2T1F3, mandatoryModel.S3G2T1F3)) {
						year2 = year2 + 1;
					}
				}

				if (data.customerDetail.length === customerName) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.customerDetail.length === customerNumber) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.customerDetail.length === year1) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.customerDetail.length === year2) {
					validObject.ManCount = validObject.ManCount + 1;
				}
			}

			if (vModel.S3G3T1F8 === "X") {
				var name = 0;
				var qualification = 0;
				var work = 0;
				var completion = 0;
				var designation = 0;
				var role = 0;
				
				for (var i = 0; i < data.promotors.length; i++) {
					if (this.checkIFEmpty(data.promotors[i].NAME, vModel.S3G3T1F1, mandatoryModel.S3G3T1F1)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G3T1F1 + " missing in Promotor Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.promotors[i].NAME, vModel.S3G3T1F1, mandatoryModel.S3G3T1F1)) {
						name = name + 1;
					}

					if (this.checkIFEmpty(data.promotors[i].QUALIFICATION, vModel.S3G3T1F2, mandatoryModel.S3G3T1F2)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G3T1F2 + " missing in Promotor Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.promotors[i].QUALIFICATION, vModel.S3G3T1F2, mandatoryModel.S3G3T1F2)) {
						qualification = qualification + 1;
					}

					if (this.checkIFEmpty(data.promotors[i].WORK_EXP, vModel.S3G3T1F3, mandatoryModel.S3G3T1F3)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G3T1F3 + " missing in Promotor Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.promotors[i].WORK_EXP, vModel.S3G3T1F3, mandatoryModel.S3G3T1F3)) {
						work = work + 1;
					}

					if (this.checkIFEmpty(data.promotors[i].YRS_IN_COMP, vModel.S3G3T1F4, mandatoryModel.S3G3T1F4)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G3T1F4 + " missing in Promotor Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.promotors[i].YRS_IN_COMP, vModel.S3G3T1F4, mandatoryModel.S3G3T1F4)) {
						completion = completion + 1;
					}

					if (this.checkIFEmpty(data.promotors[i].DESIGNATION, vModel.S3G3T1F5, mandatoryModel.S3G3T1F5)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G3T1F5 + " missing in Promotor Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.promotors[i].DESIGNATION, vModel.S3G3T1F5, mandatoryModel.S3G3T1F5)) {
						designation = designation + 1;
					}

					if (this.checkIFEmpty(data.promotors[i].ROLE, vModel.S3G3T1F6, mandatoryModel.S3G3T1F6)) {
						validObject.fieldArray.push({
							"section": 3,
							"MandId": "",
							"description": labelModel.S3G3T1F6 + " missing in Promotor Details Row: " + (i + 1),
							"subtitle": "Mandatory Fields",
							"type": "Warning"
						});
					} else if (this.checkIFNotEmpty(data.promotors[i].ROLE, vModel.S3G3T1F6, mandatoryModel.S3G3T1F6)) {
						role = role + 1;
					}
				}

				if (data.promotors.length === name) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.promotors.length === qualification) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.promotors.length === work) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.promotors.length === completion) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.promotors.length === designation) {
					validObject.ManCount = validObject.ManCount + 1;
				}
				if (data.promotors.length === role) {
					validObject.ManCount = validObject.ManCount + 1;
				}
			}
		},

		validateSectionFour: function (validObject, array_s1, headerArray, data, disclousersData, i18nModel, vModel, mandatoryModel, labelModel) {
			//Conflict of Interest:
			if (disclousersData[0].INTEREST_CONFLICT === null && vModel.S4G1D1 === "X" && mandatoryModel.S4G1D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Select Conflict of Interest",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (disclousersData[0].INTEREST_CONFLICT !== null && vModel.S4G1D1 === "X" && mandatoryModel.S4G1D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].ANY_LEGAL_CASES === null && vModel.S4G2D1 === "X" && mandatoryModel.S4G2D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Select Legal Case Disclosure",
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (disclousersData[0].ANY_LEGAL_CASES !== null && vModel.S4G2D1 === "X" && mandatoryModel.S4G2D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].ACADEMIC_DISCOUNT === null && vModel.S4G4D1 === "X" && mandatoryModel.S4G4D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Select " + labelModel.S4G4D1,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (disclousersData[0].ACADEMIC_DISCOUNT !== null && vModel.S4G4D1 === "X" && mandatoryModel.S4G4D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].RELATIVE_WORKING === null && vModel.S4G5D1 === "X" && mandatoryModel.S4G5D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Select " + labelModel.S4G5D1,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (disclousersData[0].RELATIVE_WORKING !== null && vModel.S4G5D1 === "X" && mandatoryModel.S4G5D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].REACH_COMPLIANCE === null && vModel.S4G7D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Select " + labelModel.S4G7D1,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (disclousersData[0].REACH_COMPLIANCE !== null && vModel.S4G7D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].CLP_COMPLIANCE === null && vModel.S4G8D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Select " + labelModel.S4G8D1,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if (disclousersData[0].CLP_COMPLIANCE !== null && vModel.S4G8D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].APPLY_ITAR_REG === null && vModel.S4G9D1 === "X" && mandatoryModel.S4G9D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G9D1,
					"subtitle": "ITAR and FCPA compliance",
					"type": "Warning"
				});
			} else if (disclousersData[0].APPLY_ITAR_REG !== null && vModel.S4G9D1 === "X" && mandatoryModel.S4G9D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].APPLY_FCPA === null && vModel.S4G9D3 === "X" && mandatoryModel.S4G9D3 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G9D3,
					"subtitle": "ITAR and FCPA compliance",
					"type": "Warning"
				});
			} else if (disclousersData[0].APPLY_FCPA !== null && vModel.S4G9D3 === "X" && mandatoryModel.S4G9D3 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].SUPPLY_ITAR_EAR === null && vModel.S4G9D2 === "X" && mandatoryModel.S4G9D2 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G9D2,
					"subtitle": "ITAR and FCPA compliance",
					"type": "Warning"
				});
			} else if (disclousersData[0].SUPPLY_ITAR_EAR !== null && vModel.S4G9D2 === "X" && mandatoryModel.S4G9D2 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].US_ORIGIN_SUPPL === null && vModel.S4G9D4 === "X" && mandatoryModel.S4G9D4 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G9D4,
					"subtitle": "ITAR and FCPA compliance",
					"type": "Warning"
				});
			} else if (disclousersData[0].US_ORIGIN_SUPPL !== null && vModel.S4G9D4 === "X" && mandatoryModel.S4G9D4 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].ERP_MGMT_SYSTEM === null && vModel.S4G10D1 === "X" && mandatoryModel.S4G10D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G10D1,
					"subtitle": "IT Equipment and Tools",
					"type": "Warning"
				});
			} else if (disclousersData[0].ERP_MGMT_SYSTEM !== null && vModel.S4G10D1 === "X" && mandatoryModel.S4G10D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].INDUSRIAL_DESIGN_SW === null && vModel.S4G10D2 === "X" && mandatoryModel.S4G10D2 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G10D2,
					"subtitle": "IT Equipment and Tools",
					"type": "Warning"
				});
			} else if (disclousersData[0].INDUSRIAL_DESIGN_SW !== null && vModel.S4G10D2 === "X" && mandatoryModel.S4G10D2 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}
			//Overview Section
			if (disclousersData[0].COUNTERFIET_PARTS_PCD === null && vModel.S4G12D1 === "X" && mandatoryModel.S4G12D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D1,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].COUNTERFIET_PARTS_PCD !== null && vModel.S4G12D1 === "X" && mandatoryModel.S4G12D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}
			if (disclousersData[0].MANUFACTURING_PCD === null && vModel.S4G12D3 === "X" && mandatoryModel.S4G12D3 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D3,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].MANUFACTURING_PCD !== null && vModel.S4G12D3 === "X" && mandatoryModel.S4G12D3 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].PLAN_COLLECTION === null && vModel.S4G12D5 === "X" && mandatoryModel.S4G12D5 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D5,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].PLAN_COLLECTION !== null && vModel.S4G12D5 === "X" && mandatoryModel.S4G12D5 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].CONFIG_CTRL_SYSTEM === null && vModel.S4G12D7 === "X" && mandatoryModel.S4G12D7 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D7,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].CONFIG_CTRL_SYSTEM !== null && vModel.S4G12D7 === "X" && mandatoryModel.S4G12D7 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].CONT_IMPROVEMENT_PROG === null && vModel.S4G12D9 === "X" && mandatoryModel.S4G12D9 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D9,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].CONT_IMPROVEMENT_PROG !== null && vModel.S4G12D9 === "X" && mandatoryModel.S4G12D9 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].QUALITY_AGREEMENT === null && vModel.S4G12D2 === "X" && mandatoryModel.S4G12D2 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D2,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].QUALITY_AGREEMENT !== null && vModel.S4G12D2 === "X" && mandatoryModel.S4G12D2 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].TECH_SPEC_MFG_SRV === null && vModel.S4G12D4 === "X" && mandatoryModel.S4G12D4 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D4,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].TECH_SPEC_MFG_SRV !== null && vModel.S4G12D4 === "X" && mandatoryModel.S4G12D4 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].ANALYSIS_RISKMGMT_PROC === null && vModel.S4G12D6 === "X" && mandatoryModel.S4G12D6 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D6,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].ANALYSIS_RISKMGMT_PROC !== null && vModel.S4G12D6 === "X" && mandatoryModel.S4G12D6 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].CTRL_PLANNING_PROC === null && vModel.S4G12D8 === "X" && mandatoryModel.S4G12D8 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D8,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].CTRL_PLANNING_PROC !== null && vModel.S4G12D8 === "X" && mandatoryModel.S4G12D8 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].EPI_QUALITY_SUPPL_REQ === null && vModel.S4G12D10 === "X" && mandatoryModel.S4G12D10 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G12D10,
					"subtitle": "Overview Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].EPI_QUALITY_SUPPL_REQ !== null && vModel.S4G12D10 === "X" && mandatoryModel.S4G12D10 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			//Suppliers / imput material section
			if (disclousersData[0].SUPPL_EVAL_PROC === null && vModel.S4G13D1 === "X" && mandatoryModel.S4G13D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G13D1,
					"subtitle": "Vendors / imput material",
					"type": "Warning"
				});
			} else if (disclousersData[0].SUPPL_EVAL_PROC !== null && vModel.S4G13D1 === "X" && mandatoryModel.S4G13D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].TECH_SPEC_MATERIAL === null && vModel.S4G13D3 === "X" && mandatoryModel.S4G13D3 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G13D3,
					"subtitle": "Vendors / imput material",
					"type": "Warning"
				});
			} else if (disclousersData[0].TECH_SPEC_MATERIAL !== null && vModel.S4G13D3 === "X" && mandatoryModel.S4G13D3 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].CTRL_ORDERS_DOC_PROC === null && vModel.S4G13D5 === "X" && mandatoryModel.S4G13D5 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G13D5,
					"subtitle": "Vendors / imput material",
					"type": "Warning"
				});
			} else if (disclousersData[0].CTRL_ORDERS_DOC_PROC !== null && vModel.S4G13D5 === "X" && mandatoryModel.S4G13D5 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].NON_CONF_ANALYSIS === null && vModel.S4G13D2 === "X" && mandatoryModel.S4G13D2 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G13D2,
					"subtitle": "Vendors / imput material",
					"type": "Warning"
				});
			} else if (disclousersData[0].NON_CONF_ANALYSIS !== null && vModel.S4G13D2 === "X" && mandatoryModel.S4G13D2 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].MATERIAL_INSPECTION_TESTS === null && vModel.S4G13D4 === "X" && mandatoryModel.S4G13D4 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G13D4,
					"subtitle": "Vendors / imput material",
					"type": "Warning"
				});
			} else if (disclousersData[0].MATERIAL_INSPECTION_TESTS !== null && vModel.S4G13D4 === "X" && mandatoryModel.S4G13D4 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].TECHNICAL_DOC_PROC === null && vModel.S4G13D6 === "X" && mandatoryModel.S4G13D6 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G13D6,
					"subtitle": "Vendors / imput material",
					"type": "Warning"
				});
			} else if (disclousersData[0].TECHNICAL_DOC_PROC !== null && vModel.S4G13D6 === "X" && mandatoryModel.S4G13D6 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			//Production
			if (disclousersData[0].QUALIFIED_STAFF === null && vModel.S4G14D1 === "X" && mandatoryModel.S4G14D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D1,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].QUALIFIED_STAFF !== null && vModel.S4G14D1 === "X" && mandatoryModel.S4G14D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].PROC_FOR_INCOMING === null && vModel.S4G14D3 === "X" && mandatoryModel.S4G14D3 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D3,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].PROC_FOR_INCOMING !== null && vModel.S4G14D3 === "X" && mandatoryModel.S4G14D3 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].INTERAL_QUAL_AUDITS === null && vModel.S4G14D5 === "X" && mandatoryModel.S4G14D5 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D5,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].INTERAL_QUAL_AUDITS !== null && vModel.S4G14D5 === "X" && mandatoryModel.S4G14D5 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].NON_CONF_TREATMENT_PROC === null && vModel.S4G14D7 === "X" && mandatoryModel.S4G14D7 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D7,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].NON_CONF_TREATMENT_PROC !== null && vModel.S4G14D7 === "X" && mandatoryModel.S4G14D7 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].IDENTIFICATION_METHOD === null && vModel.S4G14D9 === "X" && mandatoryModel.S4G14D9 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D9,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].IDENTIFICATION_METHOD !== null && vModel.S4G14D9 === "X" && mandatoryModel.S4G14D9 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].WORK_INSTRUCTION_METHODS === null && vModel.S4G14D11 === "X" && mandatoryModel.S4G14D11 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D11,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].WORK_INSTRUCTION_METHODS !== null && vModel.S4G14D11 === "X" && mandatoryModel.S4G14D11 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].PLANNING_CONTROL_SYSTEM === null && vModel.S4G14D13 === "X" && mandatoryModel.S4G14D13 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D13,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].PLANNING_CONTROL_SYSTEM !== null && vModel.S4G14D13 === "X" && mandatoryModel.S4G14D13 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].QUALIFICATION_ARRAY === null && vModel.S4G14D2 === "X" && mandatoryModel.S4G14D2 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D2,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].QUALIFICATION_ARRAY !== null && vModel.S4G14D2 === "X" && mandatoryModel.S4G14D2 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].MFG_INSPECTION_TESTS === null && vModel.S4G14D4 === "X" && mandatoryModel.S4G14D4 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D4,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].MFG_INSPECTION_TESTS !== null && vModel.S4G14D4 === "X" && mandatoryModel.S4G14D4 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].MEASURING_EQUIP_CALIB === null && vModel.S4G14D6 === "X" && mandatoryModel.S4G14D6 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D6,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].MEASURING_EQUIP_CALIB !== null && vModel.S4G14D6 === "X" && mandatoryModel.S4G14D6 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].REPTITIVE_CAUSES_PROC === null && vModel.S4G14D8 === "X" && mandatoryModel.S4G14D8 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D8,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].REPTITIVE_CAUSES_PROC !== null && vModel.S4G14D8 === "X" && mandatoryModel.S4G14D8 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].MAINTENANCE_SCHEDULES === null && vModel.S4G14D10 === "X" && mandatoryModel.S4G14D10 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D10,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].MAINTENANCE_SCHEDULES !== null && vModel.S4G14D10 === "X" && mandatoryModel.S4G14D10 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].DOCUMENTED_PROC === null && vModel.S4G14D12 === "X" && mandatoryModel.S4G14D12 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G14D12,
					"subtitle": "Production Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].DOCUMENTED_PROC !== null && vModel.S4G14D12 === "X" && mandatoryModel.S4G14D12 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}
			//Storage
			if (disclousersData[0].CRITERIA_COLLECT_PROC === null && vModel.S4G15D1 === "X" && mandatoryModel.S4G15D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G15D1,
					"subtitle": "Storage Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].CRITERIA_COLLECT_PROC !== null && vModel.S4G15D1 === "X" && mandatoryModel.S4G15D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].ESTAB_CRITERIA === null && vModel.S4G15D3 === "X" && mandatoryModel.S4G15D3 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G15D3,
					"subtitle": "Storage Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].ESTAB_CRITERIA !== null && vModel.S4G15D3 === "X" && mandatoryModel.S4G15D3 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].COMP_BASED_WMS === null && vModel.S4G15D2 === "X" && mandatoryModel.S4G15D2 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G15D2,
					"subtitle": "Storage Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].COMP_BASED_WMS !== null && vModel.S4G15D2 === "X" && mandatoryModel.S4G15D2 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].DEFINED_POLICIES === null && vModel.S4G15D4 === "X" && mandatoryModel.S4G15D4 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G15D4,
					"subtitle": "Storage Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].DEFINED_POLICIES !== null && vModel.S4G15D4 === "X" && mandatoryModel.S4G15D4 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].CUSTOMER_SERVICE === null && vModel.S4G16D1 === "X" && mandatoryModel.S4G16D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G16D1,
					"subtitle": "Select Customer Service",
					"type": "Warning"
				});
			} else if (disclousersData[0].CUSTOMER_SERVICE !== null && vModel.S4G16D1 === "X" && mandatoryModel.S4G16D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].MASS_SERIES_PROD === null && vModel.S4G17D1 === "X" && mandatoryModel.S4G17D1 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G17D1,
					"subtitle": "Technology Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].MASS_SERIES_PROD !== null && vModel.S4G17D1 === "X" && mandatoryModel.S4G17D1 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (disclousersData[0].TECH_SUPPORT === null && vModel.S4G17D2 === "X" && mandatoryModel.S4G17D2 === "X") {
				validObject.fieldArray.push({
					"section": 4,
					"MandId": "",
					"description": "Mandatory - " + labelModel.S4G17D2,
					"subtitle": "Technology Section",
					"type": "Warning"
				});
			} else if (disclousersData[0].TECH_SUPPORT !== null && vModel.S4G17D2 === "X" && mandatoryModel.S4G17D2 === "X") {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if (vModel.S4G11D1 === "X" && mandatoryModel.S4G11D1 === "X") {
				var qualityCertTab = 0;
				for (var a = 0; a < data.qualityCertificate.length; a++) {
					var certificate = data.qualityCertificate[a];
					//if (certificate.AVAILABLE === -1 || certificate.DONE_BY === "")
					if (certificate.AVAILABLE === "" || certificate.DONE_BY === "") {
						validObject.fieldArray.push({
							"section": 4,
							"MandId": "",
							"description": "Select Mandatory fields of: " + certificate.CERTI_NAME,
							"subtitle": "Quality Certificates",
							"type": "Warning"
						});
					}
					//else if (certificate.AVAILABLE !== -1 || certificate.DONE_BY !== "")
					else if (certificate.AVAILABLE !== "" || certificate.DONE_BY !== "") {
						qualityCertTab = qualityCertTab + 1;
					}
				}
				if (data.qualityCertificate.length === qualityCertTab) {
					validObject.ManCount = validObject.ManCount + 1;
				}
			}

		},

		validateSectionFive: function (validObject, array_s1, headerArray, data, disclousersData, attachmentData, vModel, mandatoryModel, labelModel) {
			var G1Grp = [],
				G2Grp = [],
				G3Grp = [],
				G4Grp = [],
				G5Grp = [],
				G6Grp = [],
				G7Grp = [],
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
				G24Grp = [],
				G25Grp = [],
				G26Grp = [],
				G27Grp = [],
				G28Grp = [];

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
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G7") {
					G7Grp.push(attachmentData.attachments2[i]);
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
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G24") {
					G24Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G25") {
					G25Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G26") {
					G26Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G27") {
					G27Grp.push(attachmentData.attachments2[i]);
				} else if (attachmentData.attachments2[i].ATTACH_GROUP === "G28") {
					G28Grp.push(attachmentData.attachments2[i]);
				}
			}

			if (vModel.S4A10F1 === "X" && mandatoryModel.S4A10F1 === "X") {
				this.checkAttachTable(validObject, array_s1, G24Grp, labelModel.S4A10F1);
			}
			if (vModel.S4A6F1 === "X" && mandatoryModel.S4A6F1 === "X") {
				this.checkAttachTable(validObject, array_s1, G25Grp, labelModel.S4A6F1);
			}
			if (vModel.S4A7F1 === "X" && mandatoryModel.S4A7F1 === "X") {
				this.checkAttachTable(validObject, array_s1, G26Grp, labelModel.S4A7F1);
			}
			if (vModel.S4A8F1 === "X" && mandatoryModel.S4A8F1 === "X") {
				this.checkAttachTable(validObject, array_s1, G27Grp, labelModel.S4A8F1);
			}
			if (vModel.S4A9F1 === "X" && mandatoryModel.S4A9F1 === "X") {
				this.checkAttachTable(validObject, array_s1, G28Grp, labelModel.S4A9F1);
			}
		},

		checkAttachTable: function (validObject, array_s1, sGroup, sDesc) {

			for (var i = 0; i < sGroup.length; i++) {
				if (sGroup[i].FILE_NAME === "") {
					validObject.fieldArray.push({
						"section": 4,
						"MandId": "",
						"description": "Upload " +sDesc +" in Row : " +(i+1),
						"subtitle": "Mandatory",
						"type": "Warning"
					});
				} else {
					validObject.ManCount = validObject.ManCount + 1;
				}
			}

			// var length = sGroup.filter(function (obj) {
			// 	if (obj.FILE_NAME !== "") {
			// 		return obj;
			// 	}
			// });
			// if (length.length == 0) {
			// 	validObject.fieldArray.push({
			// 		"section": 5,
			// 		"MandId": "",
			// 		"description": "Upload " + sDesc,
			// 		"subtitle": "Mandatory",
			// 		"type": "Warning"
			// 	});
			// } else {
			// 	validObject.ManCount = validObject.ManCount + 1;
			// }
		},

		checkUAEAttachment: function (array_s1, attachDesc, eDate, fileName, visibleModel, mandatory) {
			if ((fileName === "" || eDate === null) && visibleModel === "X" && mandatory === "X") {
				array_s1.push({
					"section": 5,
					"MandId": "",
					"description": "Upload " + attachDesc + " Attachment",
					"subtitle": "Select Expiry Date",
					"type": "Warning"
				});
			}
		},

		checkIfAttachment: function (array_s1, attachDesc, fileName, visibleModel, mandatory) {
			if (fileName === "" && visibleModel === "X" && mandatory === "X") {
				array_s1.push({
					"section": 5,
					"MandId": "",
					"description": "Upload " + attachDesc + " Attachment",
					"subtitle": "Mandatory",
					"type": "Warning"
				});
			}
		},

		validateSectionSix: function (validObject, array_s1, headerArray, disclousersData, data, vModel, mandatoryModel, labelModel) {
			if ((this.checkIFEmpty(headerArray[0].COMPLETED_BY, vModel.S5G1F3, mandatoryModel.S5G1F3))) {
				validObject.fieldArray.push({
					"section": 5,
					"MandId": "S5G1F3",
					"description": "Enter " + labelModel.S5G1F3,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(headerArray[0].COMPLETED_BY, vModel.S5G1F3, mandatoryModel.S5G1F3))) {
				validObject.ManCount = validObject.ManCount + 1;
			}

			if ((this.checkIFEmpty(headerArray[0].COMPLETED_BY_POSITION, vModel.S5G1F4, mandatoryModel.S5G1F4))) {
				validObject.fieldArray.push({
					"section": 5,
					"MandId": "S5G1F4",
					"description": "Enter " + labelModel.S5G1F4,
					"subtitle": "Mandatory Field",
					"type": "Warning"
				});
			} else if ((this.checkIFNotEmpty(headerArray[0].COMPLETED_BY_POSITION, vModel.S5G1F4, mandatoryModel.S5G1F4))) {
				validObject.ManCount = validObject.ManCount + 1;
			}
		},

		validateSections: function (headerArray, bankDetails, data, disclousersData, attachmentData, i18nModel, vModel, mandatoryModel, section, oId, cId, labelModel, bId) {

			var array_s1 = [];
			var validObject = {
				"fieldArray": [],
				"ManCount": 0
			};

			if (section === 1) {
				this._validateFirstSection(validObject, array_s1, headerArray, data, vModel, mandatoryModel, oId, cId, labelModel);
			} else if (section === 2) {
				this._validateFirstSection(validObject, array_s1, headerArray, data, vModel, mandatoryModel, oId, cId, labelModel);
				this.validateSectionTwo(validObject, array_s1, headerArray, bankDetails, data, vModel, mandatoryModel, labelModel, bId);
			} else if (section === 3) {
				this._validateFirstSection(validObject, array_s1, headerArray, data, vModel, mandatoryModel, oId, cId, labelModel);
				this.validateSectionTwo(validObject, array_s1, headerArray, bankDetails, data, vModel, mandatoryModel, labelModel, bId);
				this.validateSectionThree(validObject, array_s1, headerArray, data, vModel, mandatoryModel, labelModel);
			} else if (section === 4) {
				this._validateFirstSection(validObject, array_s1, headerArray, data, vModel, mandatoryModel, oId, cId, labelModel);
				this.validateSectionTwo(validObject, array_s1, headerArray, bankDetails, data, vModel, mandatoryModel, labelModel, bId);
				this.validateSectionThree(validObject, array_s1, headerArray, data, vModel, mandatoryModel, labelModel);
				this.validateSectionFive(validObject, array_s1, headerArray, data, disclousersData, attachmentData, vModel, mandatoryModel, labelModel);
				//this.validateSectionFour(validObject, array_s1, headerArray, data, disclousersData, i18nModel, vModel, mandatoryModel, labelModel);
			} else if (section === 5) {
				this._validateFirstSection(validObject, array_s1, headerArray, data, vModel, mandatoryModel, oId, cId, labelModel);
				this.validateSectionTwo(validObject, array_s1, headerArray, bankDetails, data, vModel, mandatoryModel, labelModel, bId);
				this.validateSectionThree(validObject, array_s1, headerArray, data, vModel, mandatoryModel, labelModel);
				// this.validateSectionFour(validObject, array_s1, headerArray, data, disclousersData, i18nModel, vModel, mandatoryModel, labelModel);
				this.validateSectionFive(validObject, array_s1, headerArray, data, disclousersData, attachmentData, vModel, mandatoryModel, labelModel);
				this.validateSectionSix(validObject, array_s1, headerArray, disclousersData, data, vModel, mandatoryModel, labelModel);
			} else if (section === 6) {
				this._validateFirstSection(validObject, array_s1, headerArray, data, vModel, mandatoryModel, oId, cId, labelModel);
				this.validateSectionTwo(validObject, array_s1, headerArray, bankDetails, data, vModel, mandatoryModel, labelModel, bId);
				this.validateSectionThree(validObject, array_s1, headerArray, data, vModel, mandatoryModel, labelModel);
				this.validateSectionFour(validObject, array_s1, headerArray, data, disclousersData, i18nModel, vModel, mandatoryModel, labelModel);
				this.validateSectionFive(validObject, array_s1, headerArray, data, disclousersData, attachmentData, vModel, mandatoryModel, labelModel);
				this.validateSectionSix(validObject, array_s1, headerArray, disclousersData, data, vModel, mandatoryModel, labelModel);
			}

			//	return array_s1;
			return validObject;
		}

	};
});