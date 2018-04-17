// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, log } from "./serializationOptions";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

/**
 * A type specification that describes how to validate and serialize a number.
 */
const numberSpec: TypeSpec<number, number> = {
  specType: "number",

  serialize(propertyPath: PropertyPath, value: number, options: SerializationOptions): number {
    let result: number;
    if (typeof value !== "number") {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a number");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, `a number`));
      }

      result = value as any;
    } else {
      result = value;
    }
    return result;
  },

  deserialize(propertyPath: PropertyPath, value: number, options: SerializationOptions): number {
    let result: number;
    if (typeof value !== "number") {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a number");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, `a number`));
      }

      result = value as any;
    } else {
      result = value;
    }
    return result;
  }
};

export default numberSpec;