// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpClient } from "./httpClient";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { RequestPolicy } from "./requestPolicy";

/**
 * An adapter type that adapts a HttpClient to look like a RequestPolicy.
 */
export class HttpClientToRequestPolicyAdapter implements RequestPolicy {
    constructor(private _httpClient: HttpClient) {
    }

    send(request: HttpRequest): Promise<HttpResponse> {
        return this._httpClient(request);
    }
}