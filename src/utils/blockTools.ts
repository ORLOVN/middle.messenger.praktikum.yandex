import Block from "./Block";

type List = {
    nameList: Record<string, number>
    list: Array<Block>;
}

export function listFromArray(
    propsList: Array<Record<string, string>>,
    BlockClass: typeof Block,
    commonProps?:Record<string, any>): List
{
    const list: {
        nameList: Record<string, number>
        list: Array<Block>;
    } = {
        nameList: {},
        list: []
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
