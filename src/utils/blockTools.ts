import Block from "./Block";
import {ChildrenList} from './types';
// @ts-ignore
import { v4 as uuid} from 'uuid';

type List = {
    nameList: Record<string, number>
    list: Array<Block>;
}

export function listFromArray(
    propsList: Array<Record<string, string>>,
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
        list.nameList[props.name] = -1 +
            list.list.push(new BlockClass({
                ...props,
                ...commonProps,
            })) ;
    });

    return list;
}
