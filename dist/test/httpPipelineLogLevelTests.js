"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var httpPipelineLogLevel_1 = require("../lib/httpPipelineLogLevel");
var assert = require("assert");
describe("httpPipelineLogLevelToString()", function () {
    it("should work with ERROR", function () {
        assert.strictEqual(httpPipelineLogLevel_1.httpPipelineLogLevelToString(httpPipelineLogLevel_1.HttpPipelineLogLevel.ERROR), "ERROR");
    });
    it("should work with INFO", function () {
        assert.strictEqual(httpPipelineLogLevel_1.httpPipelineLogLevelToString(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO), "INFO");
    });
    it("should work with WARNING", function () {
        assert.strictEqual(httpPipelineLogLevel_1.httpPipelineLogLevelToString(httpPipelineLogLevel_1.HttpPipelineLogLevel.WARNING), "WARNING");
    });
    it("should work with OFF", function () {
        assert.strictEqual(httpPipelineLogLevel_1.httpPipelineLogLevelToString(httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF), "OFF");
    });
});
//# sourceMappingURL=httpPipelineLogLevelTests.js.map