import Block        from "../../../../utils/Block";
import {PropEvents} from '../../../../utils/types'
export class AvatarSetting extends Block {

    constructor(props: {
        name?: string,
        imgRef?: string,
        events?: PropEvents
    }) {
        if (!props.events) {
            props.events = {};
        }

        props.events['#avatar'] = {
            change: (event: Event) => {
                if (!event.target) return;
                const formElement = ((event.target as HTMLElement).closest('#avatarSettingsForm') as HTMLFormElement);
                if (!formElement) return;
                formElement.requestSubmit();
            }
        }

        super({...props});

    }

    render():string {
// eslint-disable-next-line max-len
        return `
        
<form class="avatar-setting__pane" id="avatarSettingsForm">
    <div class="avatar-setting__avatar" {{#if avatar_file}} style="background-image: url('{{avatar_file}}')" {{/if}}>
        <label class="avatar-setting__avatar-input-label" for="avatar">
        <input class="avatar-setting__avatar-input" id="avatar" type="file" name="avatar" accept="image/*">
        </label>
        
        {{{avatarButton}}}
    </div>
    <div class="avatar-setting__caption">
        {{#if display_name}}
        {{display_name}}
        {{else}}
        {{first_name}}
        {{/if}}
    </div>
</form>
`;

    }
}
