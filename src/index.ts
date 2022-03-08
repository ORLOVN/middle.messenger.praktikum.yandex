//import Block from './utils/Block';
import Chats from './pages/chats';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Profile from './pages/profile';
import router from './utils/Router';

router
    .use('/messenger', Chats)
    .use('/sign-up', Signup)
    .use('/', Signin)
    .use('/setting', Profile)
    .start();
