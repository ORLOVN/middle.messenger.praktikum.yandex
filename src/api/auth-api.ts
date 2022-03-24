import HTTP from "../utils/HTTP";
import {BaseAPI, handleResponse} from "./base-api";


const http  = new HTTP('https://ya-praktikum.tech/api/v2/auth');


export class AuthApi extends BaseAPI {
    createSession(requestBody: Record<string, string>) {
        return handleResponse(http.post('/signin', {data: JSON.stringify(requestBody)}), 200, 400, 401);
    }
    createUser(requestBody: Record<string, string>) {
        return handleResponse(http.post('/signup', {data: JSON.stringify(requestBody)}), 200, 400);
    }
    request() {
        return handleResponse(http.get('/user', {}),200, 401);
    }
    delete() {
        return handleResponse(http.post('/logout', {}), 200)
    }
}

export default new AuthApi();
