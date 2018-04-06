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
var httpHeaders_1 = require("./httpHeaders");
/**
 * Provides the fetch() method based on the environment.
 * @returns {fetch} fetch - The fetch() method available in the environment to make requests
 */
function getFetch() {
    return require("fetch-ponyfill")({ useCookie: true }).fetch;
}
/**
 * The cached fetch method that will be used to send HTTP requests.
 */
var fetch;
/**
 * A HttpClient implementation that uses fetch to send HTTP requests.
 * @param request The request to send.
 */
function fetchHttpClient(request) {
    return __awaiter(this, void 0, void 0, function () {
        var result, fetchRequestOptions, fetchResponse_1, responseHeaders_1, fetchResponseHeaders, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fetch) {
                        fetch = getFetch();
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    fetchRequestOptions = {
                        method: request.httpMethod,
                        headers: request.headers.toJson(),
                        body: request.body
                    };
                    return [4 /*yield*/, fetch(request.url, fetchRequestOptions)];
                case 2:
                    fetchResponse_1 = _a.sent();
                    responseHeaders_1 = new httpHeaders_1.HttpHeaders();
                    fetchResponseHeaders = fetchResponse_1.headers;
                    fetchResponseHeaders.forEach(function (headerValue, headerName) { responseHeaders_1.set(headerName, headerValue); });
                    response = {
                        request: request,
                        statusCode: fetchResponse_1.status,
                        headers: responseHeaders_1,
                        bodyAsText: function () { return fetchResponse_1.text(); },
                        bodyAsJson: function () { return fetchResponse_1.json(); }
                    };
                    result = Promise.resolve(response);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    result = Promise.reject(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
exports.fetchHttpClient = fetchHttpClient;
//# sourceMappingURL=fetchHttpClient.js.map