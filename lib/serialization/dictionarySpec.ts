// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SerializationOptions } from "./serializationOptions";

/**
 * A type specification that describes how to validate and serialize a Dictionary of values.
 */
export default function dictionarySpec<T>(valueSpec: TypeSpec<T>): TypeSpec<{ [key: string]: T }> {
  return {
    typeName: `Dictionary<${valueSpec.typeName}>`,

    serialize(propertyPath: string[], value: any, options: SerializationOptions): { [key: string]: T } {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
      }

      const serializedDictionary: { [key: string]: T } = {};
      for (const key in value) {
        serializedDictionary[key] = valueSpec.serialize(propertyPath.concat([key]), value[key], options);
      }

      return serializedDictionary;
    }
  };
}