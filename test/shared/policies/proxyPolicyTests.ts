// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import "chai/register-should";
import { proxyPolicy, ProxyPolicy } from "../../../lib/policies/proxyPolicy";
import { ProxySettings } from "../../../lib/serviceClient";
import { RequestPolicyOptions } from "../../../lib/policies/requestPolicy";
import { HttpHeaders, WebResource } from "../../../lib/msRest";


describe("ProxyPolicy", function() {
    const proxySettings: ProxySettings = {
        host: "https://example.com",
        port: 3030,
        username: "admin",
        password: "_password"
    };

    const emptyRequestPolicy = {
        sendRequest: (_: WebResource) => Promise.resolve({
            request: new WebResource(),
            status: 404,
            headers: new HttpHeaders(undefined)
        })
    };

    const emptyPolicyOptions = new RequestPolicyOptions();

    it("factory passes correct proxy settings", function (done) {
        const factory = proxyPolicy(proxySettings);
        const policy = factory.create(emptyRequestPolicy, emptyPolicyOptions) as ProxyPolicy;

        policy.proxySettings.should.be.deep.equal(proxySettings);
        done();
    });

    it("sets correct proxy settings through constructor", function (done) {
        const policy = new ProxyPolicy(emptyRequestPolicy, emptyPolicyOptions, proxySettings);
        policy.proxySettings.should.be.deep.equal(proxySettings);
        done();
    });

    it("should assign proxy settings to the web request", async () => {
        const policy = new ProxyPolicy(emptyRequestPolicy, emptyPolicyOptions, proxySettings);
        const request = new WebResource();

        await policy.sendRequest(request);

        request.proxySettings!.should.be.deep.equal(proxySettings);
    });
});
