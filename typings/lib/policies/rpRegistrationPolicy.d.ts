import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates rpRegistrationPolicies.
 * @param retryTimeoutInSeconds The number of seconds to wait before retrying.
 */
export declare function rpRegistrationPolicy(retryTimeoutInSeconds?: number): RequestPolicyFactory;
