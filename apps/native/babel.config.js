const path = require("node:path");

module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@/registry": path.resolve(__dirname, "../../packages/registry/src"),
        },
        extensions: [".tsx", ".ts", ".js", ".json"],
      },
    ],
  ],
};
