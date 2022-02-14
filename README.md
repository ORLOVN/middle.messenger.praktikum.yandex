
#Приложение Мессенджер

###Общая информация
Приложение выполнено по заданию Yandex practicum (sprint no 2)\

Проект развернут на Netlify по ссылке https://orlovn89.netlify.app/

*!!!!!Обратите внимание, папка dist должна содержать _redirects для Netlify. Поэтому в .gitignore добавлено исключение !/dist/_redirects.
Если файла _redirects нет в dist, скопируйте его из root.*

###Скрипты запуска (с помощью npm run):
 * "start" (значение "node server.js")- стартует сервер на 3000 порту\
 * "dev" (значение "parcel src/index.html")- собирает проект в папку dist (для разработки)\
 * "build" (значение "parcel build src/index.html") - собирает проект в папку dist (для продакшина)



###Описание проекта
Проект будет представлять собой мессенджер, наподобие telegram. В рамках первого спринта пока созданы прототипы экранов.
Некоторые прототипы имеют формы, к которым уже прописана валидация. Также имеются ссылки, с помощью которых можно переключаться
между страницами. 

####Список доступных страниц:
(В верху страницы находится меню навигации, для удобства)
* Вход https://friendly-haibt-bebf56.netlify.app/signin
* Регистрация https://friendly-haibt-bebf56.netlify.app/signup
* Чаты https://friendly-haibt-bebf56.netlify.app/chats
* Профиль https://friendly-haibt-bebf56.netlify.app/profile
