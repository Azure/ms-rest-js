// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as isStream from "is-stream";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, log } from "./serializationOptions";
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a Stream.
 */
const streamSpec: TypeSpec<any, any> = {
  specType: "Stream",

  serialize(propertyPath: PropertyPath, value: any, options: SerializationOptions): any {
    if (!isStream(value)) {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a Stream");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "a Stream"));
      }
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: any, options: SerializationOptions): any {
    if (!isStream(value)) {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a Stream");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "a Stream"));
      }
    }
    return value;
  },
};

export default streamSpec;