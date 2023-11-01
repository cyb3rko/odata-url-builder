"use strict";

const Regex = {
    "URL": /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&\/=$]*$/
}

function checkWithRegex(regex, data) {
    return RegExp(regex).test(data);
}
