"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
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
/**
 * Authenticates to a service using an API key.
 */
var ApiKeyCredentials = /** @class */ (function () {
    /**
     * @constructor
     * @param {object} options   Specifies the options to be provided for auth. Either header or query needs to be provided.
     * @param {object} [inHeader]  A key value pair of the header parameters that need to be applied to the request.
     * @param {object} [inQuery]   A key value pair of the query parameters that need to be applied to the request.
     */
    function ApiKeyCredentials(options) {
        if (!options || (options && !options.inHeader && !options.inQuery)) {
            throw new Error("options cannot be null or undefined. Either \"inHeader\" or \"inQuery\" property of the options object needs to be provided.");
        }
        this.inHeader = options.inHeader;
        this.inQuery = options.inQuery;
    }
    /**
     * Signs a request with the values provided in the inHeader and inQuery parameter.
     *
     * @param {WebResource} The WebResource to be signed.
     * @returns {Promise<WebResource>} - The signed request object.
     */
    ApiKeyCredentials.prototype.signRequest = function (webResource) {
        if (!webResource) {
            return Promise.reject(new Error("webResource cannot be null or undefined and must be of type \"object\"."));
        }
        if (this.inHeader) {
            if (!webResource.headers) {
                webResource.headers = {};
            }
            Object.assign(webResource.headers, this.inHeader);
        }
        if (this.inQuery) {
            if (!webResource.url) {
                return Promise.reject(new Error("url cannot be null in the request object."));
            }
            if (webResource.url.indexOf("?") < 0) {
                webResource.url += "?";
            }
            for (var key in this.inQuery) {
                if (!webResource.url.endsWith("?")) {
                    webResource.url += "&";
                }
                webResource.url += key + "=" + this.inQuery[key];
            }
        }
        return Promise.resolve(webResource);
    };
    /**
     * Signs a request with the values provided in the inHeader and inQuery parameter.
     *
     * @param httpRequest The HttpRequest to be signed.
     * @returns The signed request.
     */
    ApiKeyCredentials.prototype.signHttpRequest = function (httpRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var headerName, queryParameterName;
            return __generator(this, function (_a) {
                if (!httpRequest) {
                    throw new Error("httpRequest cannot be null or undefined and must be of type \"object\".");
                }
                if (this.inHeader) {
                    for (headerName in this.inHeader) {
                        httpRequest.headers.set(headerName, this.inHeader[headerName]);
                    }
                }
                if (this.inQuery) {
                    if (!httpRequest.url) {
                        throw new Error("url cannot be null in the request object.");
                    }
                    if (httpRequest.url.indexOf("?") < 0) {
                        httpRequest.url += "?";
                    }
                    for (queryParameterName in this.inQuery) {
                        if (!httpRequest.url.endsWith("?")) {
                            httpRequest.url += "&";
                        }
                        httpRequest.url += queryParameterName + "=" + this.inQuery[queryParameterName];
                    }
                }
                return [2 /*return*/, Promise.resolve(httpRequest)];
            });
        });
    };
    return ApiKeyCredentials;
}());
exports.ApiKeyCredentials = ApiKeyCredentials;
//# sourceMappingURL=apiKeyCredentials.js.map