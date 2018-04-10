// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { ServiceClientCredentials } from "../credentials/serviceClientCredentials";
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";

/**
 * Get a RequestPolicyFactory that creates SigningPolicies.
 * @param authenticationProvider The provider to use to sign requests.
 */
export function signingPolicy(authenticationProvider: ServiceClientCredentials): RequestPolicyFactory {
    return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
        return new SigningPolicy(authenticationProvider, nextPolicy, options);
    };
}

class SigningPolicy extends BaseRequestPolicy {
    constructor(private readonly _authenticationProvider: ServiceClientCredentials, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
        super(nextPolicy, options);
    }

    public async send(request: HttpRequest): Promise<HttpResponse> {
        const signedRequest: HttpRequest = await this._authenticationProvider.signHttpRequest(request);
        return await this._nextPolicy.send(signedRequest);
    }
}