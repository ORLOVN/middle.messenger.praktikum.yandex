import './modules/signin.ts'
import './modules/profile.ts'
import './modules/chats.ts'
import './modules/signup.ts'

import Chats from './pages/chats';
import Signup from './pages/signup';
import Signin from './pages/signin';
import Profile from './pages/profile';
import Notification from "./components/notification";
import {render} from "./utils/blockTools";
import router from './utils/Router';

const notification = new Notification({
    name: 'notification'
});
render('.notification', notification);

router
    .use('/messenger', Chats)
    .use('/sign-up', Signup)
    .use('/', Signin)
    .use('/setting', Profile)
    .start();
