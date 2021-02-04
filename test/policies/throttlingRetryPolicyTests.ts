// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { assert } from "chai";
import sinon from "sinon";
import { ThrottlingRetryPolicy } from "../../lib/policies/throttlingRetryPolicy";
import { WebResource, WebResourceLike } from "../../lib/webResource";
import { HttpOperationResponse } from "../../lib/httpOperationResponse";
import { HttpHeaders, RequestPolicyOptions } from "../../lib/msRest";

describe("ThrottlingRetryPolicy", () => {
  class PassThroughPolicy {
    constructor(private _response: HttpOperationResponse) {}
    public sendRequest(request: WebResourceLike): Promise<HttpOperationResponse> {
      const response = {
        ...this._response,
        request: request,
      };

      return Promise.resolve(response);
    }
  }

  const defaultResponse = {
    status: 200,
    request: new WebResource(),
    headers: new HttpHeaders(),
  };

  // Inject 429 responses on first numberRetryAfter sendRequest() calls
  class RetryFirstNRequestsPolicy {
    public count = 0;
    constructor(private _response: HttpOperationResponse, private numberRetryAfter: number) {}
    public sendRequest(request: WebResource): Promise<HttpOperationResponse> {
      if (this.count < this.numberRetryAfter) {
        this.count++;

        return Promise.resolve({
          status: 429,
          headers: new HttpHeaders({
            "Retry-After": "1",
          }),
          request,
        });
      }

      return Promise.resolve({
        ...this._response,
        request,
      });
    }
  }

  function createDefaultThrottlingRetryPolicy(response?: HttpOperationResponse) {
    if (!response) {
      response = defaultResponse;
    }

    const passThroughPolicy = new PassThroughPolicy(response);
    return new ThrottlingRetryPolicy(passThroughPolicy, new RequestPolicyOptions(), 3);
  }

  describe("sendRequest", () => {
    it("should clone the request", async () => {
      const request = new WebResource();
      const nextPolicy = {
        sendRequest: (requestToSend: WebResourceLike): Promise<HttpOperationResponse> => {
          assert(request !== requestToSend);
          return Promise.resolve(defaultResponse);
        },
      };
      const policy = new ThrottlingRetryPolicy(nextPolicy, new RequestPolicyOptions(), 3);
      await policy.sendRequest(request);
    });

    it("should not modify the request", async () => {
      const request = new WebResource();
      request.url = "http://url";
      request.method = "PATCH";
      request.body = { someProperty: "someValue" };
      request.headers = new HttpHeaders({ header: "abc" });
      request.query = { q: "param" };

      const policy = createDefaultThrottlingRetryPolicy();
      const response = await policy.sendRequest(request);

      assert.deepEqual(response.request, request);
    });

    it("should do nothing when status code is not 429", async () => {
      const request = new WebResource();
      const mockResponse = {
        status: 400,
        headers: new HttpHeaders({
          "Retry-After": "100",
        }),
        request: request,
      };
      const faultyPolicy = new RetryFirstNRequestsPolicy(mockResponse, 0);
      const policy = new ThrottlingRetryPolicy(faultyPolicy, new RequestPolicyOptions(), 3);
      const spy = sinon.spy(policy as any, "retry");

      const response = await policy.sendRequest(request);
      assert.deepEqual(response, mockResponse);
      assert.strictEqual(spy.callCount, 1);
    });

    it("should retry if the status code equals 429", async () => {
      const request = new WebResource();
      const faultyPolicy = new RetryFirstNRequestsPolicy(defaultResponse, 1);
      const policy = new ThrottlingRetryPolicy(faultyPolicy, new RequestPolicyOptions(), 3);
      const spy = sinon.spy(policy as any, "retry");

      const response = await policy.sendRequest(request);
      assert.deepEqual(response, defaultResponse);
      assert.strictEqual(spy.callCount, 2); // last retry returns directly for 200 response
    });

    it("should give up on 429 after retry limit", async () => {
      const request = new WebResource();
      const faultyPolicy = new RetryFirstNRequestsPolicy(defaultResponse, 4);
      const policy = new ThrottlingRetryPolicy(faultyPolicy, new RequestPolicyOptions(), 3);
      const spy = sinon.spy(policy as any, "retry");

      const response = await policy.sendRequest(request);
      assert.deepEqual(response.status, 429);
      assert.strictEqual(spy.callCount, 4); // last retry returns directly after reaching retry limit
    }).timeout(5000);
  });

  describe("parseRetryAfterHeader", () => {
    it("should return undefined for ill-formed header", function () {
      const retryAfter = ThrottlingRetryPolicy.parseRetryAfterHeader("foobar");
      assert.equal(retryAfter, undefined);
    });

    it("should return sleep interval value in milliseconds if parameter is a number", function (done) {
      const retryAfter = ThrottlingRetryPolicy.parseRetryAfterHeader("1");
      assert.equal(retryAfter, 1000);
      done();
    });

    it("should return sleep interval value in milliseconds for full date format", function (done) {
      const clock = sinon.useFakeTimers(new Date("Fri, 31 Dec 1999 23:00:00 GMT").getTime());
      const retryAfter = ThrottlingRetryPolicy.parseRetryAfterHeader(
        "Fri, 31 Dec 1999 23:02:00 GMT"
      );

      assert.equal(retryAfter, 2 * 60 * 1000);

      clock.restore();
      done();
    });

    it("should return sleep interval value in milliseconds for shorter date format", function (done) {
      const clock = sinon.useFakeTimers(new Date("Fri, 31 Dec 1999 23:00:00 GMT").getTime());
      const retryAfter = ThrottlingRetryPolicy.parseRetryAfterHeader("31 Dec 1999 23:03:00 GMT");

      assert.equal(retryAfter, 3 * 60 * 1000);

      clock.restore();
      done();
    });
  });
});
