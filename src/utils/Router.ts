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
