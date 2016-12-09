/*global location*/
sap.ui.define([
		"training/fiori/i849467/product/manage/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"training/fiori/i849467/product/manage/model/formatter",
		"sap/m/MessageToast"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter, 
		MessageToast
	) {
		"use strict";

		return BaseController.extend("training.fiori.i849467.product.manage.controller.Object", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0,
						isSaveAllowed: true
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				// Store original busy indicator delay, so it can be restored later on
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						// Restore original busy indicator delay for the object view
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
				
                // // Set OData Model (default model) bidning mode to TwoWay Binding 
    			var oModel = this.getOwnerComponent().getModel();
    		    oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            
                sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
                
                // Creates bacth group for updates
    			var oModel = this.getOwnerComponent().getModel();
    			oModel.setDeferredBatchGroups(["editproduct"]);
    			oModel.setChangeBatchGroups({
    				"Product": {
    					batchGroupId: "editproduct"
    				}
    			});
                
            // attach handlers for validation errors
			// full message handling to be implemented by using message api
			// here only demo
		/*	this.getView().attachValidationError(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			this.getView().attachParseError(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			this.getView().attachValidationSuccess(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("None");
				}
			});*/
		},
			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
            
            
            /**
    		 * Event handler to update the entity property MainCategoryName of the entity Product 
    		 * to the respective description/text of the selected item.
    		 * @param {sap.ui.base.Event} event object
    		 * @public
    		 */
		    updateMainCategoryDescription: function(oEvent) {

    			var oSelect = oEvent.getSource();
    			var oSelectedItem = oSelect.getSelectedItem();
    			
    			var sPropertyPath = "MainCategoryName";
    
    			if (oSelectedItem && sPropertyPath) {
    				var oModel = oSelect.getBindingContext().getModel();
    				oModel.setProperty(sPropertyPath, oSelectedItem.getText(), oSelect.getBindingContext());
    			}
		    },
		    
			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("objectView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},

			/**
			 * Event handler  for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the worklist route.
			 * @public
			 */
			onNavBack: function(oEvent) {
			
			jQuery.sap.log.info("Back on Product Edit pressed: " + oEvent.getSource().getId());
			
			var oModel = this.getView().getModel();

			if (oModel.hasPendingChanges()) {
				sap.m.MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText('ymsg.data_loss'),
					jQuery.proxy(function(confirmed) {
						if (confirmed === "OK") {
							oModel.resetChanges();
							MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ymsg.changesReseted"));
						}
					}, this),
					this.getView().getModel("i18n").getResourceBundle().getText("xtit.confirmation"));
			} else {
				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ymsg.noChanges"));
			    }
		    },
            
            
    		/**
    		 * Event handler when Cancel Button pressed
    		 * @param {sap.ui.base.Event} event object
    		 * @public
    		 */
    		onCancelPressed: function(oEvent) {
    
    			jQuery.sap.log.info("Cancel on Product Edit pressed: " + oEvent.getSource().getId());
    
    			var oModel = this.getView().getModel();
    
    			if (oModel.hasPendingChanges()) {
    				oModel.resetChanges();
    				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ymsg.changesReseted"));
    			} else {
    				MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ymsg.noChanges"));
    			}
    
    		},
    		
    		/**
    		 * Event handler when Save Button pressed
    		 * @param {sap.ui.base.Event} event object
    		 * @public
    		 */
    		onSavePressed: function(oEvent) {
    
    			jQuery.sap.log.info("Save on Product Edit pressed: " + oEvent.getSource().getId());
    
    			var oModel = this.getView().getModel();
    
    			if (oModel.hasPendingChanges()) {
    
    				var mParameters = {};
    				mParameters.success = jQuery.proxy(this._successSave, this);
    				mParameters.error = jQuery.proxy(this._errorSave, this);
    				mParameters.batchGroupId = "editproduct";
    
    				oModel.submitChanges(mParameters);
    
    			} else {
    				sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText('ymsg.noChanges'));
    			}
    
    		},
    
    		/**
    		 * Event handler for event on success save
    		 *
    		 */
    		_successSave: function(oData, response) {
    			jQuery.sap.log.info("successSave on submitChanges triggered");
    		},
    
    		/**
    		 * Event handler for event on error by save
    		 *
    		 */
    		_errorSave: function(oError) {
    			jQuery.sap.log.info("errorSave on submitChanges triggered");
    		},
		
			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("Products", {
						Id :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound
			 * @private
			 */
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								// Busy indicator on view should only be set if metadata is loaded,
								// otherwise there may be two busy indications next to each other on the
								// screen. This happens because route matched handler already calls '_bindView'
								// while metadata is loaded.
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.Id,
					sObjectName = oObject.Name;

				// Everything went fine.
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},
			
			/**
		 * checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @private
		 */		
		_navigateBack : function(){
			
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("worklist", {}, bReplace);
			}
		}		
			
		});

	}
);