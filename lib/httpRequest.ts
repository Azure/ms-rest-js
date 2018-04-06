// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";

/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export class HttpRequest {
    private readonly _headers: HttpHeaders;

    constructor(private _httpMethod: HttpMethod, private _url: string, headers: HttpHeaders | RawHttpHeaders, private _body?: string) {
        if (!this._url) {
            const urlString: string = (this._url === undefined || this._url === null ? this._url : `"${this._url}"`);
            throw new Error(`${urlString} is not a valid URL for a HttpRequest.`);
        }

        this._headers = (headers instanceof HttpHeaders ? headers : new HttpHeaders(headers));
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
}