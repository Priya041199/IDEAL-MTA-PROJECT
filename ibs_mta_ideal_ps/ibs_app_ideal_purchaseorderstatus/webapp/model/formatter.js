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

				// var date = parseInt(sValue.match(/\d/g).join(''), 10);

				sValue = sValue.substring(6, 8) + "." + sValue.substring(4, 6) + "." + sValue.substring(0, 4);
				return sValue;
			}

		},
		netValue: function (value, quantity) {
			return parseInt(value) * parseInt(quantity);
		}
	};
	return formatterObj;
});