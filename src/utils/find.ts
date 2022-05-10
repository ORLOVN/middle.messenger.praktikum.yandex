
type Indexed<T = unknown> = {
    [key in string]: T;
};

function find(object: Indexed | unknown, path: string): Indexed | never {
    // Код
    if (typeof path !== 'string') {
        throw 'Second argument of find() must be a string'
    }
    if (typeof object !== 'object') {
        throw 'Second argument of find() must be an object'
    }
    const arr = path.split('.');
    return arr.reduce((obj, key) => {
        if (obj && (key in obj)) {
            return (obj as Indexed)[key]
        }

    }, object) as Indexed;
}

export default find
