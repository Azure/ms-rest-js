// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a boolean.
 */
const booleanSpec: TypeSpec<boolean, boolean> = {
  specType: "boolean",

  serialize(propertyPath: PropertyPath, value: boolean, options: SerializationOptions): boolean {
    if (typeof value !== "boolean") {
      failSerializeTypeCheck(options, propertyPath, value, "a boolean");
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: boolean, options: SerializationOptions): boolean {
    if (typeof value !== "boolean") {
      failDeserializeTypeCheck(options, propertyPath, value, "a boolean");
    }
    return value;
  }
};

export default booleanSpec;