"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var inMemoryHttpPipelineLogger_1 = require("./inMemoryHttpPipelineLogger");
var assert = require("assert");
var httpPipelineLogLevel_1 = require("../lib/httpPipelineLogLevel");
describe("InMemoryHttpPipelineLogger", function () {
    it("should store logs", function () {
        var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger();
        assert.deepStrictEqual(logger.logs, []);
        logger.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO, "Message 1");
        assert.deepStrictEqual(logger.logs, [
            "INFO: Message 1"
        ]);
        logger.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING, "Message 2");
        assert.deepStrictEqual(logger.logs, [
            "INFO: Message 1",
            "WARNING: Message 2"
        ]);
        logger.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR, "Message 3");
        assert.deepStrictEqual(logger.logs, [
            "INFO: Message 1",
            "WARNING: Message 2",
            "ERROR: Message 3"
        ]);
        logger.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF, "Message 4");
        assert.deepStrictEqual(logger.logs, [
            "INFO: Message 1",
            "WARNING: Message 2",
            "ERROR: Message 3",
            "OFF: Message 4"
        ]);
    });
    it("should update the minimumLogLevel", function () {
        var logger = new inMemoryHttpPipelineLogger_1.InMemoryHttpPipelineLogger();
        assert.strictEqual(logger.minimumLogLevel, httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO);
        logger.minimumLogLevel = httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF;
        assert.strictEqual(logger.minimumLogLevel, httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF);
        logger.minimumLogLevel = httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR;
        assert.strictEqual(logger.minimumLogLevel, httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR);
    });
});
//# sourceMappingURL=inMemoryHttpPipelineLoggerTests.js.map