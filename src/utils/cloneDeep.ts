import {PlainObject, isPlainObject, isArray} from './types';


function cloneDeep(obj: PlainObject): PlainObject {

    if (isArray(obj)) {

        const result: PlainObject[] = [];

        obj.forEach((value => {
            result.push(cloneDeep(value));
        }));
        return result;
    }

    if (isPlainObject(obj)) {

        const result: PlainObject = {};

        Object.entries(obj).forEach(([key, value]) => {
            result[key] = cloneDeep(value);
        });
        return result;
    }

    return obj;
    // Код здесь
}

export default cloneDeep;
