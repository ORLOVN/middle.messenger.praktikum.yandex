import Block from "../../utils/Block";

export class Button extends Block {
    constructor(props: {
        name?: string;
        content?: string,
        style? :string,
        class?: string,
        type?: string,
        events?: {
            click:({}) => void
        }
    }) {

        super(props);
    }

    render():string {
        return `
<button class = "button{{#if class}} {{class}}{{/if}} {{#if style}} button_{{style}}{{/if}}"  {{#if type}} type="{{type}}" {{/if}}>
 {{{content}}} 
 </button>
`;
    }
}
