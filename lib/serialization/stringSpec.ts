// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, log } from "./serializationOptions";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

/**
 * A type specification that describes how to validate and serialize a string.
 */
const stringSpec: TypeSpec<string, string> = {
  specType: "string",

  serialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): string {
    if (typeof value !== "string") {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a string");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "a string"));
      }
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): string {
    if (typeof value !== "string") {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a string");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "a string"));
      }
    }
    return value;
  }
};

export default stringSpec;