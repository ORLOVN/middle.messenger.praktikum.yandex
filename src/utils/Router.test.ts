import { expect } from "chai";
import router from "./Router";
import Signup from '../pages/signup';
import Error404 from '../pages/error-pages/Error404';

describe("router test", () => {
    it('Переход на новую страницу должен менять состояние сущности history', () => {
        router
            .use('/sign-up',    Signup)
            .use('/404',        Error404)
            .start();
        router.go('/sign-up');
        router.go('/404');

        expect(window.history.length).to.eq(3);
    });
});
