// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpRequest } from "./httpRequest";
import { HttpHeaders } from "./httpHeaders";

/**
 * A HTTP response that is received from a server after a HttpRequest has been sent.
 */
export interface HttpResponse {
    /**
     * The request that was the cause of this HttpResponse.
     */
    request: HttpRequest;

    /**
     * The status code number of this response.
     */
    statusCode: number;

    /**
     * The HTTP headers of this response.
     */
    headers: HttpHeaders;

    /**
     * Get the body of this HttpResponse as a string.
     */
    bodyAsText(): Promise<string | undefined>;

    /**
     * Get the body of this HttpResponse as a JSON object.
     */
    bodyAsJson(): Promise<{} | any[] | undefined>;
}