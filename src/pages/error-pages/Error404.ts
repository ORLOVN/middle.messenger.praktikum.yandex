import ErrorPage from './ErrorPage';

export default class Error404 extends ErrorPage {
    constructor() {
        super({
            code: '404',
            text: 'Вы куда-то не туда зашли'
        });
    }
}
