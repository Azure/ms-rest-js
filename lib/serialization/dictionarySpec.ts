// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, log } from "./serializationOptions";
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";

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
        if (options && options.serializationStrictTypeChecking) {
          const errorMessage: string = createValidationErrorMessage(propertyPath, value, "an object");
          log(options, HttpPipelineLogLevel.ERROR, errorMessage);
          throw new Error(errorMessage);
        } else {
          log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "an object"));
        }

        result = value as any;
      } else {
        let valueTypeSpec: TypeSpec<TSerializedValue, TDeserializedValue>;
        if (typeof valueSpec === "string") {
          if (!options.compositeSpecDictionary || !options.compositeSpecDictionary[valueSpec]) {
            const errorMessage = `Missing composite specification entry in composite type dictionary for type named "${valueSpec}" at property ${propertyPath}.`;
            log(options, HttpPipelineLogLevel.ERROR, errorMessage);
            throw new Error(errorMessage);
          }
          valueTypeSpec = options.compositeSpecDictionary[valueSpec] as TypeSpec<TSerializedValue, TDeserializedValue>;
        } else {
          valueTypeSpec = valueSpec;
        }

        result = {};
        for (const key in value) {
          result[key] = valueTypeSpec.serialize(propertyPath.concat([key]), value[key], options);
        }
      }

      return result;
    },

    deserialize(propertyPath: PropertyPath, value: DictionaryType<TSerializedValue>, options: SerializationOptions): DictionaryType<TDeserializedValue> {
      let result: DictionaryType<TDeserializedValue>;
      if (typeof value !== "object" || Array.isArray(value)) {
        if (options && options.deserializationStrictTypeChecking) {
          const errorMessage: string = createValidationErrorMessage(propertyPath, value, "an object");
          log(options, HttpPipelineLogLevel.ERROR, errorMessage);
          throw new Error(errorMessage);
        } else {
          log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "an object"));
        }

        result = value as any;
      } else {
        let valueTypeSpec: TypeSpec<TSerializedValue, TDeserializedValue>;
        if (typeof valueSpec === "string") {
          if (!options.compositeSpecDictionary || !options.compositeSpecDictionary[valueSpec]) {
            const errorMessage = `Missing composite specification entry in composite type dictionary for type named "${valueSpec}" at property ${propertyPath}.`;
            log(options, HttpPipelineLogLevel.ERROR, errorMessage);
            throw new Error(errorMessage);
          }
          valueTypeSpec = options.compositeSpecDictionary[valueSpec] as TypeSpec<TSerializedValue, TDeserializedValue>;
        } else {
          valueTypeSpec = valueSpec;
        }

        result = {};
        for (const key in value) {
          result[key] = valueTypeSpec.deserialize(propertyPath.concat([key]), value[key], options);
        }
      }
      return result;
    }
  };
}