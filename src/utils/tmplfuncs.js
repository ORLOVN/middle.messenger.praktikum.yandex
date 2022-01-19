"use strict";

const Handlebars = require("handlebars");

export function TemplateCompile(tmpl, tmplData) {
    const template = Handlebars.compile(tmpl);
    return template(tmplData);
}

export function ReplaceTag(tag, NodeHTML) {
    if (document.querySelector(tag)) {
        document.querySelector(tag).replaceWith(NodeHTML);
    }
}
export function ParseStringHTML(stringHTML) {
    return new DOMParser().parseFromString(stringHTML, "text/html").body
        .children[0];
}
export function ParseNReplaceTag(tag, stringHTML) {
    ReplaceTag(tag, ParseStringHTML(stringHTML));
}