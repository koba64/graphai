### GraphData Example

#### dynamicGraphData
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": {
        "version": 0.5,
        "loop": {
          "count": 5
        },
        "nodes": {
          "array": {
            "value": [],
            "update": ":reducer.array"
          },
          "item": {
            "agent": "sleepAndMergeAgent",
            "params": {
              "duration": 10,
              "value": "hello"
            }
          },
          "reducer": {
            "isResult": true,
            "agent": "pushAgent",
            "inputs": {
              "array": ":array",
              "item": ":item"
            }
          }
        }
      }
    },
    "nested": {
      "agent": "nestedAgent",
      "graph": ":source",
      "isResult": true
    }
  }
}
```

#### dynamicGraphData2
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "{\"version\":0.5,\"loop\":{\"count\":5},\"nodes\":{\"array\":{\"value\":[],\"update\":\":reducer.array\"},\"item\":{\"agent\":\"sleepAndMergeAgent\",\"params\":{\"duration\":10,\"value\":\"hello\"}},\"reducer\":{\"isResult\":true,\"agent\":\"pushAgent\",\"inputs\":{\"array\":\":array\",\"item\":\":item\"}}}}"
    },
    "parser": {
      "agent": "jsonParserAgent",
      "inputs": {
        "text": ":source"
      }
    },
    "nested": {
      "agent": "nestedAgent",
      "graph": ":parser",
      "isResult": true
    }
  }
}
```

#### dynamicGraphData3
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "```json\n{\"version\":0.5,\"loop\":{\"count\":5},\"nodes\":{\"array\":{\"value\":[],\"update\":\":reducer.array\"},\"item\":{\"agent\":\"sleepAndMergeAgent\",\"params\":{\"duration\":10,\"value\":\"hello\"}},\"reducer\":{\"isResult\":true,\"agent\":\"pushAgent\",\"inputs\":{\"array\":\":array\",\"item\":\":item\"}}}}\n```\n"
    },
    "parser": {
      "agent": "jsonParserAgent",
      "inputs": {
        "text": ":source"
      }
    },
    "nested": {
      "agent": "nestedAgent",
      "graph": ":parser",
      "isResult": true
    }
  }
}
```

#### nestedGraphData
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "Hello World"
    },
    "nestedNode": {
      "agent": "nestedAgent",
      "inputs": {
        "inner0": ":source"
      },
      "isResult": true,
      "graph": {
        "nodes": {
          "resultInner": {
            "agent": "copyAgent",
            "inputs": {
              "text": ":inner0"
            },
            "isResult": true
          }
        }
      }
    }
  }
}
```

#### nestedGraphData2
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "Hello World"
    },
    "nestedNode": {
      "agent": "nestedAgent",
      "inputs": {
        "source": ":source"
      },
      "isResult": true,
      "graph": {
        "nodes": {
          "result": {
            "agent": "copyAgent",
            "inputs": {
              "text": ":source"
            },
            "isResult": true
          }
        }
      }
    }
  }
}
```

#### graphDataMap1
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": {
        "fruits": [
          "apple",
          "orange",
          "banana",
          "lemon",
          "melon",
          "pineapple",
          "tomato"
        ]
      }
    },
    "nestedNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source.fruits"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "node2": {
            "agent": "stringTemplateAgent",
            "params": {
              "template": "I love ${m}."
            },
            "inputs": {
              "m": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "result": {
      "agent": "sleepAndMergeAgent",
      "inputs": {
        "array": [
          ":nestedNode.node2"
        ]
      },
      "isResult": true
    }
  }
}
```

#### graphDataMap3
```json
{
  "version": 0.5,
  "nodes": {
    "source1": {
      "value": [
        "hello",
        "hello2"
      ]
    },
    "nestedNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source1"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "node1": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "result": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "result"
      },
      "inputs": {
        "result": [
          ":nestedNode.node1"
        ]
      },
      "isResult": true
    }
  }
}
```

#### graphDataMap4
```json
{
  "version": 0.5,
  "nodes": {
    "source1": {
      "value": [
        "hello",
        "hello2"
      ]
    },
    "nestedNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source1"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "node1": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "result": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "result"
      },
      "inputs": {
        "result": ":nestedNode.node1"
      }
    }
  }
}
```

#### graphDataMap5
```json
{
  "version": 0.5,
  "nodes": {
    "source1": {
      "value": [
        "hello",
        "hello2"
      ]
    },
    "nestedNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source1"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "node1": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "result": {
      "agent": "copyAgent",
      "params": {
        "flat": 2,
        "namedKey": "res"
      },
      "inputs": {
        "res": ":nestedNode.node1"
      }
    }
  }
}
```

#### graphDataPush
```json
{
  "version": 0.5,
  "loop": {
    "count": 10
  },
  "nodes": {
    "array": {
      "value": [],
      "update": ":reducer.array"
    },
    "item": {
      "agent": "sleepAndMergeAgent",
      "params": {
        "duration": 10,
        "value": "hello"
      }
    },
    "reducer": {
      "isResult": true,
      "agent": "pushAgent",
      "inputs": {
        "array": ":array",
        "item": ":item"
      }
    }
  }
}
```

#### graphDataPop
```json
{
  "version": 0.5,
  "loop": {
    "while": ":source"
  },
  "nodes": {
    "source": {
      "value": [
        "orange",
        "banana",
        "lemon"
      ],
      "update": ":popper.array"
    },
    "result": {
      "value": [],
      "update": ":reducer.array"
    },
    "popper": {
      "inputs": {
        "array": ":source"
      },
      "agent": "popAgent"
    },
    "reducer": {
      "agent": "pushAgent",
      "inputs": {
        "array": ":result",
        "item": ":popper.item"
      }
    }
  }
}
```

