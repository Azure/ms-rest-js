// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, log } from "./serializationOptions";
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";

export interface ObjectType {
  [key: string]: any;
}

/**
 * A type specification that describes how to validate and serialize an object.
 */
const objectSpec: TypeSpec<ObjectType, ObjectType> = {
  specType: "object",

  serialize(propertyPath: PropertyPath, value: ObjectType, options: SerializationOptions): ObjectType {
    if (typeof value !== "object" || Array.isArray(value)) {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "an object");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "an object"));
      }
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: ObjectType, options: SerializationOptions): ObjectType {
    if (typeof value !== "object" || Array.isArray(value)) {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "an object");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "an object"));
      }
    }
    return value;
  }
};

export default objectSpec;