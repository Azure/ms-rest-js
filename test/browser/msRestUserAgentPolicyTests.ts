// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpOperationResponse } from "../../lib/httpOperationResponse";
import { RequestPolicy, RequestPolicyOptions } from "../../lib/policies/requestPolicy";
import { WebResource } from "../../lib/webResource";
import { MsRestUserAgentPolicy } from "../../lib/policies/telemetry/msRestUserAgentPolicy.browser";

const userAgentHeaderKey = "x-ms-command-name";

const emptyRequestPolicy: RequestPolicy = {
  sendRequest(request: WebResource): Promise<HttpOperationResponse> {
    request.should.be.ok();
    throw new Error("Not Implemented");
  }
};

describe("MsRestUserAgentPolicy (Browser)", () => {
  function getBrowserUserAgentPolicy(overriddenUserAgent?: string): string {
    const userAgentFilter = new MsRestUserAgentPolicy(emptyRequestPolicy, new RequestPolicyOptions(), overriddenUserAgent);
    const resource = new WebResource();
    userAgentFilter.addUserAgentHeader(resource);
    const userAgent = resource.headers.get(userAgentHeaderKey);
    return userAgent!;
  }

  it("should not modify user agent header if already present", function (done) {
    const nodeUserAgentPolicy = new MsRestUserAgentPolicy(emptyRequestPolicy, new RequestPolicyOptions());
    const customUserAgent = "my custom user agent";
    const resource = new WebResource();
    resource.headers.set(userAgentHeaderKey, customUserAgent);
    nodeUserAgentPolicy.addUserAgentHeader(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
    done();
  });

  it("should use injected user agent string if provided", function (done) {
    const customUserAgent = "my custom user agent";
    const userAgentPolicy = new MsRestUserAgentPolicy(emptyRequestPolicy, new RequestPolicyOptions(), customUserAgent);
    const resource = new WebResource();
    userAgentPolicy.addUserAgentHeader(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
    done();
  });

  it("should be space delimited and contain three fields", function(done) {
    const userAgent = getBrowserUserAgentPolicy();
    const userAgentParts = userAgent.split(" ");
    userAgentParts.length.should.be.equal(3);
    done();
  });

  it("should contain runtime information", function(done) {
    const userAgent = getBrowserUserAgentPolicy();
    userAgent.should.match(/azure-sdk-for-js ms-rest-js\/[\d\.]+ .+/);
    done();
  });

  it("should have operating system information at the third place", function(done) {
    const userAgent = getBrowserUserAgentPolicy();
    const userAgentParts = userAgent.split(" ");
    const osInfo = userAgentParts[2];
    osInfo.should.match(/OS\/[\w\d\.\-]+/);
    done();
  });
});
