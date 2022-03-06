import mediator from '../utils/Mediator';
import {validate} from "../utils/validtools";
import HTTP, {METHOD} from "../utils/HTTP";
import store from '../utils/Store';

const xhr = new HTTP();

console.log('events registered');
mediator.on('signup-submit', (values: Record<string, string>) => {
    let validResult = '';
    let ifProblem = false;
    Object.entries(values).forEach(([name,value]) => {
        let aux = (name === 'repassword') ? values['newpassword'] || '' : '';
        validResult = validate (name, value, aux);
        store.set(`signupPage.inputList.${name}`, { value: value, validLabel: validResult});
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

mediator.on('signup-input-blur', (name: string, value: string) => {
    let validResult = validate (name, value, value);
    store.set(`signupPage.inputList.${name}`, { value: value, validLabel: validResult});
})
