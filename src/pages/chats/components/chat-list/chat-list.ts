import Block            from '../../../../utils/Block';
import SearchField      from '../search-field';
import tmpl             from './chat-list.tmpl';
import Button           from '../../../../components/button';
import ChatListElement  from "../chat-list-element";
import chatListData     from './dummydata';
import {listFromArray}  from "../../../../utils/blockTools";
import router           from "../../../../utils/Router";
import mediator         from "../../../../utils/Mediator";
import {ContextMenu} from "../../../../components/context-menu/context-menu";

export class ChatList extends Block {
    constructor(props:{
        name: string;
    }) {
        const searchField  = new SearchField({
            events:{
                keyup:() => console.log('search-key up event')
            }
        });

        const addChatButton  = new Button({
            content: `<span class="material-icons">add_comment</span>`,
            class: 'chatlist__profile-settings',
            events:{
                click:() => mediator.emit('chatPage-new-chat')
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
            content: `<span class="material-icons">logout</span>`,
            class: 'chatlist__profile-settings',
            events:{
                click:() => {
                    mediator.emit('signout');
                },
            }
        });

        const contextMenu = new ContextMenu({
            name: 'contextMenu'
        })

        const commonProps = {
            events: {
                click: () => {
                    console.log(`Element list item has been clicked`);
                }
            }
        };

        const chatList = listFromArray(chatListData,ChatListElement, commonProps, 'list');

        super({
            chatList:       chatList,
            searchField:    searchField,
            profileButton:  profileButton,
            addChatButton:  addChatButton,
            logoutButton:   logoutButton,
            ...props});

    }

    render(): string {
        return tmpl;
    }
}
