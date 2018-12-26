"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Set of  "MakePropFn" helpers
 */
exports.INDEX_KEY = function (context) { return context.index; };
/**
 * @returns MakePropFn that generates values sequence from arrayOfValues
 * @param arrayOfValues array of values
 */
function makeSequense(arrayOfValues) {
    var size = arrayOfValues.length;
    // NOTE: we use index - 1 due to factory starts index from 1 but array starts from 0
    return function (_a) {
        var index = _a.index;
        return arrayOfValues[(index - 1) % size];
    };
}
exports.makeSequense = makeSequense;
/**
 * @returns MakePropFn that generates enum values sequence
 * @param obj enum instance
 */
function makeSequenseFromEnum(obj) {
    var o = obj; // HACK for type casting
    var arr = Object.keys(o).map(function (k) { return o[k]; });
    return makeSequense(arr);
}
exports.makeSequenseFromEnum = makeSequenseFromEnum;
/**
 * Class that implements factory function specified by config object
 */
var FactoryT = /** @class */ (function () {
    function FactoryT(config) {
        this.config = config;
        this.itemsCount = 1;
        this.propMakers = createPropMakers(config);
    }
    FactoryT.prototype.build = function (partial) {
        var _this = this;
        if (partial === void 0) { partial = {}; }
        var builtObj = this.propMakers.reduce(function (obj, propMaker) {
            var key = propMaker.key;
            if (partial.hasOwnProperty(key)) {
                obj[key] = partial[key];
            }
            else {
                obj[key] = propMaker.make({ partial: obj, index: _this.itemsCount });
            }
            return obj;
        }, {});
        this.itemsCount++;
        return builtObj;
    };
    FactoryT.prototype.buildList = function (inParams) {
        var params = inParams;
        if (params.partials) {
            if (params.partials.length === 0) {
                throw new Error("buildList() assertion error: \"partials\" array must be not empty");
            }
            if (params.count && params.count < params.partials.length) {
                throw new Error("buildList() assertion error: \"count\" param should be greather then \"partials.length\"");
            }
        }
        var count = params.count || params.partials.length;
        var partials = params.partials || [];
        var defaultPartial = params.partial || {};
        var items = [];
        for (var i = 0; i < count; i++) {
            var item = this.build(partials[i] || defaultPartial);
            items.push(item);
        }
        return items;
    };
    FactoryT.prototype.extends = function (config) {
        return new FactoryT(__assign({}, this.config, config));
    };
    return FactoryT;
}());
exports.FactoryT = FactoryT;
function createPropMakers(inputConfig) {
    var conf = normalizeConfig(inputConfig);
    var sortedByDeps = getKeysSortedByDeps(conf);
    return sortedByDeps.map(function (key) {
        return {
            key: key,
            make: conf[key].make,
        };
    });
}
function normalizeConfig(config) {
    var keys = Object.keys(config);
    return keys.reduce(function (normalized, key) {
        var configItem = config[key];
        var make;
        var deps;
        if (configItem !== null && (typeof configItem === 'object')) {
            deps = (configItem.deps || []).slice();
            make = configItem.make ||
                (function () { return configItem.value; });
        }
        else {
            deps = [];
            make = typeof configItem === 'function' ?
                configItem :
                function () { return configItem; };
        }
        normalized[key] = {
            deps: deps,
            make: make,
        };
        return normalized;
    }, {});
}
// Kahn's algorithm (1962) https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm
// used for topological sorting or "Dependency resolution"
// function returns array of keys each of them independs from next elements
// example:
// getKeysSortedByDeps({a: deps: ['c'], b: deps: ['a'], c: deps: []}) -> ['c', 'a', 'b']
function getKeysSortedByDeps(conf) {
    var keys = Object.keys(conf);
    var sorted = [];
    var keysWithNoDeps = keys.filter(function (key) {
        return conf[key].deps.length === 0;
    });
    var _loop_1 = function () {
        var keyWithNoDeps = keysWithNoDeps.pop();
        sorted.push(keyWithNoDeps);
        keys.forEach(function (key) {
            var deps = conf[key].deps;
            if (deps.length === 0) {
                return;
            }
            var index = deps.indexOf(keyWithNoDeps);
            if (index === -1) {
                return;
            }
            deps.splice(index, 1);
            if (deps.length === 0) {
                keysWithNoDeps.push(key);
            }
        });
    };
    while (keysWithNoDeps.length) {
        _loop_1();
    }
    return sorted;
}
