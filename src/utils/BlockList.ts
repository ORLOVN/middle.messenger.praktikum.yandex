import Block from "./Block";
import {PlainObject} from "./types";
// @ts-ignore
import { v4 as uuid} from 'uuid';

export default class BlockList extends Block {
    public tmpl: string;
    constructor(propsList: Array<Record<string, string>>, BlockClass: typeof Block, commonProps?: PlainObject, name: string = '') {
        const props: Record<string, PlainObject> = {};

        let tmpl = '';
        propsList.forEach(propsItem => {
            const itemName = propsItem.name || propsItem.id || uuid();
            props[itemName] = new BlockClass({
                ...propsItem,
                ...commonProps,
            })
            tmpl += `{{{${itemName}}}} `
        });

        super({...props, name: name, tmpl: tmpl});
    }

}

