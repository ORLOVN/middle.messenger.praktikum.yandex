import HTTP from "../utils/HTTP";
import {BaseAPI} from "./base-api";


const chatAPIInstance  = new HTTP('https://ya-praktikum.tech/api/v2/auth/');


export class AuthApi extends BaseAPI {
    create(requestBody: Record<string, string>) {
        return chatAPIInstance.post('/signup', {data: JSON.stringify(requestBody)})
    }
    createSession(requestBody: Record<string, string>) {
        return chatAPIInstance.post('/signin', {data: JSON.stringify(requestBody)})
    }
    request() {
        return chatAPIInstance.get('/user', {});
    }
    delete() {
        return chatAPIInstance.post('/logout', {})
    }
}

export default new AuthApi();
