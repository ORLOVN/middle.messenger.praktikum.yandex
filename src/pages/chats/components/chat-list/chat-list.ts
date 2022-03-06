import Block from '../../../../utils/Block';
import SearchField from '../search-field';
import tmpl from './chat-list.tmpl';
import Button from '../../../../components/button';
import ChatListElement from "../chat-list-element";
import chatListData from './dummydata';
import {listFromArray} from "../../../../utils/blockTools";

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

        const commonProps = {
            events: {
                click: () => {
                    console.log(`Element list item has been clicked`);
                }
            }
        };

        const chatList = listFromArray(chatListData,ChatListElement, commonProps, 'chat-list');

        super({chatList: chatList, searchField: searchField, profileButton: profileButton});

    }

    render(): string {
        return tmpl;
    }
}

