// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as tough from "tough-cookie";
import "node-fetch";

import { FetchHttpClient } from "./fetchHttpClient";
import { HttpOperationResponse } from "./httpOperationResponse";
import { WebResource } from "./webResource";
import { createProxyAgent, ProxyAgent } from "./proxyAgent";

export class NodeFetchHttpClient extends FetchHttpClient {
  private readonly cookieJar = new tough.CookieJar();

  async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return (global as any).fetch(input as any, init as any) as any;
  }

  async prepareRequest(httpRequest: WebResource): Promise<Partial<RequestInit>> {
    const requestInit: Partial<RequestInit & { agent?: any }> = {};

    if (this.cookieJar && !httpRequest.headers.get("Cookie")) {
      const cookieString = await new Promise<string>((resolve, reject) => {
        this.cookieJar!.getCookieString(httpRequest.url, (err, cookie) => {
          if (err) {
            reject(err);
          } else {
            resolve(cookie);
          }
        });
      });

      httpRequest.headers.set("Cookie", cookieString);
    }

    if (httpRequest.proxySettings) {
      const tunnel: ProxyAgent = createProxyAgent(httpRequest.url, httpRequest.proxySettings, httpRequest.headers);
      requestInit.agent = tunnel.agent;
    }

    return requestInit;
  }

  async processRequest(operationResponse: HttpOperationResponse): Promise<void> {
    if (this.cookieJar) {
      const setCookieHeader = operationResponse.headers.get("Set-Cookie");
      if (setCookieHeader != undefined) {
        await new Promise((resolve, reject) => {
          this.cookieJar!.setCookie(setCookieHeader, operationResponse.request.url, err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    }
  }
}
