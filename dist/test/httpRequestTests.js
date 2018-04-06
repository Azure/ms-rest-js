"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var httpMethod_1 = require("../lib/httpMethod");
var httpRequest_1 = require("../lib/httpRequest");
describe("HttpRequest", function () {
    describe("constructor", function () {
        it("should throw an Error when the url is \"\"", function () {
            try {
                new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "", {});
                assert.fail("Should have thrown an error.");
            }
            catch (error) {
                assert.notEqual(error, null);
                assert.strictEqual(error.message, "\"\" is not a valid URL for a HttpRequest.");
            }
        });
        it("should return a valid GET HttpRequest when the url is \"www.example.com\"", function () {
            var httpRequest = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "www.example.com", {});
            assert.strictEqual(httpRequest.httpMethod, httpMethod_1.HttpMethod.GET);
            assert.strictEqual(httpRequest.url, "www.example.com");
            assert.deepStrictEqual(httpRequest.headers.toJson(), {});
            assert.strictEqual(httpRequest.body, undefined);
        });
        it("should return a valid POST HttpRequest when the body is undefined", function () {
            var httpRequest = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.POST, "www.example.com", {});
            assert.strictEqual(httpRequest.httpMethod, httpMethod_1.HttpMethod.POST);
            assert.strictEqual(httpRequest.url, "www.example.com");
            assert.deepStrictEqual(httpRequest.headers.toJson(), {});
            assert.strictEqual(httpRequest.body, undefined);
        });
        it("should return a valid POST HttpRequest when the body is \"\"", function () {
            var httpRequest = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.POST, "www.example.com", {}, "");
            assert.strictEqual(httpRequest.httpMethod, httpMethod_1.HttpMethod.POST);
            assert.strictEqual(httpRequest.url, "www.example.com");
            assert.deepStrictEqual(httpRequest.headers.toJson(), {});
            assert.strictEqual(httpRequest.body, "");
        });
        it("should return a valid POST HttpRequest when the body is \"hello\"", function () {
            var httpRequest = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.POST, "www.example.com", { "Content-Length": "5" }, "hello");
            assert.strictEqual(httpRequest.httpMethod, httpMethod_1.HttpMethod.POST);
            assert.strictEqual(httpRequest.url, "www.example.com");
            assert.deepStrictEqual(httpRequest.headers.toJson(), { "Content-Length": "5" });
            assert.strictEqual(httpRequest.body, "hello");
        });
    });
});
//# sourceMappingURL=httpRequestTests.js.map