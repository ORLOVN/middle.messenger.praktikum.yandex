import mediator             from '../utils/Mediator';
import {validate}           from "../utils/validtools";
import store, {StoreEvents} from '../utils/Store';
import userApi              from "../api/user-api";
import {PlainObject}        from "../utils/types";
import {AVATAR_URL} from "../utils/globalVariables";

const storeLocation = 'profilePage';

const inputNameList = [
    'first_name',
    'second_name',
    'display_name',
    'login',
    'email',
    'phone',
];


mediator.on('profile-submit', (values: Record<string, string>) => {
    let validResult = '';
    let ifProblem   = false;
    let inputList   = '';
    console.log(values);
    Object.entries(values).forEach(([name,value]) => {
        let aux = (name === 'repassword') ? values['newpassword'] || '' : '';
        validResult = validate (name, value, aux);
        inputList = (name === 'password' || name === 'repassword' || name === 'newpassword') ? 'passwordInputList' : 'inputList';
        store.set(`${storeLocation}.${inputList}.${name}`, { editableValue: value, validLabel: validResult});
        ifProblem ||= !!validResult;
    });

    if (ifProblem) {
        return
    }

    if (inputList === 'inputList') {
        const state: PlainObject = store.getState(`${storeLocation}.${inputList}`);
        const requestBody: Record<string, string> = {};

        inputNameList.forEach(item => {requestBody[item] = state[item].editableValue})

        userApi.change(requestBody).then((res) => {
            if (res.status === 200) {
                store.set(`notification`, { content: 'Данные изменены'});
                mediator.emit('check-user', true);
                store.set(`${storeLocation}`, { editing:false, changingPassword:false });
                return
            }
        })
    }

    if (inputList === 'passwordInputList') {
        const state: PlainObject = store.getState(`${storeLocation}.${inputList}`);
        const requestBody: Record<string, string>=
            {
                "oldPassword":      state.password.editableValue,
                "newPassword":      state.newpassword.editableValue,
            }

        userApi.changePassword(requestBody).then((res) => {
            if (res.status === 200) {
                store.set(`notification`, { content: 'Пароль изменен'});
                Object.keys(store.getState(`${storeLocation}.${inputList}`)).forEach((key) => {
                    store.set(`${storeLocation}.${inputList}.${key}`, {validLabel: '', editableValue: '', value: '', editing: false});
                });
                store.set(`${storeLocation}`, { editing:false, changingPassword:false });
            }
        })
    }
})

mediator.on('profile-input-blur', (name: string, value: string) => {
    let validResult = validate (name, value, value);
    let inputList = (name === 'password' || name === 'repassword' || name === 'newpassword') ? 'passwordInputList' : 'inputList';
    store.set(`profilePage.${inputList}.${name}`, { editableValue: value, validLabel: validResult});
})

mediator.on('profile-avatar-submit', (formData: FormData) => {
    userApi.changeAvatar(formData).then((res) => {
        if (res.status === 200) {
            store.set(`user`, {...res.response});
        }
    })
})

mediator.on('profile-cancel-editing', () => {
    Object.entries(store.getState('profilePage.inputList')).forEach(([key, item]) => {
        let oldValue = (typeof item === "object" && item) ? (item as Record<string, string>).value : '';
        store.set(`profilePage.inputList.${key}`, {validLabel: '', editableValue: oldValue});
    })
    Object.entries(store.getState('profilePage.passwordInputList')).forEach(([key, item]) => {
        let oldValue = (typeof item === "object" && item) ? (item as Record<string, string>).value : '';
        store.set(`profilePage.passwordInputList.${key}`, {validLabel: '', editableValue: oldValue});
    })
});

store.on(`${StoreEvents.Updated}-user`, (user) => {
    inputNameList.forEach((item) => {
        store.set(`${storeLocation}.inputList.${item}`, {validLabel: '', editableValue: user[item], value: user[item], editing: false});
    });
    store.set(`${storeLocation}.avatarSetting`, {
        first_name: user.first_name,
        display_name: user.display_name,
        avatar_file: `${AVATAR_URL}${user.avatar}`,
    });
});

