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
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var httpMethod_1 = require("../httpMethod");
var requestPolicy_1 = require("../requestPolicy");
var utils = require("../util/utils");
/**
 * Get a RequestPolicyFactory that creates rpRegistrationPolicies.
 * @param retryTimeoutInSeconds The number of seconds to wait before retrying.
 */
function rpRegistrationPolicy(retryTimeoutInSeconds) {
    if (retryTimeoutInSeconds === void 0) { retryTimeoutInSeconds = 30; }
    return function (nextPolicy, options) {
        return new RpRegistrationPolicy(retryTimeoutInSeconds, nextPolicy, options);
    };
}
exports.rpRegistrationPolicy = rpRegistrationPolicy;
var RpRegistrationPolicy = /** @class */ (function (_super) {
    __extends(RpRegistrationPolicy, _super);
    function RpRegistrationPolicy(_retryTimeoutInSeconds, nextPolicy, options) {
        var _this = _super.call(this, nextPolicy, options) || this;
        _this._retryTimeoutInSeconds = _retryTimeoutInSeconds;
        return _this;
    }
    RpRegistrationPolicy.prototype.send = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, rpName, textBody, urlPrefix, registrationStatus, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request = request.clone();
                        return [4 /*yield*/, this._nextPolicy.send(request.clone())];
                    case 1:
                        response = _a.sent();
                        if (!(response.statusCode === 409)) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.textBody()];
                    case 2:
                        textBody = _a.sent();
                        rpName = this.checkRPNotRegisteredError(textBody);
                        _a.label = 3;
                    case 3:
                        if (!rpName) return [3 /*break*/, 9];
                        urlPrefix = this.extractSubscriptionUrl(request.url);
                        registrationStatus = false;
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.registerRP(urlPrefix, rpName, request)];
                    case 5:
                        registrationStatus = _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        if (!registrationStatus) return [3 /*break*/, 9];
                        // Retry the original request. We have to change the x-ms-client-request-id
                        // otherwise Azure endpoint will return the initial 409 (cached) response.
                        request.headers.set("x-ms-client-request-id", utils.generateUuid());
                        return [4 /*yield*/, this._nextPolicy.send(request)];
                    case 8:
                        response = _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Validates the error code and message associated with 409 response status code. If it matches to that of
     * RP not registered then it returns the name of the RP else returns undefined.
     * @param textBody - The response body received after making the original request.
     * @returns The name of the RP if condition is satisfied else undefined.
     */
    RpRegistrationPolicy.prototype.checkRPNotRegisteredError = function (textBody) {
        var result;
        if (textBody) {
            var responseBody = {};
            try {
                responseBody = JSON.parse(textBody);
            }
            catch (err) {
                // do nothing;
            }
            if (responseBody && responseBody.error && responseBody.error.message &&
                responseBody.error.code && responseBody.error.code === "MissingSubscriptionRegistration") {
                var matchRes = responseBody.error.message.match(/.*'(.*)'/i);
                if (matchRes) {
                    result = matchRes.pop();
                }
            }
        }
        return result;
    };
    /**
     * Extracts the first part of the URL, just after subscription:
     * https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
     * @param {string} url - The original request url
     * @returns {string} urlPrefix The url prefix as explained above.
     */
    RpRegistrationPolicy.prototype.extractSubscriptionUrl = function (url) {
        var result;
        var matchRes = url.match(/.*\/subscriptions\/[a-f0-9-]+\//ig);
        if (matchRes && matchRes[0]) {
            result = matchRes[0];
        }
        else {
            throw new Error("Unable to extract subscriptionId from the given url - " + url + ".");
        }
        return result;
    };
    /**
     * Registers the given provider.
     * @param {string} urlPrefix - https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/
     * @param {string} provider - The provider name to be registered.
     * @param {object} originalRequest - The original request sent by the user that returned a 409 response
     * with a message that the provider is not registered.
     * @param {registrationCallback} callback - The callback that handles the RP registration
     */
    RpRegistrationPolicy.prototype.registerRP = function (urlPrefix, provider, originalRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var postUrl, getUrl, nextRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postUrl = urlPrefix + "providers/" + provider + "/register?api-version=2016-02-01";
                        getUrl = urlPrefix + "providers/" + provider + "?api-version=2016-02-01";
                        nextRequest = originalRequest.clone();
                        this.setEssentialHeaders(nextRequest);
                        nextRequest.httpMethod = httpMethod_1.HttpMethod.POST;
                        nextRequest.url = postUrl;
                        return [4 /*yield*/, this._nextPolicy.send(nextRequest)];
                    case 1:
                        response = _a.sent();
                        if (response.statusCode !== 200) {
                            throw new Error("Autoregistration of " + provider + " failed. Please try registering manually.");
                        }
                        return [4 /*yield*/, this.getRegistrationStatus(getUrl, originalRequest)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Polls the registration status of the provider that was registered. Polling happens at an interval of 30 seconds.
     * Polling will happen till the registrationState property of the response body is "Registered".
     * @param {string} url - The request url for polling
     * @param {object} originalRequest - The original request sent by the user that returned a 409 response
     * with a message that the provider is not registered.
     * @returns {Promise<boolean>} promise - True if RP Registration is successful.
     */
    RpRegistrationPolicy.prototype.getRegistrationStatus = function (url, originalRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var nextRequest, response, result, deserializedBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextRequest = originalRequest.clone();
                        this.setEssentialHeaders(nextRequest);
                        nextRequest.url = url;
                        nextRequest.httpMethod = httpMethod_1.HttpMethod.GET;
                        return [4 /*yield*/, this._nextPolicy.send(nextRequest)];
                    case 1:
                        response = _a.sent();
                        result = false;
                        return [4 /*yield*/, response.deserializedBody()];
                    case 2:
                        deserializedBody = _a.sent();
                        if (!(deserializedBody && deserializedBody.registrationState === "Registered")) return [3 /*break*/, 3];
                        result = true;
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, utils.delay(this._retryTimeoutInSeconds * 1000)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.getRegistrationStatus(url, originalRequest)];
                    case 5:
                        result = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, Promise.resolve(result)];
                }
            });
        });
    };
    /**
     * Reuses the headers of the original request and url (if specified).
     * @param originalRequest The original request
     * @param reuseUrlToo Should the url from the original request be reused as well. Default false.
     * @returns A new request object with desired headers.
     */
    RpRegistrationPolicy.prototype.setEssentialHeaders = function (request) {
        // We have to change the x-ms-client-request-id otherwise Azure endpoint
        // will return the initial 409 (cached) response.
        request.headers.set("x-ms-client-request-id", utils.generateUuid());
        // Set content-type to application/json
        request.headers.set("Content-Type", "application/json; charset=utf-8");
    };
    return RpRegistrationPolicy;
}(requestPolicy_1.BaseRequestPolicy));
//# sourceMappingURL=rpRegistrationPolicy.js.map