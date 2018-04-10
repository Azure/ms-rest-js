// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { HttpMethod } from "../../lib/httpMethod";
import { HttpRequest } from "../../lib/httpRequest";
import { HttpResponse } from "../../lib/httpResponse";
import { InMemoryHttpResponse } from "../../lib/inMemoryHttpResponse";
import { logPolicy } from "../../lib/policies/logPolicy";
import { RequestPolicy } from "../../lib/requestPolicy";
import { RequestPolicyFactory } from "../../lib/requestPolicyFactory";
import { RequestPolicyOptions } from "../../lib/requestPolicyOptions";
import { HttpHeaders } from "../../lib/httpHeaders";

describe("logPolicy", () => {
    it("logs requests and responses with no body", async () => {
        const logs: string[] = [];
        const policyFactory: RequestPolicyFactory = logPolicy((message: string) => logs.push(message));

        const nextPolicy: RequestPolicy = {
            send: (request: HttpRequest) => {
                return Promise.resolve(new InMemoryHttpResponse(request, 200, {}));
            }
        };

        const policy: RequestPolicy = policyFactory(nextPolicy, new RequestPolicyOptions());
        const request = new HttpRequest(HttpMethod.GET, "https://spam.com", {});
        const response: HttpResponse = await policy.send(request);

        assert.deepStrictEqual(request, new HttpRequest(HttpMethod.GET, "https://spam.com", {}));
        assert.deepStrictEqual(response.request, new HttpRequest(HttpMethod.GET, "https://spam.com", {}));
        assert.deepStrictEqual(response.statusCode, 200);
        assert.deepStrictEqual(response.headers, new HttpHeaders());

        assert.deepStrictEqual(logs, [
            ">> Request: {\n  \"httpMethod\": \"GET\",\n  \"url\": \"https://spam.com\",\n  \"_headers\": {\n    \"_headersMap\": {}\n  }\n}",
            ">> Response Status Code: 200",
            ">> Response Body: undefined"
        ]);
    });
});