import Block from '../../../../utils/Block';
import tmpl from './message.tmpl';
export class Message extends Block {

    constructor(props: {id: string; author: string, text: string, time: string, status: number}) {
        super(props);
    }

    render():string {
        return tmpl;
    }
}
