// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { assert } from "chai";
import { HttpClient } from "../lib/httpClient";
import { QueryCollectionFormat } from "../lib/queryCollectionFormat";
import { DictionaryMapper, MapperType, Serializer, Mapper } from "../lib/serializer";
import {
  serializeRequestBody,
  ServiceClient,
  getOperationArgumentValueFromParameterPath,
} from "../lib/serviceClient";
import { WebResourceLike, WebResource } from "../lib/webResource";
import {
  OperationArguments,
  HttpHeaders,
  deserializationPolicy,
  RestResponse,
  isNode,
} from "../lib/msRest";
import { ParameterPath } from "../lib/operationParameter";

describe("ServiceClient", function () {
  it("should serialize headerCollectionPrefix", async function () {
    const expected = {
      "foo-bar-alpha": "hello",
      "foo-bar-beta": "world",
      unrelated: "42",
    };

    let request: WebResourceLike;
    const client = new ServiceClient(undefined, {
      httpClient: {
        sendRequest: (req) => {
          request = req;
          return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
        },
      },
      requestPolicyFactories: [],
    });

    await client.sendOperationRequest(
      {
        metadata: {
          alpha: "hello",
          beta: "world",
        },
        unrelated: 42,
      },
      {
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        serializer: new Serializer(),
        headerParameters: [
          {
            parameterPath: "metadata",
            mapper: {
              serializedName: "metadata",
              type: {
                name: "Dictionary",
                value: {
                  type: {
                    name: "String",
                  },
                },
              },
              headerCollectionPrefix: "foo-bar-",
            } as DictionaryMapper,
          },
          {
            parameterPath: "unrelated",
            mapper: {
              serializedName: "unrelated",
              type: {
                name: "Number",
              },
            },
          },
        ],
        responses: {
          200: {},
        },
      }
    );

    assert(request!);
    assert.deepEqual(request!.headers.toJson(), expected);
  });

  it("responses should not show the _response property when serializing", async function () {
    let request: WebResourceLike;
    const client = new ServiceClient(undefined, {
      httpClient: {
        sendRequest: (req) => {
          request = req;
          return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
        },
      },
      requestPolicyFactories: [],
    });

    const response = await client.sendOperationRequest(
      {},
      {
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        serializer: new Serializer(),
        headerParameters: [],
        responses: {
          200: {},
        },
      }
    );

    assert(request!);
    assert.strictEqual(JSON.stringify(response), "{}");
  });

  it("should serialize collection:csv query parameters", async function () {
    await testSendOperationRequest(["1", "2", "3"], QueryCollectionFormat.Csv, false, "?q=1,2,3");
  });

  it("should serialize collection:csv query parameters with commas & skipEncoding true", async function () {
    await testSendOperationRequest(
      ["1,2", "3,4", "5"],
      QueryCollectionFormat.Csv,
      true,
      "?q=1,2,3,4,5"
    );
  });

  it("should serialize collection:csv query parameters with commas", async function () {
    await testSendOperationRequest(
      ["1,2", "3,4", "5"],
      QueryCollectionFormat.Csv,
      false,
      "?q=1%2C2,3%2C4,5"
    );
  });

  it("should serialize collection:csv query parameters with undefined and null", async function () {
    await testSendOperationRequest(
      ["1,2", undefined, "5"],
      QueryCollectionFormat.Csv,
      false,
      "?q=1%2C2,,5"
    );
    await testSendOperationRequest(
      /* tslint:disable-next-line:no-null-keyword */
      ["1,2", null, "5"],
      QueryCollectionFormat.Csv,
      false,
      "?q=1%2C2,,5"
    );
  });

  it("should serialize collection:tsv query parameters with undefined and null", async function () {
    await testSendOperationRequest(
      ["1,2", undefined, "5"],
      QueryCollectionFormat.Tsv,
      false,
      "?q=1%2C2%09%095"
    );
    await testSendOperationRequest(
      /* tslint:disable-next-line:no-null-keyword */
      ["1,2", null, "5"],
      QueryCollectionFormat.Tsv,
      false,
      "?q=1%2C2%09%095"
    );
    await testSendOperationRequest(
      ["1,2", "3", "5"],
      QueryCollectionFormat.Tsv,
      false,
      "?q=1%2C2%093%095"
    );
  });

  it("should serialize collection:ssv query parameters with undefined and null", async function () {
    await testSendOperationRequest(
      ["1,2", undefined, "5"],
      QueryCollectionFormat.Ssv,
      false,
      "?q=1%2C2%20%205"
    );
    await testSendOperationRequest(
      /* tslint:disable-next-line:no-null-keyword */
      ["1,2", null, "5"],
      QueryCollectionFormat.Ssv,
      false,
      "?q=1%2C2%20%205"
    );
    await testSendOperationRequest(
      ["1,2", "3", "5"],
      QueryCollectionFormat.Ssv,
      false,
      "?q=1%2C2%203%205"
    );
  });

  it("should serialize collection:multi query parameters", async function () {
    await testSendOperationRequest(
      ["1", "2", "3"],
      QueryCollectionFormat.Multi,
      false,
      "?q=1&q=2&q=3"
    );
    await testSendOperationRequest(
      ["1,2", "3,4", "5"],
      QueryCollectionFormat.Multi,
      false,
      "?q=1%2C2&q=3%2C4&q=5"
    );
    await testSendOperationRequest(
      ["1,2", "3,4", "5"],
      QueryCollectionFormat.Multi,
      true,
      "?q=1,2&q=3,4&q=5"
    );
  });

  it("should apply withCredentials to requests", async function () {
    let request: WebResourceLike;
    const httpClient: HttpClient = {
      sendRequest: (req) => {
        request = req;
        return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
      },
    };

    const client1 = new ServiceClient(undefined, {
      httpClient,
      requestPolicyFactories: () => [],
    });
    await client1.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: { 200: {} },
      }
    );

    assert.strictEqual(request!.withCredentials, false);

    const client2 = new ServiceClient(undefined, {
      httpClient,
      requestPolicyFactories: [],
      withCredentials: true,
    });
    await client2.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: { 200: {} },
      }
    );
    assert.strictEqual(request!.withCredentials, true);
  });

  it("The behavior of baseUri on ServiceClient children classes should be predictable", async function () {
    const httpClient: HttpClient = {
      sendRequest: (request) => {
        return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
      },
    };

    const scope = "https://original-scope.xyz";

    class ServiceClientChildren extends ServiceClient {
      getBaseUri(): string | undefined {
        return this.baseUri;
      }
    }

    let receivedScope: string | string[] = "";

    const client = new ServiceClientChildren(
      {
        async getToken(_receivedScope) {
          receivedScope = _receivedScope;
          return {
            token: "token",
            expiresOnTimestamp: Date.now(),
          };
        },
      },
      {
        httpClient,
        baseUri: scope,
      }
    );

    const res = await client.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: {
          200: {
            bodyMapper: {
              type: {
                name: "Sequence",
                element: {
                  type: {
                    name: "Number",
                  },
                },
              },
            },
          },
        },
      }
    );

    assert.strictEqual(res._response.status, 200);

    assert.strictEqual(
      receivedScope,
      `${scope}/.default`,
      "The baseUri passed through the options should determine the scope used on getToken"
    );
    assert.strictEqual(
      client.getBaseUri(),
      scope,
      "The baseUri passed through the options should be assigned as the protected baseUri"
    );
  });

  it("should deserialize response bodies", async function () {
    let request: WebResourceLike;
    const httpClient: HttpClient = {
      sendRequest: (req) => {
        request = req;
        return Promise.resolve({
          request,
          status: 200,
          headers: new HttpHeaders(),
          bodyAsText: "[1,2,3]",
        });
      },
    };

    const client1 = new ServiceClient(undefined, {
      httpClient,
      requestPolicyFactories: [deserializationPolicy()],
    });

    const res = await client1.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: {
          200: {
            bodyMapper: {
              type: {
                name: "Sequence",
                element: {
                  type: {
                    name: "Number",
                  },
                },
              },
            },
          },
        },
      }
    );

    assert.strictEqual(res._response.status, 200);
    assert.deepStrictEqual(res.slice(), [1, 2, 3]);
  });

  it("should deserialize response bodies with undefined array", async function () {
    let request: WebResourceLike;
    const httpClient: HttpClient = {
      sendRequest: (req) => {
        request = req;
        return Promise.resolve({
          request,
          status: 200,
          headers: new HttpHeaders(),
          bodyAsText: JSON.stringify({ nextLink: "mockLink" }),
        });
      },
    };

    const client1 = new ServiceClient(undefined, {
      httpClient,
      requestPolicyFactories: [deserializationPolicy()],
    });

    const res = (await client1.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: {
          "200": {
            bodyMapper: {
              type: {
                name: "Composite",
                modelProperties: {
                  value: {
                    serializedName: "",
                    type: {
                      name: "Sequence",
                      element: {
                        type: { name: "String" },
                      },
                    },
                  },
                  nextLink: {
                    serializedName: "nextLink",
                    type: { name: "String" },
                  },
                },
              },
            },
          },
          default: {
            bodyMapper: {
              serializedName: "ErrorResponse",
              type: {
                name: "Composite",
                className: "ErrorResponse",
                modelProperties: {
                  code: { serializedName: "code", type: { name: "String" } },
                  message: {
                    serializedName: "message",
                    type: { name: "String" },
                  },
                },
              },
            },
          },
        },
      }
    )) as any;

    assert.strictEqual(res._response.status, 200);
    assert.deepStrictEqual(res.nextLink, "mockLink");
    assert.deepStrictEqual(res, []);
  });

  it("should use userAgent header name value from options", async function () {
    const httpClient: HttpClient = {
      sendRequest: (request: WebResourceLike) => {
        return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
      },
    };

    const client1 = new ServiceClient(undefined, {
      httpClient,
      userAgentHeaderName: "my-user-agent-key",
      userAgent: "blah blah",
    });

    const response: RestResponse = await client1.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: {},
      }
    );

    assert.strictEqual(response._response.status, 200);
    assert.strictEqual(response._response.request.headers.get("my-user-agent-key"), "blah blah");
  });

  it("should use userAgent header name function from options", async function () {
    const httpClient: HttpClient = {
      sendRequest: (request: WebResourceLike) => {
        return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
      },
    };

    const client1 = new ServiceClient(undefined, {
      httpClient,
      userAgentHeaderName: () => "my-user-agent-key-2",
      userAgent: "blah blah",
    });

    const response: RestResponse = await client1.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: {},
      }
    );

    assert.strictEqual(response._response.status, 200);
    assert.strictEqual(response._response.request.headers.get("my-user-agent-key-2"), "blah blah");
  });

  it("should use userAgent string from options", async function () {
    const httpClient: HttpClient = {
      sendRequest: (request: WebResourceLike) => {
        return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
      },
    };

    const client1 = new ServiceClient(undefined, {
      httpClient,
      userAgent: "blah blah",
    });

    const response: RestResponse = await client1.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: {},
      }
    );

    assert.strictEqual(response._response.status, 200);
    assert.strictEqual(
      response._response.request.headers.get(isNode ? "user-agent" : "x-ms-command-name"),
      "blah blah"
    );
  });

  it("should use userAgent function from options that appends to defaultUserAgent", async function () {
    const httpClient: HttpClient = {
      sendRequest: (request: WebResourceLike) => {
        return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
      },
    };

    const client1 = new ServiceClient(undefined, {
      httpClient,
      userAgent: (defaultUserAgent: string) => `${defaultUserAgent}/blah blah`,
    });

    const response: RestResponse = await client1.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: {},
      }
    );

    assert.strictEqual(response._response.status, 200);
    const userAgentHeaderValue: string | undefined = response._response.request.headers.get(
      isNode ? "user-agent" : "x-ms-command-name"
    );
    assert(userAgentHeaderValue);
    assert(userAgentHeaderValue!.startsWith("ms-rest-js/"));
    assert(userAgentHeaderValue!.endsWith("/blah blah"));
  });

  it("should use userAgent function from options that ignores defaultUserAgent", async function () {
    const httpClient: HttpClient = {
      sendRequest: (request: WebResourceLike) => {
        return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
      },
    };

    const client1 = new ServiceClient(undefined, {
      httpClient,
      userAgent: () => `blah blah 2`,
    });

    const response: RestResponse = await client1.sendOperationRequest(
      {},
      {
        serializer: new Serializer(),
        httpMethod: "GET",
        baseUrl: "httpbin.org",
        responses: {},
      }
    );

    assert.strictEqual(response._response.status, 200);
    assert.strictEqual(
      response._response.request.headers.get(isNode ? "user-agent" : "x-ms-command-name"),
      "blah blah 2"
    );
  });

  describe("serializeRequestBody()", () => {
    it("should serialize a JSON String request body", () => {
      const httpRequest = new WebResource();
      serializeRequestBody(
        new ServiceClient(),
        httpRequest,
        {
          bodyArg: "body value",
        },
        {
          httpMethod: "POST",
          requestBody: {
            parameterPath: "bodyArg",
            mapper: {
              required: true,
              serializedName: "bodyArg",
              type: {
                name: MapperType.String,
              },
            },
          },
          responses: { 200: {} },
          serializer: new Serializer(),
        }
      );
      assert.strictEqual(httpRequest.body, `"body value"`);
    });

    it("should serialize a JSON ByteArray request body", () => {
      const httpRequest = new WebResource();
      serializeRequestBody(
        new ServiceClient(),
        httpRequest,
        {
          bodyArg: stringToByteArray("Javascript"),
        },
        {
          httpMethod: "POST",
          requestBody: {
            parameterPath: "bodyArg",
            mapper: {
              required: true,
              serializedName: "bodyArg",
              type: {
                name: MapperType.ByteArray,
              },
            },
          },
          responses: { 200: {} },
          serializer: new Serializer(),
        }
      );
      assert.strictEqual(httpRequest.body, `"SmF2YXNjcmlwdA=="`);
    });

    it("should serialize a JSON Stream request body", () => {
      const httpRequest = new WebResource();
      serializeRequestBody(
        new ServiceClient(),
        httpRequest,
        {
          bodyArg: "body value",
        },
        {
          httpMethod: "POST",
          requestBody: {
            parameterPath: "bodyArg",
            mapper: {
              required: true,
              serializedName: "bodyArg",
              type: {
                name: MapperType.Stream,
              },
            },
          },
          responses: { 200: {} },
          serializer: new Serializer(),
        }
      );
      assert.strictEqual(httpRequest.body, "body value");
    });

    it("should serialize an XML String request body", () => {
      const httpRequest = new WebResource();
      serializeRequestBody(
        new ServiceClient(),
        httpRequest,
        {
          bodyArg: "body value",
        },
        {
          httpMethod: "POST",
          requestBody: {
            parameterPath: "bodyArg",
            mapper: {
              required: true,
              serializedName: "bodyArg",
              type: {
                name: MapperType.String,
              },
            },
          },
          responses: { 200: {} },
          serializer: new Serializer(),
          isXML: true,
        }
      );
      assert.strictEqual(
        httpRequest.body,
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><bodyArg>body value</bodyArg>`
      );
    });

    it("should serialize an XML ByteArray request body", () => {
      const httpRequest = new WebResource();
      serializeRequestBody(
        new ServiceClient(),
        httpRequest,
        {
          bodyArg: stringToByteArray("Javascript"),
        },
        {
          httpMethod: "POST",
          requestBody: {
            parameterPath: "bodyArg",
            mapper: {
              required: true,
              serializedName: "bodyArg",
              type: {
                name: MapperType.ByteArray,
              },
            },
          },
          responses: { 200: {} },
          serializer: new Serializer(),
          isXML: true,
        }
      );
      assert.strictEqual(
        httpRequest.body,
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><bodyArg>SmF2YXNjcmlwdA==</bodyArg>`
      );
    });

    it("should serialize an XML Stream request body", () => {
      const httpRequest = new WebResource();
      serializeRequestBody(
        new ServiceClient(),
        httpRequest,
        {
          bodyArg: "body value",
        },
        {
          httpMethod: "POST",
          requestBody: {
            parameterPath: "bodyArg",
            mapper: {
              required: true,
              serializedName: "bodyArg",
              type: {
                name: MapperType.Stream,
              },
            },
          },
          responses: { 200: {} },
          serializer: new Serializer(),
          isXML: true,
        }
      );
      assert.strictEqual(httpRequest.body, "body value");
    });
  });

  describe("getOperationArgumentValueFromParameterPath()", () => {
    it("should return undefined when the parameter path isn't found in the operation arguments or service client", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {};
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, undefined);
    });

    it("should return undefined when the parameter path is found in the operation arguments but is undefined and doesn't have a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {
        myParameter: undefined,
      };
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, undefined);
    });

    it("should return null when the parameter path is null in the operation arguments but is undefined and doesn't have a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {
        // tslint:disable-next-line:no-null-keyword
        myParameter: null,
      };
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      // tslint:disable-next-line:no-null-keyword
      assert.strictEqual(parameterValue, null);
    });

    it("should return the operation argument value when the parameter path is found in the operation arguments", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {
        myParameter: 20,
      };
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 20);
    });

    it("should return the options operation argument value when the parameter path is found in the optional operation arguments", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {
        options: {
          myParameter: 1,
        },
      };
      const parameterPath: ParameterPath = ["options", "myParameter"];
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 1);
    });

    it("should return the service client value when the parameter path is found in the service client", () => {
      const serviceClient = new ServiceClient();
      (serviceClient as any)["myParameter"] = 21;
      const operationArguments: OperationArguments = {};
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 21);
    });

    it("should return the operation argument value when the parameter path is found in both the operation arguments and the service client", () => {
      const serviceClient = new ServiceClient();
      (serviceClient as any)["myParameter"] = 21;
      const operationArguments: OperationArguments = {
        myParameter: 22,
      };
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 22);
    });

    it("should return the default value when it is a constant and the parameter path doesn't exist in other places", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {};
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        isConstant: true,
        defaultValue: 1,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 1);
    });

    it("should return the default value when it is a constant and the parameter path exists in other places", () => {
      const serviceClient = new ServiceClient();
      (serviceClient as any)["myParameter"] = 1;
      const operationArguments: OperationArguments = {
        myParameter: 2,
        options: {
          myParameter: 3,
        },
      };
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        isConstant: true,
        defaultValue: 4,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 4);
    });

    it("should return undefined when the parameter path isn't found in the operation arguments or the service client, the parameter is optional, and it has a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {};
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        defaultValue: 21,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, undefined);
    });

    it("should return the default value when the parameter path isn't found in the operation arguments or the service client, the parameter is required, and it has a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {};
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        defaultValue: 21,
        required: true,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 21);
    });

    it("should return the default value when the parameter path is partially found in the operation arguments, the parameter is required, and it has a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {
        myParameter: {
          differentProperty: "hello",
        },
      };
      const parameterPath: ParameterPath = ["myParameter", "myProperty"];
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        defaultValue: 21,
        required: true,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 21);
    });

    it("should return undefined when the parameter path is partially found in the operation arguments, the parameter is optional, and it has a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {
        myParameter: {
          differentProperty: "hello",
        },
      };
      const parameterPath: ParameterPath = ["myParameter", "myProperty"];
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        defaultValue: 21,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, undefined);
    });

    it("should return the default value when the parameter path is not found in the options operation arguments and it has a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {};
      const parameterPath: ParameterPath = ["options", "myParameter"];
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        defaultValue: 21,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, 21);
    });

    it("should return undefined when the parameter path is not found as a property on a parameter within the options operation arguments and it has a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {};
      const parameterPath: ParameterPath = ["options", "myParameter", "myProperty"];
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        defaultValue: 21,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      assert.strictEqual(parameterValue, undefined);
    });

    it("should return null when the parameter path is null in the operation arguments but is undefined and it has a default value", () => {
      const serviceClient = new ServiceClient();
      const operationArguments: OperationArguments = {
        // tslint:disable-next-line:no-null-keyword
        myParameter: null,
      };
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        defaultValue: 2,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      // tslint:disable-next-line:no-null-keyword
      assert.strictEqual(parameterValue, null);
    });

    it("should return the service client value when the parameter path is found in the service client and it has a default value", () => {
      const serviceClient = new ServiceClient();
      (serviceClient as any)["myParameter"] = 5;
      const operationArguments: OperationArguments = {};
      const parameterPath: ParameterPath = "myParameter";
      const parameterMapper: Mapper = {
        serializedName: "my-parameter",
        defaultValue: 2,
        type: {
          name: MapperType.Number,
        },
      };
      const parameterValue: any = getOperationArgumentValueFromParameterPath(
        serviceClient,
        operationArguments,
        parameterPath,
        parameterMapper,
        new Serializer()
      );
      // tslint:disable-next-line:no-null-keyword
      assert.strictEqual(parameterValue, 5);
    });
  });
});

