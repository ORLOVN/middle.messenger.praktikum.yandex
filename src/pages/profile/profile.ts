import Block            from '../../utils/Block';
import tmpl             from './profile.tmpl';
import Button           from '../../components/button';
import ProfileItem      from './components/profile-item/';
import TextButton       from '../../components/text-button';
import {listFromArray}  from '../../utils/blockTools';
import router           from '../../utils/Router';
import AvatarSetting    from './components/avatar-setting';
import profile          from "../../modules/profile";

export class Profile extends Block {
    constructor() {

        const commonProps = {
            eventsSelector: 'input',
            editing: false,
            events: {
                blur: (event: FocusEvent) => {
                    profile.inputBlur(
                        (event.target! as HTMLInputElement).name,
                        (event.target! as HTMLInputElement).value
                    );
                }
            }
        }

        const profileProps: Array<Record<string, string>> = [
            {
                name:  'login',
                type:  'text',
                label: 'Логин'
            },
            {
                name:  'display_name',
                type:  'text',
                label: 'Имя в чате'
            },
            {
                name:  'email',
                type:  'email',
                label: 'Почтовый ящик'
            },
            {
                name:  'first_name',
                type:  'text',
                label: 'Имя'
            },
            {
                name:  'second_name',
                type:  'text',
                label: 'Фамилия'
            },
            {
                name:  'phone',
                type:  'text',
                prefix:'+7',
                label: 'Телефон'
            },
        ];

        const passwordProps: Array<Record<string, string>> = [
            {
                name:   'password',
                type:   'password',
                label:  'Старый пароль'
            },
            {
                name:   'newpassword',
                type:   'password',
                label:  'Новый пароль'
            },
            {
                name:   'repassword',
                type:   'password',
                label:  'Повторить новый пароль'
            },
        ];

        const profileInputs = listFromArray(profileProps, ProfileItem, commonProps, 'inputList');

        const passwordInputs = listFromArray(passwordProps, ProfileItem, commonProps, 'passwordInputList');

        const buttons = {
            changeData: new TextButton({
                content:    'Изменить данные',
                style:      'red',
                events: {
                    click: () =>{
                        this.setProps({ editing:true });
                        profileInputs.list.forEach((value: Block) => {
                            value.setProps({editing:true});
                        });
                    }
                }
            }),
            changePassword: new TextButton({
                content:    'Изменить пароль',
                style:      'red',
                events:     {
                    click: () =>{
                        this.setProps({ editing:true, changingPassword:true });
                        passwordInputs.list.forEach((value: Block) => {
                            value.setProps({editing:true});
                        });
                    }
                }
            }),
            accept: new Button({
                content:    'Принять',
                style:      'red',
                type:       'submit',
            }),
            cancel: new TextButton({
                content:    'Отмена',
                style:      'red',
                events:     {
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
                        profile.cancelEditing();
                    }
                }
            }),
        }
        const avatarButton = new Button({
            content:    `<span class="material-icons">portrait</span>`,
            class:      `profile-settings__back-button`,
            events:     {
                click: () => router.go('/messenger')
            }
        });
        const backButton = new Button({
            content:    `<span class="material-icons">arrow_back</span>`,
            class:      `profile-settings__back-button`,
            events:     {
                click: () => router.go('/messenger')
            }
        });

        const avatarSetting = new AvatarSetting({
            name:       'avatarSetting',
            events:     {
                submit: (event: Event) => {
                    event.preventDefault();
                    if (!event || !event.target) return;
                    const form = new FormData((event.target as HTMLFormElement));
                    profile.avatarSubmit(form);
                }
            }
        })



        super({
            name:               'profilePage',
            avatarSetting:      avatarSetting,
            profileInputs:      profileInputs,
            passwordInputs:     passwordInputs,
            avatarButton:       avatarButton,
            ...buttons,
            backButton:         backButton,
            editing:            false,
            changingPassword:   false,
            eventsSelector:     '#profileSettingsForm',
            events: {
                submit: (event: Event) => {
                    event.preventDefault();
                    const inputs = (event.target! as HTMLFormElement).querySelectorAll('input')
                    const values: Record<string, string> = {};
                    inputs.forEach((input: HTMLInputElement) => {
                        values[input.name] = input.value;
                    });
                    profile.submit(values);
                }
            }
        });

        profile.initPage();
    }

    render(): string {
        return tmpl;
    }
}
