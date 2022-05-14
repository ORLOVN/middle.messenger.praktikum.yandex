import Block            from '../../../../utils/Block';
import tmpl             from './user-list.tmpl';
import Button           from '../../../../components/button';
import {ContextMenu}    from '../../../../components/context-menu/context-menu';
import PopupInput       from '../../../../components/popup-input';
import chatDealer       from '../../../../modules/chats/ChatDealer';
import                       './user-list.css';

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
        const nextButton  = new Button({
            content: `<span class="material-icons">done</span>`,
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
            backButton:     backButton,
            nextButton:     nextButton,
            contextMenu:    contextMenu,
            popupNewChat:   popupNewChat,
            optionMenu:     optionMenu,
            list:           [],
            selectedList:   [],
            ...props,
            events: {
                    click: (event: MouseEvent) => {
                        const liElement = (event.target as HTMLLIElement).closest('li')
                        if (!liElement) return;
                        const idStr = liElement.getAttribute('data-id');
                        const type  = liElement.getAttribute('data-type');
                        if (!idStr || !type) return;
                        const id = parseInt(idStr, 10)
                        if (isNaN(id)) return;
                        chatDealer.userSelect(id);
                    }
            }});

    }

    render(): string {
        return tmpl;
    }
}
