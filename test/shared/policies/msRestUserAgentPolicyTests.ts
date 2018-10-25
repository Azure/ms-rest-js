// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { RequestPolicy, RequestPolicyOptions } from "../../../lib/policies/requestPolicy";
import { Constants } from "../../../lib/util/constants";
import { WebResource } from "../../../lib/webResource";
import { HttpOperationResponse } from "../../../lib/httpOperationResponse";
import { MsRestUserAgentBase } from "../../../lib/policies/telemetry/msRestUserAgentPolicyBase";

const userAgentHeaderKey = Constants.HeaderConstants.USER_AGENT;

const emptyRequestPolicy: RequestPolicy = {
  sendRequest(request: WebResource): Promise<HttpOperationResponse> {
    request.should.be.ok();
    throw new Error("Not Implemented");
  }
};

const getPlainMsRestUserAgentPolicy = (overriddenUserAgent?: string): MsRestUserAgentBase => {
    const policy = new (class CommonMsRestUserAgent extends MsRestUserAgentBase {
        constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, overriddenUserAgent?: string) {
            super(nextPolicy, options, overriddenUserAgent);
        }

        protected getUserAgentKey = () => userAgentHeaderKey;
        protected getPlatformSpecificData = () => [];
    })(emptyRequestPolicy, new RequestPolicyOptions(), overriddenUserAgent);

    return policy;
};

describe("MsRestUserAgentPolicy", () => {
  function getVanillaUserAgent(): string {
    const userAgentFilter = getPlainMsRestUserAgentPolicy();
    const resource = new WebResource();
    userAgentFilter.addUserAgentHeader(resource);
    const userAgent = resource.headers.get(userAgentHeaderKey);
    return userAgent!;
  }

  it("should not modify user agent header if already present", function (done) {
    const userAgentPolicy = getPlainMsRestUserAgentPolicy();
    const customUserAgent = "my custom user agent";
    const resource = new WebResource();
    resource.headers.set(userAgentHeaderKey, customUserAgent);
    userAgentPolicy.addUserAgentHeader(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
    done();
  });

  it("should use injected user agent string if provided", function (done) {
    const customUserAgent = "my custom user agent";
    const userAgentPolicy = getPlainMsRestUserAgentPolicy(customUserAgent);
    const resource = new WebResource();
    userAgentPolicy.addUserAgentHeader(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
    done();
  });

  it("should be space and slash delimited", function(done) {
    const userAgent = getVanillaUserAgent();
    userAgent.should.match(/azure-sdk-for-js ms-rest-js\/[\d\.]+/);
    done();
  });

  it("should start with \"azure-sdk-for-js\" and \"azure-sdk-for-js\" should not have a value", function (done) {
    const userAgent = getVanillaUserAgent();
    const userAgentParts = userAgent!.split(" ");
    userAgentParts[0].should.be.equal("azure-sdk-for-js");
    done();
  });

  it("should have runtime telemetry at the second position", function(done) {
    const userAgent = getVanillaUserAgent();
    const userAgentParts = userAgent!.split(" ");
    userAgentParts[1].should.match(/ms-rest-js\/[\d\.]+/);
    done();
  });

  it("should not have platform specific information", function(done) {
    const userAgent = getVanillaUserAgent();
    const userAgentParts = userAgent!.split(" ");
    userAgentParts.length.should.be.equal(2);
    done();
  });
});
