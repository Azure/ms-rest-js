import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates adds the ms-rest user agent to outgoing requests.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
export declare function msRestNodeJsUserAgentPolicy(userAgentInfo: string[]): RequestPolicyFactory;
