import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export declare class HttpRequest {
    httpMethod: HttpMethod;
    url: string;
    body: string | undefined;
    /**
     * Get the HTTP headers that will be sent with this request.
     */
    readonly headers: HttpHeaders;
    /**
     *
     * @param httpMethod The HTTP method that this request will use.
     * @param url The URL that this request will be sent to.
     * @param headers The HTTP headers that will be sent with this request.
     * @param body The body that will be sent with this request.
     */
    constructor(httpMethod: HttpMethod, url: string, headers: HttpHeaders | RawHttpHeaders, body?: string | undefined);
    /**
     * Create a deep clone/copy of this HttpRequest.
     */
    clone(): HttpRequest;
}
