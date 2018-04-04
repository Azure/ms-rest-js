// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpRequest } from "../lib/httpRequest";
import * as assert from "assert";

describe("HttpRequest", () => {
    describe("get()", () => {
        it(`should return undefined when the url is ""`, () => {
            assert.strictEqual(HttpRequest.get("", { "Content-Length": "200" }), undefined);
        });
    });
});