import { AgentFunctionContext } from "graphai";
import { streamAgentFilterGenerator } from "@graphai/agent_filters";

const streamData: Record<string, string> = {};

const outSideFunciton = (context: AgentFunctionContext, data: string) => {
  const nodeId = context.debugInfo.nodeId;
  streamData[nodeId] = (streamData[nodeId] || "") + data;
  console.log(streamData);
};

export const agentFilters = [
  {
    name: "streamAgentFilter",
    agent: streamAgentFilterGenerator<string>(outSideFunciton),
  },
];
