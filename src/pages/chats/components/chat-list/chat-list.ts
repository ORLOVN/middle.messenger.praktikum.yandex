import Block from '../../../../utils/Block';
import SearchField from '../search-field';
import tmpl from './chat-list.tmpl';
import Button from '../../../../components/button';
import ChatListElement from "../chat-list-element";
import chatListData from './dummydata';
import { v4 as uuid} from 'uuid';

export class ChatList extends Block {
    constructor() {
        const searchField  = new SearchField({
            events:{
                keyup:() => console.log('search-key up event')
            }
        });

        const profileButton  = new Button({
            content: `<span class="material-icons">account_circle</span>`,
            class: 'chatlist__profile-settings',
            events:{
                click:() => console.log('profile button clicked')
            }
        });


        super({'searchField': searchField, 'profileButton': profileButton});

        this.completeData(chatListData);
    }

    render(): string {
        return tmpl;
    }

    completeData(chatListData: Array<{
        id: string,
        name: string,
        avatar: string,
        unread: number,
        time: string,
        lastmessage: string,
    }>) {
        if (!this.childrenLists[`chatList`]) {
            this.childrenLists[`chatList`] = {
                id: uuid(),
                list: [],
            }
        }
        chatListData.forEach((value) => {
            this.childrenLists[`chatList`].list.push( new ChatListElement({
                ...value,
                events: {click:() => this.ChatListElementClick(value.id)}
            }));
            this.childrenLists[`chatList`].list[this.childrenLists[`chatList`].list.length-1].dispatchComponentDidMount();
        });
    }

    ChatListElementClick(id: string) {
        console.log(`Element list item ${id} has been clicked`)
    }
}

