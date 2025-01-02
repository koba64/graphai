export const graphDataFetch = {
  version: 0.5,
  nodes: {
    url: {
      value: "https://www.google.com/search?q=hello",
    },
    fetch: {
      agent: "fetchAgent",
      params: {
        type: "text",
      },
      inputs: { url: ":url" },
    },
    success: {
      agent: "copyAgent",
      isResult: true,
      unless: ":fetch.onError",
      inputs: { result: true },
    },
    error: {
      agent: "copyAgent",
      isResult: true,
      if: ":fetch.onError",
      inputs: { error: ":fetch.onError" },
    },
  },
};

export const graphDataPost = {
  version: 0.5,
  nodes: {
    url: {
      value: "https://www.google.com/search?q=hello",
    },
    fetch: {
      agent: "fetchAgent",
      params: {
        type: "text",
      },
      inputs: { url: ":url", body: "Posting data" },
    },
    success: {
      agent: "copyAgent",
      isResult: true,
      unless: ":fetch.onError",
      inputs: { result: true },
    },
    error: {
      agent: "propertyFilterAgent",
      params: {
        include: ["message", "status"],
      },
      isResult: true,
      if: ":fetch.onError",
      inputs: { item: ":fetch.onError" },
    },
  },
};
