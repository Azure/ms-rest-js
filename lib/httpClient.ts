// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";

/**
 * A interface that can send HttpRequests and receive promised HttpResponses.
 */
export interface HttpClient {
    /**
     * Send the provided HttpRequest request.
     * @param request The HTTP request to send.
     * @return A Promise that resolves to the HttpResponse from the targeted server.
     */
    send(request: HttpRequest): Promise<HttpResponse>;
}