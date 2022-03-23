import Block        from '../../utils/Block';
import ChatList     from "./components/chat-list";
import ChatPane     from "./components/chat-pane";
import tmpl         from './chats.tmpl';
import mediator     from "../../utils/Mediator";
import PopupInput   from "../../components/popup-input";

export class Chats extends Block {
    constructor() {
        const chatList      = new ChatList( {name: 'chatList'});
        const chatPane      = new ChatPane( {name: 'chatPane'});
        const popupNewChat  = new PopupInput({
            name:             'popupNewChat',
            display:           false,
            inputPlaceholder: 'Новый чат',
            inputLabel:       'Введите название нового чата',
            title:            'Новый чат',
            okCaption:        'Ок',
            cancelCaption:    'Отмена',
        });

        super({
            name:           'chatPage',
            chatList:       chatList,
            chatPane:       chatPane,
            popupNewChat:   popupNewChat,
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
