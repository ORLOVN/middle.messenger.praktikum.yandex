export const tmpl=`
<div class="signin__back">
<div class="signin__pane">
<div class="signin__pane-name">Вход</div>
<form class="signin__form" action="" method="get" id="app-signinForm" novalidate>
    <div class="signin__input-assembly">
        <div class="signin__input-wrap">
            <input class="signin__input" type="text" name="login" id="app-login" placeholder="ivan123">
        </div>    
        <div class="signin__bottom-line"></div>
        <label for="app-login" id="app-loginLabel" class="signin__discription" required>Введите логин</label>
    </div>
    <div class="signin__input-assembly">
        <div class="signin__input-wrap">
            <input class="signin__input" type="password" name="password" id="app-password" placeholder="password">
        </div>    
        <div class="signin__bottom-line"></div>
         <label for="app-password" id="app-passwordLabel" class="signin__discription" required>Введите пароль</label>
    </div>
    <div class="signin__submit-button">
        <button type="submit" id="app-submit">Вход</button>
    </div>
</form>
<div class="signin__signup-link" id="app-signupLink"><a href="../signup">Нет аккаунта?</a></div>
</div>
</div>
`
