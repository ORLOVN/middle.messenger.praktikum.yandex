import                   'regenerator-runtime/runtime';
import Chats        from './pages/chats';
import Signup       from './pages/signup';
import Signin       from './pages/signin';
import Profile      from './pages/profile';
import Error404     from './pages/error-pages/Error404';
import Notification from './components/notification';
import {render}     from './utils/blockTools';
import router       from './utils/Router';
import                   './index.css';

const notification = new Notification({
    name: 'notification'
});
render('.notification', notification);

router
    .use('/messenger',  Chats)
    .use('/sign-up',    Signup)
    .use('/',           Signin)
    .use('/setting',    Profile)
    .use('/404',        Error404)
    .start();
