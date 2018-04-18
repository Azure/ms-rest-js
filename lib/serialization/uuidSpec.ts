// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { isValidUuid } from "../util/utils";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a UUID.
 */
const uuidSpec: TypeSpec<string, string> = {
  specType: "UUID",

  serialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): string {
    if (typeof value !== "string" || !isValidUuid(value)) {
      failSerializeTypeCheck(options, propertyPath, value, "a UUID string");
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): string {
    if (typeof value !== "string" || !isValidUuid(value)) {
      failDeserializeTypeCheck(options, propertyPath, value, "a UUID string");
    }
    return value;
  }
};

export default uuidSpec;