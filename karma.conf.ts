const alias = require("rollup-plugin-alias");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const sourcemaps = require("rollup-plugin-sourcemaps");
const visualizer = require("rollup-plugin-visualizer");
const multiEntry = require("rollup-plugin-multi-entry");

// const rollupConfig = require("./rollup.config");

const defaults = {
  port: 9876
};

module.exports = function (config: any) {
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
      external: [],
      output: {
        file: "./dist/msRest.browser.test.js",
        format: "umd",
        name: "msRest",
        sourcemap: true,
      },
      plugins: [
        alias({
          "./defaultHttpClient": "./defaultHttpClient.browser",
          "./msRestUserAgentPolicy": "./msRestUserAgentPolicy.browser"
        }),
        nodeResolve({
          module: true,
          browser: true
        }),
        multiEntry(),
        commonjs({
          namedExports: {
            "chai": ["assert", "AssertionError"]
          }
        }),
        sourcemaps(),
        visualizer({
          filename: "dist/browser-stats.html",
          sourcemap: true
        })
      ]
    },

    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: [`-app:http://localhost:${defaults.port}/debug.html`, "--auto-open-devtools-for-tabs"]
      }
    }

    // webpack: {
    //   mode: "development",
    //   devtool: "source-map",
    //   plugins: [
    //     new NormalModuleReplacementPlugin(/(\.).+util\/base64/, path.resolve(__dirname, "es/lib/util/base64.browser.js")),
    //     new NormalModuleReplacementPlugin(/(\.).+util\/xml/, path.resolve(__dirname, "es/lib/util/xml.browser.js")),
    //     new NormalModuleReplacementPlugin(/(\.).+defaultHttpClient/, path.resolve(__dirname, "es/lib/defaultHttpClient.browser.js")),
    //     new NormalModuleReplacementPlugin(/(\.).+msRestUserAgentPolicy/, path.resolve(__dirname, "es/lib/policies/msRestUserAgentPolicy.browser.js"))
    //   ],
    //   resolve: {
    //     extensions: [".js"]
    //   },
    //   node: {
    //     fs: "empty",
    //     net: false,
    //     path: "empty",
    //     dns: false,
    //     tls: false,
    //     tty: false,
    //     v8: false,
    //     Buffer: false,
    //     process: false,
    //     stream: "empty"
    //   }
    // } as Configuration
  });
};
