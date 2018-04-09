// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";

/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export class HttpRequest {
    /**
     * Get the HTTP headers that will be sent with this request.
     */
    public readonly headers: HttpHeaders;

    /**
     *
     * @param httpMethod The HTTP method that this request will use.
     * @param url The URL that this request will be sent to.
     * @param headers The HTTP headers that will be sent with this request.
     * @param body The body that will be sent with this request.
     */
    constructor(public httpMethod: HttpMethod, public url: string, headers: HttpHeaders | RawHttpHeaders, public body?: string) {
        if (!this.url) {
            const urlString: string = (this.url === undefined || this.url === null ? this.url : `"${this.url}"`);
            throw new Error(`${urlString} is not a valid URL for a HttpRequest.`);
        }

        this.headers = (headers instanceof HttpHeaders ? headers : new HttpHeaders(headers));
    }

    /**
     * Create a deep clone/copy of this HttpRequest.
     */
    public clone(): HttpRequest {
        return new HttpRequest(this.httpMethod, this.url, this.headers.clone(), this.body);
    }
}