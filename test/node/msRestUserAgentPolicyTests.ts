// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpOperationResponse } from "../../lib/httpOperationResponse";
import { RequestPolicy, RequestPolicyOptions } from "../../lib/policies/requestPolicy";
import { Constants } from "../../lib/util/constants";
import { WebResource } from "../../lib/webResource";
import { userAgentPolicy } from "../../lib/policies/telemetry/userAgentPolicyFactory";

const userAgentHeaderKey = Constants.HeaderConstants.USER_AGENT;

const emptyRequestPolicy: RequestPolicy = {
  sendRequest(request: WebResource): Promise<HttpOperationResponse> {
    request.should.be.ok();
    throw new Error("Not Implemented");
  }
};

describe("MsRestUserAgentPolicy (NodeJS)", () => {
  function getUserAgent(headerValue?: string): string {
    const factory = userAgentPolicy(undefined, headerValue);
    const policy = factory.create(emptyRequestPolicy, new RequestPolicyOptions());
    const resource = new WebResource();
    policy.sendRequest(resource);
    const userAgent = resource.headers.get(userAgentHeaderKey);
    return userAgent!;
  }

  it("should not modify user agent header if already present", function (done) {
    const factory = userAgentPolicy();
    const nodeUserAgentPolicy = factory.create(emptyRequestPolicy, new RequestPolicyOptions());
    const customUserAgent = "my custom user agent";
    const resource = new WebResource();
    resource.headers.set(userAgentHeaderKey, customUserAgent);
    nodeUserAgentPolicy.sendRequest(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
    done();
  });

  it("should use injected user agent string if provided", function (done) {
    const customUserAgent = "my custom user agent";
    const factory = userAgentPolicy(undefined, customUserAgent);
    const nodeUserAgentPolicy = factory.create(emptyRequestPolicy, new RequestPolicyOptions());
    const resource = new WebResource();
    nodeUserAgentPolicy.sendRequest(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
    done();
  });

  it("should be space delimited and contain four fields", function(done) {
    const userAgent = getUserAgent();
    const userAgentParts = userAgent.split(" ");
    userAgentParts.length.should.be.equal(4);
    done();
  });

  it("should contain runtime information", function(done) {
    const userAgent = getUserAgent();
    userAgent.should.match(/azure-sdk-for-js ms-rest-js\/[\d\.]+ .+/);
    done();
  });

  it("should have operating system information at the third place", function(done) {
    const userAgent = getUserAgent();
    const userAgentParts = userAgent.split(" ");
    const osInfo = userAgentParts[2];
    osInfo.should.match(/OS\/\([\w\d\.\-]+\)/);
    done();
  });

  it("should have Node information at the fourth place", function(done) {
    const userAgent = getUserAgent();
    const userAgentParts = userAgent.split(" ");
    const osInfo = userAgentParts[3];
    osInfo.should.match(/Node\/v[\d.]+/);
    done();
  });
});
