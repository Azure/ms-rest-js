"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var httpRequest_1 = require("../lib/httpRequest");
var assert = require("assert");
describe("HttpRequest", function () {
    describe("constructor", function () {
        it("should throw an Error when the url is \"\"", function () {
            try {
                new httpRequest_1.HttpRequest("GET", "", {});
                assert.fail("Should have thrown an error.");
            }
            catch (error) {
                assert.notEqual(error, null);
                assert.strictEqual(error.message, "\"\" is not a valid URL for a HttpRequest.");
            }
        });
        it("should return a valid GET HttpRequest when the url is \"www.example.com\"", function () {
            var httpRequest = new httpRequest_1.HttpRequest("GET", "www.example.com", {});
            assert.strictEqual(httpRequest.httpMethod, "GET");
            assert.strictEqual(httpRequest.url, "www.example.com");
            assert.deepStrictEqual(httpRequest.headers, {});
            assert.strictEqual(httpRequest.body, undefined);
        });
        it("should return a valid POST HttpRequest when the body is undefined", function () {
            var httpRequest = new httpRequest_1.HttpRequest("POST", "www.example.com", {});
            assert.strictEqual(httpRequest.httpMethod, "POST");
            assert.strictEqual(httpRequest.url, "www.example.com");
            assert.deepStrictEqual(httpRequest.headers, {});
            assert.strictEqual(httpRequest.body, undefined);
        });
        it("should return a valid POST HttpRequest when the body is \"\"", function () {
            var httpRequest = new httpRequest_1.HttpRequest("POST", "www.example.com", {}, "");
            assert.strictEqual(httpRequest.httpMethod, "POST");
            assert.strictEqual(httpRequest.url, "www.example.com");
            assert.deepStrictEqual(httpRequest.headers, {});
            assert.strictEqual(httpRequest.body, "");
        });
        it("should return a valid POST HttpRequest when the body is \"hello\"", function () {
            var httpRequest = new httpRequest_1.HttpRequest("POST", "www.example.com", { "Content-Length": 5 }, "hello");
            assert.strictEqual(httpRequest.httpMethod, "POST");
            assert.strictEqual(httpRequest.url, "www.example.com");
            assert.deepStrictEqual(httpRequest.headers, { "Content-Length": 5 });
            assert.strictEqual(httpRequest.body, "hello");
        });
    });
});
//# sourceMappingURL=httpRequestTests.js.map