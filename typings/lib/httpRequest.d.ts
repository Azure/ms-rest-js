import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export declare class HttpRequest {
    private _httpMethod;
    private _url;
    private _body;
    private readonly _headers;
    constructor(_httpMethod: HttpMethod, _url: string, headers: HttpHeaders | RawHttpHeaders, _body?: string | undefined);
    /**
     * Get the HTTP method that this request will use.
     */
    readonly httpMethod: HttpMethod;
    /**
     * Get the URL that this request will be sent to.
     */
    readonly url: string;
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
