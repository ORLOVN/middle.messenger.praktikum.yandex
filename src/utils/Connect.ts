import Block                from './Block';
import store, {StoreEvents} from './Store';
import {PlainObject}        from "./types";

export default function Connect(Component: typeof Block) {

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

            rootBlock.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        })

    })
}

