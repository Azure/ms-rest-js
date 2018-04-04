// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpClient } from "../lib/httpClient";
import { HttpRequest } from "../lib/httpRequest";
import { HttpResponse } from "../lib/httpResponse";

/**
 * A simple HttpClient implementation that uses a provided function to respond to HttpRequests.
 */
export class InMemoryHttpClient implements HttpClient {
    constructor(private _requestHandler: (request: HttpRequest) => Promise<HttpResponse>) {
    }

    send(request: HttpRequest): Promise<HttpResponse> {
        return this._requestHandler(request);
    }
}