// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpResponse } from "../lib/httpResponse";
import { HttpRequest } from "../lib/httpRequest";
import { HttpHeaders } from "../lib/httpHeaders";

export class InMemoryHttpResponse implements HttpResponse {
    constructor(private _request: HttpRequest, private _statusCode: number, private _headers: HttpHeaders, private _bodyText?: string) {
    }

    public get request(): HttpRequest {
        return this._request;
    }

    public get statusCode(): number {
        return this._statusCode;
    }

    public get headers(): HttpHeaders {
        return this._headers;
    }
    
    bodyAsText(): Promise<string | undefined> {
        return Promise.resolve(this._bodyText);
    }
    bodyAsJson(): Promise<{} | any[] | undefined> {
        return Promise.resolve(this._bodyText ? JSON.parse(this._bodyText) : undefined);
    }
}