// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as assert from "assert";
import { FetchHttpClient, HttpRequest } from "../../lib/msRest";

const expectedContent = "The quick brown fox jumps over the lazy dog\n";

describe("fetchHttpClient", function() {
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

      assert.strictEqual(actualContent, expectedContent);
    });

    it("should get a ReadableStream response body", async function() {
      const client = new FetchHttpClient();
      const response = await client.send(new HttpRequest({ method: "GET", url: "/test.txt" }));

      // Note that this only works with window.fetch--not with the polyfill!
      const stream = response.readableStreamBody as ReadableStream;
      assert(stream);
      const reader = stream.getReader();

      var { done, value } = await reader.read();
      assert(!done);
      assert.strictEqual(new TextDecoder().decode(value), expectedContent);

      var { done } = await reader.read();
      assert(done);
    });

    it("should post a blob request body", async function() {
      const client = new FetchHttpClient();
      const blob = new Blob([expectedContent]);
      const response = await client.send(new HttpRequest({ method: "POST", url: "/fileupload", body: blob }));
      const actualContent = await response.textBody();
      assert.strictEqual(actualContent, expectedContent);
    });
  });
});
