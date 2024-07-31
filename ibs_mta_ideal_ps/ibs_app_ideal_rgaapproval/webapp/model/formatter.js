jQuery.sap.declare("com.ibs.ibsappidealrgaapproval.model.formatter");

com.ibs.ibsappidealrgaapproval.model.formatter = {

    formatDate: function (oDate) {
		if (oDate !== "" && oDate !== null && oDate !== undefined) {
			// if (oDate.split() === undefined) {
				var DateInstance = new Date(oDate);
				var date = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.yyyy"
				});

				return date.format(DateInstance);

		}
		return "NA";
	},
	getStatus : function(sValue){
		// debugger;
		if (sValue === 3) {
			return "Error";
		}else if(sValue === 1){
			return "Information";
		}else if(sValue === 2){
			return "Success";
		}else if(sValue === 4){
			return "Information";
		}
	},
	claimDesc : function(sValue){
		if (sValue == 1) {
			return "Price Different";
		} else if (sValue == 2) {
			return "Product Complaint";
		} else if (sValue == 3) {
			return "Workshops";
		} else if (sValue == 4) {
			return "Evaluation";
		}else if (sValue == 5) {
			return "Invoice Correction";
		}
	},
    formatterAmount: function (num) {
		// debugger
		// var no = parseFloat(num);
		var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
			pattern: "#,##,##0.00"
		});
		return oNumberFormat.format(num);
	},
	laneTextFormat : function(sValue){
		if(sValue === 1){
			return "Created"
		}else if(sValue === 2){
			return "Approved"
		}else if(sValue === 3){
			return "Rejected"
		}else{
			return "In Approval"
		}
	},
	nodeStateFormat : function(sValue){
		if(sValue === 1){
			return "Positive"
		}else if(sValue === 2){
			return "Positive"
		}else if(sValue === 3){
			return "Negative"
		}else{
			return "Neutral"
		}
	},
	laneIconFormat : function(sValue){
		if(sValue === 1){
			return "sap-icon://approvals"
		}else if(sValue === 2){
			return "sap-icon://accept"
		}else if(sValue === 3){
			return "sap-icon://clear-all"
		}else{
			return "sap-icon://pending"
		}
	},
	nodeTitleFormat : function(sValue,rValue,nValue){
		if(nValue === 1){
			return "Created by " + sValue + " - " + rValue;
		}else if(nValue === 2){
			return "Approved by " + sValue + " - " + rValue;
		}else if(nValue === 3){
			return "Rejected by " + sValue + " - " + rValue;
		}else{
			return "Approved by " + sValue + " - " + rValue + " pending for further approval";
		}
	},
	nodeTextFormat : function(oDate){
		if (oDate !== "" && oDate !== null && oDate !== undefined) {
			// if (oDate.split() === undefined) {		
				var DateInstance = new Date(oDate);
				var date = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: 'yyyy-MM-dd\' at \'hh:mm a'
				});
				return date.format(DateInstance);

		}
		return "NA";
	}
}