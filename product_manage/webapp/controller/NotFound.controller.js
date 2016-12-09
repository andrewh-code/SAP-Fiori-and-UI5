sap.ui.define([
		"training/fiori/i849467/product/manage/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("training.fiori.i849467.product.manage.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);