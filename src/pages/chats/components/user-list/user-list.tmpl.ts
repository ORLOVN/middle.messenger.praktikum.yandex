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
            
            <div class="user-list__description">
            
                <div class="user-list__login">
                    {{this.login}}
                </div>
                
                <div class="user-list__name">
                    {{this.first_name}} {{this.second_name}}
                </div>          
                
            </div>
            {{#if selectable}}
            </label>
            {{/if}}
        </li>
        {{/each}} 
    {{{backButton}}}
    </ul>

    
`

