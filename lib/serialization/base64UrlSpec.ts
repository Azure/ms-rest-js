// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a Base64Url encoded ByteArray.
 */
const byteArraySpec: TypeSpec<string> = {
  typeName: "Base64Url",

  serialize(propertyPath: string[], value: any): string {
    if (!value || typeof value.constructor.isBuffer !== "function" || !value.constructor.isBuffer(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a Buffer"));
    }

    const result: string = value.toString("base64");

    let trimmedResultLength = result.length;
    while ((trimmedResultLength - 1) >= 0 && result[trimmedResultLength - 1] === "=") {
      --trimmedResultLength;
    }

    return result.substr(0, trimmedResultLength).replace(/\+/g, "-").replace(/\//g, "_");
  }
};

export default byteArraySpec;