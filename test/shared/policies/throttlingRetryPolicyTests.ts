// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import assert from "assert";
import { ThrottlingRetryPolicy } from "../../../lib/policies/throttlingRetryPolicy";
import { WebResource } from "../../../lib/webResource";
import { HttpOperationResponse } from "../../../lib/httpOperationResponse";
import { HttpHeaders, RequestPolicyOptions } from "../../../lib/msRest";

describe.only("ThrottlingRetryPolicy", () => {
    class PassThroughPolicy {
        constructor(private _response: HttpOperationResponse) { }
        public sendRequest(request: WebResource): Promise<HttpOperationResponse> {
            const response = {
                ...this._response,
                request: request
            };

            return Promise.resolve(response);
        }
    }

    const defaultResponse = {
        status: 200,
        request: new WebResource(),
        headers: new HttpHeaders()
    };

    function createDefaultThrottlingRetryPolicy(response?: HttpOperationResponse, actionHandler?: (response: HttpOperationResponse) => Promise<HttpOperationResponse>) {
        if (!response) {
            response = defaultResponse;
        }

        const passThroughPolicy = new PassThroughPolicy(response);
        return new ThrottlingRetryPolicy(passThroughPolicy, new RequestPolicyOptions(), actionHandler);
    }

    describe("sendRequest", () => {
        it("clones the request", async () => {
            const request = new WebResource();
            const nextPolicy = {
                sendRequest: (requestToSend: WebResource): Promise<HttpOperationResponse> => {
                    assert(request !== requestToSend);
                    return Promise.resolve(defaultResponse);
                }
            };
            const policy = new ThrottlingRetryPolicy(nextPolicy, new RequestPolicyOptions());
            await policy.sendRequest(request);
        });

        it("does not modify the request", async () => {
            const request = new WebResource();
            request.url = "http://url";
            request.method = "PATCH";
            request.body = { someProperty: "someValue" };
            request.headers = new HttpHeaders({ "header": "abc" });
            request.query = { q: "param" };

            const policy = createDefaultThrottlingRetryPolicy();
            const response = await policy.sendRequest(request);

            assert.deepEqual(response.request, request);
        });

        it("does nothing when status code is not 429", async () => {
            const request = new WebResource();
            const mockResponse = {
                status: 400,
                headers: new HttpHeaders({
                    "Retry-After": "100"
                }),
                request: request
            };
            const policy = createDefaultThrottlingRetryPolicy(mockResponse, _ => assert.fail());

            const response = await policy.sendRequest(request);

            assert.deepEqual(response, mockResponse);
        });

        it("passes the response to the handler if the status code equals 429", async () => {
            const request = new WebResource();
            const mockResponse = {
                status: 429,
                headers: new HttpHeaders({
                    "Retry-After": "100"
                }),
                request: request
            };
            const policy = createDefaultThrottlingRetryPolicy(mockResponse, response => {
                 assert.deepEqual(response, mockResponse);
                 return Promise.resolve(response);
            });

            const response = await policy.sendRequest(request);
            assert.deepEqual(response, mockResponse);
        });
    });
});
