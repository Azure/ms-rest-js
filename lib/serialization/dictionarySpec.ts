// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { SerializationOptions } from "./serializationOptions";
import { PropertyPath } from "./propertyPath";
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

export interface DictionaryType<T> {
  [key: string]: T;
}

export interface DictionaryTypeSpec<TSerializedValue, TDeserializedValue> extends TypeSpec<DictionaryType<TSerializedValue>, DictionaryType<TDeserializedValue>> {
  /**
   * The values that are allowed for this EnumTypeSpec.
   */
  valueSpec: TypeSpec<TSerializedValue, TDeserializedValue>;
}

/**
 * A type specification that describes how to validate and serialize a Dictionary of values.
 */
export default function dictionarySpec<TSerializedValue, TDeserializedValue>(valueSpec: TypeSpec<TSerializedValue, TDeserializedValue>): DictionaryTypeSpec<TSerializedValue, TDeserializedValue> {
  return {
    specType: `Dictionary`,

    valueSpec: valueSpec,

    serialize(propertyPath: PropertyPath, value: DictionaryType<TDeserializedValue>, options: SerializationOptions): DictionaryType<TSerializedValue> {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
      }

      const serializedDictionary: { [key: string]: TSerializedValue } = {};
      for (const key in value) {
        serializedDictionary[key] = valueSpec.serialize(propertyPath.concat([key]), value[key], options);
      }

      return serializedDictionary;
    },

    deserialize(propertyPath: PropertyPath, value: DictionaryType<TSerializedValue>, options: SerializationOptions): DictionaryType<TDeserializedValue> {
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