import store from "../utils/Store";

export class BaseAPI {
    // На случай, если забудете переопределить метод и используете его, — выстрелит ошибка
    create({}) { throw new Error('Not implemented'); }

    request({}) { throw new Error('Not implemented'); }

    update() { throw new Error('Not implemented'); }

    delete() { throw new Error('Not implemented'); }
}

export function handleResponse(request: Promise<XMLHttpRequest>, ...codes: number[]) {
    return request.then((res: XMLHttpRequest) => {
        if (codes.find(code => code === res.status)) {
            try {
                const response = JSON.parse(res.response);
                return {status: res.status, response: response}
            } catch (e) {
                return {status: res.status, response: res.response }
            }

        }

        try {
            const response = JSON.parse(res.response);
            throw Error(`Status ${res.status}: ${response.reason}`);
        } catch (e) {
            throw Error(`Status ${res.status}: ${res.response}`);
        }
    }).catch((error) => {
        store.set('notification',{content: error});
        throw error;
    })
}
