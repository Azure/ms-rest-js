import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates adds the ms-rest user agent to outgoing requests.
 * @param userAgentInfo The string[] of userAgent details to apply to each outgoing request.
 */
export declare function msRestNodeJsUserAgentPolicy(userAgentInfo: string[]): RequestPolicyFactory;
