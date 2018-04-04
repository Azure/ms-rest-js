"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var inMemoryHttpClient_1 = require("./inMemoryHttpClient");
var inMemoryHttpResponse_1 = require("./inMemoryHttpResponse");
var httpPipeline_1 = require("../lib/httpPipeline");
var httpRequest_1 = require("../lib/httpRequest");
var assert = require("assert");
describe("HttpPipeline", function () {
    it("should send requests when no request policies are assigned", function () {
        var httpClient = new inMemoryHttpClient_1.InMemoryHttpClient(function (request) {
            return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}, "hello"));
        });
        var httpPipeline = new httpPipeline_1.HttpPipeline([], { httpClient: httpClient });
        var httpRequest = new httpRequest_1.HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then(function (response) {
            assert.deepStrictEqual(response.request, httpRequest);
            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.headers, {});
            return response.bodyAsText();
        })
            .then(function (responseBodyAsText) {
            assert.strictEqual("hello", responseBodyAsText);
        });
    });
    it("should send requests when request-modifying request policies are assigned", function () {
        var httpClient = new inMemoryHttpClient_1.InMemoryHttpClient(function (request) {
            return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}, "hello"));
        });
        var httpPipeline = new httpPipeline_1.HttpPipeline([], { httpClient: httpClient });
        var httpRequest = new httpRequest_1.HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then(function (response) {
            assert.deepStrictEqual(response.request, httpRequest);
            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.headers, {});
            return response.bodyAsText();
        })
            .then(function (responseBodyAsText) {
            assert.strictEqual("hello", responseBodyAsText);
        });
    });
});
//# sourceMappingURL=httpPipelineTests.js.map