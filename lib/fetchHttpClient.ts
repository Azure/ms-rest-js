// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpHeaders } from "./httpHeaders";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";

type FetchMethod = (url: string, options: RequestInit) => Response;

/**
 * Provides the fetch() method based on the environment.
 * @returns {fetch} fetch - The fetch() method available in the environment to make requests
 */
function getFetch(): FetchMethod {
    return require("fetch-ponyfill")({ useCookie: true }).fetch;
}

/**
 * The cached fetch method that will be used to send HTTP requests.
 */
let fetch: FetchMethod;

/**
 * A HttpClient implementation that uses fetch to send HTTP requests.
 * @param request The request to send.
 */
export async function fetchHttpClient(request: HttpRequest): Promise<HttpResponse> {
    if (!fetch) {
        fetch = getFetch();
    }

    let result: Promise<HttpResponse>;

    try {
        const fetchRequestOptions: RequestInit = {
            method: request.httpMethod,
            headers: request.headers.toJson(),
            body: request.body
        };

        const fetchResponse: Response = await fetch(request.url, fetchRequestOptions);

        const responseHeaders = new HttpHeaders();
        const fetchResponseHeaders: Headers = fetchResponse.headers;
        fetchResponseHeaders.forEach((headerValue: string, headerName: string) => { responseHeaders.set(headerName, headerValue); });

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