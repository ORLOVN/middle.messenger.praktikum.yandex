import {validate}           from '../utils/validtools';
import store, {StoreEvents} from '../utils/Store';
import userApi              from '../api/user-api';
import {PlainObject}        from '../utils/types';
import {AVATAR_URL}         from '../utils/globalVariables';
import auth                 from './auth';

const storeLocation = 'profilePage';

const inputNameList = [
    'first_name',
    'second_name',
    'display_name',
    'login',
    'email',
    'phone',
];

class Profile {
    private static __instance: Profile;


    constructor() {
        if (Profile.__instance) {
            return Profile.__instance;
        }

        Profile.__instance = this;
        Object.assign(window, {profile: this});

        store.on(`${StoreEvents.Updated}-user`, (user) => {
            inputNameList.forEach((item) => {
                store.set(`${storeLocation}.inputList.${item}`, {
                    validLabel: '',
                    editableValue: user[item],
                    value: user[item],
                    editing: false});
            });
            store.set(`${storeLocation}.avatarSetting`, {
                first_name: user.first_name,
                display_name: user.display_name,
                avatar_file: `${AVATAR_URL}${user.avatar}`,
            });
        });
    }

    async submit(values: Record<string, string>) {
        let validResult = '';
        let ifProblem   = false;
        let inputList   = '';
        Object.entries(values).forEach(([name,value]) => {
            let aux = (name === 'repassword') ? values['newpassword'] || '' : '';
            validResult = validate (name, value, aux);
            inputList = (name === 'password' || name === 'repassword' || name === 'newpassword') ? 'passwordInputList' : 'inputList';
            store.set(`${storeLocation}.${inputList}.${name}`, { editableValue: value, validLabel: validResult, editing: true });
            ifProblem ||= !!validResult;
        });

        if (ifProblem) {
            return
        }

        if (inputList === 'inputList') {
            const state: PlainObject = store.getState(`${storeLocation}.${inputList}`);
            const requestBody: Record<string, string> = {};

            inputNameList.forEach(item => {requestBody[item] = state[item].editableValue})

            const res = await userApi.change(requestBody)
            if (res.status === 200) {
                store.set(`notification`, { content: 'Данные изменены'});
                await auth.checkUser(true)
                store.set(`${storeLocation}`, { editing: false, changingPassword: false });
                return
            }
        }

        if (inputList === 'passwordInputList') {
            const state: PlainObject = store.getState(`${storeLocation}.${inputList}`);
            const requestBody: Record<string, string>=
                {
                    "oldPassword":      state.password.editableValue,
                    "newPassword":      state.newpassword.editableValue,
                }

            const res = await userApi.changePassword(requestBody)
            if (res.status === 200) {
                store.set(`notification`, { content: 'Пароль изменен'});
                Object.keys(store.getState(`${storeLocation}.${inputList}`)).forEach((key) => {
                    store.set(`${storeLocation}.${inputList}.${key}`, {validLabel: '', editableValue: '', value: '', editing: false});
                });
                store.set(`${storeLocation}`, { editing:false, changingPassword:false });
            }

        }
    }

    inputBlur(name: string, value: string) {
        let validResult = validate (name, value, value);
        let inputList = (name === 'password' || name === 'repassword' || name === 'newpassword') ? 'passwordInputList' : 'inputList';
        store.set(`profilePage.${inputList}.${name}`, { editableValue: value, validLabel: validResult, editing:true});
    }

    async avatarSubmit(formData: FormData) {
        const res = await userApi.changeAvatar(formData)
        if (res.status === 200) {
            store.set(`user`, {...res.response});
        }
    }

    cancelEditing() {
        Object.entries(store.getState('profilePage.inputList')).forEach(([key, item]) => {
            let oldValue = (typeof item === "object" && item) ? (item as Record<string, string>).value : '';
            store.set(`profilePage.inputList.${key}`, {validLabel: '', editableValue: oldValue});
        })
        Object.entries(store.getState('profilePage.passwordInputList')).forEach(([key, item]) => {
            let oldValue = (typeof item === "object" && item) ? (item as Record<string, string>).value : '';
            store.set(`profilePage.passwordInputList.${key}`, {validLabel: '', editableValue: oldValue});
        })
    }

    initPage(){
        setTimeout(()=>{
            store.emit(`${StoreEvents.Updated}-profilePage.inputList`);
            store.emit(`${StoreEvents.Updated}-profilePage.avatarSetting`)
        }, 0);
    }

}

export default new Profile();
