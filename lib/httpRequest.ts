// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
import { OperationSpec } from "./operationSpec";

/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
export class HttpRequest {
  /**
   * The HTTP headers that will be sent with this request.
   */
  public readonly headers: HttpHeaders;

  /**
   * The body of this HttpRequest after it has been serialized.
   */
  public serializedBody: any;

  /**
   * Create a new HTTP request using the provided properties.
   * @param httpMethod The HTTP method that will be used to send this request.
   * @param url The URL that this request will be sent to.
   * @param headers The HTTP headers to include in this request.
   * @param deserializedBody The deserialized body of this HTTP request.
   * @param _operationSpec The specification that describes the operation of this HttpRequest.
   */
  constructor(public httpMethod: HttpMethod, public url: string, headers: HttpHeaders | RawHttpHeaders, public deserializedBody?: any, public readonly operationSpec?: OperationSpec<any, any>) {
    if (!this.url) {
      const urlString: string = (this.url == undefined ? this.url : `"${this.url}"`);
      throw new Error(`${urlString} is not a valid URL for a HttpRequest.`);
    }

    this.headers = (headers instanceof HttpHeaders ? headers : new HttpHeaders(headers));
  }

  /**
   * Create a deep clone/copy of this HttpRequest.
   */
  public clone(): HttpRequest {
    return new HttpRequest(this.httpMethod, this.url, this.headers.clone(), this.deserializedBody, this.operationSpec);
  }
}