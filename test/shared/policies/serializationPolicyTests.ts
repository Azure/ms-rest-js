// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { HttpMethod } from "../../../lib/httpMethod";
import { HttpRequest } from "../../../lib/httpRequest";
import { HttpResponse } from "../../../lib/httpResponse";
import { InMemoryHttpResponse } from "../../../lib/inMemoryHttpResponse";
import { serializationPolicy } from "../../../lib/policies/serializationPolicy";
import { RequestPolicy } from "../../../lib/requestPolicy";
import { RequestPolicyFactory } from "../../../lib/requestPolicyFactory";
import { RequestPolicyOptions } from "../../../lib/requestPolicyOptions";
import booleanSpec from "../../../lib/serialization/booleanSpec";
import { compositeSpec } from "../../../lib/serialization/compositeSpec";
import dateSpec from "../../../lib/serialization/dateSpec";
import dateTimeRfc1123Spec from "../../../lib/serialization/dateTimeRfc1123Spec";
import numberSpec from "../../../lib/serialization/numberSpec";
import objectSpec from "../../../lib/serialization/objectSpec";
import { sequenceSpec } from "../../../lib/serialization/sequenceSpec";
import { SerializationOutputType } from "../../../lib/serialization/serializationOptions";
import stringSpec from "../../../lib/serialization/stringSpec";

