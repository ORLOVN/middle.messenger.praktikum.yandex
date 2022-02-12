import Block from "./Block";

export function listFromArray(
    propsList: Array<Record<string, string>>,
    BlockClass: typeof Block,
    commonProps?:Record<string, any>): any
{
    const List: {
        nameList: Record<string, number>
        list: Array<Block>;
    } = {
        nameList: {},
        list: []
    }

    propsList.forEach(props => {
        List.nameList[props.name] = -1 +
            List.list.push(new BlockClass({
                ...props,
                ...commonProps,
            })) ;
    });

    return List;
}
