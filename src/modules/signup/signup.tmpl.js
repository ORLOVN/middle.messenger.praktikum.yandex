export const temp=`
<div class="signup__back">
<div class="signup__pane">
<div class="signup__pane-name">Новый пользователь</div>
<form class="signup__form" id="app-signupForm" action="" method="get" novalidate>
    <div class="signup__input-assembly">
        <div class="signup__input-wrap">
            <input class="signup__input" type="text" name="login" id="app-login" placeholder="mylogin999" required>
        </div>    
        <div class="signup__bottom-line"></div>
        <label class="signup__discription" id="app-loginLabel" for="app-login">Логин</label>
    </div>
    <div class="signup__input-assembly">
        <div class="signup__input-wrap">
            <input class="signup__input" type="email" name="email" id="app-email" placeholder="example@e-mail.com" required>
        </div>    
        <div class="signup__bottom-line"></div>
        <label class="signup__discription" id="app-emailLabel" for="app-email">email</label>
    </div>
    <div class="signup__input-assembly">
        <div class="signup__input-wrap">
            <input class="signup__input" type="password" name="password" id="app-password" placeholder="password" required>
        </div>    
        <div class="signup__bottom-line"></div>
         <label class="signup__discription" id="app-passwordLabel" for="app-password">Пароль</label>
    </div>
    <div class="signup__input-assembly">
        <div class="signup__input-wrap">
            <input class="signup__input" type="password" name="repassword" id="app-repassword" placeholder="password" required>
        </div>    
        <div class="signup__bottom-line"></div>
        <label class="signup__discription" id="app-repasswordLabel" for="app-repassword">Пароль повторно</label>
    </div>
        <div class="signup__input-assembly">
        <div class="signup__input-wrap">
            <input class="signup__input" type="text" name="first_name" id="app-first_name" placeholder="Иван" required>
        </div>    
        <div class="signup__bottom-line"></div>
        <label class="signup__discription" id="app-first_nameLabel" for="app-first_name">Имя</label>
    </div>
    <div class="signup__input-assembly">
        <div class="signup__inputwrap">
            <input class="signup__input" type="text" name="second_name" id="app-second_name" placeholder="Иванов" required>
        </div>    
        <div class="signup__bottom-line"></div>
        <label class="signup__discription" id="app-second_nameLabel" for="app-second_name">Фамилия</label>
    </div>
    <div class="signup__input-assembly">
        <div class="signup__input-wrap">
            <span>+7</span><input class="signup__input" type="text" name="phone" id="app-phone" placeholder="(888)888-8888" required>
        </div>    
        <div class="signup__bottom-line"></div>
        <label class="signup__discription" id="app-phoneLabel" for="app-phone">Телефон</label>
    </div>
    <div class="signup__submit-button">
        <button type="submit" id="app-submit">Регистрация</button>
    </div>
</form>
<div class="signup__signin-link"><a href="/signin">Уже есть аккаунт?</a></div>
</div>
</div>
`
