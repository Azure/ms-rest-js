// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { HttpMethod } from "../../../lib/httpMethod";
import { HttpRequest } from "../../../lib/httpRequest";
import { HttpResponse } from "../../../lib/httpResponse";
import { InMemoryHttpResponse } from "../../../lib/inMemoryHttpResponse";
import { RequestPolicy } from "../../../lib/requestPolicy";
import { RequestPolicyFactory } from "../../../lib/requestPolicyFactory";
import { RequestPolicyOptions } from "../../../lib/requestPolicyOptions";
import { SystemErrorRetryPolicy, systemErrorRetryPolicy } from "../../../lib/policies/systemErrorRetryPolicy";
import { RestError } from "../../../lib/msRest";

describe("SystemErrorRetryPolicy", () => {
  describe("shouldRetry()", () => {
    const nextPolicy: RequestPolicy = {
      send: (request: HttpRequest) => {
        return Promise.resolve(new InMemoryHttpResponse(request, 200, {}));
      }
    };
    const policy = new SystemErrorRetryPolicy({}, nextPolicy, new RequestPolicyOptions());
    const request = new HttpRequest({ method: "GET", url: "https://www.example.com" });

    it("should return when no response or error is given", () => {
      assert.strictEqual(policy.shouldRetry({}), false);
    });

    it("should not retry when response status code is 200", () => {
      assert.strictEqual(policy.shouldRetry({ response: new InMemoryHttpResponse(request, 200, {})}), false);
    });

    it("should not retry when response status code is 500", () => {
      assert.strictEqual(policy.shouldRetry({ response: new InMemoryHttpResponse(request, 500, {})}), false);
    });

    it("should not retry when response status code is 500", () => {
      assert.strictEqual(policy.shouldRetry({ response: new InMemoryHttpResponse(request, 500, {})}), false);
    });

    it("should retry when response error code is ETIMEDOUT", () => {
      assert.strictEqual(policy.shouldRetry({ responseError: new RestError("error message", { code: "ETIMEDOUT" })}), true);
    });

    it("should retry when response error code is ESOCKETTIMEDOUT", () => {
      assert.strictEqual(policy.shouldRetry({ responseError: new RestError("error message", { code: "ESOCKETTIMEDOUT" })}), true);
    });

    it("should retry when response error code is ECONNREFUSED", () => {
      assert.strictEqual(policy.shouldRetry({ responseError: new RestError("error message", { code: "ECONNREFUSED" })}), true);
    });

    it("should retry when response error code is ECONNRESET", () => {
      assert.strictEqual(policy.shouldRetry({ responseError: new RestError("error message", { code: "ECONNRESET" })}), true);
    });

    it("should retry when response error code is ENOENT", () => {
      assert.strictEqual(policy.shouldRetry({ responseError: new RestError("error message", { code: "ENOENT" })}), true);
    });

    it("should not retry when response error code is ESPAM", () => {
      assert.strictEqual(policy.shouldRetry({ responseError: new RestError("error message", { code: "ESPAM" })}), false);
    });
  });

  it("should do nothing if no error occurs", async () => {
    const policyFactory: RequestPolicyFactory = systemErrorRetryPolicy({
      maximumAttempts: 3,
      initialRetryDelayInMilliseconds: 100,
      maximumRetryIntervalInMilliseconds: 1000
    });

    const nextPolicy: RequestPolicy = {
      send: (request: HttpRequest) => {
        request.headers.set("A", "B");
        return Promise.resolve(new InMemoryHttpResponse(request, 200, {}));
      }
    };

    const policy: RequestPolicy = policyFactory(nextPolicy, new RequestPolicyOptions());
    const request = new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com" });
    const response: HttpResponse = await policy.send(request);

    assert.deepStrictEqual(request, new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com" }), "The original request should not be modified.");
    assert.deepStrictEqual(response.request, new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com", headers: { "A": "B" } }), "The request associated with the response should have the modified header.");
  });

  it("should retry if an ETIMEDOUT error code is returned", async () => {
    let millisecondsDelayed = 0;

    const policyFactory: RequestPolicyFactory = systemErrorRetryPolicy({
      maximumAttempts: 3,
      initialRetryDelayInMilliseconds: 30 * 1000,
      maximumRetryIntervalInMilliseconds: 90 * 1000,
      delayFunction: (delayInMilliseconds: number) => {
        millisecondsDelayed += delayInMilliseconds;
        return Promise.resolve();
      }
    });

    let attempt = 0;

    const nextPolicy: RequestPolicy = {
      send: (request: HttpRequest) => {
        ++attempt;
        request.headers.set("A", attempt);
        return attempt === 1 ? Promise.reject(new RestError("error message", { code: "ETIMEDOUT" })) : Promise.resolve(new InMemoryHttpResponse(request, 200, {}));
      }
    };

    const policy: RequestPolicy = policyFactory(nextPolicy, new RequestPolicyOptions());
    const request = new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com" });
    const response: HttpResponse = await policy.send(request);

    assert.deepStrictEqual(request, new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com" }), "The original request should not be modified.");
    assert.deepStrictEqual(response.request, new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com", headers: { "A": "2" } }), "The request associated with the response should have the modified header.");
    assert.strictEqual(millisecondsDelayed, 30 * 1000);
  });
});
