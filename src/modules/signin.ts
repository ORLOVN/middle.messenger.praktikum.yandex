import Mediator from '../utils/Mediator';
import {validate} from "../utils/validtools";
import {HTTPTransport, METHOD} from "../utils/HTTPTransport";

const xhr = new HTTPTransport();

const mediator = Mediator.getInstance();

mediator.on('signin-POST', (values: Record<string, string>) => {
    let validResults: Record<string, string> ={};
    let ifProblem = false;
    Object.entries(values).forEach(([name,value]) => {
        validResults[name] = validate (name, value);
        ifProblem ||= !!validResults[name];
    });

    mediator.emit('signin-GET', values, validResults);

    if (ifProblem) {
        return
    }

    console.log(values);
    xhr.request('/data-receiver', {method:METHOD.POST, data: JSON.stringify(values)}).then((res) => {
        console.log(res.status)
        }).catch( (res) => console.log(res.status));
})

mediator.on('signin-input-blur', (name: string, value: string) => {
    let validResult = validate (name, value, value);
    mediator.emit('signin-input-validated', name, value, validResult);
})
