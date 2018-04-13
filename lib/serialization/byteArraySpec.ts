// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SerializationOptions } from "./serializationOptions";
import { SpecPath } from "./specPath";

/**
 * A type specification that describes how to validate and serialize a ByteArray.
 */
const byteArraySpec: TypeSpec<string, Buffer> = {
  specType: "ByteArray",

  serialize(propertyPath: SpecPath, value: Buffer, options: SerializationOptions): string {
    let result: string;

    const anyValue: any = value;
    if (!value || !anyValue.constructor || typeof anyValue.constructor.isBuffer !== "function" || !anyValue.constructor.isBuffer(value)) {
      if (options && options.serializationStrictTypeChecking) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "a Buffer"));
      } else {
        result = anyValue;
      }
    } else {
      result = value.toString("base64");
    }

    return result;
  },

  deserialize(propertyPath: SpecPath, value: string, options: SerializationOptions): Buffer {
    let result: Buffer;

    if (typeof value !== "string") {
      if (options && options.deserializationStrictTypeChecking) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "a string"));
      } else {
        result = <any>value;
      }
    } else {
      result = Buffer.from(value, "base64");
    }

    return result;
  }
};

export default byteArraySpec;