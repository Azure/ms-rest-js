// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import * as utils from "../util/utils";

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
export function exponentialRetryPolicy(retryOptions?: RetryOptions): RequestPolicyFactory {
    return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
        return new ExponentialRetryPolicy(retryOptions || {}, nextPolicy, options);
    };
}

export class ExponentialRetryPolicy extends BaseRequestPolicy {
    private readonly _maximumAttempts: number;
    private readonly _initialRetryDelayInMilliseconds: number;
    private readonly _maximumRetryDelayInMilliseconds: number;
    private readonly _delayFunction: (delayInMilliseconds: number) => Promise<void>;

    constructor(retryOptions: RetryOptions, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
        super(nextPolicy, options);

        this._maximumAttempts = retryOptions.maximumAttempts || 3;
        this._initialRetryDelayInMilliseconds = retryOptions.initialRetryDelayInMilliseconds || 30 * 1000;
        this._maximumRetryDelayInMilliseconds = retryOptions.maximumRetryIntervalInMilliseconds || 90 * 1000;
        this._delayFunction = retryOptions.delayFunction || utils.delay;
    }

    /**
     * Get whether or not we should retry the request based on the provided response.
     * @param response The response to read to determine whether or not we should retry.
     */
    protected shouldRetry(details: { response?: HttpResponse, responseError?: RetryError}): boolean {
        let result = true;

        if (details.response) {
            const statusCode: number = details.response.statusCode;
            if ((statusCode < 500 && statusCode !== 408) || statusCode === 501 || statusCode === 505) {
                result = false;
            }
        }

        return result;
    }

    public async send(request: HttpRequest): Promise<HttpResponse> {
        let response: HttpResponse | undefined = undefined;
        let shouldAttempt = true;
        let attemptNumber = 0;
        let attemptDelayInMilliseconds: number = this._initialRetryDelayInMilliseconds;
        let responseError: RetryError | undefined;
        while (shouldAttempt) {
            try {
                ++attemptNumber;
                response = await this._nextPolicy.send(request.clone());
                shouldAttempt = this.shouldRetry({ response: response });
            } catch (error) {
                if (responseError) {
                    error.innerError = responseError;
                }
                responseError = error;
                shouldAttempt = this.shouldRetry({ responseError: responseError });
            }

            shouldAttempt = shouldAttempt && attemptNumber < this._maximumAttempts;
            if (shouldAttempt) {
                response = undefined;

                if (attemptNumber >= 2) {
                    const boundedRandomDelta: number = (attemptDelayInMilliseconds * 0.8) + Math.floor(Math.random() * attemptDelayInMilliseconds * 0.4);
                    const incrementDelta: number = (Math.pow(2, attemptNumber) - 1) * boundedRandomDelta;
                    attemptDelayInMilliseconds = Math.min(attemptDelayInMilliseconds + incrementDelta, this._maximumRetryDelayInMilliseconds);
                }

                await this._delayFunction(attemptDelayInMilliseconds);
            }
        }
        return response ? Promise.resolve(response) : Promise.reject(responseError);
    }
}