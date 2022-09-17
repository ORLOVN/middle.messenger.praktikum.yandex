import Block            from '../../utils/Block';
import tmpl             from './signin.tmpl';
import Button           from '../../components/button';
import InputAssembly    from '../../components/input-assy';
import TextButton       from '../../components/text-button';
import {listFromArray}  from '../../utils/blockTools';
import router           from '../../utils/Router';
import auth             from '../../modules/auth';
import                       './signin.css';

export class Signin extends Block {
    constructor() {

        const commonProps = {
            events: {
                blur: (event: FocusEvent) => {
                    auth.signinInputBlur(
                        (event.target! as HTMLInputElement).name,
                        (event.target! as HTMLInputElement).value
                    );
                }
            }
        }
        const inputsProps = [
            {
                name:           'login',
                type:           'text',
                label:          'Логин',
                placeholder:    'mylogin999',
            },
            {
                name:           'password',
                type:           'password',
                label:          'Пароль',
                placeholder:    'password',
            }
        ];
        const inputList = listFromArray(inputsProps, InputAssembly, commonProps, 'inputList');

        const submitButton = new Button({
            content:    'Вход',
            style:      'red',
            type:       'submit',
            events:     {
                click: () => {}
            }
        });

        const signupRef = new TextButton({
            content:    'Нет аккаунта?',
            style:      'white',
            events:     {
                click: () => {
                    router.go('/sign-up');
                }
            }
        });


        super({
            name:           'signinPage',
            inputList:      inputList,
            submitButton:   submitButton,
            signupRef:      signupRef,
            eventSelector:  'form',
            events:         {
                submit: (event: Event) => {
                    event.preventDefault();
                    const inputs = (event.target! as HTMLFormElement).querySelectorAll('input')
                    const values: Record<string, string> = {};
                    inputs.forEach((input: HTMLInputElement) => {
                        values[input.name] = input.value;
                    });
                    auth.signinSubmit(values)
                }
            }
        });

    }

    render(): string {
        return tmpl;
    }
}

