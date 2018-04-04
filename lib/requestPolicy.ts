// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";

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