import { HttpClient } from "../lib/httpClient";
import { HttpRequest } from "../lib/httpRequest";
import { HttpResponse } from "../lib/httpResponse";
/**
 * A simple HttpClient implementation that uses a provided function to respond to HttpRequests.
 */
export declare class InMemoryHttpClient implements HttpClient {
    private _requestHandler;
    constructor(_requestHandler: (request: HttpRequest) => Promise<HttpResponse>);
    send(request: HttpRequest): Promise<HttpResponse>;
}
