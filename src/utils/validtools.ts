export function validate (name: string, value: string, aux: string = ''): string {

    let result = '';
    if (name === 'login') {
        if (value.length < 3 || value.length > 20) {
            result = 'В логине должен быть от 3 до 20 символов';
        }
        if (/^[a-zA-Z1-9\-_]+$/.test(value) === false) {
            result = 'В логине должны быть только латинские буквы';
        }
        if (/^\d+$/.test(value) === true) {
            result = 'В логин не должен состоять из цифр';
        }
    } else if (name === 'email') {
        if (value.length < 1) {
            result = 'Email должен быть введен обязательно';
        }
        if (
            /^[\w\-]+@[\w\-]+\.[\w\-]+$/.test(value) === false
        ) {
            result = 'Email должен быть формата name@domen.com';
        }
    } else if (name === 'password') {
        if (/^.{8,40}$/.test(value) === false) {
            result = 'Пароль должен содержать от 8 до 40 символов';
        }
        if (/^.*[A-Z\d]+.*$/.test(value) === false) {
            result = 'Пароль должен содержать хотябы одну заглавную букву или цифру';
        }
    } else if (name === 'repassword') {
        if (value !== aux) {
            result = 'Пароли не совпадают';
        }
        if (value.length < 1) {
            result = 'Пароль должен быть введен повторно';
        }
    } else if (name === 'newpassword') {
        if (/^.{8,40}$/.test(value) === false) {
            result = 'Пароль должен содержать от 8 до 40 символов';
        }
        if (/^.*[A-Z\d]+.*$/.test(value) === false) {
            result = 'Пароль должен содержать хотябы одну заглавную букву или цифру';
        }
    } else if (name === 'phone') {
        if (/^[+\d]\d{9,14}$/.test(value) === false) {
            result = 'Требования к телефону: от 10 до 15 символов, состоит из цифр, может начинается с плюса.';
        }
    } else if (name === 'first_name') {
        if (/^[A-ZА-Я][a-zA-Z\-]*$/.test(value) === false) {
            result = `
            Требования к полю Имя: латиница или кириллица, первая букава заглавная, без цифр и спец символов (дефис допустим)
            `;
        }
    } else if (name === 'second_name') {
        if (/^[A-ZА-Я][a-zA-Z\-]*$/.test(value) === false) {
            result = `
            Требования к полю Фамилия: латиница или кириллица, первая букава заглавная, без цифр и спец символов (дефис допустим)
            `;
        }
    }

    return result;
}
