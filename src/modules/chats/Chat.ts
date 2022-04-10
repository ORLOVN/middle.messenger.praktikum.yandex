import store from "../../utils/Store";
import ChatAPI from "../../api/chat-api";
import {storeAddresses} from "../../utils/globalVariables";
import {isArray} from "../../utils/types";

type Message = {
    id: number,
    time: Date,
    user_id: number,
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

    private readonly messages:        Message[] = [];
    private          lastReading:     number = 0;
    private          countReading:    number = 20;

    private          inputMessage:    string;
    private          lastGot:         number;
    private          id:              number;
    private          userId:          string;
    private          socket:          WebSocket;
    private          token:           string;



    constructor(chatData: ChatData) {
        this.chatData = chatData;
        this.id = chatData.id;
        console.log(this.messages)
    }

    getChatData(): ChatData {
        return this.chatData
    }

    inputMessageUpdate(message: string) {
        this.inputMessage = message;
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

    getMessages(offset: number) {
        this.socket.send(JSON.stringify({
            content: `${offset}`,
            type: 'get old',
        }));
    }

    async mountChatPane() {
        const chatData = this.chatData;
        store.set(storeAddresses.ChatPane,{
            chatId:         chatData.id,
            title:          chatData.title,
            avatar_file:    chatData.avatar ? `https://ya-praktikum.tech/${chatData.avatar}` : '',
        })
        await this.connect();
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

    async sendMessage() {
        if (!this.inputMessage) return
        if (!this.socket) {
            await this.connect();
        }

        if (this.socket) {
            this.socket.send(JSON.stringify({
                content: this.inputMessage,
                type: 'message',
            }));
        }

        this.inputMessage = '';
    }

    async uploadMessages() {
        if (this.lastReading === 0) {
            const res = await ChatAPI.getNewMessagesCount(this.id)
            let unread_count = 0;
            if (res.status === 200) {
                unread_count = res.response.unread_count;
            }

            if (unread_count === 0) {
                this.getMessages(0);
                this.lastReading += this.countReading;
            }

            for (let i = 0; i <=unread_count - 1; i += 20) {
                this.getMessages(i);
                this.lastReading += this.countReading;
            }
        } else {
            this.getMessages(this.lastReading);
            this.lastReading += this.countReading;
        }
    }
    handleMessage(event: MessageEvent) {
        const messageData = JSON.parse(event.data);
        if (isArray(messageData)) {
            messageData.forEach((message: {
                content:    string,
                id:         number,
                time:       string,
                user_id:    number,
            }) => {
                this.messages.push({
                    id:         message.id,
                    time:       new Date(message.time),
                    user_id:    message.user_id,
                    content:    message.content,
                    type:       'message',
                })
            })
            this.updateMessagePaneView();
        } else {
            this.messages.push({
                id:         messageData.id,
                time:       new Date(messageData.time),
                user_id:    messageData.userId,
                content:    messageData.content,
                type:       messageData.type,
            })
        }

    }

    updateMessagePaneView() {
        const list: Record<string, Record<string, string | number>> = {};
        this.messages.forEach((message: Message) => {
            list[message.id] = {
                author:     '',
                id:         message.id,
                text:       message.content,
                time:       `${message.time.getHours()}:${message.time.getMinutes()}`,
                status:     0,
            }
        })

        store.set(storeAddresses.MessageList, list)
    }

    async connect(){
            this.userId = store.getState('user').id as string;
            if (!this.token) {
                const res = await  ChatAPI.requestChatToken(this.id)
                if (res.status === 200) {
                    this.token = res.response.token;
                    console.log(this.token)
                } else {
                    return
                }
            }

            if (!this.socket) {

                const socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${this.userId}/${this.id}/${this.token}`);
                console.log(`wss://ya-praktikum.tech/ws/chats/${this.userId}/${this.id}/${this.token}`)
                this.socket = socket;

                socket.addEventListener('open', () => {
                    console.log(`Соединение c ${this.chatData.title} установлено`);
                    this.uploadMessages();
                });

                socket.addEventListener('close', event => {
                    if (event.wasClean) {
                        console.log(`Соединение закрыто чисто с ${this.chatData.title}`);
                    } else {
                        console.log(`Обрыв соединения с ${this.chatData.title}`);
                    }

                    console.log(`Код: ${event.code} | Причина: ${event.reason}`);
                });

                socket.addEventListener('message', this.handleMessage.bind(this));

                socket.addEventListener('error', event => {
                    console.log('Ошибка', event.message);
                });
            }
    }
}
