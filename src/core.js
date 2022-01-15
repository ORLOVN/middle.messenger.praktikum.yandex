"use strict";

import * as tmplFuncs from "./utils/tmplfuncs";

export class CompClass {
    constructor(tag, tmpl, tmplData, styles = null) {
        this.tmpl = tmpl;
        this.node = tmplFuncs.ParseStringHTML(tmplFuncs.TemplateCompile(tmpl, tmplData));
        tmplFuncs.ReplaceTag(tag, this.node);

        if (styles) {
            //заменяем клаcсы в html элементах на те, что получились после postcss
            let oldClass = this.node.getAttribute("class");
            let newClass = styles[oldClass];
            this.node.setAttribute("class", newClass ? newClass : oldClass);
            this.node.querySelectorAll("*").forEach((element) => {
                let oldClass = element.getAttribute("class");
                let newClass = styles[oldClass];
                element.setAttribute("class", newClass ? newClass : oldClass);
            });
        }
        // все елементы с id начинающийчся с app-, будт поключены к свойстван текущего объекта для легкого доступа
        this.appElements = this.node.querySelectorAll('[id^="app-"]');
        this.appElements.forEach((element) => {
            let id = element.getAttribute("id");
            id = id.slice(4, id.length);
            this[id] = element;

            // Связываем все label, имеющие аттрибут for, с соответствующим Input
            // Это пригодится для записи результата валидации
            if (element.tagName === "INPUT") {
                element.label = this.node.querySelector(`[for=${element.id}]`);
            }
        });

        this.inputs = this.node.querySelectorAll("input");

        this.onInit();
    }
    setSetterGetterAttr(element, attributeName, propertyName = "") {
        if (!propertyName) {
            propertyName = attributeName;
        }
        element[propertyName] = {
            get() {
                element.getAttribute(attributeName);
            },
            set(value) {
                element.setAttribute(attributeName, value);
            },
        };
    }

    onInit() {}
}
