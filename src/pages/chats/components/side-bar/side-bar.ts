import Block            from '../../../../utils/Block';
import SearchField      from '../search-field';
import tmpl             from './side-bar.tmpl';
import Button           from '../../../../components/button';
import router           from "../../../../utils/Router";
import mediator         from "../../../../utils/Mediator";
import ChatList         from "../chat-list";

enum currentList  {
    chats    = 'chats',
    users    = 'users',

}

export class SideBar extends Block {
    constructor(props:{
        name: string;
    }) {
        const chatList = new ChatList({name: 'chatList'});

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

        /*const addChatButton  = new Button({
            content: `<span class="material-icons">add_comment</span>`,
            class: 'side-bar__profile-settings',
            events:{
               // click:() => chatList.popupNewChat.popup().then(title => chatDealer.createNewChat(title))
            }
        });*/



        super({
            chatList:       chatList,
            searchField:    searchField,
            profileButton:  profileButton,
            logoutButton:   logoutButton,
            currentList:    currentList.chats,
            ...props,
        });

    }

    render(): string {
        return tmpl;
    }
}
