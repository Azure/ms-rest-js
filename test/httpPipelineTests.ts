// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { InMemoryHttpClient } from "./inMemoryHttpClient";
import { InMemoryHttpResponse } from "./inMemoryHttpResponse";
import { HttpPipeline } from "../lib/httpPipeline";
import { HttpRequest } from "../lib/httpRequest";
import { HttpResponse } from "../lib/httpResponse";
import * as assert from "assert";
import { UserAgentRequestPolicyFactory } from "../lib/policies/userAgentRequestPolicyFactory";

describe("HttpPipeline", () => {
    it("should send requests when no request policies are assigned", () => {
        const httpClient = new InMemoryHttpClient((request: HttpRequest) => {
            return Promise.resolve(new InMemoryHttpResponse(request, 200, {}, "hello"));
        });

        const httpPipeline = new HttpPipeline([], { httpClient: httpClient });

        const httpRequest = new HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then((response: HttpResponse) => {
                assert.deepStrictEqual(response.request, httpRequest);
                assert.strictEqual(response.statusCode, 200);
                assert.deepStrictEqual(response.headers, {});
                return response.bodyAsText();
            })
            .then((responseBodyAsText: string | undefined) => {
                assert.strictEqual("hello", responseBodyAsText);
            });
    });

    it("should send requests when request-modifying request policies are assigned", () => {
        const httpClient = new InMemoryHttpClient((request: HttpRequest) => {
            assert.deepStrictEqual(request.headers, { "User-Agent": "my user agent string" });
            return Promise.resolve(new InMemoryHttpResponse(request, 200, {}, "hello2"));
        });

        const httpPipeline = new HttpPipeline(
            [ new UserAgentRequestPolicyFactory("my user agent string") ],
            { httpClient: httpClient });

        const httpRequest = new HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then((response: HttpResponse) => {
                assert.deepStrictEqual(response.request, httpRequest);
                assert.deepStrictEqual(response.request.headers, { "User-Agent": "my user agent string" });
                assert.strictEqual(response.statusCode, 200);
                assert.deepStrictEqual(response.headers, {});
                return response.bodyAsText();
            })
            .then((responseBodyAsText: string | undefined) => {
                assert.strictEqual("hello2", responseBodyAsText);
            });
    });
});