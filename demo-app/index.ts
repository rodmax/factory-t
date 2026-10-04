import { factoryT, fields } from 'factory-t';

assert(typeof factoryT === 'function', 'factoryT imported from "factory-t" should be a function');

const factory = factoryT({
    index: fields.index(),
});

assert(factory.item().index === 1, 'factory.item().index should return 1 at first call');
assert(factory.item().index === 2, 'factory.item().index should return 2 at second call');

function assert(condition: unknown, message: string): void {
    if (!condition) {
        throw new Error(message + '\nSee demo-app/index.ts for details');
    }
}
