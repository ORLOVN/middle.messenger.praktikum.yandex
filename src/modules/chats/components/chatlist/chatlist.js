import {CompClass} from "/src/utils/core";
import {tmpl} from "./chatlist.tmpl.js";
import {dummyData} from './dummydata.js'

import styles from "./chatlist.css"

export class ChatList extends CompClass {
    constructor(tag) {
        super(tag,tmpl,dummyData,styles);
        this.profButton.addEventListener('click', event=>this.handleProfButton(event))
    }
    handleProfButton(event){
        window.location.href = '/profile'
    }
}
