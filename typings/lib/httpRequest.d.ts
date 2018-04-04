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
    private constructor();
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
     * Get the details of the service's operation that this request will be sent for.
     */
    /**
     * Create a new HTTP GET request with the provided properties.
     * @param url The URL that the created GET request will be sent to.
     * @param headers The HTTP headers that will be sent with the created GET request.
     * @param operationDetails The details of the operation that this GET request is being sent for.
     */
    static get(url: string, headers: HttpHeaders): HttpRequest | undefined;
}
