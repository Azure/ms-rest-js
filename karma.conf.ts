 /// <reference path=".typings/karma-plugin-multi-entry.d.ts" />

import multiEntry from "rollup-plugin-multi-entry";
import rollupConfig from "./rollup.config";
import { Config } from "./.typings/karma";
// import { multiEntry } from "./.typings/karma-plugin-multi-entry";

const browserConfig = rollupConfig[1];
const defaults = {
  port: 9876
};

module.exports = function (config: Config) {
  config.set({
    plugins: [
      "karma-mocha",
      "karma-rollup-preprocessor",
      "karma-chrome-launcher",
    ],

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha"],

    // list of files / patterns to load in the browser
    files: [
      { pattern: "dist/msRest.browser.test.js" },
      { pattern: "dist/msRest.browser.test.js.map", included: false }
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "es/**/*.js": ["rollup"],
      "es/**/*.js.map": ["rollup"]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress"],

    // web server port
    port: defaults.port,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["ChromeHeadless"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    rollupPreprocessor: {
      ...browserConfig,
      input: undefined,
      output: {
        file: "./dist/msRest.browser.test.js",
      },
      plugins: [
        multiEntry()
      ]
    },

    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: [`http://localhost:${defaults.port}/debug.html`, "--auto-open-devtools-for-tabs"]
      }
    }
  });

  console.log(config.rollupPreprocessor);
};
