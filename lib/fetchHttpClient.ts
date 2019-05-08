// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import "isomorphic-fetch";
import * as tough from "tough-cookie";
import AbortController from "abort-controller";
import FormData from "form-data";

import { HttpClient } from "./httpClient";
import { WebResource } from "./webResource";
import { HttpOperationResponse } from "./httpOperationResponse";
import { HttpHeaders } from "./httpHeaders";
import { RestError } from "./restError";
import { Readable, Transform } from "stream";

interface FetchError extends Error {
  code: string | undefined;
  errno: string | undefined;
  type: string | undefined;
}

export class FetchHttpClient implements HttpClient {
  private readonly cookieJar = new tough.CookieJar();

  async sendRequest(httpRequest: WebResource): Promise<HttpOperationResponse> {
    if (!httpRequest) {
      throw new Error("httpRequest (WebResource) cannot be null or undefined and must be of type object.");
    }

    const abortController = new AbortController();
    if (httpRequest.abortSignal) {
      if (httpRequest.abortSignal.aborted) {
        throw new RestError("The request was aborted", RestError.REQUEST_ABORTED_ERROR, undefined, httpRequest);
      }

      httpRequest.abortSignal.addEventListener("abort", (event: Event) => {
        if (event.type === "abort") {
          abortController.abort();
        }
      });
    }

    if (httpRequest.timeout) {
      setTimeout(() => {
        abortController.abort();
      }, httpRequest.timeout);
    }

    if (httpRequest.formData) {
      const formData: any = httpRequest.formData;
      const requestForm = new FormData();
      const appendFormValue = (key: string, value: any) => {
            // value function probably returns a stream so we can provide a fresh stream on each retry
        if (typeof value === "function") {
          value = value();
        }
        if (value && value.hasOwnProperty("value") && value.hasOwnProperty("options")) {
          requestForm.append(key, value.value, value.options);
        } else {
          requestForm.append(key, value);
        }
      };
      for (const formKey of Object.keys(formData)) {
        const formValue = formData[formKey];
        if (Array.isArray(formValue)) {
          for (let j = 0; j < formValue.length; j++) {
            appendFormValue(formKey, formValue[j]);
          }
        } else {
          appendFormValue(formKey, formValue);
        }
      }

      httpRequest.body = requestForm;
      httpRequest.formData = undefined;
      const contentType = httpRequest.headers.get("Content-Type");
      if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
        if (typeof requestForm.getBoundary === "function") {
          httpRequest.headers.set("Content-Type", `multipart/form-data; boundary=${requestForm.getBoundary()}`);
        } else {
              // browser will automatically apply a suitable content-type header
          httpRequest.headers.remove("Content-Type");
        }
      }
    }

    let body = httpRequest.body
            ? (typeof httpRequest.body === "function" ? httpRequest.body() : httpRequest.body)
            : undefined;
    if (httpRequest.onUploadProgress && httpRequest.body) {
      let loadedBytes = 0;
      const uploadReportStream = new Transform({
        transform: (chunk: string | Buffer, _encoding, callback) => {
          loadedBytes += chunk.length;
          httpRequest.onUploadProgress!({ loadedBytes });
          callback(undefined, chunk);
        }
      });

      if (isReadableStream(body)) {
        body.pipe(uploadReportStream);
      } else {
        uploadReportStream.end(body);
      }

      body = uploadReportStream;
    }

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

    const requestInit: RequestInit = {
      body: body,
      headers: httpRequest.headers.rawHeaders(),
      method: httpRequest.method,
      signal: abortController.signal
    };

    try {
      const response: Response = await fetch(httpRequest.url, requestInit);

      const headers = parseHeaders(response.headers);
      const operationResponse: HttpOperationResponse = {
        headers: headers,
        request: httpRequest,
        status: response.status
      };

      const onDownloadProgress = httpRequest.onDownloadProgress;
      if (!onDownloadProgress) {
        const bodyAsText = response.body ? await response.text() : undefined;
        operationResponse.bodyAsText = bodyAsText;
      } else {
        const responseBody: ReadableStream<Uint8Array> | undefined = response.body ? response.body : undefined;

        if (isReadableStream(responseBody)) {
          let loadedBytes = 0;
          const downloadReportStream = new Transform({
            transform: (chunk: string | Buffer, _encoding, callback) => {
              loadedBytes += chunk.length;
              onDownloadProgress({ loadedBytes });
              callback(undefined, chunk);
            }
          });
          responseBody.pipe(downloadReportStream);
          operationResponse.readableStreamBody = downloadReportStream;
        } else {
          const length = parseInt(headers.get("Content-Length")!) || undefined;
          if (length) {
                    // Calling callback for non-stream response for consistency with browser
            onDownloadProgress({ loadedBytes: length });
          }
        }
      }

      if (this.cookieJar) {
        const setCookieHeader = operationResponse.headers.get("Set-Cookie");
        if (setCookieHeader != undefined) {
          await new Promise((resolve, reject) => {
            this.cookieJar!.setCookie(setCookieHeader, httpRequest.url, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        }
      }

      return operationResponse;
    } catch (error) {
      const fetchError: FetchError = error;
      if (fetchError.code = "ENOTFOUND") {
        throw new RestError(
                    fetchError.message,
                    RestError.REQUEST_SEND_ERROR
                );
      }

      throw fetchError;
    } finally {
    }
  }
}

function isReadableStream(body: any): body is Readable {
  return typeof body.pipe === "function";
}

export function parseHeaders(headers: Headers): HttpHeaders {
  const httpHeaders = new HttpHeaders();

  headers.forEach((value, key) => {
    httpHeaders.set(key, value);
  });

  return httpHeaders;
}
