export default `
<div class="profile-settings__back-pane">
    {{{backButton}}}
    <div class="profile_settings__settings-pane">
        {{{avatarSetting}}}
        <form id="profileSettingsForm" class="profile-settings__fields-pane">
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
        </form>
    </div>
</div>   
`
