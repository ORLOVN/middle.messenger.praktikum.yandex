import Block from '../../../../utils/Block';
import tmpl from './chatPane.tmpl';
import Message from '../message';
import MessageInput from "../message-input";
import Button from "../../../../components/button";
import dummydata from "./dummydata";
import { v4 as uuid} from 'uuid';

export class ChatPane extends Block {
    constructor() {
        const messageInput = new MessageInput({ message:'' });

        const sendingButton = new Button({
            content: `<span class="material-icons">send</span>`,
            class: 'chat-pane__submit-button',
            events: {
                click:() => console.log(messageInput.getMassage())
            }
        });

        super( {'messageInput':messageInput, 'sendingButton':sendingButton });

        this.completeData(dummydata);
    }

    render():string {

        return tmpl;

    }

    completeData(messagesData: Array<{
        id: string,
        author: string,
        text: string,
        time: string,
        status: number,
    }>) {
        const compName = `messages`
        if (!this.childrenLists[compName]) {
            this.childrenLists[compName] = {
                id: uuid(),
                list: [],
            }
        }
        messagesData.forEach((value) => {
            this.childrenLists[compName].list.push( new Message({
                ...value
            }));
            this.childrenLists[compName].list[this.childrenLists[compName].list.length-1].dispatchComponentDidMount();
        });
    }
}
