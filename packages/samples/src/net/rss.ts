import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

export const graph_data = {
  version: 0.5,
  nodes: {
    url: {
      // Holds the RSS feed URL
      value: "https://www.theverge.com/microsoft/rss/index.xml",
    },
    rssFeed: {
      // Fetchs the RSS feed from the specified feed
      agent: "fetchAgent",
      params: {
        type: "xml",
      },
      inputs: { url: ":url" },
    },
    entries: {
      // Extracts necessary information from the feed
      agent: "propertyFilterAgent",
      params: {
        include: ["title", "link", "content"],
      },
      inputs: { array: [":rssFeed.feed.entry"] },
    },
    map: {
      // Processes each entry concurrently.
      agent: "mapAgent",
      inputs: { rows: ":entries" },
      isResult: true,
      params: {
        limit: 4, // to avoid rate limit
      },
      graph: {
        nodes: {
          template: {
            // Extracts title and content, then generate a single text
            agent: "stringTemplateAgent",
            params: {
              template: "Title:${t}\n${c}",
            },
            inputs: { t: ":row.title", c: ":row.content._" },
          },
          query: {
            // Asks the LLM to summarize it
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192", // "mixtral-8x7b-32768",
              query: "次のHTMLからテキストだけを抜き出し、省略せずに、全文を日本語に翻訳して。余計なことは言わずに、翻訳した文章だけ答えて。",
            },
            inputs: { prompt: ":template" },
          },
          extractor: {
            // Extract the content from the generated message
            agent: "copyAgent",
            isResult: true,
            inputs: { result: ":query.choices.$0.message.content" },
          },
        },
      },
    },
  },
};

export const main = async () => {
  const result = (await graphDataTestRunner(__dirname + "/../", "sample_net.log", graph_data, agents)) as any;
  // console.log(result.map.extractor.join("\n\n"));
  console.log(result.map);
};
if (process.argv[1] === __filename) {
  main();
}
