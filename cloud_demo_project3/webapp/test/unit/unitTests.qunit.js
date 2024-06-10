/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comibspl/cloud_demo_project3/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
