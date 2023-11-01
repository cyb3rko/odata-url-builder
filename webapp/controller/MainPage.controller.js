"use strict";

const Icons = {
	"Positive": "sap-icon://status-positive",
	"Negative": "sap-icon://status-negative"
};
const Colors = {
	"BlueAccent": "#0064D9",
	"RedError": "#BB0000"
};

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], (Controller, MessageToast) => {
	let validUrl = undefined;
	let url = undefined;
	let encodedUrl = undefined;
	let extractor;

	return Controller.extend("ui5.walkthrough.controller.MainPage", {
		onInit() {
			extractor = new InputExtractor(this.getView());
			this.getView().byId("countSwitch").attachChange(() => {
				this.onInputChanged();
			});
			this.getView().byId("encoding").attachChange(() => {
				this.onInputChanged();
			});
		},
		onInputChanged(oEvent) {
			let endpoint = this.getView().byId("endpoint").getValue();
			while (endpoint.endsWith("/")) {
				endpoint = endpoint.slice(0, -1);
			}
			let validNewUrl = checkWithRegex(Regex.URL, endpoint);
			if (validUrl !== validNewUrl) {
				validUrl = validNewUrl;
				let iconView = this.getView().byId("icon");
				let src;
				let color;
				if (validNewUrl) {
					src = Icons.Positive;
					color = Colors.BlueAccent;
				} else {
					src = Icons.Negative;
					color = Colors.RedError;
				}
				iconView.setSrc(src);
				iconView.setColor(color);
			}
			if (validUrl) {
				this.updateURL(endpoint);
			} else {
				this.markURLOutdated();
			}
		},
		updateURL(endpoint) {
			url = endpoint;
			url = extractor.addEntitySet(url);
			url = extractor.addCountFilter(url);
			encodedUrl = encodeURI(url);
			if (this.getView().byId("encoding").getState()) {
				this.getView().byId("result").setHtmlText(encodedUrl);
			} else {
				this.getView().byId("result").setHtmlText(url);
			}
			this.getView().byId("copy").setVisible(true);
			this.getView().byId("open").setVisible(true);
		},
		markURLOutdated() {
			let resultView = this.getView().byId("result");
			let result = resultView.getHtmlText();
			if (result !== "" && !result.startsWith("(")) {
				resultView.setHtmlText("( " + result + " )");
			}
		},
		copyUrl() {
			let copyUrl;
			if (this.getView().byId("encoding").getState()) {
				copyUrl = encodedUrl;
			} else {
				copyUrl = url;
			}
			navigator.clipboard.writeText(copyUrl).then(
				() => {
					MessageToast.show("Copied to Clipboard");
				},
				() => {
					MessageToast.show("Failed to copy to Clipboard");
				}
			);
		},
		openUrl() {
			if (checkWithRegex(Regex.URL, encodedUrl)) {
				window.open(encodedUrl);
			} else {
				MessageToast.show("URL check failed");
			}
		}
	});
});
