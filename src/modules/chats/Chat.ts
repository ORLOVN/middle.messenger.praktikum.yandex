import store from "../../utils/Store";
import ChatAPI from "../../api/chat-api";

type Message = {
    id: string,
    time: string,
    user_id: string,
    content: string,
    type: string,
    file?: {
        id: number,
        user_id: number,
        path: number,
        filename: number,
        content_type: string,
        content_size: number,
        upload_date: string,
    }
}

type ChatGeneralData = {
    title:        string,
    avatar:       string,
    unread_count: number,
    last_message: {
        user: {
            first_name:  string,
            second_name: string,
            avatar:      string,
            email:       string,
            login:       string,
            phone:       string
        },
        time:    string,
        content: string;
    }
}

export default class Chat {
    private chatData: ChatGeneralData;

    private chatListAddress: string;
    private chatPaneAddress: string

    private connected:       boolean;
    private messages:        Message[];
    private lastuploaded
    private id:              string;
    private userId:          string;
    private socket:          WebSocket;
    private token:           string;
    constructor(chatListAddress: string, chatPaneAddress: string, id: string) {
        this.chatListAddress = chatListAddress;
        this.chatPaneAddress = chatPaneAddress;
        this.id = id;
    }

    getId(){
        return this.id
    }

    match(id: string) {
        return isEqual(id, this.id);
    }

    switch(){
        store.set(`${this.chatPaneAddress}`, this.getChat())
    }

    async add(){
            if (!this.token) {
                const res = await  ChatAPI.requestChatToken(this.id)
                if (res.status === 200) {
                    this.token = res.response.token;
                }
            }

            if (!this.socket) {

                const socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${this.userId}/${this.id}/${this.token}`);

                this.socket = socket;

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
                    /*this.messages.unshift({
                            id:      event.data.id,
                            time:    event.data.time,
                            user_id: event.data.user_id,
                            content: event.data.content,
                    });*/
                    console.log('Получены данные', event.data);
                });

                socket.addEventListener('error', event => {
                    console.log('Ошибка', event.message);
                });
            }
    }
}

function isEqual(lhs: any, rhs: any) {
    return lhs === rhs;
}
