import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates UserAgentPolicies.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
export declare function userAgentPolicy(userAgent: string): RequestPolicyFactory;
