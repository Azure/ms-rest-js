// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { FetchHttpClient, HttpRequest, HttpMethod } from "../../lib/msRest";
import { baseURL } from "../testUtils";

describe("msrest", function() {
    describe("nodejs streaming", function() {
        it("should stream a response body", async function() {
            const client = new FetchHttpClient();
            const response = await client.send(new HttpRequest({ method: HttpMethod.GET, url: `${baseURL}/example-index.html` }));
            const stream = response.readableStreamBody as NodeJS.ReadableStream;
            const bufs: Buffer[] = [];
            stream.on("data", function(buf: Buffer) {
                bufs.push(buf);
            });

            await new Promise(function(resolve, reject) {
                stream.on("end", resolve);
                stream.on("error", reject);
            });

            const expectedData = await new Promise<string>(function(resolve, reject) {
                fs.readFile(path.join(__dirname, "../resources/example-index.html"), function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.toString("utf-8"));
                    }
                });
            });

            // Ignore trailing whitespace in comparison
            const actualData = Buffer.concat(bufs).toString("utf-8").replace(/[ ]+\n/g, "\n");
            assert.strictEqual(actualData, expectedData);
        });
    });
});
