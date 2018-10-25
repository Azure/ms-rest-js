// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpOperationResponse } from "../../lib/httpOperationResponse";
import { MsRestUserAgentPolicy } from "../../lib/policies/msRestUserAgentPolicy";
import { RequestPolicy, RequestPolicyOptions } from "../../lib/policies/requestPolicy";
import { Constants } from "../../lib/util/constants";
import { WebResource } from "../../lib/webResource";

const userAgentHeaderKey = Constants.HeaderConstants.USER_AGENT;

const emptyRequestPolicy: RequestPolicy = {
  sendRequest(request: WebResource): Promise<HttpOperationResponse> {
    request.should.not.be.ok;
    throw new Error("Not Implemented");
  }
};

describe("MsRestUserAgentPolicy (NodeJS)", () => {
  it("should not modify user agent header if already present", function (done) {
    const userAgentFilter = new MsRestUserAgentPolicy(emptyRequestPolicy, new RequestPolicyOptions(), []);
    const customUserAgent = "my custom user agent";
    const resource = new WebResource();
    resource.headers.set(userAgentHeaderKey, customUserAgent);
    userAgentFilter.addUserAgentHeader(resource);

    const userAgentHeader: string = resource.headers.get(userAgentHeaderKey)!;

    userAgentHeader.should.be.equal(customUserAgent);
    done();
  });

  it("should construct user agent header when supplied empty array", function (done) {
    const userAgentFilter = new MsRestUserAgentPolicy(emptyRequestPolicy, new RequestPolicyOptions(), []);
    const resource = new WebResource();

    userAgentFilter.addUserAgentHeader(resource);

    const userAgent = resource.headers.get(userAgentHeaderKey);
    userAgent!.should.containEql("Node");
    userAgent!.should.containEql("azure-sdk-for-js");
    done();
  });

  it("should insert azure-sdk-for-node at right position", function (done) {
    const genericRuntime = "ms-rest";
    const azureRuntime = "ms-rest-azure";
    const azureSDK = "azure-sdk-for-js";
    const userAgentArray = [`${genericRuntime}/v1.0.0`, `${azureRuntime}/v1.0.0`];
    const userAgentFilter = new MsRestUserAgentPolicy(emptyRequestPolicy, new RequestPolicyOptions(), userAgentArray);
    const resource = new WebResource();
    userAgentFilter.addUserAgentHeader(resource);

    const deconstructedUserAgent = resource.headers.get(userAgentHeaderKey)!.split(" ");
    const indexOfAzureRuntime = deconstructedUserAgent.findIndex((e: string) => e.startsWith(azureRuntime));
    indexOfAzureRuntime.should.not.be.equal(-1, `did not find ${azureRuntime} in user agent`);

    const indexOfAzureSDK = deconstructedUserAgent.indexOf(azureSDK);
    indexOfAzureSDK.should.not.be.equal(-1, `did not find ${azureSDK} in user agent`);

    indexOfAzureSDK.should.be.equal(1 + indexOfAzureRuntime, `${azureSDK} is not in the right place in user agent string`);
    done();
  });
});
