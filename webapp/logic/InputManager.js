"use strict";

class InputManager {
    #view;

    constructor(view) {
        this.#view = view;
    }
    
    get #entitySetInput() {
        return this.#view.byId("entityset");
    }

    get #countSwitch() {
        return this.#view.byId("countSwitch");
    }
    
    get #inlineCountSwitch() {
        return this.#view.byId("countInlineSwitch");
    }

    get #topInput() {
        return this.#view.byId("top_input");
    }

    get #skipInput() {
        return this.#view.byId("skip_input");
    }

    get #orderByInput() {
        return this.#view.byId("orderby_input");
    }
    
    setCountMode(activate) {

    }

    #addQueryOption(url, option, value) {
        let addition = "$" + option + "=" + value
        if (url.includes("?")) {
            return url + "&" + addition
        } else {
            return url + "?" + addition
        }
    }

    addEntitySet(url) {
        let value = this.#entitySetInput.getValue();
        if (checkWithRegex(Regex.ENTITY_SET, value)) {
            return url + "/" + value;
        } else {
            return url;
        }
    }

    addCountFilter(url) {
        if (this.#countSwitch.getState()) {
            return url + "/$count";
        }
        return url;
    }

    addInlineCountFilter(url) {
        if (this.#inlineCountSwitch.getState()) {
            return this.#addQueryOption(url, "inlinecount", "allpages")
        }
        return url
    }

    addTopFilter(url) {
        if (this.#topInput.getValue() > 0) {
            return this.#addQueryOption(url, "top", this.#topInput.getValue())
        }
        return url;
    }

    addSkipFilter(url) {
        if (this.#skipInput.getValue() > 0) {
            return this.#addQueryOption(url, "skip", this.#skipInput.getValue())
        }
        return url;
    }

    addOrderByFilter(url) {
        let value = this.#orderByInput.getValue()
        while (value.endsWith(",")) {
            value = value.slice(0, -1)
        }
        if (checkWithRegex(Regex.ORDER_BY, value)) {
            return this.#addQueryOption(url, "orderby", value)
        }
        return url;
    }
}
