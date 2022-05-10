import Block        from "../../../../utils/Block";
import {PropEvents} from '../../../../utils/types'
import InputAssy from "../../../../components/input-assy";
import Button from "../../../../components/button";
import chatDealer from "../../../../modules/chats/ChatDealer";

export class ChatSetting extends Block {

    constructor(props: {
        name?: string,
        imgRef?: string,
        events?: PropEvents
    }) {

        const chatNameInput = new InputAssy({
            name: 'chatNameInput',
            type: 'text',
            placeholder: 'Новый чат',
            label: 'Введите имя чата',
        })

        const nextButton  = new Button({
            content: `<span class="material-icons">arrow_back</span>`,
            class: 'user-list__next-button',
            events:{
                click:() => {
                    chatDealer.chatMasterDone();
                }
            }
        });

        const backButton  = new Button({
            content: `<span class="material-icons">arrow_back</span>`,
            class: 'user-list__back-button',
            events:{
                click:() => {
                    chatDealer.chatMasterBack();
                }
            }
        });

        super({
            chatNameInput: chatNameInput,
            nextButton: nextButton,
            backButton: backButton,
            ...props
        });

    }

    render():string {
// eslint-disable-next-line max-len
        return `
<div ="chat-setting__pane">    
{{{chatNameInput}}}
{{{nextButton}}}
{{{backButton}}}
</div>
`;

    }
}
