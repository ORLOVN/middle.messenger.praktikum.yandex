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

    get value(): string {
        return (this._element as HTMLInputElement).value
    }

    set value(value:string) {
        (this._element as HTMLInputElement).value = value;
        this._meta.props.value = value;
    }

    focus(){
        (this._element as HTMLInputElement).focus();
    }

    render():string {

        return `<input name="{{name}}" value="{{value}}" class="{{class}}" placeholder="{{placeholder}}"/>`;
    }
}
