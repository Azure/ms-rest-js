// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a ByteArray.
 */
const byteArraySpec: TypeSpec<string, Buffer> = {
  specType: "ByteArray",

  serialize(propertyPath: PropertyPath, value: Buffer, options: SerializationOptions): string {
    let result: string;

    const anyValue: any = value;
    if (!value || !anyValue.constructor || typeof anyValue.constructor.isBuffer !== "function" || !anyValue.constructor.isBuffer(value)) {
      failSerializeTypeCheck(options, propertyPath, value, "a Buffer");
      result = anyValue;
    } else {
      result = value.toString("base64");
    }

    return result;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): Buffer {
    let result: Buffer;

    if (typeof value !== "string") {
      failDeserializeTypeCheck(options, propertyPath, value, "a string");
      result = value as any;
    } else {
      result = Buffer.from(value, "base64");
    }

    return result;
  }
};

export default byteArraySpec;