import { factoryT, fields } from 'factory-t';

assert(typeof factoryT === 'function', 'factoryT imported from "factory-t" should be a function');

const factory = factoryT({
    index: fields.index(),
});

assert(factory.item().index === 1, 'factory.item().index should return 1 at first call');
assert(factory.item().index === 2, 'factory.item().index should return 2 at second call');

function assert(condition: unknown, message: string): void {
    // eslint-disable-next-line no-console
    console.assert(condition, message + '\nSee demo-app/index.ts for details');
    if (!condition) {
        process.exit(23);
    }
}
