import EventBus from './EventBus';
import {Nullable, Values} from './types';
// @ts-ignore
import { v4 as uuid} from 'uuid';
import {TemplateCompile} from "./tmplfuncs";
import cloneDeep from "./cloneDeep";

import {ChildrenList} from './types';

interface BlockMeta<P = any> {
    props: P;
}

type Events = Values<typeof Block.EVENTS>
type P = Record<string, unknown>;

export default class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render"
    } as const;

    public              id =           uuid();
    protected           _element:      Nullable<HTMLElement> = null;
    protected readonly  props:         P;
    public readonly     name:          string;
    public readonly     _meta:         BlockMeta;
    public              children:      Record<string, Block> = {};
    public              childrenLists: Record<string, ChildrenList> = {};


    eventBus: () => EventBus<Events>;

    /** JSDoc
     * @param {Object} propsAndChildren
     *
     * @returns {void}
     */
    constructor(propsAndChildren?:P) {

        const { children, childrenLists, props } =
            propsAndChildren ?
                this._getChildren(propsAndChildren) :
                { children: {}, childrenLists: {}, props: {} };
        this.children = children;
        this.childrenLists = childrenLists;
        const eventBus = new EventBus<Events>();
        if (props.display === undefined) {
            props.display = true;
        }
        this._meta  = {
            props
        };

        if ('name' in props && typeof props.name === 'string') {
            this.name = props.name;
        } else if ('id' in props && typeof props.id === 'string') {
            this.name = props.id
        } else if ('id' in props && typeof props.id === 'number') {
            this.name = props.id.toString();
        } else {
            this.name = this.id;
        }

        this.props = this._makePropsProxy(props || {} as P);

        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT, this.props);
    }

    _getChildren(propsAndChildren:P) {
        const children:      Record<string, Block> = {};
        const childrenLists: Record<string, ChildrenList> = {};
        const props:         P = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if (
                (value)                                         &&
                (typeof value === 'object')                     &&
                (Array.isArray((value as ChildrenList).list))   &&
                ((value as ChildrenList).BlockClass.prototype instanceof Block)) {
                (value as ChildrenList).id = uuid();
                childrenLists[key] = value as ChildrenList;
            }
            else {
                props[key] = value;
            }
        });

        return { children, childrenLists, props };
    }

    _registerEvents(eventBus: EventBus<Events>) {
        eventBus.on(Block.EVENTS.INIT,        this._init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM,    this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU,    this._componentDidUpdate.bind(this));
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
    init(_props:P) {

    }


    _componentDidMount(props: P) {

        this.componentDidMount(props);

    }

    // Может переопределять пользователь, необязательно трогать
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidMount(_oldProps: P) {

    }

    dispatchComponentDidMount() {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    _componentDidUpdate(oldProps: P, newProps: P, addedProps: P) {
        const response = this.componentDidUpdate(oldProps, newProps, addedProps);
        if (!response) {
            return;
        }
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    // Может переопределять пользователь, необязательно трогать
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidUpdate(_oldProps: P, _newProps: P, _addedProps: P): boolean {
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
        this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, this._meta.props, nextProps);
    };

    getProps = () => {
        return cloneDeep(this._meta.props);
    }

    get element():Nullable<HTMLElement | DocumentFragment> {
        return this._element;
    }

    _render() {

        const element = this._compile(this.render() || this._meta.props.tmpl); // корневой HTMLElement, который возвращает шаблон

        this._removeEvents();

        // если this._element еще не назначен — значит это первый рендер
        if (!this._element) {
            this._element = element;
            this._componentDidMount(this.props);
        } else {
            // с помощью метода replaceWith заменяем элемент в DOM
            this._element.replaceWith(element);

            // не забываем сохранить новый корень
            this._element = element;

            this._element!.style.display = this.props.display ? '' : 'none';

        }
        this._addEvents();

    }

    // Может переопределять пользователь, необязательно трогать
    render(): string {
        return '';
    }

    getContent(): HTMLElement | Element | null {

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
        if (!this._element) return;
        type Events = Record<string, () => void | Record<string, () => void>>;
        const events: Events = (this.props as any).events;


        if (!events) {
            return;
        }
        const selector = (this.props as any).eventsSelector;

        let eventElement = selector ? (this._element.querySelector(selector) || this._element) : this._element;



        Object.entries(events).forEach(([event,listener]) => {
            if (typeof listener === 'function') {
                eventElement.addEventListener(event, listener);
            }
            if (typeof listener === 'object') {
                const selector = event;
                const events = (listener as Events);
                const eventSubElement = this._element!.querySelector(selector)
                if (!eventSubElement) return
                    Object.entries(events).forEach(([event, listener]) => {
                        eventSubElement.addEventListener(event, listener);
                    })

            }
        });
    }

    _removeEvents() {
        if (!this._element) return;
        type Events = Record<string, () => void | Record<string, () => void>>;
        const events: Events = (this.props as any).events;

        if (!events || !this._element) {
            return;
        }

        const selector = (this.props as any).eventsSelector;
        let eventElement = selector ? (this._element.querySelector(selector) || this._element) : this._element;

        Object.entries(events).forEach(([event,listener]) => {
            if (typeof listener === 'function') {
                eventElement.removeEventListener(event, listener);
            }
            if (typeof listener === 'object') {
                const selector = event;
                const events = (listener as Events);
                const eventElement = this._element!.querySelector(selector)
                if (!eventElement) return
                Object.entries(events).forEach(([event, listener]) => {
                    eventElement.removeEventListener(event, listener);
                })

            }
        });
    }
    onShow() {

    }
    show() {
        this.setProps({display: true});
        this.onShow();
    }

    hide() {
        this.setProps({display: false});
    }

    _compile(tmpl: string) {
        const propsAndStubs = { ...this.props };
        if (this.children) {
            Object.entries(this.children).forEach(([key, child]) => {
                propsAndStubs[key] = `<div data-id="${child.id}"></div>`
            });
        }

        if (this.childrenLists) {
            Object.entries(this.childrenLists).forEach(([key, list]) => {
                propsAndStubs[key] = `<div data-id="${list.id}"></div>`
            });
        }

        const fragment = this._createDocumentElement('template');

        fragment.innerHTML = TemplateCompile(tmpl, propsAndStubs);

        if (this.children) {
            Object.values(this.children).forEach((child) => {
                // @ts-ignore
                const stub = fragment.content.querySelector(`[data-id="${child.id}"]`);

                if (stub) {
                    const content = child.getContent();
                    if (content) stub.replaceWith(child.getContent());
                }

            });
        }

        if (this.childrenLists) {
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
        }
        // @ts-ignore
        return fragment.content.children[0];
    }


}
