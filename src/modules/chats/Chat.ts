import store from "../../utils/Store";
import ChatAPI from "../../api/chat-api";
import {storeAddresses} from "../../utils/globalVariables";

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

export type ChatData = {
    id:           number;
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
    private chatData: ChatData;
    private connected:       boolean;
    private messages:        Message[];
    private lastGot:         number;
    private id:              number;
    private userId:          string;
    private socket:          WebSocket;
    private token:           string;

    private lastReading:     number = 0;
    private countReading:    number = 20;

    constructor(chatData: ChatData) {
        this.chatData = chatData;
        this.id = chatData.id;
    }

    getChatData(): ChatData {
        return this.chatData
    }

    makeProps(): Record<string, string | number> {
        const element: Record<string, string | number> = {};
        const chatData = this.chatData;
        element.id             = chatData.id;
        element.title          = chatData.title;
        element.avatar         = chatData.avatar;
        element.unread_count   = chatData.unread_count;
        element.avatar_file    = chatData.avatar ? `https://ya-praktikum.tech/${chatData.avatar}` : '';
        element.order          = -chatData.id;

        if (element.last_message) {
            element.last_message   = chatData.last_message.content;
            element.time           = chatData.last_message.time;
            element.author         = `${chatData.last_message.user.first_name} ${chatData.last_message.user.second_name}`;
        }

        return element;
    }

    getId(){
        return this.id
    }

    match(id: number) {
        return id === this.id
    }

    async switch(){
        await this.connect()

        store.set(`${storeAddresses.ChatPane}`, this.getChat())
    }

    async getMessages(offset: number) {
        this.socket.send(JSON.stringify({
            content: `${offset}`,
            type: 'get old',
        }));
    }

    mountChatPane() {
        const chatData = this.chatData;
        console.log(this.chatData)
        store.set(storeAddresses.ChatPane,{
            chatId:         chatData.id,
            title:          chatData.title,
            avatar_file:    chatData.avatar ? `https://ya-praktikum.tech/${chatData.avatar}` : '',
        })
    }

    updateChatList() {
        store.set(`${storeAddresses.ChatList}.${this.chatData.id}`,this.makeProps());
    }

    leave() {
        store.set(storeAddresses.ChatPane,{chatId: 0})
    }

    async changeAvatar(fromData: FormData){
        return await ChatAPI.uploadChatAvatar(fromData);
    }

    async updateModel() {
        const count = 10;
        let offset = 0;
        let maxAttempt = 10;
        const request = async () => {
            const res = await ChatAPI.getChats(offset, count, this.chatData.title);
            console.log('offset',offset);
            let foundChat: ChatData | undefined;
            if (res.status === 200) {
                foundChat = res.response.find((chat: ChatData) => chat.id === this.chatData.id);
            }

            if (foundChat) {
                this.chatData = foundChat;
            }

            return !(foundChat || res.response.length === 0)
        }
        while (await request()) {
            offset += count;
            console.log(offset);
            maxAttempt --;
            if (maxAttempt <= 0)  throw new Error('API requests for looking for chat are not success. The count reached over 100 ')
        }

    }
    async connect(){
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
