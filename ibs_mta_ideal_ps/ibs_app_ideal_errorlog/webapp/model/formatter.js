sap.ui.define([], function () {
    "use strict";

    return {
    getRequestValue: function (sValue) {
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
}
})