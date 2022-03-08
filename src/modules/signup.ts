import mediator from '../utils/Mediator';
import {validate} from "../utils/validtools";
import store from '../utils/Store';
import {PlainObject} from '../utils/types';
import authAPI from "../api/auth-api";
import router from "../utils/Router";

const storeLocation = 'signupPage.inputList';

console.log('events registered');
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
    const createSession = () => {
        authAPI.createSession({
            "login": state.login.value,
            "password": state.newpassword.value
        }).then((res) => {
            let response = JSON.parse(res.response);
            if (response.status === 200) {
                router.go('/');
            } else if (response.status === 400) {
                store.set('signupPage.popupNote', {content: response.reason});
            } else if (response.status === 401) {
                store.set('signupPage.popupNote',{content: 'Status 401: Unauthorized'});
            } else if (response.status === 500) {
                store.set('signupPage.popupNote',{content: 'Status 500: Unexpected error'});
            }
        }).catch( (res) => {
            store.set('signupPage.popupNote',{content: 'xhr request failed'});
            console.log(res)
        });
     }

    authAPI.create(requestBody).then((res) => {
            let response = JSON.parse(res.response);
            if (response.status === 200) {
                createSession();
            } else if (response.status === 400) {
                store.set('signupPage.popupNote', {content: response.reason});
            } else if (response.status === 401) {
                store.set('signupPage.popupNote',{content: 'Status 401: Unauthorized'});
            } else if (response.status === 500) {
                store.set('signupPage.popupNote',{content: 'Status 500: Unexpected error'});
            }
        }).catch( (res) => {
            store.set('signupPage.popupNote',{content: 'xhr request failed'});
            console.log(res)
        });


})

mediator.on('signup-input-blur', (name: string, value: string) => {
    let validResult = validate (name, value, value);
    store.set(`${storeLocation}.${name}`, { value: value, validLabel: validResult});
})
