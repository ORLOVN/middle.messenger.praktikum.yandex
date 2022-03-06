import mediator from '../utils/Mediator';
import {validate} from "../utils/validtools";
import HTTP, {METHOD} from "../utils/HTTP";
import store from '../utils/Store';

const xhr = new HTTP();

mediator.on('profile-submit', (values: Record<string, string>) => {
    let validResult = '';
    let ifProblem = false;
    Object.entries(values).forEach(([name,value]) => {
        let aux = (name === 'repassword') ? values['newpassword'] || '' : '';
        validResult = validate (name, value, aux);
        let inputList = (name === 'password' || name === 'repassword') ? 'passwordInputList' : 'inputList';
        store.set(`signupPage.${inputList}.${name}`, { value: value, validLabel: validResult});
        ifProblem ||= !!validResult;
    });

    if (ifProblem) {
        return
    }

    console.log(values);
    xhr.request('/data-receiver', {method:METHOD.POST, data: JSON.stringify(values)}).then((res) => {
        console.log(res.status)
    }).catch( (res) => console.log(res.status));
})

mediator.on('profile-input-blur', (name: string, value: string) => {
    let validResult = validate (name, value, value);
    let inputList = (name === 'password' || name === 'repassword') ? 'passwordInputList' : 'inputList';
    store.set(`profilePage.${inputList}.${name}`, { value: value, validLabel: validResult});
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
