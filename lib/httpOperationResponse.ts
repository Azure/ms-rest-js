// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { WebResource } from "./webResource";
import { HttpHeaders } from "./httpHeaders";

/**
 * The properties on an HTTP response which will always be present.
 */
export interface BaseHttpOperationResponse {
  /**
   * The raw request
   */
  request: WebResource;

  /**
   * The HTTP response status (e.g. 200)
   */
  status: number;

  /**
   * The HTTP response headers.
   */
  headers: HttpHeaders;
}

/**
 * Wrapper object for http request and response. Deserialized object is stored in
 * the `parsedBody` property when the response body is received in JSON or XML.
 */
export interface HttpOperationResponse<TBody = any, THeaders = any> extends BaseHttpOperationResponse {
  /**
   * The parsed HTTP response headers.
   */
  parsedHeaders?: THeaders;

  /**
   * The response body as text (string format)
   */
  bodyAsText?: string | null;

  /**
   * The response body as parsed JSON or XML
   */
  parsedBody?: TBody;

  /**
   * BROWSER ONLY
   *
   * The response body as a browser Blob.
   * Always undefined in node.js.
   */
  blobBody?: () => Promise<Blob>;

  /**
   * NODEJS ONLY
   *
   * The response body as a node.js Readable stream.
   * Always undefined in the browser.
   */
  readableStreamBody?: NodeJS.ReadableStream;
}
