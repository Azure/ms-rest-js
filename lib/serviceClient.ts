// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { DefaultHttpPipelineOptions, HttpPipeline, createDefaultHttpPipeline } from "./httpPipeline";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { WebResource, HttpOperationResponse } from "./msRest";

/**
 * Options that can be used to configure a ServiceClient.
 */
export interface ServiceClientOptions {
  /**
   * The HttpPipeline that this ServiceClient will use, or the options that will be used to create
   * the default HttpPipeline.
   */
  httpPipeline?: HttpPipeline | DefaultHttpPipelineOptions;
}

/**
 * An abstract type that encapsulates a HttpPipeline for derived ServiceClient types.
 */
export abstract class ServiceClient {
  private readonly _httpPipeline: HttpPipeline;

  /**
   * The ServiceClient constructor
   * @param httpPipeline
   */
  constructor(options?: ServiceClientOptions) {
    if (options && options.httpPipeline) {
      if (options.httpPipeline instanceof HttpPipeline) {
        this._httpPipeline = options.httpPipeline;
      } else {
        this._httpPipeline = createDefaultHttpPipeline(options.httpPipeline);
      }
    } else {
      this._httpPipeline = createDefaultHttpPipeline();
    }
  }

  async pipeline(request: WebResource): Promise<HttpResponse> {
    const httpRequest: HttpRequest = request.toHttpRequest();
    return this.sendRequest(httpRequest);
  }

  /**
   * Send the provided HttpRequest through this ServiceClient's HTTP pipeline.
   * @param request The HttpRequest to send through this ServiceClient's HTTP pipeline.
   */
  async sendRequest(request: HttpRequest): Promise<HttpResponse> {
    return await this._httpPipeline.send(request);
  }
}
