// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpRequest, HttpResponse } from "./msRest";

function stripAuthorizationHeader(httpRequest: HttpRequest): HttpRequest {
  let result: HttpRequest = httpRequest;
  if (result.headers.contains("authorization")) {
    result = result.clone();
    result.headers.remove("authorization");
  }
  return result;
}

export interface RestErrorProperties {
  code?: string;
  statusCode?: number;
  request?: HttpRequest;
  response?: HttpResponse;
  body?: any;
}

export class RestError extends Error implements RestErrorProperties {
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly request?: HttpRequest;
  public readonly response?: HttpResponse;
  public readonly body?: any;

  constructor(message: string, properties?: RestErrorProperties) {
    super(message);
    if (properties) {
      this.code = properties.code;
      this.statusCode = properties.statusCode;
      if (properties.request) {
        this.request = stripAuthorizationHeader(properties.request);
      }
      this.response = properties.response;
      if (this.response && this.response.request) {
        this.response.request = stripAuthorizationHeader(this.response.request);
      }
      this.body = properties.body;
    }
  }
}
