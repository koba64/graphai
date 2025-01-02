"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echoAgent = void 0;
const echoAgent = async ({ params, filterParams }) => {
    if (params.filterParams) {
        return filterParams;
    }
    return params;
};
exports.echoAgent = echoAgent;
// for test and document
const echoAgentInfo = {
    name: "echoAgent",
    agent: exports.echoAgent,
    mock: exports.echoAgent,
    samples: [
        {
            inputs: {},
            params: { text: "this is test" },
            result: { text: "this is test" },
        },
        {
            inputs: {},
            params: {
                text: "If you add filterParams option, it will respond to filterParams",
                filterParams: true,
            },
            result: {},
        },
    ],
    description: "Echo agent",
    category: ["test"],
    cacheType: "pureAgent",
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = echoAgentInfo;
