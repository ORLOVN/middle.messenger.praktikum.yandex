import Block            from '../../utils/Block';
import {PlainObject}    from '../../utils/types';
import                       './notification.css';

export class Notification extends Block {
    constructor(props: {
        name?: string,
        display?: boolean,
        showTime?: number,
        content?: string,
        events?: {
            click:() => void
        }
    } = {
        display: false,
        showTime: 3000,
    }) {

        super(props);
        this.hide();
    }

    componentDidUpdate(_oldProps: PlainObject, newProps: PlainObject, addedProps:PlainObject): boolean {
        if (addedProps.content) {
            this.setProps({display: true})
            return false;
        }
        if (newProps.display) {
            this._meta.props.display = true;
            setTimeout(() => {
                this.hide();
            }, 2000)
        }
        return true;
    }

    render():string {
        return `
<div class="popup-note">
    <div class="popup-note__field">
        {{{content}}}
    </div>
</div>
`
    }
}
