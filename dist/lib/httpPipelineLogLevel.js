"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The different levels of logs that can be used with the HttpPipelineLogger.
 */
var HttpPipelineLogLevel;
(function (HttpPipelineLogLevel) {
    /**
     * A log level that indicates that no logs will be logged.
     */
    HttpPipelineLogLevel[HttpPipelineLogLevel["OFF"] = 0] = "OFF";
    /**
     * An error log.
     */
    HttpPipelineLogLevel[HttpPipelineLogLevel["ERROR"] = 1] = "ERROR";
    /**
     * A warning log.
     */
    HttpPipelineLogLevel[HttpPipelineLogLevel["WARNING"] = 2] = "WARNING";
    /**
     * An information log.
     */
    HttpPipelineLogLevel[HttpPipelineLogLevel["INFO"] = 3] = "INFO";
})(HttpPipelineLogLevel = exports.HttpPipelineLogLevel || (exports.HttpPipelineLogLevel = {}));
/**
 * Convert the provided HttpPipelineLogLevel to its string representation.
 * @param logLevel The HttpPipelineLogLevel to convert to a string.
 * @returns The string representation of the provided HttpPipelineLogLevel.
 */
function httpPipelineLogLevelToString(logLevel) {
    var result;
    switch (logLevel) {
        case HttpPipelineLogLevel.ERROR:
            result = "ERROR";
            break;
        case HttpPipelineLogLevel.INFO:
            result = "INFO";
            break;
        case HttpPipelineLogLevel.OFF:
            result = "OFF";
            break;
        case HttpPipelineLogLevel.WARNING:
            result = "WARNING";
            break;
        default:
            throw new Error("Unrecognized HttpPipelineLogLevel: " + logLevel);
    }
    return result;
}
exports.httpPipelineLogLevelToString = httpPipelineLogLevelToString;
//# sourceMappingURL=httpPipelineLogLevel.js.map