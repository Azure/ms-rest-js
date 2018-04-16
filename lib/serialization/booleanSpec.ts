// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SerializationOptions } from "./serializationOptions";
import { SpecPath } from "./specPath";

/**
 * A type specification that describes how to validate and serialize a boolean.
 */
const booleanSpec: TypeSpec<boolean, boolean> = {
  specType: "boolean",

  serialize(propertyPath: SpecPath, value: boolean, options: SerializationOptions): boolean {
    if (options && options.serializationStrictTypeChecking) {
      if (typeof value !== "boolean") {
        throw new Error(createValidationErrorMessage(propertyPath, value, "a boolean"));
      }
    }
    return value;
  },

  deserialize(propertyPath: SpecPath, value: boolean, options: SerializationOptions): boolean {
    if (options && options.deserializationStrictTypeChecking) {
      if (typeof value !== "boolean") {
        throw new Error(createValidationErrorMessage(propertyPath, value, "a boolean"));
      }
    }
    return value;
  }
};

export default booleanSpec;