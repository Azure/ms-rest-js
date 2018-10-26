// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { RequestPolicy, RequestPolicyOptions } from "../../../lib/policies/requestPolicy";
import { Constants } from "../../../lib/util/constants";
import { WebResource } from "../../../lib/webResource";
import { HttpOperationResponse } from "../../../lib/httpOperationResponse";
import { userAgentPolicy } from "../../../lib/policies/telemetry/userAgentPolicyFactory";

const userAgentHeaderKey = Constants.HeaderConstants.USER_AGENT;

const emptyRequestPolicy: RequestPolicy = {
  sendRequest(request: WebResource): Promise<HttpOperationResponse> {
    request.should.be.ok;
    return Promise.resolve({ request: request, status: 200, headers: request.headers });
  }
};

const getPlainUserAgentPolicy = (headerValue?: string): RequestPolicy => {
    const factory = userAgentPolicy(undefined, headerValue);
    return factory.create(emptyRequestPolicy, new RequestPolicyOptions());
};

describe("MsRestUserAgentPolicy", () => {
  async function getVanillaUserAgent(): Promise<string> {
    const userAgentFilter = getPlainUserAgentPolicy();
    const resource = new WebResource();
    await userAgentFilter.sendRequest(resource);
    const userAgent = resource.headers.get(userAgentHeaderKey);
    return userAgent!;
  }

  it("should not modify user agent header if already present", async () => {
    const userAgentPolicy = getPlainUserAgentPolicy();
    const customUserAgent = "my custom user agent";
    const resource = new WebResource();
    resource.headers.set(userAgentHeaderKey, customUserAgent);
    await userAgentPolicy.sendRequest(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
  });

  it("should use injected user agent string if provided", async () => {
    const customUserAgent = "my custom user agent";
    const userAgentPolicy = getPlainUserAgentPolicy(customUserAgent);
    const resource = new WebResource();
    await userAgentPolicy.sendRequest(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
  });

  it("should be space and slash delimited", async () => {
    const userAgent = await getVanillaUserAgent();
    userAgent.should.match(/azure-sdk-for-js ms-rest-js\/[\d\.]+/);
  });

  it("should start with \"azure-sdk-for-js\" and \"azure-sdk-for-js\" should not have a value", async () => {
    const userAgent = await getVanillaUserAgent();
    const userAgentParts = userAgent!.split(" ");
    userAgentParts[0].should.be.equal("azure-sdk-for-js");
  });

  it("should have runtime telemetry at the second position", async () => {
    const userAgent = await getVanillaUserAgent();
    const userAgentParts = userAgent!.split(" ");
    userAgentParts[1].should.match(/ms-rest-js\/[\d\.]+/);
  });
});
