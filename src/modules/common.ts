import mediator from "../utils/Mediator";
import store from "../utils/Store";


mediator.on('error', (error) => {
    store.set('notification',{content: error});
    console.error(error);
})
