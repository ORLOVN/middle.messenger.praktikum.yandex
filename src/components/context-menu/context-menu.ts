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
                    //if (!event || !event.target) this.clicked(event);
                    const liElement = (event.target as HTMLLIElement).closest('li')
                    if (!liElement) {
                        this.clicked(event);
                        return;
                    }
                    const enable = liElement.getAttribute('data-enable')
                    if (enable) {
                        this.clicked(event);
                    }
                },
                contextmenu: (event: MouseEvent) => {
                    const liElement = (event.target as HTMLLIElement).closest('li')
                    if (!liElement) {
                        this.clicked(event);
                        return;
                    }
                    const enable = liElement.getAttribute('data-enable')
                    if (enable) {
                        this.clicked(event);
                    }
                    event.preventDefault();
                },
                mouseout: (event: MouseEvent) => {
                    if (!this._element) return;
                    if (!this._element.contains(event.relatedTarget as Node)) {
                        this.clickedOutside();
                    }
                }
            }
        }
        );
        this.hide();
        const handleDocumentClick = (event: MouseEvent) => {
            if (!this._element) return;
            if (!this._element.contains(event.target as Node)) {
                this.clickedOutside();
            }
        }
        document.addEventListener('contextmenu', handleDocumentClick, true);
        document.addEventListener('click', handleDocumentClick);

    }

    render(): string {
        return `
<div class="context-menu__behind-pane" style="left:{{x}}px; top: {{y}}px">
<nav id="context-menu" class="context-menu">
    <ul class="context-menu__items">
    {{#each items}}
      <li class="context-menu__item" data-value="{{this.value}}" data-enable="{{#if this.enable}}true{{/if}}">
        <a class="{{#if this.enable}}context-menu__link{{else}}context-menu__link_disabled{{/if}}" >{{this.title}}</a>
      </li>
    {{/each}}
    </ul>
</nav>
</div>  
        `
    }

    protected clicked: (event: MouseEvent) => void;
    protected clickedOutside: (() => void) = () => {};

    popup(position: {x: number, y: number}) {
        return new Promise((resolve, reject) => {
            position.x -= 100;
            position.y -= 100;
            this.setProps(position);
            this.show();
            this.clicked = resolve;
            this.clickedOutside = reject;
        }).then((event:MouseEvent) => {
            this.hide();
            if (!event || !event.target) return;
            const liElement = (event.target as HTMLLIElement).closest('li')
            if (!liElement) return;
            return liElement.getAttribute('data-value')
        }).catch(() => {
                this.hide();
            })


    }
}
