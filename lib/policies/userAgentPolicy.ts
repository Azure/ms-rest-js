// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import { Constants } from "../util/constants";

/**
 * Get a RequestPolicyFactory that creates UserAgentPolicies.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
export function userAgentPolicy(userAgent: string): RequestPolicyFactory {
  return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
    return new UserAgentPolicy(userAgent, nextPolicy, options);
  };
}

class UserAgentPolicy extends BaseRequestPolicy {
  constructor(private readonly _userAgent: string, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
    super(nextPolicy, options);
  }

  send(request: HttpRequest): Promise<HttpResponse> {
    if (this.shouldLog(HttpPipelineLogLevel.INFO)) {
      this.log(HttpPipelineLogLevel.INFO, `Set "${Constants.HeaderConstants.USER_AGENT}" header to "${this._userAgent}".`);
    }
    request.headers.set(Constants.HeaderConstants.USER_AGENT, this._userAgent);
    return this._nextPolicy.send(request);
  }
}