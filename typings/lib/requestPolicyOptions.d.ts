import { HttpPipelineLogger } from "./httpPipelineLogger";
import { HttpPipelineLogLevel } from "./httpPipelineLogLevel";
/**
 * Optional properties that can be used when creating a RequestPolicy.
 */
export declare class RequestPolicyOptions {
    private _logger;
    constructor(_logger?: HttpPipelineLogger | undefined);
    /**
     * Get whether or not a log with the provided log level should be logged.
     * @param logLevel The log level of the log that will be logged.
     * @returns Whether or not a log with the provided log level should be logged.
     */
    shouldLog(logLevel: HttpPipelineLogLevel): boolean;
    /**
     * Attempt to log the provided message to the provided logger. If no logger was provided or if
     * the log level does not meat the logger's threshold, then nothing will be logged.
     * @param logLevel The log level of this log.
     * @param message The message of this log.
     */
    log(logLevel: HttpPipelineLogLevel, message: string): void;
}
