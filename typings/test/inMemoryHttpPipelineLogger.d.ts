import { HttpPipelineLogLevel } from "../lib/httpPipelineLogLevel";
import { HttpPipelineLogger } from "../lib/httpPipelineLogger";
/**
 * An in-memory HttpPipelineLogger that can be used for testing.
 */
export declare class InMemoryHttpPipelineLogger implements HttpPipelineLogger {
    private _minimumLogLevel;
    private readonly _logs;
    constructor(_minimumLogLevel?: HttpPipelineLogLevel);
    /**
     * Get the logs that have been written to this HttpPipelineLogger.
     */
    readonly logs: string[];
    minimumLogLevel: HttpPipelineLogLevel;
    log(logLevel: HttpPipelineLogLevel, message: string): void;
}
