export default `
    <ul id="user-list" class="user-list__list-pane">
        {{#each selectedList}}
        <li class="user-list__element_selected" data-id="{{id}}" style="order:{{this.order}}">
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
        </li>
        {{/each}}
        {{#each list}}
        <li class="user-list__element" data-id="{{id}}" style="order:{{this.order}}">
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
        </li>
        {{/each}} 
    {{{backButton}}}
    {{{nextButton}}}
    </ul>

    
`

