// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { HttpMethod } from "../../lib/httpMethod";
import { HttpRequest } from "../../lib/httpRequest";

describe("HttpRequest", () => {
  describe("constructor", () => {
    it(`should throw an Error when the url is ""`, () => {
      try {
        new HttpRequest({ method: HttpMethod.GET, url: "" });
        assert.fail("Should have thrown an error.");
      } catch (error) {
        assert.notEqual(error, undefined);
        assert.strictEqual(error.message, `"" is not a valid URL for a HttpRequest.`);
      }
    });

    it(`should return a valid GET HttpRequest when the url is "www.example.com"`, () => {
      const httpRequest: HttpRequest = new HttpRequest({ method: HttpMethod.GET, url: "www.example.com" });
      assert.strictEqual(httpRequest.method, HttpMethod.GET);
      assert.strictEqual(httpRequest.url, "www.example.com");
      assert.deepStrictEqual(httpRequest.headers.toJson(), {});
      assert.strictEqual(httpRequest.body, undefined);
      assert.strictEqual(httpRequest.serializedBody, undefined);
    });

    it(`should return a valid POST HttpRequest when the body is undefined`, () => {
      const httpRequest: HttpRequest = new HttpRequest({ method: HttpMethod.POST, url: "www.example.com" });
      assert.strictEqual(httpRequest.method, HttpMethod.POST);
      assert.strictEqual(httpRequest.url, "www.example.com");
      assert.deepStrictEqual(httpRequest.headers.toJson(), {});
      assert.strictEqual(httpRequest.body, undefined);
      assert.strictEqual(httpRequest.serializedBody, undefined);
    });

    it(`should return a valid POST HttpRequest when the body is ""`, () => {
      const httpRequest: HttpRequest = new HttpRequest({ method: HttpMethod.POST, url: "www.example.com", headers: {}, body: "" });
      assert.strictEqual(httpRequest.method, HttpMethod.POST);
      assert.strictEqual(httpRequest.url, "www.example.com");
      assert.deepStrictEqual(httpRequest.headers.toJson(), {});
      assert.strictEqual(httpRequest.body, "");
      assert.strictEqual(httpRequest.serializedBody, undefined);
    });

    it(`should return a valid POST HttpRequest when the body is "hello"`, () => {
      const httpRequest: HttpRequest = new HttpRequest({ method: HttpMethod.POST, url: "www.example.com", headers: { "Content-Length": "5" }, body: "hello" });
      assert.strictEqual(httpRequest.method, HttpMethod.POST);
      assert.strictEqual(httpRequest.url, "www.example.com");
      assert.deepStrictEqual(httpRequest.headers.toJson(), { "Content-Length": "5" });
      assert.strictEqual(httpRequest.body, "hello");
      assert.strictEqual(httpRequest.serializedBody, undefined);
    });
  });

  describe("method", () => {
    it("should allow HttpMethod enum values", () => {
      const httpRequest = new HttpRequest({ method: HttpMethod.DELETE, url: "www.example.com" });
      assert.strictEqual(httpRequest.method, HttpMethod.DELETE);
      assert.strictEqual(httpRequest.method, "DELETE");
      assert(httpRequest.method === HttpMethod.DELETE);
      assert(httpRequest.method === "DELETE");

      const method: HttpMethod = httpRequest.method as HttpMethod;
      assert(method === HttpMethod.DELETE);
      assert(method === "DELETE");
    });

    it("should allow string versions of HttpMethod enum values", () => {
      const httpRequest = new HttpRequest({ method: "DELETE", url: "www.example.com" });
      assert.strictEqual(httpRequest.method, HttpMethod.DELETE);
      assert.strictEqual(httpRequest.method, "DELETE");
      assert(httpRequest.method === HttpMethod.DELETE);
      assert(httpRequest.method === "DELETE");

      const method: HttpMethod = httpRequest.method as HttpMethod;
      assert(method === HttpMethod.DELETE);
      assert(method === "DELETE");
    });
  });
});
