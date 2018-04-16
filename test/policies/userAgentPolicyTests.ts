// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { HttpMethod } from "../../lib/httpMethod";
import { HttpRequest } from "../../lib/httpRequest";
import { HttpResponse } from "../../lib/httpResponse";
import { InMemoryHttpResponse } from "../../lib/inMemoryHttpResponse";
import { userAgentPolicy } from "../../lib/policies/userAgentPolicy";
import { RequestPolicy } from "../../lib/requestPolicy";
import { RequestPolicyFactory } from "../../lib/requestPolicyFactory";
import { RequestPolicyOptions } from "../../lib/requestPolicyOptions";

describe("userAgentPolicy", () => {
  it("assigns the 'User-Agent' header to requests and does nothing to responses", async () => {
    const policyFactory: RequestPolicyFactory = userAgentPolicy("my-user-agent-string");

    const nextPolicy: RequestPolicy = {
      send: (request: HttpRequest) => {
        return Promise.resolve(new InMemoryHttpResponse(request, 200, {}));
      }
    };

    const policy: RequestPolicy = policyFactory(nextPolicy, new RequestPolicyOptions());
    const request = new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com", headers: {} });
    const response: HttpResponse = await policy.send(request);

    assert.deepStrictEqual(request, new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com", headers: { "User-Agent": "my-user-agent-string" } }));
    assert.deepStrictEqual(response.request, new HttpRequest({ method: HttpMethod.GET, url: "https://spam.com", headers: { "User-Agent": "my-user-agent-string" } }));
  });
});