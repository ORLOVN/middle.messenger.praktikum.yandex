import Block from "../../utils/Block";
import tmpl from './profile.tmpl';
import Button from "../../components/button";
import ProfileItem from "./components/profile-item/";
import TextButton from "../../components/text-button";
import {listFromArray} from '../../utils/blockTools';

import Mediator from "../../utils/Mediator";
const mediator = Mediator.getInstance();

type inputData = Record<string, string>;

export class Profile extends Block {
    constructor() {

        const commonProps = {
            eventsSelector: 'input',
            editing: false,
            events: {
                blur: (event) => {
                    mediator.emit('profile-input-blur', event.target.name, event.target.value);
                }
            }
        }

        const profileProps = [
            {
                name:'login',
                type:'text',
                label:'Логин'
            },
            {
                name:'email',
                type:'email',
                label:'Почтовый ящик'
            },
            {
                name:'first_name',
                type:'text',
                label:'Имя'
            },
            {
                name:'second_name',
                type:'text',
                label:'Фамилия'
            },
            {
                name:'phone',
                type:'text',
                prefix: '+7',
                label:'Телефон'
            },
        ];

        const passwordProps = [
            {
                name:'password',
                type:'password',
                label:'Старый пароль'
            },
            {
                name:'newpassword',
                type:'password',
                label:'Новый пароль'
            },
            {
                name:'repassword',
                type:'password',
                label:'Повторить новый пароль'
            },
        ];

        const profileInputs = listFromArray(profileProps,ProfileItem, commonProps);

        const passwordInputs = listFromArray(passwordProps, ProfileItem, commonProps);

        const buttons = {
            changeData: new TextButton({
                content:'Изменить данные',
                style:'red',
                events:{
                    click: () =>{
                        this.setProps({ editing:true });
                        profileInputs.list.forEach((value) => {
                            value.setProps({editing:true});
                        });
                    }
                }
            }),
            changePassword: new TextButton({
                content:'Изменить пароль',
                style:'red',
                events:{
                    click: () =>{
                        this.setProps({ editing:true, changingPassword:true });
                        passwordInputs.list.forEach((value) => {
                            value.setProps({editing:true});
                        });
                    }
                }
            }),
            accept: new TextButton({
                content: 'Принять',
                style:'red',
                events:{
                    click: (event) =>{
                        const form = event.target.closest('form');
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            }),
            cancel: new TextButton({
                content: 'Отмена',
                style:'red',
                events:{
                    click: () =>{
                        this.setProps({ editing:false, changingPassword:false });
                        profileInputs.list.forEach((value) => {
                            value.setProps({
                                editing:false,
                                validLabel:'',
                                editableValue:'',
                            });
                        });

                        passwordInputs.list.forEach((value) => {
                            value.setProps({
                                editing:false,
                                validLabel:'',
                                editableValue:'',
                            });
                        });
                    }
                }
            }),
        }
        const backButton = new Button({
            content: `<span class="material-icons">arrow_back</span>`,
            class: `profile-settings__back-button`,
            events: {
                click: () => console.log('profile button clicked')
            }
        });



        super({
            profileInputs: profileInputs,
            passwordInputs: passwordInputs,
            ...buttons,
            backButton: backButton,
            editing: false,
            changingPassword: false,
            eventsSelector: 'form',
            events:{
                submit: (event) => {
                    event.preventDefault();
                    const inputs = event.target.querySelectorAll('input')
                    const values = {};
                    inputs.forEach((input) => {
                        values[input.name] = input.value;
                    });
                    mediator.emit('profile-PUT', values)
                }
            }
        });

        mediator.on('profile-GET', (values: inputData,validResults: inputData) => {

            Object.entries(values).forEach(([name,value]) => {
                if (profileInputs.nameList[name] !== undefined) {
                    profileInputs.list[profileInputs.nameList[name]].setProps({editableValue: value})
                }
                if (passwordInputs.nameList[name] !== undefined) {
                    passwordInputs.list[passwordInputs.nameList[name]].setProps({editableValue: value})
                }
            })

            if (!validResults) {
                return
            }
            Object.entries(validResults).forEach(([name,value]) => {
                if (profileInputs.nameList[name] !== undefined) {
                    profileInputs.list[profileInputs.nameList[name]].setProps({validLabel: value})
                }
                if (passwordInputs.nameList[name] !== undefined) {
                    passwordInputs.list[passwordInputs.nameList[name]].setProps({validLabel: value})
                }
            })
        });

        mediator.on('profile-input-validated', (name: string, value: string, validResult: string) => {
            if (profileInputs.nameList[name] !== undefined) {
                profileInputs.list[profileInputs.nameList[name]].setProps({editableValue: value, validLabel: validResult})
            }

            if (passwordInputs.nameList[name] !== undefined) {
                passwordInputs.list[passwordInputs.nameList[name]].setProps({editableValue: value, validLabel: validResult})
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

