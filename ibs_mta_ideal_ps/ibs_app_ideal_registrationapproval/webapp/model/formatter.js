jQuery.sap.declare("com.ibs.ibsappidealregistrationapproval.model.formatter");

com.ibs.ibsappidealregistrationapproval.model.formatter = {

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
	getVisibility : function(oValue, sValue){
		// debugger;
		var value = oValue + " - " + sValue;
			if(oValue === "In Approval"){
				return value;
			}else{
				return oValue;
		}
	},
    getDataNullValue: function (sValue) {
		// debugger;
		if (sValue === null || sValue === '' || sValue === undefined) {
			return "NA";
		} else {
			return sValue;
		}
	},
	// getDataNullValue1: function (sValue) {
	// 	debugger;
	// 	if (sValue === null || sValue === '' || sValue === undefined) {
	// 		return "NA";
	// 	} else {
	// 		return sValue;
	// 	}
	// },
	getContactshighLightText: function (sValue, sValue1, statusId,sId) {
		if (statusId === 'X' && sId !== undefined) {
			this.getView().byId(sId).addStyleClass("sapHightLightText");
			return '+' + sValue + ' ' + sValue1;
		}
		if ((sValue1 === null || sValue1 === '') && sId !== undefined) {
			this.getView().byId(sId).removeStyleClass("sapHightLightText");
			return "NA";
		}
		if ((sValue === null || sValue === '') && sId !== undefined) {
			this.getView().removeStyleClass("sapHightLightText");
			return sValue1;
		}

		// if(statusId === null || statusId === undefined){
		// 	this.getView().addStyleClass("none");
		// 	return sValue;
		// }

		else if(sId !== undefined){
			this.getView().byId(sId).removeStyleClass("sapHightLightText");
			return '+' + sValue + ' ' + sValue1;
		}
	},
	gethighLightText: function (sValue, statusId, sId) {
		// debugger;
		if (statusId === 'X' && sValue === "" && sId !== undefined) {
			this.getView().byId(sId).addStyleClass("sapHightLightText");
			return "NA";
		} else if (statusId === 'X' && sValue === null && sId !== undefined) {
			this.getView().byId(sId).addStyleClass("sapHightLightText");
			return "NA";
		} else if (statusId === 'X' && sId !== undefined) {
			this.getView().byId(sId).addStyleClass("sapHightLightText");
			// this.getView().addStyleClass("sapHightLightText");
			return sValue;
		} 
		else if (sValue === null && sId !== undefined) {
			this.getView().byId(sId).removeStyleClass("sapHightLightText");
			return "NA";
		}
		else if (sValue === "" && sId !== undefined) {
			this.getView().byId(sId).removeStyleClass("sapHightLightText");
			return "NA";
		}
		else if(sValue === undefined && sId !== undefined){
			this.getView().byId(sId).removeStyleClass("sapHightLightText");
			return "NA";
		}
		// if(statusId === null || statusId === undefined){
		// 	this.getView().addStyleClass("none");
		// 	return sValue;
		// }
		else{
			if(sId !== undefined){
				this.getView().byId(sId).removeStyleClass("sapHightLightText");
				return sValue;
			}
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
		else{
			return "N/A";
		}
	},
    formatDate: function (oDate, statusId, sId) {
		if (oDate !== "" && oDate !== null && oDate !== undefined) {
			// if (oDate.split() === undefined) {
				var DateInstance = new Date(oDate);
				var date = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});
				if (statusId === 'X' && sId !== undefined) {
					this.getView().byId(sId).addStyleClass("sapHightLightText");
				} else if(sId !== undefined) {
					debugger;
					this.getView().byId(sId).removeStyleClass("sapHightLightText");
				}
				return date.format(DateInstance);

		}
		return "NA";
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
    getStatus: function (sValue, createdBy, vcode) {
        
        if (sValue == 7) {
            return "Indication01";
        } else if (sValue == 6) {
            return "Indication05";
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
}