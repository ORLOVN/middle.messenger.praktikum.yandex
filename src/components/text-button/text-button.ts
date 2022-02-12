import Block from "../../utils/Block";

export class TextButton extends Block {
    constructor(props: {
        content?: string,
        style?: string,
        href?: string,
        events?: {
            click?:(event?: any) => void
        }
    }) {
        super({...props});
    }

    render():string {
        return `<a class="text-button{{#if style}} text-button_{{style}}{{/if}}" {{#if href}}href="{{href}}"{{/if}}>{{content}}</a>`;
    }
}