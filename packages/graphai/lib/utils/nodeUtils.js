"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceNodeIds = exports.inputs2dataSources = void 0;
const utils_1 = require("./utils");
// for dataSource
const inputs2dataSources = (inputs) => {
    if (Array.isArray(inputs)) {
        return inputs.map((inp) => (0, exports.inputs2dataSources)(inp)).flat();
    }
    if ((0, utils_1.isObject)(inputs)) {
        return Object.values(inputs)
            .map((input) => (0, exports.inputs2dataSources)(input))
            .flat();
    }
    if (typeof inputs === "string") {
        const templateMatch = [...inputs.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
        if (templateMatch.length > 0) {
            return (0, exports.inputs2dataSources)(templateMatch);
        }
    }
    return (0, utils_1.parseNodeName)(inputs);
};
exports.inputs2dataSources = inputs2dataSources;
const dataSourceNodeIds = (sources) => {
    return sources.filter((source) => source.nodeId).map((source) => source.nodeId);
};
exports.dataSourceNodeIds = dataSourceNodeIds;
