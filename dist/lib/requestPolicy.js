"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A base class implementation of RequestPolicy.
 */
var BaseRequestPolicy = /** @class */ (function () {
    function BaseRequestPolicy(nextPolicy, options) {
        this.nextPolicy = nextPolicy;
        this.options = options;
    }
    /**
     * Get whether or not a log with the provided log level should be logged.
     * @param logLevel The log level of the log that will be logged.
     * @returns Whether or not a log with the provided log level should be logged.
     */
    BaseRequestPolicy.prototype.shouldLog = function (logLevel) {
        return this.options.shouldLog(logLevel);
    };
    /**
     * Attempt to log the provided message to the provided logger. If no logger was provided or if
     * the log level does not meat the logger's threshold, then nothing will be logged.
     * @param logLevel The log level of this log.
     * @param message The message of this log.
     */
    BaseRequestPolicy.prototype.log = function (logLevel, message) {
        this.options.log(logLevel, message);
    };
    return BaseRequestPolicy;
}());
exports.BaseRequestPolicy = BaseRequestPolicy;
//# sourceMappingURL=requestPolicy.js.map