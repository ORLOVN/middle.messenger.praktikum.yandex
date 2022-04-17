import Block from '../../../../utils/Block';
import tmpl from './chatPane.tmpl';
import Message from '../message';
import MessageInput from "../message-input";
import Button from "../../../../components/button";
import {listFromArray} from "../../../../utils/blockTools";
import ContextMenu from "../../../../components/context-menu";
import chatDealer from "../../../../modules/chats/ChatDealer";
import ChatDealer from "../../../../modules/chats/ChatDealer";


export class ChatPane extends Block {
    constructor(props: {
        name?:   string,
        title?:  string,
        chatId: number,
        avatar_file?: string
    } = {
        chatId: 0,
    }) {
        const messageInput = new MessageInput({
            name: 'messageInput',
            message: ''
        });


        const optionMenu = new ContextMenu({
            name: 'optionsMenu',
            items: [
                {
                    title:  'Изменить аватарку',
                    value:  'change-avatar',
                    enable: true,

                },
                {
                    title:  'Добавить пользователя',
                    value:  'add-users',
                    enable: true,
                },
            ]
        })

        const optionButton = new Button({
            content: `<span class="material-icons">more_horiz</span>`,
            class: 'chat-pane__option-button',
            events: {
                click:(event: MouseEvent) =>
                optionMenu.popup({x: event.pageX, y: event.pageY})
                    .then((value) => {
                        if (value) {
                            chatDealer.doAction(this.getProps().chatId,value)
                            if (value === 'change-avatar') {
                                if (!this._element) return;
                                const avatarInput = this._element.querySelector('#avatarInput')
                                if (!avatarInput) return;
                                const event = new MouseEvent('click');
                                avatarInput.dispatchEvent(event);
                            }
                        }
                    })
            }
        });

        const commonProps = {
            events: {
                click: () => {
                    console.log(`message clicked`);
                }
            }
        };

        const messageList = listFromArray([], Message, commonProps, 'messageList');


        super( {
            messageList:    messageList,
            messageInput:   messageInput,
            optionButton:   optionButton,
            optionMenu:     optionMenu,
            ...props,
            events:         {
                '#avatarInput': {
                    change: (event: Event) => {
                        if (!event.target) return;
                        const formElement = ((event.target as HTMLElement).closest('#avatarForm') as HTMLFormElement);
                        if (!formElement) return;
                        formElement.requestSubmit();
                    }
                },

                '#avatarForm': {
                    submit: async (event: Event) => {
                        event.preventDefault();
                        if (!event || !event.target) return;
                        const formData = new FormData((event.target as HTMLFormElement));
                        await ChatDealer.changeAvatar(formData);
                    }
                }
            }
        });

    }

    render():string {

        return tmpl;

    }
}
