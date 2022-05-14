import Block            from '../../../../utils/Block';
import SearchField      from '../search-field';
import tmpl             from './side-bar.tmpl';
import Button           from '../../../../components/button';
import router           from '../../../../utils/Router';

import ChatList         from '../chat-list';
import UserList         from '../user-list';
import chatDealer       from '../../../../modules/chats/ChatDealer';
import ChatSetting      from '../chat-setting';
import auth             from '../../../../modules/auth';
import                       './side-bar.css'

enum currentList  {
    chats    = 'chats',
    users    = 'users',

}

export class SideBar extends Block {
    constructor(props:{
        name: string;
    }) {
        const chatList = new ChatList({name: 'chatList'});
        const userList = new UserList({name: 'userList'});
        const chatSetting = new ChatSetting({name: 'chatSetting'})
        //chatDealer.doAction('new-chat');
        const searchField  = new SearchField({
            events:{
                keyup:(event: KeyboardEvent) => {
                    chatDealer.searchInput((event.target! as HTMLInputElement).value)
                },

                keydown: (event: KeyboardEvent) => {
                    if (event.code === 'Enter') {
                        chatDealer.searchInput((event.target! as HTMLInputElement).value, true)
                    }
                }
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
                click: async () => {
                    await auth.signOut();
                    chatDealer.cleanChats()
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
            userList:       userList,
            chatSetting:    chatSetting,
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
