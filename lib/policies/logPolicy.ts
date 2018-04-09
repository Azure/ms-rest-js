import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicy, BaseRequestPolicy } from "../requestPolicy";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { InMemoryHttpResponse } from "../inMemoryHttpResponse";

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Get a RequestPolicyFactory that creates UserAgentPolicies.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
export function logPolicy(logFunction: (message: string) => void): RequestPolicyFactory {
    return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
        return new LogPolicy(logFunction, nextPolicy, options);
    };
}

class LogPolicy extends BaseRequestPolicy {
    constructor(private readonly _logFunction: (message: string) => void, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
        super(nextPolicy, options);
    }

    public async send(request: HttpRequest): Promise<HttpResponse> {
        this._logFunction(`>> Request: ${JSON.stringify(request, undefined, 2)}`);

        const response: HttpResponse = await this._nextPolicy.send(request);
        const responseBodyText: string | undefined = await response.textBody();
        this._logFunction(`>> Response Status Code: ${response.statusCode}`);
        this._logFunction(`>> Response Body: ${responseBodyText}`);

        return new InMemoryHttpResponse(response.request, response.statusCode, response.headers, responseBodyText);
    }
}