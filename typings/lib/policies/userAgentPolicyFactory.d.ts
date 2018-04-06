import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates UserAgentRequestPolicies.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
export declare function userAgentPolicyFactory(userAgent: string): RequestPolicyFactory;
