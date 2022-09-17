import Block        from '../../utils/Block';
import ChatPane     from './components/chat-pane';
import tmpl         from './chats.tmpl';
import SideBar      from './components/side-bar';
import chatDealer   from '../../modules/chats/chatDealer';
import auth         from '../../modules/auth';
import                   './chats.css';

export class Chats extends Block {
    constructor() {
        const sideBar     = new SideBar( {name: 'sideBar'});
        const chatPane    = new ChatPane( {name: 'chatPane'});

        super({
            name:           'chatPage',
            sideBar:        sideBar,
            chatPane:       chatPane,
        });
        chatDealer.uploadAllChats();
    }

     render(): string {

         return tmpl;

    }

    onShow() {
        auth.checkUser();
    }
}
