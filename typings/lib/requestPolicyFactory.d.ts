import { RequestPolicy } from "./requestPolicy";
import { RequestPolicyOptions } from "./requestPolicyOptions";
/**
 * Factory to create a RequestPolicy. RequestPolicies are instantiated per-request
 * so that they can contain instance state specific to that request/response exchange,
 * for example, the number of retries attempted so far in a counter.
 * @param nextPolicy The RequestPolicy that the created RequestPolicy will hand HttpRequests to and receive HttpResponses from.
 * @param options The set of RequestPolicyOptions that will apply to the created RequestPolicy.
 */
export declare type RequestPolicyFactory = (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => RequestPolicy;
