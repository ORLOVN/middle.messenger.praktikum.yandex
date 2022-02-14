import Block from "../../../../utils/Block";

export class ProfileItem extends Block {

    constructor(props: {
        name?: string,
        value?: string,
        editableValue?: string,
        type?: string,
        placeholder?:string,
        label?: string,
        editing?: boolean,
        events?: {
            keyup?:(eventProp?) => void
            blur?:(eventProp?) => void
        }
    }) {

        props.editableValue = props.editableValue || props.value;
        super({...props});

    }

    componentDidUpdate(oldProps: any, newProps: any): boolean {
        //console.log(`${PropName} - ${oldValue} - ${newValue}`);
        if (!oldProps.editing && newProps.editing) {
            newProps.editableValue = newProps.value;
        }
        return true;

    }
    render():string {
// eslint-disable-next-line max-len
        return `
        
 <div class="profile-item">
     <div class="profile-settings__item-label">{{label}}</div>
     {{#if editing}}
     <div class="profile-item__input-wrap">

       <input class="profile-item__input" type="{{type}}" name="{{name}}" placeholder="{{placeholder}}" value="{{editableValue}}">
     </div>
     {{else}}
     <div class="profile-item__value">
        {{value}}
     </div>
     {{/if}}   
     <div class="profile-item__bottom-line"></div>
     {{#if validLabel}}
     <div class="profile-item__valid-label">
     {{validLabel}}
     </div>
     {{/if}}
 </div>
`;

    }
}
