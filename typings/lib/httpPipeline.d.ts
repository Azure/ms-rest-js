import { HttpPipelineOptions } from "./httpPipelineOptions";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { RequestPolicyFactory } from "./requestPolicyFactory";
/**
 * A collection of RequestPolicies that will be applied to a HTTP request before it is sent and will
 * be applied to a HTTP response when it is received.
 */
export declare class HttpPipeline {
    private readonly requestPolicyFactories;
    private readonly options;
    private readonly httpClient;
    private readonly requestPolicyOptions;
    constructor(requestPolicyFactories: RequestPolicyFactory[], options: HttpPipelineOptions);
    /**
     * Send the provided HttpRequest request.
     * @param request The HTTP request to send.
     * @return A Promise that resolves to the HttpResponse from the targeted server.
     */
    send(request: HttpRequest): Promise<HttpResponse>;
}
