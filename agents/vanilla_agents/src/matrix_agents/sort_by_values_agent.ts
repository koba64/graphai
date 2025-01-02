import { AgentFunction, AgentFunctionInfo, assert } from "graphai";

// This agent returned a sorted array of one array (A) based on another array (B).
// The default sorting order is "decendant".
//
// Parameters:
//  acendant: Specifies if the sorting order should be acendant. The default is "false" (decendant).
// Inputs:
//  array: Array<any>; // array to be sorted
//  values: Array<number>; // array of numbers for sorting
//
export const sortByValuesAgent: AgentFunction<
  {
    assendant?: boolean;
  },
  Array<unknown>,
  {
    array: Array<unknown>;
    values: Array<unknown>;
  }
> = async ({ params, namedInputs }) => {
  assert(!!namedInputs, "sortByValue: namedInputs is UNDEFINED!");
  assert(!!namedInputs.array, "sortByValue: namedInputs.array is UNDEFINED!");
  assert(!!namedInputs.values, "sortByValue: namedInputs.values is UNDEFINED!");

  const direction = (params?.assendant ?? false) ? -1 : 1;
  const array: Array<any> = namedInputs.array;
  const values: Array<any> = namedInputs.values;
  const joined = array.map((item, index) => {
    return { item, value: values[index] };
  });
  const contents = joined
    .sort((a, b) => {
      return (b.value - a.value) * direction;
    })
    .map((a) => {
      return a.item;
    });
  return contents;
};

const sortByValuesAgentInfo: AgentFunctionInfo = {
  name: "sortByValuesAgent",
  agent: sortByValuesAgent,
  mock: sortByValuesAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "the array to sort",
      },
      values: {
        type: "array",
        description: "values associated with items in the array",
      },
    },
    required: ["array", "values"],
  },
  output: {
    type: "array",
  },
  samples: [
    {
      inputs: {
        array: ["banana", "orange", "lemon", "apple"],
        values: [2, 5, 6, 4],
      },
      params: {},
      result: ["lemon", "orange", "apple", "banana"],
    },
    {
      inputs: {
        array: ["banana", "orange", "lemon", "apple"],
        values: [2, 5, 6, 4],
      },
      params: {
        assendant: true,
      },
      result: ["banana", "apple", "orange", "lemon"],
    },
  ],
  description: "sortByValues Agent",
  category: ["matrix"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default sortByValuesAgentInfo;
