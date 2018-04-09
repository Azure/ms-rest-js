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
}

/**
 * Get a RequestPolicyFactory that creates ExponentialRetryPolicies.
 */
export function exponentialRetryPolicy(retryOptions?: RetryOptions): RequestPolicyFactory {
    return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
        return new ExponentialRetryPolicy(retryOptions || {}, nextPolicy, options, utils.delay);
    };
}

class ExponentialRetryPolicy extends BaseRequestPolicy {
    private readonly maximumAttempts: number;
    private readonly initialRetryDelayInMilliseconds: number;
    private readonly maximumRetryDelayInMilliseconds: number;

    constructor(retryOptions: RetryOptions, nextPolicy: RequestPolicy, options: RequestPolicyOptions, private readonly delayFunction: (delay: number) => Promise<never>) {
        super(nextPolicy, options);

        this.maximumAttempts = retryOptions.maximumAttempts || 3;
        this.initialRetryDelayInMilliseconds = retryOptions.initialRetryDelayInMilliseconds || 30 * 1000;
        this.maximumRetryDelayInMilliseconds = retryOptions.maximumRetryIntervalInMilliseconds || 90 * 1000;
    }

    public async send(request: HttpRequest): Promise<HttpResponse> {
        let response: HttpResponse | undefined;
        let shouldAttempt: boolean = true;
        let attemptNumber: number = 0;
        let attemptDelayInMilliseconds: number = this.initialRetryDelayInMilliseconds;
        let responseError: RetryError | undefined;
        while (shouldAttempt) {
            try {
                ++attemptNumber;
                response = await this.nextPolicy.send(request.clone());

                if (response) {
                    const statusCode: number = response.statusCode;
                    if ((statusCode < 500 && statusCode !== 408) || statusCode === 501 || statusCode === 505) {
                        shouldAttempt = false;
                        responseError = undefined;
                    }
                }
            } catch (error) {
                if (responseError) {
                    error.innerError = responseError;
                }
                responseError = error;
            }

            shouldAttempt = shouldAttempt && attemptNumber < this.maximumAttempts;
            if (shouldAttempt) {
                response = undefined;

                if (attemptNumber >= 2) {
                    const boundedRandomDelta: number = (attemptDelayInMilliseconds * 0.8) + Math.floor(Math.random() * attemptDelayInMilliseconds * 0.4);
                    const incrementDelta: number = (Math.pow(2, attemptNumber) - 1) * boundedRandomDelta;
                    attemptDelayInMilliseconds = Math.min(attemptDelayInMilliseconds + incrementDelta, this.maximumRetryDelayInMilliseconds);
                }

                await this.delayFunction(attemptDelayInMilliseconds);
            }
        }
        return response ? Promise.resolve(response) : Promise.reject(responseError);
    }
}