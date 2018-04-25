// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import * as utils from "../util/utils";

/**
 * Get a RequestPolicyFactory that creates GenerateClientRequestIdPolicies.
 * @param logFunction The function to use to log messages.
 */
export function generateClientRequestIdPolicy(): RequestPolicyFactory {
  return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
    return new GenerateClientRequestIdPolicy(nextPolicy, options);
  };
}

class GenerateClientRequestIdPolicy extends BaseRequestPolicy {
  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
    super(nextPolicy, options);
  }

  public async send(request: HttpRequest): Promise<HttpResponse> {
    request.headers.set("x-ms-client-request-id", utils.generateUuid());
    return await this._nextPolicy.send(request);
  }
}
