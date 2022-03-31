import Chat from "./Chat";

class ChatDealer {
    private chatsAddress:    string;
    private chatListAddress: string;
    private chatPaneAddress: string

    private readonly chats:        Chat[];
    private          _currentChat: Chat | undefined;
    private static   __instance:   ChatDealer;

    constructor(chatsAddress: string, chatListAddress: string, chatPaneAddress: string, id: string) {
        if (ChatDealer.__instance) {
            return ChatDealer.__instance;
        }
        this.chatListAddress  = chatListAddress;
        this.chatPaneAddress  = chatPaneAddress;

        this.chats            = [];
        this._currentChat     = undefined;

        ChatDealer.__instance = this;
        Object.assign(window, {chatDealer :this});
    }
    _OnSwitch(id: string) {

        this._currentChat.leave();
        const chat = this.getChat(id);
        this._currentChat = chat;
        this._currentChat.settle();
    }
    go(id: string) {
        if (!this._currentChat || this._currentChat.getId() !== id) {
            this._OnSwitch(id);
        }
    }

    getChat(id: string): Chat | undefined {
        return this.chats.find(chat => chat.match(id));
    }

}

export default new ChatDealer()
