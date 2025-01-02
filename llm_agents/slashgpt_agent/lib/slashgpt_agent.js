"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slashGPTAgent = void 0;
const path_1 = __importDefault(require("path"));
const slashgpt_1 = require("slashgpt");
const config = new slashgpt_1.ChatConfig(path_1.default.resolve(__dirname));
const slashGPTAgent = async ({ params, namedInputs, debugInfo: { verbose, nodeId }, filterParams }) => {
    if (verbose) {
        console.log("executing", nodeId, params);
    }
    const session = new slashgpt_1.ChatSession(config, params.manifest ?? {});
    const query = params?.query ? [params.query] : [];
    const contents = query.concat(namedInputs.array ?? []);
    session.append_user_question(contents.join("\n"));
    await session.call_loop(() => { }, (token) => {
        if (filterParams && filterParams.streamTokenCallback && token) {
            filterParams.streamTokenCallback(token);
        }
    });
    return session.history.messages();
};
exports.slashGPTAgent = slashGPTAgent;
const slashGPTAgentInfo = {
    name: "slashGPTAgent",
    agent: exports.slashGPTAgent,
    mock: exports.slashGPTAgent,
    samples: [
        {
            inputs: {},
            params: {
                query: "Come up with ten business ideas for AI startup",
            },
            result: [
                {
                    role: "user",
                    content: "Come up with ten business ideas for AI startup",
                    preset: false,
                },
                {
                    role: "assistant",
                    content: "1. AI-powered personal shopping assistant that helps users find clothes that fit their style and budget.\n2. AI-powered health monitoring system that analyzes user data to provide personalized healthcare recommendations.\n3. AI-powered chatbot for customer service that can handle a variety of queries and provide quick responses.\n4. AI-powered virtual personal trainer that creates customized workout plans based on user goals and progress.\n5. AI-powered language translation service that can accurately translate text and voice in real-time.\n6. AI-powered financial advisor that analyzes user spending habits and offers personalized advice for saving and investing.\n7. AI-powered content creation platform that uses algorithms to generate engaging articles, videos, and social media posts.\n8. AI-powered job matching platform that connects job seekers with relevant opportunities based on their skills and experience.\n9. AI-powered cybersecurity solution that continuously monitors and protects against online threats and data breaches.\n10. AI-powered educational platform that uses personalized learning algorithms to help students improve their skills and knowledge in various subjects.",
                    preset: false,
                },
            ],
        },
    ],
    description: "Slash GPT Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
    stream: true,
    npms: ["slashgpt"],
};
exports.default = slashGPTAgentInfo;
