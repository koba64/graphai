import { AgentFunction, agentInfoWrapper } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";

import * as agents from "@/index";

import test from "node:test";
import assert from "node:assert";

const testAgent: AgentFunction<Record<never, never>, any> = async ({ params }) => {
  return params;
};

const graphData_literal = {
  version: 0.5,
  nodes: {
    source1: {
      value: { apple: "red" },
    },
    source2: {
      value: { lemon: "yellow" },
    },
    delayed1: {
      agent: "sleepAndMergeAgent",
      inputs: { array: [":source1"] },
    },
    delayed2: {
      agent: "sleepAndMergeAgent",
      params: {
        duration: 100,
      },
      inputs: { array: [":source2"] },
    },
    test1: {
      agent: "testAgent",
      params: {
        fruit: ":source1",
        color: ":source2.lemon",
      },
      isResult: true,
    },
    test2: {
      agent: "testAgent",
      params: {
        fruit: ":delayed1",
        color: ":delayed2.lemon",
      },
      isResult: true,
    },
  },
};

test("test params", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphData_literal, { testAgent: agentInfoWrapper(testAgent), ...agents }, () => {}, false);
  assert.deepStrictEqual(result, {
    test1: { fruit: { apple: "red" }, color: "yellow" },
    test2: { fruit: { apple: "red" }, color: "yellow" },
  });
});