#### graphDataNested
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "hello"
    },
    "parent": {
      "agent": "nestedAgent",
      "inputs": {
        "source": ":source"
      },
      "isResult": true,
      "graph": {
        "loop": {
          "count": 10
        },
        "nodes": {
          "array": {
            "value": [],
            "update": ":reducer.array"
          },
          "item": {
            "agent": "sleepAndMergeAgent",
            "params": {
              "duration": 10,
              "value": ":source"
            }
          },
          "reducer": {
            "agent": "pushAgent",
            "inputs": {
              "array": ":array",
              "item": ":item"
            },
            "isResult": true
          }
        }
      }
    }
  }
}
```

#### graphDataNestedPop
```json
{
  "version": 0.5,
  "nodes": {
    "fruits": {
      "value": [
        "orange",
        "banana",
        "lemon"
      ]
    },
    "parent": {
      "agent": "nestedAgent",
      "isResult": true,
      "inputs": {
        "fruits": ":fruits"
      },
      "graph": {
        "loop": {
          "while": ":fruits"
        },
        "nodes": {
          "fruits": {
            "value": [],
            "update": ":popper.array"
          },
          "result": {
            "value": [],
            "update": ":reducer.array",
            "isResult": true
          },
          "popper": {
            "inputs": {
              "array": ":fruits"
            },
            "agent": "popAgent"
          },
          "reducer": {
            "agent": "pushAgent",
            "inputs": {
              "array": ":result",
              "item": ":popper.item"
            }
          }
        }
      }
    }
  }
}
```

#### graphDataNestedInjection
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": "hello"
    },
    "parent": {
      "agent": "nestedAgent",
      "inputs": {
        "inner_source": ":source"
      },
      "isResult": true,
      "graph": {
        "loop": {
          "count": 10
        },
        "nodes": {
          "array": {
            "value": [],
            "update": ":reducer.array"
          },
          "item": {
            "agent": "sleepAndMergeAgent",
            "params": {
              "duration": 10,
              "value": ":inner_source"
            }
          },
          "reducer": {
            "agent": "pushAgent",
            "inputs": {
              "array": ":array",
              "item": ":item"
            },
            "isResult": true
          }
        }
      }
    }
  }
}
```

#### forkGraph
```json
{
  "version": 0.5,
  "nodes": {
    "source": {
      "value": {
        "content": [
          {
            "level1": {
              "level2": "hello1"
            }
          },
          {
            "level1": {
              "level2": "hello2"
            }
          }
        ]
      }
    },
    "mapNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":source.content"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "workingMemory": {
            "value": {}
          },
          "forked": {
            "agent": "sleepAndMergeAgent",
            "inputs": {
              "array": [
                ":row.level1"
              ]
            }
          },
          "forked2": {
            "agent": "sleepAndMergeAgent",
            "inputs": {
              "array": [
                ":forked"
              ]
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "copyAgent": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "result"
      },
      "inputs": {
        "result": [
          ":mapNode"
        ]
      }
    }
  }
}
```

#### graphDataBypass
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": "hello"
      }
    },
    "copyAgent": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": [
          ":echo"
        ]
      }
    },
    "copyAgent2": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": [
          ":copyAgent.$0"
        ]
      }
    }
  }
}
```

#### graphDataBypass2
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": [
          "hello",
          "hello"
        ]
      }
    },
    "mapNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":echo.message"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "copyAgent": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "copyAgent2": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":mapNode.copyAgent"
        ]
      }
    }
  }
}
```

#### graphDataBypass3
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": [
          "hello",
          "hello"
        ]
      }
    },
    "mapNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":echo.message"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "copyAgent": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": [
                ":row"
              ]
            }
          },
          "copyAgent2": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "text"
            },
            "inputs": {
              "text": ":copyAgent"
            }
          },
          "copyAgent3": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "text"
            },
            "inputs": {
              "text": ":copyAgent2.$0"
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "copyAgent4": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": ":mapNode.copyAgent3"
      }
    }
  }
}
```

#### graphDataBypass4
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": [
          "hello",
          "hello"
        ]
      }
    },
    "mapNode": {
      "agent": "mapAgent",
      "inputs": {
        "rows": ":echo.message"
      },
      "graph": {
        "version": 0.5,
        "nodes": {
          "copyAgent": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "row"
            },
            "inputs": {
              "row": ":row"
            }
          },
          "copyAgent2": {
            "agent": "copyAgent",
            "params": {
              "namedKey": "array"
            },
            "inputs": {
              "array": [
                ":copyAgent",
                ":row"
              ]
            },
            "isResult": true
          }
        }
      },
      "params": {
        "compositeResult": true
      }
    },
    "copyAgent3": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "text"
      },
      "inputs": {
        "text": ":mapNode.copyAgent2"
      }
    }
  }
}
```

#### graphDataBypass5
```json
{
  "version": 0.5,
  "nodes": {
    "echo": {
      "agent": "echoAgent",
      "params": {
        "message": "hello"
      }
    },
    "copyAgent": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":echo",
          ":echo",
          ":echo"
        ]
      }
    },
    "copyAgent2": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":copyAgent",
          ":copyAgent"
        ]
      }
    },
    "copyAgent3": {
      "agent": "copyAgent",
      "params": {
        "namedKey": "array"
      },
      "inputs": {
        "array": [
          ":copyAgent2",
          ":copyAgent2"
        ]
      }
    }
  }
}
```
