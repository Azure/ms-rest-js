// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpClient } from "./httpClient";
import { HttpHeaders } from "./httpHeaders";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";

type FetchMethod = (url: string, options: RequestInit) => Response;

/**
 * The cached fetch method that will be used to send HTTP requests.
 */
const fetch: FetchMethod = require("fetch-ponyfill")({ useCookie: true }).fetch;

/**
 * A HttpClient implementation that uses fetch to send HTTP requests.
 */
export class FetchHttpClient implements HttpClient {
    public async send(request: HttpRequest): Promise<HttpResponse> {
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
                textBody: () => fetchResponse.text(),
                deserializedBody: () => fetchResponse.json()
            };

            result = Promise.resolve(response);
        } catch (err) {
            result = Promise.reject(err);
        }

        return result;
    }
}