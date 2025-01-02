"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeNodeIdAgent = void 0;
const agent_utils_1 = require("@graphai/agent_utils");
const mergeNodeIdAgent = async ({ debugInfo: { nodeId }, namedInputs, }) => {
    (0, agent_utils_1.arrayValidate)("mergeNodeIdAgent", namedInputs);
    const dataSet = namedInputs.array;
    return dataSet.reduce((tmp, input) => {
        return { ...tmp, ...input };
    }, { [nodeId]: "hello" });
};
exports.mergeNodeIdAgent = mergeNodeIdAgent;
// for test and document
const mergeNodeIdAgentInfo = {
    name: "mergeNodeIdAgent",
    agent: exports.mergeNodeIdAgent,
    mock: exports.mergeNodeIdAgent,
    samples: [
        {
            inputs: { array: [{ message: "hello" }] },
            params: {},
            result: {
                message: "hello",
                test: "hello",
            },
        },
    ],
    description: "merge node id agent",
    category: ["test"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = mergeNodeIdAgentInfo;
