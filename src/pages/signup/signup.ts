import Block from "../../utils/Block";
import tmpl from './signup.tmpl';
import Button from "../../components/button";
import InputAssembly from "../../components/input-assy";
import TextButton from "../../components/text-button";
import {listFromArray} from '../../utils/blockTools'

import Mediator from "../../utils/Mediator";
const mediator = Mediator.getInstance();

type inputData = Record<string, string>;

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

        const inputsProps = [
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

        const inputList = listFromArray(inputsProps, InputAssembly, commonProps);

        const submitButton = new Button({
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



        super({
            inputList: inputList,
            signinRef: signinRef,
            submitButton: submitButton,
            eventsSelector: 'form',
            events:{
                submit: (event: Event) => {
                    event.preventDefault();
                    const inputs = (event.target! as HTMLFormElement).querySelectorAll('input')
                    const values : Record<string, string> = {};
                    inputs.forEach((input: HTMLInputElement) => {
                        values[input.name] = input.value;
                    });
                    mediator.emit('signup-PUT', values)
                }
            }
        });

        mediator.on('signup-GET', (values: inputData,validResults?: inputData) => {

            Object.entries(values).forEach(([name,value]) => {
                inputList.list[inputList.nameList[name]].setProps({value: value});
            });

            if (!validResults) {
                return
            }

            Object.entries(validResults).forEach(([name,value]) => {
                inputList.list[inputList.nameList[name]].setProps({validLabel: value});
            });

        });

        mediator.on('signup-input-validated', (name: string, value: string, validResult: string) => {
            if (inputList.nameList[name] !== undefined) {
                inputList.list[inputList.nameList[name]].setProps({value: value, validLabel: validResult});
            }

        });
    }

    render(): string {
        return tmpl;
    }

}

