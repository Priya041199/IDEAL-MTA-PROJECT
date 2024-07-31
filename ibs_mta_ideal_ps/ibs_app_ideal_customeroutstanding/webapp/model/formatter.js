sap.ui.define([], function () {
	"use strict";

	var formatterObj = {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		getStatus: function (val) {
			if (val === "U") {
				return "Open Items";
			} else {
				return "Cleared Items";
			}
		},
		getDueNet: function (val) {
			if (val === false) {
				return 'sap-icon://time-overtime';
			} else {
				return 'sap-icon://time-overtime';
			}
		},
		getColor: function (val) {
			if (val === false) {
				return "red";
			} else {
				return "green";
			}
		},

		getClearStatus: function (value) {
			if (value === false) {
				return 'sap-icon://status-error';
			} else {
				return 'sap-icon://status-positive';
			}
		},
		getClrColor: function (value) {
			if (value === false) {
				return "red";
			} else {
				return "green";
			}
		},
		getDueNetTool: function (val) {
			if (val === false) {
				return "Over due";
			} else {
				return "No due";
			}
		},
		getClearStatusTool: function (val) {
			if (val === false) {
				return "Not Cleared";
			} else {
				return "Cleared";
			}
		},
		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},
		DT2digit: function (n) {
			return n < 10 ? '0' + n : n;
		},
		setDateDashFormat: function (val) {
			var day = formatterObj.DT2digit(val.getDate());
			var month = formatterObj.DT2digit(val.getMonth() + 1);
			var year = formatterObj.DT2digit(val.getFullYear());
			var date = year + "-" + month + "-" + day;
			return date;
		},
		setDate: function (val) {
			var day = formatterObj.DT2digit(val.getDate());
			var month = formatterObj.DT2digit(val.getMonth() + 1);
			var year = formatterObj.DT2digit(val.getFullYear());
			var date = day + "." + month + "." + year;
			return date;
		},
		formatDate: function (sValue) {

			if (!sValue) {
				return "";
			} else if (sValue instanceof Date) {

				return formatterObj.setDate(sValue);
			} else {

				var date = parseInt(sValue.match(/\d/g).join(''), 10);
				return formatterObj.setDate(new Date(date));
			}

		},
		netValue: function (value, quantity) {
			return parseInt(value) * parseInt(quantity);
		}
	};
	return formatterObj;
});