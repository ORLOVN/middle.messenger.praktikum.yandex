import EventBus from "./EventBus";

export class Mediator extends EventBus {

    private static instance: Mediator;

    constructor() {
        if (Mediator.instance) {
            return Mediator.instance
        }
        super();
    }

    public static getInstance():Mediator {
        if (!Mediator.instance) {
            Mediator.instance = new Mediator();
        }

        return Mediator.instance;
    }
}

export default new Mediator();
