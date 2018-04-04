// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpClient } from "./httpClient";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { HttpHeaders } from "./httpHeaders";

type FetchMethod = (url: string, options: any) => Response;

/**
 * Provides the fetch() method based on the environment.
 * @returns {fetch} fetch - The fetch() method available in the environment to make requests
 */
function getFetch(): FetchMethod {
    // using window.Fetch in Edge gives a TypeMismatchError
    // (https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8546263/).
    // Hence we will be using the fetch-ponyfill for Edge.
    return (window && window.fetch && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf("Edge/") === -1)
        ? window.fetch.bind(window)
        : require("fetch-ponyfill")({ useCookie: true }).fetch;
}

/**
 * The cached fetch method that will be used to send HTTP requests.
 */
let myFetch: FetchMethod;

/**
 * A HttpClient implementation that uses fetch to send HTTP requests.
 */
export class FetchHttpClient implements HttpClient {
    constructor() {
        if (!myFetch) {
            myFetch = getFetch();
        }
    }

    async send(request: HttpRequest): Promise<HttpResponse> {
        let result: Promise<HttpResponse>;

        try {
            const fetchResponse: Response = await myFetch(request.url.toString(), request);

            const fetchResponseHeaders: Headers = fetchResponse.headers;
            const responseHeaders: HttpHeaders = {};
            for (const headerName in fetchResponseHeaders.keys()) {
                const headerValue: string | null = fetchResponseHeaders.get(headerName);
                if (headerValue) {
                    responseHeaders[headerName] = headerValue;
                }
            }

            const response: HttpResponse = {
                request: request,
                statusCode: fetchResponse.status,
                headers: responseHeaders,
                bodyAsText: () => fetchResponse.text(),
                bodyAsJson: () => fetchResponse.json()
            };

            result = Promise.resolve(response);
        } catch (err) {
            result = Promise.reject(err);
        }

        return result;
    }
}