import                  './error.css';
import Block      from  '../../utils/Block';
import TextButton from  '../../components/text-button';
import router     from  '../../utils/Router';


export default class ErrorPage extends Block {
    constructor(props: {
                    code: string, //404
                    text: string, //Вы куда-то не туда зашли
                }){

        const backLink = new TextButton({
            content:    'Назад к чатам',
            style:      'white',
            events:     {
                click: () => {
                    router.go('/sign-up');
                }
            }
        });

        super({
            backLink: backLink,
            ...props
        });
    }

    render() {
        return `
<div class="error__back">
<div class="error__title">{{code}}</div>
<div class="error__description">{{text}}</div>
<div class="error__back-link">{{{backLink}}}</div>
</div>        
`;

    }
}
