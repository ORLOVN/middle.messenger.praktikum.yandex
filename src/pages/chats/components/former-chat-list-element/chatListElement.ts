import Block from '../../../../utils/Block';
import tmpl from './chatListElement.tmpl';

export class ChatListElement extends Block {
    constructor(props: {
        id: string,
        title: string,
        created_by: number,
        name: string,
        avatar: string,
        unread_count: number,
        time: string,
        last_message: string,
        order: number;
        events?: { click:() => void}}) {

        super({...props});
    }

    scrollToElement() {
        if (!this._element) return;
        this._element.scrollIntoView({block: "center", behavior: "smooth"});
    }

    render(): string {
        return tmpl;
    }
}
