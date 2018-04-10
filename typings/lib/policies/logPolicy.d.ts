import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates LogPolicies.
 * @param logFunction The function to use to log messages.
 */
export declare function logPolicy(logFunction: (message: string) => void): RequestPolicyFactory;
