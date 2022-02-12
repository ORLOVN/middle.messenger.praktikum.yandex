import Block from "../../utils/Block";
import tmpl from './signin.tmpl';
import Button from "../../components/button";
import InputAssembly from "../../components/input-assy";
import TextButton from "../../components/text-button";
import {listFromArray} from "../../utils/blockTools";

import Mediator from "../../utils/Mediator";
const mediator = Mediator.getInstance();

type inputData = Record<string, string>;

export class Signin extends Block {
    constructor() {

        const commonProps = {
            events: {
                blur: (event) => {
                    console.log('start')
                    mediator.emit('signin-input-blur', event.target.name, event.target.value);
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
        const inputList = listFromArray(inputsProps, InputAssembly, commonProps);

        const submitButton = new Button({
            content: 'Вход',
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
            'inputList': inputList,
            'submitButton' :submitButton,
            'signupRef': signupRef,
            eventSelector: 'form',
            events:{
                submit: (event) => {
                    event.preventDefault();
                    const inputs = event.target.querySelectorAll('input')
                    const values = {};
                    inputs.forEach((input) => {
                        values[input.name] = input.value;
                    });
                    mediator.emit('signin-POST', values)
                }
            }
        });

        mediator.on('signin-GET', (values: inputData, validResults?: inputData) => {

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

        mediator.on('signin-input-validated', (name: string, value: string, validResult: string) => {
            if (inputList.nameList[name] !== undefined) {
                inputList.list[inputList.nameList[name]].setProps({value: value, validLabel: validResult});
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

