import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";
import * as path from "path";
import * as fs from "fs";

const filePath = path.join(__dirname, "../../../../README.md");
const document = fs.readFileSync(filePath, "utf8");

const graph_data = {
  version: 0.5,
  nodes: {
    reviewer: {
      // Asks the LLM to review the document.
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system: "You are a professional software engineer, and writer. You are responsible in reviewing a given document and give some feedbacks.",
      },
      inputs: { prompt: "Here is the document.\n" + document },
    },
    review: {
      // Extracts the response from the generated message
      agent: "copyAgent",
      inputs: { message: ":reviewer.choices.$0.message.content" },
      isResult: true,
    },
    evangelist: {
      // Asks the LLM to come up with a promoitional phrases.
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system:
          "You are a professional software evangelist. Read the document, and come up with 200 word phrases, which will explain the benefit of GraphUI, emphasizing the benefit of declarative data-flow programming and concurrent processing.",
      },
      inputs: { prompt: "Here is the document.\n" + document },
    },
    statement: {
      // Extracts the response from the generated message
      agent: "copyAgent",
      inputs: { message: ":evangelist.choices.$0.message.content" },
      isResult: true,
    },
  },
};

export const main = async () => {
  const result = (await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents })) as any;
  console.log("[REVIEW]");
  console.log(result.review.message);
  console.log("[PROMOTIONAL STATEMENT]");
  console.log(result.statement.message);
};

if (process.argv[1] === __filename) {
  main();
}
