// import { Config } from "karma";

// Karma configuration
// Generated on Fri Dec 07 2018 09:06:32 GMT-0800 (GMT-08:00)

module.exports = function (config: any) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["mocha"],


    // list of files / patterns to load in the browser
    files: [
      "dist/msRest.browser.js",
      "dist/msRest.browser.js.map",
      "dist/msRest.browser.test.js",
      "dist/msRest.browser.test.js.map"
    ],


    // list of files / patterns to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // "lib/**/*.ts": "karma-typescript",
      // "test/**/*.ts": "karma-typescript"
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress"],


    // web server port
    port: 9876,


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
    concurrency: 1,

    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json",
      bundlerOptions: {
        transforms: [require("karma-typescript-es6-transform")()]
      }
    }
  });
};
