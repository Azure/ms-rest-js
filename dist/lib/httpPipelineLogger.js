"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var httpPipelineLogLevel_1 = require("./httpPipelineLogLevel");
/**
 * A HttpPipelineLogger that will send its logs to the console.
 */
var ConsoleHttpPipelineLogger = /** @class */ (function () {
    function ConsoleHttpPipelineLogger(_minimumLogLevel) {
        this._minimumLogLevel = _minimumLogLevel;
    }
    Object.defineProperty(ConsoleHttpPipelineLogger.prototype, "minimumLogLevel", {
        /**
         * The log level threshold for what logs will be logged.
         * @return The log level threshold for what logs will be logged.
         */
        get: function () {
            return this._minimumLogLevel;
        },
        /**
         * Set the log level threshold for what logs will be logged.
         * @param The new minimum log level.
         */
        set: function (minimumLogLevel) {
            this._minimumLogLevel = minimumLogLevel;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Log the provided message.
     * @param logLevel The HttpLogDetailLevel associated with this message.
     * @param message The message to log.
     * @param formattedArguments A variadic list of arguments that should be formatted into the
     *                           provided message.
     */
    ConsoleHttpPipelineLogger.prototype.log = function (logLevel, message) {
        var logLevelString = httpPipelineLogLevel_1.httpPipelineLogLevelToString(logLevel);
        console.log(logLevelString + ": " + message);
    };
    return ConsoleHttpPipelineLogger;
}());
exports.ConsoleHttpPipelineLogger = ConsoleHttpPipelineLogger;
//# sourceMappingURL=httpPipelineLogger.js.map