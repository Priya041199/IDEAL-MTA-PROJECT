sap.ui.define([], function () {
	"use strict";
	return {

		getStatus: function (sValue) {
			
			if (sValue == 1 || sValue == 4) {
				return "Warning";
			} else if (sValue == 3 || sValue == 14 || sValue == 13 || sValue == 8) {
				return "Indication01";
			} else if (sValue == 2) {
				return "Success";
			} else if (sValue == 11) {
				return "Indication04";
			} else if (sValue == 12  || sValue == 7) {
				return "Information";
			} else if (sValue == 5 || sValue == 9 || sValue == 7) {
				return "Indication06";
			} else if (sValue == 6) {
				return "Indication05";
			} else if (sValue == 10) {
				return "Indication05";
			}
		},
		getType : function(oValue){
			// debugger;
			if(oValue === 1){
				return "Request"
			}else if(oValue === 2){
				return "Request"
			}else if(oValue === 3){
				return "Request"
			}else if(oValue === 4){
				return "Registration"
			}else if(oValue === 6){
				return "Registration"
			}else if(oValue === 7){
				return "Registration"
			}else if(oValue === 8){
				return "Registration"
			}else if(oValue === 10){
				return "Registration"
			}else if(oValue === 11){
				return "Registration"
			}else if(oValue === 12){
				return "Request"
			}else if(oValue === 14){
				return "Request"
			}else if(oValue === 15){
				return "Request"
			}
		},
		getVisibility: function(oValue , sValue){
			// debugger;
			var value = oValue + " - " + sValue;
			if(oValue === "In Approval"){
				return value;
			}else{
				return oValue;
			}
		},
		subType: function (sValue) {
			
			if(sValue == "" || sValue == null || sValue == null){
				return "NA"
			}else{
				return sValue
			}
		},

		formatDate: function (oDate) {
		
			if (oDate === "" || oDate === null || oDate === undefined) {
				return "NA"
			} else if (oDate !== "" && oDate !== null && oDate !== undefined) {
					var DateInstance = new Date(oDate);
					var date = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd.MM.yyyy"
					});
					return date.format(DateInstance);
			}
			return "";
		},
		getPendingAtStatus: function (sValue) {
			
			if (sValue < 3) {
				return "Request";
			} else if (sValue == 5 || sValue == 6 || sValue == 9) {
				return "Registration";
			}
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