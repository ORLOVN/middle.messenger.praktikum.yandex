import Block from '../../../../utils/Block';
export class Message extends Block {

    constructor(props: {
        id: string;
        author: string,
        text: string,
        time: string,
        dateSeparator?: string,
        status?: number,
    }) {
        super({
                ...props,
                scroll: () => {
                    this._element?.scrollIntoView();
                }}
            );
    }

    render():string {
        return `
{{#if dateSeparator}}
<li class="chat-pane__date-caption" style="order: {{orderTime}}">
    {{dateSeparator}}
    <div class="chat-pane__bottom-line">
    </div>
</li>
{{else}}
<li class="{{#if author}}chat-pane__received-message{{else}}chat-pane__sent-message{{/if}}" style="order: {{orderTime}}">
    {{#if author}}<div class="chat-pane__message-author">{{author}}</div> {{/if}}
    <div class="chat-pane__message">
    {{text}}
    </div>
    <time class="chat-pane__time">
    {{time}} <span class="material-icons {{#if (statusRead status)}}message__icon_read{{/if}}">
    {{#if (statusAwaiting status)}}schedule{{/if}}
    {{#if (statusSent status)}}done{{/if}}
    {{#if (statusReceived status)}}done_all{{/if}}
    {{#if (statusRead status)}}done_all{{/if}}
    </span>
    </time>
</li>
{{/if}}
`;
    }
}
