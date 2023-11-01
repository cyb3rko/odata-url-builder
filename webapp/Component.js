"use strict";

sap.ui.define([
	"sap/ui/core/UIComponent"
], (UIComponent) => {
	return UIComponent.extend("ui5.walkthrough.Component", {
		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		},
		init() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		}
	});
});
