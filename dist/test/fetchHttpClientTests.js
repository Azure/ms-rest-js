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
var fetchHttpClient_1 = require("../lib/fetchHttpClient");
var httpMethod_1 = require("../lib/httpMethod");
var httpRequest_1 = require("../lib/httpRequest");
describe("fetchHttpClient", function () {
    it("should send HTTP requests", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, httpClient, response, responseBody, expectedResponseBody;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "http://www.example.com", {});
                    httpClient = new fetchHttpClient_1.FetchHttpClient();
                    return [4 /*yield*/, httpClient.send(request)];
                case 1:
                    response = _a.sent();
                    assert.deepStrictEqual(response.request, request);
                    assert.strictEqual(response.statusCode, 200);
                    assert(response.headers);
                    assert.strictEqual(response.headers.get("connection"), "close");
                    assert.strictEqual(response.headers.get("content-encoding"), "gzip");
                    assert.strictEqual(response.headers.get("content-length"), "606");
                    assert.strictEqual(response.headers.get("content-type"), "text/html");
                    assert.strictEqual(response.headers.get("vary"), "Accept-Encoding");
                    return [4 /*yield*/, response.textBody()];
                case 2:
                    responseBody = _a.sent();
                    expectedResponseBody = "<!doctype html>\n<html>\n<head>\n    <title>Example Domain</title>\n\n    <meta charset=\"utf-8\" />\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        \n    }\n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 50px;\n        background-color: #fff;\n        border-radius: 1em;\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    @media (max-width: 700px) {\n        body {\n            background-color: #fff;\n        }\n        div {\n            width: auto;\n            margin: 0 auto;\n            border-radius: 0;\n            padding: 1em;\n        }\n    }\n    </style>    \n</head>\n\n<body>\n<div>\n    <h1>Example Domain</h1>\n    <p>This domain is established to be used for illustrative examples in documents. You may use this\n    domain in examples without prior coordination or asking for permission.</p>\n    <p><a href=\"http://www.iana.org/domains/example\">More information...</a></p>\n</div>\n</body>\n</html>\n";
                    assert.strictEqual(responseBody, expectedResponseBody);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw for awaited 404", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, httpClient, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "http://www.notanexample.coms", {});
                    httpClient = new fetchHttpClient_1.FetchHttpClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, httpClient.send(request)];
                case 2:
                    _a.sent();
                    assert.fail("Expected error to be thrown.");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    assert.strictEqual(error_1.name, "FetchError");
                    assert.strictEqual(error_1.code, "ENOTFOUND");
                    assert.strictEqual(error_1.message, "request to http://www.notanexample.coms failed, reason: getaddrinfo ENOTFOUND www.notanexample.coms www.notanexample.coms:80");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("should reject for promised 404", function () { return __awaiter(_this, void 0, void 0, function () {
        var request, httpClient;
        return __generator(this, function (_a) {
            request = new httpRequest_1.HttpRequest(httpMethod_1.HttpMethod.GET, "http://www.notanexample.coms", {});
            httpClient = new fetchHttpClient_1.FetchHttpClient();
            return [2 /*return*/, httpClient.send(request)
                    .then(function () {
                    assert.fail("Expected error to be thrown.");
                })
                    .catch(function (error) {
                    assert.strictEqual(error.name, "FetchError");
                    assert.strictEqual(error.code, "ENOTFOUND");
                    assert.strictEqual(error.message, "request to http://www.notanexample.coms failed, reason: getaddrinfo ENOTFOUND www.notanexample.coms www.notanexample.coms:80");
                })];
        });
    }); });
});
//# sourceMappingURL=fetchHttpClientTests.js.map