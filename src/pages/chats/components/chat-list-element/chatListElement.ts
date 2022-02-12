import Block from '../../../../utils/Block';
import tmpl from './chatListElement.tmpl';

export class ChatListElement extends Block {
    constructor(props: {
        id: string,
        name: string,
        avatar: string,
        unread: number,
        time: string,
        lastmessage: string,
        events?: { click:() => void}}) {

        super({...props});
    }

    render(): string {
        return tmpl;
    }
}
