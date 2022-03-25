import Block from "../../utils/Block";

export class ContextMenu extends Block {
    constructor(props: {
        name?: string,
        items?: {
            title: string,
            icon: string,
            enable: boolean,
            value: string,
        },
                }) {
        super(
            props
        );
    }

    render(): string {
        return `
<nav id="context-menu" class="context-menu">
    <ul class="context-menu__items">
    {{#each items}}
    <li>{{this}}</li>
      <li class="context-menu__item">
        <a href="#" class="context-menu__link" data-action="View"><i class="fa fa-eye"></i> this.title</a>
      </li>
    {{/each}}
    </ul>
</nav>
        
        `
    }
}
