// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as FormData from "form-data";
import { HttpHeaders, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
import { OperationSpec } from "./operationSpec";
import { BodyInit as NodeBodyInit } from "node-fetch";

/**
 * A value that can be used as an HTTP request body.
 * Allows any fetch request body type or a Node.js readable stream.
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
   * Can be either an object tree which will get stringified or a raw type such as a string, Blob, or NodeJS.ReadableStream.
   */
  public body?: any;

  /**
   * The specification that describes the operation that this request will perform.
   */
  public readonly operationSpec?: OperationSpec;

  /**
   * The body of this HttpRequest after it has been serialized.
   */
  public serializedBody?: HttpRequestBody;

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
    this.serializedBody = args.serializedBody;
    this.operationSpec = args.operationSpec;
  }

  /**
   * Update this HttpRequest from the provided form data.
   */
  public updateFromFormData(formData: any): void {
    const requestForm = new FormData();
    const appendFormValue = (key: string, value: any) => {
      if (value && value.hasOwnProperty("value") && value.hasOwnProperty("options")) {
        requestForm.append(key, value.value, value.options);
      } else {
        requestForm.append(key, value);
      }
    };
    for (const formKey in formData) {
      if (formData.hasOwnProperty(formKey)) {
        const formValue: any = formData[formKey];
        if (formValue instanceof Array) {
          for (let j = 0; j < formValue.length; j++) {
            appendFormValue(formKey, formValue[j]);
          }
        } else {
          appendFormValue(formKey, formValue);
        }
      }
    }
    this.body = requestForm;

    if (typeof requestForm.getBoundary === "function") {
      const contentType: string | undefined = this.headers.get("Content-Type");
      if (contentType && contentType.indexOf("multipart/form-data") > -1) {
        this.headers.set("Content-Type", `multipart/form-data; boundary=${requestForm.getBoundary()}`);
      }
    }
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
