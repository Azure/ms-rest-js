import { HttpPipelineOptions } from "./httpPipelineOptions";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { RequestPolicyFactory } from "./requestPolicyFactory";
/**
 * A collection of RequestPolicies that will be applied to a HTTP request before it is sent and will
 * be applied to a HTTP response when it is received.
 */
export declare class HttpPipeline {
    private _requestPolicyFactories;
    private _options;
    private readonly _httpClient;
    private readonly _requestPolicyOptions;
    constructor(_requestPolicyFactories: RequestPolicyFactory[], _options: HttpPipelineOptions);
    /**
     * Send the provided HttpRequest request.
     * @param request The HTTP request to send.
     * @return A Promise that resolves to the HttpResponse from the targeted server.
     */
    send(request: HttpRequest): Promise<HttpResponse>;
}
