// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";
import { decodeByteArray, encodeByteArray } from "../util/base64";

/**
 * A type specification that describes how to validate and serialize a ByteArray.
 */
const byteArraySpec: TypeSpec<string, Uint8Array> = {
  specType: "ByteArray",

  serialize(propertyPath: PropertyPath, value: Uint8Array, options: SerializationOptions): string {
    let result: string;

    if (!(value instanceof Uint8Array)) {
      failSerializeTypeCheck(options, propertyPath, value, "a Uint8Array");
      result = value;
    } else {
      result = encodeByteArray(value);
    }

    return result;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): Uint8Array {
    let result: Uint8Array;

    if (typeof value !== "string") {
      failDeserializeTypeCheck(options, propertyPath, value, "a string");
      result = value as any;
    } else {
      result = decodeByteArray(value);
    }

    return result;
  }
};

export default byteArraySpec;
