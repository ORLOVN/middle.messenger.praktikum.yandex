import Block            from '../../../../utils/Block';
import tmpl             from './chat-list.tmpl';
import Button           from '../../../../components/button';
import {ContextMenu}    from "../../../../components/context-menu/context-menu";
import PopupInput       from "../../../../components/popup-input";
import chatDealer       from "../../../../modules/chats/ChatDealer";
import                       './chat-list.css';

export class ChatList extends Block {
    constructor(props:{
        name: string;
    }) {

        const contextMenu = new ContextMenu({
            name: 'contextMenu',
            items: [
                {
                    title: 'Удалить',
                    value: 'delete',
                    enable: true,
                },
                {
                    title: 'Архивировать',
                    value: 'archive',
                    enable: false,
                }
            ],
        }
        );

        const optionMenu = new ContextMenu({
                name: 'optionMenu',
                items: [
                    {
                        title: 'Новый чат',
                        value: 'new-chat',
                        enable: true,
                    },
                    {
                        title: 'Новая группа',
                        value: 'new-group',
                        enable: true,
                    }
                ],
            }
        );

        const popupNewChat  = new PopupInput({
            name:             'popupNewChat',
            display:           false,
            inputPlaceholder: 'Новый чат',
            inputLabel:       'Введите название нового чата',
            title:            'Новый чат',
            okCaption:        'Ок',
            cancelCaption:    'Отмена',
        });

        const optionButton  = new Button({
            content: `<span class="material-icons">add_comment</span>`,
            class: 'chat-list__options-button',
            events:{
                click:() => popupNewChat.popup().then(title => chatDealer.createNewChat(title))
            }
        });


        super({
            optionButton:   optionButton,
            contextMenu:    contextMenu,
            popupNewChat:   popupNewChat,
            optionMenu:     optionMenu,
            list:           [],
            ...props,
            events: {
                    contextmenu: (event: MouseEvent) => {
                        event.preventDefault();
                        const liElement = (event.target as HTMLLIElement).closest('li')
                        if (!liElement) return;
                        const idStr = liElement.getAttribute('data-id');
                        if (!idStr) return;
                        const id = parseInt(idStr, 10)
                        if (isNaN(id)) return;
                        contextMenu.popup({x: event.pageX, y: event.pageY})
                            .then((value)=> {
                                if (value) {
                                    chatDealer.doAction(value, id)
                                }
                            })

                    },

                    click: (event: MouseEvent) => {
                        const liElement = (event.target as HTMLLIElement).closest('li')
                        if (!liElement) return;
                        const idStr = liElement.getAttribute('data-id');
                        if (!idStr) return;
                        const id = parseInt(idStr, 10)
                        if (isNaN(id)) return;
                        chatDealer.go(id)
                    }
            }});

    }

    render(): string {
        return tmpl;
    }
}
