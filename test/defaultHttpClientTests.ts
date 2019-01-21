// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { assert, AssertionError } from "chai";
import "chai/register-should";
import { createReadStream } from "fs";
import { join } from "path";

import { DefaultHttpClient } from "../lib/defaultHttpClient";
import { RestError } from "../lib/restError";
import { isNode } from "../lib/util/utils";
import { WebResource, HttpRequestBody } from "../lib/webResource";
import { getHttpMock } from "./mockHttp";

function getAbortController(): AbortController {
  let controller: AbortController;
  if (typeof AbortController === "function") {
    controller = new AbortController();
  } else {
    const AbortControllerPonyfill = require("abortcontroller-polyfill/dist/cjs-ponyfill").AbortController;
    controller = new AbortControllerPonyfill();
  }
  return controller;
}

const baseURL = "https://example.com";
const httpMock = getHttpMock();

describe.only("defaultHttpClient", function () {
  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach(() => httpMock.setup());
  afterEach(() => httpMock.teardown());

  it("should return a response instead of throwing for awaited 404", async function () {
    const resourceUrl = "/nonexistent/";

    httpMock.get(resourceUrl, async (url?: string, method?: string) => {
      console.log(url);
      console.log(method);
      await sleep(100);
      return { status: 404 };
    });

    const request = new WebResource(resourceUrl, "GET");
    const httpClient = new DefaultHttpClient();

    const response = await httpClient.sendRequest(request);
    response.status.should.equal(404);
  });

  it("should allow canceling requests", async function () {
    const resourceUrl = `/fileupload`;
    httpMock.post(resourceUrl, async () => {
      await sleep(10000);
      assert.fail();
      return { status: 201 };
    });
    const controller = getAbortController();
    const veryBigPayload = "very long string";
    const request = new WebResource(resourceUrl, "POST", veryBigPayload, undefined, undefined, true, undefined, controller.signal);
    const client = new DefaultHttpClient();
    const promise = client.sendRequest(request);
    controller.abort();
    try {
      await promise;
      assert.fail("");
    } catch (err) {
      err.should.not.be.instanceof(AssertionError);
    }
  });

  it("should not overwrite a user-provided cookie (nodejs only)", async function () {
    // Cookie is only allowed to be set by the browser based on an actual response Set-Cookie header
    if (!isNode) {
      this.skip();
    }

    httpMock.get("http://my.fake.domain/set-cookie", {
      status: 200,
      headers: {
        "Set-Cookie": "data=123456"
      }
    });

    httpMock.get("http://my.fake.domain/cookie", async (_url, _method, _body, headers) => {
      return {
        status: 200,
        headers: headers
      };
    });

    const client = new DefaultHttpClient();

    const request1 = new WebResource("http://my.fake.domain/set-cookie");
    const response1 = await client.sendRequest(request1);
    response1.headers.get("Set-Cookie")!.should.equal("data=123456");

    const request2 = new WebResource("http://my.fake.domain/cookie");
    const response2 = await client.sendRequest(request2);
    response2.headers.get("Cookie")!.should.equal("data=123456");

    const request3 = new WebResource("http://my.fake.domain/cookie", "GET", undefined, undefined, { Cookie: "data=abcdefg" });
    const response3 = await client.sendRequest(request3);
    response3.headers.get("Cookie")!.should.equal("data=abcdefg");
  });

  it("should allow canceling multiple requests with one token", async function () {
    httpMock.post("/fileupload", async () => {
      await sleep(1000);
      assert.fail();
      return { status: 201 };
    });

    const controller = getAbortController();
    const buf = "Very large string";
    const requests = [
      new WebResource("/fileupload", "POST", buf, undefined, undefined, true, undefined, controller.signal),
      new WebResource("/fileupload", "POST", buf, undefined, undefined, true, undefined, controller.signal)
    ];
    const client = new DefaultHttpClient();
    const promises = requests.map(r => client.sendRequest(r));
    controller.abort();
    // Ensure each promise is individually rejected
    for (const promise of promises) {
      try {
        await promise;
        assert.fail();
      } catch (err) {
        err.should.not.be.instanceof(AssertionError);
      }
    }
  });

  it.only("should report upload and download progress for simple bodies", async function () {
    httpMock.post("/fileupload", async () => {
      await sleep(1000);
      assert.fail();
      return { status: 201 };
    });

    let uploadNotified = false;
    let downloadNotified = false;

    const body = "Very large string to upload";
    const request = new WebResource("/fileupload", "POST", body, undefined, undefined, false, undefined, undefined, 0,
      ev => {
        uploadNotified = true;
        if (typeof ProgressEvent !== "undefined") {
          ev.should.not.be.instanceof(ProgressEvent);
        }
        ev.loadedBytes.should.be.a("Number");
      },
      ev => {
        downloadNotified = true;
        if (typeof ProgressEvent !== "undefined") {
          ev.should.not.be.instanceof(ProgressEvent);
        }
        ev.loadedBytes.should.be.a("Number");
      });

    const client = new DefaultHttpClient();
    await client.sendRequest(request);
    assert(uploadNotified);
    assert(downloadNotified);
  });

  it("should report upload and download progress for blob or stream bodies", async function () {
    let uploadNotified = false;
    let downloadNotified = false;

    let body: HttpRequestBody;
    if (isNode) {
      body = () => createReadStream(join(__dirname, "..", "resources", "example-index.html"));
    } else {
      body = new Blob([new Uint8Array(1024 * 1024)]);
    }
    const request = new WebResource(`${baseURL}/fileupload`, "POST", body, undefined, undefined, true, undefined, undefined, 0,
      ev => {
        uploadNotified = true;
        if (typeof ProgressEvent !== "undefined") {
          ev.should.not.be.instanceof(ProgressEvent);
        }
        ev.loadedBytes.should.be.a("Number");
      },
      ev => {
        downloadNotified = true;
        if (typeof ProgressEvent !== "undefined") {
          ev.should.not.be.instanceof(ProgressEvent);
        }
        ev.loadedBytes.should.be.a("Number");
      });

    const client = new DefaultHttpClient();
    const response = await client.sendRequest(request);
    const streamBody = response.readableStreamBody;
    if (response.blobBody) {
      await response.blobBody;
    } else if (streamBody) {
      streamBody.on("data", () => { });
      await new Promise((resolve, reject) => {
        streamBody.on("end", resolve);
        streamBody.on("error", reject);
      });
    }
    assert(uploadNotified);
    assert(downloadNotified);
  });

  it("should honor request timeouts", async function () {
    httpMock.timeout("GET", "/slow");

    const request = new WebResource("/slow", "GET", undefined, undefined, undefined, false, false, undefined, 100);
    const client = new DefaultHttpClient();
    try {
      await client.sendRequest(request);
      throw new Error("request did not fail as expected");
    } catch (err) {
      err.message.should.match(/timeout/);
    }
  });

  it("should give a graceful error for nonexistent hosts", async function () {
    const requestUrl = "http://foo.notawebsite/";
    httpMock.passThrough(requestUrl);
    const request = new WebResource(requestUrl);
    const client = new DefaultHttpClient();
    try {
      await client.sendRequest(request);
      throw new Error("request did not fail as expected");
    } catch (err) {
      err.should.be.instanceof(RestError);
      err.code.should.equal("REQUEST_SEND_ERROR");
    }
  });

  it("should interpret undefined as an empty body", async function () {
    const requestUrl = "/expect-empty";
    httpMock.put(requestUrl, async (_url, _method, body, _headers) => {
      if (!body) {
        return {
          status: 200
        };
      } else {
        return {
          status: 400,
          body: `Expected empty body but got "${JSON.stringify(body)}"`
        };
      }
    });

    const request = new WebResource(requestUrl, "PUT");
    const client = new DefaultHttpClient();
    const response = await client.sendRequest(request);
    response.status.should.equal(200, response.bodyAsText!);
  });

  it("should send HTTP requests", async function () {
    httpMock.passThrough();
    const request = new WebResource("https://example.com", "GET");
    request.headers.set("Access-Control-Allow-Headers", "Content-Type");
    request.headers.set("Access-Control-Allow-Methods", "GET");
    request.headers.set("Access-Control-Allow-Origin", "https://example.com");
    const httpClient = new DefaultHttpClient();

    const response = await httpClient.sendRequest(request);
    assert.deepEqual(response.request, request);
    assert.strictEqual(response.status, 200);
    assert(response.headers);
    assert.strictEqual(response.headers.get("content-type")!.split(";")[0], "text/html");
    const responseBody: string | null | undefined = response.bodyAsText;
    const expectedResponseBody =
      `<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;

    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 50px;
        background-color: #fff;
        border-radius: 1em;
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        body {
            background-color: #fff;
        }
        div {
            width: auto;
            margin: 0 auto;
            border-radius: 0;
            padding: 1em;
        }
    }
    </style>
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is established to be used for illustrative examples in documents. You may use this
    domain in examples without prior coordination or asking for permission.</p>
    <p><a href="http://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>
`;
    assert.strictEqual(
      responseBody && responseBody.replace(/\s/g, ""),
      expectedResponseBody.replace(/\s/g, ""));
  });
});
