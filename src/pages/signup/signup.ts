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
    private readonly inputs: {string, InputAssembly}
    constructor() {

        const commonProps = {
            events: {
                blur: (event) => {
                    console.log('start')
                    mediator.emit('signup-input-blur', event.target.name, event.target.value);
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
            events: {
                click: () => {
                    //
                }
            }
        })

        const signinRef = new TextButton({
            content: 'Уже есть аккаунт?',
            style: 'white'
        });



        super({
            inputList: inputList,
            signinRef: signinRef,
            submitButton: submitButton,
            eventsSelector: 'form',
            events:{
                submit: (event) => {
                    event.preventDefault();
                    const inputs = event.target.querySelectorAll('input')
                    const values = {};
                    inputs.forEach((input) => {
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

