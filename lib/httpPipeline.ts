// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { FetchHttpClient } from "./fetchHttpClient";
import { HttpClient } from "./httpClient";
import { HttpPipelineOptions } from "./httpPipelineOptions";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { msRestNodeJsUserAgentPolicy } from "./policies/msRestNodeJsUserAgentPolicy";
import { RequestPolicy } from "./requestPolicy";
import { RequestPolicyFactory } from "./requestPolicyFactory";
import { RequestPolicyOptions } from "./requestPolicyOptions";
import { Constants } from "./util/constants";
import { isNode } from "./util/utils";
import { ServiceClientCredentials } from "./msRest";
import { HttpPipelineLogger } from "./httpPipelineLogger";
import { signingPolicy } from "./policies/signingPolicy";
import { redirectPolicy } from "./policies/redirectPolicy";
import { rpRegistrationPolicy } from "./policies/rpRegistrationPolicy";
import { exponentialRetryPolicy } from "./policies/exponentialRetryPolicy";
import { systemErrorRetryPolicy } from "./policies/systemErrorRetryPolicy";

let defaultHttpClient: HttpClient;

function getDefaultHttpClient(): HttpClient {
  if (!defaultHttpClient) {
    defaultHttpClient = new FetchHttpClient();
  }
  return defaultHttpClient;
}

/**
 * Options that can be used to configure the default HttpPipeline configuration.
 */
export interface DefaultHttpPipelineOptions {
  /**
   * Credentials that will be used to authenticate with the target endpoint.
   */
  credentials?: ServiceClientCredentials;

  /**
   * The number of seconds to wait on a resource provider registration request before timing out.
   */
  rpRegistrationRetryTimeoutInSeconds?: number;

  /**
   * Whether or not to add the retry policies to the HttpPipeline.
   */
  addRetryPolicies?: boolean;

  /**
   * The HttpClient to use. If no httpClient is specified, then the default HttpClient will be used.
   */
  httpClient?: HttpClient;

  /**
   * The logger to use when RequestPolicies need to log information.
   */
  logger?: HttpPipelineLogger;
}

/**
 * Get the default HttpPipeline.
 */
export function createDefaultHttpPipeline(options?: DefaultHttpPipelineOptions): HttpPipeline {
  const requestPolicyFactories: RequestPolicyFactory[] = [];

  if (options && options.credentials) {
    requestPolicyFactories.push(signingPolicy(options.credentials));
  }

  if (isNode) {
    requestPolicyFactories.push(msRestNodeJsUserAgentPolicy([`ms-rest-js/${Constants.msRestVersion}`]));
  }

  requestPolicyFactories.push(redirectPolicy());
  requestPolicyFactories.push(rpRegistrationPolicy(options && options.rpRegistrationRetryTimeoutInSeconds != undefined ? options.rpRegistrationRetryTimeoutInSeconds : undefined));

  if (options && options.addRetryPolicies) {
    requestPolicyFactories.push(exponentialRetryPolicy());
    requestPolicyFactories.push(systemErrorRetryPolicy());
  }

  const httpPipelineOptions: HttpPipelineOptions = {
    httpClient: options && options.httpClient ? options.httpClient : getDefaultHttpClient(),
    pipelineLogger: options && options.logger ? options.logger : undefined
  };

  return new HttpPipeline(requestPolicyFactories, httpPipelineOptions);
}

/**
 * A collection of RequestPolicies that will be applied to a HTTP request before it is sent and will
 * be applied to a HTTP response when it is received.
 */
export class HttpPipeline {
  private readonly _httpClient: HttpClient;
  private readonly _requestPolicyOptions: RequestPolicyOptions;

  constructor(private readonly _requestPolicyFactories: RequestPolicyFactory[], private readonly _httpPipelineOptions: HttpPipelineOptions) {
    if (!this._httpPipelineOptions) {
      this._httpPipelineOptions = {};
    }

    if (!this._httpPipelineOptions.httpClient) {
      this._httpPipelineOptions.httpClient = getDefaultHttpClient();
    }

    this._httpClient = this._httpPipelineOptions.httpClient;
    this._requestPolicyOptions = new RequestPolicyOptions(this._httpPipelineOptions.pipelineLogger);
  }

  /**
   * Send the provided HttpRequest request.
   * @param request The HTTP request to send.
   * @return A Promise that resolves to the HttpResponse from the targeted server.
   */
  public send(request: HttpRequest): Promise<HttpResponse> {
    let requestPolicyChainHead: RequestPolicy = this._httpClient;
    if (this._requestPolicyFactories) {
      const requestPolicyFactoriesLength: number = this._requestPolicyFactories.length;
      for (let i = requestPolicyFactoriesLength - 1; i >= 0; --i) {
        const requestPolicyFactory: RequestPolicyFactory = this._requestPolicyFactories[i];
        requestPolicyChainHead = requestPolicyFactory(requestPolicyChainHead, this._requestPolicyOptions);
      }
    }
    return requestPolicyChainHead.send(request);
  }
}