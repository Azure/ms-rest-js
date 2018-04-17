// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";
import { SerializationOptions, log } from "./serializationOptions";
import { PropertyPath } from "./propertyPath";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

/**
 * A type specification that describes how to validate and serialize a boolean.
 */
const booleanSpec: TypeSpec<boolean, boolean> = {
  specType: "boolean",

  serialize(propertyPath: PropertyPath, value: boolean, options: SerializationOptions): boolean {
    if (typeof value !== "boolean") {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a boolean");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "a boolean"));
      }
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: boolean, options: SerializationOptions): boolean {
    if (typeof value !== "boolean") {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a boolean");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "a boolean"));
      }
    }
    return value;
  }
};

export default booleanSpec;