"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popAgent = void 0;
const agent_utils_1 = require("@graphai/agent_utils");
const popAgent = async ({ namedInputs }) => {
    (0, agent_utils_1.arrayValidate)("popAgent", namedInputs);
    const array = namedInputs.array.map((item) => item); // shallow copy
    const item = array.pop();
    return { array, item };
};
exports.popAgent = popAgent;
const popAgentInfo = {
    name: "popAgent",
    agent: exports.popAgent,
    mock: exports.popAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the array to pop an item from",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            item: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
                description: "the item popped from the array",
            },
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
        {
            inputs: { array: ["a", "b", "c"] },
            params: {},
            result: {
                array: ["a", "b"],
                item: "c",
            },
        },
        {
            inputs: {
                array: [1, 2, 3],
                array2: ["a", "b", "c"],
            },
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
    ],
    description: "Pop Agent",
    category: ["array"],
    cacheType: "pureAgent",
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = popAgentInfo;
