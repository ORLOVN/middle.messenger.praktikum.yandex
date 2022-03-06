//import Block from './utils/Block';
import Chats from './pages/chats';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Profile from './pages/profile';
import router from './utils/Router';

router
    .use('/', Chats)
    .use('/signup', Signup)
    .use('/signin', Signin)
    .use('/profile', Profile)
    .start();
