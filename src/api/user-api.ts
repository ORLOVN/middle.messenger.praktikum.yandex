import HTTP from "../utils/HTTP";
import {BaseAPI} from "./base-api";


const chatAPIInstance  = new HTTP('https://ya-praktikum.tech/api/v2/user/');


export class UserApi extends BaseAPI {
    change(requestBody: Record<string, string>) {
        return chatAPIInstance.put('/profile', {data: JSON.stringify(requestBody)})
    }
    changeAvatar(requestBody: Record<string, string>) {
        return chatAPIInstance.put('/profile/avatar', {data: JSON.stringify(requestBody)})
    }
    changePassword(requestBody: Record<string, string>) {
        return chatAPIInstance.put('/profile/password', {data: JSON.stringify(requestBody)})
    }
    request(id: number) {
        return chatAPIInstance.get(`/${id}`, {});
    }
    search(requestBody: Record<string, string>) {
        return chatAPIInstance.post('/search', {data: JSON.stringify(requestBody)})
    }
}

export default new UserApi();
