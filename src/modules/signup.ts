import mediator from '../utils/Mediator';
import {validate} from "../utils/validtools";
import store from '../utils/Store';
import {PlainObject} from '../utils/types';
import authAPI from "../api/auth-api";

const storeLocation = 'signupPage.inputList';

mediator.on('signup-submit', (values: Record<string, string>) => {
    let validResult = '';
    let ifProblem = false;
    Object.entries(values).forEach(([name,value]) => {
        let aux = (name === 'repassword') ? values['newpassword'] || '' : '';
        validResult = validate (name, value, aux);
        store.set(`${storeLocation}.${name}`, { value: value, validLabel: validResult});
        ifProblem ||= !!validResult;
    });

    if (ifProblem) {
        return
    }

    const state: PlainObject = store.getState(storeLocation);
    const requestBody: Record<string, string>=
    {
        "first_name":    state.first_name.value,
        "second_name":   state.second_name.value,
        "login":         state.login.value,
        "email":         state.email.value,
        "password":      state.newpassword.value,
        "phone":         state.phone.value
    }

    authAPI.createUser(requestBody).then((res) => {
            if (res.status === 200) {
                mediator.emit('check-user');
            }
            if (res.status === 400) {
                store.set(`${storeLocation}.login`, {validLabel: 'Такой пользователь уже существует'});
            }
        })


})

mediator.on('signup-input-blur', (name: string, value: string) => {
    let validResult = validate (name, value, value);
    store.set(`${storeLocation}.${name}`, { value: value, validLabel: validResult});
})

mediator.on('signup-initiated', () => {
    mediator.emit('check-user');
})
