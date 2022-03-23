import Block from './Block';
import store, {StoreEvents} from './Store';
import {PlainObject} from "./types";

export default function Connect(Component: typeof Block) {
    // используем class expression
    return class extends Component {
        constructor(...args: any[]) {

            super(...args);

            connectDeep(this, this.name);
        }
    }
}


function connectDeep(rootBlock: Block, parentPath: string) {

    store.set(parentPath, rootBlock._meta.props, true);

    store.on(`${StoreEvents.Updated}-${parentPath}`, () => {
        rootBlock.setProps({...store.getState(parentPath)});
    });

    Object.values(rootBlock.children).forEach((item) => {
        connectDeep(item, `${parentPath}.${item.name}`);
    })

    // Подсоеждинение объектов СhildrenLists: Record<string, ChildrenList>
    //export type ChildrenList = {
    //     id: string;
    //     name: string;
    //     list: Array<Block>;
    //     BlockClass: typeof Block;
    //     commonProps:Record<string, PlainObject>;
    //     nameList: Record<string, number>;
    // };
    Object.values(rootBlock.childrenLists).forEach((listsItem) => {
        listsItem.list.forEach((item) => {
            connectDeep(item, `${parentPath}.${listsItem.name}.${item.name}`);
        })


        store.on(`${StoreEvents.Updated}-${parentPath}.${listsItem.name}`, () => {
            listsItem.list = [];
            listsItem.nameList = {};
            const storeData = store.getState(`${parentPath}.${listsItem.name}`);
            Object.entries(storeData).forEach(([key, value]) => {
                let i = listsItem.list.push(new listsItem.BlockClass({
                    ...(value as PlainObject),
                    ...listsItem.commonProps
                })) - 1;
                listsItem.nameList[key] = i;
                connectDeep(listsItem.list[i], `${parentPath}.${listsItem.name}.${key}`);
            })

            /*
            let coverage = Array(listsItem.list.length).fill({cover: false, key: ''});

            Object.entries(listsItem.nameList).forEach(([key, value]) => {
                coverage[value].key = key;
            })
            Object.keys(store.getState(`${parentPath}.${listsItem.name}`)).forEach((key) => {
                if (!isNaN(listsItem.nameList[key])) {
                    let i = listsItem.nameList[key];
                    listsItem.list[i].setProps({...store.getState(`${parentPath}.${listsItem.name}.${key}`)})
                    coverage[i].cover = true;

                } else {
                    let i = listsItem.list.push(new listsItem.BlockClass({
                        ...store.getState(`${parentPath}.${listsItem.name}.${key}`),
                        ...listsItem.commonProps
                    })) - 1;
                    listsItem.nameList[key] = i;
                    connectDeep(listsItem.list[i], `${parentPath}.${listsItem.name}.${key}`);
                }
            })

            for (let i1 = coverage.length - 1; i1 >= 0; i1--) {
                if (!coverage[i1].cover) {
                    delete listsItem.nameList[coverage[i1].key]
                    coverage.splice(i1,1);
                    listsItem.list.splice(i1,1);
                }
            }*/
            rootBlock.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        })

    })
};
