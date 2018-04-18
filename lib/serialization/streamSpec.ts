// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as isStream from "is-stream";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a Stream.
 */
const streamSpec: TypeSpec<any, any> = {
  specType: "Stream",

  serialize(propertyPath: PropertyPath, value: any, options: SerializationOptions): any {
    if (!isStream(value)) {
      failSerializeTypeCheck(options, propertyPath, value, "a Stream");
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: any, options: SerializationOptions): any {
    if (!isStream(value)) {
      failDeserializeTypeCheck(options, propertyPath, value, "a Stream");
    }
    return value;
  },
};

export default streamSpec;