// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

export interface ObjectType {
  [key: string]: any;
}

/**
 * A type specification that describes how to validate and serialize an object.
 */
const objectSpec: TypeSpec<ObjectType, ObjectType> = {
  specType: "object",

  serialize(propertyPath: PropertyPath, value: ObjectType, options: SerializationOptions): ObjectType {
    if (typeof value !== "object" || Array.isArray(value)) {
      failSerializeTypeCheck(options, propertyPath, value, "an object");
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: ObjectType, options: SerializationOptions): ObjectType {
    if (typeof value !== "object" || Array.isArray(value)) {
      failDeserializeTypeCheck(options, propertyPath, value, "an object");
    }
    return value;
  }
};

export default objectSpec;