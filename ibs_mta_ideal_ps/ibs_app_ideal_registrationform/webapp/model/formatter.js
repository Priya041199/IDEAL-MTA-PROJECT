sap.ui.define([], function () {
	"use strict";
	return {

		setTwoRadioButton: function (value) {
			if (value === "Yes") {
				return 0;
			} else if (value === "No") {
				return 1;
			}
		},

		setRadioButtonSelect: function (value) {
			if (value === "Yes") {
				return 0;
			} else if (value === "No") {
				return 1;
			} else if (value === "NA") {
				return 2;
			}
		},

		getProdServiceDataNullValue: function (value) {
			if (value === "PROD") {
				return "Product";
			} else if (value === "SERV") {
				return "Service";
			} else if (value === null || value === "-1" || value === "" || value === undefined) {
				return "NA";
			}
		},

		setBusinessTypeSelection: function (value) {
			if (value === "Trade") {
				return 0;
			} else if (value === "Manufacturer") {
				return 1;
			} else if (value === "Service Provider") {
				return 2;
			} else if (value === "Contractor") {
				return 3;
			} else if (value === "Sole Agent") {
				return 4;
			} else if (value === "Other") {
				return 5;
			}
		},

		getVcode: function (sValue) {
			// added on 14-04-2023 QR And NR which are Quick Registration And Normal Request
			if (sValue === "IR") {
				return "Internal Request";
			} else if (sValue === "NR") {
				return "Normal Registration"; //added by Sumit on 26-05-2023
			} else if (sValue === "QR") {
				return "Quick Registration"; //added by Sumit on 26-05-2023
			} else if (sValue === "SR") {
				return "Self Registration";
			} else if (sValue === "LG") {
				return "Legacy Supplier";
			}
		},

		formatDate: function (oDate, statusId) {
			
			if (oDate !== "" && oDate !== null && oDate !== undefined) {
				
				var DateInstance = new Date(oDate);
				var date = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
			
				return date.format(DateInstance);
			} 
			return "";
		},

		creationTypeDesc: function (iRequestType, iCreationType) {

			var sCreationTypeDesc = null;
			var sRequestTypeDesc = null;
			if (iCreationType === 1) {
				sCreationTypeDesc = "Normal";
			} else if (iCreationType === 2) {
				sCreationTypeDesc = "Low Value";
			} else if (iCreationType === 3) {
				sCreationTypeDesc = "Exceptional";
			} else if (iCreationType === 6) {
				sCreationTypeDesc = "Subsidiary";
			}

			if (iRequestType === 1 || iRequestType === 2 || iRequestType === 3 || iRequestType === 6) {
				sRequestTypeDesc = "Create";
			} else if (iRequestType === 4) {
				sRequestTypeDesc = "Extend";
			} else if (iRequestType === 5) {
				sRequestTypeDesc = "Update";
			} else if (iRequestType === 7) {
				// added on 14-04-2023 request type 7 which is Quick Registration
				sRequestTypeDesc = "Quick Registration";
			}

			return sRequestTypeDesc + " - " + sCreationTypeDesc;

		},

		getDataNullValue: function (sValue) {

			if (sValue === null || sValue === "-1" || sValue === "" || sValue === undefined) {
				return "NA";
			} else {
				return sValue;
			}
		},

		getQualityCertAvailableDataNullValue: function (sValue) {

			if (sValue === null || sValue === "" || sValue === undefined) {
				return "NA";
			} else {
				return sValue;
			}
		},

		registerAddressType: function (sValue) {
			if (sValue === "REG") {
				return "Register Office";
			} else if (sValue === "OTH") {
				return "Other Office";
			}
		},

		addressType: function (sValue) {
			if (sValue === "REG") {
				return "Register Office";
			} else if (sValue === "OTH") {
				return "Other Office";
			}
		},

		bankCountryStatus: function (val) {

			if (val === "" || val === null || val === undefined) {
				return "NA";
			} else {
				return val;
			}
		},

		getStatus: function (sValue, createdBy, vcode) {
			
			if (sValue == 7) {
				return "Indication01";
			} else if (sValue == 6) {
				return "Warning";
			} else if (sValue == 4) {
				return "Indication03";
			} else if (sValue == 5 && (createdBy === "" || createdBy === null || createdBy === undefined) && vcode === "SR") {
				return "None";
			} else if (sValue == 5) {
				return "Indication06";
			} else if (sValue == 8) {
				return "Indication01";
			} else if (sValue == 3) {
				return "Indication01";
			} else if (sValue == 9 && (createdBy === "" || createdBy === null || createdBy === undefined) && vcode === "SR") {
				return "None";
			} else if (sValue == 9) {
				return "Indication06";
			} else if (sValue == 10) {
				return "Indication05";
			} else if (sValue == 11) {
				return "Indication04";
			} else if (sValue == 13) {
				return "Indication01";
			}
			else if(sValue == 2){
				return "Indication07";
			}
			else if(sValue == 1){
				return "Indication08";
			}
		},

		productType: function (value) {
			if (value === "PROD") {
				return "Product";
			} else if (value === "SERV") {
				return "Service";
			}
		},
		getContactsDataNullValue: function (sValue, sValue1) {

			if (sValue1 === null || sValue1 === '' || sValue1 === undefined) {
				return "NA";
			} else if (sValue === null || sValue === '' || sValue1 === undefined) {
				return sValue1;
			} else {
				return '+' + sValue + ' ' + sValue1;
			}
		}

	};
});