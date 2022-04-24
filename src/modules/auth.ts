import {validate}       from "../utils/validtools";
import store            from "../utils/Store";
import {PlainObject}    from "../utils/types";
import authAPI          from "../api/auth-api";
import router           from "../utils/Router";
import mediator from "../utils/Mediator";

const storeLocation = 'signupPage.inputList';
const signinPageInputs = 'signinPage.inputList';

class Auth {
    private static __instance: Auth;


    constructor() {
        if (Auth.__instance) {
            return Auth.__instance;
        }

        Auth.__instance = this;
        Object.assign(window, {auth: this});
    }


    async signinSubmit(values: Record<string, string>) {
        let validResult = '';
        let ifProblem = false;

        Object.entries(values).forEach(([name, value]) => {
            validResult = validate(name, value);
            store.set(`${signinPageInputs}.${name}`, {value: value, validLabel: validResult});
            ifProblem ||= !!validResult;
        });


        if (ifProblem) {
            return
        }

        const state: PlainObject = store.getState(signinPageInputs);

        const res = await authAPI.createSession({
            "login": state.login.value,
            "password": state.password.value
        })
        if (res.status === 200) {
            await this.checkUser();
        }
        if (res.status === 400) {
            await this.checkUser();
        }
        if (res.status === 401) {
            Object.entries(values).forEach(([name, value]) => {
                store.set(`${signinPageInputs}.${name}`, {
                    value: value,
                    validLabel: 'Неправильные имя пользователя или пароль'
                });
            });
        }
    }

    async signOut() {
        const res = await authAPI.delete()
        if(res.status === 200) {
            store.replace('user', {});
            router.go('/');
        }
    }


    signinInputBlur(name: string, value: string) {
        let validResult = validate(name, value, value);
        store.set(`signinPage.inputList.${name}`, {value: value, validLabel: validResult});
    }

    async checkUser(force: boolean = false) {
        const user = store.getState('user');
        if (user && user.id && !force) {
            if (router.currentPath() === '/' || router.currentPath() === '/sign-up') {
                router.go('/messenger')
            }
        } else {
            const res = await authAPI.request()
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
        }
    }

    async signupSubmit(values: Record<string, string>) {
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

        const requestBody: Record<string, string>= {
            first_name:    state.first_name.value,
            second_name:   state.second_name.value,
            login:         state.login.value,
            email:         state.email.value,
            password:      state.newpassword.value,
            phone:         state.phone.value
        }

        const res = await authAPI.createUser(requestBody)
        if (res.status === 200) {
            mediator.emit('check-user');
        }
        if (res.status === 400) {
            store.set(`${storeLocation}.login`, {validLabel: 'Такой пользователь уже существует'});
        }
    }

    signupInputBlur(name: string, value: string) {
        let validResult = validate (name, value, value);
        store.set(`${storeLocation}.${name}`, { value: value, validLabel: validResult});
    }

    signupInitiated(){
        mediator.emit('check-user');
    }
}

export default new Auth();
