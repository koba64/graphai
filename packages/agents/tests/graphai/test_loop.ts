import { AgentFunction, agentInfoWrapper } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/vanilla";

import test from "node:test";
import assert from "node:assert";

const graphdata_counter = {
  version: 0.5,
  loop: {
    count: 10,
  },
  nodes: {
    data: {
      value: { v: 0 },
      update: ":counter",
    },
    counter: {
      agent: "counterAgent",
      inputs: { item: ":data" },
      isResult: true,
    },
  },
};

const counterAgent: AgentFunction = async ({ namedInputs }) => {
  return { v: (namedInputs.item.v || 0) + 1 };
};

test("test counter", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata_counter, {
    counterAgent: agentInfoWrapper(counterAgent),
  });
  assert.deepStrictEqual(result, { data: { v: 10 }, counter: { v: 10 } });
});

test("test counter2", async () => {
  const nested_graphdata = {
    version: 0.5,
    loop: {
      count: 10,
    },
    nodes: {
      workingMemory: {
        value: {},
        update: ":nested1.counter", // update data from nested1 data
      },
      nested1: {
        agent: "nestedAgent",
        isResult: true,
        graph: graphdata_counter,
        inputs: { data: ":workingMemory" },
      },
    },
  };

  const result = await graphDataTestRunner(__dirname, __filename, nested_graphdata, {
    ...agents,
    counterAgent: agentInfoWrapper(counterAgent),
  });
  assert.deepStrictEqual(result, { workingMemory: { v: 100 }, nested1: { counter: { v: 100 } } });
});

/* Removed from test for now
test("test counter3", async () => {
  const nested_graphdata = {
    version: 0.5,
    concurrency: 2,
    loop: {
      count: 10,
    },
    nodes: {
      workingMemory: {
        value: {},
        update: ":merge", // update data from nested1 data
      },
      workingMemory2: {
        // HACK until we fix the bug (inputs:["workingMemory", "workingMemory"])
        agent: "totalAgent",
        inputs: [":workingMemory"],
      },
      mapping: {
        agent: "mapAgent",
        inputs: [":workingMemory", ":workingMemory2"],
        params: {
          namedInputs: ["data"],
        },
        graph: graphdata_counter,
      },
      merge: {
        agent: "totalAgent",
        inputs: [":mapping.counter"],
      },
    },
  };

  const result = await graphDataTestRunner(__dirname, __filename, nested_graphdata, {
    ...agents,
    counterAgent: agentInfoWrapper(counterAgent),
  });
  assert.deepStrictEqual(result, {
    workingMemory: { v: 10220 },
    workingMemory2: { v: 10220 },
    mapping: { counter: [{ v: 10230 }, { v: 10230 }] },
    merge: { v: 20460 },
  });
});
*/
