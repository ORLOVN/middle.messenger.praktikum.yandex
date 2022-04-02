import Chat, {ChatData} from "./Chat";
import ChatAPI from "../../api/chat-api";
import store from "../../utils/Store";
import {storeAddresses} from "../../utils/globalVariables";
import mediator from "../../utils/Mediator";
import {response} from "express";

class ChatDealer {

    private readonly chats:        Chat[];
    private          _currentChat: Chat | undefined;
    private static   __instance:   ChatDealer;

    private          _readingPosition:   number  = 0;
    private readonly _readingCount:      number  = 10;
    private          _readingEnd:        boolean = false;

    constructor() {
        if (ChatDealer.__instance) {
            return ChatDealer.__instance;
        }

        this.chats            = [];
        this._currentChat     = undefined;

        ChatDealer.__instance = this;
        Object.assign(window, {chatDealer :this});
    }
    _OnSwitch(id: number) {
        const chat = this.getChatById(id);
        if (!chat) return;
        if (this._currentChat) {
            this._currentChat.leave();
        }
        this._currentChat = chat;
        this._currentChat.mount();
    }

    async uploadChats(start: number, count: number, filter: string = ''){
        const res = await ChatAPI.getChats(start, count, filter)
        if (res.status === 200) {
            if (res.response.length === 0) {
                this._readingEnd = true;
            } else {
                res.response.forEach((chat: ChatData) => {
                    this.chats.push(new Chat(chat));
                })
            }
        }

    }

    async uploadNextChats(filter: string = ''){
        if (!this._readingEnd) {
            await this.uploadChats(this._readingPosition, this._readingCount, filter)
            this._readingPosition += this._readingCount;
            return true;
        } else {
            return false;
        }
        return false;
    }

    async uploadAllChats(filter: string = '') {

        while (await this.uploadNextChats(filter)) {
        }
        console.log(this.chats)
        this.mount();
    }

    async createNewChat(title: string) {
        /*const popupInput = store.getState('chatPage.popupNewChat');
        const title = await (popupInput.popup as () => Promise<any>)()*/
        const res = await ChatAPI.createChat(title)
        if (res.status === 200) {
            await this.uploadAllChats();
        }
    }

    async deleteChat(id: number) {

    }

    doAction(id: number, action: string) {

    }

    mount(){
        const list: Record<string, Record<string, string | number>> = {};
        this.chats.forEach((chat: Chat) => {
            list[chat.getId()] = chat.makeProps();
        })
        store.replace(storeAddresses.ChatList,list);
    }

    go(id: number) {
        if (!this._currentChat || this._currentChat.getId() !== id) {
            this._OnSwitch(id);
        }
    }

    getChatById(id: number): Chat | undefined {
        return this.chats.find(chat => chat.match(id));
    }

}

export default new ChatDealer()
