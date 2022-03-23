import Block            from "../../utils/Block";
import {PlainObject}    from "../../utils/types";
import Button           from "../button";
import InputAssy        from "../input-assy";


export class PopupInput extends Block {
    private inputValue: string;
    constructor(props: {
        title?:            string,
        inputLabel?:       string,
        inputPlaceholder?: string,
        inputValue?:       string,
        okCaption?:        string,
        cancelCaption?:    string,
        name?:             string,
        display?:          boolean,
        validFunction?: ()=> void,
        events?: {
            click:() => void
        }
    } = {
        display:           false,
    }) {
        const input = new InputAssy({
            name:           'popupInput',
            label:          props.inputLabel,
            placeholder:    props.inputPlaceholder,
            value:          props.inputValue,
            events:         {
                keyup: (event: Event) => {
                    this.inputValue = (event.target as HTMLInputElement).value
                    console.log(this.inputValue);
                }
            }
        });
        const buttonOk = new Button({
            name:           'popupOk',
            content:        props.okCaption,
            style:          'red',
        });
        const buttonCancel = new Button({
            name:           'popupCancel',
            content:        props.cancelCaption,
            style:          'yellow',
        });

        super({
            ...props,
            input:          input,
            buttonOk:       buttonOk,
            buttonCancel:   buttonCancel,
        });

        this._meta.props.popup = this.popup.bind(this);
        this.hide();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidUpdate(_oldProps: PlainObject, newProps: PlainObject, _addedProps:PlainObject): boolean {
        this.children.input.setProps({
            label:       newProps.inputLabel,
            placeholder: newProps.inputPlaceholder,
            value:       newProps.inputValue,
        })
        this.children.buttonOk.setProps({
            name:        'buttonOk',
            content:     newProps.okCaption,

        });
        this.children.buttonCancel.setProps({
            name:        'buttonCancel',
            content:     newProps.cancelCaption,
        });

        return true;
    }

    popup(): Promise<any> {
        this.show()
        return new Promise((resolve, reject) => {
            this.children.buttonOk.setProps({
                events: {
                    click: () => {
                        const validFunction = this.getProps().validFunction;
                        if (validFunction) {
                            const validResult = validFunction(this.inputValue);
                            if (validResult) {
                                this.children.input.setProps({validLabel: validResult})
                                return;
                            }
                        }
                        this.hide();
                        resolve(this.inputValue);
                    }
                }
            });
            this.children.buttonCancel.setProps({
                events: {
                    click: ()=> {
                        this.hide();
                        reject();
                    }
                }
            });
            this.setProps({
                events: {
                    click: (event: Event)=> {
                        if ((event.target as HTMLElement).className === "popup-input") {
                            this.hide();
                            reject();
                        }
                    }
                }
            });
        })
    }

    render():string {
        return `
<div class="popup-input">
    <div class="popup-input__field">
        <div class="popup-input__title">
            {{{title}}}
        </div>
        <div>
            {{{input}}}
        </div>
        <div class = "popup-input__button-pane">
            <div class = "popup-input__button">
                {{{buttonOk}}}
            </div>
            <div class = "popup-input__button">
                {{{buttonCancel}}}
            </div>
        </div>
    </div>
</div>
`
    }
}
