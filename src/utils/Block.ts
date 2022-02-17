import EventBus from './EventBus';
import {Nullable, Values} from './types';
import { v4 as uuid} from 'uuid';
import {TemplateCompile} from "./tmplfuncs";

interface BlockMeta<P = any> {
    props: P;
}

type Events = Values<typeof Block.EVENTS>

export default class Block<P = any> {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render"
    } as const;

    public id = uuid();
    protected _element: Nullable<HTMLElement> = null;
    protected readonly props: P;
    private readonly _meta: BlockMeta;
    protected children: Record<string, Block> = {};
    protected childrenLists: Record<string,{
        id: string,
        list: Array<Block>,
    }>;
    eventBus: () => EventBus<Events>;

    /** JSDoc
     * @param {Object} propsAndChildren
     *
     * @returns {void}
     */
    constructor(propsAndChildren?:P) {
        const { children, childrenLists, props } = this._getChildren(propsAndChildren);
        this.children = children;
        this.childrenLists = childrenLists;
        const eventBus = new EventBus<Events>();
        this._meta  = {
            props
        };

        this.props = this._makePropsProxy(props || {} as P);

        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT, this.props);
    }

    _getChildren(propsAndChildren:P) {
        const children = {};
        const childrenLists = {};
        const props = {} as P;

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if ((value) && (value.list) && (value.list[0] instanceof Block)) {
                value.id = uuid();
                childrenLists[key] = value;
            }
            else {
                props[key] = value;
            }
        });

        return { children, childrenLists, props };
    }

    _registerEvents(eventBus: EventBus<Events>) {
        eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    _createResources() {
        //nothing


    }

    _init() {
        this._createResources();
        //this._element = this._compile(this.render());
        this.init(this._meta.props);
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init(props:P) {

    }
    _componentDidMount(props: P) {

        Object.values(this.children).forEach(child => {
            child.dispatchComponentDidMount();
        });
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        this.componentDidMount(props);
    }

    // Может переопределять пользователь, необязательно трогать
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidMount(oldProps: P) {}

    dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    _componentDidUpdate(oldProps: P, newProps: P) {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (!response) {
            return;
        }
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    // Может переопределять пользователь, необязательно трогать
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidUpdate(oldProps: P, newProps: P): boolean {
        return true;
    }

    setProps = (nextProps: P) => {
        if (!nextProps) {
            return;
        }
        const oldProps = {};
        Object.assign(oldProps, this._meta.props);
        Object.assign(this._meta.props, nextProps);
        //(this._meta.props.name === 'login') && console.log(this._meta.props);
        this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, this._meta.props);
    };

    get element():Nullable<HTMLElement | DocumentFragment> {
        return this._element;
    }

    _render() {

        const element = this._compile(this.render()); // корневой HTMLElement, который возвращает шаблон

        this._removeEvents();

        // если this._element еще не назначен — значит это первый рендер
        if (!this._element) {
            this._element = element;
            this._getAttrOfTaggedStubs();
        } else {
            // с помощью метода replaceWith заменяем элемент в DOM
            this._element.replaceWith(element);

            // не забываем сохранить новый корень
            this._element = element;
        }

        this._addEvents();

    }

    // Может переопределять пользователь, необязательно трогать
    render(): string {
        return null;
    }

    getContent(): HTMLElement | Element {

        return this._element;

    }

    _makePropsProxy(props:P):P {
        // Можно и так передать this
        // Такой способ больше не применяется с приходом ES6+
        const self = this;


        return new Proxy(props as unknown as object, {
            get(target: Record<string, unknown>, prop:string) {
                const value = target[prop];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set(target: Record<string, unknown>, prop:string, value: unknown) {
                const oldProps = {};
                Object.assign(oldProps, target);
                target[prop] = value;
                self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
                return true;
            },

            deleteProperty () {
                /*if (prop in target) {
                    if (prop.indexOf('_') === 0) {
                        throw new Error('нет доступа');
                    }
                    delete target[prop];
                }*/
                throw new Error('нет доступа');
            }
        }) as unknown as P;
    }

    _createDocumentElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
    }

    _addEvents() {
        const events: Record<string, () => void> = (this.props as any).events;


        if (!events) {
            return;
        }
        const selector = (this.props as any).eventsSelector;

        let eventElement = selector ? (this._element!.querySelector(selector) || this._element) : this._element;



        Object.entries(events).forEach(([event,listener]) => {
            eventElement.addEventListener(event, listener);
        });
    }

    _removeEvents() {
        const events: Record<string, () => void> = (this.props as any).events;

        if (!events || !this._element) {
            return;
        }

        const selector = (this.props as any).eventsSelector;
        let eventElement = selector ? (this._element!.querySelector(selector) || this._element) : this._element;

        Object.entries(events).forEach(([event,listener]) => {
            eventElement.removeEventListener(event, listener);
        });
    }

    show() {
        this._element.style.display = "block";
    }

    hide() {
        this._element.style.display = "none";
    }

    _compile(tmpl: string) {
        const propsAndStubs = { ...this.props };

        Object.entries(this.children).forEach(([key, child]) => {
            propsAndStubs[key] = `<div data-id="${child.id}"></div>`
        });

        Object.entries(this.childrenLists).forEach(([key, list]) => {
            propsAndStubs[key] = `<div data-id="${list.id}"></div>`
        });

        const fragment = this._createDocumentElement('template');

        fragment.innerHTML = TemplateCompile(tmpl, propsAndStubs);


        Object.values(this.children).forEach((child) => {
            // @ts-ignore
            const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);
            if (stub) {
                stub.replaceWith(child.getContent());
            }
        });

        Object.values(this.childrenLists).forEach((list) => {
            // @ts-ignore
            const stub = fragment.content.querySelector(`[data-id="${list.id}"]`);

            if (stub) {
                const listFragment = this._createDocumentElement('template');

                Object.values(list.list).forEach((child) => {
                    // @ts-ignore
                    listFragment.content.appendChild(child.getContent());

                });
                // @ts-ignore
                stub.replaceWith(listFragment.content);
            }

        });
        // @ts-ignore
        return fragment.content.children[0];
    }

    _getAttrOfTaggedStubs() {
        Object.entries(this.children).forEach(([key ,child]) => {

            const componentTag = this._element.querySelector(key);

            if (componentTag) {
                const attrs = componentTag.attributes;
                const newProps: P = {} as P;
                for (let i = 0, length = attrs.length; i < length; i++) {
                    newProps[attrs[i].name] = attrs[i].value;
                }
                newProps['content'] = componentTag.innerHTML;

                child.setProps(newProps);
            }
        });
    };

    _replaceTaggedStubs() {
        Object.entries(this.children).forEach(([key ,child]) => {
            // здесь происходит замена тагов которые имеют имена компонентов
            const componentTag = this._element.querySelector(key);
            if (componentTag) {
                componentTag.replaceWith(child.getContent())
            }
        });
    };

}
