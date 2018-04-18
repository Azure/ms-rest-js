// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a number.
 */
const numberSpec: TypeSpec<number, number> = {
  specType: "number",

  serialize(propertyPath: PropertyPath, value: number, options: SerializationOptions): number {
    if (typeof value !== "number") {
      failSerializeTypeCheck(options, propertyPath, value, "a number");
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: number, options: SerializationOptions): number {
    if (typeof value !== "number") {
      failDeserializeTypeCheck(options, propertyPath, value, "a number");
    }
    return value;
  }
};

export default numberSpec;