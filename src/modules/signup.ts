import Mediator from '../utils/Mediator';
import {validate} from "../utils/validtools";

const mediator = Mediator.getInstance();

mediator.on('signup-PUT', (values: Record<string, string>) => {
    let validResults = {};
    let ifProblem = false;
    Object.entries(values).forEach(([name,value]) => {
        let aux = (name === 'repassword') ? values['newpassword'] || '' : '';
        validResults[name] = validate (name, value, aux);
        ifProblem ||= !!validResults[name];
    });

    mediator.emit('signup-GET', values, validResults);

    if (ifProblem) {
        return
    }

    console.log(values);

})

mediator.on('signup-input-blur', (name: string, value: string) => {
    let validResult = validate (name, value, value);
        mediator.emit('signup-input-validated', name, value, validResult);
})
