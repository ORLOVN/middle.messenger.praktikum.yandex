import Block from "./Block";
import {ChildrenList} from './types';
// @ts-ignore
import { v4 as uuid} from 'uuid';

type List = {
    nameList: Record<string, number>
    list: Array<Block>;
}

export function listFromArray(
    propsList: Array<Record<string, any>>,
    BlockClass: typeof Block,
    commonProps?:Record<string, any>,
    listName = ''): List
{
    const id = uuid();
    const list: ChildrenList = {
        id: id,
        name: listName || id,
        list: [],
        commonProps: commonProps || {},
        nameList: {},
        BlockClass: BlockClass
    }

    propsList.forEach(props => {
        props.name = props.name || props.id || uuid();
        list.nameList[props.name] = -1 +
            list.list.push(new BlockClass({
                ...props,
                ...commonProps,
            })) ;
    });

    return list;
}

export function render(query: string, block: Block) {
    const root = document.querySelector(query);
    const content = block.getContent();
    if (root && content) {
        root.appendChild(content);
    }
    return root;
}
