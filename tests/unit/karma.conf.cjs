// @ts-check
/* eslint-env node */
const baseConfig = require("../karma.conf.base.cjs");

/** @type {import("karma").ConfigOptions["files"]} */
const additionalFiles = [
  {
    pattern: "tests/unit/SpecHelper.js",
    type: "module",
    included: false,
  },
  {
    pattern: "tests/unit/**/*-spec.js",
    type: "module",
    included: false,
  },
];

/** @param {import("karma").Config} config */
module.exports = config => {
  const options = baseConfig(config);
  options.files.push(...additionalFiles);

  config.set(options);
};

module.exports.additionalFiles = additionalFiles;
