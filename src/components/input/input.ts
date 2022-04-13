import Block from "../../utils/Block";

export class Input extends Block {
    constructor(props: {
        name?: string,
        value?: string,
        placeholder?:string,
        class?: string,
        events?: {
            keyup?   :(event?: Event) => void
            keydown? :(event?: Event) => void
        }
    }) {

        super(props);
    }

    render():string {

        return `<input name="{{name}}" value="{{value}}" class="{{class}}" placeholder="{{placeholder}}"/>`;
    }
}
