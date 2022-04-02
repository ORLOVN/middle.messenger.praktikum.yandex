import Block from '../../../../utils/Block';
import tmpl from './chatPane.tmpl';
import Message from '../message';
import MessageInput from "../message-input";
import Button from "../../../../components/button";
import dummydata from "./dummydata";
import {listFromArray} from "../../../../utils/blockTools";


export class ChatPane extends Block {
    constructor(props: {
        name?:   string,
        title?:  string,
        chatId: number,
    } = {
        chatId: 0,
    }) {
        const messageInput = new MessageInput({ message:'' });

        const sendingButton = new Button({
            content: `<span class="material-icons">send</span>`,
            class: 'chat-pane__submit-button',
            events: {
                click:() => console.log(messageInput.getMassage())
            }
        });

        const commonProps = {
            events: {
                click: () => {
                    console.log(`message clicked`);
                }
            }
        };

        const messageList = listFromArray(dummydata, Message, commonProps, 'messageList');

        super( {
            messageList: messageList,
            messageInput: messageInput,
            sendingButton: sendingButton,
                ...props,
        });

    }

    render():string {

        return tmpl;

    }
}
