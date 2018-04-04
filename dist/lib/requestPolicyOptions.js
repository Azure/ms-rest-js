"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var httpPipelineLogLevel_1 = require("./httpPipelineLogLevel");
/**
 * Optional properties that can be used when creating a RequestPolicy.
 */
var RequestPolicyOptions = /** @class */ (function () {
    function RequestPolicyOptions(_logger) {
        this._logger = _logger;
    }
    /**
     * Get whether or not a log with the provided log level should be logged.
     * @param logLevel The log level of the log that will be logged.
     * @returns Whether or not a log with the provided log level should be logged.
     */
    RequestPolicyOptions.prototype.shouldLog = function (logLevel) {
        return !!this._logger &&
            logLevel !== httpPipelineLogLevel_1.HttpPipelineLogLevel.OFF &&
            logLevel <= this._logger.minimumLogLevel();
    };
    /**
     * Attempt to log the provided message to the provided logger. If no logger was provided or if
     * the log level does not meat the logger's threshold, then nothing will be logged.
     * @param logLevel The log level of this log.
     * @param message The message of this log.
     */
    RequestPolicyOptions.prototype.log = function (logLevel, message) {
        if (this._logger) {
            this._logger.log(logLevel, message);
        }
    };
    return RequestPolicyOptions;
}());
exports.RequestPolicyOptions = RequestPolicyOptions;
//# sourceMappingURL=requestPolicyOptions.js.map