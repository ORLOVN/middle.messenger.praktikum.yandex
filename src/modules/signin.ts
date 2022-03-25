import mediator from '../utils/Mediator';
import {validate} from "../utils/validtools";
import store from '../utils/Store';
import authAPI from "../api/auth-api";
import router from "../utils/Router";
import {PlainObject} from "../utils/types";

const storeLocation = 'signinPage.inputList';

mediator.on('signin-submit', (values: Record<string, string>) => {
    let validResult = '';
    let ifProblem = false;

    Object.entries(values).forEach(([name,value]) => {
        validResult = validate (name, value);
        store.set(`${storeLocation}.${name}`, { value: value, validLabel: validResult});
        ifProblem ||= !!validResult;
    });


    if (ifProblem) {
        return
    }

    const state: PlainObject = store.getState(storeLocation);

    authAPI.createSession({
        "login":    state.login.value,
        "password": state.password.value
    }).then((res) => {
        if (res.status === 200) {
            mediator.emit('check-user')
        }
        if (res.status === 400) {
            mediator.emit('check-user');
        }
        if (res.status === 401) {
            Object.entries(values).forEach(([name, value]) => {
                store.set(`${storeLocation}.${name}`, {
                    value: value,
                    validLabel: 'Неправильные имя пользователя или пароль'
                });
            });
        }
    })
})

mediator.on('signout', () => {
    authAPI.delete().then((res) => {

        if (res.status === 200) {
             store.replace('user', {});
             router.go('/');
        }
    })
})

mediator.on('signin-input-blur', (name: string, value: string) => {
    let validResult = validate (name, value, value);
    store.set(`signinPage.inputList.${name}`, { value: value, validLabel: validResult});
})

mediator.on('check-user', (force: boolean = false) => {
    const user = store.getState('user');
    if (user && user.id && !force) {
        if (router.currentPath() === '/' || router.currentPath() === '/sign-up') {
            router.go('/messenger')
        }
    } else {
        authAPI.request().then((res) => {
            if (res.status === 200) {
                store.set('user', res.response);

                if (router.currentPath() === '/' || router.currentPath() === '/sign-up') {
                    router.go('/messenger')
                }
            }
            if (res.status === 401) {
                if (router.currentPath() !== '/' && router.currentPath() !== '/sign-up') {
                    router.go('/');
                }
            }
        })
    }
})
