import Block from "../../utils/Block";

export class InputAssy extends Block {

    constructor(props: {
        name?: string,
        value?: string,
        type?: string,
        placeholder?:string,
        label?: string,
        validLabel?: string,
        events?: {
            keyup?:(event?: Event) => void,
            blur?:(event?: Event) => void
        }
    }) {

        super({...props, eventsSelector:'input'});

    }

    render():string {

        return `
        
<div class="input-assy">
    <div class="input-assy__wrap">
        <input name="{{name}}" type="{{type}}" value="{{value}}" class="input-assy__input" placeholder="{{placeholder}}"/>
    </div>    
    <div class="input-assy__bottom-line"></div>
    <label class="{{#if validLabel}}input-assy__label_red{{else}}input-assy__label{{/if}}" for="{{name}}">{{#if validLabel}}{{validLabel}}{{else}}{{label}}{{/if}}</label>
</div>

    `;

    }
}
