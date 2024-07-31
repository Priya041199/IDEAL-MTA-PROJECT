sap.ui.define([], function () {
	"use strict";
	return {

		getStatus: function (sValue) {
			if (sValue == 1) {
				return "Warning";
			} else if (sValue == 3) {
				return "Error";
			} else if (sValue == 2) {
				return "Success";
			} else if (sValue == 12) {
				return "Information";
			}
		},
		getVisibility: function(oValue , sValue){
			// debugger;
			var value = oValue + " - " + sValue;
			if(oValue === "Request Pending"){
				return oValue;
			}else{
				return value;
			}
		},
		getDate: function(sDate){
			var oDate = new Date(sDate);
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd.MM.YYYY" });
			var dateFormatted = dateFormat.format(oDate);
			return dateFormatted;
		},

		creationTypeDesc: function (iCreationType, iRequestType) {
		
			var sCreationTypeDesc = null;
			var sRequestTypeDesc = null;
			if (iCreationType === 1) {
				sCreationTypeDesc = "Normal";
			} else if (iCreationType === 2) {
				sCreationTypeDesc = "Low Value";
			} else if (iCreationType === 3) {
				sCreationTypeDesc = "Exceptional";
			}else if (iCreationType === 6) {
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

		}

	};
});