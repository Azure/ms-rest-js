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
    minimumLogLevel(): HttpPipelineLogLevel;
    /**
     * Log the provided message.
     * @param logLevel The HttpLogDetailLevel associated with this message.
     * @param message The message to log.
     * @param formattedArguments A variadic list of arguments that should be formatted into the
     *                           provided message.
     */
    log(logLevel: HttpPipelineLogLevel, message: string): void;
}
