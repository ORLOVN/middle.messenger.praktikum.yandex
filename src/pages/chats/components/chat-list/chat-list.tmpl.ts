export default `
    <ul id="chatlist" class="chatlist__list-pane">
        {{#each list}}
        <li class="chatselector" data-id="{{id}}" style="order:{{this.order}}">
            <div class="chatselector__avatar-container">
                <div class="chatselector__avatar" {{#if this.avatar}} style="background-image: url('{{this.avatar_file}}')" {{/if}}>
                </div>
            </div>
            <div class="chatselector__discription">
                <div class="chatselector__name">
                    {{this.title}}
                </div>
                <time class="chatselector__last-time">
                    {{this.time}}
                </time> 
                <div class="chatselector__last-messege">
                    {{this.last_message}}
                </div>          
                <div class="chatselector__unread">
                    {{#if this.unread_count}}
                    <div class="chatselector__unread-circle">
                        {{this.unread_count}}
                    </div>
                    {{/if}}
                </div>
            </div>
        </li>
    </ul>
    
`

