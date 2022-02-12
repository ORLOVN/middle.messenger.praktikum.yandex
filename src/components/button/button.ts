import Block from "../../utils/Block";

export class Button extends Block {
    constructor(props: {
        content?: string,
        class?: string,
        type?: string,
        events?: {
            click:() => void
        }
    }) {

        super(props);
    }

    render():string {
        return `<button {{#if class}} class="{{class}}" {{/if}}  {{#if type}} type="{{type}}" {{/if}}> {{{content}}} </button>`;
    }
}
