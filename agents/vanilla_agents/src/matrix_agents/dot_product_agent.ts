import { AgentFunction, AgentFunctionInfo, assert } from "graphai";

// This agent calculates the dot product of an array of vectors (A[]) and a vector (B),
// typically used to calculate cosine similarity of embedding vectors.
// Inputs:
//  matrix: Two dimentional array of numbers.
//  vector: One dimentional array of numbers.
// Outputs:
//  { contents: Array<number> } // array of docProduct of each vector (A[]) and vector B
export const dotProductAgent: AgentFunction<Record<never, never>, Array<number>, { matrix: Array<Array<number>>; vector: Array<number> }> = async ({
  namedInputs,
}) => {
  assert(!!namedInputs, "dotProductAgent: namedInputs is UNDEFINED!");
  const matrix = namedInputs.matrix as Array<Array<number>>;
  const vector = namedInputs.vector as Array<number>;
  if (matrix[0].length != vector.length) {
    throw new Error(`dotProduct: Length of vectors do not match. ${matrix[0].length}, ${vector.length}`);
  }
  const contents = matrix.map((vector0) => {
    return vector0.reduce((dotProduct: number, value, index) => {
      return dotProduct + value * vector[index];
    }, 0);
  });
  return contents;
};

const dotProductAgentInfo: AgentFunctionInfo = {
  name: "dotProductAgent",
  agent: dotProductAgent,
  mock: dotProductAgent,
  inputs: {
    type: "object",
    properties: {
      matrix: {
        type: "array",
        description: "two dimentional matrix",
        items: {
          type: "array",
          items: {
            type: "number",
          },
        },
      },
      vector: {
        type: "array",
        description: "the vector",
        items: {
          type: "number",
        },
      },
    },
    required: ["matrix", "vector"],
  },
  output: {
    type: "array",
  },
  samples: [
    {
      inputs: {
        matrix: [
          [1, 2],
          [3, 4],
          [5, 6],
        ],
        vector: [3, 2],
      },
      params: {},
      result: [7, 17, 27],
    },
    {
      inputs: {
        matrix: [
          [1, 2],
          [2, 3],
        ],
        vector: [1, 2],
      },
      params: {},
      result: [5, 8],
    },
  ],
  description: "dotProduct Agent",
  category: ["matrix"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default dotProductAgentInfo;
