import { HttpClient } from "./httpClient";
import { HttpPipelineLogger } from "./httpPipelineLogger";
/**
 * A set of optional arguments that can be passed to a HttpPipeline.
 */
export interface HttpPipelineOptions {
    /**
     * The HttpClient that will be used for the created HttpPipeline. If no HttpClient is provided
     * here, then a default HttpClient implementation will be used.
     */
    httpClient?: HttpClient;
    /**
     * The Logger that will be used for each RequestPolicy within the created HttpPipeline.
     */
    pipelineLogger?: HttpPipelineLogger;
}
