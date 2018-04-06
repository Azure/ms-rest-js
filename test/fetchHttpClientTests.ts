// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { fetchHttpClient } from "../lib/fetchHttpClient";
import { HttpRequest } from "../lib/httpRequest";
import { HttpResponse } from "../lib/httpResponse";

describe("fetchHttpClient", () => {
    it("should send HTTP requests", () => {
        const request = new HttpRequest("GET", "http://www.example.com", {});
        return fetchHttpClient(request)
            .then((response: HttpResponse) => {
                assert.deepStrictEqual(response.request, request);
                assert.strictEqual(response.statusCode, 200);
                assert(response.headers);
                assert.strictEqual(response.headers.get("accept-ranges"), "bytes");
                assert.strictEqual(response.headers.get("connection"), "close");
                assert.strictEqual(response.headers.get("content-encoding"), "gzip");
                assert.strictEqual(response.headers.get("content-length"), "606");
                assert.strictEqual(response.headers.get("content-type"), "text/html");
                assert.strictEqual(response.headers.get("vary"), "Accept-Encoding");

                return response.bodyAsText();
            })
            .then((responseBody?: string) => {
                assert(responseBody);
                
                const expectedResponseBody: string =
`<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        
    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 50px;
        background-color: #fff;
        border-radius: 1em;
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        body {
            background-color: #fff;
        }
        div {
            width: auto;
            margin: 0 auto;
            border-radius: 0;
            padding: 1em;
        }
    }
    </style>    
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is established to be used for illustrative examples in documents. You may use this
    domain in examples without prior coordination or asking for permission.</p>
    <p><a href="http://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>
`;
                assert.strictEqual(responseBody, expectedResponseBody);
            });
    });
});