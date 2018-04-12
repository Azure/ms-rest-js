// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a ByteArray.
 */
const byteArraySpec: TypeSpec<string, Buffer> = {
  typeName: "ByteArray",

  serialize(propertyPath: string[], value: Buffer): string {
    if (!value || typeof (value as any).constructor.isBuffer !== "function" || !(value as any).constructor.isBuffer(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a Buffer"));
    }
    return value.toString("base64");
  },

  deserialize(propertyPath: string[], value: string): Buffer {
    if (typeof value !== "string") {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a string"));
    }
    return Buffer.from(value, "base64");
  }
};

export default byteArraySpec;