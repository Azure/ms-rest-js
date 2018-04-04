"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var httpPipelineLogLevel_1 = require("../lib/httpPipelineLogLevel");
/**
 * An in-memory HttpPipelineLogger that can be used for testing.
 */
var InMemoryHttpPipelineLogger = /** @class */ (function () {
    function InMemoryHttpPipelineLogger(_minimumLogLevel) {
        if (_minimumLogLevel === void 0) { _minimumLogLevel = httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO; }
        this._minimumLogLevel = _minimumLogLevel;
        this._logs = [];
    }
    Object.defineProperty(InMemoryHttpPipelineLogger.prototype, "logs", {
        /**
         * Get the logs that have been written to this HttpPipelineLogger.
         */
        get: function () {
            return this._logs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InMemoryHttpPipelineLogger.prototype, "minimumLogLevel", {
        get: function () {
            return this._minimumLogLevel;
        },
        set: function (minimumLogLevel) {
            this._minimumLogLevel = minimumLogLevel;
        },
        enumerable: true,
        configurable: true
    });
    InMemoryHttpPipelineLogger.prototype.log = function (logLevel, message) {
        var logLevelString = httpPipelineLogLevel_1.httpPipelineLogLevelToString(logLevel);
        this._logs.push(logLevelString + ": " + message);
    };
    return InMemoryHttpPipelineLogger;
}());
exports.InMemoryHttpPipelineLogger = InMemoryHttpPipelineLogger;
//# sourceMappingURL=inMemoryHttpPipelineLogger.js.map