// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { RequestPolicyOptions } from "./requestPolicyOptions";
import { HttpPipelineLogLevel } from "./httpPipelineLogLevel";

/**
 * Uses the decorator pattern to add custom behavior when an HTTP request is made.
 * e.g. add header, user agent, timeout, retry, etc.
 */
export interface RequestPolicy {
  /**
   * Send the provided HttpRequest request.
   * @param request The HTTP request to send.
   * @return A Promise that resolves to the HttpResponse from the targeted server.
   */
  send(request: HttpRequest): Promise<HttpResponse>;
}

/**
 * A base class implementation of RequestPolicy.
 */
export abstract class BaseRequestPolicy implements RequestPolicy {
  constructor(protected readonly _nextPolicy: RequestPolicy, private readonly _options: RequestPolicyOptions) {
  }

  public abstract send(request: HttpRequest): Promise<HttpResponse>;

  /**
   * Get whether or not a log with the provided log level should be logged.
   * @param logLevel The log level of the log that will be logged.
   * @returns Whether or not a log with the provided log level should be logged.
   */
  protected shouldLog(logLevel: HttpPipelineLogLevel): boolean {
    return this._options.shouldLog(logLevel);
  }

  /**
   * Attempt to log the provided message to the provided logger. If no logger was provided or if
   * the log level does not meat the logger's threshold, then nothing will be logged.
   * @param logLevel The log level of this log.
   * @param message The message of this log.
   */
  protected log(logLevel: HttpPipelineLogLevel, message: string): void {
    this._options.log(logLevel, message);
  }
}