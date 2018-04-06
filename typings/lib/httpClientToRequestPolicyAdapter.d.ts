import { HttpClient } from "./httpClient";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { RequestPolicy } from "./requestPolicy";
/**
 * An adapter type that adapts a HttpClient to look like a RequestPolicy.
 */
export declare class HttpClientToRequestPolicyAdapter implements RequestPolicy {
    private _httpClient;
    constructor(_httpClient: HttpClient);
    send(request: HttpRequest): Promise<HttpResponse>;
}
