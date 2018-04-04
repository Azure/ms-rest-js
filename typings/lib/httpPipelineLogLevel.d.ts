/**
 * The different levels of logs that can be used with the HttpPipelineLogger.
 */
export declare enum HttpPipelineLogLevel {
    /**
     * A log level that indicates that no logs will be logged.
     */
    OFF = 0,
    /**
     * An error log.
     */
    ERROR = 1,
    /**
     * A warning log.
     */
    WARNING = 2,
    /**
     * An information log.
     */
    INFO = 3,
}
/**
 * Convert the provided HttpPipelineLogLevel to its string representation.
 * @param logLevel The HttpPipelineLogLevel to convert to a string.
 * @returns The string representation of the provided HttpPipelineLogLevel.
 */
export declare function httpPipelineLogLevelToString(logLevel: HttpPipelineLogLevel): string;
