import {CompClass} from "/src/core";
import * as validTools from "/src/utils/validtools"
import {tmpl} from "./signin.tmpl";
import styles from "./signin.css";

export class SignIn extends CompClass {
    constructor(tag) {
        super(tag, tmpl, {},styles);
        // Все html елементы, содержащие id^="app-" продключены родителем к объекту в качетве свойств.
        this.appElements.forEach(
            (element)=>{
                if (element.tagName === 'LABEL') {
                    this.setSetterGetterAttr(element, "originalText");
                    element.originalText = element.textContent;
                }
            });
        this.signinForm.addEventListener('submit', event=>this.handleFormSubmit(event)) //стредочная, чтобы исключить подмену this
    }
    handleFormSubmit(event) {
        event.preventDefault() // Просим форму не отправлять данные самостоятельно
        let test = true;
        this.inputs.forEach(
            (input) => {
                test &= validTools.validate(input)
            });
        if (test) {window.location.href = '/chats'}
    }


}

