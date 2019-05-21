// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as tough from "tough-cookie";

import { FetchHttpClient } from "./fetchHttpClient";
import { HttpOperationResponse } from "./httpOperationResponse";
import { WebResource } from "./webResource";

export class NodeFetchHttpClient extends FetchHttpClient {
  private readonly cookieJar = new tough.CookieJar();

  async prepareRequest(httpRequest: WebResource): Promise<void> {
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
