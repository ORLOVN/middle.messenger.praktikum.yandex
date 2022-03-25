import EventBus from './EventBus';
import {PlainObject} from './types';
import set from './set';
import find from './find';

export enum StoreEvents {
    Updated = 'updated',
}

export class Store extends EventBus{
    private static instance: Store;
    private readonly state: PlainObject;

    constructor() {
        if (Store.instance) {
            return Store.instance
        }

        super();
        this.state = {};
        Object.assign(window, {store :this});
    }

    public static getInstance():Store {

        if (!Store.instance) {
            Store.instance = new Store();
        }

        return Store.instance;
    }

    public getState(path: string = '') {
        return find(this.state, path);
    }


    public set(path: string, value: unknown, mute = false) {
        set(this.state, path, value);
        if (!mute) {
            try {
                this.emit(`${StoreEvents.Updated}-${path}`, value);
            } catch (e) {

            }
        }
    };

    public replace(path: string, value: unknown, mute = false) {
        const storeObject = find(this.state, path);
        Object.keys(storeObject).forEach(key => delete storeObject[key]);
        Object.assign(storeObject, value)
        if (!mute) {
            this.emit(`${StoreEvents.Updated}-${path}`, value);
        }
    };
}

export default Store.getInstance();
