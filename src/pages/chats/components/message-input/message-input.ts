import Block from       '../../../../utils/Block';
import Input from       '../../../../components/input';
import Button from      '../../../../components/button';
import chatDealer from  '../../../../modules/chats/ChatDealer';
import                  './message-input.css';

export class MessageInput extends Block {

    private _message: string;

    constructor(props: {
        name: string;
        message?: string
    }) {
        const input = new Input({
            class:      'chat-pane__message-input',
            value:      props.message,
            events:     {
                keyup: () => {
                    chatDealer.inputMessageUpdate(input.value)
                },
                keydown: async (eventProp: KeyboardEvent) => {
                    if (eventProp.key === 'Enter') {
                        await chatDealer.sendMessage()
                        input.value = '';
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
                    input.value = '';
                }
            }
        });

        super({
            ...props,
            input:      input,
            sendButton: sendButton,
            focus: () => {
                input.focus();
            }
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
