sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("sap.ui5.training.controller.HelloPanel", {
      onShowHello : function () {
         // read msg from i18n model
         var oBundle = this.getView().getModel("i18n").getResourceBundle();
         var sRecipient = this.getView().getModel().getProperty("/recipient/name");
         var sMsg = oBundle.getText("helloMsg", [sRecipient]);
         // show message
         MessageToast.show(sMsg);
      },
      _getDialog : function () {
         // create dialog lazily
         if (!this._oDialog) {
            // create dialog via fragment factory
            this._oDialog = sap.ui.xmlfragment("sap.ui5.training.view.HelloDialog", this);
            // connect dialog to view (models, lifecycle)
            this.getView().addDependent(this._oDialog);
         }
         return this._oDialog;
      },
      /*onOpenDialog : function () {
         var oView = this.getView();
         var oDialog = oView.byId("helloDialog");
         // create dialog lazily
         if (!oDialog) {
            // create dialog via fragment factory
            oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui5.training.view.HelloDialog", this);
            oView.addDependent(oDialog);
         }
         oDialog.open();
      },
      onCloseDialog: function(){
          this.getView().byId("helloDialog").close();
      }*/
      
      //step 19
      onOpenDialog : function () {
			this.getOwnerComponent().openHelloDialog();
	  }
   });
});