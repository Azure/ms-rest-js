// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";
import { decodeByteArray, encodeByteArray } from "../util/base64";

/**
 * A type specification that describes how to validate and serialize a Base64Url encoded ByteArray.
 */
const base64UrlSpec: TypeSpec<string, Uint8Array> = {
  specType: "Base64Url",

  serialize(propertyPath: PropertyPath, value: Uint8Array, options: SerializationOptions): string {
    let result: string;

    if (!(value instanceof Uint8Array)) {
      failSerializeTypeCheck(options, propertyPath, value, "a Uint8Array");
      result = value;
    } else {
      const base64String = encodeByteArray(value);

      let trimmedResultLength = base64String.length;
      while ((trimmedResultLength - 1) >= 0 && base64String[trimmedResultLength - 1] === "=") {
        --trimmedResultLength;
      }

      result = base64String.substr(0, trimmedResultLength).replace(/\+/g, "-").replace(/\//g, "_");
    }

    return result;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): Uint8Array {
    let result: Uint8Array;

    if (!value || typeof value !== "string") {
      failDeserializeTypeCheck(options, propertyPath, value, "a string");
      result = value as any;
    } else {
      // Base64Url to Base64.
      value = value.replace(/\-/g, "+").replace(/\_/g, "/");

      // Base64 to Uint8Array.
      result = decodeByteArray(value);
    }

    return result;
  }
};

export default base64UrlSpec;
