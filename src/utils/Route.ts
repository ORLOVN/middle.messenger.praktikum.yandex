import Block from "./Block";
import {render} from "./blockTools";

type Props = Record<string, any>;

export default class Route {
    private _pathname: string;
    private readonly _blockClass: typeof Block;
    private _block: Block | null;
    private readonly _props: Props;
    constructor(pathname: string, view: typeof Block, props: Props) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }
    getPathname(): string {
        return this._pathname;
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            this._block.hide();
        }
    }

    match(pathname: string) {
        return isEqual(pathname, this._pathname);
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass();
            render(this._props.rootQuery, this._block);
            return;
        }

        this._block.show();
    }
}

function isEqual(lhs: any, rhs: any) {
    return lhs === rhs;
}
