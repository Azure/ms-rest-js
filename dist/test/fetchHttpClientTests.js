"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var fetchHttpClient_1 = require("../lib/fetchHttpClient");
var httpRequest_1 = require("../lib/httpRequest");
var assert = require("assert");
describe("fetchHttpClient", function () {
    it("should send HTTP requests", function () {
        var request = new httpRequest_1.HttpRequest("GET", "http://www.example.com", {});
        return fetchHttpClient_1.fetchHttpClient(request)
            .then(function (response) {
            assert.deepStrictEqual(response.request, request);
            assert.strictEqual(response.statusCode, 200);
            assert(response.headers);
            assert.strictEqual(response.headers.get("accept-ranges"), "bytes");
            assert.strictEqual(response.headers.get("connection"), "close");
            assert.strictEqual(response.headers.get("content-encoding"), "gzip");
            assert.strictEqual(response.headers.get("content-length"), "606");
            assert.strictEqual(response.headers.get("content-type"), "text/html");
            assert.strictEqual(response.headers.get("vary"), "Accept-Encoding");
            return response.bodyAsText();
        })
            .then(function (responseBody) {
            assert(responseBody);
            var expectedResponseBody = "<!doctype html>\n<html>\n<head>\n    <title>Example Domain</title>\n\n    <meta charset=\"utf-8\" />\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        \n    }\n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 50px;\n        background-color: #fff;\n        border-radius: 1em;\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    @media (max-width: 700px) {\n        body {\n            background-color: #fff;\n        }\n        div {\n            width: auto;\n            margin: 0 auto;\n            border-radius: 0;\n            padding: 1em;\n        }\n    }\n    </style>    \n</head>\n\n<body>\n<div>\n    <h1>Example Domain</h1>\n    <p>This domain is established to be used for illustrative examples in documents. You may use this\n    domain in examples without prior coordination or asking for permission.</p>\n    <p><a href=\"http://www.iana.org/domains/example\">More information...</a></p>\n</div>\n</body>\n</html>\n";
            assert.strictEqual(responseBody, expectedResponseBody);
        });
    });
});
//# sourceMappingURL=fetchHttpClientTests.js.map