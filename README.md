#Приложение Мессенджер

###Общая информация
Приложение выполнено по заданию Yandex practicum (sprint no 1)\

Прототипы экранов находятся по ссылке https://www.figma.com/file/zM210yks893au6dEYgdMRP/messanger-app \
Проект развернут на Netlify по ссылке https://friendly-haibt-bebf56.netlify.app

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

* Вход https://friendly-haibt-bebf56.netlify.app/signin
* Регистрация https://friendly-haibt-bebf56.netlify.app/signup
* Чаты https://friendly-haibt-bebf56.netlify.app/chats
* Профиль https://friendly-haibt-bebf56.netlify.app/profile
* Страница 404 https://friendly-haibt-bebf56.netlify.app/any (появляется по любой непредусмотренной ссылке)
* Страница 500    https://friendly-haibt-bebf56.netlify.app/?path=changepsw

####Подключение зависимостей 
Шаблонизатор подключен в src/core.js. Там представлен класс CompClass, который является родителем классов для всех страниц. 
CompClass автоматически подключает шаблон, шаблонизирует (при помощи Handlerbars) и парсит в html. 
Также он подключает все элементы HTML с id, начинающиеся с app-, к объекту для удобной навигации.

Postcss подключен к проекту (вместе с плагином autoprefixer). Modules (Postcss) был отключен в виду того, что 
все имена классов в css уникальные и этот инструмент на данном этапе не нужен.   