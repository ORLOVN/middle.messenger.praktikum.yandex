const Handlebars = require("handlebars/dist/handlebars.js");
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

Handlebars.registerHelper('switch', function(value: string, options: HelperOptions) {
    this.switch_value = value;
    this.switch_break = false;
    return options.fn(this);
});

Handlebars.registerHelper('case', function(value: string, options: HelperOptions) {
    if (value == this.switch_value) {
        this.switch_break = true;
        return options.fn(this);
    }
});

Handlebars.registerHelper('default', function(value: string) {
    if (this.switch_break == false) {
        return value;
    }
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
