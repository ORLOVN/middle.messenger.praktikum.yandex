export default `

<div class="side-bar__back">
    <div class="side-bar__header">
        {{{searchField}}}
        {{{addChatButton}}}
        {{{profileButton}}}
        {{{logoutButton}}}
    </div>
    {{#switch currentList}}
        {{#case 'chat'}}
    <ul id="side-bar" class="side-bar__list-pane">
        {{{switch}}}
    </ul>
        {{/case}}
        
        {{#case 'user'}}
    <ul id="side-bar" class="side-bar__list-pane">
        {{{switch}}}
    </ul>
        {{/case}}
        
    {{/switch}}
{{{contextMenu}}}
{{{popupNewChat}}}
 </div>
    
`
