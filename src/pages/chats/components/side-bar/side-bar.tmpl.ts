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
        
        {{#case 'users'}}
///
        {{/case}}
        
    {{/switch}}
{{{contextMenu}}}
{{{popupNewChat}}}
 </div>
    
`

