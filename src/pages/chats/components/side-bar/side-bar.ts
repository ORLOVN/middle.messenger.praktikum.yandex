import Block            from '../../../../utils/Block';
import SearchField      from '../search-field';
import tmpl             from './side-bar.tmpl';
import Button           from '../../../../components/button';
import ChatListElement  from "../chat-list-element";
import {listFromArray}  from "../../../../utils/blockTools";
import router           from "../../../../utils/Router";
import mediator         from "../../../../utils/Mediator";
import {ContextMenu}    from "../../../../components/context-menu/context-menu";
import PopupInput       from "../../../../components/popup-input";
import chatDealer       from "../../../../modules/chats/ChatDealer";

enum currentList  {
    chats   = 'chats',
    user    = 'users',

}

export class SideBar extends Block {
    constructor(props:{
        name: string;
    }) {
        const searchField  = new SearchField({
            events:{
                keyup:() => console.log('search-key up event')
            }
        });


        const profileButton  = new Button({
            content: `<span class="material-icons">account_circle</span>`,
            class: 'side-bar__profile-settings',
            events:{
                click:() => router.go('/setting')
            }
        });

        const logoutButton  = new Button({
            content: `<span class="material-icons">logout</span>`,
            class: 'side-bar__profile-settings',
            events:{
                click:() => {
                    mediator.emit('signout');
                },
            }
        });

        const contextMenu = new ContextMenu({
            name: 'contextMenu',
            items: [
                {
                    title: 'Удалить',
                    value: 'delete',
                    enable: true,
                },
                {
                    title: 'Архивировать',
                    value: 'archive',
                    enable: false,
                }
            ],
        }
        );

        const popupNewChat  = new PopupInput({
            name:             'popupNewChat',
            display:           false,
            inputPlaceholder: 'Новый чат',
            inputLabel:       'Введите название нового чата',
            title:            'Новый чат',
            okCaption:        'Ок',
            cancelCaption:    'Отмена',
        });

        const addChatButton  = new Button({
            content: `<span class="material-icons">add_comment</span>`,
            class: 'side-bar__profile-settings',
            events:{
                click:() => popupNewChat.popup().then(title => chatDealer.createNewChat(title))
            }
        });

        const chatList = listFromArray([],ChatListElement, {}, 'list');

        super({
            chatList:       chatList,
            searchField:    searchField,
            profileButton:  profileButton,
            addChatButton:  addChatButton,
            logoutButton:   logoutButton,
            contextMenu:    contextMenu,
            popupNewChat:   popupNewChat,
            currentList:    currentList.chats,
            ...props,
            events: {
                '.side-bar__list-pane': {
                    contextmenu: (event: MouseEvent) => {
                        event.preventDefault();
                        const liElement = (event.target as HTMLLIElement).closest('li')
                        if (!liElement) return;
                        const idStr = liElement.getAttribute('data-id');
                        if (!idStr) return;
                        const id = parseInt(idStr, 10)
                        if (isNaN(id)) return;
                        contextMenu.popup({x: event.pageX, y: event.pageY})
                            .then((value)=> {
                                if (value) {
                                    chatDealer.doAction(id,value)
                                }
                            })

                    },

                    click: (event: MouseEvent) => {
                        const liElement = (event.target as HTMLLIElement).closest('li')
                        if (!liElement) return;
                        const idStr = liElement.getAttribute('data-id');
                        if (!idStr) return;
                        const id = parseInt(idStr, 10)
                        if (isNaN(id)) return;
                        chatDealer.go(id)
                    }
                }
            }});

    }

    render(): string {
        return tmpl;
    }
}