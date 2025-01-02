import pluginTypescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    external: ["graphai"],
    plugins: [resolve(), commonjs(), pluginTypescript()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.cjs.min.js",
      format: "cjs",
      sourcemap: true,
    },
    external: ["graphai"],
    plugins: [resolve(), commonjs(), pluginTypescript(), terser()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.esm.js",
      format: "esm",
      sourcemap: true,
    },
    external: ["graphai"],
    plugins: [resolve(), commonjs(), pluginTypescript()],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./lib/bundle.esm.min.js",
      format: "esm",
      sourcemap: true,
    },
    external: ["graphai"],
    plugins: [resolve(), commonjs(), pluginTypescript(), terser()],
  },
  {
    input: "./src/index.ts",
    output: {
      name: "openai_fetch_agent",
      file: "./lib/bundle.umd.js",
      format: "umd",
      sourcemap: true,
      globals: {
        graphai: "graphai",
      },
    },
    external: ["graphai"],
    plugins: [resolve(), commonjs(), pluginTypescript()],
  },
];
