import Block from './Block';
import store, {StoreEvents} from './Store';

export default function Connect(Component: typeof Block) {
    // используем class expression
    return class extends Component {
        constructor(...args: any[]) {
            // не забываем передать все аргументы конструктора
            super(...args);
            store.set(this.name, this._meta.props, true);
            // подписываемся на событие
            store.on(StoreEvents.Updated, () => {
                // вызываем обновление компонента, передав данные из хранилища
                this.setProps({...store.getState(this.name)});
            });

            connectDeep(this, this.name);
        }
    }
}


function connectDeep(rootBlock: Block, parentPath: string) {
    Object.values(rootBlock.children).forEach((item) => {
        store.set(`${parentPath}.${item.name}`, item._meta.props, true);
        store.on(`${StoreEvents.Updated}-${parentPath}.${item.name}`, () => {
            item.setProps({...store.getState(`${parentPath}.${item.name}`)});
        });
        connectDeep(item, `${parentPath}.${item.name}`);
    })
    Object.values(rootBlock.childrenLists).forEach((listsItem) => {
        let coverage = Array(listsItem.list.length).fill(false);
        listsItem.list.forEach((item) => {

            store.set(`${parentPath}.${listsItem.name}.${item.name}`, item._meta.props,true)

        })

        Object.keys(store.getState(`${parentPath}.${listsItem.name}`)).forEach((key) => {
            store.on(`${StoreEvents.Updated}-${parentPath}.${listsItem.name}.${key}`, () => {
                if (!isNaN(listsItem.nameList[key])) {
                    let i = listsItem.nameList[key];
                    listsItem.list[i].setProps({...store.getState(`${parentPath}.${listsItem.name}.${key}`)})
                    coverage[i] = true;
                    connectDeep(listsItem.list[i], `${parentPath}.${listsItem.name}.${key}`);
                } else {
                    let i = listsItem.list.push(new listsItem.BlockClass({
                        ...store.getState(`${parentPath}.${listsItem.name}.${key}`),
                        ...listsItem.commonProps
                    })) - 1;
                    listsItem.nameList[key] = i;
                    connectDeep(listsItem.list[i], `${parentPath}.${listsItem.name}.${key}`);
                }
            })

        })

        // даляем елементы, которых нет в state
        for (let i1 = listsItem.list.length - 1; i1 >= 0; i1--) {
            if (!coverage[i1]) {
                coverage.slice(i1,1);
                listsItem.list.slice(i1,1);
            }
        }

    })
};
