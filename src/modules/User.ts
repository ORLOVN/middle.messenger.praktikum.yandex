import Chat from "./chats/Chat";
import store from "../utils/Store";
import router from "../utils/Router";
import authAPI from "../api/auth-api";
import {storeAddresses} from "../utils/globalVariables";


type UserData = {
    avatar:      string;
    avatar_file: string;
    display_name:string;
    email:       string;
    first_name:  string;
    id:          number;
    login:       string;
    phone:       string;
    second_name: string;
}

class Users {
    private userData: UserData | null;
    private static __instance: User;

    constructor() {
        if (User.__instance) {
            return User.__instance;
        }

        User.__instance = this;

        Object.assign(window, {user: this});
    }

    getUserData(id: number = -1) {
        if (id === -2) {
            return store.getState(storeAddresses.User)
        } else {
            return store.getState(storeAddresses.Users)
        }

    }

    async checkUser(force: boolean = false, resolve = ({})=>{}) {

    if (this.userData && this.userData.id && !force) {
        if (router.currentPath() === '/' || router.currentPath() === '/sign-up') {
            router.go('/messenger')
        }
        resolve(this.userData);

    } else {
        const res = await authAPI.request()
        if (res.status === 200) {
            this.userData = res.response

        if (router.currentPath() === '/' || router.currentPath() === '/sign-up') {
            router.go('/messenger')
        }

        resolve(res.response);
    }
    if (res.status === 401) {
        if (router.currentPath() !== '/' && router.currentPath() !== '/sign-up') {
            router.go('/');
        }
    }

}
}

}
