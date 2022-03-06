import merge from "./merge";

type Indexed<T = unknown> = {
    [key in string]: T;
};

function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {

    if (typeof path !== 'string') {
        throw 'path must be string'
    }
    if (typeof object !== 'object') {
        return object;
    }
    const arr = path.split('.');
    const finalObj = arr.reduceRight((obj, key, index) => {
        let k: Indexed = {};
        if (index < arr.length-1) {
            k[key] = obj;
        } else {
            k[key] = value;
        }
        return k;

    }, {});
    return merge(object as Indexed, finalObj as Indexed);
}
set({ foo: 5 }, 'bar.baz', 10); // { foo: 5, bar: { baz: 10 } }
export default set
