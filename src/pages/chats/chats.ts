import Block        from '../../utils/Block';
import ChatPane     from "./components/chat-pane";
import tmpl         from './chats.tmpl';
import {SideBar}    from "./components/side-bar/side-bar";
import chatDealer   from "../../modules/chats/ChatDealer";
import auth         from "../../modules/auth";

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
