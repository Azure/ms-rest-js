// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { BaseRequestPolicy, RequestPolicy, RequestPolicyOptions, RequestPolicyFactory } from "./requestPolicy";
import { WebResource } from "../webResource";
import { HttpOperationResponse } from "../httpOperationResponse";
import { Constants } from "../util/constants";

type ResponseHandler = (response: HttpOperationResponse) => Promise<HttpOperationResponse>;
const StatusCodes = Constants.HttpConstants.StatusCodes;

export function throttlingRetryPolicy(): RequestPolicyFactory {
  return {
    create: (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
      return new ThrottlingRetryPolicy(nextPolicy, options);
    }
  };
}

export class ThrottlingRetryPolicy extends BaseRequestPolicy {
  private _handleResponse: ResponseHandler;

  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, _handleResponse?: ResponseHandler) {
    super(nextPolicy, options);
    this._handleResponse = _handleResponse || this._defaultResponseHandler;
  }

  public sendRequest(httpRequest: WebResource): Promise<HttpOperationResponse> {
    return this._nextPolicy.sendRequest(httpRequest).then(response => {
      if (response.status !== StatusCodes.TooManyRequests) {
        return Promise.resolve(response);
      } else {
        return this._handleResponse(response);
      }
    });
  }

  private _defaultResponseHandler(response: HttpOperationResponse): Promise<HttpOperationResponse> {
    return Promise.reject();
  }
}
