// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpClient } from "./httpClient";
import { HttpHeaders } from "./httpHeaders";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";

export type FetchMethod = (url: string, options: RequestInit) => Promise<Response>;

// TODO: remove getFetch()/myFetch from utils and use only this version

/**
 * Provides the fetch() method based on the environment.
 * @returns {fetch} fetch - The fetch() method available in the environment to make requests
 */
 const _fetch: FetchMethod = (function() {
  // using window.Fetch in Edge gives a TypeMismatchError
  // (https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8546263/).
  // Hence we will be using the fetch-ponyfill for Edge.
  if (typeof window !== "undefined" && window.fetch && window.navigator &&
    window.navigator.userAgent && window.navigator.userAgent.indexOf("Edge/") === -1) {
    return window.fetch.bind(window);
  }
  return require("fetch-ponyfill")({ useCookie: true }).fetch;
})();

/**
 * A HttpClient implementation that uses fetch to send HTTP requests.
 */
export class FetchHttpClient implements HttpClient {
  private readonly fetch: FetchMethod;

  /**
   * Creates a FetchHttpClient, optionally overriding the default fetch implementation.
   * @param fetch the fetch implementation to use
   */
  constructor(fetch?: FetchMethod) {
    this.fetch = fetch || _fetch;
  }

  public async send(request: HttpRequest): Promise<HttpResponse> {
    const fetchRequestBody: any = request.serializedBody || request.body;

    const fetchRequestOptions: RequestInit = {
      method: request.method,
      headers: request.headers.toJson(),
      body: fetchRequestBody
    };

    const fetchResponse: Response = await this.fetch(request.url.toString(), fetchRequestOptions);

    const responseHeaders = new HttpHeaders();
    const fetchResponseHeaders: Headers = fetchResponse.headers;
    fetchResponseHeaders.forEach((headerValue: string, headerName: string) => { responseHeaders.set(headerName, headerValue); });

    return {
      request: request,
      statusCode: fetchResponse.status,
      headers: responseHeaders,
      textBody: async () => await fetchResponse.text(),
      deserializedBody: async () => await fetchResponse.json(),
      blobBody: async () => await fetchResponse.blob(),
      readableStreamBody: fetchResponse.body
    };
  }
}
