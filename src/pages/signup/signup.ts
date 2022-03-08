import Block from "../../utils/Block";
import tmpl from './signup.tmpl';
import Button from "../../components/button";
import InputAssembly from "../../components/input-assy";
import TextButton from "../../components/text-button";
import {listFromArray} from '../../utils/blockTools';
import PopupNote from "../../components/popup-note";

import mediator from "../../utils/Mediator";

export class Signup extends Block {
    constructor() {

        const commonProps = {
            events: {
                blur: (event: FocusEvent) => {
                    console.log('start')
                    mediator.emit(
                        'signup-input-blur',
                        (event.target! as HTMLInputElement).name,
                        (event.target! as HTMLInputElement).value
                    );
                }
            }
        }

        const inputsProps: Array<Record<string, string>> = [
            {
                name:'login',
                type:'text',
                label:'Логин',
                placeholder: 'mylogin999',
            },
            {
                name:'email',
                type:'email',
                label:'Почтовый ящик',
                placeholder: 'example@e-mail.com',
            },
            {
                name:'first_name',
                type:'text',
                label:'Имя',
                placeholder: 'Иван',
            },
            {
                name:'second_name',
                type:'text',
                label:'Фамилия',
                placeholder: 'Иванов',
            },
            {
                name:'newpassword',
                type:'password',
                label:'Новый пароль',
                placeholder: 'password',
            },
            {
                name:'repassword',
                type:'password',
                label:'Повторить новый пароль',
                placeholder: 'password',
            },
            {
                name:'phone',
                type:'text',
                prefix: '+7',
                label:'Телефон',
                placeholder: '+78888888888',
            },
        ];

        const inputList = listFromArray(inputsProps, InputAssembly, commonProps, 'inputList');

        const submitButton = new Button({
            name: 'submit',
            content: 'Регистрация',
            type: 'submit',
            style: 'red',
            events: {
                click: () => {
                    //
                }
            }
        })

        const signinRef = new TextButton({
            href: '/signin',
            content: 'Уже есть аккаунт?',
            style: 'white'
        });

        const popupNote = new PopupNote({
            name: 'popupNote'
        });

        super({
            name: 'signupPage',
            inputList: inputList,
            signinRef: signinRef,
            submitButton: submitButton,
            popupNote: popupNote,
            eventsSelector: 'form',
            events:{
                submit: (event: Event) => {
                    event.preventDefault();
                    const inputs = (event.target! as HTMLFormElement).querySelectorAll('input')
                    const values : Record<string, string> = {};
                    inputs.forEach((input: HTMLInputElement) => {
                        values[input.name] = input.value;
                    });
                    mediator.emit('signup-submit', values)
                }
            }
        });
    }

    render(): string {
        return tmpl;
    }

}

