import "dotenv/config";

import { GraphData } from "graphai";
import * as agents from "@graphai/agents";
import { graphDataTestRunner } from "@receptron/test_utils";
import { home_functions } from "./home_functions";

const home_actions = {
  fill_bath: { type: "message_template", message: "Success. I started filling the bath tab." },
  set_temperature: { type: "message_template", message: "Success. I set the temperature to {temperature} for {location}" },
  start_sprinkler: { type: "message_template", message: "Success. I started the sprinkler for {location}" },
  take_picture: { type: "message_template", message: "Success. I took a picture of {location}" },
  play_music: { type: "message_template", message: "Success. I started playing {music} in {location}" },
  control_light: { type: "message_template", message: "Success. The light switch of {location} is now {switch}." },
};

const graph_data: GraphData = {
  version: 0.5,
  nodes: {
    node1: {
      value: { content: "Turn on the light in the kitchen" },
    },
    node2: {
      agent: "slashGPTAgent",
      inputs: { array: [":node1.content"] },
      params: {
        manifest: {
          skip_function_result: true,
          actions: home_actions,
          functions: home_functions,
        },
      },
    },
    node3: {
      agent: "bypassAgent",
      inputs: { result: ":node2.$last.content" },
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents);
  console.log(result);
  if (result["node3"]) {
    console.log(result["node3"]);
  }
  console.log("COMPLETE 1");
};

main();
