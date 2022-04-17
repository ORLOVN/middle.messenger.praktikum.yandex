const Handlebars = require("handlebars");
import {HelperOptions} from "handlebars";

Handlebars.registerHelper('statusAwaiting', function (value: number) {
    return value === 1;
});

Handlebars.registerHelper('statusSent', function (value: number) {
    return value === 2;
});

Handlebars.registerHelper('statusReceived', function (value: number) {
    return value === 3;
});

Handlebars.registerHelper('statusRead', function (value: number) {
    return value === 4;
});

Handlebars.registerHelper('ifEquals', function(arg1: string, arg2: string, options: HelperOptions) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

export function TemplateCompile(tmpl: string, tmplData: any) {
    const template = Handlebars.compile(tmpl);
    return template(tmplData);
}

export function ReplaceTag(tag: string, NodeHTML: Node) {
    let element = document!.querySelector(tag);
    if (element) {
        element.replaceWith(NodeHTML);
    }
}
export function ParseStringHTML(stringHTML: string) {
    return new DOMParser().parseFromString(stringHTML, "text/html").body
        .children[0];
}
export function ParseNReplaceTag(tag: string, stringHTML: string) {
    ReplaceTag(tag, ParseStringHTML(stringHTML));
}
