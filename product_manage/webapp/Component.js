sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"training/fiori/i849467/product/manage/model/models",
		"training/fiori/i849467/product/manage/controller/ErrorHandler",
		"sap/ui/core/routing/HashChanger"
	], function (UIComponent, Device, models, ErrorHandler, HashChanger) {
		"use strict";

		return UIComponent.extend("training.fiori.i849467.product.manage.Component", {

			metadata : {
				manifest: "json"
			},

			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * In this function, the FLP and device models are set and the router is initialized.
			 * @public
			 * @override
			 */
			init : function () {
				// call the base component's init function
				UIComponent.prototype.init.apply(this, arguments);

				// initialize the error handler with the component
				this._oErrorHandler = new ErrorHandler(this);

				// set the device model
				this.setModel(models.createDeviceModel(), "device");
				// set the FLP model
				this.setModel(models.createFLPModel(), "FLP");

				// create the views based on the url/hash
				this.getRouter().initialize();
			},
            /**
    		 * In this function, the rootView is initialized and stored.
    		 * @public
    		 * @override
    		 * @returns {sap.ui.mvc.View} the root view of the component
    		 */
    		createContent: function() {
    
    			var oComponentData = this.getComponentData();
    
    			if (oComponentData && oComponentData.startupParameters) {
    				jQuery.sap.log.info("app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
    
    				// to construct the correct URL all parameters defined in the routes's pattern have to be provided 
    				// to the getURL function:
    				var startparams = (oComponentData.startupParameters || {});
    				var sUrl;
    
    				if (startparams["Product"]) {
    					var sId = startparams["Product"].toString();
    					sId = sId.replace(/^0+/, ""); // remove leading zeros
    
    					var oRouter = this.getRouter();
    					// oRouter.getURL(<route name>,{<parameter Name>: <parameter value>})
    					sUrl = oRouter.getURL("object", {
    						objectId: sId
    					});
    				}
    
    				if (sUrl) {
    					var oHashChanger = HashChanger.getInstance();
    					oHashChanger.replaceHash(sUrl);
    				}
    			}
    
    			// call the base component's createContent function
    			var oRootView = UIComponent.prototype.createContent.apply(this, arguments);
    			return oRootView;
    		},
		
			/**
			 * The component is destroyed by UI5 automatically.
			 * In this method, the ErrorHandler is destroyed.
			 * @public
			 * @override
			 */
			destroy : function () {
				this._oErrorHandler.destroy();
				// call the base component's destroy function
				UIComponent.prototype.destroy.apply(this, arguments);
			},

			/**
			 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
			 * design mode class should be set, which influences the size appearance of some controls.
			 * @public
			 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
			 */
			getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					// check whether FLP has already set the content density class; do nothing in this case
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			}

		});

	}
);