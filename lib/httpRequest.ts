// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
import { OperationSpec } from "./operationSpec";
import { BodyInit as NodeBodyInit } from "node-fetch";

/**
 * A value that can be used as an HTTP request body.
 */
export type HttpRequestBody = RequestInit["body"] | NodeBodyInit;

/**
 * The parameters that can be set to create a new HttpRequest.
 */
export interface HttpRequestParameters {
  /**
   * The HTTP method of the request.
   */
  method: HttpMethod | keyof typeof HttpMethod;

  /**
   * The URL that the request will be sent to.
   */
  url: string;

  /**
   * The HTTP headers to include in the request.
   */
  headers?: HttpHeaders | RawHttpHeaders;

  /**
   * The body that will be sent in the request.
   */
  body?: any;

  /**
   * The body of the request after it has been serialized.
   */
  serializedBody?: HttpRequestBody;

  /**
   * The specification that describes the operation that the request will perform.
   */
  operationSpec?: OperationSpec;
}

/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export class HttpRequest {
  /**
   * The HTTP method of this request.
   */
  public method: HttpMethod | keyof typeof HttpMethod;

  /**
   * The URL that this request will be sent to.
   */
  public url: string;

  /**
   * The HTTP headers that will be sent with this request.
   */
  public readonly headers: HttpHeaders;

  /**
   * The body that will be sent with this request.
   */
  public readonly body?: any;

  /**
   * The specification that describes the operation that this request will perform.
   */
  public readonly operationSpec?: OperationSpec;

  /**
   * The body of this HttpRequest after it has been serialized.
   */
  public serializedBody?: any;

  /**
   * Create a new HTTP request using the provided properties.
   * @param args The arguments that will be used to create the HTTP request.
   */
  constructor(args: HttpRequestParameters) {
    this.method = args.method;
    if (!args.url) {
      const urlString: string = (args.url == undefined ? args.url : `"${args.url}"`);
      throw new Error(`${urlString} is not a valid URL for a HttpRequest.`);
    }
    this.url = args.url;
    this.headers = args.headers instanceof HttpHeaders ? args.headers : new HttpHeaders(args.headers);
    this.body = args.body;
    this.operationSpec = args.operationSpec;
  }

  /**
   * Create a deep clone/copy of this HttpRequest.
   */
  public clone(): HttpRequest {
    return new HttpRequest({
      method: this.method,
      url: this.url,
      headers: this.headers.clone(),
      body: this.body,
      serializedBody: this.serializedBody,
      operationSpec: this.operationSpec
    });
  }
}