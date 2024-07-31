/*global QUnit*/

sap.ui.define([
	"comibs/ibs_app_ideal_registrationform/controller/vendorForm.controller"
], function (Controller) {
	"use strict";

	QUnit.module("vendorForm Controller");

	QUnit.test("I should test the vendorForm controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
