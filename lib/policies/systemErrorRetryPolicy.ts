// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpResponse } from "../httpResponse";
import { RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import { RetryOptions, ExponentialRetryPolicy, RetryError } from "./exponentialRetryPolicy";

/**
 * Get a RequestPolicyFactory that creates SystemErrorRetryPolicies.
 * @param authenticationProvider The provider to use to sign requests.
 */
export function systemErrorRetryPolicy(retryOptions?: RetryOptions): RequestPolicyFactory {
  return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
    return new SystemErrorRetryPolicy(retryOptions || {}, nextPolicy, options);
  };
}

class SystemErrorRetryPolicy extends ExponentialRetryPolicy {
  constructor(retryOptions: RetryOptions, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
    super(retryOptions, nextPolicy, options);
  }

  /**
   * Get whether or not we should retry the request based on the provided response.
   * @param response The response to read to determine whether or not we should retry.
   */
  protected shouldRetry(details: { response?: HttpResponse, responseError?: RetryError }): boolean {
    let result = true;

    if (details.responseError && details.responseError.code) {
      switch (details.responseError.code) {
        case "ETIMEDOUT":
        case "ESOCKETTIMEDOUT":
        case "ECONNREFUSED":
        case "ECONNRESET":
        case "ENOENT":
          result = false;
          break;
      }
    }

    return result;
  }
}