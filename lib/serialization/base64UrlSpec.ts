// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a Base64Url encoded ByteArray.
 */
const base64UrlSpec: TypeSpec<string, Buffer> = {
  typeName: "Base64Url",

  serialize(propertyPath: string[], value: Buffer): string {
    if (!value || typeof (value as any).constructor.isBuffer !== "function" || !(value as any).constructor.isBuffer(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a Buffer"));
    }

    const result: string = value.toString("base64");

    let trimmedResultLength = result.length;
    while ((trimmedResultLength - 1) >= 0 && result[trimmedResultLength - 1] === "=") {
      --trimmedResultLength;
    }

    return result.substr(0, trimmedResultLength).replace(/\+/g, "-").replace(/\//g, "_");
  },

  deserialize(propertyPath: string[], value: string): Buffer {
    if (!value || typeof value !== "string") {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a string."));
    }

    // Base64Url to Base64.
    value = value.replace(/\-/g, "+").replace(/\_/g, "/");

    // Base64 to Buffer.
    return Buffer.from(value, "base64");
  }
};

export default base64UrlSpec;