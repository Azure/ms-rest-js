import { TypeSpec } from "./serialization/typeSpec";
import { HttpMethod } from "./httpMethod";

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * A specification that describes the details of an Operation.
 */
export interface OperationSpec<TDeserializedRequestBody, TDeserializedResponseBody> {
  /**
   * The HttpMethod that will be used for the outgoing request.
   */
  requestHttpMethod: HttpMethod;

  /**
   * The specification that describes how to serialize the body of the outgoing request.
   */
  requestBodySpec?: TypeSpec<any, TDeserializedRequestBody>;

  /**
   * The specification that describes the body of the incoming response.
   */
  responseBodySpec?: TypeSpec<any, TDeserializedResponseBody>;
}