describe("serializationPolicy", () => {
  it("serializes request and response bodies", async () => {
    const policyFactory: RequestPolicyFactory = serializationPolicy({ outputType: SerializationOutputType.JSON });

    const inMemoryEchoServer: RequestPolicy = {
      send: (request: HttpRequest) => {
        return Promise.resolve(new InMemoryHttpResponse(request, 200, request.headers, request.serializedBody as string));
      }
    };

    const policy: RequestPolicy = policyFactory(inMemoryEchoServer, new RequestPolicyOptions());

    const request = new HttpRequest({
      method: HttpMethod.POST,
      url: "https://spam.com",
      headers: {
        "1": "one",
        "2": "2"
      },
      body: {
        "booleanProperty": false,
        "numberProperty": 20,
        "objectProperty": { "booleanProperty": true },
        "sequenceProperty": [],
        "dateProperty": new Date("2018-10-05"),
        "dateTimeRfc1123Property": new Date("2011-10-05T14:48:00.000Z")
      },
      operationSpec: {
        requestHttpMethod: HttpMethod.GET,
        requestBodySpec: compositeSpec({
          typeName: "FakeRequestBody",
          propertySpecs: {
            "booleanProperty": {
              required: true,
              valueSpec: booleanSpec
            },
            "numberProperty": {
              required: true,
              valueSpec: numberSpec
            },
            "objectProperty": {
              required: true,
              valueSpec: objectSpec
            },
            "sequenceProperty": {
              required: true,
              valueSpec: sequenceSpec(booleanSpec)
            },
            "dateProperty": {
              required: true,
              valueSpec: dateSpec
            },
            "dateTimeRfc1123Property": {
              required: true,
              valueSpec: dateTimeRfc1123Spec
            }
          }
        }),
        responseBodySpec: compositeSpec({
          typeName: "FakeResponseBody",
          propertySpecs: {
            "booleanProperty": {
              required: true,
              valueSpec: booleanSpec
            },
            "numberProperty": {
              required: true,
              valueSpec: numberSpec
            },
            "objectProperty": {
              required: true,
              valueSpec: objectSpec
            },
            "sequenceProperty": {
              required: true,
              valueSpec: sequenceSpec(booleanSpec)
            },
            "dateProperty": {
              required: true,
              valueSpec: dateSpec
            },
            "dateTimeRfc1123Property": {
              required: true,
              valueSpec: dateTimeRfc1123Spec
            }
          }
        })
      }
    });

    const response: HttpResponse = await policy.send(request);

    assert.deepEqual(request.body, {
      "booleanProperty": false,
      "numberProperty": 20,
      "objectProperty": { "booleanProperty": true },
      "sequenceProperty": [],
      "dateProperty": new Date("2018-10-05"),
      "dateTimeRfc1123Property": new Date("2011-10-05T14:48:00.000Z")
    });
    assert.deepEqual(request.serializedBody, JSON.stringify({
      "booleanProperty": false,
      "numberProperty": 20,
      "objectProperty": { "booleanProperty": true },
      "sequenceProperty": [],
      "dateProperty": "2018-10-05",
      "dateTimeRfc1123Property": "Wed, 05 Oct 2011 14:48:00 GMT"
    }));

    assert(response instanceof InMemoryHttpResponse);
    const stringBody = await response.textBody() as string;
    assert.deepEqual(JSON.parse(stringBody), {
      "booleanProperty": false,
      "numberProperty": 20,
      "objectProperty": { "booleanProperty": true },
      "sequenceProperty": [],
      "dateProperty": "2018-10-05",
      "dateTimeRfc1123Property": "Wed, 05 Oct 2011 14:48:00 GMT"
    });
    assert.deepEqual(await response.deserializedBody(), {
      "booleanProperty": false,
      "numberProperty": 20,
      "objectProperty": { "booleanProperty": true },
      "sequenceProperty": [],
      "dateProperty": new Date("2018-10-05"),
      "dateTimeRfc1123Property": new Date("2011-10-05T14:48:00.000Z")
    });
  });

  it("[de]serializes XML request and response bodies", async () => {
    const policyFactory: RequestPolicyFactory = serializationPolicy({ outputType: SerializationOutputType.XML });

    const inMemoryEchoServer: RequestPolicy = {
      send: async (request: HttpRequest) => {
        return new InMemoryHttpResponse(request, 200, request.headers, request.serializedBody as string);
      }
    };

    const policy: RequestPolicy = policyFactory(inMemoryEchoServer, new RequestPolicyOptions());

    const bodySpec = compositeSpec({
      typeName: "Root",
      xmlRootName: "my-root",
      propertySpecs: {
        "foo": {
          xmlName: "my-foo",
          valueSpec: numberSpec
        },
        "bar": {
          valueSpec: booleanSpec
        }
      }
    });
    const expectedBody = { foo: 123, bar: true };
    const request = new HttpRequest({
      body: expectedBody,
      method: "POST",
      url: "/",
      headers: { "Content-Type": "application/xml" },

      operationSpec: {
        requestHttpMethod: HttpMethod.GET,
        requestBodySpec: bodySpec,
        responseBodySpec: bodySpec
      }
    });

    const response = await policy.send(request);
    const body = await response.deserializedBody();
    assert.deepEqual(body, expectedBody);
  });

  it("[de]serializes XML root lists", async () => {
    const policyFactory: RequestPolicyFactory = serializationPolicy({ outputType: SerializationOutputType.XML });

    const inMemoryEchoServer: RequestPolicy = {
      send: async (request: HttpRequest) => {
        return new InMemoryHttpResponse(request, 200, request.headers, request.serializedBody as string);
      }
    };

    const policy: RequestPolicy = policyFactory(inMemoryEchoServer, new RequestPolicyOptions());
    const bodySpec = sequenceSpec(stringSpec, { xmlRootName: "my-root", xmlElementName: "item" });
    const request = new HttpRequest({
      method: "POST",
      url: "/",
      headers: { "Content-Type": "application/xml" },

      operationSpec: {
        requestHttpMethod: HttpMethod.GET,
        requestBodySpec: bodySpec,
        responseBodySpec: bodySpec
      },
      body: ["foo", "bar", "baz"]
    });
    const response = await policy.send(request);
    assert.deepEqual(await response.deserializedBody(), ["foo", "bar", "baz"]);
  });

  it("ignores bodies when no bodySpec is provided", async () => {
    const policyFactory: RequestPolicyFactory = serializationPolicy();
    const inMemoryEchoServer: RequestPolicy = {
      send: async (request: HttpRequest) => {
        return new InMemoryHttpResponse(request, 200, request.headers, request.serializedBody || request.body)
      }
    };

    const policy: RequestPolicy = policyFactory(inMemoryEchoServer, new RequestPolicyOptions());
    const expectedBody = "This is my body";
    const request = new HttpRequest({
      method: "POST",
      url: "/",
      body: expectedBody
    });
    const response = await policy.send(request);
    const responseBody = await response.textBody();
    assert.strictEqual(responseBody, expectedBody);
  });
});
