import "dotenv/config";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

const tools_translated = [
  {
    type: "function",
    function: {
      name: "translated",
      description: "Report the langauge of the input and its English translation.",
      parameters: {
        type: "object",
        properties: {
          englishTranslation: {
            type: "string",
            description: "English translation of the input",
          },
          language: {
            type: "string",
            description: "Identified language",
            values: ["English", "Japanese", "French", "Spenish", "Italian"],
          },
        },
        required: ["result"],
      },
    },
  },
];

const language_detection_graph = {
  nodes: {
    identifier: {
      // Ask the LLM to identify the language of :topic (the first input to this graph).
      agent: "openAIAgent",
      params: {
        model: "gpt-4o",
        system:
          "You are responsible in identifying the language of the input and translate it into English. " +
          "Call the 'translated' function with 'language' and 'englishTranslation'. " +
          "If the input is already in English, call the 'translated' function with 'englishTranslate=the input text', and 'langage=English'.",
        tools: tools_translated,
        tool_choice: { type: "function", function: { name: "translated" } },
      },
      inputs: { prompt: ":topic" },
    },
    extractor: {
      // Creates a language context
      agent: "stringTemplateAgent",
      params: {
        template: {
          language: "${lang}",
          text: "${text}",
        },
      },
      inputs: { lang: ":identifier.tool.arguments.language", text: ":identifier.tool.arguments.englishTranslation" },
    },
    result: {
      // Sets the isEnglish flag to the context.
      agent: "propertyFilterAgent",
      params: {
        inspect: [
          {
            propId: "isEnglish",
            equal: "English",
            // from: 1, // implied
          },
        ],
      },
      inputs: { array: [":extractor", ":extractor.language"] },
      isResult: true,
    },
  },
};

const wikipedia_graph = {
  nodes: {
    wikipedia: {
      // Fetches the content of the specified topic in :topic (first parameter)
      agent: "wikipediaAgent",
      console: {
        before: "Fetching data from Wikipedia...",
      },
      params: {
        lang: "en",
      },
      inputs: { query: [":topic"] },
    },
    summary: {
      // Asks the LLM to summarize it.
      agent: "openAIAgent",
      console: {
        before: "Summarizing it...",
      },
      params: {
        model: "gpt-4o",
        system: "Summarize the text below in 200 words",
      },
      inputs: { prompt: ":wikipedia.content" },
    },
    result: {
      // Extracts the response from the generated message
      agent: "copyAgent",
      isResult: true,
      inputs: { text: ":summary.choices.$0.message.content" },
    },
  },
};

const translator_graph = {
  nodes: {
    english: {
      // Copies the input data ($0) if the context language is English
      agent: "copyAgent",
      if: ":lang_info.isEnglish",
      inputs: { message: ":content" },
    },
    nonEnglish: {
      // Prepares the prompt if the context language is not English.
      agent: "stringTemplateAgent",
      params: {
        template: "Translate the text below into ${lang}",
      },
      inputs: { lang: ":lang_info.language" },
      unless: ":lang_info.isEnglish",
      isResult: true,
    },
    translate: {
      // Asks the LLM to translate the input data ($0)
      agent: "openAIAgent",
      console: {
        before: "Translating it...",
      },
      params: {
        model: "gpt-4o",
        system: ":nonEnglish",
      },
      inputs: { prompt: ":content" },
      isResult: true,
    },
    result: {
      // Makes the result of either pass available
      agent: "copyAgent",
      anyInput: true,
      inputs: { lang: ":english", message: ":translate.choices.$0.message.content" },
      isResult: true,
    },
  },
};

export const graph_data = {
  version: 0.5,
  nodes: {
    topic: {
      // Gets the research topic from the user.
      agent: "textInputAgent",
      params: {
        message: "Type the topic you want to research:",
      },
    },
    detector: {
      // Detect the language and creates the language context.
      agent: "nestedAgent",
      console: {
        before: "Detecting language...",
      },
      inputs: { topic: ":topic.text" },
      graph: language_detection_graph,
      isResult: true,
    },
    wikipedia: {
      // Retrieves the Wikipedia content for the spcified topic and summarize it in English.
      agent: "nestedAgent",
      inputs: { topic: ":detector.result.text" },
      isResult: true,
      graph: wikipedia_graph,
    },
    translate: {
      // Tranalte it into the appropriate language if necessary.
      agent: "nestedAgent",
      inputs: { content: ":wikipedia.result", lang_info: ":detector.result" },
      isResult: true,
      graph: translator_graph,
    },
  },
};

export const main = async () => {
  const result: any = await graphDataTestRunner(__dirname + "/../", __filename, graph_data, { ...agents }, () => {}, false);
  console.log(result.translate.result);
};

if (process.argv[1] === __filename) {
  main();
}
