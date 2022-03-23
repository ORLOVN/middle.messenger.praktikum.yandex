import tmpl             from './chat-list.tmpl';
import ChatListElement  from '../chat-list-element';
import chatListData     from './dummydata';
import BlockList        from "../../../../utils/BlockList";
export class ChatList extends BlockList {
    constructor(props:{ name: string }) {
        const commonProps = {
            events: {
                click: () => {
                    console.log(`Element list item has been clicked`);
                }
            }
        };

        super(chatListData, ChatListElement, commonProps, props.name);

    }

    render(): string {
        return `
        <ul class="chatlist__list-pane">
        ${this.getProps().tmpl}
        </ul>
        `;
    }
}

