import Block from '../../utils/Block';
import tmpl from './home.tmpl';
import Button from '../../components/button';
import compile from '../../utils/compile';

export class HomePage extends Block {
    constructor() {
        const button  = new Button({
            text:'Click me',
            events:{
                click:() => console.log('Clicked')
            }
        });
        super('div', {
            'button': button
        });
    setTimeout(() => {
        button.setProps({
            text:'new text'
        })
    }, 2000);
    }

     render(): HTMLElement {
         return this.compile(tmpl,this.props);
    }
}