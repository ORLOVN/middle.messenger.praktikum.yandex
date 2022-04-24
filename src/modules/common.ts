import store from "../utils/Store";

class Com {
    private static __instance: Com;


    constructor() {
        if (Com.__instance) {
            return Com.__instance;
        }

        Com.__instance = this;
        Object.assign(window, {auth: this});
    }


    notify(notification: string) {
    store.set('notification',{content: notification});
    }

}

export default new Com();
