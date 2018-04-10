"use strict";
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
var httpMethod_1 = require("../../lib/httpMethod");
var httpRequest_1 = require("../../lib/httpRequest");
var inMemoryHttpResponse_1 = require("../../lib/inMemoryHttpResponse");
var exponentialRetryPolicy_1 = require("../../lib/policies/exponentialRetryPolicy");
var requestPolicyOptions_1 = require("../../lib/requestPolicyOptions");
describe("exponentialRetryPolicy", function () {
    it("should do nothing if no error occurs", function () { return __awaiter(_this, void 0, void 0, function () {
        var policyFactory, nextPolicy, policy, request, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    policyFactory = exponentialRetryPolicy_1.exponentialRetryPolicy({
                        maximumAttempts: 3,
                        initialRetryDelayInMilliseconds: 100,
                        maximumRetryIntervalInMilliseconds: 1000
                    });
                    nextPolicy = {
                        send: function (request) {
                            request.headers.set("A", "B");
                            return Promise.resolve(new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}));
                        }
                    };
                    policy = policyFactory(nextPolicy, new requestPolicyOptions_1.RequestPolicyOptions());
                    request = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "https://spam.com", {});
                    return [4 /*yield*/, policy.send(request)];
                case 1:
                    response = _a.sent();
                    assert.deepStrictEqual(request, new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "https://spam.com", {}), "The original request should not be modified.");
                    assert.deepStrictEqual(response.request, new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "https://spam.com", { "A": "B" }), "The request associated with the response should have the modified header.");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should retry if an undefined HttpResponse is returned", function () { return __awaiter(_this, void 0, void 0, function () {
        var millisecondsDelayed, policyFactory, attempt, nextPolicy, policy, request, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    millisecondsDelayed = 0;
                    policyFactory = exponentialRetryPolicy_1.exponentialRetryPolicy({
                        maximumAttempts: 3,
                        initialRetryDelayInMilliseconds: 30 * 1000,
                        maximumRetryIntervalInMilliseconds: 90 * 1000,
                        delayFunction: function (delayInMilliseconds) {
                            millisecondsDelayed += delayInMilliseconds;
                            return Promise.resolve();
                        }
                    });
                    attempt = 0;
                    nextPolicy = {
                        send: function (request) {
                            ++attempt;
                            request.headers.set("A", attempt);
                            return Promise.resolve(attempt === 1 ? undefined : new inMemoryHttpResponse_1.InMemoryHttpResponse(request, 200, {}));
                        }
                    };
                    policy = policyFactory(nextPolicy, new requestPolicyOptions_1.RequestPolicyOptions());
                    request = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "https://spam.com", {});
                    return [4 /*yield*/, policy.send(request)];
                case 1:
                    response = _a.sent();
                    assert.deepStrictEqual(request, new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "https://spam.com", {}), "The original request should not be modified.");
                    assert.deepStrictEqual(response.request, new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "https://spam.com", { "A": "2" }), "The request associated with the response should have the modified header.");
                    assert.strictEqual(millisecondsDelayed, 30 * 1000);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=exponentialRetryPolicyTests.js.map