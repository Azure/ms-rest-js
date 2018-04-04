// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * The different levels of logs that can be used with the HttpPipelineLogger.
 */
export enum HttpPipelineLogLevel {
    /**
     * A log level that indicates that no logs will be logged.
     */
    OFF,

    /**
     * An error log.
     */
    ERROR,

    /**
     * A warning log.
     */
    WARNING,

    /**
     * An information log.
     */
    INFO
}

/**
 * Convert the provided HttpPipelineLogLevel to its string representation.
 * @param logLevel The HttpPipelineLogLevel to convert to a string.
 * @returns The string representation of the provided HttpPipelineLogLevel.
 */
export function httpPipelineLogLevelToString(logLevel: HttpPipelineLogLevel): string {
    let result: string;
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
            throw new Error(`Unrecognized HttpPipelineLogLevel: ${logLevel}`);
    }
    return result;
}