// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck, SerializationOutputType } from "./serializationOptions";
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

  deserialize(propertyPath: PropertyPath, value: boolean | string, options: SerializationOptions): boolean {
    if (typeof value === "string" && options.outputType === SerializationOutputType.XML) {
      if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      }
    }

    if (typeof value !== "boolean") {
      failDeserializeTypeCheck(options, propertyPath, value, "a boolean");
    }
    return value as boolean;
  }
};

export default booleanSpec;
