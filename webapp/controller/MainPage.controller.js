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
	let validEntitySet = undefined;
	let url = undefined;
	let encodedUrl = undefined;
	let extractor;

	return Controller.extend("ui5.walkthrough.controller.MainPage", {
		onInit() {
			extractor = new InputManager(this.getView());
			this.getView().byId("countSwitch").attachChange(() => {
				this.onCountChanged("count");
				this.onInputChanged();
			});
			this.getView().byId("countInlineSwitch").attachChange(() => {
				this.onCountChanged("countInline");
				this.onInputChanged();
			});
			this.getView().byId("encoding").attachChange(() => {
				this.onInputChanged();
			});
			this.getView().byId("top_input").attachChange(() => {
				this.onInputChanged();
			});
			this.getView().byId("skip_input").attachChange(() => {
				this.onInputChanged();
			});
			this.processUrlParameters()
		},
		onInputChanged(oEvent) {
			let endpoint = this.getView().byId("endpoint").getValue();
			while (endpoint.endsWith("/")) {
				endpoint = endpoint.slice(0, -1);
			}
			let regexMatch = checkWithRegex(Regex.URL, endpoint);
			if (validUrl !== regexMatch) {
				validUrl = regexMatch;
				let iconView = this.getView().byId("icon1");
				let src;
				let color;
				if (regexMatch) {
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
			let entitySet = this.getView().byId("entityset").getValue();
			regexMatch = checkWithRegex(Regex.ENTITY_SET, entitySet);
			if (validEntitySet !== regexMatch) {
				validEntitySet = regexMatch;
				let iconView = this.getView().byId("icon2");
				let src;
				let color;
				if (regexMatch) {
					src = Icons.Positive;
					color = Colors.BlueAccent;
				} else {
					src = Icons.Negative;
					color = Colors.RedError;
				}
				iconView.setSrc(src);
				iconView.setColor(color);
			}
		},
		onCountChanged(note) {
			let countSwitch = this.getView().byId("countSwitch")
			let countInlineSwitch = this.getView().byId("countInlineSwitch")

			if (countSwitch.getState() && note === "count") {
				countInlineSwitch.setState(false)
			} else if (countInlineSwitch.getState() && note === "countInline") {
				countSwitch.setState(false)
			}
			extractor.setCountMode(!countSwitch.getState())
		},
		updateURL(endpoint) {
			url = endpoint;
			url = extractor.addEntitySet(url);
			url = extractor.addCountFilter(url);
			url = extractor.addInlineCountFilter(url);
			url = extractor.addTopFilter(url);
			url = extractor.addSkipFilter(url);
			url = extractor.addOrderByFilter(url);
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
		},
		processUrlParameters() {
			let urlParams = new URLSearchParams(window.location.search)
			if (urlParams.size === 0) return

			let parameterInserted = false
			let parameter = urlParams.get("root")
			if (parameter !== null) {
				parameterInserted = true
				this.getView().byId("endpoint").setValue(parameter)
			}
			parameter = urlParams.get("entityset")
			if (parameter !== null) {
				parameterInserted = true
				this.getView().byId("entityset").setValue(parameter)
			}
			if (parameterInserted) this.onInputChanged()
		}
	});
});
