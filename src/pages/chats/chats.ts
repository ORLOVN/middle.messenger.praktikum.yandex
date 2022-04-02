import Block        from '../../utils/Block';
import ChatList     from "./components/chat-list";
import ChatPane     from "./components/chat-pane";
import tmpl         from './chats.tmpl';
import mediator     from "../../utils/Mediator";

export class Chats extends Block {
    constructor() {
        const chatList      = new ChatList( {name: 'chatList'});
        const chatPane      = new ChatPane( {name: 'chatPane'});


        super({
            name:           'chatPage',
            chatList:       chatList,
            chatPane:       chatPane,
        });

        mediator.emit('chatPage-initiated');
    }

     render(): string {

         return tmpl;

    }

    onShow() {
        mediator.emit('check-user');
    }
}
