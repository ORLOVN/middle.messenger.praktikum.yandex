import Block            from '../../../../utils/Block';
import tmpl             from './user-list.tmpl';
import Button           from '../../../../components/button';
import {ContextMenu}    from "../../../../components/context-menu/context-menu";
import PopupInput       from "../../../../components/popup-input";
import chatDealer       from "../../../../modules/chats/ChatDealer";

export class UserList extends Block {
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
                click:(event: MouseEvent) => {
                    optionMenu.popup({x: event.pageX, y: event.pageY})
                        .then((value)=> {
                            if (value) {
                                chatDealer.doAction(value)
                            }
                        })

                }
            }
        });


        super({
            optionButton:   optionButton,
            contextMenu:    contextMenu,
            popupNewChat:   popupNewChat,
            optionMenu:     optionMenu,
            selectable:     true,
            list:           [],
            ...props,
            events: {
                    click: (event: MouseEvent) => {
                        const liElement = (event.target as HTMLLIElement).closest('li')
                        if (!liElement) return;
                        const idStr = liElement.getAttribute('data-id');
                        if (!idStr) return;
                        const id = parseInt(idStr, 10)
                        if (isNaN(id)) return;
                        chatDealer.userSelected(id);
                    }
            }});

    }

    render(): string {
        return tmpl;
    }
}
