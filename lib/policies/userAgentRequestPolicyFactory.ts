// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";

/**
 * Get a RequestPolicyFactory that creates UserAgentRequestPolicies.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
export function userAgentRequestPolicyFactory(userAgent: string): RequestPolicyFactory {
    return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
        return new UserAgentRequestPolicy(userAgent, nextPolicy, options);
    };
}

class UserAgentRequestPolicy extends BaseRequestPolicy {
    constructor(private _userAgent: string, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
        super(nextPolicy, options);
    }

    send(request: HttpRequest): Promise<HttpResponse> {
        if (this.shouldLog(HttpPipelineLogLevel.INFO)) {
            this.log(HttpPipelineLogLevel.INFO, `Set "User-Agent" header to "${this._userAgent}".`);
        }
        request.headers.set("User-Agent", this._userAgent);
        return this.nextPolicy.send(request);
    }
}