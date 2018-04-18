// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a string.
 */
const stringSpec: TypeSpec<string, string> = {
  specType: "string",

  serialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): string {
    if (typeof value !== "string") {
      failSerializeTypeCheck(options, propertyPath, value, "a string");
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): string {
    if (typeof value !== "string") {
      failDeserializeTypeCheck(options, propertyPath, value, "a string");
    }
    return value;
  }
};

export default stringSpec;