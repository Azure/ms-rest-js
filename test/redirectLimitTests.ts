// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { expect } from "chai";
import sinon from "sinon";

import { DefaultHttpClient } from "../lib/defaultHttpClient";
import { getHttpMock, HttpMockFacade } from "./mockHttp";
import { CommonResponse } from "../lib/fetchHttpClient";
import { ServiceClient } from "../lib/serviceClient";
import { isNode } from "../lib/msRest";
import { TestFunction } from "mocha";
import { redirectPolicy } from "../lib/policies/redirectPolicy";

const nodeIt = (isNode ? it : it.skip) as TestFunction;

describe("redirectLimit", function () {
  let httpMock: HttpMockFacade;
  beforeEach(() => {
    httpMock = getHttpMock();
    httpMock.setup();
  });
  afterEach(() => httpMock.teardown());

  function getMockedHttpClient(): DefaultHttpClient {
    const httpClient = new DefaultHttpClient();
    const fetchMock = httpMock.getFetch();
    if (fetchMock) {
      sinon.stub(httpClient, "fetch").callsFake(async (input, init) => {
        const response = await fetchMock(input, init);
        return (response as unknown) as CommonResponse;
      });
    }
    return httpClient;
  }

  const resourceUrl = "/resource";
  const redirectedUrl_1 = "/redirected_1";
  const redirectedUrl_2 = "/redirected_2";

  function configureMockRedirectResponses() {
    httpMock.get(resourceUrl, async () => {
      return { status: 300, headers: { location: redirectedUrl_1 } };
    });
    httpMock.get(redirectedUrl_1, async () => {
      return { status: 300, headers: { location: redirectedUrl_2 } };
    });
    httpMock.get(redirectedUrl_2, async () => {
      return { status: 200 };
    });
  }

  nodeIt(
    "of 20 should follow redirects and return last visited url in response.url",
    async function () {
      configureMockRedirectResponses();

      const client = new ServiceClient(undefined, {
        httpClient: getMockedHttpClient(),
      });

      // Act
      const response = await client.sendRequest({
        url: resourceUrl,
        method: "GET",
        redirectLimit: 20,
      });

      expect(response.status).to.equal(200);
      expect(response.redirected).to.be.true;
      expect(response.url).to.equal(redirectedUrl_2);
    }
  );

  nodeIt(
    "of 0 should not follow redirects and should return last visited url in response.url",
    async function () {
      configureMockRedirectResponses();

      const client = new ServiceClient(undefined, {
        httpClient: getMockedHttpClient(),
      });

      // Act
      const response = await client.sendRequest({
        url: resourceUrl,
        method: "GET",
        redirectLimit: 0,
      });

      expect(response.status).to.equal(300);
      expect(response.headers.get("location")).to.equal(redirectedUrl_1);
      expect(response.redirected).to.be.false;
      expect(response.url).to.equal(resourceUrl);
    }
  );

  nodeIt(
    "of 1 should follow 1 redirect and return last visited url in response.url",
    async function () {
      configureMockRedirectResponses();

      const client = new ServiceClient(undefined, {
        httpClient: getMockedHttpClient(),
      });

      // Act
      const response = await client.sendRequest({
        url: resourceUrl,
        method: "GET",
        redirectLimit: 1,
      });

      expect(response.status).to.equal(300);
      expect(response.headers.get("location")).to.equal(redirectedUrl_2);
      expect(response.redirected).to.be.true;
      expect(response.url).to.equal(redirectedUrl_1);
    }
  );

  nodeIt(
    "of undefined should follow redirects and return last visited url in response.url",
    async function () {
      configureMockRedirectResponses();

      const client = new ServiceClient(undefined, {
        httpClient: getMockedHttpClient(),
      });

      // Act
      const response = await client.sendRequest({ url: resourceUrl, method: "GET" });

      expect(response.status).to.equal(200);
      expect(response.redirected).to.be.true;
      expect(response.url).to.equal(redirectedUrl_2);
    }
  );

  nodeIt(
    "of undefinded with policy limit of 1 should follow 1 redirect and return last visited url in response.url",
    async function () {
      configureMockRedirectResponses();

      const client = new ServiceClient(undefined, {
        httpClient: getMockedHttpClient(),
        requestPolicyFactories: [redirectPolicy(1)],
      });

      // Act
      const response = await client.sendRequest({ url: resourceUrl, method: "GET" });

      expect(response.status).to.equal(300);
      expect(response.headers.get("location")).to.equal(redirectedUrl_2);
      expect(response.redirected).to.be.true;
      expect(response.url).to.equal(redirectedUrl_1);
    }
  );
});
