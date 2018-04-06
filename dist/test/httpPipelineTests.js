"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var requestPolicy_1 = require("../lib/requestPolicy");
var httpPipeline_1 = require("../lib/httpPipeline");
var httpRequest_1 = require("../lib/httpRequest");
var inMemoryHttpResponse_1 = require("./inMemoryHttpResponse");
var userAgentRequestPolicyFactory_1 = require("../lib/policies/userAgentRequestPolicyFactory");
var assert = require("assert");
describe("HttpPipeline", function () {
    it("should send requests when no request policies are assigned", function () {
        var httpClient = function (request) {
            return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}, "hello"));
        };
        var httpPipeline = new httpPipeline_1.HttpPipeline([], { httpClient: httpClient });
        var httpRequest = new httpRequest_1.HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then(function (response) {
            assert.deepStrictEqual(response.request, httpRequest);
            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.headers.toJson(), {});
            return response.bodyAsText();
        })
            .then(function (responseBodyAsText) {
            assert.strictEqual("hello", responseBodyAsText);
        });
    });
    it("should send requests when request-modifying request policies are assigned", function () {
        var httpClient = function (request) {
            assert.deepStrictEqual(request.headers.toJson(), { "User-Agent": "my user agent string" });
            return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}, "hello2"));
        };
        var httpPipeline = new httpPipeline_1.HttpPipeline([userAgentRequestPolicyFactory_1.userAgentRequestPolicyFactory("my user agent string")], { httpClient: httpClient });
        var httpRequest = new httpRequest_1.HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then(function (response) {
            assert.deepStrictEqual(response.request, httpRequest);
            assert.deepStrictEqual(response.request.headers.toJson(), { "User-Agent": "my user agent string" });
            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.headers.toJson(), {});
            return response.bodyAsText();
        })
            .then(function (responseBodyAsText) {
            assert.strictEqual("hello2", responseBodyAsText);
        });
    });
    it("should send requests when response-modifying request policies are assigned", function () {
        var httpClient = function (request) {
            assert.deepStrictEqual(request.headers.toJson(), {});
            return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}, "hello3"));
        };
        var ResponseModifyingRequestPolicy = /** @class */ (function (_super) {
            __extends(ResponseModifyingRequestPolicy, _super);
            function ResponseModifyingRequestPolicy() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ResponseModifyingRequestPolicy.prototype.send = function (request) {
                return this.nextPolicy.send(request).then(function (response) {
                    response.headers.set("My-Header", "My-Value");
                    return response;
                });
            };
            return ResponseModifyingRequestPolicy;
        }(requestPolicy_1.BaseRequestPolicy));
        var httpPipeline = new httpPipeline_1.HttpPipeline([function (nextPolicy, options) { return new ResponseModifyingRequestPolicy(nextPolicy, options); }], { httpClient: httpClient });
        var httpRequest = new httpRequest_1.HttpRequest("GET", "http://www.example.com", {});
        return httpPipeline.send(httpRequest)
            .then(function (response) {
            assert.deepStrictEqual(response.request, httpRequest);
            assert.deepStrictEqual(response.request.headers.toJson(), {});
            assert.strictEqual(response.statusCode, 200);
            assert.deepStrictEqual(response.headers.toJson(), { "My-Header": "My-Value" });
            return response.bodyAsText();
        })
            .then(function (responseBodyAsText) {
            assert.strictEqual("hello3", responseBodyAsText);
        });
    });
});
//# sourceMappingURL=httpPipelineTests.js.map