// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";

/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export class HttpRequest {
    private constructor(private _httpMethod: HttpMethod, private _url: string, private _headers: HttpHeaders, private _body?: string) {
    }

    /**
     * Get the HTTP method that this request will use.
     */
    public get httpMethod(): HttpMethod {
        return this._httpMethod;
    }

    /**
     * Get the URL that this request will be sent to.
     */
    public get url(): string {
        return this._url;
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
     * Create a new HTTP GET request with the provided properties.
     * @param url The URL that the created GET request will be sent to.
     * @param headers The HTTP headers that will be sent with the created GET request.
     * @param operationDetails The details of the operation that this GET request is being sent for.
     */
    public static get(url: string, headers: HttpHeaders): HttpRequest | undefined {
        return !url ? undefined : new HttpRequest("GET", url, headers);
    }
}