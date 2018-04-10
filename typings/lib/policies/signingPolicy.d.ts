import { ServiceClientCredentials } from "../credentials/serviceClientCredentials";
import { RequestPolicyFactory } from "../requestPolicyFactory";
/**
 * Get a RequestPolicyFactory that creates SigningPolicies.
 * @param authenticationProvider The provider to use to sign requests.
 */
export declare function signingPolicy(authenticationProvider: ServiceClientCredentials): RequestPolicyFactory;
