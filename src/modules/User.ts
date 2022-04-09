import Chat from "./chats/Chat";
import store from "../utils/Store";
import router from "../utils/Router";
import authAPI from "../api/auth-api";

type stringNullable = string | null;
type UserData = {
    avatar:         stringNullable,
    display_name:   stringNullable,
    email:          stringNullable,
    first_name:     stringNullable,
    id:             number,
    login:          stringNullable,
    phone:          stringNullable,
    second_name:    stringNullable,
}

class User {
    private userData: UserData | null;
    private static __instance: User;

    constructor() {
        if (User.__instance) {
            return User.__instance;
        }

        User.__instance = this;

        Object.assign(window, {user: this});
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
