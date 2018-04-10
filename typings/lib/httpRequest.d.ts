import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export declare class HttpRequest {
    httpMethod: HttpMethod;
    url: string;
    private _body;
    private readonly _headers;
    /**
     * Create a new HTTP request using the provided properties.
     * @param _httpMethod The HTTP method that will be used to send this request.
     * @param url The URL that this request will be sent to.
     * @param headers The HTTP headers to include in this request.
     * @param _body The body of this HTTP request.
     */
    constructor(httpMethod: HttpMethod, url: string, headers: HttpHeaders | RawHttpHeaders, _body?: string | undefined);
    /**
     * Get the HTTP headers that will be sent with this request.
     */
    readonly headers: HttpHeaders;
    /**
     * Get the body that will be sent with this request.
     */
    readonly body: string | undefined;
    /**
     * Create a deep clone/copy of this HttpRequest.
     */
    clone(): HttpRequest;
}
