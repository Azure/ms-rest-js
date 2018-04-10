// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpMethod } from "../httpMethod";
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import * as utils from "../util/utils";

/**
 * Get a RequestPolicyFactory that creates rpRegistrationPolicies.
 * @param retryTimeoutInSeconds The number of seconds to wait before retrying.
 */
export function rpRegistrationPolicy(retryTimeoutInSeconds = 30): RequestPolicyFactory {
    return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
        return new RpRegistrationPolicy(retryTimeoutInSeconds, nextPolicy, options);
    };
}

class RpRegistrationPolicy extends BaseRequestPolicy {
    constructor(private readonly _retryTimeoutInSeconds: number, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
        super(nextPolicy, options);
    }

    public async send(request: HttpRequest): Promise<HttpResponse> {
        request = request.clone();

        let response: HttpResponse = await this._nextPolicy.send(request.clone());

        let rpName: string | undefined;
        if (response.statusCode === 409) {
            const textBody: string | undefined = await response.textBody();
            rpName = this.checkRPNotRegisteredError(textBody);
        }

        if (rpName) {
            const urlPrefix: string = this.extractSubscriptionUrl(request.url);
            let registrationStatus = false;
            try {
                registrationStatus = await this.registerRP(urlPrefix, rpName, request);
            } catch (err) {
                // Autoregistration of ${provider} failed for some reason. We will not return this error
                // instead will return the initial response with 409 status code back to the user.
                // do nothing here as we are returning the original response at the end of this method.
            }

            if (registrationStatus) {
                // Retry the original request. We have to change the x-ms-client-request-id
                // otherwise Azure endpoint will return the initial 409 (cached) response.
                request.headers.set("x-ms-client-request-id", utils.generateUuid());
                response = await this._nextPolicy.send(request);
            }
        }

        return response;
    }

    /**
     * Validates the error code and message associated with 409 response status code. If it matches to that of
     * RP not registered then it returns the name of the RP else returns undefined.
     * @param textBody - The response body received after making the original request.
     * @returns The name of the RP if condition is satisfied else undefined.
     */
    private checkRPNotRegisteredError(textBody?: string): string | undefined {
        let result: string | undefined;
        if (textBody) {
            let responseBody: { error?: { message?: string, code?: string } } = {};
            try {
                responseBody = JSON.parse(textBody);
            } catch (err) {
                // do nothing;
            }
            if (responseBody && responseBody.error && responseBody.error.message &&
                responseBody.error.code && responseBody.error.code === "MissingSubscriptionRegistration") {

                const matchRes: RegExpMatchArray | null = responseBody.error.message.match(/.*'(.*)'/i);
                if (matchRes) {
                    result = matchRes.pop();
                }
            }
        }
        return result;
    }

    /**
     * Extracts the first part of the URL, just after subscription:
     * https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
     * @param {string} url - The original request url
     * @returns {string} urlPrefix The url prefix as explained above.
     */
    private extractSubscriptionUrl(url: string): string {
        let result: string;
        const matchRes: RegExpMatchArray | null = url.match(/.*\/subscriptions\/[a-f0-9-]+\//ig);
        if (matchRes && matchRes[0]) {
            result = matchRes[0];
        } else {
            throw new Error(`Unable to extract subscriptionId from the given url - ${url}.`);
        }
        return result;
    }

    /**
     * Registers the given provider.
     * @param {string} urlPrefix - https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
     * @param {string} provider - The provider name to be registered.
     * @param {object} originalRequest - The original request sent by the user that returned a 409 response
     * with a message that the provider is not registered.
     * @param {registrationCallback} callback - The callback that handles the RP registration
     */
    private async registerRP(urlPrefix: string, provider: string, originalRequest: HttpRequest): Promise<boolean> {
        const postUrl = `${urlPrefix}providers/${provider}/register?api-version=2016-02-01`;
        const getUrl = `${urlPrefix}providers/${provider}?api-version=2016-02-01`;
        const nextRequest: HttpRequest = originalRequest.clone();
        this.setEssentialHeaders(nextRequest);
        nextRequest.httpMethod = HttpMethod.POST;
        nextRequest.url = postUrl;

        const response: HttpResponse = await this._nextPolicy.send(nextRequest);
        if (response.statusCode !== 200) {
            throw new Error(`Autoregistration of ${provider} failed. Please try registering manually.`);
        }

        return await this.getRegistrationStatus(getUrl, originalRequest);
    }

    /**
     * Polls the registration status of the provider that was registered. Polling happens at an interval of 30 seconds.
     * Polling will happen till the registrationState property of the response body is "Registered".
     * @param {string} url - The request url for polling
     * @param {object} originalRequest - The original request sent by the user that returned a 409 response
     * with a message that the provider is not registered.
     * @returns {Promise<boolean>} promise - True if RP Registration is successful.
     */
    private async getRegistrationStatus(url: string, originalRequest: HttpRequest): Promise<boolean> {
        const nextRequest: HttpRequest = originalRequest.clone();
        this.setEssentialHeaders(nextRequest);
        nextRequest.url = url;
        nextRequest.httpMethod = HttpMethod.GET;
        const response: HttpResponse = await this._nextPolicy.send(nextRequest);

        let result = false;
        const deserializedBody: { registrationState: string } = await response.deserializedBody();
        if (deserializedBody && deserializedBody.registrationState === "Registered") {
            result = true;
        } else {
            await utils.delay(this._retryTimeoutInSeconds * 1000);
            result = await this.getRegistrationStatus(url, originalRequest);
        }
        return Promise.resolve(result);
    }

    /**
     * Reuses the headers of the original request and url (if specified).
     * @param originalRequest The original request
     * @param reuseUrlToo Should the url from the original request be reused as well. Default false.
     * @returns A new request object with desired headers.
     */
    private setEssentialHeaders(request: HttpRequest): void {
        // We have to change the x-ms-client-request-id otherwise Azure endpoint
        // will return the initial 409 (cached) response.
        request.headers.set("x-ms-client-request-id", utils.generateUuid());

        // Set content-type to application/json
        request.headers.set("Content-Type", "application/json; charset=utf-8");
    }
}