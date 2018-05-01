// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import { PropertyPath } from "../serialization/propertyPath";
import { SerializationOptions, SerializationOutputType } from "../serialization/serializationOptions";
import { TypeSpec } from "../serialization/typeSpec";
import { InMemoryHttpResponse } from "../inMemoryHttpResponse";
import { parseXML, stringifyXML } from "../util/utils";
import { SequenceTypeSpec } from "../msRest";

const defaultSerializationOptions: SerializationOptions = {
  outputType: SerializationOutputType.JSON,

  serializationStrictTypeChecking: true,
  serializationStrictAllowedProperties: true,
  serializationStrictMissingProperties: true,

  deserializationStrictTypeChecking: false,
  deserializationStrictAllowedProperties: false,
  deserializationStrictMissingProperties: false
};

/**
 * Get a RequestPolicyFactory that will serialize HTTP request contents and deserialize HTTP
 * response contents using the OperationSpecs provided in the requests and responses.
 */
export function serializationPolicy(serializationOptions?: SerializationOptions): RequestPolicyFactory {
  return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
    return new SerializationPolicy({ ...defaultSerializationOptions, ...serializationOptions }, nextPolicy, options);
  };
}

class SerializationPolicy extends BaseRequestPolicy {
  constructor(private readonly _serializationOptions: SerializationOptions, nextPolicy: RequestPolicy, requestPolicyOptions: RequestPolicyOptions) {
    super(nextPolicy, requestPolicyOptions);
  }

  async send(request: HttpRequest): Promise<HttpResponse> {
    const requestBodySpec: TypeSpec<any, any> | undefined = request.operationSpec && request.operationSpec.requestBodySpec;
    if (requestBodySpec) {
      let serializedBody = requestBodySpec.serialize(new PropertyPath([]), request.body, this._serializationOptions);
      if (this._serializationOptions.outputType === SerializationOutputType.XML) {
        // Handle XML root list
        if (requestBodySpec.specType === "Sequence") {
          const sequenceSpec = requestBodySpec as SequenceTypeSpec<any, any>;
          if (!sequenceSpec.xmlElementName) {
            throw new Error(`sequenceSpec must have xmlElementName when used as a root model spec:\n${JSON.stringify(requestBodySpec, undefined, 2)}`);
          }
          serializedBody = { [sequenceSpec.xmlElementName!]: serializedBody };
        }
        request.serializedBody = stringifyXML(serializedBody, { rootName: requestBodySpec.xmlRootName });
      } else {
        request.serializedBody = JSON.stringify(serializedBody);
      }
    }

    let response: HttpResponse = await this._nextPolicy.send(request);

    const responseBodySpec: TypeSpec<any, any> | undefined = request.operationSpec && request.operationSpec.responseBodySpec;
    if (responseBodySpec) {
      const responseTextBody: string | undefined = await response.textBody();
      if (responseTextBody != undefined) {
        let responseBody: any;
        const responseContentType = response.headers.get("Content-Type");
        if (responseContentType === "application/xml" || responseContentType === "text/xml") {
          responseBody = await parseXML(responseTextBody);

          // Handle XML root list
          if (responseBodySpec.specType === "Sequence") {
            const sequenceSpec = responseBodySpec as SequenceTypeSpec<any, any>;
            if (!sequenceSpec.xmlElementName) {
              throw new Error(`sequenceSpec must have xmlElementName when used as a root model spec:\n${JSON.stringify(responseBodySpec, undefined, 2)}`);
            }
            responseBody = responseBody && responseBody[sequenceSpec.xmlElementName];
          }
        } else {
          responseBody = JSON.parse(responseTextBody);
        }
        const responseDeserializedBody = responseBodySpec.deserialize(new PropertyPath([]), responseBody, this._serializationOptions);
        response = new InMemoryHttpResponse(response.request, response.statusCode, response.headers, responseTextBody, responseDeserializedBody);
      }
    }

    return response;
  }
}
