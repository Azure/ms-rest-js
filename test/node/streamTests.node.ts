// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { FetchHttpClient, HttpRequest, HttpMethod } from "../../lib/msRest";
import { baseURL } from "../testUtils";

async function readAll(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const bufs: Buffer[] = [];
  stream.on("data", function(buf: Buffer) {
    bufs.push(buf);
  });

  await new Promise(function(resolve, reject) {
    stream.on("end", resolve);
    stream.on("error", reject);
  });

  return Buffer.concat(bufs);
}

describe("fetchHttpClient", function() {
  describe("nodejs streaming", function() {
    const expectedBuffer = fs.readFileSync(path.join(__dirname, "../resources/example-index.html"));
    const expectedString = expectedBuffer.toString("utf-8");

    it("should get a ReadableStream response body", async function() {
      const client = new FetchHttpClient();
      const response = await client.send(new HttpRequest({ method: HttpMethod.GET, url: `${baseURL}/example-index.html` }));
      const stream = response.readableStreamBody as NodeJS.ReadableStream;
      const actualBuffer = await readAll(stream);

      // Ignore trailing whitespace in comparison
      const actualString = actualBuffer.toString("utf-8").replace(/[ ]+\n/g, "\n");
      assert.strictEqual(actualString, expectedString);
    });

    it("should post a ReadableStream request body", async function() {
      const client = new FetchHttpClient();
      const stream = fs.createReadStream(path.join(__dirname, "../resources/example-index.html"));

      const response = await client.send(new HttpRequest({ method: HttpMethod.POST, url: `${baseURL}/fileupload`, serializedBody: stream }));
      assert.strictEqual(response.statusCode, 200);

      const responseStream = response.readableStreamBody as NodeJS.ReadableStream;
      const actualContent = (await readAll(responseStream)).toString("utf-8");

      assert.strictEqual(actualContent, expectedString);
    });
  });
});
