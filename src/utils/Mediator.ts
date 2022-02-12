import EventBus from "./EventBus";

export default class Mediator extends EventBus {

    private static instance: Mediator;

    constructor() {
        super();
    }

    public static getInstance():Mediator {
        if (!Mediator.instance) {
            Mediator.instance = new Mediator();
        }

        return Mediator.instance;
    }
}