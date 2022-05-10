import store from "../utils/Store";

// Функция выполняет первичную обработку HTTP ответов бэкенда
// request это резолвенный промис запроса
// codesToGo коды HTTP ответа, для которых ответ пойдет дальше в модель. Например при вводе неправильного пароля придет
// ответ с кодом 400, который необходимо пропустить дальше, чтобы view отобразил информацию о неправильном пароле
export function handleResponse(request: Promise<XMLHttpRequest>, ...codesToGo: number[]) {
    return request.then((res: XMLHttpRequest) => {
        if (codesToGo.find(code => code === res.status)) {
            try {
                const response = JSON.parse(res.response);
                return {status: res.status, response: response}
            } catch (e) {
                // это ветка для случая когда в res.response содержится "OK" вместо JSON
                return {status: res.status, response: res.response }
            }

        }

        // в случае когда кода нет среди указанных, отображаем уведомление об ошибке в общем формате.
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
