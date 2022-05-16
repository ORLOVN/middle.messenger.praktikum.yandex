import Block from '../../../../utils/Block';
import            './search-field.css'

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

        return `

<div class="search-field">
    <span class="material-icons search-field__icon">
        search
    </span>
    <input type="text" class="search-field__input" name="chart-search" placeholder="Поиск">
</div>
    
`;
    }
}
