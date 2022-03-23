import Block            from '../../../../utils/Block';
import SearchField      from '../search-field';
import tmpl             from './chat-list.tmpl';
import Button           from '../../../../components/button';
import ChatListElement  from "../chat-list-element";
import chatListData     from './dummydata';
import {listFromArray}  from "../../../../utils/blockTools";
import router           from "../../../../utils/Router";

export class ChatList extends Block {
    constructor(props:{
        name: string;
    }) {
        const searchField  = new SearchField({
            events:{
                keyup:() => console.log('search-key up event')
            }
        });

        const newChatButton  = new Button({
            content: `<span class="material-icons">account_circle</span>`,
            class: 'chatlist__profile-settings',
            events:{
                click:() => router.go('/setting')
            }
        });

        const profileButton  = new Button({
            content: `<span class="material-icons">account_circle</span>`,
            class: 'chatlist__profile-settings',
            events:{
                click:() => router.go('/setting')
            }
        });

        const logoutButton  = new Button({
            content: `<span class="material-icons">account_circle</span>`,
            class: 'chatlist__profile-settings',
            events:{
                click:() => router.go('/setting')
            }
        });

        const commonProps = {
            events: {
                click: () => {
                    console.log(`Element list item has been clicked`);
                }
            }
        };

        const chatList = listFromArray(chatListData,ChatListElement, commonProps, 'list');

        super({
            chatList: chatList,
            searchField: searchField,
            profileButton: profileButton,
            ...props});

    }

    render(): string {
        return tmpl;
    }
}
