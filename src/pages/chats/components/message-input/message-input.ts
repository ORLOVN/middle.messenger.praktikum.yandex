import Block from '../../../../utils/Block';
import Input from "../../../../components/input";
import Button from "../../../../components/button";
import chatDealer from "../../../../modules/chats/ChatDealer";

export class MessageInput extends Block {

    private _message: string;

    constructor(props: {message?: string }) {
        const input = new Input({
            class:      'chat-pane__message-input',
            value:      props.message,
            events:     {
                keyup: (eventProp: KeyboardEvent) => {
                    chatDealer.inputMessageUpdate((eventProp.target as HTMLInputElement).value)
                },
                keydown: async (eventProp: KeyboardEvent) => {
                    if (eventProp.key === 'Enter') {
                        await chatDealer.sendMessage()
                        input.setProps({
                            value: ''
                        });
                    }
                }
            }
        });

        const sendButton = new Button({
            content:    `<span class="material-icons">send</span>`,
            class:      'chat-pane__submit-button',
            events:     {
                click: async () => {
                    await chatDealer.sendMessage()
                    input.setProps({
                        value: ''
                    });
                }
            }
        });

        super({
            ...props,
            input:      input,
            sendButton: sendButton,
        });
        this._message = '';
    }

    keyupHandle(){
        return
    }

    getMassage():string {
        return this._message;
    }

    render():string {
        return `
<div class="chat-pane__new-message-wrapper">
<div class="chat-pane__new-message-pane">
    <div class="chat-pane__attach-button">
        <span class="material-icons">
        attach_file
        </span>
    </div>
    {{{input}}}
   
</div>
 {{{sendButton}}}
 </div>
        `;
    }
}
