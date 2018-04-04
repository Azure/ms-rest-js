import { HttpClient } from "./httpClient";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
/**
 * A HttpClient implementation that uses fetch to send HTTP requests.
 */
export declare class FetchHttpClient implements HttpClient {
    constructor();
    send(request: HttpRequest): Promise<HttpResponse>;
}
