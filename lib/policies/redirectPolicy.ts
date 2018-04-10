// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as parse from "url-parse";
import { HttpMethod } from "../httpMethod";
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";

/**
 * Get a RequestPolicyFactory that creates RedirectPolicies.
 * @param maximumRedirections The maximum number of redirections to take before failing.
 */
export function redirectPolicy(maximumRedirections: number): RequestPolicyFactory {
    return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
        return new RedirectPolicy(maximumRedirections, nextPolicy, options);
    };
}

class RedirectPolicy extends BaseRequestPolicy {
    constructor(private readonly _maximumRedirections: number, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
        super(nextPolicy, options);
    }

    async send(request: HttpRequest): Promise<HttpResponse> {
        request = request.clone();

        let redirections = 0;
        let response: HttpResponse;
        while (true) {
            response = await this._nextPolicy.send(request.clone());

            if (response && response.headers && response.headers.get("location") &&
                (response.statusCode === 300 || response.statusCode === 307 || (response.statusCode === 303 && request.httpMethod === HttpMethod.POST)) &&
                (!this._maximumRedirections || redirections < this._maximumRedirections)) {

                ++redirections;

                request.url = parse(response.headers.get("location")!, parse(request.url)).href;

                // POST request with Status code 303 should be converted into a
                // redirected GET request if the redirect url is present in the location header
                if (response.statusCode === 303) {
                    request.httpMethod = HttpMethod.GET;
                }
            } else {
                break;
            }
        }

        return response;
    }
}