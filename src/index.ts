import Block from './utils/Block';
import Chats from './pages/chats';
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import ProfileSettings from "./pages/profile";

function render(query: string, block: Block) {
    const root = document.querySelector(query);

    if (!root) {
        throw new Error('Root not found')
    }
    block.dispatchComponentDidMount();
    root.appendChild(block.getContent());
    return root;
}
/*
const button = new Button({
    text: 'Click me',
    events: {
        click: () => console.log('clicked')
    }
});*/

// app — это class дива в корне DOM
const page =  new Signup();


render('.app', page);

setTimeout(() => {
    page.setProps({
        'someText':'Text is changed'
    });
}, 5000);

// Через секунду контент изменится сам, достаточно обновить пропсы


//"parcel-plugin-handlerbars-precompile": "^1.0.2",