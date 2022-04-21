import Chat, {ChatData} from "./Chat";
import ChatAPI from "../../api/chat-api";
import store from "../../utils/Store";
import {AVATAR_URL, storeAddresses} from "../../utils/globalVariables";
import userApi from "../../api/user-api";
import chatApi from "../../api/chat-api";

export type User = {
    avatar:      string;
    avatar_file: string;
    display_name:string;
    email:       string;
    first_name:  string;
    id:          number;
    login:       string;
    phone:       string;
    second_name: string;
}

class ChatDealer {
    //chat handling
    private readonly chats:        Chat[];
    private          _currentChat: Chat | undefined;
    private static   __instance:   ChatDealer;

    // chat reading engine
    private          _readingPosition:   number  = 0;
    private readonly _readingCount:      number  = 10;
    private          _readingEnd:        boolean = false;

    //search engine
    private searchTimer:     NodeJS.Timeout;
    private prevSearchValue: string;

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
                let idList: number[] = [];
                res.response.forEach((chat: ChatData) => {
                    const id = -1 + this.chats.push(new Chat(chat));
                    idList.push(chat.id);
                    chatApi.getChatUsers(chat.id).then((res) => {
                        if (res.status === 200) {
                            this.chats[id].users = res.response
                        }
                    })
                })
                return idList;
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

    async uploadUsers(login: string = '') {
        const res = await userApi.search(login);
        res.response.forEach((element: User) => {
            element['avatar_file'] = element.avatar ? `${AVATAR_URL}${element.avatar}` : ''
        })
        store.set(storeAddresses.UserList, {list: res.response})
    }

    async createNewChat(title: string) {
        /*const popupInput = store.getState('chatPage.popupNewChat');
        const title = await (popupInput.popup as () => Promise<any>)()*/
        const res = await ChatAPI.createChat(title)
        if (res.status === 200) {
            const idList = await this.uploadChats(0, 1)
            this.updateStore();
            return idList;
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

    async doAction(action: string, id: number = 0) {
        if (action === 'delete') {
            await this.deleteChat(id);
        }
        if (action === 'change-avatar') {
            console.log(id, action)
        }

        if (action === 'chat-master-1') {
            try {
                await this.uploadUsers();
                store.set(storeAddresses.SideBar, {currentList: 'chat-master-1'})
                await new Promise((resolve, reject) => {
                    this.chatMasterNext = resolve;
                    this.chatMasterBack = reject;
                });

                this.doAction('chat-master-2')

            } catch (e) {
                store.set(storeAddresses.SideBar, {currentList: 'chats'})
            }
        }

        if (action === 'chat-master-2') {
            try {
                store.set(storeAddresses.SideBar, {currentList: 'chat-master-2'})
                await new Promise((resolve, reject) => {
                    this.chatMasterNext = resolve;
                    this.chatMasterBack = reject;
                });


                const chatIdList = await this.createNewChat('[two-users-chat]');
                if (Array.isArray(chatIdList)){
                    await chatApi.addUsersToChat([userId], chatIdList[0])
                }

            } catch (e) {
                this.doAction('chat-master-1')
            }
        }
            }
    userSelect(id: number) {
        const UserList = store.getState(`${storeAddresses.UserList}`);
        if (!Array.isArray(UserList.list) || !Array.isArray(UserList.selectedList)) return;

        const nextList = UserList.list.filter(e => e.id !== id);
        if (nextList.length !== UserList.list.length) {
            const item = UserList.list.find(e => e.id === id);
            UserList.selectedList.push(item);
            UserList.list = nextList;
            store.set(storeAddresses.UserList, UserList);
            return;
        }

        const nextSelectedList = UserList.selectedList.filter(e => e.id !== id);
        if (nextSelectedList.length !== UserList.selectedList.length) {
            const item = UserList.selectedList.find(e => e.id === id);
            UserList.list.push(item);
            UserList.selectedList = nextSelectedList;
            store.set(storeAddresses.UserList, UserList);
            return;
        }



    }

    chatMasterNext = ({}={}) => {}
    chatMasterBack = ({}={}) => {}

    async searchFunction(searchValue: string) {
        const currentList = store.getState(`${storeAddresses.SideBar}`).currentList;
        if (currentList === 'chats') {

        }

        if (currentList === 'users') {
            await this.uploadUsers(searchValue);
        }
    }

    async searchInput(searchValue: string, enterKey: boolean = false){
        clearTimeout(this.searchTimer);
        if (enterKey) {
            if (this.prevSearchValue !== searchValue) {
                this.prevSearchValue = searchValue;
                await this.searchFunction(searchValue);
            }
        } else {
            this.searchTimer = setTimeout(async ()=>{
                await this.searchFunction(searchValue);
            },1000);
        }
    }

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
