// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as isStream from "is-stream";
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { PropertyPath } from "./propertyPath";

/**
 * A type specification that describes how to validate and serialize a Stream.
 */
const streamSpec: TypeSpec<any, any> = {
  specType: "Stream",

  serialize(propertyPath: PropertyPath, value: any): any {
    if (!isStream(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a Stream"));
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: any): any {
    if (!isStream(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a Stream"));
    }
    return value;
  },
};

export default streamSpec;