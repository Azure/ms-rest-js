// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpPipelineLogLevel, httpPipelineLogLevelToString } from "./httpPipelineLogLevel";

/**
 * A Logger that can be added to a HttpPipeline. This enables each RequestPolicy to log messages
 * that can be used for debugging purposes.
 */
export interface HttpPipelineLogger {
    /**
     * The log level threshold for what logs will be logged.
     * @return The log level threshold for what logs will be logged.
     */
    minimumLogLevel: HttpPipelineLogLevel;

    /**
     * Log the provided message.
     * @param logLevel The HttpLogDetailLevel associated with this message.
     * @param message The message to log.
     * @param formattedArguments A variadic list of arguments that should be formatted into the
     *                           provided message.
     */
    log(logLevel: HttpPipelineLogLevel, message: string): void;
}

/**
 * A HttpPipelineLogger that will send its logs to the console.
 */
export class ConsoleHttpPipelineLogger implements HttpPipelineLogger {
    constructor(private _minimumLogLevel: HttpPipelineLogLevel) {
    }

    /**
     * The log level threshold for what logs will be logged.
     * @return The log level threshold for what logs will be logged.
     */
    public get minimumLogLevel(): HttpPipelineLogLevel {
        return this._minimumLogLevel;
    }

    /**
     * Set the log level threshold for what logs will be logged.
     * @param The new minimum log level.
     */
    public set minimumLogLevel(minimumLogLevel: HttpPipelineLogLevel) {
        this._minimumLogLevel = minimumLogLevel;
    }

    /**
     * Log the provided message.
     * @param logLevel The HttpLogDetailLevel associated with this message.
     * @param message The message to log.
     * @param formattedArguments A variadic list of arguments that should be formatted into the
     *                           provided message.
     */
    log(logLevel: HttpPipelineLogLevel, message: string): void {
        const logLevelString: string = httpPipelineLogLevelToString(logLevel);
        console.log(`${logLevelString}: ${message}`);
    }
}