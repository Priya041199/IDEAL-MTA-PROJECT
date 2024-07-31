jQuery.sap.declare("com.ibs.ibsappidealdealerprofile.model.formatter");

com.ibs.ibsappidealdealerprofile.model.formatter = {
	formatDate: function (oDate, statusId) {
		if (oDate !== "" && oDate !== null && oDate !== undefined) {
			// if (oDate.split === undefined) {
				var DateInstance = new Date(oDate);
				var date = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				if (statusId === 'X') {
					this.getView().addStyleClass("sapHightLightText");
				} else {
					this.getView().removeStyleClass("sapHightLightText");
				}
				return date.format(DateInstance);

			// } else {
			// 	var date = oDate.split(" ")[0].split("-")[2] + "." + oDate.split(" ")[0].split("-")[1] + "." + oDate.split(" ")[0].split("-")[0];
			// 	if (statusId === 'X') {
			// 		this.getView().addStyleClass("sapHightLightText");
			// 	} else {
			// 		this.getView().removeStyleClass("sapHightLightText");
			// 	}
			// 	//	this.getView().removeStyleClass("sapHightLightText");
			// 	return date;
			// }
		}
		// if(statusId === 'X'){
		// 	this.getView().addStyleClass("sapHightLightText");
		// }
		//	this.getView().removeStyleClass("sapHightLightText");
		return "NA";
	},
	entityCode:function(oValue1,oValue2,oValue3){
		if(oValue1 === null && oValue2 === null && oValue3 === null){
			return "N/A";
		}
		else if(oValue1 === null && oValue2 === null && oValue3 !== null){
			return oValue3;
		}
		else{
			return oValue1 +"-"+ oValue2;
		}
	},
	vendorSubType:function(oValue1,oValue2){
		if(oValue1 === null && oValue2 === null){
			return "NA";
		}
		else if(oValue1 === "" && oValue2 === ""){
			return "NA";
		}
		else{
			return oValue1 +"("+oValue2+")";
		}
	},
	formatxsjsDate: function (sDate) {
		
		if (sDate !== "" && sDate !== null && sDate !== undefined) {
			var dateValue = sDate.split("-")[2].substring("0", "2") + "." + sDate.split("-")[1] + "." + sDate.split("-")[0];
			return dateValue;
		}
		return "";
	},

	getStatus: function (sValue, createdBy, vcode) {
        if (sValue == 7) {
            return "Indication01";
        } else if (sValue == 6) {
            return "Indication03";
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
        }else if(sValue == 2){
            return "Indication07";
        }
        else if(sValue == 1){
            return "Indication08";
        }
    },
	vatCheck:function(oValue){
		if(oValue === "Y"){
			return "Yes";
		}
		else{
			return "No";
		}
	},

	// getStatus: function (sValue) {
	// 	if (sValue == 1) {
	// 		return "Indication01";
	// 	} else if (sValue == 2) {
	// 		return "Indication04";
	// 	} else if (sValue == 14) {
	// 		return "Indication03";
	// 	} else if (sValue == 4) {
	// 		return "Indication06";
	// 	} else if (sValue == 3) {
	// 		return "Indication01";
	// 	} else if (sValue == 9) {
	// 		return "Indication06";
	// 	} else if (sValue == 10) {
	// 		return "Indication05";
	// 	} else if (sValue == 11) {
	// 		return "Indication04";
	// 	} else if (sValue == 13) {
	// 		return "Indication01";
	// 	}
	// },

	getStatusDesc: function (sValue) {
		if (sValue == 11) {
			return "Active";
		} else if (sValue == 2) {
			return "Invited";
		}
	},

	getNdaNameDisplay: function (sValue) {
		if (sValue !== "" && sValue !== null && sValue !== undefined) {
			var value = sValue.split(',')[0];
			return value;
		}

	},


	getDataNullValue: function (sValue) {
		if (sValue === null || sValue === '' || sValue === undefined) {
			return "NA";
		} else {
			return sValue;
		}
	},

	getContactsDataNullValue: function (sValue, sValue1) {
		
		if (sValue1 === null || sValue1 === '') {
			return "NA";
		} else if (sValue === null || sValue === '') {
			return sValue1;
		} else {
			return '+' + sValue + ' ' + sValue1;
		}
	},

	getQualityCertAvailableDataNullValue: function (sValue) {
		
		if (sValue === null || sValue === '') {
			return "NA";
		} else if (sValue === "-1") {
			return "NA";
		} else {
			return sValue;
		}
	},

	getProdServiceDataNullValue: function (sValue) {
		
		if (sValue === null || sValue === '') {
			return "NA";
		} else if (sValue === "PROD") {
			return "Product";
		} else if (sValue === "SERV") {
			return "Service";
		} else {
			return sValue;
		}
	},

	gethighLightText: function (sValue, statusId) {


		if (statusId === 'X' && sValue === "") {
			this.getView().addStyleClass("sapHightLightText");
			return "NA";
		} else if (statusId === 'X' && sValue === null) {
			this.getView().addStyleClass("sapHightLightText");
			return "NA";
		} else if (statusId === 'X') {
			this.getView().addStyleClass("sapHightLightText");
			return sValue;
		} else if (sValue === null) {
			this.getView().removeStyleClass("sapHightLightText");
			return "NA";
		} else if (sValue === "") {
			this.getView().removeStyleClass("sapHightLightText");
			return "NA";
		}

		// if(statusId === null || statusId === undefined){
		// 	this.getView().addStyleClass("none");
		// 	return sValue;
		// }
		
		else {
			this.getView().removeStyleClass("sapHightLightText");
			return sValue;
		}
	},

	getSupplierhighLightText: function (sValue, sValue1, statusId) {
		
		if (statusId === 'X') {
			this.getView().addStyleClass("sapHightLightText");
			return sValue + ' (' + sValue1 + ')';
		}
		if (sValue === null || sValue === '') {
			this.getView().removeStyleClass("sapHightLightText");
			return "NA";
		}
		// if(statusId === null || statusId === undefined){
		// 	this.getView().addStyleClass("none");
		// 	return sValue;
		// }
		else {
			this.getView().removeStyleClass("sapHightLightText");
			return sValue + ' (' + sValue1 + ')';
		}
	},

	getContactshighLightText: function (sValue, sValue1, statusId) {
		if (statusId === 'X') {
			this.getView().addStyleClass("sapHightLightText");
			return '+' + sValue + ' ' + sValue1;
		}
		if (sValue1 === null || sValue1 === '') {
			this.getView().removeStyleClass("sapHightLightText");
			return "NA";
		}
		if (sValue === null || sValue === '') {
			this.getView().removeStyleClass("sapHightLightText");
			return sValue1;
		}

		// if(statusId === null || statusId === undefined){
		// 	this.getView().addStyleClass("none");
		// 	return sValue;
		// }

		else {
			this.getView().removeStyleClass("sapHightLightText");
			return '+' + sValue + ' ' + sValue1;
		}
	},

	getOperCaphighLightText: function (sValue, sValue1, statusId) {
		
		if (statusId === 'X') {
			this.getView().addStyleClass("sapHightLightText");
			return sValue + ' ' + sValue1;
		}
		if (sValue === null || sValue === '') {
			this.getView().removeStyleClass("sapHightLightText");
			return "NA";
		}
		// if(statusId === null || statusId === undefined){
		// 	this.getView().addStyleClass("none");
		// 	return sValue;
		// }
		else {
			this.getView().removeStyleClass("sapHightLightText");
			return sValue + ' ' + sValue1;
		}
	},

	getOfficeAddHighLightText: function (sValue, statusId) {
		
		if (statusId === 'X') {
			this.getView().addStyleClass("sapHightLightText");
			return sValue + ",";
		} else if (sValue !== "" && sValue !== null && sValue !== undefined) {
			return sValue + ",";
		} else {
			//	return "," +sValue;
			return "";
		}
	},

	getOfficeAddNullValue: function (sValue) {
		
		if (sValue !== null) {
			return sValue + ",";
		}
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
	}
};