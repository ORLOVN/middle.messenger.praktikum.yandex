import Block from '../../utils/Block';
import ChatList from "./components/chat-list";
import ChatPane from "./components/chat-pane";
import tmpl from './chats.tmpl';

export class Chats extends Block {
    constructor() {
        const chatList  = new ChatList();
        const chatPane  = new ChatPane();

        super({
            'chatList': chatList,
            'chatPane': chatPane,
            'someText': 'Text is here',
        });

    }

     render(): string {

         return tmpl;

    }
}