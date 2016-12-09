sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessagePopover",
		"sap/m/MessagePopoverItem"
	], function (Controller, MessagePopover, MessagePopoverItem) {
		"use strict";

		return Controller.extend("training.fiori.i849467.product.manage.controller.BaseController", {
			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
            
			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},
			
			/**
		 * Combo boxes - onItemSelected event or Select - changes change only the selectdKey in the respective data model and not the description.
		 * The description property in the data model need to be changed/updated
		 * Reason: unit tests, binding in other controls to key and descriptions
		 * Usage:
		 * 1. include the namespace in the XML document
		 *     ... xmlns:data="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1" ...
		 * 2. provide with the property data:description and apply this function as event handler for event selectionChange
		 *     <ComboBox ... data:description="FormOfAddressName" selectionChange="updateDescriptionFromComboBox" ...
		 *     <Select   ... data:description="FormOfAddressName" change="updateDescriptionFromComboBox" ...
		 *
		 * @param {sap.ui.base.Event} event the SAPUI5 event object generated when the user changes the combo box value
		 * @returns {void}
		 */
		updateDescriptionFromSelect: function(oEvent) {
			var oSelect = oEvent.getSource();
			var oSelectedItem = oSelect.getSelectedItem();
			
			var sPropertyPath = oSelect.data('description');

			if (oSelectedItem && sPropertyPath) {
				var oModel = oSelect.getBindingContext().getModel();
				oModel.setProperty(sPropertyPath, oSelectedItem.getText(), oSelect.getBindingContext());
			}

		},
		
		/**
		 * Event handler to open the message popover to display the messages in the message model
		 * @public
		 */		
		onMessagesButtonPress: function(oEvent) {
			var oMessagesButton = oEvent.getSource();
			if (!this._messagePopover) {
				this._messagePopover = new MessagePopover({
					items: {
						path: "message>/",
						template: new MessagePopoverItem({
							description: "{message>description}",
							type: "{message>type}",
							title: "{message>message}"
						})
					}
				});
				oMessagesButton.addDependent(this._messagePopover);
			}
			this._messagePopover.toggle(oMessagesButton);
		}

		});

	}
);