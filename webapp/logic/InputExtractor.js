"use strict";

class InputExtractor {
    static #validEntitySetRegex = /^[a-zA-Z0-9 ]+$/;
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
    
    addEntitySet(url) {
        let value = this.#entitySetInput.getValue();
        if (new RegExp(InputExtractor.#validEntitySetRegex).test(value)) {
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
}
