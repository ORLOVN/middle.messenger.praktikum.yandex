import mediator from '../utils/Mediator';
import ChatAPI  from '../api/chat-api';
import authAPI from "../api/auth-api";
import router   from '../utils/Router';
import store    from '../utils/Store';

mediator.on('chats-logout', () => {
    authAPI.delete().then(() => {
        router.go('/');
        store.set('user', {}, true);
    })
});

mediator.on('chatPage-initiated', () => {
    mediator.emit('chatPage-get-chats')
});


mediator.on('chatPage-get-chats', () => {
    ChatAPI.getChats().then((res) => {
        if (res.status === 200) {
            const list: Record<string | number, Record<string, string | number>> = {};

            res.response.forEach((chat: Record<string, string | number>) => {
                chat['avatar_file'] = `https://ya-praktikum.tech/api/v2/resources/${chat.avatar}`
                list[chat.name || chat.id] = chat;
            })
            store.replace('chatPage.chatList.list',list);
        }
    })
});

mediator.on('chatPage-new-chat', () => {
    const popupInput = store.getState('chatPage.popupNewChat');
    (popupInput.popup as () => Promise<any>)().then((res) => {
        ChatAPI.createChat(res).then((res) => {
            if (res.status === 200) {
                mediator.emit('chatPage-get-chats')
            }
        })
    })
})
