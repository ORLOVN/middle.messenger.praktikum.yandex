"use strict";
// Инструменты для валидации форм и остальные утилиты для форм

export function beautifyPhone (str) {
     //функция для приведения телефона к красивому формату (888) 888-8888
     let telFiltered = str.replace(/[^0-9]/g, "");
     let area = telFiltered.substr(0, 3);
     let pre = telFiltered.substr(3, 3);
     let tel = telFiltered.substr(6, 4);
     if (area.length < 3) {
         return "(" + area;
     } else if (area.length === 3 && pre.length < 3) {
         return "(" + area + ")" + " " + pre;
     } else if (area.length === 3 && pre.length === 3) {
         return "(" + area + ")" + " " + pre + "-" + tel;
     }
     return telFiltered;
}

export function validate (
    input,
    badColor = "red",
    goodColor = "green"
) {
    if (!input || !input.label) {
        return true;
    }

    const str = input.value;
    let hasProblem = false;
    if (input.name === "login"){
        if (str.length < 4 || str.length > 20) {
            hasProblem = "В логине должен быть от 4 до 20 символов";
        }
        if (/^[a-zA-Z1-9]+$/.test(str) === false) {
            hasProblem = "В логине должны быть только латинские буквы";
        }
        if (parseInt(str.substr(0, 1))) {
            hasProblem = "Логин должен начинаться с буквы";
        }
    } else

    if (input.name === "email"){
        if (str.length < 1) {
            hasProblem = "Email должен быть введен обязательно";
        }
        if (
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
                str
            ) === false
        ) {
            hasProblem = "Email должен быть формата name@domen.com";
        }
    } else

    if (input.name === "password"){
        if (str.length < 1) {
            hasProblem = "Пароль должен быть введен обязательно";
        }
    } else

    if (input.name === "repassword"){
        if (str.length < 1) {
            hasProblem = "Пароль должен быть введен повторно";
        }
        if (str !== input.password.value) {
            hasProblem = "Пароли не совпадают";
        }
    } else

    if (input.name === "phone"){
        if (/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/.test(str) === false) {
            hasProblem = "Введите телефон полностью";
        }
    } else

    if (input.type === "text" && input.required) {
        if (str.length === 0) {
            hasProblem = `Поле ${input.label.originalText} не должно оставаться пустым`;
        }
    }

    if (hasProblem) {
        input.label.textContent = hasProblem;
        input.label.style.color = badColor;
        return false;
    } else {
        input.label.textContent = input.label.originalText;
        input.label.style.color = goodColor;
    }
    return true;
}

