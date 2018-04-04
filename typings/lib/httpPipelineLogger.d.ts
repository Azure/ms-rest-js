import { HttpPipelineLogLevel } from "./httpPipelineLogLevel";
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
export declare class ConsoleHttpPipelineLogger implements HttpPipelineLogger {
    private _minimumLogLevel;
    constructor(_minimumLogLevel: HttpPipelineLogLevel);
    /**
     * The log level threshold for what logs will be logged.
     * @return The log level threshold for what logs will be logged.
     */
    /**
     * Set the log level threshold for what logs will be logged.
     * @param The new minimum log level.
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
