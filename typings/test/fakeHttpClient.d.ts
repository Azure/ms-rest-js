import { HttpClient } from "../lib/httpClient";
import { HttpRequest } from "../lib/httpRequest";
import { HttpResponse } from "../lib/httpResponse";
/**
 * A function that can send HttpRequests and receive promised HttpResponses.
 * @param request The HTTP request to send.
 * @returns A Promise that resolves to the HttpResponse from the targeted server.
 */
export declare class FakeHttpClient implements HttpClient {
    private readonly sendFunction;
    constructor(sendFunction: (request: HttpRequest) => Promise<HttpResponse>);
    /**
     * Send the provided HttpRequest and return a Promise that resolves to the HttpResponse from the
     * targeted server.
     * @param request The HttpRequest to send.
     */
    send(request: HttpRequest): Promise<HttpResponse>;
}
