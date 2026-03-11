import { jest } from '@jest/globals';

global.jest = jest;

global.localStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value.toString();
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};

global.navigator = {
    userAgent: 'node.js',
    onLine: true
};

global.window = {
    localStorage: global.localStorage,
    navigator: global.navigator,
    performance: {
        now: () => Date.now(),
        getEntriesByType: () => [],
        getEntriesByName: () => []
    }
};

global.document = {
    createElement: () => ({
        setAttribute: () => {},
        appendChild: () => {}
    })
};

global.performance = global.window.performance;
