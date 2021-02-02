// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import "chai/register-should";
import { AgentSettings } from "../../lib/serviceClient";
import { RequestPolicyOptions } from "../../lib/policies/requestPolicy";
import { WebResource, WebResourceLike } from "../../lib/webResource";
import { HttpHeaders } from "../../lib/httpHeaders";
import { agentPolicy, AgentPolicy } from "../../lib/policies/agentPolicy";
import { nodeDescribe, browserDescribe } from "../msAssert";

describe("AgentPolicy", function () {
  const emptyRequestPolicy = {
    sendRequest: (_: WebResourceLike) =>
      Promise.resolve({
        request: new WebResource(),
        status: 404,
        headers: new HttpHeaders(undefined),
      }),
  };

  const emptyPolicyOptions = new RequestPolicyOptions();

  nodeDescribe("for Node.js", function () {
    const http = require("http");
    const https = require("https");

    const agentSettings: AgentSettings = {
      http: new http.Agent(),
      https: new https.Agent(),
    };

    it("factory passes correct agent settings", function () {
      const factory = agentPolicy(agentSettings);

      const policy = factory.create(emptyRequestPolicy, emptyPolicyOptions) as AgentPolicy;

      policy.agentSettings.should.be.deep.equal(agentSettings);
    });

    it("sets correct agent settings through constructor", function () {
      const policy = new AgentPolicy(emptyRequestPolicy, emptyPolicyOptions, agentSettings);

      policy.agentSettings.should.be.deep.equal(agentSettings);
    });

    it("should assign agent settings to the web request", async function () {
      const policy = new AgentPolicy(emptyRequestPolicy, emptyPolicyOptions, agentSettings);
      const request = new WebResource();

      await policy.sendRequest(request);

      request.agentSettings!.should.be.deep.equal(agentSettings);
    });

    it("should not override agent settings to the web request", async function () {
      const policy = new AgentPolicy(emptyRequestPolicy, emptyPolicyOptions, agentSettings);

      const request = new WebResource();
      const requestSpecificAgentSettings = {
        http: new http.Agent({ keepAlive: true }),
        https: new http.Agent({ keepAlive: true }),
      };
      request.agentSettings = requestSpecificAgentSettings;

      await policy.sendRequest(request);

      request.agentSettings!.should.be.deep.equal(requestSpecificAgentSettings);
    });
  });

  browserDescribe("for browser", () => {
    it("should throw an Error while constructing object", () => {
      const agentSettings = {} as AgentSettings;
      const construct = () =>
        new AgentPolicy(emptyRequestPolicy, emptyPolicyOptions, agentSettings);
      construct.should.throw();
    });
  });
});
