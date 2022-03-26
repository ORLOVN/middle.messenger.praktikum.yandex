import Block from "../../utils/Block";

export class ContextMenu extends Block {
    constructor(props: {
        name?: string,
        items?: {
            title: string,
            icon?: string,
            enable: boolean,
            value: string,
        }[],
                }) {
        super({
            x: 0,
            y: 0,
            ...props,
            events: {
                click: (event: MouseEvent) => {
                    this.clicked(event);
                }
            }
        }
        );

        document.addEventListener('click', (event: MouseEvent) => {
            if (!this._element) return;
            if (!this._element.contains(event.target as Node)) {
                this.clickedOutside();
            }
        })
    }

    render(): string {
        return `
<nav id="context-menu" class="context-menu">
    <ul class="context-menu__items">
    {{#each items}}
      <li class="context-menu__item">
        <a href="#" class="context-menu__link" data-action="View"><i class="fa fa-eye"></i> {{{this.title}}}</a>
      </li>
    {{/each}}
    </ul>
</nav>
        
        `
    }

    protected clicked: (event: MouseEvent) => void;
    protected clickedOutside: () => void;

    popup(x, y: number) {
        return new Promise((resolve, reject) => {
            if (this._element) {
                this._element.style.top = `${y}px`;
                this._element.style.left = `${x}px`;
            }
            this.show();
            this.clicked = resolve;
            this.clickedOutside = reject;
        }).then()
            .catch(() => {
                this.hide();
            })


    }
}
