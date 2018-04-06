"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A HttpPipelineLogger that will send its logs to the console.
 */
var ConsoleHttpPipelineLogger = /** @class */ (function () {
    /**
     * Create a new ConsoleHttpPipelineLogger.
     * @param minimumLogLevel The log level threshold for what logs will be logged.
     */
    function ConsoleHttpPipelineLogger(minimumLogLevel) {
        this.minimumLogLevel = minimumLogLevel;
    }
    /**
     * Log the provided message.
     * @param logLevel The HttpLogDetailLevel associated with this message.
     * @param message The message to log.
     * @param formattedArguments A variadic list of arguments that should be formatted into the
     *                           provided message.
     */
    ConsoleHttpPipelineLogger.prototype.log = function (logLevel, message) {
        console.log(logLevel + ": " + message);
    };
    return ConsoleHttpPipelineLogger;
}());
exports.ConsoleHttpPipelineLogger = ConsoleHttpPipelineLogger;
//# sourceMappingURL=httpPipelineLogger.js.map