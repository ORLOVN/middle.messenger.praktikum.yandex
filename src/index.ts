import Block from './utils/Block';
import Chats from './pages/chats';
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Profile from "./pages/profile";

function render(query: string, block: Block) {
    const root = document.querySelector(query);

    if (!root) {
        throw new Error('Root not found')
    }
//    block.dispatchComponentDidMount();
    root.appendChild(block.getContent());
    return root;
}

let path = window.location.pathname;
if (path) {
    path = path.slice(1,path.length)
}

const queryDict: Record<string, string> = {};
location.search.substr(1).split("&").forEach(
    function(item) {
        queryDict[item.split("=")[0]] = item.split("=")[1]
    })

path = path||queryDict.path||'';

console.log(path)

let page: Block;



if (path === '') {
     page = new Signin();
} else if (path === 'signin') {
     page = new Signin();
} else if (path === 'signup') {
     page = new Signup();
} else if (path === 'profile') {
     page = new Profile();
} else if (path === 'chats') {
     page = new Chats();
} else if (path === 'err500') {
     page = null;
} else {
     page = null;
}

render('.app', page);
