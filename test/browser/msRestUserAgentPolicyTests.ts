// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

const userAgentHeaderKey = "x-ms-command-name";

const emptyRequestPolicy: RequestPolicy = {
  sendRequest(request: WebResource): Promise<HttpOperationResponse> {
    request.should.be.ok();
    throw new Error("Not Implemented");
  }
};

describe("MsRestUserAgentPolicy (Browser)", () => {
  it("fails", function(done) {
    done();
  });
});
