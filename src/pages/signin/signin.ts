import Block from "../../utils/Block";
import tmpl from './signin.tmpl';
import Button from "../../components/button";
import InputAssembly from "../../components/input-assy";
import TextButton from "../../components/text-button";
import {listFromArray} from "../../utils/blockTools";

import mediator from "../../utils/Mediator";

export class Signin extends Block {
    constructor() {

        const commonProps = {
            events: {
                blur: (event: FocusEvent) => {
                    mediator.emit(
                        'signin-input-blur',
                        (event.target! as HTMLInputElement).name,
                        (event.target! as HTMLInputElement).value
                    );
                }
            }
        }
        const inputsProps = [
            {
                name:'login',
                type:'text',
                label:'Логин',
                placeholder: 'mylogin999',
            },
            {
                name:'password',
                type:'password',
                label:'Пароль',
                placeholder: 'password',
            }
        ];
        const inputList = listFromArray(inputsProps, InputAssembly, commonProps, 'inputList');

        const submitButton = new Button({
            content: 'Вход',
            style: 'red',
            type: 'submit',
            events: {
                click: () => console.log('profile button clicked')
            }
        });

        const signupRef = new TextButton({
            href: '/signup',
            content:'Нет аккаунта?',
            style: 'white'
        });


        super({
            name: 'signinPage',
            inputList: inputList,
            submitButton :submitButton,
            signupRef: signupRef,
            eventSelector: 'form',
            events:{
                submit: (event: Event) => {
                    event.preventDefault();
                    const inputs = (event.target! as HTMLFormElement).querySelectorAll('input')
                    const values: Record<string, string> = {};
                    inputs.forEach((input: HTMLInputElement) => {
                        values[input.name] = input.value;
                    });
                    mediator.emit('signin-submit', values)
                }
            }
        });

    }

    render(): string {
        return tmpl;
    }

    ChatListElementClick(id: string) {
        console.log(`Element list item ${id} has been clicked`)
    }
}

