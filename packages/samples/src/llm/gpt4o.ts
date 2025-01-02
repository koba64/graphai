import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";
import * as fs from "fs";
import * as path from "path";

function convertImageToBase64(imagePath: string): string {
  try {
    // Read the file as a binary buffer
    const imageBuffer = fs.readFileSync(imagePath);
    // Convert the buffer to a base64 string
    const base64String = imageBuffer.toString("base64");
    return base64String;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

const imagePath = path.join(__dirname, "fish001.jpg");
const base64Image = convertImageToBase64(imagePath);
// console.log(base64Image);

const query = "これはなんと言う魚ですか？";

const graph_data = {
  version: 0.5,
  nodes: {
    messages: {
      value: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: query,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    },
    query: {
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
      },
      isResult: true,
      inputs: { messages: ":messages" },
    },
    answer: {
      agent: "copyAgent",
      params: { namedKey: "text" },
      inputs: { text: ":query.text" },
      isResult: true,
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
