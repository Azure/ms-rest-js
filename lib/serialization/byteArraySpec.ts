// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";
import { SerializationOptions, log } from "./serializationOptions";
import { PropertyPath } from "./propertyPath";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

/**
 * A type specification that describes how to validate and serialize a ByteArray.
 */
const byteArraySpec: TypeSpec<string, Buffer> = {
  specType: "ByteArray",

  serialize(propertyPath: PropertyPath, value: Buffer, options: SerializationOptions): string {
    let result: string;

    const anyValue: any = value;
    if (!value || !anyValue.constructor || typeof anyValue.constructor.isBuffer !== "function" || !anyValue.constructor.isBuffer(value)) {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a Buffer");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "a Buffer"));
        result = anyValue;
      }
    } else {
      result = value.toString("base64");
    }

    return result;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): Buffer {
    let result: Buffer;

    if (typeof value !== "string") {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, "a string");
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "a string"));
        result = value as any;
      }
    } else {
      result = Buffer.from(value, "base64");
    }

    return result;
  }
};

export default byteArraySpec;