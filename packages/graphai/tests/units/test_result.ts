import { graphDataLatestVersion } from "~/common";
import { StaticNode, ComputedNode } from "@/node";
import { resultsOf, cleanResult } from "@/utils/result";
import { propFunctions } from "@/utils/prop_function";
import { TaskManager } from "@/task_manager";
import { GraphAI } from "@/graphai";

// import { graph_data } from "./graph_data";
import * as agents from "../test_agents";

import test from "node:test";
import assert from "node:assert";

export const graph_data = {
  version: graphDataLatestVersion,
  nodes: {
    data1: {
      value: "1",
    },
    message1: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
    },
    message2: {
      agent: "echoAgent",
      params: {
        message: "hello",
      },
      inputs: { test: [":data1", ":copyAgent"] },
      anyInput: true,
    },
    copyAgent: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":message1" },
    },
    copyAgent2: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":message2" },
    },
  },
};

class DummyTaskManager extends TaskManager {
  public onComplete(__node: ComputedNode) {}
}

const taskManager = new DummyTaskManager(10);

const graph = new GraphAI(graph_data, agents, { taskManager });
graph.run();

const getStaticNode = (nodeId: string, value?: string) => {
  const dataSource = { value: undefined };
  const node = new StaticNode(nodeId, dataSource, graph);
  if (value) {
    node.injectValue(value);
  }
  return node;
};

const getComputedNode = (nodeId: string) => {
  const nodeData = {
    agent: "echoAgent",
    params: { message: "hello" },
  };
  const node = new ComputedNode("123", nodeId, nodeData, graph);
  return node;
};

test("test result", async () => {
  const node = getStaticNode("message", "123");
  const result = resultsOf({ text: [":message"] }, { message: node }, propFunctions);
  assert.deepStrictEqual(result, { text: ["123"] });
});

test("test result for anyInput", async () => {
  const node1 = getStaticNode("message1", "123");
  const node2 = getStaticNode("message2");
  const result = resultsOf({ text: [":message1", ":message2"] }, { message1: node1, message2: node2 }, propFunctions);
  assert.deepStrictEqual(result, { text: ["123", undefined] });
});

test("test result for anyInput", async () => {
  const node1 = getStaticNode("message1", "123");
  const node2 = getStaticNode("message2");
  const result = cleanResult(resultsOf({ text: [":message1", ":message2"] }, { message1: node1, message2: node2 }, propFunctions));
  assert.deepStrictEqual(result, { text: ["123"] });
});

test("test computed node result", async () => {
  const node1 = getComputedNode("message1");
  const node2 = getComputedNode("message2");
  await node1.execute();
  const result = resultsOf({ text: [":message1", ":message2"] }, { message1: node1, message2: node2 }, propFunctions);
  assert.deepStrictEqual(result, { text: [{ message: "hello" }, undefined] });
});

test("test computed node result for output", async () => {
  const node1 = getComputedNode("message1");
  await node1.execute();
  const result = resultsOf({ text: ".message" }, { self: node1 }, propFunctions, true);
  assert.deepStrictEqual(result, { text: "hello" });
});
