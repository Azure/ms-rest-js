// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { BaseRequestPolicy, RequestPolicy, RequestPolicyOptions } from "../requestPolicy";
import { WebResource, HttpHeaders, HttpOperationResponse } from "../../msRest";

export class UserAgentPolicy extends BaseRequestPolicy {
    constructor(readonly _nextPolicy: RequestPolicy, readonly _options: RequestPolicyOptions, protected headerKey: string, protected headerValue: string) {
        super(_nextPolicy, _options);
    }

    sendRequest(request: WebResource): Promise<HttpOperationResponse> {
        this.addUserAgentHeader(request);
        return this._nextPolicy.sendRequest(request);
    }

    addUserAgentHeader(request: WebResource): void {
        if (!request.headers) {
            request.headers = new HttpHeaders();
        }

        if (!request.headers.get(this.headerKey)) {
            request.headers.set(this.headerKey, this.headerValue);
        }
    }
}
