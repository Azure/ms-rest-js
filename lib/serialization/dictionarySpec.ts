// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck, resolveValueSpec } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

export interface DictionaryType<T> {
  [key: string]: T;
}

export interface DictionaryTypeSpec<TSerializedValue, TDeserializedValue> extends TypeSpec<DictionaryType<TSerializedValue>, DictionaryType<TDeserializedValue>> {
  /**
   * The TypeSpec that defines each value in this DictionaryTypeSpec.
   */
  valueSpec: TypeSpec<TSerializedValue, TDeserializedValue> | string;
}

/**
 * A type specification that describes how to validate and serialize a Dictionary of values.
 */
export function dictionarySpec<TSerializedValue, TDeserializedValue>(valueSpec: TypeSpec<TSerializedValue, TDeserializedValue> | string): DictionaryTypeSpec<TSerializedValue, TDeserializedValue> {
  return {
    specType: `Dictionary`,

    valueSpec: valueSpec,

    serialize(propertyPath: PropertyPath, value: DictionaryType<TDeserializedValue>, options: SerializationOptions): DictionaryType<TSerializedValue> {
      let result: DictionaryType<TSerializedValue>;
      if (typeof value !== "object" || Array.isArray(value)) {
        failSerializeTypeCheck(options, propertyPath, value, "an object");
        result = value as any;
      } else {
        const valueTypeSpec: TypeSpec<TSerializedValue, TDeserializedValue> | undefined = resolveValueSpec(options, propertyPath, valueSpec, true);
        if (!valueTypeSpec) {
          result = value as any;
        } else {
          result = {};
          for (const key in value) {
            result[key] = valueTypeSpec.serialize(propertyPath.concat([key]), value[key], options);
          }
        }
      }

      return result;
    },

    deserialize(propertyPath: PropertyPath, value: DictionaryType<TSerializedValue>, options: SerializationOptions): DictionaryType<TDeserializedValue> {
      let result: DictionaryType<TDeserializedValue>;
      if (typeof value !== "object" || Array.isArray(value)) {
        failDeserializeTypeCheck(options, propertyPath, value, "an object");
        result = value as any;
      } else {
        const valueTypeSpec: TypeSpec<TSerializedValue, TDeserializedValue> | undefined = resolveValueSpec(options, propertyPath, valueSpec, false);
        if (!valueTypeSpec) {
          result = value as any;
        } else {
          result = {};
          for (const key in value) {
            result[key] = valueTypeSpec.deserialize(propertyPath.concat([key]), value[key], options);
          }
        }
      }
      return result;
    }
  };
}
