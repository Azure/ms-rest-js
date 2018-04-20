// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as assert from "assert";
import { FetchHttpClient, HttpRequest } from "../../lib/msRest";

describe("msrest", function() {
    describe("browser streaming", function() {
        it("should get a blob response body", async function() {
            const client = new FetchHttpClient();
            const response = await client.send(new HttpRequest({ method: "GET", url: "/test.txt" }));
            const blob = await response.blobBody();

            const reader = new FileReader();
            reader.readAsText(blob);
            const actualContent = await new Promise(function(resolve, reject) {
                reader.addEventListener("load", function() { resolve(this.result); });
                reader.addEventListener("error", function() { reject(this.error) });
            });

            assert.strictEqual(actualContent, "The quick brown fox jumps over the lazy dog\n");
        });
    });
});