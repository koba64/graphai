import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

const query =
  "I'd like to write a paper about data flow programming for AI application, which involves multiple asynchronous calls, some of operations are done on other machines (distributed computing). Please come up with the title and an abstract for this paper.";

const graph_data = {
  version: 0.5,
  nodes: {
    query: {
      agent: "groqAgent",
      params: {
        model: "mixtral-8x7b-32768",
      },
      isResult: true,
      inputs: {
        prompt: query,
      },
    },
    answer: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":query.text" },
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, agents);
  console.log(result);
};

if (process.argv[1] === __filename) {
  main();
}
