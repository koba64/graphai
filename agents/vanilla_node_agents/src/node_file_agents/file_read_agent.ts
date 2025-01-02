import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import fs from "fs";
import path from "path";

export const fileReadAgent: AgentFunction<
  {
    baseDir: string;
    outputType?: string;
  },
  {
    array?: string[] | unknown[] | fs.ReadStream[];
    data?: string | unknown | fs.ReadStream;
  },
  {
    array?: string[];
    file?: string;
  }
> = async ({ namedInputs, params }) => {
  const { baseDir, outputType } = params;

  assert(!!baseDir, "fileReadAgent: params.baseDir is UNDEFINED!");

  const fileToData = (fileName: string) => {
    const file = path.resolve(path.join(baseDir, fileName));
    if (outputType && outputType === "stream") {
      return fs.createReadStream(file);
    }
    const buffer = fs.readFileSync(file);
    if (outputType && outputType === "base64") {
      return buffer.toString("base64");
    }
    if (outputType && outputType === "text") {
      return new TextDecoder().decode(buffer);
    }
    return buffer;
  };

  if (namedInputs.array) {
    return {
      array: namedInputs.array.map(fileToData),
    };
  }
  if (namedInputs.file) {
    return {
      data: fileToData(namedInputs.file),
    };
  }
  throw new Error("fileReadAgent no file");
};

const fileReadAgentInfo: AgentFunctionInfo = {
  name: "fileReadAgent",
  agent: fileReadAgent,
  mock: fileReadAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "file names",
      },
    },
    required: ["array"],
  },
  output: {
    type: "object",
  },
  samples: [
    {
      inputs: { array: ["test.txt"] },
      params: { baseDir: __dirname + "/../../tests/files/" },
      result: {
        array: [Buffer.from([104, 101, 108, 108, 111, 10])],
      },
    },
    {
      inputs: { array: ["test.txt"] },
      params: { baseDir: __dirname + "/../../tests/files/", outputType: "base64" },
      result: {
        array: ["aGVsbG8K"],
      },
    },
    {
      inputs: { array: ["test.txt"] },
      params: { baseDir: __dirname + "/../../tests/files/", outputType: "text" },
      result: {
        array: ["hello\n"],
      },
    },
    {
      inputs: { file: "test.txt" },
      params: { baseDir: __dirname + "/../../tests/files/", outputType: "text" },
      result: {
        data: "hello\n",
      },
    },
  ],
  description: "Read data from file system and returns data",
  category: ["fs"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default fileReadAgentInfo;
