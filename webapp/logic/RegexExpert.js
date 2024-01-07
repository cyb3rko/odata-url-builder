"use strict";

const Regex = {
    "URL": /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.,~#?&\/=$]*$/,
    "ENTITY_SET": /^[a-zA-Z0-9]+$/,
    "ORDER_BY": /^[a-zA-Z0-9]+(?:,[a-zA-Z0-9]+)*$/
}

function checkWithRegex(regex, data) {
    return RegExp(regex).test(data);
}
