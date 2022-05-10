import Block from '../../../../utils/Block';
import tmpl from './search-field.tmpl';
export class SearchField extends Block {
    constructor(props: {
        events?: {
            keyup:   ({}) => void,
            keydown: ({}) => void,
        }
    })
    {

        super(props);

    }

    render():string {

        return tmpl;
    }
}
