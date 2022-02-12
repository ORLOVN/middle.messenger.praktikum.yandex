import Block from '../../../../utils/Block';
import Input from "../../../../components/input";
import tmpl from './message-input.tmpl';
export class MessageInput extends Block {

    private _message: string;

    constructor(props: {message?: string }) {
        const messageInput = new Input({
            events: {
                keyup: (eventProp) => this._message = eventProp.target.value
            }
        });


        super({...props, 'messageInput': messageInput});
        this._message = '';
    }

    keyupHandle(target){
        return
    }

    getMassage():string {
        return this._message;
    }

    render():string {
        return tmpl;
    }
}