import Block        from '../../utils/Block';
import ChatPane     from "./components/chat-pane";
import tmpl         from './chats.tmpl';
import mediator     from "../../utils/Mediator";
import {SideBar}    from "./components/side-bar/side-bar";

export class Chats extends Block {
    constructor() {
        const sideBar     = new SideBar( {name: 'sideBar'});
        const chatPane    = new ChatPane( {name: 'chatPane'});


        super({
            name:           'chatPage',
            sideBar:        sideBar,
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
