export default `
<div class="chat-pane">
    <div class="chat-pane__header">
        <div class="chat-pane__avatar">
        </div>
        <div class="chat-pane__contact-name">
        {{name}}        
        </div> 
        <div class="chat-pane__contact-status">
        {{status}}
        </div>                                                                  
    </div>
    <div class="chat-pane__main-pane">
        <div class="chat-pane__messages-pane">
            <div class="chat-pane__date-section">
                <time class="chat-pane__date-caption">
                Сегодня
                </time>
                <div class="chat-pane__bottom-line">
                </div>
                <ul class="chat-pane__messages-section">                               
                {{{messageList}}}
                </ul>                
            </div>
        </div>
        <div>
        <!-- no content -->
        </div>
        {{{messageInput}}}

        {{{sendingButton}}}
    </div>
</div>
`
