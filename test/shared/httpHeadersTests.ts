// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { HttpHeaders } from "../../lib/httpHeaders";

describe("HttpHeaders", () => {
  it("constructor()", () => {
    const httpHeaders = new HttpHeaders();
    assert.deepStrictEqual(httpHeaders.headersArray(), []);
  });

  describe("constructor(RawHttpHeaders)", () => {
    it("with empty raw HTTP headers", () => {
      const httpHeaders = new HttpHeaders({});
      assert.deepStrictEqual(httpHeaders.headersArray(), []);
    });

    it("with non-empty raw HTTP headers", () => {
      const httpHeaders = new HttpHeaders({ "a": "A" });
      assert.deepEqual(httpHeaders.headersArray(), [{ name: "a", value: "A"}]);
    });
  });

  describe("contains(string)", () => {
    it("should return false with non-existing header name", () => {
      const httpHeaders = new HttpHeaders({"a": "A"});
      assert.strictEqual(httpHeaders.contains("b"), false);
    });

    it("should return true with existing header name", () => {
      const httpHeaders = new HttpHeaders({"a": "A"});
      assert.strictEqual(httpHeaders.contains("a"), true);
    });

    it("should return true with existing header name in different case", () => {
      const httpHeaders = new HttpHeaders({"a": "A"});
      assert.strictEqual(httpHeaders.contains("A"), true);
    });
  });

  describe("remove(string)", () => {
    it("should return false with non-existing header name", () => {
      const httpHeaders = new HttpHeaders({"a": "A"});
      assert.strictEqual(httpHeaders.remove("b"), false);
    });

    it("should return true with existing header name", () => {
      const httpHeaders = new HttpHeaders({"a": "A"});
      assert.strictEqual(httpHeaders.remove("a"), true);
      assert.strictEqual(httpHeaders.contains("a"), false);
    });

    it("should return true with existing header name in different case", () => {
      const httpHeaders = new HttpHeaders({"a": "A"});
      assert.strictEqual(httpHeaders.remove("A"), true);
      assert.strictEqual(httpHeaders.contains("a"), false);
    });
  });
});