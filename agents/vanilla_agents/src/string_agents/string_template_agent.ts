import { AgentFunction, AgentFunctionInfo, isObject } from "graphai";

type StringTemplate = string | Record<string, string>;
type StringTemplateObject = StringTemplate | StringTemplate[] | Record<string, StringTemplate>;

const processTemplate: any = (template: StringTemplateObject, match: string, input: string) => {
  if (typeof template === "string") {
    if (template === match) {
      return input;
    }
    return template.replace(match, input);
  } else if (Array.isArray(template)) {
    return template.map((item: StringTemplate) => processTemplate(item, match, input));
  }

  if (isObject(template)) {
    return Object.keys(template).reduce((tmp: any, key: string) => {
      tmp[key] = processTemplate(template[key], match, input);
      return tmp;
    }, {});
  }
  return template;
};

export const stringTemplateAgent: AgentFunction<
  {
    template: StringTemplateObject;
  },
  StringTemplateObject,
  Record<string, string>
> = async ({ params, namedInputs }) => {
  if (params.template === undefined) {
    if (namedInputs.text) {
      return namedInputs.text;
    }
    console.warn("warning: stringTemplateAgent no template");
  }
  return Object.keys(namedInputs).reduce((template, key) => {
    return processTemplate(template, "${" + key + "}", namedInputs[key]);
  }, params.template);
};

const sampleNamedInput = { message1: "hello", message2: "test" };

// for test and document
const stringTemplateAgentInfo: AgentFunctionInfo = {
  name: "stringTemplateAgent",
  agent: stringTemplateAgent,
  mock: stringTemplateAgent,
  samples: [
    // named
    {
      inputs: sampleNamedInput,
      params: { template: "${message1}: ${message2}" },
      result: "hello: test",
    },
    {
      inputs: sampleNamedInput,
      params: { template: ["${message1}: ${message2}", "${message2}: ${message1}"] },
      result: ["hello: test", "test: hello"],
    },
    {
      inputs: sampleNamedInput,
      params: { template: { apple: "${message1}", lemon: "${message2}" } },
      result: { apple: "hello", lemon: "test" },
    },
    {
      inputs: sampleNamedInput,
      params: { template: [{ apple: "${message1}", lemon: "${message2}" }] },
      result: [{ apple: "hello", lemon: "test" }],
    },
    {
      inputs: sampleNamedInput,
      params: { template: { apple: "${message1}", lemon: ["${message2}"] } },
      result: { apple: "hello", lemon: ["test"] },
    },
    // graphData
    {
      inputs: { agent: "openAiAgent", row: "hello world", params: { text: "message" } },
      params: {
        template: {
          version: 0.5,
          nodes: {
            ai: {
              agent: "${agent}",
              isResult: true,
              params: "${params}",
              inputs: { prompt: "${row}" },
            },
          },
        },
      },
      result: {
        nodes: {
          ai: {
            agent: "openAiAgent",
            inputs: {
              prompt: "hello world",
            },
            isResult: true,
            params: { text: "message" },
          },
        },
        version: 0.5,
      },
    },
  ],
  description: "Template agent",
  category: ["string"],
  author: "Satoshi Nakajima",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default stringTemplateAgentInfo;
