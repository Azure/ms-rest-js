import { HttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export declare class HttpRequest {
    private _httpMethod;
    private _url;
    private _headers;
    private _body;
    constructor(_httpMethod: HttpMethod, _url: string, _headers: HttpHeaders, _body?: string | undefined);
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
}
