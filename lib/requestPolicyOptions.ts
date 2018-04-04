// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpPipelineLogger } from "./httpPipelineLogger";
import { HttpPipelineLogLevel } from "./httpPipelineLogLevel";

/**
 * Optional properties that can be used when creating a RequestPolicy.
 */
export class RequestPolicyOptions {
    constructor(private _logger?: HttpPipelineLogger) {
    }

    /**
     * Get whether or not a log with the provided log level should be logged.
     * @param logLevel The log level of the log that will be logged.
     * @returns Whether or not a log with the provided log level should be logged.
     */
    public shouldLog(logLevel: HttpPipelineLogLevel): boolean {
        return !!this._logger &&
            logLevel !== HttpPipelineLogLevel.OFF &&
            logLevel <= this._logger.minimumLogLevel();
    }

    /**
     * Attempt to log the provided message to the provided logger. If no logger was provided or if
     * the log level does not meat the logger's threshold, then nothing will be logged.
     * @param logLevel The log level of this log.
     * @param message The message of this log.
     */
    public log(logLevel: HttpPipelineLogLevel, message: string): void {
        if (this._logger) {
            this._logger.log(logLevel, message);
        }
    }
}