import Block from './Block'
export type Nullable<T> = T | null;

export type Keys<T extends Record<string, unknown>> = keyof T;
export type Values<T extends Record<string, unknown>> = T [Keys<T>];


export type PlainObject<T = any> = {
    [k in string]: T;
};

export type ChildrenList = {
    id: string;
    name: string;
    list: Array<Block>;
    BlockClass: typeof Block;
    commonProps:Record<string, PlainObject>;
    nameList: Record<string, number>;
};



export function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray(value: unknown): value is [] {
    return Array.isArray(value);
}

export function isArrayOrObject(value: unknown): value is [] | PlainObject {
    return isPlainObject(value) || isArray(value);
}
