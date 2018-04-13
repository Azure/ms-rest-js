// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SerializationOptions } from "./serializationOptions";
import { SpecPath } from "./specPath";

/**
 * A type specification that describes how to validate and serialize a Base64Url encoded ByteArray.
 */
const base64UrlSpec: TypeSpec<string, Buffer> = {
  specType: "Base64Url",

  serialize(propertyPath: SpecPath, value: Buffer, options: SerializationOptions): string {
    let result: string;

    const anyValue: any = value;
    if (!anyValue || !anyValue.constructor || typeof anyValue.constructor.isBuffer !== "function" || !anyValue.constructor.isBuffer(value)) {
      if (options && options.serializationStrictTypeChecking) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "a Buffer"));
      }
      result = anyValue;
    } else {
      const base64String: string = value.toString("base64");

      let trimmedResultLength = base64String.length;
      while ((trimmedResultLength - 1) >= 0 && base64String[trimmedResultLength - 1] === "=") {
        --trimmedResultLength;
      }

      result = base64String.substr(0, trimmedResultLength).replace(/\+/g, "-").replace(/\//g, "_");
    }

    return result;
  },

  deserialize(propertyPath: SpecPath, value: string, options: SerializationOptions): Buffer {
    let result: Buffer;

    if (!value || typeof value !== "string") {
      if (options && options.deserializationStrictTypeChecking) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "a string"));
      }

      result = <any>value;
    } else {
      // Base64Url to Base64.
      value = value.replace(/\-/g, "+").replace(/\_/g, "/");

      // Base64 to Buffer.
      result = Buffer.from(value, "base64");
    }

    return result;
  }
};

export default base64UrlSpec;