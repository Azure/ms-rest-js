import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RetryOptions } from "./exponentialRetryPolicy";
/**
 * Get a RequestPolicyFactory that creates SystemErrorRetryPolicies.
 * @param authenticationProvider The provider to use to sign requests.
 */
export declare function systemErrorRetryPolicy(retryOptions?: RetryOptions): RequestPolicyFactory;
