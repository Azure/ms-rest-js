import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates UserAgentPolicies.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
export declare function logPolicy(logFunction: (message: string) => void): RequestPolicyFactory;
