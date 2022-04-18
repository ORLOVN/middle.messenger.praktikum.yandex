export default `
    <ul id="user-list" class="user-list__list-pane">
        {{#each list}}
        <li class="user-list__element" data-id="{{id}}" style="order:{{this.order}}">
            {{#if selectable}}
            <input type="checkbox"  id="{{id}}" name="{{id}}">
            <label for="{{id}}">
            {{/if}}
            <div class="user-list__avatar-container">
                <div class="user-list__avatar" {{#if this.avatar}} style="background-image: url('{{this.avatar_file}}')" {{/if}}>
                </div>
            </div>
            <div class="user-list__discription">
                <div class="user-list__name">
                    {{this.title}}
                </div>
                <time class="user-list__last-time">
                    {{this.time}}
                </time> 
                <div class="user-list__last-messege">
                    {{this.last_message}}
                </div>          
                <div class="user-list__unread">
                    {{#if this.unread_count}}
                    <div class="user-list__unread-circle">
                        {{this.unread_count}}
                    </div>
                    {{/if}}
                </div>
            </div>
            {{#if selectable}}
            </label>
            {{/if}}
        </li>
        {{/each}} 
    {{{contextMenu}}}
    {{{optionMenu}}}
    {{{popupNewChat}}}
    {{{optionButton}}}
    </ul>

    
`

