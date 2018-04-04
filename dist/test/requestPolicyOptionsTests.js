"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var requestPolicyOptions_1 = require("../lib/requestPolicyOptions");
var inMemoryHttpPipelineLogger_1 = require("./inMemoryHttpPipelineLogger");
var httpPipelineLogLevel_1 = require("../lib/httpPipelineLogLevel");
describe("RequestPolicyOptions", function () {
    describe("shouldLog()", function () {
        it("should return false when the logger is undefined", function () {
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(undefined);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR), false);
        });
        it("should return false when the minimumLogLevel is OFF", function () {
            var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF);
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(logger);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR), false);
        });
        it("should return false when the minimumLogLevel is INFO", function () {
            var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO);
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(logger);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO), true);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING), true);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR), true);
        });
        it("should return false when the minimumLogLevel is WARNING", function () {
            var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING);
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(logger);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING), true);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR), true);
        });
        it("should return false when the minimumLogLevel is ERROR", function () {
            var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR);
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(logger);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING), false);
            assert.strictEqual(requestPolicyOptions.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR), true);
        });
    });
    describe("log()", function () {
        it("should not log when the logger is undefined", function () {
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(undefined);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF, "Message 1");
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO, "Message 2");
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING, "Message 3");
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR, "Message 4");
        });
        it("should not log when the minimumLogLevel is OFF", function () {
            var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF);
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(logger);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF, "Message 1");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO, "Message 2");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING, "Message 3");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR, "Message 4");
            assert.deepStrictEqual(logger.logs, []);
        });
        it("should not log when the minimumLogLevel is INFO", function () {
            var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO);
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(logger);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF, "Message 1");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO, "Message 2");
            assert.deepStrictEqual(logger.logs, [
                "INFO: Message 2"
            ]);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING, "Message 3");
            assert.deepStrictEqual(logger.logs, [
                "INFO: Message 2",
                "WARNING: Message 3"
            ]);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR, "Message 4");
            assert.deepStrictEqual(logger.logs, [
                "INFO: Message 2",
                "WARNING: Message 3",
                "ERROR: Message 4"
            ]);
        });
        it("should not log when the minimumLogLevel is WARNING", function () {
            var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING);
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(logger);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF, "Message 1");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO, "Message 2");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING, "Message 3");
            assert.deepStrictEqual(logger.logs, [
                "WARNING: Message 3"
            ]);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR, "Message 4");
            assert.deepStrictEqual(logger.logs, [
                "WARNING: Message 3",
                "ERROR: Message 4"
            ]);
        });
        it("should not log when the minimumLogLevel is ERROR", function () {
            var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR);
            var requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(logger);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF, "Message 1");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO, "Message 2");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING, "Message 3");
            assert.deepStrictEqual(logger.logs, []);
            requestPolicyOptions.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR, "Message 4");
            assert.deepStrictEqual(logger.logs, [
                "ERROR: Message 4"
            ]);
        });
    });
});
//# sourceMappingURL=requestPolicyOptionsTests.js.map