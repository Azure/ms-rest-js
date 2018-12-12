import { NormalModuleReplacementPlugin } from "webpack";
import glob from "glob";
import path from "path";

const defaults = {
  port: 9876
};

module.exports = function (config: any) {
  config.set({
    plugins: [
      "karma-mocha",
      "karma-chrome-launcher",
      "karma-webpack"
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
      "test/**/*.ts": ["webpack"]
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

    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: [`http://localhost:${defaults.port}/debug.html`, "--auto-open-devtools-for-tabs"]
      }
    },

    webpack: {
      entry: [...glob.sync(path.join(__dirname, "test/**/*.ts"))],
      mode: "development",
      devtool: "source-map",
      output: {
        filename: "dist/msRest.browser.test.js",
        path: __dirname
      },
      plugins: [
        new NormalModuleReplacementPlugin(/(\.).+util\/base64/, path.resolve(__dirname, "./lib/util/base64.browser.ts")),
        new NormalModuleReplacementPlugin(/(\.).+util\/xml/, path.resolve(__dirname, "./lib/util/xml.browser.ts")),
        new NormalModuleReplacementPlugin(/(\.).+defaultHttpClient/, path.resolve(__dirname, "./lib/defaultHttpClient.browser.ts")),
        new NormalModuleReplacementPlugin(/(\.).+msRestUserAgentPolicy/, path.resolve(__dirname, "./lib/policies/msRestUserAgentPolicy.browser.ts"))
      ],
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /(node_modules)/,
            options: { configFile: path.join(__dirname, "./tsconfig.es.json") }
          }
        ]
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js"]
      },
      node: {
        fs: "empty",
        net: false,
        path: "empty",
        dns: false,
        tls: false,
        tty: false,
        v8: false,
        Buffer: false,
        process: false,
        stream: "empty"
      }
    }
  });

  console.log(config.rollupPreprocessor);
};
