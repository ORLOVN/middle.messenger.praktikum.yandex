import mediator from '../utils/Mediator';
import ChatAPI  from '../api/chat-api';
import authAPI from "../api/auth-api";
import router   from '../utils/Router';
import store    from '../utils/Store';
import chatDealer from "./chats/ChatDealer";


mediator.on('chats-logout', () => {
    authAPI.delete().then(() => {
        router.go('/');
        store.set('user', {}, true);
    })
});

mediator.on('chatPage-initiated', () => {
    mediator.emit('chatPage-get-chats')
});


mediator.on('chatPage-get-chats', async () => {

    await chatDealer.uploadAllChats();
/*    ChatAPI.getChats()
        .then((res) => {
            if (res.status === 200) {
                const list: Record<string, Record<string, string | number>> = {};

                res.response.forEach((chat: Record<string, string | number>) => {
                    chat['avatar_file'] = `https://ya-praktikum.tech/api/v2/resources/${chat.avatar}`
                    list[chat.id] = chat;
                })
                store.replace('chatPage.chatList.list',list);
                console.log(list)
                return list;
            }
        })
   /*     .then( (list) => {
           Object.entries(list).forEach(([id, item]) => {
               ChatAPI.requestChatToken(id)
                   .then((res) => {
                   if (res.status === 200) {
                       item.token = res.response.token;
                   }
               })
            })

            console.log(list)
           return list
        })*/
      /*  .then((list) => {

            Object.entries(list).forEach(([id, item]) => {

                const socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${id}/${item.token}`);

                list.socket = socket;

                socket.addEventListener('open', () => {
                    console.log(`Соединение c ${list.title} установлено`);
                    socket.send(JSON.stringify({
                        content: 'Моё второе сообщение миру!',
                        type: 'message',
                    }));
                });

                socket.addEventListener('close', event => {
                    if (event.wasClean) {
                        console.log(`Соединение закрыто чисто с ${list.title}`);
                    } else {
                        console.log(`Обрыв соединения с ${list.title}`);
                    }

                    console.log(`Код: ${event.code} | Причина: ${event.reason}`);
                });

                socket.addEventListener('message', event => {
                    console.log('Получены данные', event.data);
                });

                socket.addEventListener('error', event => {
                    console.log('Ошибка', event.message);
                });

            })
        })*/
});

mediator.on('chatPage-new-chat', async (title) => {
    await chatDealer.uploadAllChats(title);
/*    const popupInput = store.getState('chatPage.popupNewChat');
    (popupInput.popup as () => Promise<any>)().then((res) => {
        ChatAPI.createChat(res).then((res) => {
            if (res.status === 200) {
                mediator.emit('chatPage-get-chats')
            }
        })
    })*/
})

mediator.on('chatPage-chat-list-action', (id, action) => {
    if (action === 'delete') {
        ChatAPI.deleteChat(id).then((res) => {
            if (res.status === 200) {
                mediator.emit('chatPage-get-chats')
            }
        });
    }
})


mediator.on('chatPage-chat-select', (id) => {
    let currentChat = store.getState(`chats.${id}`)
    let user = store.getState('user');
    if (!user) return;
    if (!currentChat) {
        currentChat = {};
        ChatAPI.requestChatToken(id).then((res) => {
            if (res.status === 200) {
                currentChat.token = res.response.token;
            }

            const socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/6/1/${currentChat.token}`);

            socket.addEventListener('open', () => {
                console.log('Соединение установлено');

                socket.send(JSON.stringify({
                    content: 'Моё второе сообщение миру!',
                    type: 'message',
                }));
            });

            socket.addEventListener('close', event => {
                if (event.wasClean) {
                    console.log('Соединение закрыто чисто');
                } else {
                    console.log('Обрыв соединения');
                }

                console.log(`Код: ${event.code} | Причина: ${event.reason}`);
            });

            socket.addEventListener('message', event => {
                console.log('Получены данные', event.data);
            });

            socket.addEventListener('error', event => {
                console.log('Ошибка', event.message);
            });
        })
    }
})
