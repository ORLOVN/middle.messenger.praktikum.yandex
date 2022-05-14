import Route    from "./Route";
import Block    from "./Block";
import auth     from "../modules/auth";

export class Router {
  private readonly routes:        Route[];
  private readonly history:       History;
  private          _currentRoute: Route | undefined;
  private readonly _rootQuery:    string;
  private static   __instance:    Router;

  constructor(rootQuery: string = '.app') {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes         = [];
    this.history        = window.history;
    this._currentRoute  = undefined;
    this._rootQuery     = rootQuery;

    Router.__instance = this;
    Object.assign(window, {router :this});
  }

  currentPath(): string{
    if (this._currentRoute) {
      return this._currentRoute.getPathname();
    }
    return '';
  }
  use(pathname: string, block: typeof Block) {
    const route = new Route(pathname, block, {rootQuery: this._rootQuery});
    this.routes.push(route);
    return this
  }

  start() {
    // Реагируем на изменения в адресной строке и вызываем перерисовку
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    }

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    if (route) {
      this._currentRoute = route;
    } else {
      this._currentRoute = this.getRoute('/404')
    }

    this._currentRoute!.render();

    auth.checkUser();
  }

  go(pathname: string) {
    if (!this._currentRoute || this._currentRoute.getPathname() !== pathname) {
      this.history.pushState({}, "", pathname);
      this._onRoute(pathname);
    }
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find(route => route.match(pathname));
  }
}

export default new Router();
/*
// Необходимо оставить в силу особенностей тренажёра
history.pushState({}, '', '/');

const router = new Router(".app");

// Можно обновиться на /user и получить сразу пользователя
router
  .use("/", Chats)
  .use("/users", Users)
  .start();

// Через секунду контент изменится сам, достаточно дёрнуть переход
setTimeout(() => {
  router.go("/users");
}, 1000);

// А можно и назад
setTimeout(() => {
  router.back();
}, 3000);

// И снова вперёд
setTimeout(() => {
  router.forward();
}, 5000);

function getData() {
  return new Promise(resolve => {
    setTimeout(() => resolve(42), 1000)
  })
}

const memoized = memoize(getData, 1000);

memoized()
  .then(data1 => console.log(data1)) // получаем долго
  .then(memoized)
  .then(data2 => console.log(data2)) // получаем быстро, из кеша
  .then(memoized)
  .then(data3 => console.log(data3)) // получаем быстро, из кеша
  .then(() => {
    setTimeout(() => {
      return memoized().then(data4 => console.log(data4)); // получаем долго, считается заново
    }, 5000);
  });

memoize(func, period) {
  let cache;
  let lastTime;
  return () => {
    if (!cache) {
      lastTime = Date.now();
      console.log(lastTime);
      cache = func();
      return func();
    };

    if (Date.now()-lastTime < period) {
      lastTime = Date.now();
      return cache;
    } else {
      lastTime = Date.now();
      cache = func();
      return func();
    }

  }
}
*/
