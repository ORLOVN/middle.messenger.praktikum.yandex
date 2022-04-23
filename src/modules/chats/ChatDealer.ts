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
            if (!Array.isArray(idList)) return;
            await this.addUsers(idList[0]);
            return idList[0];
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
    }

    async getChatUser(chatId: number) {
        let maxIterations = 50;
        let reachedEnd = false;
        let offset = 0;
        const step = 10;
        const userList = [];
        while ( maxIterations>0 && !reachedEnd) {
            const res = await chatApi.getChatUsers(chatId, offset, step );
            offset += step;
            reachedEnd = !res.response.length;
            res.response.forEach((element: User) => element.avatar_file = element.avatar ? `${AVATAR_URL}${element.avatar}` : '' )
            userList.push(...res.response)
            maxIterations--;
        }
        return userList;
    }

    async addUsers(_chatId: number = -1) {
        try {
            const chatId = _chatId !== -1 ? _chatId : this._currentChat!.getId()
            await this.uploadUsers();

            const user = store.getState(storeAddresses.User)
            const chatUserList = (await this.getChatUser(chatId)).filter((e) => e.id !== user.id);
            console.log(chatUserList)

            store.set(storeAddresses.SideBar, {currentList: 'users'})
            let userList = store.getState(`${storeAddresses.UserList}`);
            if (!Array.isArray(userList.selectedList)) return;



            userList.selectedList.push(...chatUserList);
            store.set(storeAddresses.UserList, userList);

            await new Promise((resolve, reject) => {
                this.chatMasterDone = resolve;
                this.chatMasterBack = reject;
            });

            userList = store.getState(`${storeAddresses.UserList}`);
            if (!Array.isArray(userList.selectedList)) return;

            const selectedList = userList.selectedList;
            const idsToAdd: number[] = [];
            const idsToRemove: number[] = [];

            selectedList.forEach((selected) => {
                let match = false;
                chatUserList.forEach((existing) => {
                    match = selected.id === existing.id ? true : match;
                })
                if (!match) idsToAdd.push(selected.id);
            })

            chatUserList.forEach((existing) => {
                let match = false;
                selectedList.forEach((selected) => {
                    match = selected.id === existing.id ? true : match;
                })
                match = user.id === existing.id ? true : match;
                if (!match) idsToRemove.push(existing.id);
            })

            if (idsToAdd.length > 0) {
                await chatApi.addUsersToChat(idsToAdd, chatId);
            }

            if (idsToRemove.length > 0) {
                await chatApi.deleteUsersFromChat(idsToRemove, chatId);
            }

            store.set(storeAddresses.SideBar, {currentList: 'chats'})

        } catch (e) {
            store.set(storeAddresses.SideBar, {currentList: 'chats'})
        }
    }

    userSelect(id: number) {
        const userList = store.getState(`${storeAddresses.UserList}`);
        if (!Array.isArray(userList.list) || !Array.isArray(userList.selectedList)) return;

        const nextList = userList.list.filter(e => e.id !== id);
        if (nextList.length !== userList.list.length) {
            const item = userList.list.find(e => e.id === id);
            userList.selectedList.push(item);
            userList.list = nextList;
            store.set(storeAddresses.UserList, userList);
            return;
        }

        const nextSelectedList = userList.selectedList.filter(e => e.id !== id);
        if (nextSelectedList.length !== userList.selectedList.length) {
            const item = userList.selectedList.find(e => e.id === id);
            userList.list.push(item);
            userList.selectedList = nextSelectedList;
            store.set(storeAddresses.UserList, userList);
            return;
        }



    }

    chatMasterDone = ({}={}) => {}
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
