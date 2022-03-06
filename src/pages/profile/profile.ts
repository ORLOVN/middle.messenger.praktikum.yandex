import Block from "../../utils/Block";
import tmpl from './profile.tmpl';
import Button from "../../components/button";
import ProfileItem from "./components/profile-item/";
import TextButton from "../../components/text-button";
import {listFromArray} from '../../utils/blockTools';
import router from '../../utils/Router';

import mediator from "../../utils/Mediator";

type inputData = Record<string, string>;

export class Profile extends Block {
    constructor() {

        const commonProps = {
            eventsSelector: 'input',
            editing: false,
            events: {
                blur: (event: FocusEvent) => {
                    mediator.emit(
                        'profile-input-blur',
                        (event.target! as HTMLInputElement).name,
                        (event.target! as HTMLInputElement).value
                    );
                }
            }
        }

        const profileProps: Array<Record<string, string>> = [
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

        const passwordProps: Array<Record<string, string>> = [
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

        const profileInputs = listFromArray(profileProps, ProfileItem, commonProps, 'inputList');

        const passwordInputs = listFromArray(passwordProps, ProfileItem, commonProps, 'passwordInputList');

        const buttons = {
            changeData: new TextButton({
                content:'Изменить данные',
                style:'red',
                events:{
                    click: () =>{
                        this.setProps({ editing:true });
                        profileInputs.list.forEach((value: Block) => {
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
                        passwordInputs.list.forEach((value: Block) => {
                            value.setProps({editing:true});
                        });
                    }
                }
            }),
            accept: new Button({
                content: 'Принять',
                style:'red',
                type:'submit',
            }),
            cancel: new TextButton({
                content: 'Отмена',
                style:'red',
                events:{
                    click: () =>{
                        this.setProps({ editing:false, changingPassword:false });
                        profileInputs.list.forEach((value: Block) => {
                            value.setProps({
                                editing:false,
                            });
                        });

                        passwordInputs.list.forEach((value: Block) => {
                            value.setProps({
                                editing:false,
                            });
                        });
                        mediator.emit('profile-cancel-editing');
                    }
                }
            }),
        }
        const backButton = new Button({
            content: `<span class="material-icons">arrow_back</span>`,
            class: `profile-settings__back-button`,
            events: {
                click: () => router.go('/')
            }
        });



        super({
            name: 'profilePage',
            profileInputs: profileInputs,
            passwordInputs: passwordInputs,
            ...buttons,
            backButton: backButton,
            editing: false,
            changingPassword: false,
            eventsSelector: 'form',
            events:{
                submit: (event: Event) => {
                    event.preventDefault();
                    const inputs = (event.target! as HTMLFormElement).querySelectorAll('input')
                    const values: Record<string, string> = {};
                    inputs.forEach((input: HTMLInputElement) => {
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
