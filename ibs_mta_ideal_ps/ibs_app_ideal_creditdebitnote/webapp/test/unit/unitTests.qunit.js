/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comibs/ibs_app_ideal_creditdebitnote/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
