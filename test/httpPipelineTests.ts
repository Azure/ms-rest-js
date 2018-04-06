// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { HttpClient } from "../lib/httpClient";
import { HttpPipeline } from "../lib/httpPipeline";
import { HttpRequest } from "../lib/httpRequest";
import { HttpResponse } from "../lib/httpResponse";
import { userAgentRequestPolicyFactory } from "../lib/policies/userAgentRequestPolicyFactory";
import { BaseRequestPolicy } from "../lib/requestPolicy";
import { InMemoryHttpResponse } from "./inMemoryHttpResponse";

describe("HttpPipeline", () => {
    it("should send requests when no request policies are assigned", () => {
        const httpClient: HttpClient = (request: HttpRequest) => {
            return Promise.resolve(new InMemoryHttpResponse(request, 200, {}, "hello"));
        };

        const httpPipeline = new HttpPipeline([], { httpClient: httpClient });

        const httpRequest = new HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then((response: HttpResponse) => {
                assert.deepStrictEqual(response.request, httpRequest);
                assert.strictEqual(response.statusCode, 200);
                assert.deepStrictEqual(response.headers.toJson(), {});
                return response.bodyAsText();
            })
            .then((responseBodyAsText: string | undefined) => {
                assert.strictEqual("hello", responseBodyAsText);
            });
    });

    it("should send requests when request-modifying request policies are assigned", () => {
        const httpClient: HttpClient = (request: HttpRequest) => {
            assert.deepStrictEqual(request.headers.toJson(), { "User-Agent": "my user agent string" });
            return Promise.resolve(new InMemoryHttpResponse(request, 200, {}, "hello2"));
        };

        const httpPipeline = new HttpPipeline(
            [ userAgentRequestPolicyFactory("my user agent string") ],
            { httpClient: httpClient });

        const httpRequest = new HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then((response: HttpResponse) => {
                assert.deepStrictEqual(response.request, httpRequest);
                assert.deepStrictEqual(response.request.headers.toJson(), { "User-Agent": "my user agent string" });
                assert.strictEqual(response.statusCode, 200);
                assert.deepStrictEqual(response.headers.toJson(), {});
                return response.bodyAsText();
            })
            .then((responseBodyAsText: string | undefined) => {
                assert.strictEqual("hello2", responseBodyAsText);
            });
    });

    it("should send requests when response-modifying request policies are assigned", () => {
        const httpClient: HttpClient = (request: HttpRequest) => {
            assert.deepStrictEqual(request.headers.toJson(), {});
            return Promise.resolve(new InMemoryHttpResponse(request, 200, {}, "hello3"));
        };

        class ResponseModifyingRequestPolicy extends BaseRequestPolicy {
            send(request: HttpRequest): Promise<HttpResponse> {
                return this.nextPolicy.send(request).then((response: HttpResponse) => {
                    response.headers.set("My-Header", "My-Value");
                    return response;
                });
            }
        }

        const httpPipeline = new HttpPipeline(
            [ (nextPolicy, options) => new ResponseModifyingRequestPolicy(nextPolicy, options) ],
            { httpClient: httpClient });

        const httpRequest = new HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then((response: HttpResponse) => {
                assert.deepStrictEqual(response.request, httpRequest);
                assert.deepStrictEqual(response.request.headers.toJson(), {});
                assert.strictEqual(response.statusCode, 200);
                assert.deepStrictEqual(response.headers.toJson(), {"My-Header": "My-Value"});
                return response.bodyAsText();
            })
            .then((responseBodyAsText: string | undefined) => {
                assert.strictEqual("hello3", responseBodyAsText);
            });
    });
});