function stringToByteArray(str: string): Uint8Array {
  if (typeof Buffer === "function" && isNode) {
    return Buffer.from(str, "utf-8");
  } else {
    return new TextEncoder().encode(str);
  }
}

async function testSendOperationRequest(
  queryValue: any,
  queryCollectionFormat: QueryCollectionFormat,
  skipEncodingParameter: boolean,
  expected: string
) {
  let request: WebResourceLike;
  const client = new ServiceClient(undefined, {
    httpClient: {
      sendRequest: (req) => {
        request = req;
        return Promise.resolve({ request, status: 200, headers: new HttpHeaders() });
      },
    },
    requestPolicyFactories: () => [],
  });

  await client.sendOperationRequest(
    {
      q: queryValue,
    },
    {
      httpMethod: "GET",
      baseUrl: "httpbin.org",
      serializer: new Serializer(),
      queryParameters: [
        {
          collectionFormat: queryCollectionFormat,
          skipEncoding: skipEncodingParameter,
          parameterPath: "q",
          mapper: {
            serializedName: "q",
            type: {
              name: "Sequence",
              element: {
                type: {
                  name: "String",
                },
                serializedName: "q",
              },
            },
          },
        },
      ],
      responses: {
        200: {},
      },
    }
  );

  assert(request!);
  assert(request!.url.endsWith(expected), `"${request!.url}" does not end with "${expected}"`);
}
