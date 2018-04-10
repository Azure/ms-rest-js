// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpClient } from "../lib/httpClient";
import { HttpRequest } from "../lib/httpRequest";
import { HttpResponse } from "../lib/httpResponse";

/**
 * A function that can send HttpRequests and receive promised HttpResponses.
 * @param request The HTTP request to send.
 * @returns A Promise that resolves to the HttpResponse from the targeted server.
 */
export class FakeHttpClient implements HttpClient {
  constructor(private readonly sendFunction: (request: HttpRequest) => Promise<HttpResponse>) {
  }

  /**
   * Send the provided HttpRequest and return a Promise that resolves to the HttpResponse from the
   * targeted server.
   * @param request The HttpRequest to send.
   */
  public send(request: HttpRequest): Promise<HttpResponse> {
    return this.sendFunction(request);
  }
}