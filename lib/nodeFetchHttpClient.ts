// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as tough from "tough-cookie";
import http from "http";
import https from "https";
import * as tunnel from "tunnel";
import "node-fetch";

import { FetchHttpClient } from "./fetchHttpClient";
import { HttpOperationResponse } from "./httpOperationResponse";
import { WebResource } from "./webResource";
import { ProxySettings } from "./serviceClient";
import { URLBuilder } from "./url";
import { HttpHeaders } from "./httpHeaders";

export class NodeFetchHttpClient extends FetchHttpClient {
  private readonly cookieJar = new tough.CookieJar();

  async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return fetch(input as any, init as any) as any;
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
      const tunnel = createProxyAgent(httpRequest.url, httpRequest.proxySettings!, httpRequest.headers);
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

declare type ProxyAgent = { isHttps: boolean; agent: http.Agent | https.Agent };
export function createProxyAgent(requestUrl: string, proxySettings: ProxySettings, headers?: HttpHeaders): ProxyAgent {
  const tunnelOptions: tunnel.HttpsOverHttpsOptions = {
    proxy: {
      host: URLBuilder.parse(proxySettings.host).getHost(),
      port: proxySettings.port,
      headers: (headers && headers.rawHeaders()) || {}
    }
  };

  if ((proxySettings.username && proxySettings.password)) {
    tunnelOptions.proxy!.proxyAuth = `${proxySettings.username}:${proxySettings.password}`;
  }

  const requestScheme = URLBuilder.parse(requestUrl).getScheme() || "";
  const isRequestHttps = requestScheme.toLowerCase() === "https";
  const proxyScheme = URLBuilder.parse(proxySettings.host).getScheme() || "";
  const isProxyHttps = proxyScheme.toLowerCase() === "https";

  const proxyAgent = {
    isHttps: isRequestHttps,
    agent: createTunnel(isRequestHttps, isProxyHttps, tunnelOptions)
  };

  return proxyAgent;
}

export function createTunnel(isRequestHttps: boolean, isProxyHttps: boolean, tunnelOptions: tunnel.HttpsOverHttpsOptions): http.Agent | https.Agent {
  if (isRequestHttps && isProxyHttps) {
    return tunnel.httpsOverHttps(tunnelOptions);
  } else if (isRequestHttps && !isProxyHttps) {
    return tunnel.httpsOverHttp(tunnelOptions);
  } else if (!isRequestHttps && isProxyHttps) {
    return tunnel.httpOverHttps(tunnelOptions);
  } else {
    return tunnel.httpOverHttp(tunnelOptions);
  }
}
