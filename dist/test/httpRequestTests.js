"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var httpRequest_1 = require("../lib/httpRequest");
var assert = require("assert");
describe("HttpRequest", function () {
    describe("get()", function () {
        it("should return undefined when the url is \"\"", function () {
            assert.strictEqual(httpRequest_1.HttpRequest.get("", { "Content-Length": "200" }), undefined);
        });
    });
});
//# sourceMappingURL=httpRequestTests.js.map