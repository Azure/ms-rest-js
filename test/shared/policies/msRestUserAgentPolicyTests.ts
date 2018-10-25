// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { RequestPolicy, RequestPolicyOptions } from "../../../lib/policies/requestPolicy";
import { Constants } from "../../../lib/util/constants";
import { WebResource } from "../../../lib/webResource";
import { HttpOperationResponse } from "../../../lib/httpOperationResponse";
import { MsRestUserAgentBase } from "../../../lib/policies/msRestUserAgentBase";

const userAgentHeaderKey = Constants.HeaderConstants.USER_AGENT;

const emptyRequestPolicy: RequestPolicy = {
  sendRequest(request: WebResource): Promise<HttpOperationResponse> {
    request.should.not.be.ok;
    throw new Error("Not Implemented");
  }
};

const getPlainMsRestUserAgentPolicy = (userAgentInfo: string[] = []): MsRestUserAgentBase => {
    const policy = new (class CommonMsRestUserAgent extends MsRestUserAgentBase {
        constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, userAgentInfo: string[]) {
            super(nextPolicy, options, userAgentInfo);
        }

        protected getUserAgentKey = () => userAgentHeaderKey;
        protected addPlatformSpecificData = (_: string[]) => _;
    })(emptyRequestPolicy, new RequestPolicyOptions(), userAgentInfo);

    return policy;
};

describe("MsRestUserAgentPolicy", () => {
  it("should not modify user agent header if already present", function (done) {
    const userAgentFilter = getPlainMsRestUserAgentPolicy();
    const customUserAgent = "my custom user agent";
    const resource = new WebResource();
    resource.headers.set(userAgentHeaderKey, customUserAgent);
    userAgentFilter.addUserAgentHeader(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
    done();
  });

  it("should start with \"azure-sdk-for-js\"", function (done) {
    const userAgentFilter = getPlainMsRestUserAgentPolicy();
    const resource = new WebResource();

    userAgentFilter.addUserAgentHeader(resource);

    const userAgent = resource.headers.get(userAgentHeaderKey);
    userAgent!.startsWith("azure-sdk-for-js").should.be.true;
    done();
  });

});
