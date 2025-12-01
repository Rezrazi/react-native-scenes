const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const { resolve } = require("node:path");

// biome-ignore lint/correctness/noGlobalDirnameFilename: bypass
const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

const monorepoRoot = resolve(projectRoot, "../..");

config.watchFolders = [monorepoRoot];

const { resolver } = config;

config.resolver = {
  ...resolver,
  sourceExts: [...resolver.sourceExts, "mjs", "cjs"],
};

const uniwindConfig = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
  extraThemes: ["catppuccin-latte", "catppuccin-mocha", "claude-light", "claude-dark"],
});

module.exports = uniwindConfig;
