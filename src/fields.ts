import { FieldSimpleFactory } from './common';

export const indexField = (): FieldSimpleFactory<number> => (ctx) => ctx.index;

export const nullableField = <T>(initialValue: T | null): T | null => {
    return initialValue;
};
