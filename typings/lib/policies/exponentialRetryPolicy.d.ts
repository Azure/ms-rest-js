import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
/**
 * An error that can be thrown when the maximum number of attempts have been attempted.
 */
export interface RetryError extends Error {
    /**
     * The message that describes the retry failure.
     */
    message: string;
    /**
     * The error code that describes the retry failure.
     */
    code?: string;
    /**
     * An inner error that this RetryError wraps.
     */
    innerError?: RetryError;
}
/**
 * The options that can be passed to an ExponentialRetryPolicy.
 */
export interface RetryOptions {
    /**
     * The maximum number of attempts that the retry policy will perform before failing. The first
     * attempt after a failure is considered the 2nd attempt.
     */
    maximumAttempts?: number;
    /**
     * The number of milliseconds to delay before attempting again.
     */
    initialRetryDelayInMilliseconds?: number;
    /**
     * The maximum number of milliseconds to wait before retrying.
     */
    maximumRetryIntervalInMilliseconds?: number;
    /**
     * The function to use to delay before sending a retry attempt.
     */
    delayFunction?: (delayInMilliseconds: number) => Promise<void>;
}
/**
 * Get a RequestPolicyFactory that creates ExponentialRetryPolicies.
 */
export declare function exponentialRetryPolicy(retryOptions?: RetryOptions): RequestPolicyFactory;
export declare class ExponentialRetryPolicy extends BaseRequestPolicy {
    private readonly _maximumAttempts;
    private readonly _initialRetryDelayInMilliseconds;
    private readonly _maximumRetryDelayInMilliseconds;
    private readonly _delayFunction;
    constructor(retryOptions: RetryOptions, nextPolicy: RequestPolicy, options: RequestPolicyOptions);
    /**
     * Get whether or not we should retry the request based on the provided response.
     * @param response The response to read to determine whether or not we should retry.
     */
    protected shouldRetry(details: {
        response?: HttpResponse;
        responseError?: RetryError;
    }): boolean;
    send(request: HttpRequest): Promise<HttpResponse>;
}
