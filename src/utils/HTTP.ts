
export enum METHOD {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

type Options = {
    method: METHOD;
    data?: any;
};

// Тип Omit принимает два аргумента: первый — тип, второй — строка
// и удаляет из первого типа ключ, переданный вторым аргументом
type OptionsWithoutMethod = Omit<Options, 'method'>;
// Этот тип эквивалентен следующему:
// type OptionsWithoutMethod = { data?: any };

export default class HTTP {
    static METHOD = METHOD;
    private readonly _url: string;

    constructor(url: string = '') {
        this._url = url;
    }

    delete(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
        return this.request(url, {...options, method: METHOD.DELETE});
    };

    get(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
        return this.request(url, {...options, method: METHOD.GET});
    };

    post(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
        return this.request(url, {...options, method: METHOD.POST});
    };

    put(url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> {
        let contentType = 'application/json';
        if (options.data instanceof FormData) {
            contentType = '';
        }
        return this.request(url, {...options, method: METHOD.PUT}, contentType);
    };

    request(url: string, options: Options = { method: METHOD.GET }, contentType: string = 'application/json'): Promise<XMLHttpRequest> {
        const {method, data} = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, this._url+url);

            xhr.onload = function() {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            xhr.setRequestHeader('Accept', 'application/json');
            if (contentType) {
                xhr.setRequestHeader('Content-Type', contentType);
            }
            xhr.withCredentials = true;

            if (method === METHOD.GET || !data) {
                xhr.send();
            } else {
                xhr.send(data);
            }
        });
    };
}
