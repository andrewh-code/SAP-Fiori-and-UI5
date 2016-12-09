jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"training/fiori/i849467/product/manage/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"training/fiori/i849467/product/manage/test/integration/pages/Worklist",
		"training/fiori/i849467/product/manage/test/integration/pages/Object",
		"training/fiori/i849467/product/manage/test/integration/pages/NotFound",
		"training/fiori/i849467/product/manage/test/integration/pages/Browser",
		"training/fiori/i849467/product/manage/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "training.fiori.i849467.product.manage.view."
	});

	sap.ui.require([
		"training/fiori/i849467/product/manage/test/integration/WorklistJourney",
		"training/fiori/i849467/product/manage/test/integration/ObjectJourney",
		"training/fiori/i849467/product/manage/test/integration/NavigationJourney",
		"training/fiori/i849467/product/manage/test/integration/NotFoundJourney",
		"training/fiori/i849467/product/manage/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});