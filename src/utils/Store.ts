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
            this.emit(`${StoreEvents.Updated}-${path}`);
        }
    };
}

export default Store.getInstance();
