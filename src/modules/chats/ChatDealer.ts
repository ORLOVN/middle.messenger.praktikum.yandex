import Chat, {ChatData} from "./Chat";
import ChatAPI from "../../api/chat-api";
import store from "../../utils/Store";
import {storeAddresses} from "../../utils/globalVariables";
import userApi from "../../api/user-api";

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
    async _OnSwitch(id: number) {
        const chat = this.getChatById(id);
        if (!chat) return;
        if (this._currentChat) {
            this._currentChat.leave();
        }
        this._currentChat = chat;
        await this._currentChat.mountChatPane();
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
        this._readingPosition = 0;
        this._readingEnd = false;
        let count = 1000;
        while (await this.uploadNextChats(filter)) {
            count --;
            if (count <= 0) throw new Error('API requests for reading chat list are not success. The count reached over 1000 ')
        }
        this.updateStore();
    }

    async uploadUsers() {
        const res = await userApi.search()
        store.set(storeAddresses.UserList, {list: res.response})
    }

    async createNewChat(title: string) {
        /*const popupInput = store.getState('chatPage.popupNewChat');
        const title = await (popupInput.popup as () => Promise<any>)()*/
        const res = await ChatAPI.createChat(title)
        if (res.status === 200) {
            await this.uploadChats(0, 1)
            this.updateStore();
        }
    }

    async deleteChat(id: number) {
        const res = await ChatAPI.deleteChat(id)
        if (res.status === 200) {
            if (this._currentChat && this._currentChat.getId() === id) {
                this._currentChat.leave();
                this._currentChat = undefined;
            }

            const index = this.getChatIndexById(id);
            if (index !== undefined) {
                this.chats.splice(index,1);
            }
            this.updateStore();
        }
    }

    async sendMessage() {
        if (this._currentChat)
        await this._currentChat.sendMessage();
    }

    inputMessageUpdate(message: string) {
        if (this._currentChat) {
            this._currentChat.inputMessageUpdate(message);
        }
    }

    async doAction(id: number, action: string) {
        if (action === 'delete') {
            await this.deleteChat(id);
        }
        if (action === 'change-avatar') {
            console.log(id, action)
        }
        if (action === 'new-chat') {
            await this.uploadUsers()
            store.set(storeAddresses.SideBar, {currentList: 'chats'})
            const res = await new Promise((resolve, reject) => {
                this.selected = resolve;
                this.rejected = reject;
            });
            await this.createNewChat(res as string);
        }
    }

    // @ts-ignore
    selected = (value: string) => {}
    rejected = () => {}

    async changeAvatar(fromData: FormData) {
        if (this._currentChat) {
            const res = await this._currentChat.changeAvatar(fromData);
            if (res.status === 200) {
                await this._currentChat.updateModel();
                this._currentChat.mountChatPane();
                this._currentChat.updateChatList();
            }
        }
    }

    updateStore(){
        const list: Record<string, string | number>[] = [];
        this.chats.forEach((chat: Chat) => {
            list.push(chat.makeProps());
        })
        store.set(storeAddresses.ChatList,{list: list});
    }

    go(id: number) {
        if (!this._currentChat || this._currentChat.getId() !== id) {
            this._OnSwitch(id);
        }
    }

    getChatById(id: number): Chat | undefined {
        return this.chats.find(chat => chat.match(id));
    }

    getChatIndexById(id: number): number | undefined{
        return this.chats.findIndex((chat) => chat.match(id));
    }
}

export default new ChatDealer()
