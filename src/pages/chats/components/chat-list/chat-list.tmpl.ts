export default `
    <ul id="chat-list" class="chat-list__list-pane">
        {{#each list}}
        <li class="chat-list__element" data-id="{{id}}" style="order:{{this.order}}">
            <div class="chat-list__avatar-container">
                <div class="chat-list__avatar" {{#if this.avatar}} style="background-image: url('{{this.avatar_file}}')" {{/if}}>
                </div>
            </div>
            <div class="chat-list__discription">
                <div class="chat-list__name">
                    {{this.title}}
                </div>
                <time class="chat-list__last-time">
                    {{this.time}}
                </time> 
                <div class="chat-list__last-messege">
                    {{this.last_message}}
                </div>          
                <div class="chat-list__unread">
                    {{#if this.unread_count}}
                    <div class="chat-list__unread-circle">
                        {{this.unread_count}}
                    </div>
                    {{/if}}
                </div>
            </div>
        </li>
        {{/each}} 
    {{{contextMenu}}}
    {{{optionMenu}}}
    {{{popupNewChat}}}
    {{{optionButton}}}
    </ul>

    
`

