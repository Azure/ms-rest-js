// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { HttpMethod, HttpRequest, RestError } from "../../lib/msRest";

describe("RestError", () => {
  describe("constructor", () => {
    it("should not strip authorization header in request when header doesn't exist", () => {
      const request = new HttpRequest({
        method: HttpMethod.GET,
        url: "www.example.com",
        headers: { "a": "A" }
      });

      const restError = new RestError("error message", { request: request });
      assert.strictEqual(restError.request, request);
    });

    it("should strip authorization header in request", () => {
      const request = new HttpRequest({
        method: HttpMethod.GET,
        url: "www.example.com",
        headers: { "authorization": "remove me!", "a": "A" }
      });

      const restError = new RestError("error message", { request: request });
      assert.notStrictEqual(restError.request, request);
      assert.deepEqual(restError.request!.headers.headersArray(), [{ name: "a", value: "A" }]);
    });
  });
});