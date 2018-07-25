// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Transform, Readable } from "stream";
import * as FormData from "form-data";
import * as tough from "isomorphic-tough-cookie";
import { HttpClient } from "./httpClient";
import { HttpHeaders } from "./httpHeaders";
import { HttpOperationResponse } from "./httpOperationResponse";
import { RestError } from "./restError";
import { isNode } from "./util/utils";
import { WebResource } from "./webResource";

const axiosClient = axios.create();

if (isNode) {
  // Workaround for https://github.com/axios/axios/issues/1158
  axiosClient.interceptors.request.use(config => ({ ...config, method: config.method && config.method.toUpperCase() }));
}

/**
 * A HttpClient implementation that uses axios to send HTTP requests.
 */
export class AxiosHttpClient implements HttpClient {
  private readonly cookieJar = isNode ? new tough.CookieJar() : undefined;

  public async sendRequest(httpRequest: WebResource): Promise<HttpOperationResponse> {
    if (!httpRequest) {
      return Promise.reject(new Error("options (WebResource) cannot be null or undefined and must be of type object."));
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

    const abortSignal = httpRequest.abortSignal;
    if (abortSignal && abortSignal.aborted) {
      throw new RestError("The request was aborted", "REQUEST_ABORTED_ERROR", undefined, httpRequest);
    }

    let abortListener: (() => void) | undefined;
    const cancelToken = abortSignal && new axios.CancelToken(canceler => {
      abortListener = () => canceler();
      abortSignal.addEventListener("abort", abortListener);
    });

    const rawHeaders: { [headerName: string]: string } = httpRequest.headers.rawHeaders();
    const bodyType = typeof httpRequest.body;
    // Workaround for https://github.com/axios/axios/issues/755
    // tslint:disable-next-line:no-null-keyword
    let axiosBody = bodyType === "undefined" ? null :
      bodyType === "function" ? httpRequest.body() :
      httpRequest.body;

    const onUploadProgress = httpRequest.onUploadProgress;
    if (onUploadProgress && typeof axiosBody.pipe === "function") {
      const totalBytes = parseInt(httpRequest.headers.get("Content-Length")!) || undefined;
      let loadedBytes = 0;
      const uploadReportStream = new Transform({
        transform: (chunk: string | Buffer, _encoding, callback) => {
          loadedBytes += chunk.length;
          onUploadProgress({
            loadedBytes,
            totalBytes
          });
          callback(undefined, chunk);
        }
      });
      (axiosBody as Readable).pipe(uploadReportStream);
      axiosBody = uploadReportStream;
    }

    let res: AxiosResponse;
    try {
      const config: AxiosRequestConfig = {
        method: httpRequest.method,
        url: httpRequest.url,
        headers: rawHeaders,
        data: axiosBody,
        transformResponse: undefined,
        validateStatus: () => true,
        // Workaround for https://github.com/axios/axios/issues/1362
        maxContentLength: 1024 * 1024 * 1024 * 10,
        responseType: httpRequest.rawResponse ? "stream" : "text",
        cancelToken,
        timeout: httpRequest.timeout
      };
      res = await axiosClient(config);
    } catch (err) {
      if (err instanceof axios.Cancel) {
        throw new RestError(err.message, "REQUEST_ABORTED_ERROR", undefined, httpRequest);
      } else {
        const axiosErr = err as AxiosError;
        throw new RestError(axiosErr.message, "REQUEST_SEND_ERROR", undefined, httpRequest);
      }
    } finally {
      if (abortSignal && abortListener) {
        abortSignal.removeEventListener("abort", abortListener);
      }
    }

    const headers = new HttpHeaders(res.headers);

    const onDownloadProgress = httpRequest.onDownloadProgress;
    let readableStreamBody: Readable = res.data;
    if (httpRequest.rawResponse && onDownloadProgress) {
      const totalBytes = parseInt(headers.get("Content-Length")!) || undefined;
      let loadedBytes = 0;
      const downloadReportStream = new Transform({
        transform: (chunk: string | Buffer, _encoding, callback) => {
          loadedBytes += chunk.length;
          onDownloadProgress({
            loadedBytes,
            totalBytes
          });
          callback(undefined, chunk);
        }
      });
      readableStreamBody.pipe(downloadReportStream);
      readableStreamBody = downloadReportStream;
    }

    const operationResponse: HttpOperationResponse = {
      request: httpRequest,
      status: res.status,
      headers,
      readableStreamBody: httpRequest.rawResponse ? readableStreamBody : undefined,
      bodyAsText: httpRequest.rawResponse ? undefined : res.data
    };

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

    return Promise.resolve(operationResponse);
  }
}
