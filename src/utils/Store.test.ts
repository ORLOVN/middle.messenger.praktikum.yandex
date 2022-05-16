const STORE = require('./Store');
const { Store } = STORE;

describe('score/Store', () => {
    it('should set state', () => {
        const store = new Store();
        store.set('',{ userId: 123 });

        expect(store.getState()).toEqual({ userId: 123 });
    });

    it('should emit event after store was update', () => {
        const store = new Store();
        const mock = jest.fn();

        store.on('updated-path', mock);

        store.set('path',{ userId: 123 });

        expect(mock).toHaveBeenCalled();
        expect(mock).toHaveBeenCalledWith( { userId: 123 })
    });
});
