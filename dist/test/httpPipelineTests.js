"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var httpMethod_1 = require("../lib/httpMethod");
var httpPipeline_1 = require("../lib/httpPipeline");
var httpRequest_1 = require("../lib/httpRequest");
var userAgentPolicy_1 = require("../lib/policies/userAgentPolicy");
var requestPolicy_1 = require("../lib/requestPolicy");
var fakeHttpClient_1 = require("./fakeHttpClient");
var inMemoryHttpResponse_1 = require("./inMemoryHttpResponse");
describe("HttpPipeline", function () {
    it("should send requests when no request policies are assigned", function () { return __awaiter(_this, void 0, void 0, function () {
        var httpClient, httpPipeline, httpRequest, response, responseBodyAsText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpClient = new fakeHttpClient_1.FakeHttpClient(function (request) {
                        return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}, "hello"));
                    });
                    httpPipeline = new httpPipeline_1.HttpPipeline([], { httpClient: httpClient });
                    httpRequest = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "http://www.example.com", {});
                    return [4 /*yield*/, httpPipeline.send(httpRequest)];
                case 1:
                    response = _a.sent();
                    assert.deepStrictEqual(response.request, httpRequest);
                    assert.strictEqual(response.statusCode, 200);
                    assert.deepStrictEqual(response.headers.toJson(), {});
                    return [4 /*yield*/, response.textBody()];
                case 2:
                    responseBodyAsText = _a.sent();
                    assert.strictEqual("hello", responseBodyAsText);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should send requests when request-modifying request policies are assigned", function () { return __awaiter(_this, void 0, void 0, function () {
        var httpClient, httpPipeline, httpRequest, response, responseBodyAsText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpClient = new fakeHttpClient_1.FakeHttpClient(function (request) {
                        assert.deepStrictEqual(request.headers.toJson(), { "User-Agent": "my user agent string" });
                        return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}, "hello2"));
                    });
                    httpPipeline = new httpPipeline_1.HttpPipeline([userAgentPolicy_1.userAgentPolicy("my user agent string")], { httpClient: httpClient });
                    httpRequest = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "http://www.example.com", {});
                    return [4 /*yield*/, httpPipeline.send(httpRequest)];
                case 1:
                    response = _a.sent();
                    assert.deepStrictEqual(response.request, httpRequest);
                    assert.deepStrictEqual(response.request.headers.toJson(), { "User-Agent": "my user agent string" });
                    assert.strictEqual(response.statusCode, 200);
                    assert.deepStrictEqual(response.headers.toJson(), {});
                    return [4 /*yield*/, response.textBody()];
                case 2:
                    responseBodyAsText = _a.sent();
                    assert.strictEqual("hello2", responseBodyAsText);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should send requests when response-modifying request policies are assigned", function () { return __awaiter(_this, void 0, void 0, function () {
        var httpClient, ResponseModifyingRequestPolicy, httpPipeline, httpRequest, response, responseBodyAsText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    httpClient = new fakeHttpClient_1.FakeHttpClient(function (request) {
                        assert.deepStrictEqual(request.headers.toJson(), {});
                        return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}, "hello3"));
                    });
                    ResponseModifyingRequestPolicy = /** @class */ (function (_super) {
                        __extends(ResponseModifyingRequestPolicy, _super);
                        function ResponseModifyingRequestPolicy() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        ResponseModifyingRequestPolicy.prototype.send = function (request) {
                            return __awaiter(this, void 0, void 0, function () {
                                var response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._nextPolicy.send(request)];
                                        case 1:
                                            response = _a.sent();
                                            response.headers.set("My-Header", "My-Value");
                                            return [2 /*return*/, response];
                                    }
                                });
                            });
                        };
                        return ResponseModifyingRequestPolicy;
                    }(requestPolicy_1.BaseRequestPolicy));
                    httpPipeline = new httpPipeline_1.HttpPipeline([function (nextPolicy, options) { return new ResponseModifyingRequestPolicy(nextPolicy, options); }], { httpClient: httpClient });
                    httpRequest = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "http://www.example.com", {});
                    return [4 /*yield*/, httpPipeline.send(httpRequest)];
                case 1:
                    response = _a.sent();
                    assert.deepStrictEqual(response.request, httpRequest);
                    assert.deepStrictEqual(response.request.headers.toJson(), {});
                    assert.strictEqual(response.statusCode, 200);
                    assert.deepStrictEqual(response.headers.toJson(), { "My-Header": "My-Value" });
                    return [4 /*yield*/, response.textBody()];
                case 2:
                    responseBodyAsText = _a.sent();
                    assert.strictEqual("hello3", responseBodyAsText);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=httpPipelineTests.js.map