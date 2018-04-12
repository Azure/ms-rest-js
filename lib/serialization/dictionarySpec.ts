// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SerializationOptions } from "./serializationOptions";

/**
 * A type specification that describes how to validate and serialize a Dictionary of values.
 */
export default function dictionarySpec<TSerializedValue, TDeserializedValue>(valueSpec: TypeSpec<TSerializedValue, TDeserializedValue>): TypeSpec<{ [key: string]: TSerializedValue }, { [key: string]: TDeserializedValue }> {
  return {
    typeName: `Dictionary<${valueSpec.typeName}>`,

    serialize(propertyPath: string[], value: { [key: string]: TDeserializedValue }, options: SerializationOptions): { [key: string]: TSerializedValue } {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
      }

      const serializedDictionary: { [key: string]: TSerializedValue } = {};
      for (const key in value) {
        serializedDictionary[key] = valueSpec.serialize(propertyPath.concat([key]), value[key], options);
      }

      return serializedDictionary;
    },

    deserialize(propertyPath: string[], value: { [key: string]: TSerializedValue }, options: SerializationOptions): { [key: string]: TDeserializedValue } {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
      }

      const deserializedDictionary: { [key: string]: TDeserializedValue } = {};
      for (const key in value) {
        deserializedDictionary[key] = valueSpec.deserialize(propertyPath.concat([key]), value[key], options);
      }

      return deserializedDictionary;
    }
  };
}