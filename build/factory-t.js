"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FactoryT {
    constructor(fieldFactoryByKey) {
        this.fieldFactoryByKey = fieldFactoryByKey;
        this.itemsCount = 1;
    }
    item(partial = {}, options) {
        const builtKeys = [];
        const keysStack = [];
        const obj = {};
        const getField = (k) => {
            if (!builtKeys.includes(k)) {
                makeField(k);
            }
            return obj[k];
        };
        const makeField = (k) => {
            const ctx = {
                index: this.itemsCount,
                get: getField,
                options,
            };
            if (keysStack.includes(k)) {
                keysStack.push(k);
                throw new Error(`circular dependency cause between fields: ${keysStack.join('->')}`);
            }
            keysStack.push(k);
            obj[k] = this.fieldFactoryByKey[k](ctx);
            keysStack.pop();
        };
        for (const k of this.dataKeys()) {
            if (builtKeys.includes(k)) {
                continue;
            }
            makeField(k);
        }
        this.itemsCount++;
        return {
            ...obj,
            ...partial,
        };
    }
    list(inParams, options) {
        const params = inParams;
        if (params.partials) {
            if (params.partials.length === 0) {
                throw new Error(`${this.list.name}() assertion error: "partials" array must be not empty`);
            }
            if (params.count && params.count < params.partials.length) {
                throw new Error(`${this.list.name}() assertion error: "count" param should be greater then "partials.length"`);
            }
        }
        const count = isFinite(params.count) ? params.count : params.partials.length;
        const partials = params.partials || [];
        const defaultPartial = params.partial || {};
        const items = [];
        for (let i = 0; i < count; i++) {
            const item = this.item(partials[i] || defaultPartial, options);
            items.push(item);
        }
        return items;
    }
    resetCount() {
        this.itemsCount = 1;
    }
    dataKeys() {
        return Object.keys(this.fieldFactoryByKey);
    }
}
exports.FactoryT = FactoryT;
