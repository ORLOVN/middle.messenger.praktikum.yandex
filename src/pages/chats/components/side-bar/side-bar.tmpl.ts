export default `

<div class="side-bar__back">
    <div class="side-bar__header">
        {{{searchField}}}
        {{{addChatButton}}}
        {{{profileButton}}}
        {{{logoutButton}}}
    </div>
    {{#switch currentList}}
    
        {{#case 'chats'}}
        {{{chatList}}}
        {{/case}}
        
        {{#case 'chat-master-1'}}
        {{{userList}}}
        {{/case}}
        
        {{#case 'chat-master-2'}}
        {{{chatProperty}}}
        {{/case}}
        
    {{/switch}}
{{{contextMenu}}}
{{{popupNewChat}}}
 </div>
    
`

