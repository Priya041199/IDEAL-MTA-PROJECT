sap.ui.define([], function () {
    "use strict";

    return {
        description: function (sDesc) {

            var sResult = "";

            if (sDesc === "" || sDesc === null) {
                sResult = "NA";
            } else {
                sResult = sDesc;
            }
            return sResult;
        },
        stateChange:function(sValue){
            var vNumber = Number(sValue);

            if(sValue === 'X' || vNumber > 0){
                return true;
            }else{
                return false;
            }
        },
        setVisibleCall : function(oValue){
            debugger;
            var vNumber = Number(oValue);
            // if(vNumber > 0)
            // {
            //     return vNumber;
            // }

            if(oValue === 'X' || oValue === null){
                return true;
            }
            else{
                // return vNumber;
                // return new sap.m.Text({
                //     state: oValue === 1, // Set the switch state based on some condition
                //   });

                return new sap.m.Text({
                    text: vNumber
            });
        }
        },
        formatDate: function (oDate) {
           
            if (oDate !== "" && oDate !== null && oDate !== undefined) {
                var date = new Date(oDate),
                    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                    day = ("0" + date.getDate()).slice(-2);
                return [day, mnth, date.getFullYear()].join(".");
            }
            return "NA";
        },

        formMandatory: function (value) {
            if (value === "" || value === null || value === undefined) {
                return "No"
            } else {
                return "Yes"
            }
        },

        formVisibility: function (value) {
            if (value === "" || value === null || value === undefined) {
                return "No"
            } else {
                return "Yes"
            }
        },

        objectStatusState: function (value) {
            if (value === "" || value === null || value === undefined) {
                return "Error"
            } else {
                return "Success"
            }
        },

        getStatus: function (sValue, createdBy, vcode) {
            // 
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
            }
        },

        statusDescription: function (statusDescVal, nextApprovalVal, vcodeVal, statusVal) {
            // 
            if (vcodeVal === "SR" && nextApprovalVal === "" && statusVal === 5) {
                return "Unassigned";
            } else if (vcodeVal === "SR" && nextApprovalVal === null && statusVal === 5) {
                return "Unassigned";
            } else if (vcodeVal === "SR" && nextApprovalVal === undefined && statusVal === 5) {
                return "Unassigned";
            } else if (vcodeVal === "SR" && nextApprovalVal === "" && statusVal === 9) {
                return "Unassigned";
            } else if (vcodeVal === "SR" && nextApprovalVal === null && statusVal === 9) {
                return "Unassigned";
            } else if (vcodeVal === "SR" && nextApprovalVal === undefined && statusVal === 9) {
                return "Unassigned";
            } else {
                return statusDescVal;
            }
        },

        getRequestValue: function (sValue) {
            //	;
            if (sValue === null || sValue === '' || sValue === undefined) {
                return "NA";
            } else {
                return "(" + sValue + ")";
            }
        },

        getErrorValue: function (sValue) {
            //	;
            if (sValue === null || sValue === '' || sValue === undefined) {
                return "NA";
            } else {
                return sValue;
            }
        }
    };
});