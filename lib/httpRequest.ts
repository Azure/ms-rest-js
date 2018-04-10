// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";

/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export class HttpRequest {
    private readonly _headers: HttpHeaders;

    /**
     * Create a new HTTP request using the provided properties.
     * @param _httpMethod The HTTP method that will be used to send this request.
     * @param url The URL that this request will be sent to.
     * @param headers The HTTP headers to include in this request.
     * @param _body The body of this HTTP request.
     */
    constructor(public httpMethod: HttpMethod, public url: string, headers: HttpHeaders | RawHttpHeaders, private _body?: string) {
        if (!this.url) {
            const urlString: string = (this.url === undefined || this.url === null ? this.url : `"${this.url}"`);
            throw new Error(`${urlString} is not a valid URL for a HttpRequest.`);
        }

        this._headers = (headers instanceof HttpHeaders ? headers : new HttpHeaders(headers));
    }

    /**
     * Get the HTTP headers that will be sent with this request.
     */
    public get headers(): HttpHeaders {
        return this._headers;
    }

    /**
     * Get the body that will be sent with this request.
     */
    public get body(): string | undefined {
        return this._body;
    }

    /**
     * Create a deep clone/copy of this HttpRequest.
     */
    public clone(): HttpRequest {
        return new HttpRequest(this.httpMethod, this.url, this.headers.clone(), this.body);
    }
}