import HTTP from "../utils/HTTP";
import {handleResponse} from "./handleResponse";

const http  = new HTTP('https://ya-praktikum.tech/api/v2/user');


export class UserApi {
    change(requestBody: Record<string, string>) {
        return handleResponse(http.put('/profile', {data: JSON.stringify(requestBody)}),200);
    }
    changeAvatar(formData: FormData) {
        return handleResponse(http.put('/profile/avatar', {data: formData}), 200);
    }
    changePassword(requestBody: Record<string, string>) {
        return handleResponse(http.put('/password', {data: JSON.stringify(requestBody)}), 200);
    }
    request(id: number) {
        return handleResponse(http.get(`/${id}`, {}), 200);
    }
    search(login: string = '') {
        return handleResponse(http.post('/search', {data: JSON.stringify({login: login})}),200);
    }
}

export default new UserApi();
