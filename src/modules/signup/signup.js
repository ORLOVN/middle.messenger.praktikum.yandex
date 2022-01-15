import {CompClass} from "/src/core.js";
import * as validTools from "/src/utils/validtools"
import {temp} from "./signup.tmpl.js";
import styles from "./signup.css";

export class SignUp extends CompClass {
    constructor(tag) {
        super(tag,temp,{},styles);
        // Все html елементы, содержащие id^="app-" продключены родителем к объекту в качетве свойств.
        this.appElements.forEach(
            (element)=>{
                if (element.tagName === 'LABEL') {
                    this.setSetterGetterAttr(element, "originalText");
                    element.originalText = element.textContent;
                }
            });

        // Здесь поле повторного пароля связывается с паролем для легкого доступа в функции валидации
        this.repassword.password = this.password;

        this.signupForm.addEventListener('submit', event=>this.handleFormSubmit(event)) //стредочная, чтобы исключить подмену this
        this.phone.addEventListener('change',event=>this.handlePhoneChange(event));
    }
    handlePhoneChange (event) {
        event.srcElement.value=validTools.beautifyPhone(event.srcElement.value);
    }
    handleFormSubmit(event) {
        event.preventDefault() // Просим форму не отправлять данные самостоятельно
        let test = true;
        this.inputs.forEach(
            (input) => {
                test &= validTools.validate(input)
            });
        if (test) {window.location.href = '/chat'}
    }
}
