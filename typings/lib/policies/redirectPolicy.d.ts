import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates RedirectPolicies.
 * @param maximumRedirections The maximum number of redirections to take before failing.
 */
export declare function redirectPolicy(maximumRedirections: number): RequestPolicyFactory;
