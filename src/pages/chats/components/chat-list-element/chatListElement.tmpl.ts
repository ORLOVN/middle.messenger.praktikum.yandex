export default `
<li class="chatselector" data-id="{{id}}">
<div class="chatselector__avatar-container">
<div class="chatselector__avatar" {{#if avatar}} style="background-image: url('{{avatar_file}}')" {{/if}}>
</div>
    </div>
    <div class="chatselector__discription">
<div class="chatselector__name">
    {{title}}
</div>
<time class="chatselector__last-time">
    {{time}}
</time> 
<div class="chatselector__last-messege">
    {{last_message}}
</div>          
<div class="chatselector__unread">
{{#if unread_count}}
<div class="chatselector__unread-circle">
    {{unread_count}}
</div>
{{/if}}
</div>
</div>
</li>
`
