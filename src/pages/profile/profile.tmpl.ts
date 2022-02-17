export default `
<div class="profile-settings__back-pane">
    {{{backButton}}}
    {{#if editing}}
    <form class="profile-settings__settings-pane">
    {{else}}
    <div class="profile-settings__settings-pane">
    {{/if}}
        <div class="profile-settings__avatar-pane">
            <div class="profile-settings__avatar">
        
            </div>
            <div class="profile-settings__avatar-caption">
            Иван
            </div>
        </div>
        <div class="profile-settings__items">
        {{#if changingPassword}}
            {{{passwordInputs}}}
        {{else}}
            {{{profileInputs}}}
        {{/if}}
        </div>
        <div class="profile-settings__buttons-pane">
        {{#if editing}}
                <div class="profile-settings__button">
                    {{{accept}}}
                    <div class="profile-settings__bottom-line"></div>
                </div> 
                <div class="profile-settings__button">
                    {{{cancel}}}
                    <div class="profile-settings__bottom-line"></div>
                </div>
        {{else}}
                <div class="profile-settings__button">
                    {{{changeData}}}
                    <div class="profile-settings__bottom-line"></div>
                </div> 
                <div class="profile-settings__button">
                    {{{changePassword}}}
                    <div class="profile-settings__bottom-line"></div>
                </div>
        {{/if}}                 
        </div>                      
{{#if editing}}</form>{{else}}</div>{{/if}}
    </form>   
`
